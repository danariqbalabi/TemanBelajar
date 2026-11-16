from copy import deepcopy
from uuid import uuid4

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from app.demo import FOTOSINTESIS
from app.planner import validate_schedule
from app.schemas import Material


@pytest.mark.parametrize("field", ["paragraphs", "options"])
def test_material_rejects_blank_content(field):
    payload = FOTOSINTESIS.model_dump()
    item = payload["concepts" if field == "paragraphs" else "questions"][0]
    item[field][0] = "  \n "
    with pytest.raises(ValidationError):
        Material.model_validate(payload)


def test_material_rejects_options_equal_after_trimming():
    payload = FOTOSINTESIS.model_dump()
    payload["questions"][0]["options"] = ["jawaban", " jawaban "]
    with pytest.raises(ValidationError):
        Material.model_validate(payload)


def test_whitespace_only_text_chunk_does_not_crash_upload(client):
    response = client.post(
        "/v1/materials/text",
        json={
            "request_id": str(uuid4()),
            "title": "Sumber panjang",
            "text": "a" * 20000 + " " * 20000 + "akhir",
        },
    )
    assert response.status_code == 202
    sources = client.get(f"/v1/jobs/{response.json()['id']}/source").json()["sources"]
    assert [s["id"] for s in sources] == ["section-1", "section-3"]


def test_pdf_rejects_blank_title_before_processing(client):
    response = client.post(
        "/v1/materials/pdf",
        data={"request_id": str(uuid4()), "title": "   "},
        files={"file": ("source.pdf", b"%PDF-invalid", "application/pdf")},
    )
    assert response.status_code == 422
    assert response.json()["detail"] == "judul materi perlu diisi"


def test_skipped_activity_cannot_keep_dangling_dependency():
    activity = {
        "id": "later",
        "title": "Latihan",
        "status": "skipped",
        "start_at": "2026-11-17T09:00:00+07:00",
        "duration_minutes": 5,
        "prerequisites": ["deleted"],
    }
    with pytest.raises(HTTPException) as error:
        validate_schedule([activity], "Asia/Jakarta", 30)
    assert error.value.status_code == 422


def test_legacy_missing_dependency_returns_validation_error(client, store):
    activity = {
        "id": "later",
        "title": "Latihan",
        "status": "skipped",
        "locked": False,
        "start_at": "2026-11-17T09:00:00+07:00",
        "duration_minutes": 5,
        "prerequisites": ["deleted"],
    }
    store.snapshot.data["plans"]["legacy"] = {
        "id": "legacy",
        "version": 1,
        "timezone": "Asia/Jakarta",
        "daily_minutes": 30,
        "activities": [deepcopy(activity)],
        "history": {},
    }
    result = client.post(
        "/v1/plans/legacy/activities/later/status",
        json={"request_id": str(uuid4()), "expected_version": 1, "status": "active"},
    )
    assert result.status_code == 422
    assert store.snapshot.data["plans"]["legacy"]["version"] == 1

import asyncio
from uuid import uuid4

import pytest
from fastapi import HTTPException


def test_concurrent_snapshot_cannot_overwrite_committed_state(store):
    async def scenario():
        first = await store.load()
        second = await store.load()
        first.data["sessions"]["first"] = {"draft": "saved"}
        await store.save(first)
        second.data["sessions"]["second"] = {"draft": "late"}
        with pytest.raises(HTTPException) as exc:
            await store.save(second)
        assert exc.value.status_code == 409
        assert (await store.load()).data["sessions"] == {"first": {"draft": "saved"}}

    asyncio.run(scenario())


def test_retry_creation_returns_original_receipt_after_later_edits(client):
    body = {"request_id": str(uuid4()), "material_id": "demo-fotosintesis"}
    original = client.post("/v1/sessions", json=body).json()
    change = {
        "request_id": str(uuid4()),
        "expected_version": 1,
        "concept_id": "peran-cahaya",
        "paragraph": 0,
        "mode": "focus",
        "draft": "saved later",
    }
    assert client.put(f"/v1/sessions/{original['id']}", json=change).status_code == 200
    assert client.post("/v1/sessions", json=body).json() == original
    current = client.get(f"/v1/sessions/{original['id']}").json()
    assert current["draft"] == "saved later"


def test_second_user_cannot_access_first_users_material_session_or_plan(client, store):
    from conftest import MemoryStore

    from app.main import app
    from app.store import get_store

    session = client.post(
        "/v1/sessions",
        json={"request_id": str(uuid4()), "material_id": "demo-fotosintesis"},
    ).json()
    plan = client.post(
        "/v1/plans", json={"request_id": str(uuid4()), "activities": []}
    ).json()
    upload = client.post(
        "/v1/materials/text",
        json={
            "request_id": str(uuid4()),
            "title": "privat",
            "text": "Materi pribadi ini cukup panjang untuk diproses sebagai contoh sumber.",
        },
    ).json()
    second = MemoryStore()
    app.dependency_overrides[get_store] = lambda: second
    assert client.get(f"/v1/sessions/{session['id']}").status_code == 404
    assert client.get(f"/v1/plans/{plan['id']}").status_code == 404
    assert client.get(f"/v1/jobs/{upload['id']}/source").status_code == 404
    app.dependency_overrides[get_store] = lambda: store

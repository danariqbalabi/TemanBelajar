from uuid import uuid4

from fastapi import HTTPException

from app import material_processing
from app.demo import FOTOSINTESIS


def upload(client):
    body = {
        "request_id": str(uuid4()),
        "title": "Materi contoh",
        "text": "Cahaya memberikan energi bagi tumbuhan untuk melakukan fotosintesis.",
    }
    response = client.post("/v1/materials/text", json=body)
    assert response.status_code == 202
    assert client.post("/v1/materials/text", json=body).json() == response.json()
    return response.json()


def test_failed_job_keeps_source_and_can_retry(client, monkeypatch):
    job = upload(client)

    async def failed(job):
        raise HTTPException(503, "layanan sedang sibuk")

    monkeypatch.setattr(material_processing, "generate_material", failed)
    url = f"/v1/jobs/{job['id']}"
    assert client.post(url + "/process").status_code == 503
    assert client.get(url).json()["status"] == "failed"
    assert client.get(url + "/source").json()["sources"][0]["text"].startswith("Cahaya")

    async def success(job):
        material = FOTOSINTESIS.model_copy(deep=True)
        material.id = "uploaded"
        material.is_demo = False
        return material

    monkeypatch.setattr(material_processing, "generate_material", success)
    assert client.post(url + "/process").json()["status"] == "ready"
    assert client.post(url + "/process").json()["status"] == "ready"
    assert client.get("/v1/materials/uploaded").status_code == 200


def test_invalid_pdf_and_excessive_text_are_rejected(client):
    response = client.post(
        "/v1/materials/pdf",
        data={"request_id": str(uuid4()), "title": "pdf"},
        files={"file": ("fake.pdf", b"not a pdf", "application/pdf")},
    )
    assert response.status_code == 422
    assert client.get("/v1/jobs").json()["items"] == []
    response = client.post(
        "/v1/materials/text",
        json={"request_id": str(uuid4()), "title": "materi", "text": "x" * 100001},
    )
    assert response.status_code == 422

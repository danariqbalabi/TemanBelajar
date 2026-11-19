from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def request_id():
    return str(uuid4())


def create_session(client):
    response = client.post(
        "/v1/sessions",
        json={"request_id": request_id(), "material_id": "demo-fotosintesis"},
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_unauthenticated_cannot_access_learning():
    with TestClient(app) as client:
        assert client.get("/v1/materials").status_code == 401
        assert client.get("/v1/demo").status_code == 200


def test_switch_mode_preserves_progress_and_rejects_stale_write(client):
    session = create_session(client)
    body = {
        "request_id": request_id(),
        "expected_version": 1,
        "concept_id": "peran-cahaya",
        "paragraph": 1,
        "mode": "focus",
        "draft": "catatan manda",
        "status": "paused",
    }
    url = f"/v1/sessions/{session['id']}"
    first = client.put(url, json=body)
    assert first.status_code == 200
    assert first.json()["paragraph"] == 1
    assert first.json()["draft"] == "catatan manda"
    assert client.put(url, json=body).json() == first.json()
    body["request_id"] = request_id()
    assert client.put(url, json=body).status_code == 409
    assert client.get(url).json()["version"] == 2


def test_answers_are_scored_once_and_keys_hidden_until_answered(client):
    session = create_session(client)
    attempt = client.post(
        "/v1/attempts", json={"request_id": request_id(), "session_id": session["id"]}
    ).json()
    assert "correct_index" not in attempt["questions"][0]
    body = {
        "request_id": request_id(),
        "expected_version": 1,
        "question_id": "cahaya-1",
        "selected_index": 0,
    }
    url = f"/v1/attempts/{attempt['id']}/answers"
    first = client.post(url, json=body)
    assert first.status_code == 200
    assert first.json()["answers"]["cahaya-1"]["correct"] is True
    assert "correct_index" in first.json()["questions"][0]
    assert "correct_index" not in first.json()["questions"][1]
    assert client.post(url, json=body).json() == first.json()
    body["selected_index"] = 1
    assert client.post(url, json=body).status_code == 409
    assert len(client.get(f"/v1/attempts/{attempt['id']}").json()["answers"]) == 1


def test_invalid_mode_and_foreign_ids_rejected(client):
    assert client.get("/v1/materials/foreign").status_code == 404
    session = create_session(client)
    body = {
        "request_id": request_id(),
        "expected_version": 1,
        "concept_id": "peran-klorofil",
        "paragraph": 0,
        "mode": "explore",
    }
    assert client.put(f"/v1/sessions/{session['id']}", json=body).status_code == 422


def test_unfinished_attempt_resumes_across_devices_without_duplicate(client):
    session = create_session(client)
    url = f"/v1/sessions/{session['id']}/attempts/active"
    assert client.get(url).json() is None
    attempt = client.post(
        "/v1/attempts",
        json={
            "request_id": request_id(),
            "session_id": session["id"],
        },
    ).json()
    answered = client.post(
        f"/v1/attempts/{attempt['id']}/answers",
        json={
            "request_id": request_id(),
            "expected_version": 1,
            "question_id": "cahaya-1",
            "selected_index": 0,
        },
    ).json()
    resumed = client.get(url).json()
    assert resumed == answered
    second_device = client.post(
        "/v1/attempts",
        json={
            "request_id": request_id(),
            "session_id": session["id"],
        },
    ).json()
    assert second_device == resumed
    assert "correct_index" not in resumed["questions"][1]
    assert client.get("/v1/sessions/foreign/attempts/active").status_code == 404


def test_create_session_at_requested_concept(client):
    body = {
        "request_id": request_id(),
        "material_id": "demo-fotosintesis",
        "concept_id": "peran-klorofil",
        "mode": "transcript",
    }
    response = client.post("/v1/sessions", json=body)
    assert response.status_code == 201, response.text
    session = response.json()
    assert session["concept_id"] == "peran-klorofil"
    assert session["version"] == 1
    assert client.post("/v1/sessions", json=body).json()["id"] == session["id"]
    invalid = {**body, "request_id": request_id(), "mode": "explore"}
    assert client.post("/v1/sessions", json=invalid).status_code == 422


def test_manda_course_contains_analysis_of_six_sample_answers(client):
    course = "manda-pythagoras"
    materials = client.get("/v1/materials").json()["items"]
    assert any(item["id"] == course and item["question_count"] == 6 for item in materials)
    result = client.get("/v1/progress", params={"material_id": course})
    assert result.status_code == 200
    concept = result.json()["concepts"][0]
    assert concept["observed"] == {"correct": 3, "total": 6}
    assert len(concept["mistakes"]) == 3
    suggestion = client.get("/v1/recommendations", params={"material_id": course}).json()
    assert suggestion["action"] == "REVIEW"
    assert "sisi siku-siku" in suggestion["practice_focus"]
    assert client.get("/v1/sessions").json()["items"] == []


def test_new_practice_prioritizes_mistakes_and_keeps_resume_order(client):
    session = create_session(client)

    def open_attempt():
        response = client.post(
            "/v1/attempts", json={"request_id": request_id(), "session_id": session["id"]}
        )
        assert response.status_code == 201
        return response.json()

    attempt = open_attempt()
    for version, (question, choice) in enumerate(
        zip(attempt["questions"], [0, 0, 0]), start=1
    ):
        response = client.post(
            f"/v1/attempts/{attempt['id']}/answers",
            json={
                "request_id": request_id(), "expected_version": version,
                "question_id": question["id"], "selected_index": choice,
            },
        )
        assert response.status_code == 200
    retry = open_attempt()
    assert retry["question_ids"][0] == "cahaya-2"
    assert open_attempt()["id"] == retry["id"]

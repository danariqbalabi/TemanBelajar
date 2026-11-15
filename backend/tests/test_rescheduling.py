from uuid import uuid4


def rid():
    return str(uuid4())


def test_recompute_moves_pending_work_and_preserves_completed_activity(client):
    session = client.post(
        "/v1/sessions", json={"request_id": rid(), "material_id": "demo-fotosintesis"}
    ).json()
    attempt = client.post(
        "/v1/attempts", json={"request_id": rid(), "session_id": session["id"]}
    ).json()
    client.post(
        f"/v1/attempts/{attempt['id']}/answers",
        json={
            "request_id": rid(),
            "expected_version": 1,
            "question_id": "cahaya-1",
            "selected_index": 1,
        },
    )
    activities = [
        {
            "id": "read",
            "title": "Baca",
            "start_at": "2026-11-16T09:00:00+07:00",
            "duration_minutes": 10,
        },
        {
            "id": "quiz",
            "title": "Latihan",
            "start_at": "2026-11-16T09:10:00+07:00",
            "duration_minutes": 5,
        },
    ]
    plan = client.post(
        "/v1/plans",
        json={"request_id": rid(), "daily_minutes": 15, "activities": activities},
    ).json()
    url = f"/v1/plans/{plan['id']}"
    completed = client.post(
        url + "/activities/read/status",
        json={"request_id": rid(), "expected_version": 1, "status": "completed"},
    ).json()
    body = {
        "request_id": rid(),
        "expected_version": 2,
        "material_id": "demo-fotosintesis",
        "start_at": "2026-11-16T09:10:00+07:00",
    }
    response = client.post(url + "/recompute", json=body)
    assert response.status_code == 201, response.text
    proposal = response.json()
    assert "1 dari 1" in proposal["reason"]
    tasks = {a["id"]: a for a in proposal["activities"]}
    assert tasks["read"] == completed["activities"][0]
    assert tasks["quiz"]["start_at"].startswith("2026-11-17")
    review = next(a for a in proposal["activities"] if a["kind"] == "review")
    assert review["concept_id"] == "peran-cahaya"
    assert client.get(url).json()["version"] == 2
    assert client.post(url + "/recompute", json=body).json() == proposal
    accepted = client.post(
        url + f"/proposals/{proposal['id']}/accept",
        json={"request_id": rid(), "expected_version": 2},
    )
    assert accepted.status_code == 200
    assert accepted.json()["plan"]["version"] == 3


def test_activity_material_link_must_belong_to_accessible_material(client):
    response = client.post(
        "/v1/plans",
        json={
            "request_id": rid(),
            "activities": [
                {
                    "id": "read",
                    "title": "Baca",
                    "start_at": "2026-11-16T09:00:00+07:00",
                    "duration_minutes": 10,
                    "material_id": "someone-elses-material",
                    "concept_id": "private",
                }
            ],
        },
    )
    assert response.status_code == 404

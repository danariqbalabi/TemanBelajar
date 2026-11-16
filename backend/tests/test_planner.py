from copy import deepcopy
from uuid import uuid4


def rid():
    return str(uuid4())


def activity(key="read", hour="09", **kwargs):
    return {
        "id": key,
        "title": "Baca materi",
        "start_at": f"2026-11-16T{hour}:00:00+07:00",
        "duration_minutes": 10,
        **kwargs,
    }


def create(client, activities=None):
    response = client.post(
        "/v1/plans",
        json={"request_id": rid(), "activities": activities or [activity()]},
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_proposal_does_not_change_plan_until_accepted_and_retry_is_safe(client):
    plan = create(client)
    url = f"/v1/plans/{plan['id']}"
    changed = deepcopy(plan["activities"])
    changed[0]["start_at"] = "2026-11-17T09:00:00+07:00"
    response = client.post(
        url + "/proposals",
        json={
            "request_id": rid(),
            "expected_version": 1,
            "activities": changed,
            "reason": "waktu belajar dipindahkan ke besok",
        },
    )
    assert response.status_code == 201, response.text
    proposal = response.json()
    assert client.get(url).json()["activities"] == plan["activities"]
    body = {"request_id": rid(), "expected_version": 1}
    accept_url = url + f"/proposals/{proposal['id']}/accept"
    accepted = client.post(accept_url, json=body)
    assert accepted.status_code == 200
    assert client.post(accept_url, json=body).json() == accepted.json()
    assert client.get(url).json()["version"] == 2
    restored = client.post(
        url + "/restore",
        json={"request_id": rid(), "expected_version": 2, "target_version": 1},
    )
    assert restored.status_code == 200
    assert restored.json()["activities"] == plan["activities"]


def test_stale_proposal_cannot_overwrite_completed_activity(client):
    plan = create(client)
    url = f"/v1/plans/{plan['id']}"
    changed = deepcopy(plan["activities"])
    changed[0]["start_at"] = "2026-11-17T09:00:00+07:00"
    proposal = client.post(
        url + "/proposals",
        json={
            "request_id": rid(),
            "expected_version": 1,
            "activities": changed,
            "reason": "pindahkan waktu",
        },
    ).json()
    response = client.post(
        url + "/activities/read/status",
        json={"request_id": rid(), "expected_version": 1, "status": "completed"},
    )
    assert response.status_code == 200
    accept = client.post(
        url + f"/proposals/{proposal['id']}/accept",
        json={"request_id": rid(), "expected_version": 2},
    )
    assert accept.status_code == 409
    restored = client.post(
        url + "/restore",
        json={"request_id": rid(), "expected_version": 2, "target_version": 1},
    )
    assert restored.status_code == 200
    assert restored.json()["activities"][0]["status"] == "completed"


def test_capacity_overlap_timezone_and_prerequisites(client):
    for activities in [
        [activity(), activity("second")],
        [activity(duration_minutes=40)],
        [activity(prerequisites=["missing"])],
        [activity(hour="23", duration_minutes=120)],
    ]:
        response = client.post(
            "/v1/plans", json={"request_id": rid(), "activities": activities}
        )
        assert response.status_code == 422
    response = client.post(
        "/v1/plans",
        json={"request_id": rid(), "activities": [], "timezone": "invalid/zone"},
    )
    assert response.status_code == 422


def test_recommendation_matches_answer_and_time_budget(client):
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
    suggestion = client.get(
        "/v1/recommendations", params={"material_id": "demo-fotosintesis"}
    ).json()
    assert suggestion["action"] == "REVIEW"
    assert "1 dari 1" in suggestion["reason"]
    short = client.get(
        "/v1/recommendations",
        params={"material_id": "demo-fotosintesis", "available_minutes": 1},
    ).json()
    assert short["action"] == "RESCHEDULE"
    assert (
        client.get("/v1/progress", params={"material_id": "demo-fotosintesis"}).json()[
            "concepts"
        ][0]["mastery"]
        is None
    )


def test_partial_correct_practice_is_not_reported_as_finished(client, store):
    session = client.post(
        "/v1/sessions", json={"request_id": rid(), "material_id": "demo-pythagoras"}
    ).json()
    material = client.get("/v1/materials/demo-pythagoras").json()
    concept = material["concepts"][0]["id"]
    store.snapshot.data["sessions"][session["id"]]["completed_concepts"] = [concept]
    attempt = client.post(
        "/v1/attempts", json={"request_id": rid(), "session_id": session["id"]}
    ).json()
    response = client.post(
        f"/v1/attempts/{attempt['id']}/answers",
        json={
            "request_id": rid(),
            "expected_version": 1,
            "question_id": "pythagoras-1",
            "selected_index": 0,
        },
    )
    assert response.status_code == 200
    recommendation = client.get(
        "/v1/recommendations", params={"material_id": "demo-pythagoras"}
    ).json()
    assert recommendation["action"] == "PRACTICE"
    assert "belum dijawab" in recommendation["reason"]

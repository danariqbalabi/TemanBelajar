import math

from app.bkt import Parameters, estimate, predict, update
from training.train_bkt import padded, predictions


def test_bayes_update_and_prediction_match_hand_calculation():
    parameters = Parameters(initial=0.2, learn=0.1, guess=0.25, slip=0.1)
    probability = 0.2 * 0.9 + 0.8 * 0.25
    assert math.isclose(predict(0.2, parameters), probability)
    posterior = 0.2 * 0.9 / probability
    assert math.isclose(
        update(0.2, True, parameters), posterior + (1 - posterior) * 0.1
    )


def test_training_predicts_before_observation_and_resets_each_student():
    observed, values = predictions([0.2, 0.1, 0.25, 0.1], padded([[1, 1], [0]]))
    assert observed.tolist() == [1, 0, 1]
    assert math.isclose(values[0], values[1])
    assert values[2] > values[0]


def test_unsupported_skill_has_no_fabricated_mastery():
    assert estimate("biology.photosynthesis", [True] * 10)["mastery"] is None


def test_trained_model_is_used_through_learning_api(client):
    from uuid import uuid4

    session = client.post(
        "/v1/sessions",
        json={"request_id": str(uuid4()), "material_id": "demo-pythagoras"},
    ).json()
    attempt = client.post(
        "/v1/attempts", json={"request_id": str(uuid4()), "session_id": session["id"]}
    ).json()
    for number, selected in enumerate([0, 1, 2], start=1):
        result = client.post(
            f"/v1/attempts/{attempt['id']}/answers",
            json={
                "request_id": str(uuid4()),
                "expected_version": number,
                "question_id": f"pythagoras-{number}",
                "selected_index": selected,
            },
        )
        assert result.status_code == 200
    progress = client.get(
        "/v1/progress", params={"material_id": "demo-pythagoras"}
    ).json()
    concept = progress["concepts"][0]
    assert concept["observed"] == {"correct": 3, "total": 3}
    assert 0 < concept["mastery"] < 1
    assert concept["model_version"] == "bkt-assistments-pythagoras-v1"

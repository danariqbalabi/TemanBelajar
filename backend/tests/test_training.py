import csv
import hashlib
import json

import numpy as np
import pytest

from app import bkt
from training import train_bkt


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"skills": {}},
        {"version": "", "skills": {}},
        {"version": "v1", "skills": []},
        {
            "version": "v1",
            "skills": {"skill": {"parameters": {"initial": float("nan")}}},
        },
    ],
)
def test_invalid_artifact_does_not_crash_progress(tmp_path, monkeypatch, payload):
    path = tmp_path / "model.json"
    path.write_text(json.dumps(payload), encoding="utf-8")
    monkeypatch.setattr(bkt, "MODEL_PATH", path)
    bkt.artifact.cache_clear()
    try:
        assert bkt.estimate("skill", [True] * 3)["mastery"] is None
    finally:
        bkt.artifact.cache_clear()


def test_dataset_checksum_is_enforced(tmp_path):
    path = tmp_path / "changed.csv"
    path.write_text("tampered", encoding="utf-8")
    with pytest.raises(ValueError, match="checksum"):
        train_bkt.load_sequences(path)


def test_student_split_is_disjoint_deterministic_and_chronological(
    tmp_path, monkeypatch
):
    path = tmp_path / "dataset.csv"
    fields = ["skill_name", "original", "correct", "answer_type", "user_id", "order_id"]
    with path.open("w", newline="", encoding="latin-1") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for student in range(200):
            # A unique binary sequence identifies each learner without exporting IDs.
            sequence = [int(bit) for bit in f"{student:08b}"]
            for order in reversed(range(8)):
                row = dict(
                    zip(
                        fields,
                        [
                            train_bkt.SKILL_NAME,
                            "1",
                            sequence[order],
                            "choose_1",
                            str(student),
                            order,
                        ],
                    )
                )
                writer.writerow(row)
                writer.writerow(row)
    monkeypatch.setattr(
        train_bkt, "SOURCE_HASH", hashlib.sha256(path.read_bytes()).hexdigest()
    )
    splits, excluded = train_bkt.load_sequences(path)
    assert train_bkt.load_sequences(path) == (splits, excluded)
    groups = [set(map(tuple, sequences)) for sequences in splits.values()]
    assert not (groups[0] & groups[1] or groups[0] & groups[2] or groups[1] & groups[2])
    assert len(set.union(*groups)) == 200
    assert excluded["duplicate"] == 1600


def test_training_predictions_match_runtime_for_mixed_histories():
    parameters = bkt.Parameters(initial=0.2, learn=0.1, guess=0.25, slip=0.1)
    sequences = [[1, 0, 1, 1], [0, 0], [1]]
    observed, predicted = train_bkt.predictions(
        list(parameters.model_dump().values()), train_bkt.padded(sequences)
    )
    expected = []
    histories = [parameters.initial] * len(sequences)
    for column in range(4):
        for index, sequence in enumerate(sequences):
            if column < len(sequence):
                expected.append(bkt.predict(histories[index], parameters))
                histories[index] = bkt.update(
                    histories[index], bool(sequence[column]), parameters
                )
    assert len(observed) == sum(map(len, sequences))
    np.testing.assert_allclose(predicted, expected)


def test_metric_auc_handles_ties_and_single_class():
    report = train_bkt.metrics(np.array([0, 1, 0, 1]), np.full(4, 0.5))
    assert report["auc"] == 0.5
    assert report["brier"] == 0.25
    assert train_bkt.metrics(np.ones(3), np.full(3, 0.5))["auc"] is None

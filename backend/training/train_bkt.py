"""Reproducible student-disjoint training on a named ASSISTments skill.

Raw rows and learner identifiers stay in ignored data/raw. Only aggregate
metrics and fitted parameters are exported. Test rows never enter fitting or
selection. The single retained skill matches the reviewed Pythagoras fixture.
"""
import argparse
import csv
import hashlib
import json
import urllib.request
from collections import defaultdict
from pathlib import Path

import numpy as np
from scipy.optimize import minimize
from scipy.stats import rankdata

from app.bkt import Parameters

SOURCE_URL = "https://raw.githubusercontent.com/CAHLR/pyBKT-examples/fc592907f41dfa0e71742ed1d24f1f6df08e1ad1/data/as.csv"
SOURCE_HASH = "f22e3fb7872c1784ce93b0f9ebabbe0cbcac4f896fd8b4a11667b9715d77dbdc"
SKILL_NAME = "Pythagorean Theorem"
SKILL_ID = "math.pythagorean-theorem"
SEED = 20261115


def load_sequences(path: Path):
    with path.open("rb") as stream:
        checksum = hashlib.file_digest(stream, "sha256").hexdigest()
    if checksum != SOURCE_HASH:
        raise ValueError("checksum dataset berbeda dari versi yang ditetapkan")
    learners = defaultdict(list)
    seen = set()
    excluded = defaultdict(int)
    with path.open(encoding="latin-1", newline="") as stream:
        for row in csv.DictReader(stream):
            if row["skill_name"] != SKILL_NAME:
                continue
            if row["original"] != "1" or row["correct"] not in {"0", "1"} or row["answer_type"] == "open_response":
                excluded["non_original_or_invalid"] += 1
                continue
            key = (row["user_id"], row["order_id"])
            if key in seen:
                excluded["duplicate"] += 1
                continue
            seen.add(key)
            learners[row["user_id"]].append((int(row["order_id"]), int(row["correct"])))
    splits = {"train": [], "validation": [], "test": []}
    ids = {name: set() for name in splits}
    for learner, events in sorted(learners.items()):
        sequence = [correct for _, correct in sorted(events)]
        if len(sequence) < 2:
            excluded["single_event_students"] += 1
            continue
        bucket = int(hashlib.sha256(f"{SEED}:{learner}".encode()).hexdigest()[:8], 16) % 100
        name = "train" if bucket < 70 else "validation" if bucket < 85 else "test"
        splits[name].append(sequence)
        ids[name].add(learner)
    assert not (ids["train"] & ids["test"] or ids["train"] & ids["validation"] or ids["validation"] & ids["test"])
    if any(len(sequences) < 10 for sequences in splits.values()):
        raise ValueError("data siswa pada salah satu split belum cukup")
    return splits, dict(excluded)


def padded(sequences):
    values = np.full((len(sequences), max(map(len, sequences))), -1, dtype=np.int8)
    for index, sequence in enumerate(sequences):
        values[index, :len(sequence)] = sequence
    return values


def predictions(parameters, values):
    initial, learn, guess, slip = parameters
    mastery = np.full(values.shape[0], initial)
    observed = []
    predicted = []
    for column in values.T:
        active = column >= 0
        correct = column == 1
        probability = mastery * (1 - slip) + (1 - mastery) * guess
        observed.extend(column[active].tolist())
        predicted.extend(probability[active].tolist())
        posterior = np.where(correct, mastery * (1 - slip) / probability,
                             mastery * slip / (1 - probability))
        mastery = np.where(active, posterior + (1 - posterior) * learn, mastery)
    return np.asarray(observed), np.asarray(predicted)


def log_loss(observed, predicted):
    predicted = np.clip(predicted, 1e-9, 1 - 1e-9)
    return float(-np.mean(observed * np.log(predicted) + (1 - observed) * np.log(1 - predicted)))


def metrics(observed, predicted):
    positive = observed == 1
    n_positive = int(positive.sum())
    n_negative = len(observed) - n_positive
    auc = None
    if n_positive and n_negative:
        ranks = rankdata(predicted)
        auc = float((ranks[positive].sum() - n_positive * (n_positive + 1) / 2) / (n_positive * n_negative))
    return {"log_loss": log_loss(observed, predicted), "rmse": float(np.sqrt(np.mean((observed - predicted) ** 2))),
            "brier": float(np.mean((observed - predicted) ** 2)), "auc": auc, "responses": len(observed)}


def train(path: Path, output: Path):
    splits, excluded = load_sequences(path)
    matrices = {name: padded(sequences) for name, sequences in splits.items()}
    rng = np.random.default_rng(SEED)
    candidates = []
    bounds = [(0.001, 0.999), (0.0001, 0.5), (0.001, 0.45), (0.001, 0.45)]
    for run in range(5):
        initial = [rng.uniform(low, high) for low, high in bounds]
        result = minimize(lambda p: log_loss(*predictions(p, matrices["train"])), initial,
                          method="L-BFGS-B", bounds=bounds, options={"maxiter": 300})
        if result.success and np.isfinite(result.fun):
            validation = log_loss(*predictions(result.x, matrices["validation"]))
            candidates.append((validation, result.x))
        print(f"inisialisasi {run + 1}/5 selesai; konvergen={result.success}", flush=True)
    if not candidates:
        raise RuntimeError("optimasi belum konvergen")
    _, parameters = min(candidates, key=lambda item: item[0])
    params = Parameters(**dict(zip(["initial", "learn", "guess", "slip"], parameters))).model_dump()
    train_answers = np.concatenate([np.asarray(s) for s in splits["train"]])
    baseline = float(train_answers.mean())
    report = {}
    for name, matrix in matrices.items():
        observed, predicted = predictions(parameters, matrix)
        report[name] = {"students": len(splits[name]), "model": metrics(observed, predicted),
                        "baseline": metrics(observed, np.full(len(observed), baseline))}
    model = {"version": "bkt-assistments-pythagoras-v1", "seed": SEED,
             "source_url": SOURCE_URL, "source_sha256": SOURCE_HASH,
             "algorithm": "4 parameter BKT, maximum likelihood, no forgetting",
             "split": "student-disjoint sha256(seed:user_id), 70/15/15 buckets",
             "selection": "five converged starts, lowest validation log loss; untouched test students",
             "excluded": excluded, "skills": {SKILL_ID: {
                 "dataset_skill": SKILL_NAME, "parameters": params, "evaluation": report}},
             "limitations": ["evaluasi prediksi jawaban pada dataset publik, belum validasi siswa Indonesia",
                             "pemetaan kurikulum terbatas pada contoh teorema Pythagoras yang ditinjau",
                             "skor penguasaan merupakan estimasi model dan perlu kalibrasi pengguna nyata"]}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(model, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("data/raw/assistments.csv"))
    parser.add_argument("--output", type=Path, default=Path("models/bkt.json"))
    parser.add_argument("--download", action="store_true")
    args = parser.parse_args()
    if args.download and not args.data.exists():
        args.data.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(SOURCE_URL, args.data)
    train(args.data, args.output)

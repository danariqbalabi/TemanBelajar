"""Four-parameter Bayesian Knowledge Tracing, with no forgetting transition."""

import json
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "bkt.json"


class Parameters(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    initial: float = Field(gt=0, lt=1)
    learn: float = Field(ge=0, lt=1)
    guess: float = Field(gt=0, lt=0.5)
    slip: float = Field(gt=0, lt=0.5)


def predict(mastery: float, parameters: Parameters) -> float:
    return mastery * (1 - parameters.slip) + (1 - mastery) * parameters.guess


def update(mastery: float, correct: bool, parameters: Parameters) -> float:
    probability = predict(mastery, parameters)
    if correct:
        posterior = mastery * (1 - parameters.slip) / probability
    else:
        posterior = mastery * parameters.slip / (1 - probability)
    return posterior + (1 - posterior) * parameters.learn


@lru_cache
def artifact() -> dict:
    try:
        result = json.loads(MODEL_PATH.read_text(encoding="utf-8"))
        if not isinstance(result["version"], str) or not result["version"].strip():
            raise ValueError("versi model perlu diisi")
        for skill in result["skills"].values():
            Parameters.model_validate(skill["parameters"])
        return result
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        return {"skills": {}}


def estimate(skill_id: str | None, answers: list[bool]) -> dict:
    model = artifact()
    skill = model["skills"].get(skill_id)
    if skill is None or len(answers) < 3:
        return {
            "mastery": None,
            "mastery_status": "belum cukup data",
            "model_version": None,
        }
    parameters = Parameters.model_validate(skill["parameters"])
    mastery = parameters.initial
    for answer in answers:
        mastery = update(mastery, answer, parameters)
    status = "sedang berkembang"
    if mastery < 0.5:
        status = "perlu diulang"
    elif mastery >= 0.85:
        status = "siap lanjut"
    return {
        "mastery": round(mastery, 4),
        "mastery_status": status,
        "model_version": model["version"],
        "scope": "estimasi eksperimental untuk skill yang dipetakan",
    }

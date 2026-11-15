"""Public response contracts used by generated OpenAPI clients."""

from datetime import datetime
from typing import Generic, Literal, TypeVar

from pydantic import BaseModel

from app.schemas import Concept, Mode, Source

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]


class MaterialResponse(BaseModel):
    id: str
    title: str
    subject: str
    is_demo: bool
    generated_by_ai: bool
    sources: list[Source]
    concepts: list[Concept]
    question_count: int


class SessionResponse(BaseModel):
    id: str
    material_id: str
    mode: Mode
    concept_id: str
    paragraph: int
    completed_concepts: list[str]
    draft: str
    status: Literal["active", "paused", "completed"]
    version: int
    updated_at: datetime


class AnswerResponse(BaseModel):
    selected_index: int
    correct: bool
    answered_at: datetime


class QuestionResponse(BaseModel):
    id: str
    concept_id: str
    prompt: str
    options: list[str]
    source_ids: list[str]
    correct_index: int | None = None
    explanation: str | None = None


class AttemptResponse(BaseModel):
    id: str
    session_id: str
    material_id: str
    question_ids: list[str]
    answers: dict[str, AnswerResponse]
    version: int
    status: Literal["active", "completed"]
    created_at: datetime
    questions: list[QuestionResponse]


class JobResponse(BaseModel):
    id: str
    title: str
    status: Literal["queued", "processing", "failed", "ready"]
    stage: str
    created_at: datetime
    updated_at: datetime
    error: str | None
    material_id: str | None


class EstimateResponse(BaseModel):
    mastery: float | None
    mastery_status: str
    model_version: str | None
    scope: str | None = None


class Observation(BaseModel):
    correct: int
    total: int


class ConceptProgress(EstimateResponse):
    id: str
    title: str
    observed: Observation


class ProgressResponse(BaseModel):
    material_id: str
    is_demo: bool
    concepts: list[ConceptProgress]


class Alternative(BaseModel):
    action: Literal["SWITCH"]
    mode: Mode
    reason: str


class RecommendationResponse(BaseModel):
    action: Literal["REVIEW", "PRACTICE", "ADVANCE", "RESCHEDULE"]
    material_id: str
    concept_id: str
    estimated_minutes: int
    reason: str
    alternatives: list[Alternative]
    requires_plan_review: bool
    title: str | None = None
    estimate: EstimateResponse | None = None

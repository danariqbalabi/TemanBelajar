from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

Mode = Literal["standard", "reading", "focus", "explore", "transcript"]
Paragraph = Annotated[str, Field(min_length=1, max_length=10000)]
Option = Annotated[str, Field(min_length=1, max_length=2000)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Mutation(Input):
    request_id: UUID


class Source(Input):
    id: str = Field(min_length=1, max_length=80)
    label: str = Field(min_length=1, max_length=120)
    text: str = Field(min_length=1, max_length=30000)


class Concept(Input):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=160)
    paragraphs: list[Paragraph] = Field(min_length=1, max_length=20)
    source_ids: list[str] = Field(min_length=1)
    prerequisites: list[str] = Field(default_factory=list)
    estimated_minutes: int = Field(ge=1, le=60)
    skill_id: str | None = None
    diagram_description: str | None = None
    transcript: str | None = None


class Question(Input):
    id: str = Field(min_length=1, max_length=80)
    concept_id: str
    prompt: str = Field(min_length=1, max_length=2000)
    options: list[Option] = Field(min_length=2, max_length=6)
    correct_index: int = Field(ge=0)
    explanation: str = Field(min_length=1, max_length=3000)
    source_ids: list[str] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_answer(self):
        if self.correct_index >= len(self.options) or len(set(self.options)) != len(
            self.options
        ):
            raise ValueError("pilihan jawaban harus unik dan kunci harus tersedia")
        return self


class Material(Input):
    id: str
    title: str = Field(min_length=1, max_length=200)
    subject: str = Field(min_length=1, max_length=80)
    is_demo: bool = False
    generated_by_ai: bool = False
    sources: list[Source] = Field(min_length=1, max_length=100)
    concepts: list[Concept] = Field(min_length=1, max_length=30)
    questions: list[Question] = Field(min_length=1, max_length=60)

    @model_validator(mode="after")
    def validate_references(self):
        sources = {item.id for item in self.sources}
        concepts = {item.id for item in self.concepts}
        if len(sources) != len(self.sources) or len(concepts) != len(self.concepts):
            raise ValueError("id sumber dan konsep harus unik")
        if len({q.id for q in self.questions}) != len(self.questions):
            raise ValueError("id soal harus unik")
        seen = set()
        for concept in self.concepts:
            if (
                not set(concept.source_ids) <= sources
                or not set(concept.prerequisites) <= seen
            ):
                raise ValueError("sumber atau urutan prasyarat konsep tidak valid")
            seen.add(concept.id)
        for question in self.questions:
            if (
                question.concept_id not in concepts
                or not set(question.source_ids) <= sources
            ):
                raise ValueError("rujukan soal tidak valid")
        if {q.concept_id for q in self.questions} != concepts:
            raise ValueError("setiap konsep perlu memiliki latihan")
        return self


class SessionCreate(Mutation):
    material_id: str
    mode: Mode = "standard"


class SessionUpdate(Mutation):
    expected_version: int = Field(ge=1)
    concept_id: str
    paragraph: int = Field(ge=0)
    mode: Mode
    status: Literal["active", "paused", "completed"] = "active"
    completed_concepts: list[str] = Field(default_factory=list, max_length=30)
    draft: str = Field(default="", max_length=3000)


class AttemptCreate(Mutation):
    session_id: str
    concept_id: str | None = None


class AnswerInput(Mutation):
    expected_version: int = Field(ge=1)
    question_id: str
    selected_index: int = Field(ge=0, le=5)

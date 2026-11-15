from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.demo import DEMO_MATERIALS
from app.responses import AttemptResponse, MaterialResponse, Page, SessionResponse
from app.schemas import (
    AnswerInput,
    AttemptCreate,
    Material,
    SessionCreate,
    SessionUpdate,
)
from app.store import StoreDep, commit, find_item, replay, require_revision

router = APIRouter(prefix="/v1", tags=["belajar"])


def now() -> str:
    return datetime.now(UTC).isoformat()


def get_material(data: dict, material_id: str) -> Material:
    if material_id in DEMO_MATERIALS:
        return DEMO_MATERIALS[material_id]
    return Material.model_validate(find_item(data["materials"], material_id, "materi"))


def public_material(material: Material) -> dict:
    result = material.model_dump(exclude={"questions"})
    result["question_count"] = len(material.questions)
    return result


def modes_for(concept) -> list[str]:
    modes = ["standard", "reading", "focus"]
    if concept.diagram_description:
        modes.append("explore")
    if concept.transcript:
        modes.append("transcript")
    return modes


@router.get("/demo")
def demo_catalog():
    return {
        "display_name": "Manda",
        "is_demo": True,
        "materials": [public_material(m) for m in DEMO_MATERIALS.values()],
    }


@router.get("/materials", response_model=Page[MaterialResponse])
async def materials(store: StoreDep):
    snapshot = await store.load()
    own = [Material.model_validate(m) for m in snapshot.data["materials"].values()]
    return {"items": [public_material(m) for m in [*DEMO_MATERIALS.values(), *own]]}


@router.get("/materials/{material_id}", response_model=MaterialResponse)
async def material_detail(material_id: str, store: StoreDep):
    snapshot = await store.load()
    return public_material(get_material(snapshot.data, material_id))


@router.post("/sessions", status_code=201, response_model=SessionResponse)
async def create_session(body: SessionCreate, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    previous = replay(snapshot, str(body.request_id), "session.create", payload)
    if previous is not None:
        return previous
    material = get_material(snapshot.data, body.material_id)
    concept = material.concepts[0]
    if body.mode not in modes_for(concept):
        raise HTTPException(422, "format belum tersedia pada konsep ini")
    session = {
        "id": str(uuid4()),
        "material_id": material.id,
        "mode": body.mode,
        "concept_id": concept.id,
        "paragraph": 0,
        "completed_concepts": [],
        "draft": "",
        "status": "active",
        "version": 1,
        "updated_at": now(),
    }
    snapshot.data["sessions"][session["id"]] = session
    return await commit(
        store, snapshot, str(body.request_id), "session.create", payload, session
    )


@router.get("/sessions", response_model=Page[SessionResponse])
async def sessions(store: StoreDep):
    snapshot = await store.load()
    return {
        "items": sorted(
            snapshot.data["sessions"].values(),
            key=lambda s: s["updated_at"],
            reverse=True,
        )
    }


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def session_detail(session_id: str, store: StoreDep):
    snapshot = await store.load()
    return find_item(snapshot.data["sessions"], session_id, "sesi")


@router.put("/sessions/{session_id}", response_model=SessionResponse)
async def update_session(session_id: str, body: SessionUpdate, store: StoreDep):
    snapshot = await store.load()
    operation = f"session.update:{session_id}"
    payload = body.model_dump(mode="json")
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    session = find_item(snapshot.data["sessions"], session_id, "sesi")
    require_revision(session["version"], body.expected_version)
    material = get_material(snapshot.data, session["material_id"])
    concepts = {c.id: c for c in material.concepts}
    if (
        body.concept_id not in concepts
        or not set(body.completed_concepts) <= concepts.keys()
    ):
        raise HTTPException(422, "konsep tidak ada dalam materi ini")
    concept = concepts[body.concept_id]
    if body.paragraph >= len(concept.paragraphs) or body.mode not in modes_for(concept):
        raise HTTPException(422, "posisi atau format belajar tidak tersedia")
    completed = set(session["completed_concepts"]) | set(body.completed_concepts)
    if body.status == "completed" and completed != concepts.keys():
        raise HTTPException(422, "masih ada konsep yang belum selesai")
    session.update(body.model_dump(exclude={"request_id", "expected_version"}))
    session.update(
        completed_concepts=sorted(completed),
        version=session["version"] + 1,
        updated_at=now(),
    )
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, session.copy()
    )


def public_attempt(attempt: dict, material: Material) -> dict:
    questions = {q.id: q for q in material.questions}
    result = {**attempt, "questions": []}
    for question_id in attempt["question_ids"]:
        question = questions[question_id]
        fields = {"correct_index", "explanation"}
        if question_id in attempt["answers"]:
            fields = set()
        result["questions"].append(question.model_dump(exclude=fields))
    return result


@router.post(
    "/attempts",
    status_code=201,
    response_model=AttemptResponse,
    response_model_exclude_none=True,
)
async def create_attempt(body: AttemptCreate, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    previous = replay(snapshot, str(body.request_id), "attempt.create", payload)
    if previous is not None:
        return previous
    session = find_item(snapshot.data["sessions"], body.session_id, "sesi")
    material = get_material(snapshot.data, session["material_id"])
    questions = [
        q.id
        for q in material.questions
        if body.concept_id is None or q.concept_id == body.concept_id
    ]
    if not questions:
        raise HTTPException(422, "soal untuk konsep ini belum tersedia")
    attempt = {
        "id": str(uuid4()),
        "session_id": body.session_id,
        "material_id": material.id,
        "question_ids": questions,
        "answers": {},
        "version": 1,
        "status": "active",
        "created_at": now(),
    }
    snapshot.data["attempts"][attempt["id"]] = attempt
    result = public_attempt(attempt, material)
    return await commit(
        store, snapshot, str(body.request_id), "attempt.create", payload, result
    )


@router.get(
    "/attempts/{attempt_id}",
    response_model=AttemptResponse,
    response_model_exclude_none=True,
)
async def attempt_detail(attempt_id: str, store: StoreDep):
    snapshot = await store.load()
    attempt = find_item(snapshot.data["attempts"], attempt_id, "latihan")
    return public_attempt(attempt, get_material(snapshot.data, attempt["material_id"]))


@router.post(
    "/attempts/{attempt_id}/answers",
    response_model=AttemptResponse,
    response_model_exclude_none=True,
)
async def answer(attempt_id: str, body: AnswerInput, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    operation = f"answer:{attempt_id}"
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    attempt = find_item(snapshot.data["attempts"], attempt_id, "latihan")
    require_revision(attempt["version"], body.expected_version)
    if body.question_id not in attempt["question_ids"]:
        raise HTTPException(422, "soal tidak ada dalam latihan ini")
    if body.question_id in attempt["answers"]:
        raise HTTPException(
            409, "jawaban sudah disimpan, buat percobaan baru untuk mengulang"
        )
    unanswered = [
        qid for qid in attempt["question_ids"] if qid not in attempt["answers"]
    ]
    if body.question_id != unanswered[0]:
        raise HTTPException(422, "selesaikan soal yang sedang dibuka dulu")
    material = get_material(snapshot.data, attempt["material_id"])
    question = next(q for q in material.questions if q.id == body.question_id)
    if body.selected_index >= len(question.options):
        raise HTTPException(422, "pilihan jawaban tidak tersedia")
    attempt["answers"][question.id] = {
        "selected_index": body.selected_index,
        "correct": body.selected_index == question.correct_index,
        "answered_at": now(),
    }
    attempt["version"] += 1
    if len(attempt["answers"]) == len(attempt["question_ids"]):
        attempt["status"] = "completed"
    result = public_attempt(attempt, material)
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, result
    )

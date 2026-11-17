from typing import Annotated

from fastapi import APIRouter, Query

from app.bkt import estimate
from app.learning import get_material, modes_for
from app.responses import ProgressResponse, RecommendationResponse
from app.store import StoreDep

router = APIRouter(prefix="/v1", tags=["rekomendasi"])


def observations(data: dict, material_id: str) -> dict:
    material = get_material(data, material_id)
    questions = {q.id: q for q in material.questions}
    results = {c.id: [] for c in material.concepts}
    events = []
    for attempt in data["attempts"].values():
        if attempt["material_id"] != material_id:
            continue
        for qid, answer in attempt["answers"].items():
            events.append((answer["answered_at"], qid, answer["correct"]))
    for _, qid, correct in sorted(events):
        results[questions[qid].concept_id].append(correct)
    return results


def recommend(data: dict, material_id: str, available_minutes: int) -> dict:
    material = get_material(data, material_id)
    evidence = observations(data, material_id)
    answered_questions = {
        qid
        for attempt in data["attempts"].values()
        if attempt["material_id"] == material_id
        for qid in attempt["answers"]
    }
    completed = set()
    for session in data["sessions"].values():
        if session["material_id"] == material_id:
            completed.update(session["completed_concepts"])
    for concept in material.concepts:
        answers = evidence[concept.id]
        recent = answers[-3:]
        mastery = estimate(concept.skill_id, answers)
        if recent and not all(recent):
            action = "REVIEW"
            reason = f"{recent.count(False)} dari {len(recent)} jawaban terakhir pada konsep ini belum tepat."
        elif mastery["mastery"] is not None and mastery["mastery"] < 0.5:
            action = "REVIEW"
            reason = "Estimasi penguasaan dari riwayat latihan masih rendah. Kamu bisa meninjau contoh lagi."
        elif concept.id in completed and any(
            q.id not in answered_questions
            for q in material.questions
            if q.concept_id == concept.id
        ):
            action = "PRACTICE"
            reason = "Bacaan ini sudah selesai, tetapi masih ada soal yang belum dijawab. Lanjutkan latihan untuk mengecek pemahaman."
        elif concept.id not in completed and set(concept.prerequisites) <= completed:
            action = "ADVANCE"
            reason = "Konsep ini sesuai urutan materi dan prasyarat bacaannya sudah terpenuhi."
            if not concept.prerequisites:
                reason = "Mulai dari konsep pengantar untuk mengenali materi ini."
        else:
            continue
        duration = 5 if action == "PRACTICE" else concept.estimated_minutes
        if duration > available_minutes:
            return {
                "action": "RESCHEDULE",
                "concept_id": concept.id,
                "material_id": material_id,
                "estimated_minutes": duration,
                "reason": f"Aktivitas ini diperkirakan {duration} menit, sementara waktu tersedia {available_minutes} menit.",
                "alternatives": [],
                "requires_plan_review": True,
            }
        return {
            "action": action,
            "material_id": material_id,
            "concept_id": concept.id,
            "title": concept.title,
            "estimated_minutes": duration,
            "reason": reason,
            "estimate": mastery,
            "alternatives": [
                {
                    "action": "SWITCH",
                    "mode": mode,
                    "reason": "Format ini tersedia untuk konsep yang sama.",
                }
                for mode in modes_for(concept)
            ],
            "requires_plan_review": False,
        }
    return {
        "action": "RESCHEDULE" if available_minutes < 5 else "PRACTICE",
        "material_id": material_id,
        "concept_id": material.concepts[-1].id,
        "estimated_minutes": 5,
        "reason": "Kamu telah menuntaskan bacaan dan latihan yang tersedia. Kamu bisa mengulang latihan atau memilih materi lain.",
        "alternatives": [],
        "requires_plan_review": available_minutes < 5,
    }


@router.get("/recommendations", response_model=RecommendationResponse)
async def recommendations(
    material_id: str,
    store: StoreDep,
    available_minutes: Annotated[int, Query(ge=0, le=240)] = 15,
):
    snapshot = await store.load()
    return recommend(snapshot.data, material_id, available_minutes)


@router.get("/progress", response_model=ProgressResponse)
async def progress(material_id: str, store: StoreDep):
    snapshot = await store.load()
    material = get_material(snapshot.data, material_id)
    evidence = observations(snapshot.data, material_id)
    return {
        "material_id": material_id,
        "is_demo": material.is_demo,
        "concepts": [
            {
                "id": concept.id,
                "title": concept.title,
                "observed": {
                    "correct": sum(evidence[concept.id]),
                    "total": len(evidence[concept.id]),
                },
                **estimate(concept.skill_id, evidence[concept.id]),
            }
            for concept in material.concepts
        ],
    }

from typing import Annotated

from fastapi import APIRouter, Query

from app.bkt import estimate
from app.demo import MANDA_COURSE_ID, with_course_history
from app.learning import get_material, latest_answers, modes_for
from app.responses import ProgressResponse, RecommendationResponse
from app.store import StoreDep

router = APIRouter(prefix="/v1", tags=["rekomendasi"])


def mistakes(data: dict, material, concept_id: str) -> list[dict]:
    questions = {q.id: q for q in material.questions if q.concept_id == concept_id}
    latest = latest_answers(data, material.id, questions)
    result = []
    for qid, answer in sorted(
        latest.items(), key=lambda item: item[1]["answered_at"], reverse=True
    ):
        q = questions[qid]
        if answer["correct"]:
            continue
        result.append(
            {
                "prompt": q.prompt,
                "selected": q.options[answer["selected_index"]],
                "correct": q.options[q.correct_index],
                "explanation": q.explanation,
            }
        )
    return result[:3]


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
    data = with_course_history(data, material_id)
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
    by_concept = {
        concept.id: mistakes(data, material, concept.id)
        for concept in material.concepts
    }
    ordered_concepts = sorted(material.concepts, key=lambda c: not by_concept[c.id])
    for concept in ordered_concepts:
        answers = evidence[concept.id]
        errors = by_concept[concept.id]
        recent = answers[-3:]
        mastery = estimate(concept.skill_id, answers)
        if errors:
            action = "REVIEW"
            count = (
                f"{recent.count(False)} dari {len(recent)} jawaban terakhir belum tepat."
                if False in recent
                else "Masih ada soal yang belum dijawab tepat saat terakhir dicoba."
            )
            reason = f"{count} {errors[0]['explanation']}"
            if material_id == MANDA_COURSE_ID and len(answers) == 6:
                reason = "Manda tepat saat mencari hipotenusa, tetapi masih keliru saat mencari sisi siku-siku."
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
            "practice_focus": (
                "Soal cerita singkat: hipotenusa dan satu sisi diketahui, cari sisi siku-siku yang lain."
                if material_id == MANDA_COURSE_ID and len(answers) == 6 and errors
                else f"Ulangi soal ini dengan langkah perhitungan atau alasan yang lengkap: {errors[0]['prompt']}"
                if errors
                else None
            ),
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
    return progress_summary(snapshot.data, material_id)


def progress_summary(data: dict, material_id: str) -> dict:
    material = get_material(data, material_id)
    data = with_course_history(data, material_id)
    evidence = observations(data, material_id)
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
                "mistakes": mistakes(data, material, concept.id),
                **estimate(concept.skill_id, evidence[concept.id]),
            }
            for concept in material.concepts
        ],
    }

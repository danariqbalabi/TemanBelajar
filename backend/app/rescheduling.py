"""Build reviewable schedule proposals from current learning evidence."""

from copy import deepcopy
from datetime import datetime, timedelta
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException

from app.planner import (
    PROTECTED,
    Activity,
    ProposalResponse,
    Recompute,
    changes_between,
    preserve_protected,
    validate_schedule,
)
from app.recommendations import recommend
from app.store import StoreDep, commit, find_item, replay, require_revision

router = APIRouter(prefix="/v1/plans", tags=["rencana"])


def fit_activity(
    activity: dict,
    scheduled: list[dict],
    earliest: datetime,
    zone: ZoneInfo,
    budget: int,
) -> dict:
    result = deepcopy(activity)
    duration = timedelta(minutes=result["duration_minutes"])
    if result["duration_minutes"] > budget:
        raise HTTPException(
            422,
            "kegiatan lebih panjang dari kapasitas harian, pilih kegiatan lebih singkat",
        )
    cursor = earliest.astimezone(zone)
    anchor_time = cursor.timetz().replace(tzinfo=None)
    for _ in range(15):
        day = cursor.date()
        occupied = [
            Activity.model_validate(a) for a in scheduled if a["status"] != "skipped"
        ]
        daily = [a for a in occupied if a.start_at.astimezone(zone).date() == day]
        available = (
            sum(a.duration_minutes for a in daily) + result["duration_minutes"]
            <= budget
        )
        if available:
            for other in sorted(daily, key=lambda a: a.start_at):
                end = other.start_at + timedelta(minutes=other.duration_minutes)
                if cursor < end and cursor + duration > other.start_at:
                    cursor = end.astimezone(zone)
            if (cursor + duration - timedelta(microseconds=1)).date() == day:
                result["start_at"] = cursor.isoformat()
                return result
        cursor = datetime.combine(day + timedelta(days=1), anchor_time, tzinfo=zone)
    raise HTTPException(
        422, "belum ada waktu dalam 15 hari, atur jadwal atau durasi secara manual"
    )


@router.post("/{plan_id}/recompute", status_code=201, response_model=ProposalResponse)
async def recompute(plan_id: str, body: Recompute, store: StoreDep):
    snapshot = await store.load()
    operation = f"plan.recompute:{plan_id}"
    payload = body.model_dump(mode="json")
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    require_revision(plan["version"], body.expected_version)
    suggestion = recommend(snapshot.data, body.material_id, plan["daily_minutes"])
    if suggestion["action"] == "RESCHEDULE":
        raise HTTPException(
            422,
            "aktivitas yang disarankan melebihi kapasitas harian, atur waktu atau pilih aktivitas lebih singkat",
        )
    kind = {"REVIEW": "review", "PRACTICE": "practice", "ADVANCE": "read"}[
        suggestion["action"]
    ]
    original = [
        Activity.model_validate(a).model_dump(mode="json") for a in plan["activities"]
    ]
    scheduled = [
        a
        for a in original
        if a["locked"] or a["status"] in PROTECTED or a["status"] == "skipped"
    ]
    movable = sorted(
        [a for a in original if a not in scheduled],
        key=lambda a: datetime.fromisoformat(a["start_at"]),
    )
    existing = next(
        (
            a
            for a in movable
            if a["material_id"] == body.material_id
            and a["concept_id"] == suggestion["concept_id"]
            and a["kind"] == kind
        ),
        None,
    )
    if existing is None:
        new = Activity(
            id=str(uuid4()),
            title=suggestion.get("title", "Latihan penguatan"),
            start_at=body.start_at,
            duration_minutes=suggestion["estimated_minutes"],
            material_id=body.material_id,
            concept_id=suggestion["concept_id"],
            kind=kind,
        )
        movable.insert(0, new.model_dump(mode="json"))
    elif not existing["prerequisites"]:
        movable.remove(existing)
        movable.insert(0, existing)
    zone = ZoneInfo(plan["timezone"])
    for activity in movable:
        earliest = max(body.start_at, datetime.fromisoformat(activity["start_at"]))
        by_id = {item["id"]: item for item in scheduled}
        for dependency in activity["prerequisites"]:
            if dependency not in by_id:
                raise HTTPException(
                    422, "urutan prasyarat perlu ditinjau sebelum penjadwalan ulang"
                )
            prerequisite = by_id[dependency]
            earliest = max(
                earliest,
                datetime.fromisoformat(prerequisite["start_at"])
                + timedelta(minutes=prerequisite["duration_minutes"]),
            )
        scheduled.append(
            fit_activity(activity, scheduled, earliest, zone, plan["daily_minutes"])
        )
    scheduled.sort(key=lambda a: datetime.fromisoformat(a["start_at"]))
    if len(scheduled) > 100:
        raise HTTPException(422, "rencana sudah memuat 100 aktivitas")
    preserve_protected(original, scheduled)
    validate_schedule(scheduled, plan["timezone"], plan["daily_minutes"])
    proposal = {
        "id": str(uuid4()),
        "plan_id": plan_id,
        "base_version": plan["version"],
        "activities": scheduled,
        "reason": suggestion["reason"],
        "status": "pending",
        "changes": changes_between(original, scheduled),
    }
    snapshot.data["proposals"][proposal["id"]] = proposal
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, proposal
    )

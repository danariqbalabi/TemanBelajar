from copy import deepcopy
from datetime import datetime, timedelta
from typing import Literal
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException
from pydantic import AwareDatetime, BaseModel, Field, field_validator

from app.learning import get_material, now
from app.profiles import ProfileInput
from app.responses import Page
from app.schemas import Input, Mutation
from app.store import StoreDep, commit, find_item, replay, require_revision

router = APIRouter(prefix="/v1/plans", tags=["rencana"])
PROTECTED = {"completed", "active"}


class Activity(Input):
    id: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=160)
    start_at: AwareDatetime
    duration_minutes: int = Field(ge=1, le=240)
    status: Literal["pending", "active", "completed", "skipped"] = "pending"
    locked: bool = False
    prerequisites: list[str] = Field(default_factory=list, max_length=100)


class PlanCreate(Mutation):
    timezone: str = "Asia/Jakarta"
    daily_minutes: int = Field(default=30, ge=5, le=240)
    activities: list[Activity] = Field(max_length=100)

    @field_validator("timezone")
    @classmethod
    def valid_timezone(cls, value):
        return ProfileInput.valid_timezone(value)


class ProposalCreate(Mutation):
    expected_version: int = Field(ge=1)
    activities: list[Activity] = Field(max_length=100)
    reason: str = Field(min_length=1, max_length=1000)


class PlanAction(Mutation):
    expected_version: int = Field(ge=1)


class ActivityStatus(PlanAction):
    status: Literal["pending", "active", "completed", "skipped"]


class Restore(PlanAction):
    target_version: int = Field(ge=1)


class ScheduleInput(Input):
    material_id: str
    start_at: AwareDatetime
    available_minutes: int = Field(ge=5, le=240)


class PlanResponse(BaseModel):
    id: str
    timezone: str
    daily_minutes: int
    activities: list[Activity]
    version: int
    history: dict[str, list[Activity]]
    updated_at: datetime


class ChangeResponse(BaseModel):
    activity_id: str
    before: Activity | None
    after: Activity | None


class ProposalResponse(BaseModel):
    id: str
    plan_id: str
    base_version: int
    activities: list[Activity]
    reason: str
    status: Literal["pending", "accepted", "dismissed"]
    changes: list[ChangeResponse]


class PlanDetail(PlanResponse):
    proposals: list[ProposalResponse]


class DecisionResponse(BaseModel):
    plan: PlanResponse
    proposal: ProposalResponse


def validate_schedule(activities: list[dict], timezone: str, daily_minutes: int):
    parsed = [Activity.model_validate(a) for a in activities]
    by_id = {a.id: a for a in parsed}
    if len(by_id) != len(parsed):
        raise HTTPException(422, "id aktivitas harus unik")
    totals = {}
    end_previous = None
    zone = ZoneInfo(timezone)
    for item in sorted(parsed, key=lambda a: a.start_at):
        if item.status == "skipped":
            continue
        end = item.start_at + timedelta(minutes=item.duration_minutes)
        day = item.start_at.astimezone(zone).date()
        if day != (end - timedelta(microseconds=1)).astimezone(zone).date():
            raise HTTPException(422, "aktivitas harus selesai dalam satu hari lokal")
        if end_previous is not None and item.start_at < end_previous:
            raise HTTPException(422, "ada aktivitas yang waktunya bertabrakan")
        end_previous = end
        totals[day] = totals.get(day, 0) + item.duration_minutes
        if totals[day] > daily_minutes:
            raise HTTPException(
                422, "durasi kegiatan melebihi waktu harian yang tersedia"
            )
        for dependency_id in item.prerequisites:
            dependency = by_id.get(dependency_id)
            if (
                dependency is None
                or dependency.id == item.id
                or dependency.status == "skipped"
            ):
                raise HTTPException(422, "prasyarat aktivitas tidak tersedia")
            dependency_end = dependency.start_at + timedelta(
                minutes=dependency.duration_minutes
            )
            if dependency_end > item.start_at:
                raise HTTPException(
                    422, "prasyarat harus dijadwalkan sebelum aktivitas ini"
                )


def preserve_protected(current: list[dict], proposed: list[dict]):
    updates = {a["id"]: a for a in proposed}
    for activity in current:
        if activity["locked"] or activity["status"] in PROTECTED:
            if updates.get(activity["id"]) != activity:
                raise HTTPException(
                    409,
                    "aktivitas selesai, berjalan, atau terkunci perlu dipertahankan",
                )
    original = {a["id"]: a for a in current}
    for activity in proposed:
        old_status = original.get(activity["id"], {}).get("status", "pending")
        if activity["status"] != old_status:
            raise HTTPException(422, "ubah status lewat tindakan aktivitas")


def changes_between(before: list[dict], after: list[dict]) -> list[dict]:
    old = {a["id"]: a for a in before}
    new = {a["id"]: a for a in after}
    return [
        {"activity_id": key, "before": old.get(key), "after": new.get(key)}
        for key in sorted(old.keys() | new.keys())
        if old.get(key) != new.get(key)
    ]


def advance_plan(plan: dict, activities: list[dict]):
    plan["history"][str(plan["version"])] = deepcopy(plan["activities"])
    plan["activities"] = deepcopy(activities)
    plan["version"] += 1
    plan["updated_at"] = now()


@router.post("/suggest")
async def suggest(body: ScheduleInput, store: StoreDep):
    snapshot = await store.load()
    material = get_material(snapshot.data, body.material_id)
    activities = []
    cursor = body.start_at
    remaining = body.available_minutes
    scheduled = {}
    for concept in material.concepts:
        if (
            concept.estimated_minutes > remaining
            or not set(concept.prerequisites) <= scheduled.keys()
        ):
            break
        activity_id = str(uuid4())
        activity = Activity(
            id=activity_id,
            title=f"Pelajari {concept.title}",
            start_at=cursor,
            duration_minutes=concept.estimated_minutes,
            prerequisites=[scheduled[p] for p in concept.prerequisites],
        )
        activities.append(activity.model_dump(mode="json"))
        scheduled[concept.id] = activity_id
        cursor += timedelta(minutes=concept.estimated_minutes)
        remaining -= concept.estimated_minutes
    return {
        "activities": activities,
        "remaining_minutes": remaining,
        "reason": "Usulan mengikuti urutan prasyarat dan waktu yang kamu sediakan.",
        "requires_confirmation": True,
    }


@router.post("", status_code=201, response_model=PlanResponse)
async def create_plan(body: PlanCreate, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    previous = replay(snapshot, str(body.request_id), "plan.create", payload)
    if previous is not None:
        return previous
    activities = payload["activities"]
    if any(a["status"] != "pending" for a in activities):
        raise HTTPException(
            422, "rencana baru dimulai dengan kegiatan belum dikerjakan"
        )
    validate_schedule(activities, body.timezone, body.daily_minutes)
    plan = {
        "id": str(uuid4()),
        "timezone": body.timezone,
        "daily_minutes": body.daily_minutes,
        "activities": activities,
        "version": 1,
        "history": {},
        "updated_at": now(),
    }
    snapshot.data["plans"][plan["id"]] = plan
    return await commit(
        store, snapshot, str(body.request_id), "plan.create", payload, deepcopy(plan)
    )


@router.get("", response_model=Page[PlanResponse])
async def plans(store: StoreDep):
    snapshot = await store.load()
    return {"items": list(snapshot.data["plans"].values())}


@router.get("/{plan_id}", response_model=PlanDetail)
async def plan_detail(plan_id: str, store: StoreDep):
    snapshot = await store.load()
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    proposals = [
        p for p in snapshot.data["proposals"].values() if p["plan_id"] == plan_id
    ]
    return {**plan, "proposals": proposals}


@router.post("/{plan_id}/proposals", status_code=201, response_model=ProposalResponse)
async def create_proposal(plan_id: str, body: ProposalCreate, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    operation = f"proposal.create:{plan_id}"
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    require_revision(plan["version"], body.expected_version)
    activities = payload["activities"]
    preserve_protected(plan["activities"], activities)
    validate_schedule(activities, plan["timezone"], plan["daily_minutes"])
    proposal = {
        "id": str(uuid4()),
        "plan_id": plan_id,
        "base_version": plan["version"],
        "activities": activities,
        "reason": body.reason,
        "status": "pending",
        "changes": changes_between(plan["activities"], activities),
    }
    snapshot.data["proposals"][proposal["id"]] = proposal
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, proposal
    )


@router.post(
    "/{plan_id}/proposals/{proposal_id}/{action}", response_model=DecisionResponse
)
async def decide_proposal(
    plan_id: str,
    proposal_id: str,
    action: Literal["accept", "dismiss"],
    body: PlanAction,
    store: StoreDep,
):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    operation = f"proposal.{action}:{plan_id}:{proposal_id}"
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    proposal = find_item(snapshot.data["proposals"], proposal_id, "usulan")
    if proposal["plan_id"] != plan_id:
        raise HTTPException(404, "usulan tidak ditemukan pada rencana ini")
    require_revision(plan["version"], body.expected_version)
    if proposal["status"] != "pending":
        raise HTTPException(409, "usulan sudah ditanggapi")
    if action == "accept":
        require_revision(plan["version"], proposal["base_version"])
        preserve_protected(plan["activities"], proposal["activities"])
        validate_schedule(
            proposal["activities"], plan["timezone"], plan["daily_minutes"]
        )
        advance_plan(plan, proposal["activities"])
        proposal["status"] = "accepted"
    else:
        proposal["status"] = "dismissed"
    result = {"plan": deepcopy(plan), "proposal": deepcopy(proposal)}
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, result
    )


@router.post("/{plan_id}/activities/{activity_id}/status", response_model=PlanResponse)
async def activity_status(
    plan_id: str, activity_id: str, body: ActivityStatus, store: StoreDep
):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    operation = f"activity.status:{plan_id}:{activity_id}"
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    require_revision(plan["version"], body.expected_version)
    activities = deepcopy(plan["activities"])
    by_id = {a["id"]: a for a in activities}
    activity = find_item(by_id, activity_id, "aktivitas")
    if activity["status"] == "completed" and body.status != "completed":
        raise HTTPException(409, "kegiatan selesai tetap tercatat")
    if body.status in PROTECTED and any(
        by_id[p]["status"] != "completed" for p in activity["prerequisites"]
    ):
        raise HTTPException(422, "selesaikan kegiatan prasyarat terlebih dulu")
    activity["status"] = body.status
    validate_schedule(activities, plan["timezone"], plan["daily_minutes"])
    advance_plan(plan, activities)
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, deepcopy(plan)
    )


@router.post("/{plan_id}/restore", response_model=PlanResponse)
async def restore_plan(plan_id: str, body: Restore, store: StoreDep):
    snapshot = await store.load()
    payload = body.model_dump(mode="json")
    operation = f"plan.restore:{plan_id}"
    previous = replay(snapshot, str(body.request_id), operation, payload)
    if previous is not None:
        return previous
    plan = find_item(snapshot.data["plans"], plan_id, "rencana")
    require_revision(plan["version"], body.expected_version)
    target = deepcopy(
        find_item(plan["history"], str(body.target_version), "versi rencana")
    )
    protected = {
        a["id"]: a
        for a in plan["activities"]
        if a["locked"] or a["status"] in PROTECTED
    }
    target = [a for a in target if a["id"] not in protected] + list(protected.values())
    # Revalidate against current completed/locked activities, including new ones.
    validate_schedule(target, plan["timezone"], plan["daily_minutes"])
    advance_plan(plan, target)
    return await commit(
        store, snapshot, str(body.request_id), operation, payload, deepcopy(plan)
    )

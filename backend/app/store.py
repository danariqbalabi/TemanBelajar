"""Atomic per-learner state using Supabase RLS and compare-and-swap.

Each mutation loads one snapshot and commits once. A competing writer receives
409 and must reload. Receipts are committed with results to make retries safe.
"""

import hashlib
import json
from copy import deepcopy
from typing import Annotated

from fastapi import Depends, HTTPException
from pydantic import BaseModel, Field, ValidationError, field_validator

from app.config import settings
from app.profiles import Identity, identity, request_supabase, response_json


class Snapshot(BaseModel):
    revision: int = 0
    data: dict = Field(
        default_factory=lambda: {
            "materials": {},
            "sessions": {},
            "attempts": {},
            "plans": {},
            "proposals": {},
            "receipts": {},
            "jobs": {},
        }
    )

    @field_validator("data")
    @classmethod
    def normalize_collections(cls, value):
        for name in [
            "materials",
            "sessions",
            "attempts",
            "plans",
            "proposals",
            "receipts",
            "jobs",
        ]:
            value.setdefault(name, {})
            if not isinstance(value[name], dict):
                raise ValueError("koleksi aktivitas belum valid")
        return value


class Store:
    def __init__(self, user: Identity):
        self.user = user

    def service_token(self) -> str:
        token = settings().supabase_service_role_key
        if not token:
            raise HTTPException(503, "akses penyimpanan backend belum dikonfigurasi")
        return token

    async def reserve_ai_attempt(self):
        response = await request_supabase(
            "POST",
            "/rest/v1/rpc/reserve_ai_attempt",
            self.service_token(),
            server=True,
            json={"daily_limit": settings().ai_daily_global_limit},
        )
        allowed = response_json(response)
        if allowed is False:
            raise HTTPException(
                429, "kuota AI layanan hari ini sudah penuh, coba besok"
            )
        if allowed is not True:
            raise HTTPException(502, "kuota AI belum dapat diverifikasi")

    async def load(self) -> Snapshot:
        response = await request_supabase(
            "GET",
            "/rest/v1/learning_states",
            self.service_token(),
            server=True,
            params={"user_id": f"eq.{self.user.id}", "select": "revision,data"},
        )
        rows = response_json(response)
        if not isinstance(rows, list):
            raise HTTPException(502, "respons aktivitas belum valid")
        try:
            return Snapshot.model_validate(rows[0]) if rows else Snapshot()
        except ValidationError as exc:
            raise HTTPException(502, "data aktivitas belum dapat dibaca") from exc

    async def save(self, snapshot: Snapshot) -> int:
        response = await request_supabase(
            "POST",
            "/rest/v1/rpc/save_learning_state",
            self.service_token(),
            server=True,
            json={
                "learner": str(self.user.id),
                "expected_revision": snapshot.revision,
                "new_data": snapshot.data,
            },
        )
        revision = response_json(response)
        if revision is None:
            raise HTTPException(409, "data sudah berubah, muat ulang sebelum menyimpan")
        if type(revision) is not int or revision != snapshot.revision + 1:
            raise HTTPException(502, "respons versi penyimpanan belum valid")
        return revision


def get_store(user: Annotated[Identity, Depends(identity)]) -> Store:
    return Store(user)


StoreDep = Annotated[Store, Depends(get_store)]


def fingerprint(operation: str, payload: dict) -> str:
    encoded = json.dumps([operation, payload], sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode()).hexdigest()


def replay(snapshot: Snapshot, key: str, operation: str, payload: dict):
    receipt = snapshot.data["receipts"].get(key)
    if receipt is None:
        return None
    if receipt["fingerprint"] != fingerprint(operation, payload):
        raise HTTPException(409, "id permintaan sudah dipakai untuk tindakan berbeda")
    return receipt["result"]


async def commit(
    store: Store,
    snapshot: Snapshot,
    key: str,
    operation: str,
    payload: dict,
    result: dict,
):
    snapshot.data["receipts"][key] = {
        "fingerprint": fingerprint(operation, payload),
        "result": deepcopy(result),
    }
    await store.save(snapshot)
    return result


def require_revision(actual: int, expected: int):
    if actual != expected:
        raise HTTPException(409, "versi sudah berubah, tinjau data terbaru dulu")


def find_item(items: dict, item_id: str, label: str) -> dict:
    if item_id not in items:
        raise HTTPException(404, f"{label} tidak ditemukan")
    return items[item_id]

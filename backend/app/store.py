"""Atomic per-learner state using Supabase RLS and compare-and-swap.

Each mutation loads one snapshot and commits once. A competing writer receives
409 and must reload. Receipts are committed with results to make retries safe.
"""
import hashlib
import json
from typing import Annotated

from fastapi import Depends, HTTPException
from pydantic import BaseModel, Field

from app.profiles import Identity, identity, request_supabase


class Snapshot(BaseModel):
    revision: int = 0
    data: dict = Field(default_factory=lambda: {
        "materials": {}, "sessions": {}, "attempts": {}, "plans": {},
        "proposals": {}, "receipts": {}, "jobs": {},
    })


class Store:
    def __init__(self, user: Identity):
        self.user = user

    async def load(self) -> Snapshot:
        response = await request_supabase(
            "GET", "/rest/v1/learning_states", self.user.token,
            params={"user_id": f"eq.{self.user.id}", "select": "revision,data"},
        )
        rows = response.json()
        return Snapshot.model_validate(rows[0]) if rows else Snapshot()

    async def save(self, snapshot: Snapshot) -> int:
        response = await request_supabase(
            "POST", "/rest/v1/rpc/save_learning_state", self.user.token,
            json={"expected_revision": snapshot.revision, "new_data": snapshot.data},
        )
        revision = response.json()
        if revision is None:
            raise HTTPException(409, "data sudah berubah, muat ulang sebelum menyimpan")
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


async def commit(store: Store, snapshot: Snapshot, key: str, operation: str, payload: dict, result: dict):
    snapshot.data["receipts"][key] = {
        "fingerprint": fingerprint(operation, payload), "result": result,
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

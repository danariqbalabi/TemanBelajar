from typing import Annotated, Literal
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.config import settings

router = APIRouter(prefix="/v1/profile", tags=["profil"])
bearer = HTTPBearer(auto_error=False)


class Preferences(BaseModel):
    model_config = ConfigDict(extra="forbid")
    font_size: int = Field(default=18, ge=14, le=32)
    line_height: float = Field(default=1.7, ge=1.2, le=2.5)
    high_contrast: bool = False
    reduced_motion: bool = False
    reading_ruler: bool = False
    timer_enabled: bool = False
    mode: Literal["standard", "reading", "focus", "explore", "transcript"] = "standard"


class ProfileInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    display_name: str = Field(min_length=1, max_length=80)
    timezone: str = "Asia/Jakarta"
    daily_minutes: int = Field(default=15, ge=5, le=240)
    goal: str = Field(default="", max_length=500)
    preferences: Preferences = Field(default_factory=Preferences)

    @field_validator("display_name")
    @classmethod
    def valid_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("nama perlu diisi")
        return value

    @field_validator("timezone")
    @classmethod
    def valid_timezone(cls, value: str) -> str:
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError) as exc:
            raise ValueError("zona waktu tidak dikenal") from exc
        return value


class Identity(BaseModel):
    id: UUID
    token: str


async def request_supabase(method: str, path: str, token: str, **kwargs) -> httpx.Response:
    config = settings()
    if not config.supabase_url or not config.supabase_anon_key:
        raise HTTPException(503, "layanan akun belum dikonfigurasi")
    headers = {"apikey": config.supabase_anon_key, "Authorization": f"Bearer {token}"}
    headers.update(kwargs.pop("headers", {}))
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.request(method, config.supabase_url.rstrip("/") + path, headers=headers, **kwargs)
    except httpx.RequestError as exc:
        raise HTTPException(503, "layanan akun sedang tidak tersedia") from exc
    if response.status_code in (401, 403):
        raise HTTPException(401, "sesi masuk tidak valid atau sudah berakhir")
    if response.is_error:
        raise HTTPException(503, "permintaan belum tersimpan, coba lagi")
    return response


async def identity(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> Identity:
    if credentials is None:
        raise HTTPException(401, "masuk dulu untuk melanjutkan")
    response = await request_supabase("GET", "/auth/v1/user", credentials.credentials)
    try:
        return Identity(id=response.json()["id"], token=credentials.credentials)
    except (ValueError, KeyError, TypeError) as exc:
        raise HTTPException(502, "respons layanan akun belum valid") from exc


@router.get("")
async def get_profile(user: Annotated[Identity, Depends(identity)]):
    response = await request_supabase("GET", "/rest/v1/learner_profiles", user.token,
                                      params={"id": f"eq.{user.id}", "select": "*"})
    rows = response.json()
    if not rows:
        raise HTTPException(404, "profil belum dibuat")
    return rows[0]


@router.put("")
async def save_profile(profile: ProfileInput, user: Annotated[Identity, Depends(identity)]):
    response = await request_supabase("POST", "/rest/v1/learner_profiles", user.token,
        params={"on_conflict": "id"},
        headers={"Prefer": "resolution=merge-duplicates,return=representation"},
        json={"id": str(user.id), **profile.model_dump()})
    return response.json()[0]

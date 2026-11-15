from datetime import date
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
    font_family: Literal["jakarta", "nunito", "system"] = "jakarta"
    letter_spacing: float = Field(default=0, ge=0, le=0.2)
    reading_width: int = Field(default=68, ge=40, le=80)
    speech_rate: float = Field(default=1, ge=0.5, le=2)
    show_mimo: bool = True
    captions: bool = True


class ProfileInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    display_name: str = Field(min_length=1, max_length=80)
    timezone: str = "Asia/Jakarta"
    daily_minutes: int = Field(default=15, ge=5, le=240)
    goal: str = Field(default="", max_length=500)
    preferences: Preferences = Field(default_factory=Preferences)
    subjects: list[str] = Field(default_factory=list, max_length=20)
    available_days: list[int] = Field(
        default_factory=lambda: [0, 1, 2, 3, 4], max_length=7
    )
    exam_date: date | None = None
    onboarding_step: int = Field(default=0, ge=0, le=4)

    @field_validator("available_days")
    @classmethod
    def valid_days(cls, value: list[int]) -> list[int]:
        if len(value) != len(set(value)) or any(day < 0 or day > 6 for day in value):
            raise ValueError("hari harus unik, senin 0 sampai minggu 6")
        return value

    @field_validator("subjects")
    @classmethod
    def valid_subjects(cls, value: list[str]) -> list[str]:
        result = [item.strip() for item in value]
        if any(not item or len(item) > 80 for item in result) or len(
            set(result)
        ) != len(result):
            raise ValueError(
                "mata pelajaran harus unik dan sepanjang 1 sampai 80 karakter"
            )
        return result

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


class ProfileResponse(ProfileInput):
    id: UUID
    revision: int


class ProfileUpdate(ProfileInput):
    expected_revision: int = Field(default=0, ge=0)


def response_json(response: httpx.Response):
    try:
        return response.json()
    except ValueError as exc:
        raise HTTPException(502, "respons layanan data belum valid") from exc


async def request_supabase(
    method: str, path: str, token: str, **kwargs
) -> httpx.Response:
    config = settings()
    if not config.supabase_url or not config.supabase_anon_key:
        raise HTTPException(503, "layanan akun belum dikonfigurasi")
    headers = {"apikey": config.supabase_anon_key, "Authorization": f"Bearer {token}"}
    if kwargs.pop("server", False):
        headers["apikey"] = token
        if token.startswith("sb_secret_"):
            headers.pop("Authorization")
    headers.update(kwargs.pop("headers", {}))
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.request(
                method,
                config.supabase_url.rstrip("/") + path,
                headers=headers,
                **kwargs,
            )
    except httpx.RequestError as exc:
        raise HTTPException(503, "layanan akun sedang tidak tersedia") from exc
    if response.status_code in (401, 403):
        raise HTTPException(401, "sesi masuk tidak valid atau sudah berakhir")
    if response.status_code == 409:
        raise HTTPException(409, "profil sudah berubah, muat ulang sebelum menyimpan")
    if response.is_error:
        raise HTTPException(503, "permintaan belum tersimpan, coba lagi")
    return response


async def identity(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> Identity:
    if credentials is None:
        raise HTTPException(401, "masuk dulu untuk melanjutkan")
    response = await request_supabase("GET", "/auth/v1/user", credentials.credentials)
    try:
        return Identity(id=response.json()["id"], token=credentials.credentials)
    except (ValueError, KeyError, TypeError) as exc:
        raise HTTPException(502, "respons layanan akun belum valid") from exc


@router.get("", response_model=ProfileResponse)
async def get_profile(user: Annotated[Identity, Depends(identity)]):
    response = await request_supabase(
        "GET",
        "/rest/v1/learner_profiles",
        user.token,
        params={"id": f"eq.{user.id}", "select": "*"},
    )
    rows = response_json(response)
    if not isinstance(rows, list):
        raise HTTPException(502, "respons layanan data belum valid")
    if not rows:
        raise HTTPException(404, "profil belum dibuat")
    return rows[0]


@router.put("", response_model=ProfileResponse)
async def save_profile(
    profile: ProfileUpdate, user: Annotated[Identity, Depends(identity)]
):
    payload = profile.model_dump(mode="json", exclude={"expected_revision"})
    if profile.expected_revision == 0:
        response = await request_supabase(
            "POST",
            "/rest/v1/learner_profiles",
            user.token,
            headers={"Prefer": "return=representation"},
            json={"id": str(user.id), **payload},
        )
    else:
        response = await request_supabase(
            "PATCH",
            "/rest/v1/learner_profiles",
            user.token,
            params={
                "id": f"eq.{user.id}",
                "revision": f"eq.{profile.expected_revision}",
            },
            headers={"Prefer": "return=representation"},
            json=payload,
        )
    rows = response_json(response)
    if not isinstance(rows, list):
        raise HTTPException(502, "respons penyimpanan profil belum valid")
    if not rows:
        raise HTTPException(409, "profil sudah berubah, muat ulang sebelum menyimpan")
    return rows[0]

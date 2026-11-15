from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    ai_daily_global_limit: int = Field(default=100, ge=1, le=10000)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.1-flash-lite"
    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def settings() -> Settings:
    return Settings()

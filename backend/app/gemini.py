import ssl

import httpx
from fastapi import HTTPException

from app.config import Settings


def provider_schema(schema: dict) -> dict:
    """Keep Gemini's structural subset; enforce all domain limits locally."""
    result = {}
    for key, value in schema.items():
        if key in {"properties", "$defs"}:
            result[key] = {
                name: provider_schema(child) for name, child in value.items()
            }
        elif key == "items":
            result[key] = provider_schema(value)
        elif key == "anyOf":
            result[key] = [provider_schema(child) for child in value]
        elif key in {"type", "required", "enum", "$ref"}:
            result[key] = value
    return result


async def generate_json(
    config: Settings,
    prompt: str,
    schema: dict,
    *,
    timeout: int,
    unavailable: str,
    invalid: str,
) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{config.gemini_model}:generateContent"
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                headers={"x-goog-api-key": config.gemini_api_key},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "responseJsonSchema": provider_schema(schema),
                    },
                },
            )
        if response.is_error:
            raise HTTPException(503, unavailable)
        result = response.json()
        candidate = result["candidates"][0]
        if candidate.get("finishReason", "STOP") != "STOP":
            raise ValueError("generasi belum selesai")
        text = "".join(p.get("text", "") for p in candidate["content"]["parts"])
        return text
    except (
        httpx.RequestError,
        ssl.SSLError,
        AttributeError,
        KeyError,
        IndexError,
        TypeError,
        ValueError,
    ) as exc:
        raise HTTPException(502, invalid) from exc

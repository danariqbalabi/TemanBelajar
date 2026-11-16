import asyncio
import ssl
from uuid import uuid4

import httpx
import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from app import material_processing, profiles
from app import store as store_module
from app.config import Settings
from app.demo import FOTOSINTESIS
from app.profiles import Identity, ProfileInput
from app.store import Store


def test_profile_days_and_whitespace_validation():
    for fields in [
        {"display_name": " "},
        {"display_name": "Manda", "available_days": [7]},
        {"display_name": "Manda", "available_days": [1, 1]},
        {"display_name": "Manda", "subjects": ["  "]},
    ]:
        with pytest.raises(ValidationError):
            ProfileInput(**fields)


def install_transport(monkeypatch, handler):
    original = httpx.AsyncClient
    monkeypatch.setattr(
        httpx,
        "AsyncClient",
        lambda **kwargs: original(transport=httpx.MockTransport(handler), **kwargs),
    )


def test_raw_tls_failure_returns_retryable_service_error(monkeypatch):
    monkeypatch.setattr(
        profiles,
        "settings",
        lambda: Settings(
            supabase_url="https://test.supabase.co", supabase_anon_key="public-key"
        ),
    )
    calls = []

    def fail_tls(request):
        calls.append(request)
        raise ssl.SSLError("upstream transport details must stay private")

    install_transport(monkeypatch, fail_tls)
    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            profiles.request_supabase(
                "POST", "/rest/v1/rpc/save_learning_state", "token", json={}
            )
        )
    assert exc.value.status_code == 503
    assert exc.value.detail == "layanan akun sedang tidak tersedia"
    assert len(calls) == 1  # Do not silently replay a possibly committed mutation.


def test_supabase_uses_server_token_and_owner_filter_without_overwriting_conflict(
    monkeypatch,
):
    monkeypatch.setattr(
        profiles,
        "settings",
        lambda: Settings(
            supabase_url="https://test.supabase.co", supabase_anon_key="public-key"
        ),
    )
    user = Identity(id=uuid4(), token="user-token")
    monkeypatch.setattr(
        store_module,
        "settings",
        lambda: Settings(supabase_service_role_key="server-token"),
    )

    def handler(request):
        assert request.headers["Authorization"] == "Bearer server-token"
        assert request.headers["apikey"] == "server-token"
        if request.method == "GET":
            assert str(user.id) in str(request.url)
            return httpx.Response(200, json=[])
        import json

        assert json.loads(request.content)["learner"] == str(user.id)
        return httpx.Response(
            200, content=b"null", headers={"content-type": "application/json"}
        )

    install_transport(monkeypatch, handler)

    async def scenario():
        store = Store(user)
        snapshot = await store.load()
        with pytest.raises(HTTPException) as exc:
            await store.save(snapshot)
        assert exc.value.status_code == 409

    asyncio.run(scenario())


def test_upstream_denial_and_outage_are_sanitized(monkeypatch):
    monkeypatch.setattr(
        profiles,
        "settings",
        lambda: Settings(
            supabase_url="https://test.supabase.co", supabase_anon_key="public-key"
        ),
    )
    install_transport(
        monkeypatch,
        lambda request: httpx.Response(401, json={"secret": "do not expose"}),
    )
    with pytest.raises(HTTPException) as exc:
        asyncio.run(profiles.request_supabase("GET", "/auth/v1/user", "invalid"))
    assert exc.value.status_code == 401
    assert "secret" not in str(exc.value.detail)


def test_gemini_checks_sources_and_removes_unreviewed_skill_mapping(monkeypatch):
    monkeypatch.setattr(
        material_processing, "settings", lambda: Settings(gemini_api_key="test-key")
    )
    output = FOTOSINTESIS.model_copy(deep=True)
    output.concepts[0].skill_id = "math.pythagorean-theorem"

    def handler(request):
        assert request.headers["x-goog-api-key"] == "test-key"
        assert "test-key" not in str(request.url)
        return httpx.Response(
            200,
            json={
                "candidates": [
                    {"content": {"parts": [{"text": output.model_dump_json()}]}}
                ]
            },
        )

    install_transport(monkeypatch, handler)
    job = {
        "id": "job-1",
        "title": "Fotosintesis",
        "sources": [s.model_dump() for s in FOTOSINTESIS.sources],
    }
    result = asyncio.run(material_processing.generate_material(job))
    assert result.generated_by_ai and not result.is_demo
    assert result.concepts[0].skill_id is None
    assert result.concepts[0].diagram_description is None
    assert result.sources == FOTOSINTESIS.sources
    job["sources"] = [
        {"id": "unknown", "label": "sumber lain", "text": "isi sumber berbeda"}
    ]
    with pytest.raises(HTTPException) as exc:
        asyncio.run(material_processing.generate_material(job))
    assert exc.value.status_code == 502


@pytest.mark.parametrize("failure", ["tls", "truncated", "malformed"])
def test_gemini_failure_releases_job_and_preserves_source(client, monkeypatch, failure):
    from test_processing import upload

    job = upload(client)
    monkeypatch.setattr(
        material_processing, "settings", lambda: Settings(gemini_api_key="test-key")
    )

    def handler(request):
        if failure == "tls":
            raise ssl.SSLError("private transport details")
        candidate = (
            None
            if failure == "malformed"
            else {
                "finishReason": "MAX_TOKENS",
                "content": {"parts": [{"text": FOTOSINTESIS.model_dump_json()}]},
            }
        )
        return httpx.Response(200, json={"candidates": [candidate]})

    install_transport(monkeypatch, handler)
    url = f"/v1/jobs/{job['id']}"
    response = client.post(url + "/process")
    assert response.status_code == 502
    assert "private" not in response.text
    assert client.get(url).json()["status"] == "failed"
    assert client.get(url + "/source").json()["sources"]


def test_atomic_ai_admission_maps_quota_denial_without_extra_request(monkeypatch):
    from app.store import Snapshot

    config = Settings(
        supabase_url="https://test.supabase.co",
        supabase_anon_key="public",
        supabase_service_role_key="server",
        ai_daily_global_limit=7,
    )
    monkeypatch.setattr(profiles, "settings", lambda: config)
    monkeypatch.setattr(store_module, "settings", lambda: config)
    calls = []

    def handler(request):
        import json

        calls.append(request)
        assert request.url.path == "/rest/v1/rpc/save_learning_state_with_ai_budget"
        assert json.loads(request.content)["daily_limit"] == 7
        return httpx.Response(200, json=-1)

    install_transport(monkeypatch, handler)
    store = Store(Identity(id=uuid4(), token="user"))
    with pytest.raises(HTTPException) as error:
        asyncio.run(store.save(Snapshot(), reserve_ai=True))
    assert error.value.status_code == 429
    assert len(calls) == 1

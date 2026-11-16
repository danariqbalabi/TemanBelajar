"""Run API checks against real providers using two disposable test accounts."""

import argparse
import secrets
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app


def require(response, expected=200):
    if response.status_code != expected:
        raise RuntimeError(
            f"pemeriksaan gagal: {response.request.method} {response.request.url.path}, status {response.status_code}"
        )
    return response.json()


def rid():
    return str(uuid4())


def check_learning(client):
    require(
        client.put(
            "/v1/profile", json={"display_name": "Manda", "goal": "pemeriksaan backend"}
        )
    )
    assert require(client.get("/v1/profile"))["display_name"] == "Manda"
    session = require(
        client.post(
            "/v1/sessions", json={"request_id": rid(), "material_id": "demo-pythagoras"}
        ),
        201,
    )
    attempt = require(
        client.post(
            "/v1/attempts", json={"request_id": rid(), "session_id": session["id"]}
        ),
        201,
    )
    for number, selected in enumerate([0, 1, 2], 1):
        body = {
            "request_id": rid(),
            "expected_version": number,
            "question_id": f"pythagoras-{number}",
            "selected_index": selected,
        }
        url = f"/v1/attempts/{attempt['id']}/answers"
        first = require(client.post(url, json=body))
        assert require(client.post(url, json=body)) == first
        if number == 1:
            resumed = require(
                client.get(f"/v1/sessions/{session['id']}/attempts/active")
            )
            assert resumed == first
            assert (
                require(
                    client.post(
                        "/v1/attempts",
                        json={
                            "request_id": rid(),
                            "session_id": session["id"],
                        },
                    ),
                    201,
                )
                == first
            )
    assert require(client.get(f"/v1/sessions/{session['id']}/attempts/active")) is None
    progress = require(
        client.get("/v1/progress", params={"material_id": "demo-pythagoras"})
    )
    assert progress["concepts"][0]["mastery"] is not None
    require(
        client.get("/v1/recommendations", params={"material_id": "demo-pythagoras"})
    )
    return session


def check_planner(client):
    suggestion = require(
        client.post(
            "/v1/plans/suggest",
            json={
                "material_id": "demo-fotosintesis",
                "start_at": "2026-11-16T09:00:00+07:00",
                "available_minutes": 15,
            },
        )
    )
    plan = require(
        client.post(
            "/v1/plans",
            json={"request_id": rid(), "activities": suggestion["activities"]},
        ),
        201,
    )
    url = f"/v1/plans/{plan['id']}"
    proposal = require(
        client.post(
            url + "/proposals",
            json={
                "request_id": rid(),
                "expected_version": 1,
                "activities": plan["activities"],
                "reason": "tinjauan jadwal contoh",
            },
        ),
        201,
    )
    require(
        client.post(
            url + f"/proposals/{proposal['id']}/accept",
            json={"request_id": rid(), "expected_version": 1},
        )
    )
    require(
        client.post(
            url + "/restore",
            json={"request_id": rid(), "expected_version": 2, "target_version": 1},
        )
    )
    recomputed = require(
        client.post(
            url + "/recompute",
            json={
                "request_id": rid(),
                "expected_version": 3,
                "material_id": "demo-fotosintesis",
                "start_at": "2026-11-17T09:00:00+07:00",
            },
        ),
        201,
    )
    require(
        client.post(
            url + f"/proposals/{recomputed['id']}/accept",
            json={
                "request_id": rid(),
                "expected_version": 3,
            },
        )
    )
    return plan


def check_gemini(client):
    text = "Fotosintesis menggunakan energi cahaya untuk mengubah air dan karbon dioksida menjadi gula. Proses ini melepaskan oksigen. Klorofil menyerap energi cahaya."
    job = require(
        client.post(
            "/v1/materials/text",
            json={"request_id": rid(), "title": "Fotosintesis contoh", "text": text},
        ),
        202,
    )
    processed = require(client.post(f"/v1/jobs/{job['id']}/process"))
    assert processed["status"] == "ready"
    require(client.get(f"/v1/materials/{processed['material_id']}"))
    print("unggah, gemini, sumber, dan materi tersimpan: lolos", flush=True)


def run(with_gemini=False, with_anonymous=False):
    config = settings()
    if not config.supabase_service_role_key:
        raise RuntimeError("isi SUPABASE_SERVICE_ROLE_KEY terlebih dulu")
    admin_headers = {"apikey": config.supabase_service_role_key}
    if not config.supabase_service_role_key.startswith("sb_secret_"):
        admin_headers["Authorization"] = "Bearer " + config.supabase_service_role_key
    created = []
    with (
        httpx.Client(base_url=config.supabase_url, timeout=30) as auth,
        TestClient(app) as client,
    ):
        try:
            tokens = []
            for _ in range(2):
                email = f"temanbelajar-check-{uuid4().hex}@example.invalid"
                password = secrets.token_urlsafe(30)
                user = require(
                    auth.post(
                        "/auth/v1/admin/users",
                        headers=admin_headers,
                        json={
                            "email": email,
                            "password": password,
                            "email_confirm": True,
                        },
                    )
                )
                created.append(user["id"])
                result = require(
                    auth.post(
                        "/auth/v1/token?grant_type=password",
                        headers={"apikey": config.supabase_anon_key},
                        json={"email": email, "password": password},
                    )
                )
                tokens.append(result["access_token"])
            client.headers["Authorization"] = "Bearer " + tokens[0]
            session = check_learning(client)
            plan = check_planner(client)
            print(
                "akun, profil, sesi, latihan, retry, bkt, rekomendasi, dan planner: lolos",
                flush=True,
            )
            if with_gemini:
                check_gemini(client)
            client.headers["Authorization"] = "Bearer " + tokens[1]
            assert client.get(f"/v1/sessions/{session['id']}").status_code == 404
            assert client.get(f"/v1/plans/{plan['id']}").status_code == 404
            assert client.get("/v1/profile").status_code == 404
            direct = auth.get(
                "/rest/v1/learning_states",
                headers={
                    "apikey": config.supabase_anon_key,
                    "Authorization": "Bearer " + tokens[0],
                },
            )
            assert direct.status_code in (401, 403)
            print("isolasi dua akun dan proteksi akses langsung: lolos", flush=True)
            if with_anonymous:
                anonymous = require(
                    auth.post(
                        "/auth/v1/signup",
                        headers={"apikey": config.supabase_anon_key},
                        json={},
                    )
                )
                created.append(anonymous["user"]["id"])
                client.headers["Authorization"] = "Bearer " + anonymous["access_token"]
                require(client.put("/v1/profile", json={"display_name": "Manda"}))
                require(
                    client.post(
                        "/v1/sessions",
                        json={"request_id": rid(), "material_id": "demo-fotosintesis"},
                    ),
                    201,
                )
                print("demo anonim dengan sesi privat: lolos", flush=True)
        finally:
            for user_id in created:
                response = auth.delete(
                    f"/auth/v1/admin/users/{user_id}", headers=admin_headers
                )
                if response.is_error:
                    raise RuntimeError("akun pemeriksaan belum terhapus: " + user_id)
            if created:
                print("akun pemeriksaan dan data terkait sudah dibersihkan", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--gemini", action="store_true")
    parser.add_argument("--anonymous", action="store_true")
    args = parser.parse_args()
    try:
        run(args.gemini, args.anonymous)
    except (RuntimeError, httpx.RequestError) as exc:
        print(
            str(exc) if isinstance(exc, RuntimeError) else "koneksi layanan gagal",
            flush=True,
        )
        raise SystemExit(1) from None

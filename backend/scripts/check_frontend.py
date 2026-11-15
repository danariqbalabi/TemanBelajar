"""Check the actual frontend API module with a disposable Supabase account."""

import argparse
import json
import subprocess
from pathlib import Path

import httpx

from app.config import settings


def require(response):
    if response.is_error:
        raise RuntimeError(f"layanan akun mengembalikan status {response.status_code}")
    return response.json()


def run(gemini=False):
    config = settings()
    if not config.supabase_service_role_key:
        raise RuntimeError("isi kunci server backend sebelum pemeriksaan")
    headers = {"apikey": config.supabase_service_role_key}
    if not config.supabase_service_role_key.startswith("sb_secret_"):
        headers["Authorization"] = "Bearer " + config.supabase_service_role_key
    with httpx.Client(base_url=config.supabase_url, timeout=30) as client:
        account = require(
            client.post(
                "/auth/v1/signup", headers={"apikey": config.supabase_anon_key}, json={}
            )
        )
        try:
            credentials = {
                "access_token": account["access_token"],
                "refresh_token": account["refresh_token"],
                "gemini": gemini,
            }
            result = subprocess.run(
                ["node", "scripts/check-live.mjs"],
                input=json.dumps(credentials),
                text=True,
                cwd=Path(__file__).resolve().parents[2] / "frontend",
                capture_output=True,
                timeout=200,
            )
            # Never echo stderr: SDK diagnostics could include credential context.
            if result.returncode:
                raise RuntimeError(
                    "smoke test modul frontend gagal; periksa kontrak dan layanan lokal"
                )
            print(result.stdout.strip(), flush=True)
        finally:
            deleted = client.delete(
                f"/auth/v1/admin/users/{account['user']['id']}", headers=headers
            )
            if deleted.is_error:
                raise RuntimeError("akun pemeriksaan belum terhapus")
            print("akun pemeriksaan frontend dan datanya sudah dibersihkan", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--gemini", action="store_true")
    try:
        run(parser.parse_args().gemini)
    except httpx.RequestError:
        raise SystemExit(
            "koneksi layanan akun gagal; akun pengujian belum dibuat jika signup gagal"
        ) from None
    except (RuntimeError, subprocess.TimeoutExpired) as exc:
        raise SystemExit(
            str(exc)
            if isinstance(exc, RuntimeError)
            else "pemeriksaan frontend melewati batas waktu"
        ) from None

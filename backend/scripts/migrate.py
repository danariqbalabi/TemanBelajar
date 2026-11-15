"""Apply repository SQL migrations with checksums in one transaction."""

import hashlib
from pathlib import Path

import psycopg
from dotenv import dotenv_values


def migrate():
    import os

    database_url = os.environ.get("DATABASE_URL") or dotenv_values(".env").get(
        "DATABASE_URL"
    )
    if not database_url:
        raise RuntimeError("isi DATABASE_URL di backend/.env terlebih dulu")
    directory = Path(__file__).resolve().parents[2] / "supabase" / "migrations"
    with psycopg.connect(database_url, connect_timeout=20) as connection:
        connection.execute("select pg_advisory_xact_lock(81520261115)")
        connection.execute("create schema if not exists temanbelajar_internal")
        connection.execute(
            "revoke all on schema temanbelajar_internal from public, anon, authenticated"
        )
        connection.execute(
            "create table if not exists temanbelajar_internal.migrations (name text primary key, checksum text not null, applied_at timestamptz not null default now())"
        )
        for path in sorted(directory.glob("*.sql")):
            sql = path.read_text(encoding="utf-8")
            checksum = hashlib.sha256(sql.encode()).hexdigest()
            existing = connection.execute(
                "select checksum from temanbelajar_internal.migrations where name=%s",
                (path.name,),
            ).fetchone()
            if existing:
                if existing[0] != checksum:
                    raise RuntimeError(
                        "migrasi yang sudah diterapkan berubah: " + path.name
                    )
                print("sudah diterapkan:", path.name, flush=True)
                continue
            sql = sql.strip()
            if not sql.lower().startswith("begin;") or not sql.lower().endswith(
                "commit;"
            ):
                raise RuntimeError("format transaksi migrasi belum valid")
            connection.execute(sql[len("begin;") : -len("commit;")])
            connection.execute(
                "insert into temanbelajar_internal.migrations(name,checksum) values (%s,%s)",
                (path.name, checksum),
            )
            print("diterapkan:", path.name, flush=True)
        connection.execute("notify pgrst, 'reload schema'")


if __name__ == "__main__":
    try:
        migrate()
    except psycopg.Error as exc:
        print(
            "migrasi gagal; transaksi dibatalkan. jenis:",
            type(exc).__name__,
            "sqlstate:",
            exc.sqlstate,
            flush=True,
        )
        raise SystemExit(1) from None

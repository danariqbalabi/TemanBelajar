# backend temanbelajar

backend fastapi untuk profil, materi, sesi, latihan, rekomendasi, progres, dan
planner. supabase menangani autentikasi dan postgres. gemini menyusun materi
unggahan. bkt terlatih dipakai pada skill contoh pythagoras.

## menjalankan

jalankan dari folder `backend`. python minimal 3.11.

```powershell
uv sync --frozen
uv run python -m scripts.migrate
uv run uvicorn app.main:app --reload
```

isi `.env` berdasarkan `.env.example`. file ini diabaikan git.

| variabel | kegunaan |
| --- | --- |
| `SUPABASE_URL` | url proyek supabase |
| `SUPABASE_ANON_KEY` | publishable key atau anon key untuk autentikasi pengguna |
| `SUPABASE_SERVICE_ROLE_KEY` | service role atau secret key untuk data aktivitas server |
| `DATABASE_URL` | koneksi postgres untuk perintah migrasi, gunakan session pooler jika perlu ipv4 |
| `GEMINI_API_KEY` | akses pemrosesan materi |
| `GEMINI_MODEL` | model yang tersedia pada proyek; saat ini diuji dengan `gemini-3.1-flash-lite` |
| `CORS_ORIGINS` | array json origin frontend, default `["http://localhost:3000"]` |

migrasi berjalan dalam transaksi, mencatat checksum, dan aman dijalankan kembali.
service role serta database url hanya berada pada lingkungan backend.
runtime produksi cukup memakai `uv sync --frozen --no-dev` lalu
`uv run --no-dev uvicorn app.main:app --host 0.0.0.0 --port 8000`.
perintah migrasi dijalankan dari lingkungan yang memasang dependensi dev.

## kontrak dan autentikasi

- dokumentasi interaktif tersedia di `/docs` dan skema di `/openapi.json`.
- [panduan integrasi frontend](API.md) menjelaskan urutan permintaan, retry, versi, dan pemrosesan.
- frontend masuk lewat supabase auth, kemudian mengirim `Authorization: Bearer <access_token>` ke backend.
- demo memakai `signInAnonymously()` supabase setelah anonymous sign-ins diaktifkan. setiap pengunjung mempunyai data privat sendiri. nama contoh adalah Manda.
- `/health`, `/docs`, `/openapi.json`, dan `/v1/demo` bisa diakses tanpa login.
- api memverifikasi token ke supabase. profil memakai rls pemilik. aktivitas hanya dapat dibaca dan ditulis backend dengan filter id pengguna dari token terverifikasi.

## materi dan model

materi demo fotosintesis dan pythagoras ditulis di `app/demo.py`, termasuk
rujukan, deskripsi diagram, transkrip, dan soal. audio dapat dibuat frontend
melalui baca nyaring atas teks tersebut.

unggahan mendukung pdf berbasis teks maksimal 4 mb, 50 halaman, dan total
100.000 karakter, atau teks tempel. sumber tersimpan sebagai teks per halaman
atau bagian. berkas pdf biner asli tidak disimpan pada tahap ini. pdf pindai
memerlukan teks tempel atau versi dengan teks yang dapat diekstrak.

hasil gemini divalidasi terhadap bentuk data, kunci soal, prasyarat, dan id
sumber. setiap konsep memiliki soal. hasil ditandai `generated_by_ai=true`.
pemetaan skill bkt dan deskripsi media untuk unggahan memerlukan peninjauan.
validasi otomatis sumber mengecek rujukan, sementara ketepatan semantik
penjelasan tetap perlu diperiksa pengguna terhadap teks sumber.

[catatan model](models/README.md) menjelaskan dataset, split per siswa,
parameter, dan batas evaluasi. artefak `models/bkt.json` memuat metrik lengkap.
data mentah berada di `data/raw` dan diabaikan git.

```powershell
uv run --group training python -m training.train_bkt --download
```

## pengujian

```powershell
uv run pytest -q
uv run ruff check app training scripts tests
uv run ruff format --check app training scripts tests
uv run python -m scripts.check_live --gemini --anonymous
```

tes live membuat akun sementara tanpa mengirim email, menjalankan alur nyata,
lalu menghapus akun yang dibuatnya beserta data terkait. opsi `--gemini`
menggunakan kuota api untuk materi contoh. jalankan setelah migrasi dan
konfigurasi provider tersedia.

tes sql memakai postgres wasm pglite dengan role supabase yang disimulasikan.
jalankan dari `supabase/tests`.

```powershell
npm ci
npm test
```

verifikasi 15 november 2026 mencakup 24 tes python, lint, tes sql, migrasi
supabase nyata, dua akun terisolasi, retry latihan, bkt, planner dan pemulihan,
pemrosesan gemini sampai materi tersimpan, serta demo anonim. deployment dan
pengujian antarmuka mengikuti tahap frontend dan integrasi.

## keputusan penyimpanan

aktivitas mvp disimpan sebagai satu dokumen jsonb per pengguna dengan revision
dan compare-and-swap. hasil tindakan dan receipt idempotensi tersimpan dalam
transaksi yang sama. dua penulis pada revision sama menghasilkan satu
keberhasilan dan satu konflik. api mengembalikan `409` agar frontend memuat
ulang sebelum mengirim perubahan baru.

pendekatan ini menjaga konsistensi lintas sesi, jawaban, dan rencana untuk mvp.
riwayat dan receipt masih tumbuh bersama dokumen. penggunaan jangka panjang
dengan banyak materi membutuhkan pemisahan tabel, pagination, dan kebijakan
arsip setelah kebutuhan nyata diukur.


## persiapan vercel

Buat proyek backend dengan Root Directory `backend` dan framework FastAPI.
`vercel.json` mengatur entrypoint `app/main.py`, durasi 120 detik, dan artefak
BKT. Training memakai dependency group terpisah; runtime tidak memerlukan
NumPy atau SciPy. Konfigurasi ini belum dibuktikan lewat deploy Vercel.

Isi variabel Supabase dan Gemini serta CORS_ORIGINS dengan origin frontend
produksi. DATABASE_URL hanya diperlukan saat migrasi; jangan masukkan ke
frontend. AI_DAILY_GLOBAL_LIMIT default 100 percobaan per hari UTC di seluruh
akun. Migrasi harus diterapkan sebelum backend versi ini dipakai.

Pengujian live terbaru mencakup konflik revisi profil serta upload sampai
Gemini menghasilkan materi. Kuota global diuji di PostgreSQL; pembatasan
pembuatan akun anonim di provider masih perlu dikonfigurasi sebelum publik.

# backend temanbelajar

Layanan Python untuk pembelajaran adaptif. Jalankan dari folder `backend`.

```powershell
uv sync
uv run uvicorn app.main:app --reload
```

Kontrak OpenAPI tersedia di `/openapi.json` dan dokumentasi interaktif di `/docs`.
Salin `.env.example` menjadi `.env` untuk konfigurasi layanan.

## tahapan

1. fondasi layanan dan kontrak
2. autentikasi, data privat dan sesi
3. pipeline pelatihan serta evaluasi bkt
4. materi, latihan, rekomendasi dan planner
5. integrasi gemini dan pemeriksaan backend

Implementasi backend sedang berjalan. Integrasi layanan eksternal memerlukan proyek Supabase dan API key Gemini.

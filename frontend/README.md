# frontend temanbelajar

Next.js App Router, React, TypeScript, Supabase Auth SDK, dan CSS dengan token
dari `DESIGN.md`. Font Jakarta Sans dan Nunito dibundel lokal; browser tidak
perlu meminta font ke Google.

## menjalankan

Dari folder `frontend`:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Isi `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, dan
`NEXT_PUBLIC_SUPABASE_ANON_KEY` pada `.env.local`. Gunakan anon/publishable key,
bukan service role. Backend lokal berjalan pada port 8000 dan frontend port
3000. Aktifkan anonymous sign-ins di Supabase untuk tombol coba demo. Untuk
email confirmation/tautan masuk, masukkan origin frontend pada daftar redirect
URL Supabase.

## alur yang tersedia

| layar desain | implementasi |
| --- | --- |
| 01–02 | landing, daftar/masuk email dan sandi, tautan masuk, demo anonim |
| 03–06 | kebutuhan mata pelajaran, preferensi aksesibilitas, tujuan/waktu/hari, pratinjau profil |
| 07 | dashboard dari materi, sesi, rekomendasi, dan rencana akun |
| 08–11 | katalog/pencarian, unggah PDF atau teks, status dan retry pemrosesan, ringkasan/sumber |
| 12–16 | pemilih lima mode, bacaan, satu paragraf per langkah, deskripsi visual, transkrip dan baca nyaring |
| 17–19 | satu soal setiap langkah, jawaban dan sumber setelah submit, hasil serta saran berikutnya |
| 20–21 | usulan awal, edit manual, recompute, bandingkan perubahan, terima/tunda, riwayat dan pulihkan |
| 22 | hasil jawaban teramati dan estimasi BKT ditampilkan terpisah |
| 23–24 | pengaturan aksesibilitas, profil/tujuan/jadwal, keluar akun |

Layar terkait memakai komponen bersama pada aplikasi utama. `/welcome`
mengarahkan ke aplikasi utama. Navigasi di dalam ruang belajar mempertahankan
state komponen induk. Muat ulang halaman membaca data akun kembali; pilih
materi yang sama untuk melanjutkan sesi yang belum selesai.
Penunjuk latihan terakhir disimpan pada perangkat agar latihan dapat dimuat
kembali dari jawaban server ketika sesi dibuka lagi.

Mutasi ber-request-id mempertahankan body dan id yang sama melalui tombol
retry. Konflik versi meminta peninjauan ulang; draf tidak otomatis ditimpa.
Token yang kedaluwarsa dicoba refresh satu kali. Seluruh skor dan perubahan
rencana tetap divalidasi server.

## pemeriksaan

```powershell
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Tes interaksi mencakup perpindahan format, latihan berurutan, kegiatan
terlindungi, peninjauan usulan, sumber unggahan, dan pratinjau onboarding.
Tes API mencakup idempotensi retry, refresh token, dan konflik versi.
Pemeriksaan aplikasi juga memastikan field milik server tidak ikut dikirim
saat profil diedit. Total 11 tes frontend, typecheck, lint, format, dan build
produksi sudah lolos. Sebanyak 24 tes backend juga tetap lolos.

Pada pemeriksaan 15 november 2026, smoke test layanan nyata belum dapat
berjalan karena koneksi/DNS Supabase gagal. Push GitHub juga sempat gagal
karena jaringan. Pemeriksaan visual belum terlaksana karena browser host dan
runtime computer-use tidak tersedia. Hasil build dan tes komponen tidak
menggantikan audit browser serta pengujian layanan nyata ini.

Untuk smoke test modul API frontend melawan layanan nyata, jalankan backend
lokal, lalu dari folder `backend`:

```powershell
uv run python -m scripts.check_frontend
uv run python -m scripts.check_frontend --gemini
```

Runner membuat akun anonim sementara dan menghapusnya beserta data terkait.
Token masuk ke proses Node lewat stdin. Kunci server tetap di backend dan
tidak disalin ke konfigurasi frontend. Opsi Gemini menggunakan kuota API.

## batas yang perlu diketahui

- PDF pindai belum didukung OCR; sumber PDF tersimpan sebagai teks halaman.
- Jelajah visual dan transkrip tersedia bila materi memiliki konten yang sesuai.
  Deskripsi diagram bersifat teks; baca nyaring memakai suara Indonesia yang
  tersedia pada browser/perangkat, tanpa berkas audio prarekaman.
- BKT eksperimental hanya memetakan skill Pythagoras. Konsep lain tetap
  menampilkan hasil latihan tanpa mengarang estimasi penguasaan.
- Target aksesibilitas adalah WCAG 2.2 AA. Audit visual, pembaca layar, dan
  pengujian pengguna masih diperlukan sebelum menyatakan kepatuhan.
- Deployment belum dilakukan pada tahap implementasi ini.

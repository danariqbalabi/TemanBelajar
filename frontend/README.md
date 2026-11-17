# frontend temanbelajar

Next.js App Router, React, TypeScript, Supabase Auth SDK, Tailwind CSS, dan CSS dengan token
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

Saat aplikasi dibuka, landing ditampilkan lebih dahulu meski sesi login masih
tersimpan. Tombol mulai melanjutkan ke beranda untuk sesi aktif, atau ke halaman
masuk jika belum login. Onboarding empat langkah bersifat pilihan melalui
?Atur preferensi belajar? di beranda; status profil yang belum selesai tidak
mengalihkan pengguna secara otomatis. Preferensi awal tetap dapat dipakai.

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
saat profil diedit. Total 18 tes frontend, typecheck, lint, format, dan build
produksi sudah lolos. Sebanyak 24 tes backend juga tetap lolos.

Pemeriksaan ulang 15 november 2026 berhasil menjalankan modul API frontend
melawan backend lokal, Supabase, dan Gemini nyata. Alur yang lolos mencakup
SDK auth, profil, katalog, sesi, posisi/catatan, latihan dan retry, progres,
rekomendasi, usulan/terima perubahan planner, serta unggahan teks sampai
hasil Gemini tersimpan dan dibaca kembali. Akun tes dan data terkait sudah
dihapus sesudah pemeriksaan. Commit frontend sudah dipush ke GitHub.

Pemeriksaan visual belum terlaksana karena browser host dan runtime
computer-use tidak tersedia. Hasil build, tes komponen, dan smoke test API
tidak menggantikan audit interaksi browser serta pembaca layar.

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

- Screen 01–12 menggunakan struktur HTML Stitch asli, logo/Mimo dari arsip
  pengguna, dan ikon Material Symbols lokal. Tampilan dashboard tetap memakai
  data akun. Screen 13?19 mencakup format baca, latihan, hasil, dan rekomendasi;
  screen 20?21 mencakup rencana dan peninjauan usulan; screen 22?24 mencakup
  progres, aksesibilitas, dan profil. Isi contoh desain diganti data server.
  Perbandingan visual browser belum terverifikasi: pemeriksaan terakhir tetap
  melaporkan `The browser access host is unavailable`.
- Pilihan pengaturan mengikuti field yang dapat disimpan backend. Huruf yang
  tersedia adalah Jakarta Sans, Nunito, dan font sistem. Baca nyaring memakai
  suara peramban, tanpa klaim suara Mimo prarekaman atau pencarian detik audio.
  Ekspor preferensi berisi profil JSON; cetak progres memakai dialog cetak
  peramban. Riwayat emosi, reset riwayat, dan hapus akun belum tersedia.

- PDF pindai belum didukung OCR; sumber PDF tersimpan sebagai teks halaman.
- Jelajah visual dan transkrip tersedia bila materi memiliki konten yang sesuai.
  Deskripsi diagram bersifat teks; baca nyaring memakai suara Indonesia yang
  tersedia pada browser/perangkat, tanpa berkas audio prarekaman.
- BKT eksperimental hanya memetakan skill Pythagoras. Konsep lain tetap
  menampilkan hasil latihan tanpa mengarang estimasi penguasaan.
- Target aksesibilitas adalah WCAG 2.2 AA. Audit visual, pembaca layar, dan
  pengujian pengguna masih diperlukan sebelum menyatakan kepatuhan.
- Deployment belum dilakukan pada tahap implementasi ini.


## revamp november 2026

Seluruh kelompok screen 01?24 sudah dipindahkan ke struktur ekspor revamp
baru. Detail pemetaan dan batas kemampuan ada di [REVAMP.md](REVAMP.md).
Upload yang berhasil sekarang langsung membuka detail job tanpa memulai AI;
proses harus dimulai secara eksplisit. Skor, jawaban, progres dan jadwal
mengikuti respons server. Audit visual masih terhalang browser host.

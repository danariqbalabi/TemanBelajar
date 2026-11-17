# Audit backend dan training — 17 November 2026

## Cakupan

Seluruh modul `app`, pipeline `training/train_bkt.py`, kontrak respons,
skrip migrasi, dan migrasi database ditinjau. Pemeriksaan menggabungkan pembacaan
kode, tes regresi, eksekusi training, PostgreSQL lokal (PGlite), dan provider asli.
Audit ini tidak membuktikan semua kombinasi input atau kapasitas produksi.

| Area | Pemeriksaan dan hasil |
| --- | --- |
| Akun dan profil | Verifikasi token, isolasi dua akun, RLS, revisi profil, validasi preferensi |
| Sesi dan latihan | Versi stale ditolak; request retry idempoten; jawaban dinilai sekali; kunci disembunyikan sebelum dijawab |
| Upload dan AI | Batas PDF/teks, rujukan sumber, sanitasi pemetaan skill, retry/timeout/lease, kuota per akun dan global |
| Rekomendasi | Urutan prasyarat, jawaban salah, anggaran waktu, latihan parsial, tanpa mastery palsu untuk skill tidak didukung |
| Planner | Batas waktu harian, tabrakan, prasyarat, status selesai/terkunci, proposal/accept/restore/recompute |
| Database | Migrasi, izin role, isolasi pengguna, konflik revision, rollback reservasi AI |
| BKT | Checksum dataset, deduplikasi, urutan jawaban, split per siswa, prediksi sebelum update, kesamaan rumus training/runtime |
| Training | Lima inisialisasi konvergen; pemilihan berdasarkan validation; test tidak dipakai memilih parameter; output atomik |

## Bug yang diperbaiki

1. Paragraf dan pilihan jawaban kosong dari AI dapat lolos. Sekarang setiap item
   dibatasi panjangnya dan divalidasi setelah trim, termasuk keunikan opsi.
2. Teks panjang dengan satu chunk berisi whitespace dapat menyebabkan error
   server. Chunk kosong dilewati, ID bagian asli dipertahankan. Judul PDF kosong ditolak.
3. Aktivitas skipped dapat menyimpan prasyarat yang sudah hilang, lalu gagal
   dengan KeyError saat dimulai. Referensi divalidasi di semua status; data lama
   mendapat respons 422. Restore juga tunduk pada batas 100 aktivitas.
4. Satu jawaban benar dapat membuat latihan parsial dianggap tuntas oleh
   rekomendasi. Sekarang cakupan ID soal diperiksa sebelum menyatakan selesai.
5. Kegagalan TLS, bentuk respons Gemini rusak, dan output terpotong belum
   ditangani sepenuhnya. Job kini gagal secara terkendali, sumber tetap tersimpan.
6. Artefak BKT tanpa versi dapat menyebabkan error saat progress dibaca.
   Artefak tidak valid sekarang tidak menghasilkan estimasi. Penulisan hasil
   training memakai file sementara dan atomic replace, menolak NaN/Infinity.
7. Reservasi kuota global dapat terpotong sebelum penulisan job kalah konflik.
   Migrasi 008 menyatukan keduanya: konflik tidak dibebankan, kuota penuh
   membatalkan perubahan state dalam transaksi yang sama.

## Validasi

- `uv run pytest -q`: 52 tes lulus.
- `uv run ruff check app training scripts tests`: lulus.
- `uv run ruff format --check app training scripts tests`: lulus.
- `npm test` di `supabase/tests`: lulus, termasuk rollback kuota dan stale writer.
- Training ulang: 196 siswa train, 34 validation, 39 test; output sama persis
  dengan artefak aktif (SHA-256 `193e21a7d6dd6e79a19b3e2d77b3f671d9c677cc5faf3cb8d7493c9ca29a9380`).
- Pemeriksaan live memakai akun sementara yang dihapus setelah pengujian;
  tidak mengirim email pengguna. Mencakup Supabase auth/data dan Gemini asli.

## Batas yang masih berlaku

- Gemini adalah provider generasi; repo tidak melatih LLM sendiri. Training lokal
  hanya model BKT empat parameter untuk skill contoh Pythagoras.
- Test AUC BKT 0,5741 menunjukkan daya prediksi terbatas. Belum ada kalibrasi
  siswa Indonesia atau bukti dampak belajar. Fotosintesis dan unggahan AI tidak
  memperoleh angka mastery BKT sampai pemetaan skill ditinjau.
- Pengulangan soal yang sama tetap dihitung sebagai observasi baru. Efek hafalan
  dan transfer lintas materi belum dimodelkan; ini batas interpretasi mastery.
- Validasi sumber memeriksa struktur/rujukan, bukan menjamin kebenaran semantik
  semua kalimat AI. Konten perlu ditinjau terhadap sumber.
- Snapshot penuh, receipts, dan history masih tumbuh; audit tidak mencakup
  load test produksi atau kebijakan retensi/pagination.
- Pemrosesan masih terkait request HTTP dengan lease dua menit, bukan worker
  durable. Proses yang mati dapat dicoba ulang setelah lease kedaluwarsa.
- Pembatasan signup anonim di provider, deploy produksi, dan pengiriman email
  tidak diverifikasi pada audit ini.

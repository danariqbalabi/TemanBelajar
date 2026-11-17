# Kesiapan pemakaian TemanBelajar

Pemeriksaan 17 November 2026. Perbaikan berikut sudah tersedia di branch
`feat/frontend-desain-final`; ini bukan pernyataan bahwa deploy produksi telah selesai.

## Ketahanan alur harian

- Latihan aktif dipulihkan dari server ketika sesi dibuka di browser/perangkat
  lain. Permintaan mulai latihan untuk sesi dan soal yang sama melanjutkan
  pekerjaan aktif, tanpa menggandakan attempt. Setelah selesai, pengguna dapat
  mengulang dengan attempt baru.
- Draf catatan disimpan lokal per sesi dan dipulihkan saat halaman dibuka lagi.
  UI membedakan draf lokal dari catatan yang sudah disimpan ke akun. Edit baru
  selama permintaan simpan berjalan tidak dibuang ketika respons lama datang.
  Penyimpanan lokal bisa dihapus oleh browser dan bukan pengganti sinkronisasi
  akun; tombol Simpan catatan tetap diperlukan untuk lintas perangkat.
- Kegagalan bootstrap tidak lagi membuka ruang belajar dengan profil default
  atau koleksi kosong. Pengguna mendapat pesan dan tombol pemulihan. Respons
  bootstrap akun sebelumnya diabaikan setelah pergantian akun.
- Rekomendasi beranda memakai materi sesi terbaru dan budget harian tersimpan.
  Reader dan halaman progres juga memakai budget itu. Banner target mengikuti
  preferensi pengguna.
- Error render mempunyai halaman pemulihan. Logout tidak dilaporkan berhasil
  apabila SDK mengembalikan error.

## Pemeriksaan otomatis

Workflow `.github/workflows/quality.yml` berjalan pada push dan pull request:
frontend lint/test/build/typecheck, backend lint/format/test, serta tes SQL dengan
PGlite. Dependency dipasang dari lockfile; provider produksi dan data siswa tidak
diperlukan. Actions dipatok ke commit dari repositori resmi
[checkout](https://github.com/actions/checkout),
[setup-node](https://github.com/actions/setup-node), dan
[setup-python](https://github.com/actions/setup-python).

Aktifnya workflow tidak otomatis mewajibkan hasil hijau sebelum merge; branch
protection perlu diatur di GitHub sesuai branch rilis. Live provider checks
tetap perintah terpisah karena membuat akun sementara dan dapat memakai kuota AI.

## Pekerjaan berikutnya sebelum peluncuran luas

1. **Deploy dan operasi:** tetapkan domain/frontend/backend produksi, konfigurasi
   email dan redirect auth, monitoring error, serta latihan restore backup.
   Build lokal atau test provider tidak membuktikan semua konfigurasi deploy ini.
2. **Job AI durable:** pindahkan pemrosesan dari request HTTP ke antrean/worker
   persisten agar tab atau proses server yang mati tidak memerlukan retry manual.
3. **Pengelolaan data:** pagination per koleksi, arsip/hapus materi beserta aturan
   dependensinya, ekspor/hapus akun, dan kebijakan retensi riwayat/receipts.
4. **Navigasi:** URL halaman/detail dan pemulihan posisi navigasi setelah reload
   masih perlu menggantikan perpindahan screen berbasis state.
5. **Mutu belajar:** review konten AI, bank soal yang lebih beragam, evaluasi
   dengan pengguna nyata, dan kalibrasi BKT. Model saat ini belum cukup untuk
   klaim penguasaan semua mata pelajaran.

Rincian audit model, keamanan data, dan batas backend ada di
[backend/AUDIT.md](backend/AUDIT.md).

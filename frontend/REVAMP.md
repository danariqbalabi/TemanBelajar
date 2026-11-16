# desain final temanbelajar

acuan aktif: `stitch_mascot_brand_design_system.zip`.
lihat `design-reference/manifest.json` untuk pemetaan 24 layar dan hash sumber.
landing memakai `revamped`; akun, kebutuhan belajar, dan pemrosesan memakai
`polished`; pemilih mode memakai `visual_ringkas`. html referensi disimpan
untuk perbandingan, tidak dimuat atau menjalankan skrip simulasi di aplikasi.

implementasi mengikuti struktur dan kelas ekspor. konten akun, materi,
soal, status unggahan, hasil, rekomendasi, dan jadwal berasal dari api.
contoh jadwal onboarding dan contoh interaksi landing diberi konteks pratinjau.
logo, ikon, dan mimo memakai aset asli dari arsip tanpa menggambar ulang.
css ekspor dibatasi per layar agar tidak bocor ke halaman lain; reset khusus
mencegah aturan tata letak lama menimpa desain final.

alur aktif:
- akun demo anonim dan tautan masuk email;
- empat langkah preferensi opsional dengan pratinjau sebelum simpan;
- pustaka, unggah pdf/teks, status dan coba ulang pemrosesan, sumber, mode;
- lima format belajar, posisi, catatan, baca nyaring browser, latihan server;
- pembahasan, alasan rekomendasi, rencana/usulan dengan pemeriksaan versi;
- progres teramati, estimasi penguasaan jika tersedia, pengaturan profil.

batas layanan dijelaskan melalui kontrol nonaktif: google sso belum
terkonfigurasi, foto/ocr/word, font tambahan, audio prarekaman, pengingat,
penghapusan/reset akun, dan diagram generatif belum tersedia. deskripsi dan
transkrip mengikuti materi aktual; ilustrasi ginjal contoh tidak digunakan
untuk materi fotosintesis atau unggahan lain. lebar baca maksimal 80 karakter
mengikuti kontrak backend. mengubah preferensi tidak otomatis mengganti jadwal.

verifikasi browser visual belum tersedia: alat mengembalikan
`The browser access host is unavailable`. karena itu kesamaan piksel dan audit
visual interaktif belum dinyatakan lulus. tes komponen/alur, lint, typecheck,
build produksi, dan smoke test api nyata dicatat pada hasil pengerjaan.

hasil pemeriksaan 16 november 2026:
- 23 tes frontend dan 31 tes backend lulus.
- lint frontend tanpa warning, format dan typecheck lulus.
- build produksi webpack lulus. turbopack gagal membuat worker karena
  keterbatasan sumber daya windows; skrip dev/build memakai webpack.
- smoke test modul api frontend terhadap supabase dan gemini lulus:
  auth, profil/revision, katalog, sesi/catatan, latihan, idempotensi,
  progres, rekomendasi, planner, dan unggahan/pemrosesan.
- akun pengujian sementara beserta datanya telah dibersihkan.
- perbaikan backend: kegagalan tls mentah menjadi respons 503 yang aman,
  tanpa mengulang mutasi otomatis atau mematikan verifikasi sertifikat.
- pemeriksaan visual browser masih belum tersedia; tidak ada klaim pixel-perfect.

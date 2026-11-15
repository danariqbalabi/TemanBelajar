# implementasi revamp ui november 2026

Acuan: `stitch_duplicate_of_temanbelajar_design_system (1).zip`.
24 ekspor revamp dipakai sebagai struktur tampilan; beranda memakai versi pose
2d Mimo. Script inline ekspor tidak dijalankan. Aksi dibind ke state React,
Supabase Auth, dan API backend. Data contoh diganti data akun.

- 01?02: landing dan akun, demo anonim, tautan email.
- 03?06: kebutuhan, preferensi, tujuan/hari, pratinjau sebelum simpan.
- 07?12: dashboard, katalog, PDF/teks, status job, sumber/ringkasan, format.
- 13?19: empat tampilan baca dan standar, catatan/posisi, latihan server,
  hasil dan sumber penjelasan, rekomendasi dan alternatif tersedia.
- 20?24: rencana/usulan/riwayat, progres, aksesibilitas dan profil revision.

Tes memeriksa mutasi nyata melalui mock API dan integrasi live terpisah
memakai Supabase dan Gemini. Build produksi, typecheck, lint dan format
menjadi pemeriksaan wajib. Pemeriksaan visual browser belum dapat dilakukan:
browser access host tidak tersedia. Jangan menyebut hasil ini pixel-perfect.

Batas produk yang terlihat pada desain tetapi belum tersedia pada layanan:
OCR/foto/DOCX/EPUB, suara Mimo prarekaman, audio latar, video/animasi yang
tersinkronisasi dengan narasi, percakapan bebas tentang diagram, font
OpenDyslexic, reset BKT dan hapus akun melalui UI. Kontrol terkait dinonaktifkan,
dihilangkan atau diberi label kemampuan nyata. Teks sumber tetap dapat dibaca,
dan suara menggunakan peramban. Tidak ada klaim akurasi AI atau kepatuhan
WCAG yang dianggap terbukti hanya dari file desain.

Navigasi aplikasi saat ini berbasis state pada halaman utama, bukan seluruh
rute URL contoh di handoff. Posisi sesi dan data server tetap tersimpan.

# TemanBelajar

**Belajar dengan caramu.**

TemanBelajar adalah web app pembelajaran inklusif dan adaptif yang dirancang untuk siswa SMP dan SMA. Siswa bisa membawa materi sendiri, memilih cara belajar yang sesuai dengan kebutuhannya, lalu mendapat saran dan rencana belajar berdasarkan hasil latihan. Mimo, bunglon 2D, menemani siswa saat mulai belajar dan meninjau langkah berikutnya.

**status proyek:** backend mvp tersedia di branch `feat/backend-temanbelajar`. branch `feat/frontend-temanbelajar` menambahkan alur antarmuka dari akun dan onboarding sampai materi, sesi, latihan, rekomendasi, progres, dan planner berversi. verifikasi browser dan deployment masih menjadi pemeriksaan berikutnya.

lihat [panduan frontend](frontend/README.md), [panduan backend](backend/README.md), [kontrak api](backend/API.md), dan [evaluasi model](backend/models/README.md) untuk menjalankan serta menguji layanan.

## Masalah yang ingin diselesaikan

Materi sekolah sering tersedia dalam satu format, sementara siswa bisa membutuhkan cara yang berbeda untuk mengakses informasi yang sama. Hambatan dapat muncul saat membaca teks panjang, mengikuti beberapa instruksi sekaligus, memahami diagram, atau belajar dari audio. TemanBelajar membawa dukungan itu ke seluruh alur, dari membuka materi sampai memilih kegiatan berikutnya.

| Kebutuhan siswa | Dukungan yang dirancang |
| --- | --- |
| Disleksia atau kesulitan membaca | Teman Baca dengan ukuran dan spasi teks yang bisa diatur, fokus baris, glosarium, dan baca nyaring jika tersedia. |
| ADHD atau kesulitan mempertahankan fokus | Mode Fokus dengan satu langkah setiap saat, timer opsional, serta jeda dan lanjut dari posisi terakhir. |
| Tunanetra atau penglihatan rendah | Navigasi keyboard, dukungan pembaca layar, kontras tinggi, dan deskripsi diagram pada materi yang mendukungnya. |
| Tuli atau hambatan pendengaran | Penjelasan yang dapat dibaca, transkrip audio, serta caption untuk materi video yang didukung. |

Siswa dapat memilih beberapa dukungan sekaligus dan mengubahnya saat belajar. Preferensi bersifat opsional dan dipilih tanpa menyebut diagnosis. Target desain aksesibilitas adalah WCAG 2.2 AA untuk alur inti.

## Alur MVP

1. **Tentukan tujuan.** Pilih bantuan belajar yang dibutuhkan, mata pelajaran, dan waktu yang tersedia.
2. **Buka materi.** Coba materi contoh, unggah PDF berbasis teks, atau tempel teks. Gemini membantu menyusun ringkasan, konsep, dan latihan dengan rujukan ke materi asli.
3. **Belajar dengan format yang sesuai.** Gunakan Teman Baca, Mode Fokus, atau tampilan standar. Posisi belajar mengikuti sesi saat format diganti.
4. **Kerjakan latihan.** Simpan jawaban dan lihat penjelasan. Pada skill yang didukung, model Bayesian Knowledge Tracing (BKT) memperkirakan penguasaan dari riwayat jawaban.
5. **Pilih langkah berikutnya.** Tinjau alasan rekomendasi dan perkiraan durasinya. Siswa bisa mengikuti, mengganti, atau melewati saran.
6. **Tinjau jadwal.** Bandingkan usulan dengan jadwal saat ini. Siswa bisa menerima, mengubah, menunda, atau memulihkan jadwal.

## Rencana teknologi

| Bagian | Teknologi yang direncanakan |
| --- | --- |
| Antarmuka | Next.js, React, TypeScript, dan CSS dengan design tokens |
| Akun, data, dan penyimpanan privat | Supabase Auth, PostgreSQL, dan Storage |
| Pengolahan materi | Gemini API dengan validasi hasil di server |
| Estimasi penguasaan | Bayesian Knowledge Tracing dalam Python, disajikan melalui FastAPI |
| Rekomendasi dan jadwal | Aturan aplikasi berdasarkan hasil latihan, pilihan format, dan waktu yang tersedia |

## Dokumentasi dan alat

- [DESIGN.md](./DESIGN.md) memuat design tokens, aturan penggunaan Mimo, pola aksesibilitas, inventaris 24 layar, dan alur interaksi.
- Google Stitch digunakan untuk eksplorasi desain dan prototipe antarmuka. OpenAI Codex digunakan untuk membantu dokumentasi, implementasi backend, pengujian, serta pipeline training model. dataset ASSISTments, pustaka, dan batas evaluasi dicantumkan dalam dokumentasi backend dan model.

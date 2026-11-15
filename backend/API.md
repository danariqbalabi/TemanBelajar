# kontrak integrasi frontend

base url lokal `http://localhost:8000`. gunakan `/openapi.json` dari aplikasi
yang sedang berjalan untuk tipe request dan response lengkap.

## aturan umum

setiap endpoint privat memakai bearer access token supabase. backend menentukan
pemilik dari token tersebut. simpan refresh token menggunakan mekanisme auth
supabase pada frontend. akun email, tautan masuk, logout, dan demo anonim
menggunakan supabase auth sdk.

untuk tindakan yang memiliki `request_id`, frontend membuat uuid satu kali
dan mempertahankannya saat retry dengan body yang sama. untuk tindakan baru,
buat uuid baru. hasil retry mengembalikan hasil tindakan pertama meski objek
sudah berubah sesudahnya; muat ulang objek jika membutuhkan versi terkini.

`expected_version` adalah versi objek terakhir yang sedang ditinjau. pada
`409`, muat ulang objek dan tampilkan pilihan yang masih belum tersimpan untuk
ditinjau. gunakan request id baru setelah pengguna menyetujui isi terbaru.

| status | penanganan |
| --- | --- |
| `401` | segarkan sesi atau arahkan masuk |
| `404` | objek belum dibuat atau tidak dapat diakses akun ini |
| `409` | versi konflik, request id berbeda isi, atau proses masih berjalan |
| `413` | unggahan terlalu besar |
| `429` | kuota tercapai atau proses lain masih berjalan; jangan retry otomatis |
| `422` | isian, rujukan, kapasitas, atau jadwal perlu diperbaiki |
| `502` | respons provider belum valid; data sebelumnya tetap tersedia |
| `503` | konfigurasi belum lengkap atau provider belum tersedia |

error memiliki `detail`. error validasi input juga memuat `fields` dengan path
dan tipe masalah. UI perlu mempertahankan input selama retry.

## akun dan onboarding

`GET /v1/demo` mengembalikan katalog contoh publik dan nama Manda. untuk demo
yang menyimpan progres, lakukan `supabase.auth.signInAnonymously()`, kemudian
pakai token yang diperoleh untuk endpoint privat.

`GET /v1/profile` mengembalikan `404` jika belum ada profil.
`PUT /v1/profile` menyimpan dokumen profil lengkap dengan `expected_revision`.
Gunakan 0 untuk profil baru, atau `revision` hasil GET terakhir untuk perubahan.
Konflik mengembalikan 409; pertahankan draf lalu tinjau profil terbaru. field penting mencakup
`display_name`, `timezone`, `daily_minutes`, `goal`, `subjects`,
`available_days` (senin 0 sampai minggu 6), `exam_date`, `onboarding_step`,
dan `preferences`. baca nilai tersimpan sebelum menyimpan perubahan satu bagian.
preferensi yang tidak dikirim memakai default pada skema.

## materi dan pemrosesan

| endpoint | fungsi |
| --- | --- |
| `GET /v1/materials` | katalog contoh dan materi milik akun |
| `GET /v1/materials/{id}` | konsep, paragraf, sumber, format dan jumlah soal |
| `POST /v1/materials/text` | body `request_id`, `title`, `text`; hasil `202` dan job |
| `POST /v1/materials/pdf` | multipart `request_id`, `title`, `file`; hasil `202` dan job |
| `GET /v1/jobs` | daftar pemrosesan milik akun |
| `GET /v1/jobs/{id}` | status queued, processing, failed, atau ready |
| `GET /v1/jobs/{id}/source` | teks sumber yang telah diekstrak |
| `POST /v1/jobs/{id}/process` | mulai atau ulang pemrosesan; hasil akhir job |

setelah upload, frontend memanggil `process` dan bisa membaca status job dari
permintaan lain. panggilan pemrosesan menunggu AI sampai selesai dengan timeout
provider 90 detik. state job disimpan sebelum panggilan AI. gunakan server ASGI
dengan timeout HTTP yang sesuai. job ready dapat dipanggil ulang dengan aman.
lease processing kedaluwarsa setelah dua menit jika worker terputus, lalu
permintaan process berikutnya dapat mengambil alih. jalur MVP ini dipicu HTTP.

penjelasan AI memiliki rujukan sumber. format `explore` tersedia jika konsep
punya `diagram_description`; format `transcript` jika ada `transcript`.
standard, reading, dan focus memakai paragraf yang sama. unggahan AI saat ini
menyediakan ketiga format teks tersebut.

## sesi dan latihan

`POST /v1/sessions` menerima `request_id`, `material_id`, dan `mode`.
`GET /v1/sessions` diurutkan menurut aktivitas terbaru.
`GET /v1/sessions/{id}` memuat posisi, mode, draft, dan version.

`PUT /v1/sessions/{id}` menerima `request_id`, `expected_version`,
`concept_id`, `paragraph` berbasis nol, `mode`, `status`, `completed_concepts`,
dan `draft`. saat berganti mode, kirim posisi serta draft tersimpan. penanda
konsep selesai bersifat kumulatif. `completed` memerlukan semua konsep selesai.

`POST /v1/attempts` menerima `request_id`, `session_id`, dan opsional
`concept_id`. setiap pengulangan latihan membuat attempt baru. ambil attempt
dengan `GET /v1/attempts/{id}`.

`POST /v1/attempts/{id}/answers` menerima `request_id`, `expected_version`,
`question_id`, dan `selected_index` berbasis nol. kirim sesuai urutan soal.
kunci dan penjelasan hanya muncul untuk soal yang sudah dijawab. status
attempt berubah menjadi completed setelah seluruh jawaban tersimpan.

## rekomendasi dan progres

`GET /v1/recommendations?material_id=...&available_minutes=15` memberikan
aksi REVIEW, PRACTICE, ADVANCE, atau RESCHEDULE, alasan berbasis data, durasi,
dan alternatif SWITCH ke format tersedia. frontend dapat melewati saran
dengan kembali ke sumber; tindakan ini tidak mengubah jawaban atau jadwal.

`GET /v1/progress?material_id=...` memberikan jumlah jawaban tepat/total dan
estimasi penguasaan per konsep. gunakan `mastery=null` sebagai belum cukup
data atau skill belum didukung. tampilkan status model dan hasil observasi
sebagai informasi tersendiri. estimasi aktif setelah sedikitnya tiga jawaban
pada skill Pythagoras yang telah dipetakan.

## planner

`POST /v1/plans/suggest` menerima `material_id`, `start_at` ber-offset zona
waktu, serta `available_minutes`. hasilnya daftar kegiatan awal yang muat
dalam waktu tersebut dan mengikuti prasyarat. tampilkan usulan sebelum simpan.

`POST /v1/plans` menerima `request_id`, `timezone`, `daily_minutes`, dan
`activities`. aktivitas memiliki id, judul, start_at, duration_minutes,
status, locked, dan prerequisites. tautan material_id, concept_id, dan kind
memungkinkan tombol mulai membuka sesi atau latihan yang tepat. untuk
kegiatan manual, tautan materi boleh kosong dengan kind custom.

| endpoint | fungsi |
| --- | --- |
| `GET /v1/plans` | seluruh rencana akun |
| `GET /v1/plans/{id}` | rencana aktif, history, dan proposals |
| `POST /v1/plans/{id}/proposals` | usulkan daftar kegiatan yang sudah diedit dengan expected_version dan reason |
| `POST /v1/plans/{id}/recompute` | usulan dari hasil latihan; body request_id, expected_version, material_id, start_at |
| `POST /v1/plans/{id}/proposals/{proposal_id}/accept` | terapkan versi yang ditinjau |
| `POST /v1/plans/{id}/proposals/{proposal_id}/dismiss` | tunda usulan |
| `POST /v1/plans/{id}/activities/{activity_id}/status` | ubah status dengan expected_version |
| `POST /v1/plans/{id}/restore` | pulihkan target_version dengan expected_version |

setelah hasil latihan atau perubahan waktu, frontend dapat meminta recompute
lalu menampilkan `changes` serta `reason`. rencana aktif tetap berlaku sampai
accept. recompute menempatkan saran prioritas, menghindari bentrok, menjaga
kapasitas harian, dan menawarkan tanggal berikutnya bila penuh. form edit
manual memungkinkan pengguna memilih waktu/hari lain sebelum accept.

usulan mempertahankan aktivitas selesai, berjalan, atau terkunci. restore
mempertahankan keadaan terlindungi terbaru lalu memeriksa konflik ulang.
jadwal dengan konflik, prasyarat tidak sah, kegiatan melewati tengah malam,
atau total harian berlebih ditolak. batas usulan otomatis 15 hari; kegiatan
yang tidak muat memerlukan durasi atau waktu pilihan pengguna.


## batas pemakaian pemrosesan

PDF maksimal 4 MiB agar multipart tetap di bawah batas payload Vercel.
Setiap akun dibatasi 10 unggahan baru dan 20 percobaan AI per hari UTC,
serta satu pemrosesan AI aktif. Percobaan gagal tetap memakai kuota AI.
Retry unggahan dengan request_id dan isi sama serta job ready tidak memakai
kuota lagi. Kuota global default 100 percobaan AI per hari UTC berlaku untuk seluruh akun,
termasuk anonim, dan direservasi atomik di PostgreSQL. Atur melalui
AI_DAILY_GLOBAL_LIMIT. Reservasi yang diikuti konflik simpan tetap terhitung
secara konservatif. Kuota ini membatasi jumlah panggilan, bukan nominal biaya.

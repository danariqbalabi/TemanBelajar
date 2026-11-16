---
version: alpha
name: TemanBelajar
description: Desain Gen Z pastel, identitas TemanBelajar, dan spesifikasi pengalaman belajar inklusif.
colors:
  primary: "#273B35"
  primary-hover: "#1B3029"
  primary-pressed: "#13251F"
  mint: "#C8E8CE"
  lavender: "#A8B7F5"
  peach: "#FFCA9D"
  butter: "#FFE7A3"
  mint-tint: "#EAF6EB"
  lavender-tint: "#F0EDFC"
  peach-tint: "#FFF0E6"
  butter-tint: "#FFF5D6"
  canvas: "#F8F7F2"
  surface: "#FFFFFF"
  muted-gray: "#737B75"
  text-secondary: "#505C55"
  divider: "#E5E8E1"
  control-border: "#68756C"
  focus: "#3B4C9B"
  success: "#28583E"
  warning: "#61450E"
  error: "#892E32"
  error-surface: "#FAE7E5"
  contrast-ink: "#101A16"
typography:
  display: {fontFamily: Nunito, fontSize: 3.5rem, fontWeight: 800, lineHeight: 1.08}
  display-mobile: {fontFamily: Nunito, fontSize: 2.25rem, fontWeight: 800, lineHeight: 1.15}
  page-title: {fontFamily: Plus Jakarta Sans, fontSize: 2rem, fontWeight: 750, lineHeight: 1.25}
  page-title-mobile: {fontFamily: Plus Jakarta Sans, fontSize: 1.625rem, fontWeight: 750, lineHeight: 1.3}
  section-title: {fontFamily: Plus Jakarta Sans, fontSize: 1.375rem, fontWeight: 700, lineHeight: 1.35}
  card-title: {fontFamily: Plus Jakarta Sans, fontSize: 1.125rem, fontWeight: 700, lineHeight: 1.4}
  body: {fontFamily: Plus Jakarta Sans, fontSize: 1rem, fontWeight: 400, lineHeight: 1.6}
  reading: {fontFamily: Plus Jakarta Sans, fontSize: 1.125rem, fontWeight: 400, lineHeight: 1.7}
  label: {fontFamily: Plus Jakarta Sans, fontSize: 0.875rem, fontWeight: 650, lineHeight: 1.5}
  metadata: {fontFamily: Plus Jakarta Sans, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.5}
  mimo-voice: {fontFamily: Nunito, fontSize: 1.125rem, fontWeight: 750, lineHeight: 1.45}
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px
rounded:
  small: 8px
  control: 12px
  card: 16px
  feature: 24px
  pill: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "{spacing.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "{spacing.md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  recommendation:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.feature}"
    padding: "{spacing.lg}"
  card-mode:
    backgroundColor: "{colors.lavender-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  chip-selected:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
  error-message:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error}"
    rounded: "{rounded.small}"
---

# TemanBelajar · DESIGN.md

## Overview

**Belajar dengan caramu.** TemanBelajar membantu siswa SMP dan SMA memilih cara belajar yang nyaman, memahami materi, dan menentukan langkah berikutnya lewat rekomendasi yang bisa dijelaskan serta rencana belajar harian yang bisa diatur sendiri. Gunakan preferensi yang dipilih siswa tanpa meminta diagnosis. Semua antarmuka menggunakan bahasa Indonesia.

Panduan ini merevisi arah visual TemanBelajar untuk Google Stitch dan menjadi acuan implementasi. Inventaris 24 layar mencakup seluruh alur desain. Gunakan PRD terbaru untuk prioritas rilis. Teman Baca, Fokus, diagram berdeskripsi dan media dengan transkrip pada materi contoh, latihan, rekomendasi, dan planner adalah bagian dari pengalaman inklusif yang perlu terlihat pada prototipe.

### Arah visual

TemanBelajar terasa seperti zine belajar Gen Z yang dirancang rapi. Pakai tipografi bulat, kanvas krem, kontras forest yang tegas, dan pastel yang cukup terasa dari jauh. Buat komposisi sedikit asimetris dengan satu fokus utama, panel kertas berwarna, serta detail yang punya hubungan dengan belajar. Tampil playful dan hangat untuk siswa SMP/SMA.

- **Landing.** Padukan judul Nunito yang besar dengan Mimo asli di sampingnya. Letakkan panel butter atau mint di belakang komposisi hanya jika aset aslinya transparan atau tepinya menyatu tanpa mengubah gambar. Pakai tab indeks atau garis pensil pendek sebagai aksen di luar gambar. Di mobile, tampilkan judul dan CTA sebelum ilustrasi.
- **Beranda.** Satu kartu mint besar menonjolkan rekomendasi dan tindakan berikutnya. Jadwal menjadi daftar ringkas dengan jam yang tegas. Kartu materi bisa punya elemen sampul berupa diagram sederhana atau tab mata pelajaran agar siswa cepat mengenali isi.
- **Layar kerja.** Onboarding memakai kelompok pilihan pendek. Saat membaca, latihan, atau fokus, putih dan krem mendominasi. Warna pastel muncul di sorotan, ilustrasi yang relevan, dan bantuan singkat. Sediakan ruang kosong yang cukup di antara soal, pilihan, dan tombol.

Pilih satu aksen dominan per bagian, dengan satu aksen pendukung bila diperlukan. Tab indeks, ikon, garis penghubung langkah, atau bagian kecil ilustrasi materi cukup untuk membangun karakter visual. Setiap elemen muncul karena membantu siswa mengenali topik, memahami status, atau menemukan tindakan. Hindari pola grid kartu seragam di setiap layar, panel abu-abu, glassmorphism, glow, gradasi neon, orb, kilau AI, dan ikon dekoratif berulang.

### Logo dan ikon aplikasi

Rancang satu identitas logo **TemanBelajar**. Buat simbol sederhana dari bentuk buku terbuka dengan satu jalur melengkung yang mengarah ke halaman berikutnya. Simbol menggambarkan bahwa siswa bisa sampai ke tujuan belajar lewat berbagai cara. Pakai garis forest yang tegas, ruang kosong yang cukup di dalam simbol, dan satu bidang mint sebagai bentuk utama ikon. Wordmark memakai Nunito tebal, dengan ejaan **TemanBelajar**. Gunakan forest sebagai warna utama wordmark. Tagline “Belajar dengan caramu.” bisa ditempatkan terpisah pada media yang cukup lebar.

| Varian | Penggunaan dan pemeriksaan |
| --- | --- |
| Ikon aplikasi | Simbol sendiri dalam bidang mint persegi bersudut bulat. Periksa keterbacaan pada 16, 32, dan 48 px. Hilangkan detail kecil yang hilang saat diperkecil. |
| Logo horizontal | Simbol di kiri dan wordmark di kanan. Cocok untuk header publik dan layar masuk. |
| Monokrom | Bentuk yang sama dalam forest untuk kanvas terang, dan putih untuk permukaan forest. |

Sediakan ikon, logo horizontal, dan versi monokrom sebagai aset terpisah dalam SVG atau PNG transparan sesuai dukungan ekspor. Tampilkan contoh favicon dan header aplikasi. Logo memakai simbolnya sendiri, dan Mimo tetap memakai gambar asli yang dilampirkan.

### Mimo si bunglon

**Aset Mimo yang diunggah pemilik proyek adalah gambar final.** Tempatkan file aslinya secara langsung. Pertahankan warna, ekspresi, bentuk, pose, tekstur, properti, dan rasio asli. Perubahan ukuran proporsional boleh dilakukan dengan `object-fit: contain`. Jangan menggambar ulang, mengganti dengan hasil generasi AI, membuat pose baru, memotong karakter, membalik gambar, memberi filter, menambah bayangan pada gambar, atau menghapus latar bawaan aset. Bila hanya ada satu pose asli, pakai pose itu secara konsisten di penempatan yang relevan.

**Sama sekali tanpa latar abu-abu buatan.** Jika gambar transparan, pertahankan transparansinya dan tempatkan langsung di kanvas Warm Cream, putih, atau pastel lembut. Jika file sudah punya latar sendiri, tampilkan file utuh. Pilih permukaan halaman yang selaras di sekelilingnya. Jangan menambah kotak abu-abu, overlay, panel mockup, atau warna pengisi di belakang Mimo. Aturan ini juga berlaku pada hero, kartu rekomendasi, state loading, dan pratinjau aset di Stitch.

| Penempatan | Perlakuan |
| --- | --- |
| Landing (01), sambutan (02) | Gunakan gambar asli di samping judul. Utamakan CTA saat ruang sempit. |
| Pratinjau (06), Beranda (07), rekomendasi (19) | Gunakan gambar asli sebagai aksen kecil. Sampaikan saran dan alasan dengan teks yang bisa dibaca langsung. |
| Pemrosesan (10) dan hasil latihan (18) | Gunakan gambar yang sama jika membantu konteks. Tampilkan status atau umpan balik nyata di luar gambar. |
| Pembaca (13) dan Fokus (14) | Pemakaian opsional. Sediakan cara menyembunyikan ilustrasi dan hindari interupsi di tengah tugas. |

Gunakan maksimal satu ilustrasi Mimo per layar. Letakkan dialog sebagai teks HTML singkat di luar gambar. Gambar dekoratif memakai alt kosong. Jika gambar menyampaikan informasi yang tidak ada di teks sekitar, beri alternatif yang menjelaskan informasinya. Jika aset belum terlampir, sisakan ruang pada frame yang membutuhkannya untuk memasang gambar asli.

## Colors

| Peran | Token dan nilai | Penggunaan |
| --- | --- | --- |
| Kanvas dan permukaan | Warm Cream `canvas #F8F7F2`, `surface #FFFFFF` | Krem untuk halaman, putih untuk panel belajar dan formulir. |
| Teks utama dan CTA | Deep Forest `primary #273B35` | Teks utama dan ikon aktif. Tombol forest memakai teks putih. |
| Aksen brand | Soft Mint `mint #C8E8CE`, Soft Lavender `lavender #A8B7F5`, Peach `peach #FFCA9D`, Butter Yellow `butter #FFE7A3` | Mint untuk rekomendasi, lavender untuk sorotan konsep, peach untuk aksen ilustrasi atau alternatif, butter untuk pengingat ringan. Pakai teks forest pada keempatnya. |
| Bidang pastel lembut | `mint-tint #EAF6EB`, `lavender-tint #F0EDFC`, `peach-tint #FFF0E6`, `butter-tint #FFF5D6` | Untuk area ikon, sampul kategori, sorotan baris, dan kartu pendukung. Pakai teks forest. |
| Teks pendukung | `text-secondary #505C55` | Metadata dan bantuan formulir pada krem atau putih. Gunakan forest pada bidang berwarna. |
| Detail netral | Muted Gray `muted-gray #737B75`, Light Border `divider #E5E8E1` | Abu-abu hanya untuk detail dekoratif kecil dan garis pemisah. Batas penting memakai `control-border #68756C`. Semua latar utama, kartu, area aset, dan state kosong memakai krem, putih, atau pastel sesuai peran. |
| Fokus | `focus #3B4C9B` | Outline pada permukaan terang. Pada komponen gelap gunakan celah atau cincin dalam putih dengan outline luar biru pada permukaan terang. |
| Umpan balik | `success #28583E` di mint, `warning #61450E` di butter, `error #892E32` di `error-surface #FAE7E5` | Pasangkan label eksplisit dan ikon dengan warna. |
| Kontras tinggi | `contrast-ink #101A16`, `surface #FFFFFF`, `focus #3B4C9B` | Kanvas putih, teks dan batas gelap, tombol gelap dengan teks putih, aksen dekoratif dikurangi. Hormati mode forced-colors perangkat. |

Rasio sRGB untuk pasangan padat, dibulatkan. Forest pada krem **11,10:1**, putih **11,91:1**, mint **9,01:1**, lavender **6,10:1**, peach **8,05:1**, dan butter **9,76:1**. Pada empat tint baru, teks forest mencapai **10,34–10,94:1** dan outline biru **6,77–7,16:1**. Teks sekunder pada krem **6,52:1**, putih **6,99:1**. Muted Gray pada krem **4,06:1** dan putih **4,36:1**, sehingga metadata kecil memakai token teks sekunder. Batas kontrol pada krem **4,50:1** dan putih **4,83:1**. Fokus biru pada lavender **3,99:1**, pasangan terendah di antara permukaan pastel dan netral dasar. Uji lagi saat memakai opacity, gambar, tema kontras tinggi, hover, dan state terpilih.

## Typography

**Plus Jakarta Sans** adalah font default untuk aplikasi, bacaan, form, label, dan judul fungsional. **Nunito** dipakai untuk hero, judul sambutan, dan kutipan Mimo yang singkat. Gunakan sentence case, body 16 px, metadata 14 px, dan ukuran relatif agar benar-benar mengikuti pengaturan browser. Di desktop, hero 56 px dan judul halaman 32 px. Di mobile, gunakan 36 dan 26 px. Biarkan judul membungkus. Pakai angka tabular pada jam atau langkah jika font mendukungnya.

Bacaan awal 18 px dengan tinggi baris 1,7 dan lebar sekitar 60–72 karakter. Sediakan pilihan ukuran huruf, spasi baris, spasi huruf, jenis huruf, dan lebar kolom yang bisa dipratinjau pada teks nyata. Mulai dengan Plus Jakarta Sans dan opsi font sistem. Gunakan fallback `system-ui, sans-serif`. Label seperti “Atur tampilan bacaan” harus menjelaskan efek pengaturan tanpa menyebut diagnosis. Hormati penyesuaian browser dan pengaturan bantu perangkat.

## Layout

Gunakan ritme 8 px dengan setengah langkah 4 px untuk jarak rapat. Jarak ikon-label 8 px, antar-field 16 px, padding kartu 16 px pada mobile dan 24 px pada desktop, jarak antarseksi 32–48 px untuk app dan hingga 64 px pada landing. Batasi lebar isi aplikasi sekitar 1200 px di dalam shell dan lebar formulir sekitar 560 px. Gunakan `min-width: 0` pada kolom yang dapat menciut.

| Kerangka | Grid dan navigasi | Perilaku isi |
| --- | --- | --- |
| Desktop ≥1024 px · desain 1440 | Sidebar sekitar 224 px. Isi 12 kolom, margin internal 32 px, gutter 24 px. Header punya akses cepat ke pengaturan aksesibilitas. | Dashboard memakai rekomendasi 8 kolom dan jadwal ringkas 4 kolom. Editor dan layar belajar memusatkan isi utama dengan utilitas di area tersendiri bila muat. |
| Tablet 768–1023 px · desain 768 | 8 kolom, margin 24 px, gutter 16 px. Bilah atas dengan tombol “Menu” membuka panel berlabel. | Pertahankan dua kolom hanya jika isi dan label muat. Planner dan diagram bisa menjadi satu kolom. |
| Mobile <768 px · desain 390 | 4 kolom, margin 16 px, gutter 12 px. Navigasi bawah “Beranda”, “Rencana”, “Materi”, “Lainnya”. Panel “Lainnya” memuat “Mulai Belajar”, “Progres”, dan “Pengaturan”. | Susun isi berdasarkan urutan baca. Gunakan satu kolom untuk form, hasil latihan, perbandingan jadwal, dan transkrip. Sisakan ruang safe area dan tinggi bilah yang terukur. |

Shell publik memakai header sederhana. Onboarding memakai tombol kembali, judul langkah, dan label “Langkah {n} dari 4” untuk 03–06. Shell belajar memakai header ringkas dengan “Kembali ke materi”, nama sesi, dan “Aksesibilitas”, termasuk saat navigasi umum disembunyikan dalam mode fokus. Jika sesi dibuka dari planner atau rekomendasi, tautan kembali harus mengarah ke sumber tersebut dan punya nama yang sesuai.

Urutan DOM mengikuti urutan visual dan prioritas: judul, tindakan utama, alasan atau status, detail terkait. Hindari perubahan urutan lewat CSS yang membingungkan pengguna keyboard. Uji reflow pada 320 CSS px, zoom dan pembesaran teks, keyboard virtual, string Indonesia yang panjang, serta layar orientasi lanskap. Bilah tetap boleh berubah menjadi biasa saat ruang vertikal sempit.

## Elevation & Depth

Gunakan warna permukaan, ruang, dan border halus sebagai pemisah utama. Kartu isi tetap ringan. Kartu rekomendasi boleh memakai satu tepi berlapis yang tipis atau bayangan lembut `0 3px 0 rgba(39,59,53,.09)`. Untuk panel mengambang gunakan bayangan `0 4px 16px rgba(39,59,53,.08)`, dan untuk dialog `0 12px 32px rgba(39,59,53,.14)`. Bayangan dekoratif boleh hilang pada mode kontras tinggi. Biarkan ilustrasi Mimo berdiri langsung di kanvas tanpa efek bayangan.

## Shapes

Kontrol 12 px, kartu 16 px, hero atau rekomendasi 24 px, dan pil hanya untuk filter atau status singkat. Gunakan ikon garis berukuran 20–24 px, dengan Lucide sebagai acuan. Ikon dekoratif disembunyikan dari pembaca layar. Tombol ikon punya nama yang dapat diakses dan tooltip sebagai bantuan tambahan. Gunakan bentuk organik pada aksen khusus seperti tab indeks atau dudukan ikon kecil dengan palet pastel produk.

## Components

| Komponen | Pola desain dan perilaku |
| --- | --- |
| Shell, sidebar, dan top bar | Tautan semantik, teks bersama ikon, dan `aria-current="page"` untuk rute aktif. Sediakan tautan lompat ke konten utama. Panel mobile menampung semua tujuan navigasi. |
| Tombol dan tautan | Satu CTA primer dominan per layar atau tahap. Sekunder berbingkai, tersier sebagai tombol teks atau tautan sesuai fungsinya. Tinggi minimum produk 44 px. Gunakan teks yang menyebut tindakan, misalnya “Pindahkan ke besok”. |
| Form dan pilihan | Label tetap di atas field. Helper dan error terhubung secara programatis. Checkbox untuk 03, radio untuk pilihan tunggal, switch untuk keadaan langsung, dan tombol chip untuk filter. Nilai slider juga tersedia sebagai pilihan angka atau preset. |
| Progres dan aktivitas | Nama, status, dan estimasi durasi tetap terlihat. Gunakan indikator determinate hanya saat total diketahui, disertai label seperti “2 dari 5 soal”. Gunakan tautan judul dan tombol sekunder yang terpisah untuk kartu interaktif. |
| Jadwal harian | Daftar berurutan dengan tanggal, jam, judul, durasi, dan status “Belum mulai”, “Sedang dikerjakan”, “Selesai”, atau “Dilewati”. Tindakan “Ubah jadwal” dapat dilakukan dengan keyboard. Prioritas ditulis, misalnya “Prioritas hari ini”. |
| Rekomendasi | Tindakan dan konsep → estimasi → alasan ringkas → mulai, alternatif, dan lewati. Detail alasan bisa dibuka inline dan tombolnya menunjukkan keadaan terbuka. |
| Unggah dan pemrosesan | Dropzone mendukung tombol “Pilih file” serta input teks. Tampilkan persyaratan aktual dan status file. Gunakan kejadian pemrosesan nyata untuk tahap. |
| Pemilih mode dan toolbar belajar | Setiap mode punya ringkasan manfaat dan ringkasannya tersedia tanpa hover. Opsi aktif ditandai label dan simbol. Toolbar menyediakan “Ganti cara belajar” dan akses ke pengaturan cepat. |
| Latihan dan feedback | `fieldset` dan `legend` untuk soal dengan pilihan. Jawaban besar, submit terpisah, dan penjelasan tersedia setelah konfirmasi. Tampilkan “Tepat” atau “Belum tepat” dengan teks dan ikon, serta fokus yang tepat ketika lanjut ke soal baru. |
| Bantuan Mimo | Ilustrasi kecil dan ucapan satu atau dua kalimat. Tombol tutup dapat diakses dan ucapan penting tidak bergantung pada gambar. |
| Dialog dan notifikasi | Dialog untuk pilihan penting dengan judul, tombol “Batal”, fokus awal yang masuk akal, Escape untuk menutup bila aman, dan fokus kembali ke pemicu atau tujuan yang logis. Toast untuk konfirmasi singkat. Kesalahan dan tindakan penting juga ada secara persisten pada halaman. |

### Varian kartu

| Kartu | Komposisi | Isi yang langsung terlihat |
| --- | --- | --- |
| **Rekomendasi** | Panel mint, radius 24 px, teks di kiri dan Mimo asli opsional di kanan. Di mobile Mimo boleh disembunyikan untuk menjaga CTA. | Judul tindakan, estimasi menit, satu alasan, dan CTA “Mulai sekarang”. Detail alasan dibuka lewat “Lihat alasannya”. |
| **Materi** | Kartu putih, sampul pastel tipis dengan satu diagram, ilustrasi, atau tab yang sesuai topik. Beri sampul rasio yang konsisten. | Judul, mata pelajaran atau format jika relevan, dan status seperti “Belum mulai” atau “Lanjut dari segmen 2”. |
| **Pilihan mode** | Ikon fungsional pada bidang pastel lembut, judul, dan radio/centang yang kentara. Bingkai lebih tegas saat terpilih. | Nama mode dan satu manfaat, misalnya “Teman baca · Atur teks dan dengarkan materi”. |
| **Aktivitas jadwal** | Baris dalam linimasa, dengan jam di kiri, isi di tengah, dan tindakan di kanan atau di bawah pada mobile. Gunakan pengelompokan hari sebagai pemisah. | Jam, kegiatan, durasi, status tertulis, dan tindakan “Ubah jadwal” bila tersedia. |
| **Umpan balik dan perubahan rencana** | Gunakan blok ringkas dengan ikon, label, dan warna sesuai status. Pada perubahan jadwal tunjukkan pasangan “Sebelum” dan “Usulan” untuk setiap aktivitas. | Hasil, satu penjelasan langsung, dan tindakan lanjutan. |

Kartu punya urutan baca yang jelas: judul, informasi penting, tindakan. Gunakan satu deskripsi pendek dan satu label metadata bila cukup. Letakkan bantuan panjang dalam detail yang bisa dibuka. Informasi penting seperti status, kesalahan, dan label kontrol selalu terlihat. Hindari kartu bersarang, beberapa badge dengan arti yang sama, dan tombol yang membuat seluruh halaman terlihat sama ramai.

### Keadaan interaksi

| Keadaan | Aturan | Contoh UI |
| --- | --- | --- |
| Default, hover, pressed | Normal terbaca tanpa hover. Tombol forest memakai token hover dan pressed. Interaksi sentuh punya umpan balik pressed tanpa pergeseran layout. | “Mulai sekarang” |
| Focus-visible | Outline minimal 2 px dengan offset sekitar 2 px. Pertahankan saat terpilih atau saat tindakan sedang diproses dan fokus masih di kontrol. Sediakan ruang agar outline tidak terpotong. | Fokus pada “Ganti cara belajar” |
| Selected / current / expanded | Tambahkan cek, indikator aktif, atau label dan gunakan keadaan semantik yang sesuai. Fokus dan seleksi punya indikator masing-masing. | “Dengarkan dan jelajahi · dipilih” |
| Disabled / unavailable | Jika perlu diblokir, sebutkan syarat atau sebab di dekat kontrol. Kontrol native disabled boleh keluar dari tab order jika alasan dapat dibaca di sekitarnya. | “Pilih satu jawaban dulu.” |
| Loading / pending | Pertahankan ukuran tombol dan input, cegah submit ganda, gunakan `aria-busy` untuk wilayah yang diperbarui dan status yang bisa dibaca. Skeleton dekoratif tanpa shimmer saat gerak rendah. | “Menyimpan jawaban…” |
| Empty / no results | Bedakan data baru dan hasil filter kosong. Tawarkan aksi yang sesuai, termasuk reset filter. | “Belum ada materi. Tambahkan materi atau coba contoh fotosintesis.” |
| Success / saved | Tampilkan konfirmasi dekat objek yang berubah. Pengumuman singkat memakai status sopan. | “Jadwal dipindah ke besok pukul 09.00.” |
| Error / offline / stale | Tulis masalah dan cara pulih, simpan input dan waktu pembaruan bila relevan. Gunakan error inline dan ringkasan untuk formulir yang panjang. | “Jawaban belum terkirim. Sambungkan internet, lalu coba lagi.” |

Animasi perubahan kontrol 120–180 ms dan panel hingga sekitar 200 ms. Terapkan preferensi aplikasi dan `prefers-reduced-motion`. Gunakan perubahan instan atau transisi opacity singkat bila gerakan dikurangi. Hindari parallax, loop maskot, confetti paksa, autoplay media, dan animasi progres yang membuat nilai terlihat berubah sendiri.

## Do's and Don'ts

- Tonjolkan satu tindakan belajar dengan judul spesifik, satu alasan yang bisa dibaca cepat, dan satu aksen warna utama.
- Variasikan komposisi sesuai kebutuhan halaman. Gunakan blok editorial pada landing, daftar untuk jadwal, dan permukaan tenang untuk membaca, fokus, serta latihan.
- Konsisten pada shell, bentuk, tipografi, dan file gambar Mimo yang dilampirkan. Pakai panel, badge, dan ikon ketika membantu tindakan atau interpretasi.
- Hindari gradien ungu-biru, orb, glassmorphism, kilau AI, kartu bertumpuk, angka dekoratif, judul kapital, dan teks lorem ipsum.
- Jauhkan estetika taman kanak-kanak atau enterprise. Pakai krem, putih, dan pastel untuk latar. Pertahankan gambar asli Mimo beserta transparansi atau latar bawaannya.
- Hindari label seperti “Level kecerdasan”, diagnosis otomatis, klaim kepastian model, dan pesan yang mempermalukan siswa.

## Navigasi dan alur

Navigasi utama berurutan **Beranda · Rencana Belajar · Materi Saya · Mulai Belajar · Progres · Pengaturan**. “Mulai Belajar” melanjutkan sesi yang ada atau membuka pemilihan materi/mode. Jika koleksi kosong, tampilkan materi demo dan tautan unggah. “Aksesibilitas” selalu dapat dicapai dari layar belajar dan pengaturan lengkap tersedia di 23. Pengaturan akun ada di 24.

| Alur | Hubungan layar |
| --- | --- |
| A · Sambutan dan onboarding | 01 → 02 → 03 → 04 → 05 → 06 → 07. Masuk sebagai pengguna kembali langsung ke langkah tersimpan atau 07. Demo menyediakan profil dan materi contoh yang diberi label. |
| B · Beranda personal | 07 → 19 untuk rekomendasi, 20 untuk rencana, 08/11 untuk materi, 22 untuk progres, 23 untuk aksesibilitas. CTA rekomendasi aktif boleh membuka sesi langsung dengan detail alasan tetap bisa dilihat. |
| C · Materi | 08 → 09 → 10 → 11 → 12. Status yang masih diproses bisa dibuka lagi dari 08. Materi siap dapat dibuka langsung di 11. |
| D · Sesi yang aksesibel | 12 → 13, 14, 15, atau 16, atau tampilan standar memakai shell dan konten dasar 13. Keempat mode ↔ 12 tanpa kehilangan posisi. Sesi → 17 atau simpan dan kembali ke asal. |
| E · Evaluasi | 17 → 18 → 19 atau kembali ke 11/20 sesuai asal. |
| F · Rekomendasi | 19 → sesi atau latihan yang sesuai, alternatif mode/kegiatan, atau kembali ke 07/20 jika dilewati. |
| G · Rencana harian | 20 → sesi/17 → 18 → 19 dan/atau 21 jika ada usulan baru. Dari 21, terima, atur, atau pulihkan versi sebelumnya, lalu kembali ke 20. |
| H · Progres dan pengaturan | 22 → materi/latihan terkait atau 20 untuk target. 23 dapat dibuka dari pengaturan dan pembelajaran. 24 menautkan 23 dan 20. |

Gunakan tujuan kembali yang eksplisit untuk tautan langsung. Simpan langkah onboarding, draft dan posisi belajar yang sesuai, serta filter pustaka ketika pengguna kembali. Jangan minta konfirmasi saat data sudah tersimpan. Jika ada perubahan yang belum tersimpan dan akan hilang, beri pilihan tetap di halaman atau keluar.

## Inventaris 24 layar

Rute berikut adalah usulan App Router. `[id]`, `[job]`, `[sesi]`, dan `[versi]` merepresentasikan identitas objek. Layar dapat berbagi shell dan variasi standar adalah keadaan 13.

| ID · Layar | Rute | Isi utama, aksi, dan keadaan penting |
| --- | --- | --- |
| **01 · Landing** | `/` | Logo horizontal, hero “Setiap orang punya cara belajarnya sendiri.” Satu kalimat pendukung, “Pilih cara belajar yang nyaman buat kamu. Mimo siap nemenin!” CTA “Mulai belajar” → 02 dan “Lihat cara kerjanya” → bagian cara kerja. Jelaskan cara memilih format, melihat saran, dan menyesuaikan jadwal dalam tiga langkah ringkas. Tempatkan aset asli Mimo, dengan judul dan CTA lebih dahulu pada mobile. |
| **02 · Sambutan / akun** | `/masuk` | “Hai! Aku Mimo. Yuk, kenalan dulu!” Tampilkan “Masuk” atau “Buat akun” sesuai mekanisme autentikasi, serta “Coba demo”. Jika memakai tautan masuk, beri status pengiriman dan cara kirim ulang. Pertahankan email yang valid jika koneksi gagal. |
| **03 · Kebutuhan belajar** | `/onboarding/kebutuhan` | “Biar belajarnya makin nyaman, kamu butuh bantuan apa?” Pilihan jamak dengan ikon, ringkasan manfaat, dan indikator centang. Pilihan diuraikan di bawah. “Lanjut” → 04 dan “Lewati dulu” menggunakan default. |
| **04 · Preferensi aksesibilitas** | `/onboarding/aksesibilitas` | “Atur cara belajarmu” dengan pratinjau. Kelompok relevan dari 03 ditampilkan lebih dahulu. Kelompok lain mudah dibuka. “Pakai pengaturan ini” → 05. “Pakai pengaturan awal” menyimpan default. |
| **05 · Tujuan belajar** | `/onboarding/tujuan` | Mata pelajaran, target, tanggal ujian opsional, waktu belajar per hari, dan hari tersedia. Preset “15 menit”, “25 menit”, atau “Atur sendiri”. Tampilkan validasi tanggal dan waktu dekat field. “Lihat rencana belajarku” → 06. |
| **06 · Pratinjau personal** | `/onboarding/rencana` | “Yeay! Rencana belajarmu udah siap.” Tampilkan contoh jadwal, total perkiraan waktu, tujuan, dan alasan singkat. “Ubah tujuan” → 05. “Ke beranda” → 07. Jika belum ada materi, tawarkan contoh berlabel atau jadwal awal setelah materi ditambahkan. |
| **07 · Beranda** | `/beranda` | “Pagi! Siap belajar bareng Mimo?” sesuai waktu lokal, dengan sapaan netral sebagai fallback. Hero “Langkah terbaikmu hari ini”, saran dan alasan, “Mulai sekarang”. Setelah hero, tampilkan ringkasan hari ini, rencana, progres, target, materi terbaru, dan akses cepat pengaturan. Jika siswa baru, mulai dari contoh atau unggah. |
| **08 · Materi Saya** | `/materi` | Pencarian dengan label, filter mata pelajaran, kartu materi, status belajar dan pemrosesan, “Tambah materi”. Klik materi siap → 11, proses aktif → 10. “Hapus filter” untuk hasil kosong dan “Coba materi contoh” jika belum ada materi. |
| **09 · Unggah materi** | `/materi/tambah` | Pilihan PDF, gambar, dan teks tempel sesuai layanan aktif. Tampilkan tipe dan ukuran yang benar, nama file, hapus/ganti, dan “Siapkan materi” → 10. Pertahankan input dan alasan jika file tidak didukung atau teks sulit dibaca. |
| **10 · Pemrosesan materi** | `/materi/proses/[job]` | Aset asli Mimo opsional dan “Mimo lagi nyusun materinya…” dengan tahap “Membaca materi”, “Mengenali konsep”, “Menyiapkan aktivitas belajar”. Tampilkan tahap yang dilaporkan sistem. “Kembali ke Materi Saya” membiarkan pemrosesan berjalan di latar. Saat siap sediakan “Lihat materi”. Jika gagal, tawarkan “Coba lagi” atau “Ganti materi”. |
| **11 · Ringkasan materi** | `/materi/[id]` | Judul, konsep, waktu perkiraan, relasi konsep/prasyarat dalam daftar dan bila cocok diagram, mode tersedia, saran mulai. “Lihat sumber asli” membuka teks/dokumen dan rujukan halaman atau bagian. “Pilih cara belajar” → 12. |
| **12 · Pemilih mode** | `/belajar/mode` | “Mau belajar pakai cara yang mana?” Lima pilihan dengan manfaat nyata dan ketersediaan pada materi aktif. “Mulai dengan cara ini” atau “Ganti cara belajar” → mode yang dipilih. Jika sumber tanpa diagram atau transkrip, jelaskan kondisi dan beri pilihan yang bisa dipakai. |
| **13 · Reading Companion** | `/belajar/[sesi]/baca` | “Teman baca”. Kontrol ukuran, jarak, pembacaan suara, sorot kalimat, penggaris baca, glosarium istilah, dan progres. Ilustrasi asli opsional di area bantuan. Mode “Belajar biasa” memakai bacaan dasar dengan pengaturan bantu universal tetap tersedia. |
| **14 · Focus Navigator** | `/belajar/[sesi]/fokus` | “Belajar selangkah demi selangkah”. Satu tugas, label “Langkah 2 dari 4”, “Tandai selesai”, “Jeda”, dan “Lanjutkan”. Timer opsional berhenti saat jeda dan habis tanpa menutup aktivitas. Tampilkan animasi dan dekorasi sesedikit mungkin. |
| **15 · Audio & Visual Explorer** | `/belajar/[sesi]/jelajah` | “Dengarkan dan jelajahi”. Pratinjau diagram, deskripsi terstruktur, baca nyaring, alternatif teks, relasi konsep, dan “Tanya tentang diagram ini”. Sediakan rujukan sumber, status jawaban, dan jalur keyboard ke seluruh detail. |
| **16 · Visual & Caption Learning** | `/belajar/[sesi]/transkrip` | “Belajar dengan teks dan visual”. Transkrip yang mudah dibaca, media berketerangan, kartu konsep, dan langkah bernomor. Caption dapat dikontrol dan transkrip dapat dipakai tanpa memutar media. Jika transkrip belum tersedia, tawarkan teks sumber atau mode lain yang bisa dipakai. |
| **17 · Latihan adaptif** | `/belajar/[sesi]/latihan` | Satu soal, opsi besar, progres, “Bacakan soal” opsional, dan “Kirim jawaban”. Pertahankan pilihan saat gagal kirim. Setelah tersimpan, tampilkan feedback bila format latihan memerlukannya, dan lanjut dengan tindakan eksplisit. |
| **18 · Umpan balik** | `/belajar/[sesi]/hasil` | Ringkasan jawaban tepat dan belum tepat, penjelasan tiap soal, serta konsep yang perlu diulang. “Belum pas? Gapapa, kita coba cara lain!” jika relevan. “Lihat saran berikutnya” → 19 atau kembali ke materi/rencana. |
| **19 · Langkah belajar berikutnya** | `/rekomendasi` | “Rekomendasi buat kamu” dan tindakan konkret, misalnya “Ulangi konsep peran cahaya lewat audio.” Tampilkan durasi, “Kenapa ini disarankan?”, “Ikuti rekomendasi”, “Coba cara lain”, “Lihat alasannya”, “Lewati dulu”. Sediakan saran dasar ketika histori atau model belum cukup. |
| **20 · Rencana belajar harian** | `/rencana` | Tanggal, total waktu, linimasa, prioritas, kegiatan selesai dan mendatang, serta “Ubah jadwal”. Tampilkan rencana yang sedang berlaku dan banner usulan jika ada. Hari kosong bisa diisi lewat “Pilih aktivitas”. |
| **21 · Rencana diperbarui** | `/rencana/perubahan/[versi]` | “Rencana belajarmu udah diperbarui!” setelah konfirmasi. Sebelum diterima, gunakan “Ada usulan buat rencana belajarmu”. Sajikan sebelum/sesudah dan alasan, “Pakai rencana baru”, “Atur jadwal”, serta “Pulihkan rencana sebelumnya” setelah penerapan. |
| **22 · Progres belajar** | `/progres` | Sesi selesai, estimasi penguasaan, frekuensi belajar, topik untuk ditinjau, dan target berikutnya. Contoh label “Perlu diulang”, “Sedang berkembang”, “Siap lanjut”, dan “Belum cukup data”. Visualisasi punya ringkasan dan daftar/tabel data yang setara. |
| **23 · Pengaturan aksesibilitas** | `/pengaturan/aksesibilitas` | Kontrol font dan spasi, kontras, baca nyaring, fokus, gerak rendah, caption/transkrip, dan alat baca. Pratinjau perubahan, simpan, dan “Kembalikan ke pengaturan awal”. Jelaskan efek pengaturan ketika kontrol diubah. |
| **24 · Profil dan preferensi** | `/pengaturan/profil` | Tujuan, waktu tersedia, mata pelajaran, notifikasi, dan kontrol data/privasi yang didukung produk. Simpan per bagian. Jika perubahan tujuan memengaruhi jadwal, arahkan ke 21. Aksi penghapusan data dibedakan jelas dan meminta konfirmasi. |

**Salinan pilihan 03.** “Aku butuh bantuan membaca”, “Aku gampang kehilangan fokus”, “Aku lebih nyaman mendengarkan”, “Aku butuh deskripsi gambar”, “Aku lebih nyaman dengan teks dan visual”, dan “Aku mau belajar seperti biasa”. Pilihan terakhir bersifat eksklusif, dengan perubahan pilihan yang terlihat. Sertakan “Pilihan ini opsional dan bisa kamu ubah kapan aja.”

**Kelompok 04 dan 23.** Bacaan mencakup font, spasi, fokus baris, dan baca nyaring. Fokus mencakup satu aktivitas, distraksi rendah, dan sesi pendek. Tampilan dan deskripsi mencakup kontras, pengaturan perilaku audio, dan deskripsi diagram. Teks dan media mencakup caption, transkrip, serta penjelasan visual. Dukungan pembaca layar dan navigasi keyboard aktif secara universal. Jelaskan dukungan tersebut dalam bantuan, tanpa menggantungkan akses pada toggle.

**Label mode 12.** “Teman baca” (Reading Companion), “Belajar selangkah demi selangkah” (Focus Navigator), “Dengarkan dan jelajahi” (Audio & Visual Explorer), “Belajar dengan teks dan visual” (Visual & Caption Mode), dan “Belajar biasa” (Standard Learning). Gunakan label yang sama di pemilih, toolbar, ringkasan materi, dan rekomendasi.

**Contoh rekomendasi 07.** “Yuk, ulang sedikit materi fotosintesis.” Di bawahnya, pakai alasan seperti “Di latihan terakhir, bagian peran cahaya masih perlu diulang. Kita coba cara yang berbeda, ya?” saat riwayat latihan mendukungnya.

**Cakupan mode 16.** Nama dan deskripsi fitur menyebut caption, transkrip, dan penjelasan visual. Hindari klaim penerjemahan bahasa isyarat.

## Pengalaman belajar adaptif

### Konten dan sesi

- Tautkan konsep, glosarium, adaptasi konten, dan deskripsi diagram ke sumber yang dapat diperiksa, misalnya “Lihat halaman 3 · Peran cahaya”. Tandai deskripsi atau penjelasan buatan AI yang perlu diperiksa. Jika sumber belum cukup, tampilkan “Bagian ini belum bisa dijelaskan dari materi yang tersedia” dengan tautan sumber dan cara melaporkan masalah.
- Mode mengubah cara konten disajikan. Simpan posisi berdasarkan konsep, langkah, atau paragraf, bukan piksel. Saat pindah mode, pertahankan konsep, aktivitas selesai, dan draft. Jika tampilan baru tidak punya bagian yang setara, buka awal konsep yang sama dan beri status singkat. Hentikan pemutaran setelah ganti mode dan mulai lagi hanya dengan tindakan pengguna.
- Baca nyaring dimulai setelah pengguna memilih “Bacakan”, dengan jeda, lanjut, berhenti, dan kecepatan yang diberi label. Sorot kalimat tanpa memindahkan fokus atau membacakan ulang lewat live region. Saat suara tidak tersedia, jelaskan dan pertahankan akses ke teks.
- Setelah latihan, simpan hasil sekali per percobaan. Jika rekomendasi masih dimuat, hasil dan penjelasan tetap tersedia. Ulang soal yang salah melalui percobaan baru, dengan hasil awal tetap bisa ditinjau.

### Rekomendasi yang dapat dijelaskan

Bayesian Knowledge Tracing (BKT) memperbarui estimasi penguasaan dari riwayat jawaban jika konsep punya parameter yang sesuai. Decision Engine menggabungkan estimasi, prasyarat, riwayat, tujuan, dan preferensi. Gunakan sinyal yang benar-benar tersedia untuk alasan yang ditampilkan. Preferensi aksesibilitas boleh memengaruhi format, sedangkan estimasi penguasaan berasal dari bukti belajar. Dalam UI, pisahkan hasil observasi, misalnya “2 dari 3 jawaban tepat”, dari perkiraan model seperti “Sedang berkembang”.

| Aksi layanan | Contoh UI dan alasan |
| --- | --- |
| REVIEW | “Ulangi peran cahaya · sekitar 5 menit.” “Di latihan terakhir, dua soal tentang peran cahaya belum tepat.” |
| PRACTICE | “Coba dua soal penguatan.” “Kamu sudah menyelesaikan bacaan tentang klorofil. Dua soal ini bisa bantu kamu mengecek pemahaman.” |
| SWITCH | “Coba penjelasan dengan teks dan gambar.” “Kamu memilih format teks dan visual.” |
| ADVANCE | “Lanjut ke peran klorofil.” “Latihan terakhir sudah selesai dan bagian pengantarnya sudah kamu pelajari.” |
| RESCHEDULE | “Pindahkan latihan ke besok.” “Sisa waktu belajarmu hari ini sekitar 5 menit, sementara latihan ini diperkirakan 10 menit.” |

Saat data belum cukup, tunjukkan “Belum cukup latihan untuk memperkirakan progres topik ini” dan ajukan latihan pengantar atau konsep pertama yang memenuhi prasyarat. Saat layanan model tidak tersedia, tampilkan “Saran dari target belajarmu” dan tetap izinkan pilih aktivitas. “Coba cara lain” menawarkan variasi format atau aktivitas dengan durasi. “Lewati dulu” menutup saran dan kembali ke sumber tanpa mencatat hasil buruk atau mengubah jadwal tanpa persetujuan.

## Rencana belajar harian

**Tampilan.** Tampilkan tanggal lokal dan jam 24 jam. Gunakan zona waktu pengguna. Dalam demo ini jam menggunakan WIB. Daftar tetap terbaca tanpa garis linimasa. Contoh hari dengan 35 menit tersedia:

| Jam | Kegiatan | Durasi | Status |
| --- | --- | --- | --- |
| 09.00 | Ulang materi fotosintesis | 15 menit | Selesai |
| 09.15 | Latihan singkat | 10 menit | Sedang dikerjakan |
| 09.25 | Cek pemahaman | 10 menit | Belum mulai |

**Penyusunan.** Hitung usulan setelah hasil latihan atau estimasi berubah, kegiatan dilewati, tujuan/waktu luang berubah, atau siswa meminta penjadwalan ulang. Pakai target, tenggat, waktu yang tersedia, durasi, prioritas, dan prasyarat. Lindungi sesi selesai, waktu yang dikunci, dan komitmen tetap. Jika kapasitas habis, tawarkan aktivitas lebih singkat, tanggal lain, atau tunda kegiatan berprioritas rendah secara terlihat.

**Interaksi perubahan.**

1. Sistem menyiapkan usulan versi baru. Rencana aktif tetap bisa dipakai sambil menunggu. Banner planner berbunyi “Ada usulan perubahan jadwal” dengan “Tinjau perubahan”.
2. Layar 21 menampilkan aktivitas berubah, waktu lama dan baru, efek pada total hari, dan alasan per perubahan. Di desktop gunakan dua kolom jika muat. Di mobile urutkan “Sebelum” lalu “Usulan” untuk tiap perubahan. Contoh: “Cek pemahaman · hari ini 09.25 → besok 09.00. Kamu punya waktu untuk mengulang peran cahaya hari ini.”
3. “Pakai rencana baru” mengaktifkan versi yang ditinjau. “Atur jadwal” membuka form hari dan waktu. “Nanti dulu” menutup usulan. Reschedule langsung dari 20 dapat ditinjau lalu disimpan dengan form yang sama, tanpa gerakan seret.
4. Setelah simpan, tampilkan hasil dan tautan persisten “Lihat perubahan”. “Pulihkan rencana sebelumnya” membuka rangkuman yang akan dipulihkan dan memeriksa konflik terbaru. Pertahankan aktivitas yang sudah selesai. Jika jadwal berubah di perangkat lain, tampilkan versi terbaru dan minta peninjauan ulang sebelum penerapan.
5. Jika simpan gagal, tampilkan “Perubahan belum tersimpan. Coba lagi.” Pertahankan pilihan, hindari usulan duplikat, dan muat ulang dari versi aktif terakhir jika sumbernya sudah berubah.

## Aksesibilitas · target WCAG 2.2 AA

Target berlaku untuk layar lengkap dan alur dari awal sampai selesai. Rasio minimum teks normal **4,5:1**, teks besar **3:1** (setidaknya 24 CSS px biasa atau sekitar 18,67 CSS px tebal), dan bagian kontrol/grafik yang diperlukan **3:1** terhadap warna di sekitarnya. Target sentuh produk **44×44 CSS px** untuk kontrol mandiri. WCAG 2.2 AA 2.5.8 menetapkan **24×24 CSS px** dengan pengecualian yang ditentukan standar. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

| Area | Kriteria desain dan pengujian |
| --- | --- |
| Struktur dan nama | Gunakan `lang="id"`, landmark, heading berurutan, label visible yang cocok dengan nama yang dapat diakses, `fieldset` untuk kelompok, serta tujuan tautan yang jelas. Fokus ke judul atau wilayah yang tepat ketika layar berganti. |
| Keyboard dan fokus | Operasikan semua aksi dengan keyboard, termasuk unggah, pertanyaan diagram, dan perubahan jadwal. Pertahankan urutan tab logis. Gunakan `:focus-visible`, scroll offset untuk bilah tetap, serta uji bahwa elemen fokus tetap terlihat di dekat sticky header, toast, sheet, dan footer. |
| Reflow dan spasi | Uji 200% pembesaran teks dan reflow 320 CSS px (misalnya 400% zoom pada viewport awal 1280 px). Uji override tinggi baris 1,5×, jarak paragraf 2×, spasi huruf 0,12×, dan spasi kata 0,16× dari ukuran font. Pastikan isi dan kontrol tetap utuh. |
| Media dan diagram | Beri caption untuk video rekaman yang memiliki audio, deskripsi audio untuk informasi visual yang tidak tercakup dalam audio utama sesuai kebutuhan AA, dan transkrip untuk materi audio. Pastikan kontrol audio bisa dioperasikan dengan keyboard. Beri alt ringkas dan deskripsi terstruktur untuk diagram kompleks. |
| Status dan error | Gunakan `role="status"` untuk perubahan rutin, `role="alert"` atau pengumuman error yang sesuai untuk masalah mendesak, dan teks error yang menetap dekat input. Hindari pengumuman ulang pada setiap ketukan atau detik. Tampilkan label status pada notifikasi, chart, dan jawaban. |
| Autentikasi dan entri | Dukung autofill, password manager, dan tempel jika memakai kata sandi atau kode. Sediakan cara masuk yang aksesibel tanpa tes kognitif wajib. Isi kembali data yang sudah dimasukkan dalam proses yang sama bila berlaku. Letakkan bantuan konsisten di shell yang digunakan. |
| Waktu, gerak, drag | Timer bersifat opsional, dapat dihentikan, dan tidak mengirim jawaban otomatis. Aktivitas berbatas waktu perlu bisa dinonaktifkan, disesuaikan atau diperpanjang sesuai standar. Dukung pengurangan gerak dan alternatif klik/tap untuk setiap interaksi seret. |
| Grafik dan kontras | Ringkas tren dalam teks dan sediakan tabel atau daftar. Semua status memiliki label dan indikator selain warna. Cek tema kontras tinggi, forced-colors, dan semua kombinasi status. |

**Pemeriksaan minimum sebelum rilis.** Jalankan pemeriksaan otomatis, lalu uji manual dengan keyboard saja, NVDA di desktop Windows, dan VoiceOver atau TalkBack di ponsel. Selesaikan demo, onboarding dengan skip, unggah gagal dan coba lagi, pergantian mode saat sesi berjalan, latihan, serta terima dan pulihkan jadwal. Uji modal dengan Escape dan pemulihan fokus, zoom dan text spacing, pembacaan status, caption, serta reflow. Hasil desain dan pemeriksaan otomatis adalah bagian dari evaluasi aksesibilitas alur yang diimplementasikan.

## Panduan microcopy

Pakai “kamu”, ajakan yang singkat, dan kata kerja yang jelas. Gunakan “Yuk” dan “udah” terutama pada sambutan, umpan balik, atau ucapan Mimo. Di pesan error, masalah dan tindakan perbaikan didahulukan. Materi, jawaban, angka, dan estimasi waktu merujuk ke data yang sedang terbuka. Pakai bahasa waktu yang konsisten, seperti “sekitar 5 menit”, “besok pukul 09.00”, dan “15 November 2026”.

Gunakan judul pendek, satu kalimat pendukung per kartu, dan label tindakan dua sampai empat kata jika tetap jelas. Buat alasan lanjutan, penjelasan konsep, dan sumber bisa dibuka ketika siswa membutuhkannya. Bagian bacaan, transkrip, deskripsi diagram, dan petunjuk aksesibilitas tetap lengkap. Hilangkan slogan yang berulang, paragraf pengantar di setiap panel, label dekoratif, dan istilah internal seperti nama model pada UI siswa.

| Konteks | Salinan UI |
| --- | --- |
| Preferensi | “Kamu bisa ubah pengaturan ini kapan aja.” |
| Batas unggah | “Pilih {tipe yang didukung}, maksimal {batas} per file.” |
| Gagal ekstraksi | “Teks di file ini belum terbaca. Coba PDF dengan teks yang bisa disalin, atau tempel teksnya.” |
| Sesi dijeda | “Belajarmu dijeda di langkah 2. Kamu bisa lanjut kapan aja.” |
| Jawaban belum tepat | “Belum tepat. Cahaya memberi energi untuk proses fotosintesis. Lihat lagi penjelasannya, yuk.” |
| Audio tidak tersedia | “Baca nyaring belum tersedia di perangkat ini. Kamu tetap bisa membaca teksnya.” |
| Usulan jadwal | “Kita geser cek pemahaman ke besok supaya kamu sempat mengulang peran cahaya hari ini.” |
| Progres kosong | “Setelah kamu menyelesaikan latihan, perkembangan tiap topik akan muncul di sini.” |
| Demo | “Kamu lagi mencoba materi contoh. Aktivitas demo memakai data contoh.” |
| Konflik penyimpanan | “Jadwalmu sudah berubah. Tinjau versi terbaru sebelum menyimpan lagi.” |

## Implementasi Next.js dan Tailwind

### Pemetaan desain

- Gunakan Next.js App Router, TypeScript, dan layout grup untuk publik, onboarding, app, dan sesi belajar. Tetapkan `<html lang="id">` dan judul unik per rute. Render shell dan data awal di server bila sesuai. Gunakan komponen klien untuk kontrol pembaca, timer, dialog, pemutar, serta edit jadwal.
- Muat Plus Jakarta Sans dan Nunito dengan API font Next.js. Terapkan kelas variabel pada `html`. Alternatif untuk proses build yang tidak dapat mengunduh font adalah file lokal yang memiliki lisensi sesuai. [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- Jadikan YAML di dokumen ini rujukan nilai. Petakan ke CSS custom properties dan varian komponen. Pada Tailwind v4 gunakan `@theme inline` untuk alias variabel. Pada proyek yang sudah memakai v3, petakan nilai lewat `theme.extend`. Sinkronkan tema shadcn/ui, varian tombol, dan token ring. Gunakan Lucide secara konsisten dan uji perilaku keyboard/ARIA pada primitive yang digunakan. [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- Buat satu komponen untuk setiap pola bersama yang dipakai berulang, misalnya `AppShell`, `LearningToolbar`, `RecommendationCard`, `Timeline`, `MaterialUpload`, dan `MimoIllustration`. `MimoIllustration` merujuk file asli yang diberikan pemilik proyek. Sediakan varian ukuran yang mempertahankan rasio, alt sesuai konteks, dan gunakan permukaan kanvas di sekitarnya tanpa lapisan abu-abu.

Contoh pemetaan Tailwind v4. Definisikan token lain dengan pola yang sama.

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${nunito.variable}`}>
      <body className="bg-canvas font-ui text-ink">{children}</body>
    </html>
  )
}
```

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --ab-canvas: #f8f7f2;
  --ab-surface: #ffffff;
  --ab-ink: #273b35;
  --ab-primary: #273b35;
  --ab-focus: #3b4c9b;
  --ab-mint-tint: #eaf6eb;
  --ab-lavender-tint: #f0edfc;
  --ab-peach-tint: #fff0e6;
  --ab-butter-tint: #fff5d6;
}

html[data-contrast="high"] {
  --ab-canvas: #ffffff;
  --ab-ink: #101a16;
  --ab-primary: #101a16;
}

@theme inline {
  --font-ui: var(--font-jakarta), system-ui, sans-serif;
  --font-display: var(--font-nunito), system-ui, sans-serif;
  --color-canvas: var(--ab-canvas);
  --color-surface: var(--ab-surface);
  --color-ink: var(--ab-ink);
  --color-primary: var(--ab-primary);
  --color-focus: var(--ab-focus);
  --color-mint-tint: var(--ab-mint-tint);
  --color-lavender-tint: var(--ab-lavender-tint);
  --color-peach-tint: var(--ab-peach-tint);
  --color-butter-tint: var(--ab-butter-tint);
  --radius-control: 0.75rem;
  --radius-card: 1rem;
}

:focus-visible {
  outline: 2px solid var(--ab-focus);
  outline-offset: 2px;
}

@media (forced-colors: active) {
  :focus-visible { outline-color: Highlight; }
}
```

### Kontrak dan penyimpanan UI

| Objek | Informasi yang dibutuhkan UI | Perilaku saat gagal atau berubah |
| --- | --- | --- |
| Profil & preferensi | Pilihan bantu, format, waktu, target, dan satu sumber preferensi tersimpan. | Terapkan preferensi awal sebelum render seperlunya. Gunakan variabel pada scope bacaan untuk ukuran dan spasi. Jika sinkronisasi gagal, tunjukkan perubahan yang belum tersimpan dan cara coba lagi. |
| Materi & sumber | Tipe file yang didukung, ID pemrosesan, tahap nyata, konsep, rujukan, dan format tersedia. | Validasi di server dan tampilkan pesan Indonesia. Lanjutkan dari ID pemrosesan setelah refresh. Bila satu format gagal, tampilkan bagian yang siap dan akses ke sumber. |
| Sesi dan percobaan | ID sesi/materi/konsep, mode, penanda langkah atau paragraf, draft, hasil, dan ID pengiriman. | Cegah duplikasi saat retry. Jika jaringan putus, beri status “Belum tersimpan”. Hindari menyimpan draft berisi data pribadi di perangkat bersama tanpa kebutuhan. |
| Rekomendasi | ID, tindakan, konsep, alasan berbasis bukti, kisaran durasi, alternatif, serta status ketersediaan data. | Validasi hasil server sebelum tampil. Jika rekomendasi usang, minta versi baru tanpa memindahkan sesi yang sedang berjalan. |
| Rencana | Hari dan zona waktu, ID serta versi aktif, usulan, perubahan per aktivitas, status selesai, kegiatan terkunci. | Terapkan perubahan dengan versi yang diharapkan. Jika ada konflik, kembalikan versi terbaru untuk ditinjau. Retry aman untuk accept atau restore pada versi yang sama. |

Sediakan state pending per aksi. Gunakan `loading.tsx`, `error.tsx`, dan empty state fitur sesuai kebutuhan rute, dengan pesan yang memberi jalan pulih. Buat data demo yang konsisten untuk semua layar, mulai dari “Fotosintesis” hingga sesi “Peran cahaya”, latihan, dan perubahan jadwal. Labeli data demo saat ditampilkan. Panggilan Gemini dan layanan model berjalan di server. Tampilkan keluaran yang tervalidasi, sumber, dan fallback. Jangan kirim kebutuhan aksesibilitas atau data siswa ke layanan eksternal bila tidak diperlukan untuk tindakan yang dipilih.

## Handoff ke Google Stitch

1. Impor `DESIGN.md` atau lampirkan sebagai konteks proyek Stitch. **Lampirkan juga file gambar asli Mimo** agar Stitch menempatkan gambar tersebut di frame yang relevan. Bila gambar belum tersedia, sisakan tempat untuk memasang aset asli. [Google Labs · Impor dan ekspor DESIGN.md](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
2. Mulai dengan ikon aplikasi dan logo horizontal, lalu 01 dan 07 sebagai acuan publik dan aplikasi. Tambahkan 13 sebagai acuan untuk tampilan belajar yang tenang. Tinjau logo dalam ukuran kecil, palet pastel, komponen kartu, tipografi, dan keterbacaan di ponsel sebelum melanjutkan batch.
3. Kerjakan per batch. Beri nama frame `07 Beranda · 1440` atau `21 Rencana diperbarui · 390 · Usulan`. Gunakan nomor inventaris yang sama pada prototype dan issue implementasi.
4. Rangkai prototipe masing-masing alur A–H. Tautkan CTA, kembali, melewati langkah, retry, ganti mode, dan pemulihan jadwal. Untuk setiap batch, periksa ukuran 1440, 768, dan 390 serta state yang mengubah tindakan berikutnya.
5. Serahkan tautan proyek/prototipe, frame utama dan state penting, aset logo, referensi ke file asli Mimo, salinan UI, token, dan catatan keyboard/responsif. Jika mengekspor kode, gunakan sebagai acuan pemetaan komponen bersama. Uji markup, state, tata letak, kontras, dan keyboard pada implementasi.

| Batch | Layar | Frame yang perlu ditinjau |
| --- | --- | --- |
| 1 · Sambutan | 01–06 | Landing, demo, langkah dilewati, pilihan aktif, validasi tujuan, dan pratinjau tanpa materi. |
| 2 · App dan materi | 07–11 | Beranda terisi dan kosong, hasil filter kosong, upload gagal, pemrosesan, dan sumber asli. |
| 3 · Belajar | 12–16 | Lima mode dalam pemilih, tampilan standar, pengaturan aksesibilitas cepat, jeda, diagram dan transkrip. |
| 4 · Adaptasi | 17–21 | Jawaban belum terkirim, feedback, alternatif/rekomendasi minim data, reschedule, sebelum/sesudah, dan pemulihan. |
| 5 · Progres dan pengaturan | 22–24 | Progres kosong/terisi, teks besar, kontras tinggi, pengaturan profil, dan review responsif lintas layar. |

**Prompt siap tempel di Stitch**

```text
Redesign TemanBelajar as a distinctive, pastel Gen Z study app. Use the attached DESIGN.md and the uploaded original Mimo image. Start with the app icon and wordmark, then create reference frames 01 Landing, 07 Beranda, and 13 Teman baca. For later batches, use the requested screen IDs from DESIGN.md and preserve the approved design system.

Create a simple open-book symbol with a curved path and a Nunito TemanBelajar wordmark. Show the standalone app icon, horizontal logo, monochrome variants, and a small-size preview. Use the logo in the relevant headers. Keep the logo symbol separate from the original mascot.

Place the uploaded Mimo image directly in the design. Keep its original colors, shape, expression, pose, layout, texture, and aspect ratio. Scale proportionally and keep the original transparency or baked-in background. Do not regenerate, redraw, crop, recolor, mirror, filter, or invent poses. Do not add any gray backgrounds to the interface, behind Mimo, or around the mascot preview. Use cream, white, and the documented pastels for UI surfaces.

Use Nunito for expressive headings and Plus Jakarta Sans for functional text. Use the card recipes from DESIGN.md: one mint recommendation card, material cards with topical artwork or index tabs, selectable mode cards, and timeline rows. Give each screen one clear primary action. Keep UI copy short and write every user-facing string in natural Indonesian. Preserve full learning text, captions, transcripts, and diagram descriptions where needed. Use restrained paper or notebook details. Exclude neon gradients, glass, generic AI imagery, repeated badges, and dense panels.

Design high-fidelity frames at 1440, 768, and 390 px using consistent demo data about Fotosintesis and Peran cahaya. Show key selected, focus, loading, empty, error, and success states as appropriate. Link primary, back, skip, retry, and alternative actions to the corresponding frames. Annotate keyboard focus and responsive changes.
```

### Cek penerimaan handoff

- [ ] Seluruh 24 ID punya frame pokok. Mode standar dan state tambahan tercatat sebagai variasi layar yang sesuai.
- [ ] Satu fixture fotosintesis berjalan dari onboarding/materi sampai latihan, rekomendasi beralasan, dan tinjauan rencana baru.
- [ ] Pengguna bisa mengganti mode tanpa kehilangan posisi, menolak saran, menjadwal ulang melalui kontrol form, dan memulihkan rencana sebelumnya.
- [ ] Semua ilustrasi Mimo menggunakan file asli. Tidak ada latar abu-abu tambahan, filter, crop, atau pose generasi baru.
- [ ] Logo sudah tersedia sebagai ikon, wordmark horizontal, dan versi monokrom, serta terbaca pada ukuran kecil.
- [ ] Kartu rekomendasi, materi, mode, dan planner punya hierarki yang sesuai dengan fungsinya. Setiap layar menonjolkan tindakan utama dengan copy singkat.
- [ ] Layar utama, state penting, serta prototipe memiliki copy Indonesia asli, hierarki konsisten, dan referensi ukuran yang diminta.
- [ ] Tokens, aset, rute, state, dan catatan aksesibilitas ditautkan atau disertakan dalam paket handoff. Setelah dibangun, jalankan pengujian WCAG pada alur nyata.

Rujukan format token dan susunan bagian desain. [Google Labs · DESIGN.md format specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)


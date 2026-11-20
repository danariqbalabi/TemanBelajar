# akun email dan demo manda

Frontend memakai Supabase Auth langsung untuk daftar, login dengan kata sandi,
tautan email, dan demo anonim. Password tidak dikirim ke backend TemanBelajar.
Backend menerima access token dan memverifikasi pengguna ke Supabase.

## pengaturan supabase

Pada Authentication → Providers, aktifkan Email dan izinkan pendaftaran akun
baru. Aktifkan konfirmasi email untuk production. Biarkan Anonymous Sign-Ins
aktif untuk demo Manda.

Pada Authentication → URL Configuration:

- Site URL: `https://temanbelajar-six.vercel.app`.
- Redirect URLs: tambahkan `https://temanbelajar-six.vercel.app/auth/callback`.
- Untuk lokal, tambahkan `http://localhost:3000/auth/callback`.
- Untuk menguji branch Vercel, tambahkan URL preview yang dipakai, termasuk
  `/auth/callback`. Jangan mengandalkan wildcard untuk domain production.

Pada template Confirm signup dan Magic Link, tautan default harus memakai
`{{ .ConfirmationURL }}`, bukan hanya `{{ .SiteURL }}`. URL halaman awal saja
tidak membawa bukti autentikasi. SMTP dan batas pengiriman email diatur pada
Supabase; periksa log Auth jika email tidak sampai.

Frontend meminta redirect ke `/auth/callback`. Callback menerima token dari
fragment URL, kode PKCE jika verifier tersedia, atau `token_hash` bertipe
`email`, `signup`, atau `magiclink`. Tautan lama yang kembali ke root dengan
token juga didukung. Kredensial dan error dibersihkan dari URL setelah proses.
SDK tidak memproses URL otomatis agar satu tautan tidak ditukar dua kali.

Rujukan: [password auth](https://supabase.com/docs/guides/auth/passwords),
[redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), dan
[email templates](https://supabase.com/docs/guides/auth/auth-email-templates).

## perilaku pengguna

1. Daftar: isi nama, email, kata sandi minimal delapan karakter, dan konfirmasi
   kata sandi. Jika konfirmasi email aktif, buka email untuk menyelesaikan daftar.
   Tombol kirim ulang tersedia setelah permintaan daftar.
2. Login: gunakan email dan kata sandi. Akun terdaftar juga dapat meminta tautan
   email tanpa membuat akun baru secara diam-diam.
3. Callback valid langsung membuka ruang belajar. Akun baru yang belum punya
   profil membuka pengaturan awal dengan nama dari pendaftaran. Profil tersimpan
   tetap menjadi sumber nama dan preferensi pengguna lama.
4. Callback rusak/kedaluwarsa menampilkan form login dengan pesan pemulihan;
   sesi demo yang lama tidak dipakai sebagai hasil login email.
5. Demo tetap memakai sesi anonim terpisah dan nama Manda. Tombol Masuk di landing
   tetap membuka form akun walau sesi demo tersimpan. Dari Pengaturan pada demo,
   pengguna juga bisa memilih Masuk atau daftar dengan email.

Data demo tidak otomatis dipindahkan ke akun email. Login mengganti sesi ke akun
yang terverifikasi; nama dan progres akun lain tidak digabungkan.

## verifikasi sebelum merge

Jalankan `npm run lint`, `npm test`, `npm run build`, dan `npm run typecheck`.
Uji juga dengan email yang bisa diakses pada URL target: daftar → email
konfirmasi → pengaturan awal → simpan → keluar → login password → keluar →
tautan email → dashboard. Gunakan tautan terbaru; tautan yang sudah dipakai atau
kedaluwarsa harus menampilkan pesan untuk meminta tautan baru.

Verifikasi perubahan ini mencakup 81 tes frontend serta browser lokal yang
terhubung ke backend dan Supabase asli: konfirmasi signup, login password,
magic link, callback token pada root, dan penolakan callback invalid. Nama
akun uji muncul pada pengaturan awal dan akun uji dihapus setelah pengujian.
Tautan uji dibuat lewat admin generateLink tanpa mengirim email; pengiriman
ke inbox dan template email production tetap perlu diuji pada deployment target.

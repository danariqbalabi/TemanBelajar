export function userMessage(error: unknown): string {
  const e = error as { code?: string; name?: string; message?: string };
  const messages: Record<string, string> = {
    invalid_credentials:
      "Email atau kata sandi belum cocok. Coba periksa kembali.",
    email_not_confirmed:
      "Konfirmasi emailmu terlebih dahulu, lalu coba masuk lagi.",
    user_already_exists: "Email ini sudah terdaftar. Gunakan tombol masuk.",
    over_email_send_rate_limit:
      "Terlalu banyak permintaan email. Tunggu sebentar sebelum mencoba lagi.",
    anonymous_provider_disabled:
      "Demo anonim belum tersedia. Kamu bisa mencoba masuk dengan email.",
    signup_disabled: "Pendaftaran akun sedang tidak tersedia.",
  };
  if (e?.code && messages[e.code]) return messages[e.code];
  if (e?.name === "TimeoutError" || e?.name === "AbortError")
    return "Permintaan memerlukan waktu lebih lama. Data yang sudah tersimpan tetap aman; coba lagi atau perbarui status.";
  if (e?.name === "TypeError" && /fetch|network|load/i.test(e.message || ""))
    return "Koneksi belum tersambung. Periksa jaringanmu, lalu coba lagi.";
  return e?.message || "Permintaan belum berhasil. Coba lagi saat kamu siap.";
}

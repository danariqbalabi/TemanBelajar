"use client";
import { useEffect } from "react";

export default function ErrorPage({
  retry,
  error,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("TemanBelajar render failed", error);
  }, [error]);
  return (
    <main className="welcome">
      <section role="alert">
        <h1>Halaman ini belum bisa ditampilkan</h1>
        <p>
          Coba buka kembali. Progres yang sudah tersimpan di akun tetap
          tersedia.
        </p>
        <button onClick={retry}>Coba tampilkan kembali</button>
        <button onClick={() => window.location.reload()}>
          Muat ulang halaman
        </button>
      </section>
    </main>
  );
}

import Image from "next/image";
import type { Job, Material } from "@/lib/types";
export function JobDesign({
  job,
  busy,
  onBack,
  onProcess,
  onRefresh,
  onOpen,
  onSource,
  source,
  onCloseSource,
}: {
  job: Job;
  busy: boolean;
  onBack: () => void;
  onProcess: () => void;
  onRefresh: () => void;
  onOpen: () => void;
  onSource: () => void;
  source: Material["sources"] | null;
  onCloseSource: () => void;
}) {
  const statusLabel =
    (
      {
        queued: "Siap diproses",
        processing: "Sedang disusun",
        failed: "Perlu dicoba kembali",
        ready: "Materi siap",
      } as Record<string, string>
    )[job.status] || job.status;
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 space-y-6">
            <nav aria-label="Navigasi Jejak" className="flex items-center">
              <button
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-text-secondary hover:text-primary transition-colors group p-2 -ml-2 rounded-xl focus-visible:outline-focus"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Materi Saya</span>
                <span className="text-[11px] font-normal text-muted-gray hidden sm:inline">
                  (pemrosesan tetap berjalan otomatis di latar belakang)
                </span>
              </button>
            </nav>

            <div className="relative bg-surface rounded-3xl shadow-card p-6 sm:p-8 md:p-10 overflow-hidden space-y-8">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-mint/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-butter/30 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-divider">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/50 text-mint-dark text-xs font-bold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-mint-dark animate-ping"></span>
                    <span>{statusLabel}</span>
                  </div>
                  <h1 className="font-display font-extrabold text-xl md:text-2xl text-primary flex items-center gap-2.5">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-primary font-semibold">
                      14 Halaman
                    </span>
                    <span>•</span>
                    <span>Matematika SMP Kelas 8</span>
                    <span>•</span>
                    <span className="text-mint-dark font-semibold">
                      Sistem Adaptif Aktif
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between bg-canvas sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-gray">
                    Perkiraan Waktu
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="material-symbols-outlined text-base text-mint-dark"
                      aria-hidden="true"
                    >
                      timer
                    </span>
                    <span className="text-xs md:text-sm font-bold text-primary">
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-canvas/70 rounded-3xl p-6 md:p-8">
                <div className="relative shrink-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-mint to-butter/60 flex items-center justify-center p-3 shadow-inner">
                    <Image
                      alt="Mimo si bunglon hijau ber-headband biru petir sedang berpikir"
                      className="w-full h-full object-contain rounded-2xl drop-shadow-sm select-none pointer-events-none"
                      src="/design/mimo-4.png"
                      width={1024}
                      height={1024}
                    ></Image>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-surface rounded-full p-1.5 shadow-sm text-base">
                    🌱
                  </span>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="relative inline-block bg-surface px-5 py-3.5 rounded-2xl md:rounded-tl-sm shadow-sm text-left">
                    <p className="font-display font-extrabold text-base md:text-lg text-primary leading-snug">
                      “Sabar bentar ya, Manda! Mimo lagi baca bab ini
                      pelan-pelan biar nanti enak dipelajari.”
                    </p>
                    <div className="hidden md:block absolute -left-2 top-4 w-3 h-3 bg-surface rotate-45"></div>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center justify-center md:justify-start gap-1.5">
                    <span
                      className="material-symbols-outlined text-sm text-mint-dark"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>
                      Mimo sedang menyesuaikan format materi dengan gaya santai
                      favoritmu.
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-primary">
                  <span>Proses Transformasi Adaptif</span>
                  <span className="text-mint-dark font-mono text-sm font-bold">
                    {statusLabel}
                  </span>
                </div>
                <div
                  className="w-full h-3 rounded-full bg-divider overflow-hidden p-0.5"
                  aria-label={
                    job.status === "processing"
                      ? "Pemrosesan berlangsung, persentase belum tersedia"
                      : statusLabel
                  }
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mint-dark via-mimo-green to-mint transition-all duration-700 ease-out"
                    style={{ width: job.status === "ready" ? "100%" : "35%" }}
                    aria-hidden="true"
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-gray">
                  Langkah Pemrosesan
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    ["Sumber tersimpan", "Teks sumber sudah siap dibaca."],
                    [
                      "Penyusunan konsep dan latihan",
                      job.status === "ready"
                        ? "Selesai"
                        : job.status === "processing"
                          ? "Sedang diproses"
                          : job.status === "failed"
                            ? "Perlu dicoba lagi"
                            : "Menunggu kamu memulai",
                    ],
                    [
                      "Materi siap dipelajari",
                      job.status === "ready"
                        ? "Siap dibuka"
                        : "Menunggu hasil penyusunan",
                    ],
                  ].map(([title, status], i) => (
                    <div
                      key={title}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-canvas"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-mint flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-bold text-primary">
                          {title}
                        </h3>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-butter/40 flex items-start sm:items-center gap-3.5">
                <span className="text-2xl shrink-0 select-none">💡</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-butter-dark">
                    Manda bisa tinggalin halaman ini dulu kok. Progresnya nggak
                    akan hilang dan Mimo bakal kasih kabar begitu semuanya siap!
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-divider">
                <button
                  className="w-full sm:w-auto text-center px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-primary rounded-xl hover:bg-canvas transition-colors focus-visible:outline-focus"
                  type="button"
                  onClick={onBack}
                >
                  Kembali ke Beranda Utama
                </button>
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-canvas text-muted-gray text-xs font-bold cursor-not-allowed select-none"
                    type="button"
                    onClick={onRefresh}
                    disabled={busy}
                  >
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-muted-gray"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>Tunggu di Sini</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-muted-gray py-2">
              ID Pekerjaan:{" "}
              <span className="font-mono text-primary font-medium">
                {job.title}
              </span>{" "}
              • Aman &amp; Terenkripsi
            </div>
          </div>
        </div>
        <section className="max-w-3xl mx-auto bg-surface rounded-2xl p-6 mt-6 space-y-4">
          <h2 className="text-xl font-bold text-primary">{statusLabel}</h2>
          <p role="status">{job.stage}</p>
          {job.error && (
            <p role="alert" className="text-error">
              {job.error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              disabled={busy}
              onClick={onBack}
              className="min-h-[44px] px-4 rounded-xl bg-canvas"
            >
              Kembali ke materi
            </button>
            <button
              disabled={busy}
              onClick={onSource}
              className="min-h-[44px] px-4 rounded-xl bg-canvas"
            >
              Lihat sumber
            </button>
            {job.status === "ready" ? (
              <button
                disabled={busy}
                onClick={onOpen}
                className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
              >
                Buka materi
              </button>
            ) : (
              <button
                disabled={busy || job.status === "processing"}
                onClick={onProcess}
                className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
              >
                {job.status === "failed"
                  ? "Coba proses lagi"
                  : "Mulai pemrosesan"}
              </button>
            )}
            <button
              disabled={busy}
              onClick={onRefresh}
              className="min-h-[44px] px-4 rounded-xl bg-canvas"
            >
              Perbarui status
            </button>
          </div>
          {source && (
            <div className="space-y-4">
              {source.map((s) => (
                <article key={s.id}>
                  <h3 className="font-semibold">{s.label}</h3>
                  <p className="whitespace-pre-wrap">{s.text}</p>
                </article>
              ))}
              <button onClick={onCloseSource}>Tutup sumber</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

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
    <div className="stitch-screen">
      <div className="flex flex-col w-full max-w-6xl mx-auto space-y-space-lg pb-space-xxl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <button
            className="inline-flex items-center gap-space-xs font-label text-label text-primary hover:text-secondary transition-colors group"
            onClick={onBack}
          >
            <span
              className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            >
              arrow_back
            </span>
            <span>Kembali ke Materi Saya</span>
            <span className="font-metadata text-metadata text-text-secondary font-normal">
              (Bisa ditinggal, proses tetap jalan di latar)
            </span>
          </button>
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-fixed/40 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
            <span className="font-metadata text-metadata text-on-secondary-fixed-variant">
              Proses Aman di Cloud • Bebas Kuota Berulang
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-8 space-y-space-lg">
            <div className="bg-surface rounded-2xl p-space-lg md:p-space-xl shadow-sm relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-butter/40 blur-2xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-lg relative z-10">
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-secondary-container/30 flex items-center justify-center p-2 relative">
                    <Image
                      className="w-full h-full object-contain"
                      data-alt="Illustration in warm indie picture-book zine style showing Mimo the friendly chameleon perched on a stack of three colorful books (soft mint, lavender, and peach). Mimo has big curious eyes, soft green skin with a gentle blush on the cheek, holding a small pencil thoughtfully. Natural cream background with clean ink contours and warm light."
                      src="/design/mimo.png"
                      width={1024}
                      height={1024}
                      alt="Mimo sedang menyiapkan materi"
                    />

                    <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary px-space-xs py-0.5 rounded-md shadow-sm flex items-center gap-1 font-metadata text-[11px]">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        aria-hidden="true"
                      >
                        psychology
                      </span>
                      <span>Fokus Mode</span>
                    </div>
                  </div>
                  <span className="mt-2 font-display text-metadata font-bold text-primary tracking-wide">
                    Mimo sang Kurator
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="relative bg-surface-container-low p-space-md rounded-2xl shadow-sm mb-space-md border-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[20px]"
                        aria-hidden="true"
                      >
                        chat_bubble
                      </span>
                      <span className="font-label text-label font-bold text-primary">
                        Bisikan Ramah Mimo
                      </span>
                    </div>
                    <p className="font-mimo-voice text-mimo-voice text-primary leading-relaxed">
                      “Mimo lagi nyusun materinya jadi zine belajar yang ramah
                      di mata. Tenang ya, kamu nggak perlu nungguin layar ini
                      terus kok!”
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h1 className="font-page-title text-page-title text-primary tracking-tight">
                      {job.status === "ready"
                        ? "Materimu sudah siap dipelajari!"
                        : job.status === "failed"
                          ? "Kita bisa mencoba menyusun lagi."
                          : "Mimo sedang merapikan materi belajarmu..."}
                    </h1>
                    <p className="font-reading text-reading text-text-secondary leading-relaxed">
                      Mengubah berkas{" "}
                      <code className="px-2 py-0.5 rounded-md bg-surface-container-highest text-primary font-mono text-[13px] font-semibold">
                        {job.title}
                      </code>{" "}
                      menjadi format adaptif bebas cemas.
                    </p>
                  </div>

                  <div className="mt-space-md flex flex-wrap items-center gap-space-sm justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter text-primary font-label text-label font-bold">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        hourglass_top
                      </span>
                      <span>
                        {
                          "Proses dapat memerlukan sekitar 90 detik. Sumber tetap tersimpan jika perlu diulang."
                        }
                      </span>
                    </span>
                    <span className="font-metadata text-metadata text-text-secondary">
                      {
                        "Proses dapat memerlukan sekitar 90 detik. Sumber tetap tersimpan jika perlu diulang."
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between gap-space-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Progres Penyusunan Transparan
                </h2>
                <span className="px-space-sm py-1 rounded-full bg-secondary-container text-primary font-label text-[12px]">
                  {statusLabel}
                </span>
              </div>
              <div className="flex flex-col gap-space-md mt-space-lg">
                {[
                  {
                    title: "Sumber teks tersimpan",
                    done: true,
                    description: "Teks sumber dapat diperiksa kembali.",
                  },
                  {
                    title: "Menyusun konsep dan latihan",
                    done: job.status === "ready",
                    description:
                      job.status === "queued"
                        ? "Siap diproses saat kamu memilih mulai."
                        : job.status === "failed"
                          ? "Proses perlu dicoba kembali."
                          : job.status === "ready"
                            ? "Konsep dan soal selesai disusun."
                            : "Gemini sedang menyusun materi dari sumbermu.",
                  },
                  {
                    title: "Validasi dan simpan materi",
                    done: job.status === "ready",
                    description:
                      job.status === "ready"
                        ? "Materi siap dibuka."
                        : "Hasil diperiksa server sebelum disimpan.",
                  },
                ].map((stage, i) => (
                  <div
                    key={stage.title}
                    className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low"
                  >
                    <span
                      className={
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 " +
                        (stage.done
                          ? "bg-secondary-container text-primary"
                          : "bg-surface-container text-text-secondary")
                      }
                    >
                      {stage.done ? (
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[20px]"
                        >
                          check
                        </span>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div>
                      <h3 className="font-label text-label text-primary">
                        {stage.title}
                      </h3>
                      <p className="font-metadata text-metadata text-text-secondary mt-1">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-metadata text-metadata text-text-secondary mt-space-md">
                {job.stage}
              </p>
              <progress
                className="w-full h-2 rounded-full mt-space-sm"
                max={100}
                value={
                  job.status === "ready"
                    ? 100
                    : job.status === "queued"
                      ? 0
                      : undefined
                }
                aria-label="Penyusunan materi"
              />
              {job.error && (
                <p
                  role="alert"
                  className="font-body text-body text-error mt-space-md"
                >
                  {job.error}
                </p>
              )}
            </div>

            <div className="p-space-lg rounded-2xl bg-secondary-fixed/30 flex items-start gap-space-md relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 shadow-sm text-secondary">
                <span
                  className="material-symbols-outlined text-[24px]"
                  aria-hidden="true"
                >
                  lightbulb
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label text-label font-bold text-primary">
                    Temuan Seru Selagi Menunggu
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-metadata text-[12px] text-text-secondary">
                    Sejarah Matematika
                  </span>
                </div>
                <p className="font-reading text-reading text-primary">
                  {job.title}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-space-lg">
            <div className="bg-surface rounded-2xl p-space-lg shadow-sm space-y-space-lg">
              <div>
                <h2 className="font-section-title text-section-title text-primary">
                  Aksi &amp; Kendali
                </h2>
                <p className="font-metadata text-metadata text-text-secondary mt-1">
                  Kamu memegang kendali penuh. Tidak ada kewajiban menatap
                  proses hingga selesai.
                </p>
              </div>

              <div className="space-y-space-xs">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-primary text-on-primary font-label text-label flex items-center justify-center gap-space-xs hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm text-center"
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    pause_circle
                  </span>
                  <span>Tinggalkan Halaman &amp; Lanjut di Latar</span>
                </button>
                <span className="block text-center font-metadata text-[12px] text-text-secondary">
                  Berkas otomatis tersimpan di tab “Materi Saya” saat selesai.
                </span>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm">
                <p className="font-metadata text-metadata text-text-secondary">
                  Kamu bisa kembali ke katalog dan memeriksa status lagi saat
                  siap.
                </p>
              </div>

              <div className="space-y-1">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container text-muted-gray font-label text-label flex items-center justify-center gap-space-xs cursor-not-allowed"
                  disabled={busy}
                  onClick={() =>
                    job.status === "ready" ? onOpen() : onProcess()
                  }
                >
                  {job.status === "ready"
                    ? "Buka ringkasan"
                    : job.status === "failed"
                      ? "Ulang pemrosesan"
                      : "Susun bersama Mimo"}
                </button>
                <div className="flex items-center gap-1 justify-center text-muted-gray font-metadata text-[11px]">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    aria-hidden="true"
                  >
                    info
                  </span>
                  <span>
                    Pratinjau terbuka otomatis setelah Tahap 2 selesai
                  </span>
                </div>
              </div>

              <div className="h-px bg-surface-container-high w-full"></div>

              <div className="space-y-space-xs">
                <span className="font-metadata text-metadata text-text-secondary font-semibold uppercase tracking-wider block">
                  Ingin lihat hasilnya seperti apa?
                </span>
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label flex items-center justify-between hover:bg-surface-container transition-colors group"
                  onClick={onBack}
                >
                  <div className="flex items-center gap-space-xs">
                    <span
                      className="material-symbols-outlined text-secondary text-[18px]"
                      aria-hidden="true"
                    >
                      local_florist
                    </span>
                    <span>Lihat Contoh Zine (Fotosintesis)</span>
                  </div>
                  <span
                    className="material-symbols-outlined text-[16px] text-muted-gray group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  >
                    open_in_new
                  </span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-2 text-center text-error hover:bg-error-surface rounded-xl font-label text-label transition-colors flex items-center justify-center gap-1.5"
                  type="button"
                  disabled={busy}
                  onClick={onBack}
                >
                  {"Kembali ke daftar materi"}
                </button>
                <span className="block text-center font-metadata text-[11px] text-muted-gray mt-1">
                  Tanpa penalti dan catatan tersimpan tetap utuh.
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-space-lg shadow-sm space-y-space-sm">
              <h3 className="font-card-title text-card-title text-primary flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[18px] text-secondary"
                  aria-hidden="true"
                >
                  description
                </span>
                <span>Detail Berkas Masuk</span>
              </h3>
              <dl className="space-y-2 font-metadata text-metadata">
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <dt className="text-text-secondary">Mata Pelajaran</dt>
                  <dd className="font-semibold text-primary">
                    Matematika SMP (Kelas 8)
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <dt className="text-text-secondary">Format Asal</dt>
                  <dd className="font-semibold text-primary">
                    PDF Scan Tulisan Tangan
                  </dd>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <dt className="text-text-secondary">Gaya Keluaran</dt>
                  <dd className="font-semibold text-primary">
                    Zine Visual Ramah Baca
                  </dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-text-secondary">Status Aksesibilitas</dt>
                  <dd className="inline-flex items-center gap-1 text-success font-semibold">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Teks Terbaca Screen Reader</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-space-sm mt-space-md">
        <button
          disabled={busy}
          onClick={onRefresh}
          className="h-11 px-space-lg bg-surface rounded-xl text-primary font-label text-label"
        >
          Perbarui status
        </button>
        <button
          disabled={busy}
          onClick={onSource}
          className="h-11 px-space-lg bg-surface rounded-xl text-primary font-label text-label"
        >
          Lihat sumber tersimpan
        </button>
      </div>
      {source && (
        <section className="bg-surface p-space-lg rounded-2xl mt-space-lg">
          <h2 className="font-section-title text-section-title text-primary">
            Sumber tersimpan
          </h2>
          {source.map((s) => (
            <article key={s.id} className="mt-space-md">
              <h3 className="font-label text-label text-primary">{s.label}</h3>
              <p
                className="font-body text-body text-text-secondary"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {s.text}
              </p>
            </article>
          ))}
          <button
            onClick={onCloseSource}
            className="mt-space-md h-11 px-space-lg bg-surface-container rounded-xl text-primary"
          >
            Tutup sumber
          </button>
        </section>
      )}
    </div>
  );
}

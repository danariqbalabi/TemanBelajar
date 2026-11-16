import Image from "next/image";
import { Modal } from "./modal";
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
      <div className="final-design final-screen-10 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin py-space-md sm:py-space-lg flex flex-col gap-space-lg ui-container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
              <div className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant flex-wrap">
                <a
                  className="hover:text-primary transition-colors flex items-center gap-1 font-label text-label text-primary"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    folder_open
                  </span>
                  Materi Saya
                </a>
                <span className="text-outline-variant font-bold">/</span>
                <span className="text-on-surface-variant">
                  Proses Ekstraksi
                </span>
                <span className="text-outline-variant font-bold">/</span>
                <span className="font-bold text-contrast-ink bg-surface-container-high px-2 py-0.5 rounded-full text-[13px]">
                  {job.title}
                </span>
              </div>
              <a
                className="inline-flex items-center gap-space-xs text-secondary hover:text-primary font-label text-label transition-colors"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>
                  Kembali ke Materi Saya{" "}
                  <span className="hidden md:inline text-outline text-[13px] font-normal">
                    (Mimo tetap proses di latar)
                  </span>
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <div className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-divider flex flex-col md:flex-row gap-space-md items-center md:items-start relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-mint-tint pointer-events-none -z-0 opacity-85"></div>
                  <div className="absolute top-3 right-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lavender-tint border border-lavender/30 text-primary font-label text-[11px]">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      aria-hidden="true"
                    >
                      auto_awesome
                    </span>
                    <span>AI Engine v2 · Bebas Stres</span>
                  </div>

                  <div className="relative z-10 shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-mint-tint to-butter-tint/50 border border-secondary-container flex items-center justify-center p-2.5 shadow-sm group">
                    <div className="absolute -top-2 -left-2 px-2 py-0.5 rounded-md bg-secondary text-on-secondary font-label text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[12px]"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                      <span>Mimo Temanmu</span>
                    </div>
                    <Image
                      alt=""
                      className="w-full h-full object-contain select-none transition-transform group-hover: duration-700 ease-out object-contain"
                      src="/design/mimo-final.png"
                      width={1408}
                      height={1120}
                    ></Image>
                  </div>

                  <div className="relative z-10 flex flex-col gap-space-xs flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-butter-tint border border-butter text-warning font-label text-[12px] tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
                        Sedang Mengolah
                      </div>
                      <span className="text-[11px] font-label text-outline bg-surface-container px-2 py-0.5 rounded-full">
                        Format Adaptif SMP
                      </span>
                    </div>
                    <h1 className="font-display text-page-title sm:text-display-mobile text-primary tracking-tight mt-0.5 ui-page-title">
                      {statusLabel}
                    </h1>
                    <p className="font-reading text-reading text-on-surface-variant leading-relaxed">
                      {job.title}
                    </p>

                    <div className="mt-space-sm pt-space-xs flex flex-col gap-1.5 w-full bg-surface-container-low/70 border border-divider p-3 rounded-xl">
                      <div className="flex items-center justify-between text-label font-label">
                        <span className="text-contrast-ink font-bold flex items-center gap-1.5 text-[13px]">
                          <span
                            className="material-symbols-outlined text-[18px] text-secondary animate-pulse"
                            aria-hidden="true"
                          >
                            hourglass_top
                          </span>
                          Langkah 2 dari 3 sedang berjalan
                        </span>
                        <span className="text-primary font-bold bg-secondary-container border border-secondary-fixed px-2.5 py-0.5 rounded-full text-[13px] flex items-center gap-1">
                          {statusLabel}
                        </span>
                      </div>

                      <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden p-0.5 border border-outline-variant/40">
                        <div
                          aria-label="Kemajuan pemrosesan materi"
                          className="h-full bg-gradient-to-r from-secondary via-primary to-secondary rounded-full transition-all duration-700 ease-out shadow-sm animate-pulse"
                          id="overall-progress-bar"
                          role="progressbar"
                          style={{
                            width:
                              job.status === "ready"
                                ? "100%"
                                : job.status === "processing"
                                  ? "100%"
                                  : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-lavender-tint rounded-xl p-space-md sm:p-space-lg flex items-start gap-space-md">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-on-tertiary-fixed shadow-sm">
                    <span
                      className="material-symbols-outlined text-[22px]"
                      aria-hidden="true"
                    >
                      format_quote
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-mimo-voice text-mimo-voice text-primary">
                      &quot;Tunggu sebentar ya!&quot;
                    </p>
                    <p className="font-reading text-body text-contrast-ink leading-relaxed">
                      {job.stage}
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-divider flex flex-col gap-space-md">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-mint-tint flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          account_tree
                        </span>
                      </div>
                      <div>
                        <h2 className="font-section-title text-section-title text-primary leading-tight ui-section-title">
                          Alur Adaptasi Belajar
                        </h2>
                        <p className="text-metadata font-metadata text-on-surface-variant text-[12px]">
                          {job.stage}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-metadata font-metadata text-secondary bg-mint-tint border border-secondary-container px-2.5 py-1 rounded-full text-[12px] font-label">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Otomatis &amp; Sensorik
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-md">
                    <div className="bg-mint-tint border border-secondary-container rounded-xl p-space-md flex flex-col gap-space-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                        <div className="flex items-start gap-space-md flex-1">
                          <div className="shrink-0 w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold shadow-sm">
                            <span
                              className="material-symbols-outlined text-[20px]"
                              aria-hidden="true"
                            >
                              check
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="w-10 h-10 rounded-full bg-mint-tint flex items-center justify-center font-bold">
                              1
                            </span>
                            <div>
                              <h3 className="font-bold ui-card-title">
                                Membaca materi
                              </h3>
                              <p className="text-sm">
                                {job.status === "ready"
                                  ? "Selesai"
                                  : job.status === "failed"
                                    ? "Pemrosesan terhenti"
                                    : job.status === "processing"
                                      ? "Sedang disusun oleh layanan"
                                      : "Menunggu pemrosesan"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-label text-success bg-surface px-2.5 py-1 rounded-full border border-secondary-container shadow-sm">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            timer
                          </span>
                          Selesai dlm 12 dtk
                        </span>
                      </div>

                      <div className="sm:pl-12 flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-label text-secondary">
                          Hasil Ekstraksi:
                        </span>
                        <span className="text-[11px] font-metadata bg-surface/90 text-on-surface px-2 py-0.5 rounded border border-divider flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[13px] text-success"
                            aria-hidden="true"
                          >
                            task_alt
                          </span>{" "}
                          4 Sub-bab Utama
                        </span>
                        <span className="text-[11px] font-metadata bg-surface/90 text-on-surface px-2 py-0.5 rounded border border-divider flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[13px] text-success"
                            aria-hidden="true"
                          >
                            task_alt
                          </span>{" "}
                          16 Istilah Medis
                        </span>
                        <span className="text-[11px] font-metadata bg-surface/90 text-on-surface px-2 py-0.5 rounded border border-divider flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[13px] text-success"
                            aria-hidden="true"
                          >
                            task_alt
                          </span>{" "}
                          3 Diagram Anatomi
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low border-2 border-secondary/40 rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                        <div className="flex items-start gap-space-md flex-1">
                          <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold relative shadow-sm">
                            <span
                              className="material-symbols-outlined text-[20px] animate-spin"
                              aria-hidden="true"
                            >
                              sync
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="w-10 h-10 rounded-full bg-mint-tint flex items-center justify-center font-bold">
                              2
                            </span>
                            <div>
                              <h3 className="font-bold ui-card-title">
                                Mengenali konsep
                              </h3>
                              <p className="text-sm">
                                {job.status === "ready"
                                  ? "Selesai"
                                  : job.status === "failed"
                                    ? "Pemrosesan terhenti"
                                    : job.status === "processing"
                                      ? "Sedang disusun oleh layanan"
                                      : "Menunggu pemrosesan"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-label text-primary bg-secondary-container border border-secondary px-3 py-1 rounded-full shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                          {job.status === "ready"
                            ? "Siap dipelajari"
                            : "Menunggu hasil penyusunan"}
                        </span>
                      </div>

                      <div className="pl-0 sm:pl-12 flex flex-wrap gap-space-xs pt-space-xs">
                        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface border border-divider text-primary text-[13px] font-label shadow-sm">
                          <span
                            className="material-symbols-outlined text-success text-[16px]"
                            aria-hidden="true"
                          >
                            verified
                          </span>
                          <span>
                            {job.status === "ready"
                              ? "Siap dipelajari"
                              : "Menunggu hasil penyusunan"}
                          </span>
                          <span className="text-outline text-[11px]">
                            (Terverifikasi)
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface border border-divider text-primary text-[13px] font-label shadow-sm">
                          <span
                            className="material-symbols-outlined text-success text-[16px]"
                            aria-hidden="true"
                          >
                            verified
                          </span>
                          <span>
                            {job.status === "ready"
                              ? "Siap dipelajari"
                              : "Menunggu hasil penyusunan"}
                          </span>
                          <span className="text-outline text-[11px]">
                            (Dipetakan)
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-butter-tint border border-butter text-warning text-[13px] font-label shadow-sm">
                          <span
                            className="material-symbols-outlined text-[16px] animate-spin"
                            aria-hidden="true"
                          >
                            settings
                          </span>
                          <span>Glosarium Sensorik</span>
                          <span className="text-[11px] font-normal">
                            (Menyusun arti istilah)
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface border border-divider text-outline text-[13px] font-label opacity-75">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            aria-hidden="true"
                          >
                            pending
                          </span>
                          <span>Kulit &amp; Paru-paru</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-canvas border border-divider rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md opacity-90">
                      <div className="flex items-start gap-space-md flex-1">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant text-outline flex items-center justify-center font-bold">
                          <span className="text-label">3</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="w-10 h-10 rounded-full bg-mint-tint flex items-center justify-center font-bold">
                            3
                          </span>
                          <div>
                            <h3 className="font-bold ui-card-title">
                              Menyiapkan aktivitas belajar
                            </h3>
                            <p className="text-sm">
                              {job.status === "ready"
                                ? "Selesai"
                                : job.status === "failed"
                                  ? "Pemrosesan terhenti"
                                  : job.status === "processing"
                                    ? "Sedang disusun oleh layanan"
                                    : "Menunggu pemrosesan"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-label text-outline bg-surface-container-high px-2.5 py-1 rounded-full">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          aria-hidden="true"
                        >
                          schedule
                        </span>
                        Menunggu giliran
                      </span>
                    </div>
                  </div>

                  <div className="bg-mint-tint/50 border border-secondary-container/60 rounded-xl px-space-md py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0"></span>
                      <span
                        className="material-symbols-outlined text-[16px] text-secondary shrink-0"
                        aria-hidden="true"
                      >
                        terminal
                      </span>
                      <span className="font-metadata text-metadata text-primary truncate text-[12px]">
                        <span className="font-bold text-secondary">
                          Live Log:
                        </span>{" "}
                        Menganalisis paragraf 14 dari 28... Mengubah istilah
                        kedokteran ke analogi sehari-hari.
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] font-label text-outline hidden sm:inline">
                      Real-time AI Sync
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-divider flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <h2 className="font-card-title text-card-title text-primary ui-section-title">
                      Detail Dokumen
                    </h2>
                    <p className="font-bold mt-4">{job.title}</p>
                    <p role="status" className="text-sm mt-2">
                      {job.stage}
                    </p>
                    {job.error && (
                      <p role="alert" className="text-error mt-3">
                        {job.error}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={onRefresh}
                        disabled={busy}
                        className="p-3 border border-divider rounded-xl"
                      >
                        Perbarui status
                      </button>
                      <button
                        onClick={onSource}
                        disabled={busy}
                        className="p-3 border border-divider rounded-xl"
                      >
                        Lihat sumber
                      </button>
                    </div>
                  </div>

                  <div className="bg-canvas border border-divider rounded-xl p-space-sm flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-lg bg-peach-tint border border-peach/50 flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[26px] text-warning"
                        aria-hidden="true"
                      >
                        picture_as_pdf
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p
                        className="font-label text-label text-primary truncate"
                        title="Bab 4 Sistem Ekskresi Manusia.pdf"
                      >
                        {job.title}
                      </p>
                      <p className="text-metadata font-metadata text-outline text-[12px]">
                        {job.stage}
                      </p>
                      <div className="w-full bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs pt-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-metadata font-metadata text-outline uppercase tracking-wider text-[11px] font-bold">
                        Preferensi Belajar Terpilih
                      </span>
                      <span className="text-[11px] text-secondary font-label">
                        4 Pengaturan
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between py-1 text-metadata font-metadata border-b border-divider/50">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[16px] text-secondary"
                            aria-hidden="true"
                          >
                            spellcheck
                          </span>
                          Font Ramah Disleksia
                        </span>
                        <span className="font-label text-primary text-[13px] bg-mint-tint px-2 py-0.5 rounded border border-secondary-container/50">
                          Aktif
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-metadata font-metadata border-b border-divider/50">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[16px] text-secondary"
                            aria-hidden="true"
                          >
                            timer
                          </span>
                          Durasi Belajar/Sesi
                        </span>
                        <span className="font-label text-primary text-[13px] bg-surface-container px-2 py-0.5 rounded">
                          15 Menit
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-metadata font-metadata border-b border-divider/50">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[16px] text-secondary"
                            aria-hidden="true"
                          >
                            touch_app
                          </span>
                          Glosarium Sensorik
                        </span>
                        <span className="font-label text-primary text-[13px] bg-mint-tint px-2 py-0.5 rounded border border-secondary-container/50">
                          Diaktifkan
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-metadata font-metadata">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[16px] text-secondary"
                            aria-hidden="true"
                          >
                            contrast
                          </span>
                          Tingkat Kontras
                        </span>
                        <span className="font-label text-primary text-[13px] bg-surface-container px-2 py-0.5 rounded">
                          Standar Lembut
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-space-sm flex flex-col gap-space-sm">
                    <button
                      className="w-full py-3 px-space-md rounded-xl bg-primary text-on-primary disabled:cursor-not-allowed font-label text-label flex items-center justify-center gap-2 transition-all shadow-sm border border-outline-variant/30"
                      disabled={busy || job.status === "processing"}
                      id="btn-preview"
                      type="button"
                      onClick={job.status === "ready" ? onOpen : onProcess}
                    >
                      {job.status === "ready"
                        ? "Lihat Materi"
                        : job.status === "failed"
                          ? "Coba proses lagi"
                          : job.status === "processing"
                            ? "Sedang diproses…"
                            : "Mulai pemrosesan"}
                    </button>
                    <a
                      className="w-full py-3 px-space-md rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label flex items-center justify-center gap-2 transition-all text-center shadow-sm"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        visibility_off
                      </span>
                      <span>Proses di Latar Belakang</span>
                    </a>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        className="text-metadata font-metadata text-error hover:underline transition-colors flex items-center gap-1 text-[13px]"
                        type="button"
                        onClick={onBack}
                      >
                        Kembali ke materi
                      </button>
                      <button
                        className="text-metadata font-metadata text-on-surface-variant hover:text-primary transition-colors text-[13px] flex items-center gap-1"
                        type="button"
                        onClick={onBack}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          swap_horiz
                        </span>
                        Ganti Berkas Lain
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-peach-tint/60 border border-peach/40 rounded-2xl p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center gap-2 text-primary font-label text-label">
                    <span
                      className="material-symbols-outlined text-[20px] text-secondary"
                      aria-hidden="true"
                    >
                      verified_user
                    </span>
                    <span>Jaminan Akurasi Materi</span>
                  </div>
                  <p className="text-metadata font-metadata text-contrast-ink leading-relaxed">
                    {job.stage}
                  </p>
                </div>

                <div className="bg-surface rounded-2xl p-space-md shadow-sm border border-divider flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-secondary text-[22px]"
                        aria-hidden="true"
                      >
                        auto_stories
                      </span>
                      <h3 className="font-card-title text-card-title text-primary ui-card-title">
                        Sambil Menunggu?
                      </h3>
                    </div>
                    <span className="text-[11px] font-label text-secondary bg-mint-tint px-2 py-0.5 rounded-full">
                      Demo Siap
                    </span>
                  </div>
                  <p className="text-metadata font-metadata text-on-surface-variant text-[13px]">
                    Kamu bisa coba intip contoh modul interaktif yang sudah
                    rampung:
                  </p>
                  <a
                    className="flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-surface-container border border-divider transition-all group"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onBack();
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-mint-tint flex items-center justify-center text-primary shrink-0">
                        <span
                          className="material-symbols-outlined text-[20px] text-secondary"
                          aria-hidden="true"
                        >
                          eco
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label text-label text-primary truncate">
                          Fotosintesis pada Daun
                        </span>
                        <span className="text-[11px] text-outline font-metadata">
                          Modul Santai • 12 Menit
                        </span>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform text-[20px] shrink-0"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {source && (
        <Modal title="Teks sumber asli" onClose={onCloseSource}>
          {source.map((s) => (
            <article key={s.id}>
              <h3 className="ui-card-title">{s.label}</h3>
              <p className="whitespace-pre-wrap">{s.text}</p>
            </article>
          ))}
        </Modal>
      )}
    </>
  );
}

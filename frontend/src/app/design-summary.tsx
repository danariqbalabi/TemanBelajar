"use client";
import { useRef } from "react";
import Image from "next/image";
import type { Material } from "@/lib/types";
export function SummaryDesign({
  material,
  onBack,
  onChoose,
  onPlan,
}: {
  material: Material;
  onBack: () => void;
  onChoose: () => void;
  onPlan: () => void;
}) {
  const sourceDialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="stitch-screen">
      <div className="flex flex-col w-full pb-space-xxl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
          <div className="flex items-center gap-space-sm">
            <button
              className="inline-flex items-center gap-space-xs text-text-secondary hover:text-primary transition-colors font-label text-label py-1 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-focus"
              onClick={onBack}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                arrow_back
              </span>
              <span>Kembali ke Materi Saya</span>
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>
                Siap Dipelajari • Disesuaikan untuk Nadia (SMP Kelas 8)
              </span>
            </span>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={() => sourceDialog.current?.showModal()}
            >
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                file_present
              </span>
              <span>Sumber Catatan Asli (PDF)</span>
            </button>
            <button
              className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-xl bg-surface-container-high text-primary font-label text-label hover:bg-surface-variant transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={() => window.print()}
            >
              <span
                className="material-symbols-outlined text-[18px] text-text-secondary"
                aria-hidden="true"
              >
                print
              </span>
              <span>Ekspor Ringkasan Zine</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
          <div className="lg:col-span-8 flex flex-col justify-between bg-surface rounded-2xl p-space-lg md:p-space-xl shadow-sm">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-metadata text-[12px] font-semibold">
                  {material.subject}
                </span>
                <span className="text-text-secondary font-metadata text-[13px]">
                  • Kurasi Adaptif Tenang
                </span>
              </div>
              <h1 className="font-page-title text-page-title text-primary tracking-tight">
                {material.title}
              </h1>
              <p className="font-reading text-reading text-text-secondary max-w-2xl leading-relaxed">
                Ringkasan konsep inti, analogi ramah mata, dan rujukan dokumen
                aslimu telah siap. Kamu bebas memilih cara belajar yang paling
                nyaman tanpa tekanan hafalan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-lg mt-space-lg bg-surface-container-low/60 rounded-xl p-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    hourglass_empty
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                    Waktu Fleksibel
                  </span>
                  <span className="font-label text-label text-primary">{`${material.concepts.reduce((n, c) => n + c.estimated_minutes, 0)} menit bacaan`}</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    auto_graph
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                    Kesiapan Konsep
                  </span>
                  <span className="font-label text-label text-primary">
                    82% Dasar Aljabar
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                    Gaya Belajar
                  </span>
                  <span className="font-label text-label text-primary">
                    5 Mode Adaptif
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-secondary-container/40 rounded-2xl p-space-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-secondary-fixed/50 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-metadata text-[12px] font-semibold text-primary">
                    Mimo Co-Pilot
                  </span>
                </div>
                <span className="font-metadata text-[12px] text-text-secondary">
                  Siap mendampingi
                </span>
              </div>

              <div className="relative bg-surface rounded-2xl p-space-md shadow-sm mt-space-xs">
                <div className="font-mimo-voice text-mimo-voice text-primary leading-snug">{`${material.concepts.length} konsep • ${material.question_count} soal`}</div>
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-surface rotate-45"></div>
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-center mt-space-md pt-2">
              <Image
                alt="Mimo, teman belajarmu"
                className="w-32 h-32 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
                src="/design/mimo.png"
                width={1024}
                height={1024}
              />
            </div>
          </div>
        </div>

        <section className="bg-secondary-container rounded-2xl p-space-lg md:p-space-xl mb-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
          <div className="flex items-start gap-space-md max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                navigation
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata text-[12px] uppercase tracking-wider text-on-secondary-container font-bold">
                Langkah Selanjutnya
              </span>
              <h2 className="font-section-title text-section-title text-primary">
                Siap Belajar? Pilih Modus yang Paling Pas untuk Hari Ini
              </h2>
              <p className="font-body text-body text-on-secondary-container mt-1">
                Rekomendasi Mimo: <strong>Mode Teman Baca</strong> (fokus
                pemahaman bertahap dengan bimbingan santai tanpa timer ujian).
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto shrink-0">
            <button
              className="w-full sm:w-auto h-12 px-space-lg rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label flex items-center justify-center gap-space-xs shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={onChoose}
            >
              <span>Pilih Cara Belajar</span>
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </button>
            <button
              className="w-full sm:w-auto h-12 px-space-md rounded-xl bg-surface/90 hover:bg-surface text-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={onPlan}
            >
              {
                <>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px]"
                  >
                    calendar_month
                  </span>
                  Atur di Rencana
                </>
              }
            </button>
          </div>
        </section>

        <div className="flex flex-col gap-space-md mb-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs">
            <div>
              <span className="font-metadata text-[12px] uppercase tracking-wider text-secondary font-bold">
                Struktur Ringkasan
              </span>
              <h2 className="font-section-title text-section-title text-primary">{`${material.concepts.length} Konsep Inti yang Perlu Kamu Tahu`}</h2>
            </div>
            <p className="font-metadata text-metadata text-text-secondary">
              {material.concepts[0]?.paragraphs[0]}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {material.concepts.map((c, index) => (
              <article
                className="bg-surface rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                key={c.id}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center font-label text-[13px] text-primary font-bold">
                      {index + 1}
                    </span>
                    <span className="font-metadata text-[12px] text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded">{`Rujukan: ${c.source_ids.map((id) => material.sources.find((s) => s.id === id)?.label || id).join(", ")}`}</span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    {c.title}
                  </h3>
                  <p className="font-body text-body text-text-secondary mb-space-md">
                    {c.paragraphs[0]}
                  </p>

                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col items-center justify-center my-space-xs">
                    <div className="w-full rounded-xl bg-surface-container-low p-space-md text-center">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[40px] text-secondary"
                      >
                        account_tree
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary">
                        {c.diagram_description || c.paragraphs[0]}
                      </p>
                    </div>
                    <span className="font-metadata text-[11px] text-text-secondary mt-1">
                      Sudut siku-siku selalu mengarah ke hipotenusa
                    </span>
                  </div>
                </div>
                <div className="pt-space-md mt-space-md bg-surface-container-lowest flex items-center justify-between text-text-secondary">
                  <span className="font-metadata text-[12px] flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    Kunci identifikasi awal
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
          <div className="lg:col-span-7 bg-surface rounded-2xl p-space-lg md:p-space-xl shadow-sm flex flex-col justify-between">
            <h3 className="font-section-title text-[18px] text-primary">
              Catatan Konsep
            </h3>
            {material.concepts.map((c) => (
              <details
                key={c.id}
                className="rounded-xl bg-surface-container-low p-space-sm"
              >
                <summary className="font-label text-label text-primary">
                  {c.title}
                </summary>
                <p className="font-metadata text-metadata text-text-secondary mt-space-sm">
                  {c.paragraphs[0]}
                </p>
              </details>
            ))}
          </div>

          <div className="lg:col-span-5 bg-surface rounded-2xl p-space-lg md:p-space-xl shadow-sm flex flex-col justify-between">
            <h3 className="font-section-title text-[18px] text-primary">
              Peta Relasi Belajar
            </h3>
            {material.concepts.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-surface-container-low p-space-sm font-metadata text-metadata text-primary"
              >
                {c.title}
                <p className="text-text-secondary">
                  {c.prerequisites.length
                    ? `Lanjut setelah ${c.prerequisites.map((id) => material.concepts.find((x) => x.id === id)?.title || id).join(", ")}`
                    : "Konsep awal"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <section className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md text-text-secondary">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                aria-hidden="true"
              >
                verified_user
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label text-label text-primary">
                {"Transparansi Sumber Materi"}
              </span>
              <p className="font-metadata text-[13px] text-text-secondary">
                {material.concepts[0]?.paragraphs[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 font-metadata text-[12px] text-text-secondary bg-surface-container-low px-3 py-1.5 rounded-lg">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              aria-hidden="true"
            >
              check
            </span>
            <span>Kepatuhan WCAG 2.2 Level AA</span>
          </div>
        </section>
      </div>
      <dialog ref={sourceDialog} className="stitch-reason">
        <h2 className="font-section-title text-section-title text-primary">
          Sumber materi
        </h2>
        {material.sources.map((s) => (
          <article key={s.id}>
            <h3 className="font-label text-label text-primary">{s.label}</h3>
            <p
              className="font-body text-body text-text-secondary"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {s.text}
            </p>
          </article>
        ))}
        <button onClick={() => sourceDialog.current?.close()}>
          Tutup sumber
        </button>
      </dialog>
    </div>
  );
}

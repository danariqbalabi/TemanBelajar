"use client";
import Image from "next/image";
import { useState } from "react";
import type {
  Attempt,
  Material,
  Recommendation,
  Preferences,
} from "@/lib/types";
export function ResultDesign({
  attempt,
  material,
  recommendation,
  busy,
  displayName,
  onBack,
  onRecommend,
  onRetry,
  onPlanner,
  onRest,
  onSaveReview,
  onSpeak,
  notice,
}: {
  attempt: Attempt;
  material: Material;
  recommendation: Recommendation | null;
  busy: boolean;
  displayName: string;
  onBack: () => void;
  onRecommend: () => void;
  onRetry: () => void;
  onPlanner: () => void;
  onRest: () => void;
  onSaveReview: () => void;
  onSpeak: (text?: string) => void;
  onPreferences?: (p: Partial<Preferences>) => void;
  notice: string | null;
}) {
  const correct = Object.values(attempt.answers).filter(
      (a) => a.correct,
    ).length,
    accuracy = Math.round((correct / attempt.questions.length) * 100);
  const [copied, setCopied] = useState("");
  async function copyReview() {
    try {
      await navigator.clipboard.writeText(
        attempt.questions
          .map((q) => q.prompt + "\n" + q.explanation)
          .join("\n\n"),
      );
      setCopied("Pembahasan disalin.");
    } catch {
      setCopied("Pilih teks pembahasan untuk menyalinnya secara manual.");
    }
  }
  return (
    <>
      <div className="final-design final-screen-18 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full">
          <div className="w-full bg-mint-tint/80 border-b border-divider py-space-sm px-margin">
            <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-space-sm ui-container">
              <div className="flex items-center gap-space-sm">
                <a
                  className="inline-flex items-center gap-space-xs font-label text-label text-primary hover:text-primary-hover transition-colors font-bold group"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke materi</span>
                </a>
                <span className="text-divider hidden sm:inline">•</span>
                <span className="hidden md:inline font-metadata text-metadata text-on-surface-variant">
                  Rute Sesi: /belajar/ipa-ekskresi/hasil
                </span>
              </div>
              <div className="flex items-center gap-space-xs sm:gap-space-sm">
                <button
                  className="inline-flex items-center gap-1 px-space-sm py-1 rounded-lg bg-surface border border-divider text-on-surface font-label text-label hover:bg-surface-container transition-colors min-h-[36px]"
                  id="btn-font-toggle"
                  title="Sesuaikan Ukuran Teks"
                  type="button"
                  onClick={onBack}
                  disabled={busy}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    format_size
                  </span>
                  <span className="text-[12px] font-bold">
                    Atur bacaan di materi
                  </span>
                </button>
                <button
                  className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-lg bg-surface border border-divider text-primary font-label text-label hover:bg-surface-container transition-colors min-h-[36px]"
                  type="button"
                  onClick={() => window.print()}
                  disabled={busy}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    print
                  </span>
                  <span className="hidden sm:inline">Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] w-full mx-auto px-margin py-space-lg flex flex-col gap-space-xl ui-container">
            <section className="w-full rounded-2xl bg-mint-tint border border-secondary/20 p-space-lg md:p-space-xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                <div className="lg:col-span-8 flex flex-col gap-space-md z-10">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface/90 border border-success/30 text-success self-start font-label text-[13px] font-bold">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      celebration
                    </span>
                    <span>Latihan Selesai Tanpa Terburu-buru</span>
                  </div>
                  <div className="space-y-space-xs">
                    <h1 className="font-display text-page-title md:text-[2.25rem] text-primary leading-tight font-extrabold ui-page-title">{`Terima kasih sudah berusaha, ${displayName}!`}</h1>
                    <p className="font-reading text-reading text-on-surface-variant max-w-2xl">
                      Kamu sudah menyelesaikan latihan. Tinjau jawaban dan
                      penjelasan di bawah sesuai hasil yang tersimpan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
                    <div className="bg-surface rounded-xl p-space-md border border-divider flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-success shrink-0">
                        <span
                          className="material-symbols-outlined text-[22px]"
                          aria-hidden="true"
                        >
                          task_alt
                        </span>
                      </div>
                      <div className="leading-tight">
                        <div className="font-label text-card-title text-primary font-bold">{`${correct} / ${attempt.questions.length} soal`}</div>
                        <div className="font-metadata text-metadata text-on-surface-variant">
                          {recommendation?.reason || material.title}
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface rounded-xl p-space-md border border-divider flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-butter-tint flex items-center justify-center text-warning shrink-0">
                        <span
                          className="material-symbols-outlined text-[22px]"
                          aria-hidden="true"
                        >
                          schedule
                        </span>
                      </div>
                      <div className="leading-tight">
                        <div className="font-label text-card-title text-primary font-bold">
                          6m 15d
                        </div>
                        <div className="font-metadata text-metadata text-on-surface-variant">
                          Irama Pikir Santai
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface rounded-xl p-space-md border border-divider flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-lavender-tint flex items-center justify-center text-on-tertiary-fixed-variant shrink-0">
                        <span
                          className="material-symbols-outlined text-[22px]"
                          aria-hidden="true"
                        >
                          trending_up
                        </span>
                      </div>
                      <div className="leading-tight">
                        <div className="font-label text-card-title text-primary font-bold">
                          {recommendation?.reason || material.title}
                        </div>
                        <div className="font-metadata text-metadata text-on-surface-variant">
                          Penguasaan Berkembang
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center relative">
                  <div className="bg-surface rounded-2xl p-space-md border border-divider shadow-sm relative max-w-sm mb-space-sm">
                    <div className="flex items-start gap-space-xs">
                      <span
                        className="material-symbols-outlined text-success text-[20px] shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        chat
                      </span>
                      <p className="font-mimo-voice text-on-surface text-[14px] leading-snug">
                        {displayName}
                      </p>
                    </div>

                    <div className="absolute -bottom-2 right-12 w-4 h-4 bg-surface border-b border-r border-divider transform rotate-45"></div>
                  </div>

                  <div className="w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center">
                    <Image
                      alt=""
                      className="max-h-full max-w-full object-contain select-none pointer-events-none  object-contain"
                      src="/design/mimo-final.png"
                      width={1408}
                      height={1120}
                    ></Image>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <section className="lg:col-span-8 flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs border-b border-divider">
                  <h2 className="font-section-title text-section-title text-primary font-bold ui-section-title">
                    Evaluasi Konsep &amp; Pembahasan Terbuka
                  </h2>
                  <p className="text-sm my-4">
                    {correct} dari {attempt.questions.length} jawaban tepat ·
                    akurasi latihan {accuracy}%
                  </p>
                  {attempt.questions.map((q, i) => (
                    <article
                      key={q.id}
                      className="bg-surface border border-divider rounded-2xl p-6 mb-4"
                    >
                      <span className="text-sm font-bold">
                        Soal {i + 1} ·{" "}
                        {attempt.answers[q.id]?.correct
                          ? "Tepat"
                          : "Perlu ditinjau"}
                      </span>
                      <h3 className="font-bold text-lg mt-3 ui-card-title">
                        {q.prompt}
                      </h3>
                      <p className="my-3">
                        Jawabanmu:{" "}
                        {q.options[attempt.answers[q.id]?.selected_index]}
                      </p>
                      <p>{q.explanation}</p>
                      {material.sources
                        .filter((s) => q.source_ids.includes(s.id))
                        .map((s) => (
                          <details key={s.id} className="mt-3">
                            <summary className="cursor-pointer font-semibold">
                              {s.label}
                            </summary>
                            <p className="whitespace-pre-wrap">{s.text}</p>
                          </details>
                        ))}
                    </article>
                  ))}
                </div>
              </section>

              <aside className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="bg-butter-tint rounded-2xl p-6 border border-divider">
                  <Image
                    src="/design/mimo-final.png"
                    alt=""
                    width={1408}
                    height={1120}
                    className="w-40 h-auto object-contain mx-auto"
                  />
                  <h2 className="font-bold text-xl mt-4 ui-section-title">
                    Langkah berikutnya
                  </h2>
                  <p className="mt-3">
                    {recommendation?.reason ||
                      "Kamu bisa meninjau pembahasan atau mencoba lagi."}
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onRecommend();
                    }}
                    className="block mt-5 bg-primary text-white rounded-xl p-3 text-center"
                  >
                    Mulai Rekomendasi Sekarang
                  </a>
                  <button onClick={onRetry} disabled={busy} className="mt-4">
                    Ulangi latihan
                  </button>
                </div>
              </aside>
            </div>

            <div className="w-full bg-surface rounded-2xl border border-divider p-space-md mt-space-md shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <a
                  className="inline-flex items-center gap-space-xs font-label text-label text-on-surface-variant hover:text-primary transition-colors py-2"
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
                    keyboard_backspace
                  </span>
                  <span>Kembali ke materi</span>
                </a>
                <div className="flex flex-wrap items-center gap-space-sm w-full sm:w-auto justify-end">
                  <button
                    className="flex-1 sm:flex-initial min-h-[44px] px-space-md py-2 rounded-xl bg-surface border border-divider hover:bg-canvas text-primary font-label text-label font-semibold transition-colors flex items-center justify-center gap-space-xs"
                    id="btn-save-progress"
                    type="button"
                    onClick={onSaveReview}
                    disabled={busy}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      bookmark_add
                    </span>
                    <span>Simpan pembahasan ke catatan</span>
                  </button>
                  <a
                    className="flex-1 sm:flex-initial min-h-[44px] px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold transition-colors flex items-center justify-center gap-space-xs text-center shadow-sm"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onRecommend();
                    }}
                  >
                    <span>Lanjut ke Rekomendasi Belajar</span>
                    <span
                      className="material-symbols-outlined text-[18px]"
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
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 px-6 pb-10 ui-container">
          <button
            onClick={() =>
              onSpeak(attempt.questions.map((q) => q.explanation).join(". "))
            }
          >
            Bacakan pembahasan
          </button>
          <button onClick={copyReview}>Salin pembahasan</button>
          <button onClick={onRetry}>Latihan lagi</button>
          <button onClick={onPlanner}>Rencana belajar</button>
          <button onClick={onRest}>Istirahat dulu</button>
          <button onClick={onBack}>Kembali ke materi</button>
          <p role="status">{notice || copied}</p>
        </div>
      </div>
    </>
  );
}

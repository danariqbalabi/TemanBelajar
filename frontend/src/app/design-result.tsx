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
  onPreferences,
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
      <div className="stitch-screen stitch-results revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <div className="w-full bg-surface-container-low/70 backdrop-blur-sm px-margin-mobile md:px-margin-tablet lg:px-margin py-3 mb-6">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-primary font-bold text-xs">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    task_alt
                  </span>
                </span>
                <span className="tracking-wide">{"Sesi Latihan Selesai"}</span>
                <span className="text-text-secondary text-xs">
                  {material.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-primary shadow-sm text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
                  Progres Adaptif Tersimpan
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-tablet lg:px-margin pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-7 flex flex-col gap-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-text-secondary">
                    Hasil Latihan Pemahaman
                  </span>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">
                    Keren, {displayName}! {correct} dari{" "}
                    {attempt.questions.length} soal terjawab tepat.
                  </h1>
                  <p className="text-sm text-text-secondary">
                    {accuracy}% jawaban tepat pada latihan ini. Setiap jawaban
                    membantu memilih langkah berikutnya.
                  </p>
                </div>
                <div className="space-y-4">
                  {attempt.questions.map((q, i) => (
                    <article
                      key={q.id}
                      className="bg-surface rounded-2xl p-5 shadow-card"
                    >
                      <span className="text-xs text-text-secondary">
                        Soal {i + 1}
                      </span>
                      <h2 className="font-bold text-lg text-primary mt-2">
                        {q.prompt}
                      </h2>
                      <p className="mt-3 text-sm">
                        Jawabanmu:{" "}
                        {q.options[attempt.answers[q.id]?.selected_index] ||
                          "Belum dijawab"}
                      </p>
                      <p className="text-sm">
                        Jawaban tepat:{" "}
                        {q.correct_index === null
                          ? "Belum tersedia"
                          : q.options[q.correct_index]}
                      </p>
                      <p className="mt-3 text-sm text-text-secondary">
                        {q.explanation}
                      </p>
                      <details className="mt-3">
                        <summary>Sumber penjelasan</summary>
                        {material.sources
                          .filter((s) => q.source_ids.includes(s.id))
                          .map((s) => (
                            <p
                              key={s.id}
                              className="text-sm whitespace-pre-wrap"
                            >
                              {s.label}: {s.text}
                            </p>
                          ))}
                      </details>
                    </article>
                  ))}
                </div>
              </section>

              <section className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-3xl bg-surface p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-secondary-container/20 to-transparent pointer-events-none"></div>

                  <div className="relative w-full mb-4">
                    <div className="rounded-2xl bg-secondary-container/60 p-4 text-left shadow-sm relative">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-extrabold text-xs uppercase tracking-wider text-secondary">
                          Mimo Berkata
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      </div>
                      <p className="font-mimo-voice text-sm md:text-base text-primary leading-snug">
                        {material.title}
                      </p>

                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-container/60 rotate-45"></div>
                    </div>
                  </div>

                  <div className="relative w-48 h-48 md:w-56 md:h-56 my-1 rounded-2xl overflow-hidden flex items-center justify-center">
                    <Image
                      src="/design/mimo-9.png"
                      alt="Mimo Encouraging"
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105 rounded-2xl"
                      width={1024}
                      height={1024}
                    ></Image>
                  </div>
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">
                    Kawan Belajar Setiamu
                  </div>
                </div>

                <div className="rounded-3xl bg-surface p-6 shadow-sm flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          hub
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-primary">
                        {recommendation?.reason ||
                          "Hasil latihanmu tersimpan untuk langkah berikutnya."}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container-high text-text-secondary">
                      {recommendation?.reason ||
                        "Hasil latihanmu tersimpan untuk langkah berikutnya."}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary -mt-2 leading-relaxed">
                    Sistem mencatat pemahamanmu berdasarkan akurasi dan pola
                    jawaban latihan tadi:
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">
                        Mengenal Sudut 90°
                      </span>
                      <span className="font-bold text-success flex items-center gap-1">
                        90% • Sangat Paham
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-700 ease-out"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">
                        {material.title}
                      </span>
                      <span className="font-bold text-success flex items-center gap-1">
                        85% • Kuat
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-secondary transition-all duration-700 ease-out"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">
                        Rumus Kuadrat Sisi (a² + b² = c²)
                      </span>
                      <span className="font-bold text-warning flex items-center gap-1">
                        55% • Sedang Berkembang
                        <span className="w-2 h-2 rounded-full bg-warning"></span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-peach transition-all duration-700 ease-out"
                        style={{ width: "55%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-text-secondary flex items-center gap-1.5 bg-surface-container-low p-2.5 rounded-xl">
                    <span
                      className="material-symbols-outlined text-[15px] text-secondary"
                      aria-hidden="true"
                    >
                      info
                    </span>
                    <span>
                      Mimo akan menyesuaikan 2 soal berikutnya agar fokus
                      memperkuat rumus kuadrat sisi tanpa bikin pusing!
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-[0.99] text-center"
                    data-path="pythagoras-interactive-step"
                    type="button"
                    onClick={onRecommend}
                  >
                    <span>
                      Lihat Langkah Belajar Berikutnya (Rekomendasi Mimo)
                    </span>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>

                  <button
                    className="w-full py-3.5 px-6 rounded-2xl bg-surface hover:bg-surface-container-high text-primary font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm text-center"
                    data-path="learning-hub"
                    type="button"
                    onClick={onRest}
                  >
                    <span
                      className="material-symbols-outlined text-[18px] text-text-secondary"
                      aria-hidden="true"
                    >
                      bookmark_add
                    </span>
                    <span>Simpan ke Materi Saya &amp; Istirahat</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-3">
          <button onClick={onBack}>Kembali ke materi</button>
          <button onClick={onPlanner}>Rencana belajar</button>
          <button
            onClick={() =>
              onSpeak(attempt.questions.map((q) => q.explanation).join(". "))
            }
          >
            Bacakan pembahasan
          </button>
          <button
            disabled={busy}
            onClick={onRecommend}
            className="min-h-[44px] px-5 rounded-xl bg-primary text-surface"
          >
            Lihat langkah berikutnya
          </button>
          <button
            disabled={busy}
            onClick={onRetry}
            className="min-h-[44px] px-5 rounded-xl bg-surface"
          >
            Ulang latihan
          </button>
          <button
            disabled={busy}
            onClick={onSaveReview}
            className="min-h-[44px] px-5 rounded-xl bg-surface"
          >
            Simpan ulasan ke catatan
          </button>
          <button
            onClick={copyReview}
            className="min-h-[44px] px-5 rounded-xl bg-surface"
          >
            Salin pembahasan
          </button>
          <button
            onClick={() => onPreferences?.({ high_contrast: true })}
            className="min-h-[44px] px-5 rounded-xl bg-surface"
          >
            Kontras tinggi
          </button>
        </div>
        {(notice || copied) && (
          <p role="status" className="max-w-6xl mx-auto p-4">
            {notice || copied}
          </p>
        )}
      </div>
    </>
  );
}

"use client";
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
    <div className="stitch-screen stitch-results">
      <div className="flex flex-col w-full">
        <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-sm bg-surface-container-low/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm flex-wrap">
              <button
                className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg text-primary hover:bg-surface font-label text-label transition-colors"
                disabled={busy}
                onClick={onRecommend}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>{material.title}</span>
              </button>
              <span className="text-text-secondary text-xs">•</span>
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label text-label">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                <span>
                  Sesi Latihan Mandiri Selesai • Hasil &amp; Umpan Balik
                  Personal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <div className="flex items-center bg-surface p-1 rounded-xl shadow-sm">
                <button
                  aria-label="Kecilkan teks"
                  className="px-2.5 py-1 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  type="button"
                  disabled={busy}
                  onClick={() => onPreferences?.({ font_size: 16 })}
                >
                  A-
                </button>
                <button
                  aria-label="Ukuran standar"
                  className="px-2.5 py-1 text-sm font-bold rounded-lg bg-surface-container-low text-primary shadow-xs"
                  type="button"
                  disabled={busy}
                  onClick={() => onPreferences?.({ font_size: 18 })}
                >
                  A
                </button>
                <button
                  aria-label="Besarkan teks"
                  className="px-2.5 py-1 text-base font-bold rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  type="button"
                  disabled={busy}
                  onClick={() => onPreferences?.({ font_size: 22 })}
                >
                  A+
                </button>
              </div>
              <button
                className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-surface hover:bg-surface-container-low text-primary font-label text-label transition-colors shadow-sm"
                type="button"
                disabled={busy}
                onClick={() =>
                  onSpeak(
                    attempt.questions
                      .map((q) => q.prompt + " " + q.explanation)
                      .join(". "),
                  )
                }
              >
                <span
                  className="material-symbols-outlined text-[18px] text-secondary"
                  aria-hidden="true"
                >
                  hearing
                </span>
                <span className="hidden sm:inline">
                  Bacakan Hasil (Suara Mimo)
                </span>
              </button>
              <button
                className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-surface hover:bg-surface-container-low text-text-secondary hover:text-on-surface font-metadata text-metadata transition-colors shadow-sm"
                title="Mode Kontras"
                type="button"
                disabled={busy}
                onClick={() => onPreferences?.({ high_contrast: true })}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  contrast
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <section className="relative overflow-hidden rounded-3xl bg-surface p-space-lg md:p-space-xl shadow-sm">
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-butter/40 blur-3xl pointer-events-none"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
                  <div className="relative flex-shrink-0 group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-secondary-container flex items-center justify-center p-2 shadow-sm">
                      <svg
                        className="w-full h-full"
                        fill="none"
                        viewBox="0 0 120 120"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M28 84C18 84 14 74 18 64C22 56 32 58 32 64C32 68 28 72 24 72"
                          stroke="#435A49"
                          strokeLinecap="round"
                          strokeWidth="4"
                        ></path>

                        <path
                          d="M30 68C32 46 50 36 74 38C94 40 102 52 104 68C106 82 92 90 74 90C50 90 30 84 30 68Z"
                          fill="#91AF87"
                        ></path>

                        <path
                          d="M42 66C44 54 58 48 74 50C86 52 92 60 92 72C88 84 72 86 58 84C46 82 42 74 42 66Z"
                          fill="#C8D8AD"
                        ></path>

                        <circle cx="50" cy="38" fill="#435A49" r="4"></circle>
                        <circle cx="62" cy="36" fill="#435A49" r="4"></circle>
                        <circle cx="74" cy="37" fill="#435A49" r="4"></circle>
                        <circle cx="86" cy="42" fill="#435A49" r="4"></circle>

                        <circle
                          cx="88"
                          cy="56"
                          fill="#FAF9F4"
                          r="12"
                          stroke="#435A49"
                          strokeWidth="3"
                        ></circle>
                        <circle cx="91" cy="54" fill="#112520" r="5"></circle>
                        <circle cx="93" cy="52" fill="#FFFFFF" r="2"></circle>

                        <path
                          d="M84 74C88 77 94 76 96 72"
                          stroke="#435A49"
                          strokeLinecap="round"
                          strokeWidth="3"
                        ></path>

                        <circle
                          cx="78"
                          cy="70"
                          fill="#E8A69A"
                          fillOpacity="0.7"
                          r="5"
                        ></circle>

                        <path
                          d="M44 80L46 72L53 71L48 66L50 58L42 62L36 57L37 65L32 69L39 71L44 80Z"
                          fill="#FFE7A3"
                          stroke="#61450E"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-butter text-warning font-label text-[11px] font-bold shadow-xs">
                      Mimo bangga!
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-metadata text-metadata font-bold text-secondary tracking-wide uppercase">
                      Hasil Latihan Tanpa Tekanan
                    </span>
                    <h1 className="font-display text-card-title sm:text-page-title text-primary font-bold">{`Keren, ${displayName}! Kamu menyelesaikan latihan ini dengan tenang.`}</h1>
                    <div className="relative mt-space-xs p-space-md rounded-2xl bg-surface-container-low text-primary max-w-xl">
                      <p className="font-mimo-voice text-mimo-voice text-primary">
                        “Belajar itu bukan soal langsung benar semua, tapi tahu
                        bagian mana yang sudah mantap dan bagian mana yang seru
                        buat kita kulik lagi bareng-bareng!”
                      </p>
                      <div className="flex items-center gap-space-xs mt-space-xs text-text-secondary font-metadata text-metadata">
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          aria-hidden="true"
                        >
                          psychology
                        </span>
                        <span>
                          Catatan Reflektif Mimo • Tidak ada jawaban yang
                          sia-sia
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-space-xs">
                  <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          task_alt
                        </span>
                      </div>
                      <div>
                        <div className="font-metadata text-metadata text-text-secondary">
                          Observasi Latihan
                        </div>
                        <div className="font-label text-label font-bold text-primary">{`${correct} dari ${attempt.questions.length} Soal Tepat (${accuracy}%)`}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-surface text-secondary font-metadata text-xs font-bold shadow-xs">
                      Riil
                    </span>
                  </div>
                  <div className="p-space-md rounded-2xl bg-secondary-container/40 flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center text-primary">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          trending_up
                        </span>
                      </div>
                      <div>
                        <div className="font-metadata text-metadata text-text-secondary">
                          Estimasi Model BKT
                        </div>
                        <div className="font-label text-label font-bold text-primary">
                          Sedang Berkembang di Hipotenusa
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-surface text-primary font-metadata text-xs font-bold shadow-xs">
                      Prediktif
                    </span>
                  </div>
                  <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-butter flex items-center justify-center text-warning">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          pace
                        </span>
                      </div>
                      <div>
                        <div className="font-metadata text-metadata text-text-secondary">
                          Durasi Belajar
                        </div>
                        <div className="font-label text-label font-bold text-primary">
                          4 Menit Santai • Fokus Nyaman
                        </div>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-[18px] text-text-secondary"
                      aria-hidden="true"
                    >
                      self_improvement
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-space-xs px-space-sm py-1.5 rounded-xl bg-secondary-container text-on-secondary-container font-metadata text-xs font-bold">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      verified
                    </span>
                    <span>
                      Tanpa Penalti Nilai • Tersimpan rapi di Jurnal Belajarmu
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <main className="lg:col-span-8 flex flex-col gap-space-lg">
                {attempt.questions.map((q, index) => (
                  <article
                    className="p-space-lg rounded-3xl bg-surface shadow-sm flex flex-col gap-space-md transition-all hover:shadow-md"
                    key={q.id}
                    data-correct={attempt.answers[q.id]?.correct}
                  >
                    <div className="flex items-center justify-between gap-space-md">
                      <span className="w-9 h-9 rounded-full bg-secondary-container text-primary font-label text-label flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-label text-label text-secondary">
                        {attempt.answers[q.id]?.correct
                          ? "Pemahamanmu sudah tepat"
                          : "Kita pahami lagi bersama"}
                      </span>
                    </div>
                    <h3 className="font-card-title text-card-title text-primary">
                      {q.prompt}
                    </h3>
                    <div className="rounded-xl bg-surface-container-low p-space-md font-body text-body text-primary">
                      <p>
                        Jawabanmu:{" "}
                        {q.options[attempt.answers[q.id]?.selected_index ?? 0]}
                      </p>
                      <p>
                        Jawaban yang tepat: {q.options[q.correct_index ?? 0]}
                      </p>
                    </div>
                    <p className="font-reading text-reading text-text-secondary">
                      {q.explanation}
                    </p>
                    <details className="rounded-xl bg-surface-container-low p-space-md">
                      <summary className="font-label text-label text-primary">
                        Periksa sumber penjelasan
                      </summary>
                      {material.sources
                        .filter((s) => q.source_ids.includes(s.id))
                        .map((s) => (
                          <p
                            key={s.id}
                            className="font-metadata text-metadata text-text-secondary mt-space-sm"
                          >
                            {s.label}: {s.text}
                          </p>
                        ))}
                    </details>
                  </article>
                ))}
              </main>

              <aside className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
                <div className="p-space-lg rounded-3xl bg-secondary-container text-on-secondary-fixed shadow-md flex flex-col gap-space-md relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-surface/30 blur-2xl pointer-events-none"></div>
                  <div className="flex items-center gap-space-xs">
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      aria-hidden="true"
                    >
                      assistant
                    </span>
                    <span className="font-metadata text-metadata font-bold uppercase tracking-wider text-primary">
                      Langkah Terbaik Berikutnya
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-primary font-metadata text-xs font-bold mb-space-xs shadow-xs">
                      Rekomendasi Adaptif Mimo
                    </span>
                    <h3 className="font-section-title text-section-title text-primary leading-snug">
                      {recommendation?.title ||
                        material.concepts.find(
                          (c) => c.id === recommendation?.concept_id,
                        )?.title ||
                        "Pilih langkah berikutnya"}
                    </h3>
                  </div>

                  <div className="p-space-md rounded-2xl bg-surface/80 backdrop-blur-xs text-on-surface flex flex-col gap-space-xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        help_center
                      </span>
                      <span>Mengapa Mimo Menyarankan Ini?</span>
                    </div>
                    <p className="font-metadata text-metadata text-on-surface">
                      Di soal 2, perbandingan kuadrat sisi masih tertukar dengan
                      penjumlahan linier (a + b). Mempelajarinya lewat{" "}
                      <strong>diagram ubin interaktif</strong> akan membuat
                      bedanya langsung terlihat jelas tanpa hafalan rumus rumit!
                    </p>
                    <div className="flex items-center gap-space-xs pt-1 text-xs text-text-secondary">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        aria-hidden="true"
                      >
                        timer
                      </span>
                      <span>Estimasi waktu santai: ~4 menit</span>
                    </div>
                  </div>

                  <button
                    className="w-full py-3.5 px-space-md rounded-2xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label font-bold text-center flex items-center justify-center gap-space-xs transition-colors shadow-sm"
                    disabled={busy}
                    onClick={onRecommend}
                  >
                    <span>Ikuti Rekomendasi Ini</span>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>

                  <div className="flex items-center justify-between text-xs font-label text-primary pt-space-xs">
                    <button
                      className="hover:underline flex items-center gap-1"
                      type="button"
                      disabled={busy}
                      onClick={onRecommend}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        shuffle
                      </span>
                      <span>Pilihan Lain</span>
                    </button>
                    <button
                      className="hover:underline flex items-center gap-1"
                      type="button"
                      disabled={busy}
                      onClick={onPlanner}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      <span>Jadwalkan Besok</span>
                    </button>
                  </div>
                </div>

                <div className="p-space-lg rounded-3xl bg-surface shadow-sm flex flex-col gap-space-md">
                  <h4 className="font-card-title text-card-title text-primary">
                    Pilihan Alternatif Mandiri
                  </h4>
                  <div className="flex flex-col gap-space-xs">
                    <button
                      className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-space-sm group"
                      disabled={busy}
                      onClick={onRetry}
                    >
                      <div className="w-10 h-10 rounded-xl bg-butter flex items-center justify-center text-warning flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          fitness_center
                        </span>
                      </div>
                      <div>
                        <div className="font-label text-label font-bold text-primary group-hover:text-primary">
                          Latihan Penguatan Serupa
                        </div>
                        <div className="font-metadata text-xs text-text-secondary">
                          2 soal setipe untuk memantapkan kuadrat
                        </div>
                      </div>
                    </button>
                    <button
                      className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-space-sm group"
                      disabled={busy}
                      onClick={onRecommend}
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          menu_book
                        </span>
                      </div>
                      <div>
                        <div className="font-label text-label font-bold text-primary">
                          {material.title}
                        </div>
                        <div className="font-metadata text-xs text-text-secondary">
                          Membaca ulang catatan zine dan rangkuman
                        </div>
                      </div>
                    </button>
                    <button
                      className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-space-sm group"
                      disabled={busy}
                      onClick={onRest}
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-text-secondary flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          bedtime
                        </span>
                      </div>
                      <div>
                        <div className="font-label text-label font-bold text-primary">
                          Selesai untuk Hari Ini
                        </div>
                        <div className="font-metadata text-xs text-text-secondary">
                          Simpan semua progres &amp; istirahat sejenak
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center gap-space-sm">
                  <span
                    className="material-symbols-outlined text-secondary text-[26px]"
                    aria-hidden="true"
                  >
                    lightbulb
                  </span>
                  <div className="font-metadata text-xs text-on-surface">
                    <strong>Ingat Mimo:</strong> Siku-siku hanya tercipta saat
                    luas persegi pada hipotenusa sama dengan jumlah luas dua
                    persegi lainnya (a² + b² = c²).
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-30 w-full bg-surface/95 backdrop-blur-md shadow-lg py-3 px-margin-mobile md:px-margin-tablet lg:px-margin">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-md w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  trending_up
                </span>
              </div>
              <div className="flex flex-col">
                <div className="font-label text-label font-bold text-primary">
                  {
                    "Jawaban latihan tersimpan. Kamu bebas mengulang tanpa penalti."
                  }
                </div>
                <div className="font-metadata text-xs text-text-secondary">
                  1 konsep terkuasai, 1 konsep siap dipelajari secara visual
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                className="px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-label transition-colors text-center"
                disabled={busy}
                onClick={onBack}
              >
                ← Ulas Latihan
              </button>
              <button
                className="px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label transition-colors shadow-sm flex items-center gap-space-xs text-center justify-center"
                disabled={busy}
                onClick={onRecommend}
              >
                <span>Lihat Rekomendasi Lengkap</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {(notice || copied) && (
        <p
          role="status"
          className="font-body text-body text-secondary mt-space-md"
        >
          {notice || copied}
        </p>
      )}
      <div className="flex flex-wrap gap-space-sm mt-space-md">
        <button
          disabled={busy}
          onClick={onSaveReview}
          className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
        >
          Simpan ulasan ke catatan
        </button>
        <button
          onClick={copyReview}
          className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
        >
          Salin pembahasan
        </button>
        <button
          disabled={busy}
          onClick={onRetry}
          className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
        >
          Ulang latihan
        </button>
        <button
          disabled={busy}
          onClick={onRecommend}
          className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
        >
          Lihat langkah berikutnya
        </button>
      </div>
    </div>
  );
}

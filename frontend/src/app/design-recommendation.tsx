"use client";
import { useState } from "react";
import Image from "next/image";
import type { Material, Mode, Recommendation } from "@/lib/types";
import { modeNames } from "./materials";
export function RecommendationDesign({
  material,
  recommendation,
  busy,
  displayName,
  onFollow,
  onBack,
  onOpen,
  onPlanner,
  onSettings,
  onSpeak,
}: {
  material: Material;
  recommendation: Recommendation;
  busy: boolean;
  displayName: string;
  onFollow: () => void;
  onBack: () => void;
  onOpen: (mode: Mode) => void;
  onPlanner: () => void;
  onSettings: () => void;
  onSpeak: (text?: string) => void;
}) {
  const [showReason, setShowReason] = useState(true);
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden bg-background py-8 sm:py-12">
            <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-container/60 blur-3xl"></div>
            <div className="pointer-events-none absolute top-40 -right-24 w-80 h-80 rounded-full bg-peach/40 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-butter/30 blur-2xl"></div>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface shadow-sm text-secondary text-xs font-semibold tracking-wide uppercase">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Algoritma Adaptif BKT Aktif
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-primary">{`Langkah Belajar Berikutnya, ${displayName}!`}</h1>
                  <p className="text-sm sm:text-base text-text-secondary mt-1">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-surface/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm self-start md:self-auto">
                  <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 -rotate-90 transform"
                      viewBox="0 0 36 36"
                      aria-hidden="true"
                    >
                      <path
                        className="text-surface-container"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      ></path>
                      <path
                        className="text-secondary transition-all duration-1000 ease-out"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="78, 100"
                        strokeLinecap="round"
                        strokeWidth="3.8"
                      ></path>
                    </svg>
                    <span className="absolute text-[11px] font-bold text-primary">
                      {recommendation.estimate?.mastery == null
                        ? "Estimasi model belum tersedia"
                        : `Estimasi model: ${Math.round((recommendation.estimate?.mastery || 0) * 100)}%`}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase font-bold tracking-wider text-muted-gray">
                      Probabilitas Paham
                    </p>
                    <p className="text-xs font-semibold text-primary truncate">
                      Segitiga Siku-siku &amp; Sisi Miring
                    </p>
                  </div>
                </div>
              </div>

              <section className="relative bg-secondary-container text-on-secondary-container rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-surface/30 blur-2xl pointer-events-none"></div>
                <div className="absolute left-8 bottom-4 w-40 h-40 rounded-full bg-peach/20 blur-xl pointer-events-none"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm">
                        <span
                          className="material-symbols-outlined text-[15px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          auto_awesome
                        </span>
                        Rekomendasi Terbaik Hari Ini • Dipilihkan Khusus oleh
                        Mimo
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-sm text-primary text-xs font-semibold">
                        <span
                          className="material-symbols-outlined text-[15px]"
                          aria-hidden="true"
                        >
                          schedule
                        </span>
                        ± 8 Menit
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-sm text-primary text-xs font-semibold">
                        <span
                          className="material-symbols-outlined text-[15px]"
                          aria-hidden="true"
                        >
                          palette
                        </span>
                        Format Visual Bergambar
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
                      {recommendation.title ||
                        material.concepts.find(
                          (c) => c.id === recommendation.concept_id,
                        )?.title ||
                        material.title}
                    </h2>

                    <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm text-on-surface">
                      <div className="flex items-center gap-2 mb-2 text-secondary font-bold text-xs uppercase tracking-wider">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          psychology
                        </span>
                        Kenapa Mimo Menyarankan Ini?
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                        {recommendation.reason}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
                      <button
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        type="button"
                        onClick={onSettings}
                        disabled={busy}
                      >
                        <span>{`± ${recommendation.estimated_minutes} Menit`}</span>
                        <span
                          className="material-symbols-outlined text-lg"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface hover:bg-surface-container-low text-primary text-sm font-semibold shadow-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-focus"
                        type="button"
                        onClick={onSettings}
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          swap_horiz
                        </span>
                        <span>Coba Cara Lain (Dengar Audio / Teman Baca)</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors font-medium"
                        type="button"
                        onClick={onBack}
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          aria-hidden="true"
                        >
                          schedule_send
                        </span>
                        <span>Lewati Dulu Hari Ini (Tanpa Penalti)</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-surface/50 scale-95 blur-md"></div>
                      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-peach/40 via-butter/30 to-secondary/20 animate-pulse"></div>

                      <div className="absolute -top-2 right-4 bg-surface text-primary shadow-md rounded-2xl px-3 py-1.5 flex items-center gap-1.5 z-20">
                        <span
                          className="material-symbols-outlined text-butter text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          lightbulb
                        </span>
                        <span className="text-xs font-bold">
                          Visual Learner Match
                        </span>
                      </div>

                      <Image
                        alt="Mimo the friendly chameleon mascot guiding the next recommended study step with cheerful warmth"
                        className="relative z-10 w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                        src="/design/mimo-0.png"
                        width={1024}
                        height={1024}
                      ></Image>

                      <div className="absolute -bottom-2 bg-surface/95 backdrop-blur text-primary px-3.5 py-1 rounded-full shadow text-xs font-medium flex items-center gap-1.5 z-20">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        <span>Mimo siap mendampingimu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-12 sm:mt-16">
                <h3 className="text-xl font-bold text-primary">
                  Pilihan alternatif jika mau ganti cara belajar
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {recommendation.alternatives.map((a) => (
                    <button
                      key={a.mode}
                      disabled={busy}
                      onClick={() => onOpen(a.mode)}
                      className="text-left rounded-2xl p-5 bg-surface shadow-card min-h-[44px]"
                    >
                      <h4 className="font-bold text-primary">
                        {modeNames[a.mode]}
                      </h4>
                      <p className="text-sm text-text-secondary mt-2">
                        {a.reason}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              <div className="mt-10 sm:mt-14 mb-4">
                <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-butter flex-shrink-0 flex items-center justify-center text-primary shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      lightbulb
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong className="font-bold text-primary">
                        Transparansi Rekomendasi:
                      </strong>{" "}
                      Rekomendasi ini disesuaikan dari riwayat jawabanmu barusan
                      dan preferensi belajar visual yang kamu pilih di
                      onboarding. Kamu selalu bebas mengatur ulang jalur belajar
                      kapan saja di menu Pengaturan.
                    </p>
                  </div>
                  <button
                    className="hidden sm:inline-flex text-xs font-bold text-secondary hover:text-primary transition-colors whitespace-nowrap"
                    type="button"
                    onClick={() => setShowReason(!showReason)}
                  >
                    Lihat Parameter BKT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 space-y-4">
          <button
            disabled={busy}
            onClick={onFollow}
            className="min-h-[44px] px-6 rounded-full bg-primary text-surface"
          >
            Mulai rekomendasi ini
          </button>
          <button
            onClick={() => setShowReason(!showReason)}
            aria-expanded={showReason}
            className="min-h-[44px] px-4 rounded-xl bg-surface"
          >
            Kenapa ini disarankan?
          </button>
          {showReason && (
            <p className="p-5 bg-surface rounded-2xl">
              {recommendation.reason}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSpeak(recommendation.reason)}
              className="min-h-[44px] px-4 rounded-xl bg-surface"
            >
              Bacakan alasan
            </button>
            <button
              onClick={onPlanner}
              className="min-h-[44px] px-4 rounded-xl bg-surface"
            >
              Tinjau rencana belajar
            </button>
            <button
              onClick={onBack}
              className="min-h-[44px] px-4 rounded-xl bg-surface"
            >
              Lewati tanpa penalti
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

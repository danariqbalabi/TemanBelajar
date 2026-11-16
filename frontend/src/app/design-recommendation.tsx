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
      <div className="final-design final-screen-19 w-full pt-[8.25rem] bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin py-space-lg flex flex-col gap-space-xl">
            <div className="flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm flex-wrap">
                <a
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-label text-label transition-colors"
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
                    arrow_back
                  </span>
                  <span>Kembali ke Hasil Latihan Bab 4</span>
                </a>
                <span className="text-outline text-metadata">•</span>
                <a
                  className="text-on-surface-variant hover:text-primary font-metadata text-metadata transition-colors"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Ke Beranda Utama
                </a>
              </div>
              <div className="flex items-center gap-space-sm">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-mint-tint text-success rounded-full font-label text-label">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    psychology
                  </span>
                  <span>Rekomendasi Personal Berbasis Pemahaman Terbaru</span>
                </div>
                <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 shadow-sm">
                  <button
                    className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    id="fontDecBtn"
                    title="Perkecil Ukuran Teks"
                    type="button"
                    onClick={onSettings}
                  >
                    <span className="font-label text-metadata font-bold px-1">
                      A-
                    </span>
                  </button>
                  <button
                    className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    id="fontIncBtn"
                    title="Perbesar Ukuran Teks"
                    type="button"
                    onClick={onSettings}
                  >
                    <span className="font-label text-metadata font-bold px-1">
                      A+
                    </span>
                  </button>
                  <div className="w-px h-4 bg-surface-variant mx-1"></div>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded font-label text-label transition-colors"
                    id="ttsBtn"
                    type="button"
                    onClick={() => onSpeak(recommendation.reason)}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      volume_up
                    </span>
                    <span className="hidden md:inline">Bacakan Halaman</span>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="relative rounded-[28px] p-space-lg sm:p-space-xl overflow-hidden shadow-sm border-2 border-[#BCE8C6]"
              style={{
                background:
                  "linear-gradient(135deg, rgb(232, 248, 236) 0%, rgb(216, 242, 225) 50%, rgb(229, 246, 235) 100%)",
              }}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/40 blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-butter/30 blur-xl pointer-events-none"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center relative z-10">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label text-label shadow-sm">
                      <span
                        className="material-symbols-outlined text-[16px] text-butter"
                        aria-hidden="true"
                      >
                        auto_awesome
                      </span>
                      <span>Rekomendasi Utama</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-butter-tint text-warning font-label text-label border border-butter/50 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        timer
                      </span>
                      <span>{recommendation.reason}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-success font-metadata text-metadata border border-secondary/20 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                      <span>Bebas Cemas &amp; Ringan</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">{material.title}</p>
                    <h1 className="font-display font-black text-page-title text-primary tracking-tight leading-tight">
                      {recommendation.title || "Rekomendasi buat kamu"}
                    </h1>
                    <p className="font-reading text-reading text-primary-container leading-relaxed">
                      {recommendation.reason}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="bg-white/90 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl border border-secondary/20 flex items-center gap-2.5 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px] text-secondary shrink-0"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                      <div className="leading-tight min-w-0">
                        <div className="text-[11px] font-metadata text-on-surface-variant">
                          Materi
                        </div>
                        <div className="font-label text-[13px] text-primary truncate font-bold">
                          IPA Kelas 8 Bab 4
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl border border-secondary/20 flex items-center gap-2.5 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px] text-secondary shrink-0"
                        aria-hidden="true"
                      >
                        trending_up
                      </span>
                      <div className="leading-tight min-w-0">
                        <div className="text-[11px] font-metadata text-on-surface-variant">
                          {recommendation.reason}
                        </div>
                        <div className="font-label text-[13px] text-primary font-bold">
                          {recommendation.reason}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl border border-secondary/20 flex items-center gap-2.5 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px] text-secondary shrink-0"
                        aria-hidden="true"
                      >
                        schedule
                      </span>
                      <div className="leading-tight min-w-0">
                        <div className="text-[11px] font-metadata text-on-surface-variant">
                          Durasi Ringkas
                        </div>
                        <div className="font-label text-[13px] text-primary font-bold">
                          {recommendation.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-md transition-all hover:scale-[1.02]"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onFollow();
                      }}
                    >
                      <span className="font-bold">
                        Mulai Rekomendasi Sekarang
                      </span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </a>
                    <a
                      className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-white hover:bg-canvas text-primary font-label text-label border border-secondary/20 shadow-sm transition-all"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-secondary"
                        aria-hidden="true"
                      >
                        info
                      </span>
                      <span>Lihat Detail Alasannya</span>
                    </a>
                    <a
                      className="inline-flex items-center justify-center px-4 py-3 text-on-surface-variant hover:text-primary font-label text-label transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      <span>Lewati Dulu (Ke Beranda)</span>
                    </a>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="relative bg-white text-primary p-space-md rounded-[22px] shadow-sm mb-3 max-w-[340px] text-left border border-secondary/20 ring-4 ring-white/60">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      <span className="font-label text-[12px] font-bold text-success uppercase tracking-wider">
                        Pesan Sahabat Mimo
                      </span>
                    </div>
                    <p className="font-mimo-voice text-mimo-voice text-primary leading-snug">
                      {displayName}
                    </p>
                    <div className="absolute -bottom-2 left-12 w-4 h-4 bg-white border-b border-r border-secondary/20 transform rotate-45"></div>
                  </div>
                  <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center transition-transform hover:scale-105 duration-300 drop-shadow-md">
                    <Image
                      alt=""
                      className="w-full h-full object-contain object-contain"
                      src="/design/mimo-final.png"
                      width={1408}
                      height={1120}
                    ></Image>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-space-md">
              <div>
                <h2 className="font-section-title text-section-title text-primary">
                  Coba Cara Belajar Lainnya
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mt-5">
                  {recommendation.alternatives.map((alt, i) => (
                    <article
                      key={i}
                      className="bg-surface border border-divider rounded-2xl p-5"
                    >
                      <h3 className="font-bold">{modeNames[alt.mode]}</h3>
                      <p className="my-3 text-sm">{alt.reason}</p>
                      <button
                        disabled={busy}
                        onClick={() => onOpen(alt.mode)}
                        className="bg-primary text-white px-4 py-3 rounded-xl"
                      >
                        Pilih format ini →
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="bg-surface rounded-2xl p-space-lg sm:p-space-xl shadow-sm flex flex-col gap-space-lg"
              id="penjelasan-ai"
            >
              <div>
                <h2 className="font-section-title text-section-title text-primary">
                  Kenapa Rekomendasi Ini Muncul?
                </h2>
                <button
                  onClick={() => setShowReason(!showReason)}
                  aria-expanded={showReason}
                  className="mt-3 underline"
                >
                  {showReason ? "Sembunyikan alasan" : "Lihat alasannya"}
                </button>
                {showReason && <p className="mt-4">{recommendation.reason}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div
                className="lg:col-span-8 rounded-2xl p-space-lg shadow-sm flex flex-col sm:flex-row items-center gap-space-md border-2 border-butter/50"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFDF5 0%, #FFF8E6 100%)",
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-butter/60 flex items-center justify-center text-warning shrink-0 shadow-xs">
                  <span
                    className="material-symbols-outlined text-[32px]"
                    aria-hidden="true"
                  >
                    calendar_today
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1 text-center sm:text-left">
                  <span className="font-label text-label text-secondary font-bold">
                    Pengaruh ke Rencana Belajarmu Hari Ini
                  </span>
                  <p className="font-reading text-reading text-primary">
                    Rekomendasi ini diperkirakan{" "}
                    <strong className="text-primary">
                      {recommendation.reason}
                    </strong>
                    . Waktu luang belajarmu hari ini masih tersisa{" "}
                    <strong className="text-primary">
                      {recommendation.reason}
                    </strong>
                    , jadi jadwal harianmu tetap aman tanpa perlu begadang!
                  </p>
                  <a
                    className="font-label text-label text-primary hover:text-primary-hover inline-flex items-center gap-1 mt-1 justify-center sm:justify-start transition-colors"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onBack();
                    }}
                  >
                    <span>Lihat Penyesuaian di Rencana Belajar</span>
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
              <div
                className="lg:col-span-4 rounded-2xl p-space-lg shadow-sm flex flex-col justify-between border-2 border-lavender/50"
                style={{
                  background:
                    "linear-gradient(135deg, #F5F2FE 0%, #EFEAFC 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tertiary-container shadow-xs">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      chat_bubble
                    </span>
                  </div>
                  <div>
                    <h4 className="font-card-title text-card-title text-primary">
                      Tanya Mimo
                    </h4>
                    <p className="font-metadata text-metadata text-on-surface-variant">
                      Masih bingung mau mulai dari mana?
                    </p>
                  </div>
                </div>
                <p className="font-body text-body text-primary my-space-sm">
                  Mimo bisa bantu jelaskan bagian yang kamu ragu langsung dalam
                  obrolan santai.
                </p>
                <button
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-tertiary-container hover:text-on-tertiary text-primary font-label text-label transition-colors shadow-sm border border-lavender/40"
                  type="button"
                  onClick={() => setShowReason(!showReason)}
                >
                  Buka Obrolan TemanBelajar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-6 flex gap-4">
          <button
            disabled={busy}
            onClick={onFollow}
            className="bg-primary text-white px-6 py-3 rounded-xl"
          >
            Ikuti rekomendasi
          </button>
          <button onClick={onBack}>Lewati dulu</button>
        </div>
        <button onClick={onPlanner}>Susun rencana belajar</button>
      </div>
    </>
  );
}

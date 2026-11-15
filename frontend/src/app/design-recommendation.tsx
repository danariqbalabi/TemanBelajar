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
    <div className="stitch-screen">
      <div className="flex flex-col w-full">
        <div className="max-w-7xl mx-auto px-margin py-space-lg w-full flex flex-col gap-space-xl">
          <header className="flex flex-col gap-space-sm pt-space-xs">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center flex-wrap gap-space-xs text-metadata font-metadata text-text-secondary"
            >
              <button
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
                data-path="beranda"
                disabled={busy}
                onClick={onBack}
              >
                Beranda
              </button>
              <span className="text-outline select-none">/</span>
              <button
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
                data-path="materi-saya"
                disabled={busy}
                onClick={onBack}
              >
                {material.title}
              </button>
              <span className="text-outline select-none">/</span>
              <span className="text-primary font-label text-label flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                Rekomendasi Adaptif Mimo
              </span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mt-space-xs">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-metadata mb-space-xs">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    psychology_alt
                  </span>
                  <span>Analisis Bukti Belajar Selesai</span>
                </div>
                <h1 className="font-page-title text-page-title text-primary tracking-tight">
                  Langkah Belajar Berikutnya Buat Kamu
                </h1>
                <p className="font-body text-body text-text-secondary mt-space-xs">
                  Rekomendasi belajar personal yang disesuaikan secara
                  transparan dari bukti latihanmu hari ini. Tanpa tebak-tebakan,
                  kamu selalu memegang kendali penuh.
                </p>
              </div>

              <div className="bg-surface rounded-xl p-space-md shadow-sm flex items-center gap-space-md shrink-0">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-label">
                  NB
                </div>
                <div className="flex flex-col">
                  <span className="font-label text-label text-primary">{`${displayName}, kamu bebas memilih langkah yang nyaman.`}</span>
                  <span className="font-metadata text-metadata text-text-secondary">
                    SMP Kelas 8 • Mode Visual
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section
            aria-labelledby="rekomendasi-utama"
            className="relative overflow-hidden rounded-2xl bg-secondary-container text-primary p-space-lg lg:p-space-xl shadow-md"
          >
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/20 pointer-events-none blur-2xl"></div>
            <div className="absolute right-24 bottom-0 opacity-10 pointer-events-none hidden lg:block">
              <svg
                fill="currentColor"
                height="180"
                viewBox="0 0 220 180"
                width="220"
              >
                <rect height="60" rx="8" width="60" x="10" y="70"></rect>
                <rect height="80" rx="8" width="80" x="80" y="70"></rect>
                <polygon points="70,130 80,130 80,70"></polygon>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-xs text-metadata font-label">
                <span className="px-space-sm py-1 rounded-full bg-primary text-on-primary inline-flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px] text-butter"
                    aria-hidden="true"
                  >
                    auto_awesome
                  </span>
                  Rekomendasi Utama Terpilih
                </span>
                <span className="px-space-sm py-1 rounded-full bg-white/70 text-primary inline-flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    schedule
                  </span>
                  Est. ~{`${recommendation.estimated_minutes} Menit`}
                </span>
                <span className="px-space-sm py-1 rounded-full bg-white/70 text-success inline-flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  Tingkat Keyakinan Model: Tinggi (92%)
                </span>
              </div>

              <div className="flex flex-col gap-space-xs max-w-3xl">
                <h2
                  className="font-section-title text-section-title text-primary tracking-tight"
                  id="rekomendasi-utama"
                >
                  {recommendation.title ||
                    material.concepts.find(
                      (c) => c.id === recommendation.concept_id,
                    )?.title ||
                    "Langkah berikutnya"}
                </h2>
                <p className="font-body text-body text-on-secondary-container">
                  Meninjau kenapa{" "}
                  <span className="font-label bg-white/60 px-1.5 py-0.5 rounded text-primary">
                    6² + 8² ≠ 11²
                  </span>{" "}
                  menggunakan pembuktian kotak ubin warna-warni di Mode Visual
                  &amp; Caption, agar perbedaan jumlah kuadrat dan jumlah linier
                  terlihat gamblang.
                </p>
              </div>

              <div className="rounded-xl bg-white p-space-md lg:p-space-lg text-primary shadow-sm mt-space-xs">
                <button
                  aria-controls="reason-content"
                  aria-expanded={showReason}
                  className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-focus rounded-lg py-1"
                  id="toggle-reason-btn"
                  type="button"
                  disabled={busy}
                  onClick={() => setShowReason(!showReason)}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                    </span>
                    <span className="font-card-title text-card-title text-primary">
                      Kenapa ini disarankan Mimo?
                    </span>
                  </div>
                  <span
                    className="material-symbols-outlined text-primary text-[24px] transition-transform duration-200 rotate-180"
                    id="reason-icon"
                    aria-hidden="true"
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className="mt-space-md flex flex-col gap-space-md pt-space-sm"
                  id="reason-content"
                  hidden={!showReason}
                >
                  <p className="font-reading text-reading text-primary">
                    {recommendation.reason}
                  </p>
                  <p className="font-metadata text-metadata text-text-secondary mt-space-md">
                    {recommendation.estimate?.mastery != null
                      ? `Estimasi model: ${Math.round(recommendation.estimate.mastery * 100)}%. Ini berbeda dari jumlah jawaban tepat.`
                      : "Estimasi penguasaan belum tersedia atau belum cukup data. Saran tetap memakai hasil latihan yang diamati."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-space-xs">
                <button
                  className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label flex items-center justify-center gap-2 hover:bg-primary-hover active:bg-primary-pressed shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                  data-path="mulai-belajar"
                  disabled={busy}
                  onClick={onFollow}
                >{`Ikuti Saran Ini (${recommendation.estimated_minutes} Menit)`}</button>
                <button
                  className="h-11 px-space-md rounded-xl bg-surface text-primary font-label text-label flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  id="schedule-btn"
                  type="button"
                  disabled={busy}
                  onClick={onPlanner}
                >
                  {
                    <>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        calendar_today
                      </span>
                      Tinjau Rencana Belajar
                    </>
                  }
                </button>
                <button
                  className="h-11 px-space-md rounded-xl text-primary font-label text-label flex items-center justify-center gap-2 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  disabled={busy}
                  onClick={onBack}
                >
                  {"Lewati dulu (tanpa penalti)"}
                </button>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="pilihan-mandiri-title"
            className="flex flex-col gap-space-md"
          >
            <div className="flex flex-col gap-space-xs">
              <h2
                className="font-section-title text-section-title text-primary tracking-tight"
                id="pilihan-mandiri-title"
              >
                Pilihan Alternatif Mandiri
              </h2>
              <p className="font-body text-body text-text-secondary">
                Lebih nyaman dengan pendekatan lain? Kamu yang paling tahu
                kapasitas pikiranmu saat ini. Pilih format yang paling pas:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {recommendation.alternatives.map((a) => (
                <article
                  className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  key={a.mode}
                >
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-butter text-warning font-label text-metadata inline-flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          aria-hidden="true"
                        >
                          quiz
                        </span>
                        Latihan Singkat
                      </span>
                      <span className="text-metadata font-metadata text-muted-gray flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          timer
                        </span>{" "}
                        ~4 mnt
                      </span>
                    </div>
                    <h3 className="font-card-title text-card-title text-primary mt-space-xs">
                      {modeNames[a.mode]}
                    </h3>
                    <p className="font-metadata text-metadata text-text-secondary leading-relaxed">
                      {a.reason}
                    </p>
                    <div className="p-space-sm rounded-lg bg-surface-container-low text-metadata font-metadata text-text-secondary flex items-center gap-2 mt-space-xs">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        track_changes
                      </span>
                      <span>Fokus: Ketelitian kuadrat linier</span>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md">
                    <button
                      className="w-full h-11 rounded-xl bg-surface-container text-primary font-label text-label flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-on-secondary-container transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                      data-path="mulai-belajar"
                      onClick={() => onOpen(a.mode)}
                    >{`Pilih ${modeNames[a.mode]}`}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="transparansi-title"
            className="rounded-2xl bg-surface p-space-lg lg:p-space-xl shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    account_tree
                  </span>
                </div>
                <div>
                  <h2
                    className="font-section-title text-section-title text-primary tracking-tight"
                    id="transparansi-title"
                  >
                    Bagaimana TemanBelajar Membuat Saran Ini?
                  </h2>
                  <p className="font-metadata text-metadata text-text-secondary">
                    Mesin rekomendasi tanpa kotak hitam (zero-mystery
                    recommendation engine)
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-secondary font-label text-metadata shrink-0">
                <span
                  className="material-symbols-outlined text-[16px] text-success"
                  aria-hidden="true"
                >
                  lock_open
                </span>
                <span>{"Dasar saran dijelaskan dari data belajarmu"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-md">
              <div className="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low">
                <div className="flex items-center justify-between text-metadata font-label text-secondary">
                  <span>Langkah 1: Observasi Riil</span>
                  <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[12px] font-bold">
                    1
                  </span>
                </div>
                <h4 className="font-card-title text-card-title text-primary mt-1">
                  Bukti Jawaban Latihan
                </h4>
                <p className="font-metadata text-metadata text-text-secondary leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>
              <div className="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low">
                <div className="flex items-center justify-between text-metadata font-label text-secondary">
                  <span>Langkah 2: Profil &amp; Waktu</span>
                  <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[12px] font-bold">
                    2
                  </span>
                </div>
                <h4 className="font-card-title text-card-title text-primary mt-1">
                  Kebutuhan Waktu &amp; Energi
                </h4>
                <p className="font-metadata text-metadata text-text-secondary leading-relaxed">{`Durasi usulan ini ${recommendation.estimated_minutes} menit. Kamu bisa menyesuaikan waktunya di rencana belajar.`}</p>
              </div>
              <div className="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low">
                <div className="flex items-center justify-between text-metadata font-label text-secondary">
                  <span>Langkah 3: Jalur Adaptif</span>
                  <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center text-[12px] font-bold">
                    3
                  </span>
                </div>
                <h4 className="font-card-title text-card-title text-primary mt-1">
                  Solusi Bebas Tekanan
                </h4>
                <p className="font-metadata text-metadata text-text-secondary leading-relaxed">
                  Saran bisa diikuti, diganti formatnya, atau dilewati tanpa
                  pengurangan nilai.
                </p>
              </div>
            </div>

            <div className="mt-space-lg p-space-md rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm text-metadata font-metadata text-text-secondary">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  verified_user
                </span>
                <span>
                  <strong>Privasi Terjaga:</strong> Rekomendasi dihitung di
                  perangkatmu. Tidak ada data perangkingan kompetitif atau label
                  kegagalan.
                </span>
              </div>
              <button
                className="text-primary hover:underline font-label text-metadata focus:outline-none focus:ring-2 focus:ring-focus rounded"
                type="button"
                disabled={busy}
                onClick={onSettings}
              >
                {"Sesuaikan preferensi belajar"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm flex flex-col md:flex-row items-center gap-space-lg">
            <div className="w-36 h-36 lg:w-44 lg:h-44 shrink-0 flex items-center justify-center">
              <Image
                alt="Mimo, teman belajarmu"
                className="w-full h-full object-contain filter drop-shadow-sm"
                src="/design/mimo.png"
                width={1024}
                height={1024}
              />
            </div>
            <div className="flex flex-col gap-space-sm flex-1">
              <div className="relative bg-secondary-container text-primary p-space-md lg:p-space-lg rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-card-title text-card-title text-primary">
                    Mimo
                  </span>
                  <span className="text-metadata text-on-secondary-container font-metadata">
                    • Teman Belajarmu
                  </span>
                </div>
                <p className="font-mimo-voice text-mimo-voice leading-relaxed">{`${displayName}, kamu bebas memilih langkah yang nyaman.`}</p>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm mt-space-xs">
                <button
                  className="h-10 px-space-md rounded-xl bg-surface text-primary font-label text-metadata flex items-center gap-1.5 shadow-sm hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  data-path="rencana-belajar"
                  disabled={busy}
                  onClick={onPlanner}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    calendar_month
                  </span>
                  <span>Lihat Rencana Belajar Hari Ini</span>
                </button>
                <button
                  className="h-10 px-space-md rounded-xl text-primary font-label text-metadata flex items-center gap-1.5 hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  data-path="materi-saya"
                  disabled={busy}
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    menu_book
                  </span>
                  <span>Kembali ke Daftar Materi Bab 4</span>
                </button>
              </div>
            </div>
          </section>

          <div
            className="fixed bottom-20 right-6 z-40 hidden max-w-md bg-primary text-on-primary p-space-md rounded-xl shadow-xl flex items-center gap-space-sm transition-all duration-300 transform translate-y-4 opacity-0"
            id="toast-notification"
          >
            <span
              className="material-symbols-outlined text-butter text-[24px]"
              aria-hidden="true"
            >
              task_alt
            </span>
            <div className="flex flex-col flex-1">
              <span className="font-label text-label">
                Tersimpan ke Rencana Belajar!
              </span>
              <span className="font-metadata text-metadata text-on-primary-container">
                Modul Ubin Visual dijadwalkan besok pukul 16:00 WIB.
              </span>
            </div>
            <button
              className="text-on-primary-container hover:text-white p-1"
              id="close-toast-btn"
              type="button"
              disabled={busy}
              onClick={onBack}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                close
              </span>
            </button>
          </div>

          <aside
            aria-label="Ringkasan Waktu Belajar"
            className="w-full bg-surface rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md"
          >
            <div className="flex items-center gap-space-md w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  hourglass_top
                </span>
              </div>
              <div className="flex flex-col flex-1 md:flex-none">
                <div className="flex items-center gap-2">
                  <span className="font-label text-label text-primary">
                    Target Belajar Hari Ini: 15 Menit
                  </span>
                  <span className="text-metadata font-metadata text-muted-gray">
                    • Terpakai: 9 Menit
                  </span>
                </div>
                <div className="flex items-center gap-space-sm mt-1">
                  <div className="w-48 max-w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="text-metadata font-metadata text-secondary font-semibold">
                    Durasi fleksibel
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-md w-full md:w-auto justify-end">
              <button
                className="h-10 px-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label text-label flex items-center gap-2 hover:bg-secondary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                data-path="rencana-belajar"
                disabled={busy}
                onClick={onPlanner}
              >
                <span>Ke Rencana Belajar Harian</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </button>
            </div>
          </aside>
        </div>
      </div>
      <button
        onClick={() => onSpeak(recommendation.reason)}
        className="h-11 px-space-lg rounded-xl bg-surface text-primary font-label text-label"
      >
        Bacakan alasan
      </button>
    </div>
  );
}

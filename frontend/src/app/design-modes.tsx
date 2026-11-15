"use client";
import { useState } from "react";
import Image from "next/image";
import type { Material, Mode } from "@/lib/types";
export function ModePicker({
  material,
  busy,
  onBack,
  onSelect,
  canSaveDefault,
}: {
  material: Material;
  busy: boolean;
  onBack: () => void;
  onSelect: (mode: Mode, remember: boolean) => void;
  canSaveDefault: boolean;
}) {
  const [remember, setRemember] = useState(false);
  const available = (mode: Mode) =>
    mode === "explore"
      ? material.concepts.every((c) => c.diagram_description)
      : mode === "transcript"
        ? material.concepts.every((c) => c.transcript)
        : true;
  return (
    <div className="stitch-screen">
      <div className="flex flex-col w-full">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <button
                className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded-lg px-1 -ml-1"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Ringkasan Bab 4</span>
              </button>
              <div className="flex flex-wrap items-center gap-space-xs mt-1">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-metadata text-metadata">
                  {material.subject}
                </span>
                <span className="text-muted-gray text-xs">•</span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-metadata text-metadata">
                  3 Konsep Inti
                </span>
                <span className="text-muted-gray text-xs">•</span>
                <span className="flex items-center gap-1 text-text-secondary font-metadata text-metadata">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    schedule
                  </span>
                  Est. 12–15 Menit
                </span>
                <span className="text-muted-gray text-xs">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface text-text-secondary font-metadata text-[12px] shadow-sm">
                  <span
                    className="material-symbols-outlined text-[15px] text-secondary"
                    aria-hidden="true"
                  >
                    description
                  </span>
                  {material.sources[0]?.label || "Sumber materi"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-xl">
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                aria-hidden="true"
              >
                tune
              </span>
              <div className="flex flex-col">
                <span className="font-label text-label text-primary">
                  Mode Adaptif Aktif
                </span>
                <span className="font-metadata text-[12px] text-text-secondary">
                  Bisa ganti cara kapan saja
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm max-w-3xl">
            <h1 className="font-display text-page-title text-primary tracking-tight">
              Mau belajar pakai cara yang mana hari ini?
            </h1>
            <p className="font-reading text-reading text-text-secondary">
              Setiap materi punya banyak jalan untuk dipahami. Pilih cara yang
              paling pas dengan energimu hari ini—kamu bebas berganti mode kapan
              saja di tengah sesi tanpa kehilangan progres.
            </p>
          </div>

          <div className="bg-secondary-container/60 rounded-2xl p-space-md md:p-space-lg flex flex-col md:flex-row items-center gap-space-lg shadow-sm">
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-surface flex items-center justify-center overflow-hidden shadow-sm">
                <Image
                  alt="Mimo, teman belajarmu"
                  className="w-full h-full object-contain p-2"
                  data-alt="Chameleon illustration named Mimo sitting happily atop a stack of colorful pastel textbooks, waving a friendly hand in an editorial soft storybook style with warm earthy green and mint tones"
                  src="/design/mimo.png"
                  width={1024}
                  height={1024}
                />
              </div>
              <div className="absolute -bottom-2 bg-primary text-on-primary text-[11px] font-label px-2.5 py-0.5 rounded-full shadow-sm">
                Mimo • Pendamping
              </div>
            </div>

            <div className="flex-1 bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col gap-space-xs relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-secondary font-label text-label">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    forum
                  </span>
                  <span>{material.title}</span>
                </div>
                <span className="text-[12px] font-metadata text-text-secondary bg-surface-container px-2 py-0.5 rounded-full">
                  Saran personal
                </span>
              </div>
              <p className="font-mimo-voice text-mimo-voice text-contrast-ink leading-relaxed">
                “Hari ini Mimo merekomendasikan{" "}
                <strong className="text-primary underline decoration-secondary-container decoration-4 underline-offset-2">
                  Mode Teman Baca
                </strong>{" "}
                karena ada rumus dan diagram tangga yang asyik dipahami
                pelan-pelan. Tapi kalau matamu lagi lelah membaca, mode
                dengarkan juga siap nemenin!”
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-space-md flex flex-wrap items-center justify-between gap-space-md shadow-sm">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[28px]"
                  aria-hidden="true"
                >
                  square_foot
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-metadata text-[12px] text-text-secondary uppercase tracking-wider font-semibold">
                  Materi Terbuka
                </span>
                <span className="font-card-title text-card-title text-primary">
                  {material.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm text-text-secondary font-metadata text-metadata">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Konsep Hipotenusa
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-peach"></span> Rumus a²
                + b² = c²
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-butter"></span> Triple
                Pythagoras
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            <div className="relative bg-secondary-container/40 rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-on-primary font-label text-[12px] shadow-sm">
                    <span
                      className="material-symbols-outlined text-[16px] text-peach"
                      aria-hidden="true"
                    >
                      star
                    </span>
                    Rekomendasi Hari Ini
                  </span>
                  <span className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary font-label text-label">
                    01
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-primary shadow-sm">
                    <span
                      className="material-symbols-outlined text-[26px]"
                      aria-hidden="true"
                    >
                      menu_book
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-card-title text-card-title text-primary">
                      Teman Baca
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Reading Companion
                    </span>
                  </div>
                </div>

                <p className="font-body text-body text-contrast-ink">
                  {
                    "Bacaan lapang dengan ukuran, jarak baris, dan sumber yang jelas. Posisi serta catatan mengikuti sesimu."
                  }
                </p>

                <div className="p-space-sm rounded-xl bg-surface flex flex-col gap-1.5 shadow-sm">
                  <span className="font-label text-[12px] text-secondary flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      thumb_up
                    </span>{" "}
                    Cocok untuk:
                  </span>
                  <span className="font-metadata text-[13px] text-text-secondary leading-snug">
                    Membaca teliti, ramah disleksia, suka tampilan tenang &amp;
                    lapang.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-text-secondary font-metadata text-metadata">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                      ~12 Menit
                    </span>
                    <span>3 Bagian Pendek</span>
                  </div>
                  <div className="flex items-center gap-1 text-success font-metadata text-[13px] mt-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Lengkap dengan glosarium &amp; diagram segitiga</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onSelect("reading", remember)}
                  disabled={busy || !available("reading")}
                >
                  <span>Mulai dengan Cara Ini</span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
              {!available("reading") && (
                <p className="font-metadata text-metadata text-text-secondary">
                  Format belum tersedia untuk materi ini.
                </p>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-text-secondary font-label text-[12px]">
                    Kartu Tunggal
                  </span>
                  <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-text-secondary font-label text-label">
                    02
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[26px]"
                      aria-hidden="true"
                    >
                      view_carousel
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-card-title text-card-title text-primary">
                      Selangkah demi Selangkah
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Focus Navigator
                    </span>
                  </div>
                </div>

                <p className="font-body text-body text-contrast-ink">
                  {
                    "Satu paragraf setiap langkah. Gunakan jeda dan lanjut saat kamu siap."
                  }
                </p>

                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                  <span className="font-label text-[12px] text-secondary flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      thumb_up
                    </span>{" "}
                    Cocok untuk:
                  </span>
                  <span className="font-metadata text-[13px] text-text-secondary leading-snug">
                    Mudah lelah melihat teks panjang, suka fokus singkat 1 ide
                    per kartu.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-text-secondary font-metadata text-metadata">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                      ~15 Menit
                    </span>
                    <span>4 Langkah Santai</span>
                  </div>
                  <div className="flex items-center gap-1 text-success font-metadata text-[13px] mt-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Format kartu fokus siap</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onSelect("focus", remember)}
                  disabled={busy || !available("focus")}
                >
                  <span>Pilih Mode Ini</span>
                </button>
              </div>
              {!available("focus") && (
                <p className="font-metadata text-metadata text-text-secondary">
                  Format belum tersedia untuk materi ini.
                </p>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-text-secondary font-label text-[12px]">
                    Audio &amp; Visual
                  </span>
                  <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-text-secondary font-label text-label">
                    03
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[26px]"
                      aria-hidden="true"
                    >
                      headphones
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-card-title text-card-title text-primary">
                      Dengarkan dan Jelajahi
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Audio &amp; Visual Explorer
                    </span>
                  </div>
                </div>

                <p className="font-body text-body text-contrast-ink">
                  {
                    "Jelajahi deskripsi diagram dan dengarkan penjelasan dengan suara perangkat, bila tersedia."
                  }
                </p>

                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                  <span className="font-label text-[12px] text-secondary flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      thumb_up
                    </span>{" "}
                    Cocok untuk:
                  </span>
                  <span className="font-metadata text-[13px] text-text-secondary leading-snug">
                    Lebih nyaman mendengar, mata lelah dari layar, auditori
                    aktif.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-text-secondary font-metadata text-metadata">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                      ~10 Menit
                    </span>
                    <span>Audio 0.8x – 1.2x</span>
                  </div>
                  <div className="flex items-center gap-1 text-success font-metadata text-[13px] mt-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Narasi audio &amp; deskripsi siap</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onSelect("explore", remember)}
                  disabled={busy || !available("explore")}
                >
                  <span>Pilih Mode Ini</span>
                </button>
              </div>
              {!available("explore") && (
                <p className="font-metadata text-metadata text-text-secondary">
                  Format belum tersedia untuk materi ini.
                </p>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-text-secondary font-label text-[12px]">
                    Infografis Zine
                  </span>
                  <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-text-secondary font-label text-label">
                    04
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[26px]"
                      aria-hidden="true"
                    >
                      palette
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-card-title text-card-title text-primary">
                      Teks &amp; Visual Bergambar
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Visual &amp; Caption Mode
                    </span>
                  </div>
                </div>

                <p className="font-body text-body text-contrast-ink">
                  {
                    "Ikuti penjelasan lewat transkrip teks. Konten ini tersedia pada materi yang menyediakan transkrip."
                  }
                </p>

                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                  <span className="font-label text-[12px] text-secondary flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      thumb_up
                    </span>{" "}
                    Cocok untuk:
                  </span>
                  <span className="font-metadata text-[13px] text-text-secondary leading-snug">
                    Pembelajar spasial-visual, suka peta konsep berbingkai
                    hangat.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-text-secondary font-metadata text-metadata">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                      ~12 Menit
                    </span>
                    <span>3 Visual Interaktif</span>
                  </div>
                  <div className="flex items-center gap-1 text-success font-metadata text-[13px] mt-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Infografis visual siap</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onSelect("transcript", remember)}
                  disabled={busy || !available("transcript")}
                >
                  <span>Pilih Mode Ini</span>
                </button>
              </div>
              {!available("transcript") && (
                <p className="font-metadata text-metadata text-text-secondary">
                  Format belum tersedia untuk materi ini.
                </p>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-text-secondary font-label text-[12px]">
                    Format Buku Paket
                  </span>
                  <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-text-secondary font-label text-label">
                    05
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-[26px]"
                      aria-hidden="true"
                    >
                      article
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-card-title text-card-title text-primary">
                      Belajar Biasa
                    </h2>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Standard Learning
                    </span>
                  </div>
                </div>

                <p className="font-body text-body text-contrast-ink">
                  {
                    "Baca seluruh paragraf dalam satu konsep dengan navigasi dan sumber yang sama."
                  }
                </p>

                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                  <span className="font-label text-[12px] text-secondary flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      thumb_up
                    </span>{" "}
                    Cocok untuk:
                  </span>
                  <span className="font-metadata text-[13px] text-text-secondary leading-snug">
                    Siswa yang terbiasa membaca linear atau ingin mencocokkan
                    bab cetak.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-text-secondary font-metadata text-metadata">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                      ~12 Menit
                    </span>
                    <span>Teks Lengkap</span>
                  </div>
                  <div className="flex items-center gap-1 text-success font-metadata text-[13px] mt-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Naskah lengkap tersedia</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label flex items-center justify-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onSelect("standard", remember)}
                  disabled={busy || !available("standard")}
                >
                  <span>Pilih Mode Ini</span>
                </button>
              </div>
              {!available("standard") && (
                <p className="font-metadata text-metadata text-text-secondary">
                  Format belum tersedia untuk materi ini.
                </p>
              )}
            </div>

            <div className="bg-surface-container-low rounded-2xl p-space-lg flex flex-col justify-between shadow-sm">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center gap-2 text-primary font-label text-label">
                  <span
                    className="material-symbols-outlined text-secondary text-[22px]"
                    aria-hidden="true"
                  >
                    accessibility
                  </span>
                  <span>Preferensi Aktif Nadia</span>
                </div>
                <p className="font-metadata text-metadata text-text-secondary">
                  Semua mode di samping telah disesuaikan secara otomatis dengan
                  profil kenyamananmu:
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface text-[13px]">
                    <span className="text-text-secondary font-metadata">
                      Font Ramah Mata:
                    </span>
                    <span className="font-label text-primary">
                      Plus Jakarta Sans
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface text-[13px]">
                    <span className="text-text-secondary font-metadata">
                      Jarak Baris:
                    </span>
                    <span className="font-label text-primary">
                      Lebar (1.6x)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface text-[13px]">
                    <span className="text-text-secondary font-metadata">
                      Timer Tekanan:
                    </span>
                    <span className="font-label text-success">
                      Dinonaktifkan
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="mt-space-md text-secondary font-label text-[13px] hover:underline flex items-center gap-1"
                onClick={onBack}
              >
                <span>Ubah profil kenyamanan baca</span>
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  open_in_new
                </span>
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[22px]"
                  aria-hidden="true"
                >
                  table_chart
                </span>
                <h3 className="font-section-title text-section-title text-primary">
                  Perbandingan Cepat Fitur Mode
                </h3>
              </div>
              <span className="font-metadata text-metadata text-text-secondary">
                Semua mode menjamin pemahaman konsep yang setara
              </span>
            </div>

            <div className="overflow-x-auto -mx-space-md px-space-md md:mx-0 md:px-0">
              <table className="w-full text-left font-metadata text-metadata border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-surface-container-low text-primary font-label">
                    <th className="py-3 px-space-md rounded-l-xl" scope="col">
                      Fitur Pendukung
                    </th>
                    <th className="py-3 px-space-sm text-center" scope="col">
                      Teman Baca ⭐
                    </th>
                    <th className="py-3 px-space-sm text-center" scope="col">
                      Selangkah demi Selangkah
                    </th>
                    <th className="py-3 px-space-sm text-center" scope="col">
                      Dengarkan &amp; Jelajahi
                    </th>
                    <th className="py-3 px-space-sm text-center" scope="col">
                      Teks &amp; Visual
                    </th>
                    <th
                      className="py-3 px-space-sm text-center rounded-r-xl"
                      scope="col"
                    >
                      Belajar Biasa
                    </th>
                  </tr>
                </thead>
                <tbody className="text-contrast-ink">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-space-md font-label text-primary flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        straighten
                      </span>
                      Penggaris Baca (Reading Ruler)
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Tersedia
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      Opsional
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors bg-surface-container-lowest">
                    <td className="py-3 px-space-md font-label text-primary flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        volume_up
                      </span>
                      Narasi Suara Santai (Audio Mimo)
                    </td>
                    <td className="py-3 px-space-sm text-center text-text-secondary">
                      Text-to-Speech
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      Opsional
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Penuh (0.8x-1.2x)
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      Opsional
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-space-md font-label text-primary flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        splitscreen
                      </span>
                      Format Kartu Tunggal (Micro-steps)
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ 1 Ide/Kartu
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                    <td className="py-3 px-space-sm text-center text-muted-gray">
                      —
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors bg-surface-container-lowest">
                    <td className="py-3 px-space-md font-label text-primary flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        architecture
                      </span>
                      Diagram Interaktif &amp; Infografis
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Interaktif
                    </td>
                    <td className="py-3 px-space-sm text-center text-text-secondary">
                      Ringkas
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Berpandu Suara
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Kaya Ilustrasi
                    </td>
                    <td className="py-3 px-space-sm text-center text-text-secondary">
                      Gambar Statis
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-space-md font-label text-primary flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-secondary text-[18px]"
                        aria-hidden="true"
                      >
                        translate
                      </span>
                      Glosarium Istilah 1-Klik
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Klik Pop-up
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Otomatis
                    </td>
                    <td className="py-3 px-space-sm text-center text-text-secondary">
                      Dibacakan
                    </td>
                    <td className="py-3 px-space-sm text-center text-success font-bold">
                      ✓ Glosarium Visual
                    </td>
                    <td className="py-3 px-space-sm text-center text-text-secondary">
                      Daftar Bawah
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface-container-high/60 rounded-2xl p-space-md flex flex-col sm:flex-row items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-on-secondary-fixed text-[22px]"
                aria-hidden="true"
              >
                swap_horiz
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="font-label text-label text-primary">
                Prinsip Belajar Adaptif TemanBelajar
              </span>
              <p className="font-metadata text-metadata text-text-secondary">
                Kamu tidak terkunci pada satu mode. Di dalam sesi belajar,
                tombol{" "}
                <span className="font-semibold text-primary">
                  ‘Ganti Cara Belajar’
                </span>{" "}
                selalu tersedia di toolbar atas. Progres pemahamanmu tersimpan
                otomatis tanpa perlu mengulang dari awal.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs pb-space-lg">
            <div className="flex items-center gap-space-xs">
              <input
                className="w-5 h-5 rounded text-primary focus:ring-focus cursor-pointer"
                id="defaultModeCheck"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={!canSaveDefault}
              />
              <label
                className="font-label text-label text-text-secondary cursor-pointer select-none"
                htmlFor="defaultModeCheck"
              >
                Jadikan mode yang saya pilih sebagai default untuk seluruh Bab 4
              </label>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto">
              <button
                className="w-full sm:w-auto h-11 px-space-lg rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                onClick={onBack}
              >
                Kembali ke Ringkasan Materi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

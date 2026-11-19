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
  const [selected, setSelected] = useState<Mode>("reading");
  const available = (mode: Mode) =>
    mode === "explore"
      ? material.concepts.every((c) => c.diagram_description)
      : mode === "transcript"
        ? material.concepts.every((c) => c.transcript)
        : true;
  return (
    <>
      <div className="final-design final-screen-12 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full pb-32">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-lg space-y-space-lg ui-container">
            <header className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant">
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Materi Saya
                </a>
                <span className="text-divider">/</span>
                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  {material.title}
                </a>
                <span className="text-divider">/</span>
                <span className="text-contrast-ink font-semibold">
                  Pilih Gaya Belajar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-tint text-success font-label text-[12px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  {material.concepts.length} konsep ·{" "}
                  {material.concepts.reduce(
                    (sum, concept) => sum + concept.estimated_minutes,
                    0,
                  )}{" "}
                  menit
                </span>
              </div>
            </header>

            <section className="space-y-1">
              <h1 className="font-display font-black text-2xl md:text-3xl text-primary tracking-tight ui-page-title">
                Pilih cara belajar
              </h1>
              <p className="text-on-surface-variant font-body text-base">
                Ikuti energimu. Ganti mode kapan saja.
              </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <div
                aria-label="Pilihan Cara Belajar"
                className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-space-md"
                role="radiogroup"
              >
                <div
                  className="mode-card cursor-pointer rounded-2xl p-5 border-2 border-primary bg-mint-tint shadow-sm transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                  id="mode-card-1"
                  data-selected={selected === "reading"}
                  onClick={() => {
                    if (available("reading")) setSelected("reading");
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold tracking-wide">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          aria-hidden="true"
                        >
                          stars
                        </span>
                        Rekomendasi
                      </span>
                      <input
                        checked={selected === "reading"}
                        className="w-4 h-4 accent-primary cursor-pointer"
                        id="mode-1"
                        aria-label="Teman Baca"
                        name="learning-mode"
                        type="radio"
                        value="teman-baca"
                        disabled={!available("reading")}
                        onChange={() => setSelected("reading")}
                      />
                    </div>

                    <div className="bg-surface/90 rounded-xl p-3 border border-secondary/20 mb-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-divider">
                        <span
                          className="material-symbols-outlined text-secondary text-[16px]"
                          aria-hidden="true"
                        >
                          menu_book
                        </span>
                        <span className="text-[11px] font-bold text-contrast-ink">
                          Pratinjau Teks
                        </span>
                      </div>
                      <div className="h-2 w-3/4 rounded bg-surface-container-high"></div>
                      <div className="h-3 w-full rounded bg-secondary-container/70 flex items-center px-1.5">
                        <span className="text-[9px] font-semibold text-primary truncate">
                          {material.concepts[0]?.title || material.title}
                        </span>
                      </div>
                      <div className="h-2 w-5/6 rounded bg-surface-container-high"></div>
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-contrast-ink ui-card-title">
                      Teman Baca
                    </h3>
                    <p className="text-on-surface-variant text-[13px] leading-snug mt-1">
                      Teks lapang. Ukuran, jarak, dan penggaris baca bisa
                      diatur.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-secondary/15">
                    <span className="px-2 py-0.5 rounded-md bg-surface text-secondary text-[11px] font-semibold">
                      Font Disleksia
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface text-secondary text-[11px] font-semibold">
                      Penggaris Baca
                    </span>
                  </div>
                  {!available("reading") && (
                    <p className="p-3 text-sm text-error">
                      Format ini belum tersedia pada materi ini.
                    </p>
                  )}
                </div>

                <div
                  className="mode-card cursor-pointer rounded-2xl p-5 border-2 border-divider hover:border-outline bg-surface shadow-sm transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                  id="mode-card-2"
                  data-selected={selected === "focus"}
                  onClick={() => {
                    if (available("focus")) setSelected("focus");
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-butter-tint text-warning text-[11px] font-bold tracking-wide">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          aria-hidden="true"
                        >
                          timer
                        </span>
                        Bebas Distraksi
                      </span>
                      <input
                        className="w-4 h-4 accent-primary cursor-pointer"
                        id="mode-2"
                        aria-label="Selangkah demi Selangkah"
                        name="learning-mode"
                        type="radio"
                        value="langkah-langkah"
                        checked={selected === "focus"}
                        disabled={!available("focus")}
                        onChange={() => setSelected("focus")}
                      />
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-3 border border-divider mb-3 space-y-1.5">
                      <div className="flex items-center justify-between pb-1 border-b border-divider">
                        <span className="text-[11px] font-bold text-contrast-ink">
                          Langkah 1 dari 3
                        </span>
                        <span className="text-[10px] font-bold text-secondary">
                          Pratinjau
                        </span>
                      </div>
                      <div className="flex items-center gap-2 py-0.5">
                        <span className="w-4 h-4 rounded-full bg-secondary text-surface flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                        <span className="text-[10px] font-medium text-contrast-ink truncate">
                          {material.concepts[0]?.title || material.title}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full w-1/3"></div>
                      </div>
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-contrast-ink ui-card-title">
                      Selangkah demi Selangkah
                    </h3>
                    <p className="text-on-surface-variant text-[13px] leading-snug mt-1">
                      Satu bagian setiap langkah. Lanjut saat kamu siap.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-divider">
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      1 Konsep/Layar
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      Timer Santai
                    </span>
                  </div>
                  {!available("focus") && (
                    <p className="p-3 text-sm text-error">
                      Format ini belum tersedia pada materi ini.
                    </p>
                  )}
                </div>

                <div
                  className="mode-card cursor-pointer rounded-2xl p-5 border-2 border-divider hover:border-outline bg-surface shadow-sm transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                  id="mode-card-3"
                  data-selected={selected === "explore"}
                  onClick={() => {
                    if (available("explore")) setSelected("explore");
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lavender-tint text-tertiary text-[11px] font-bold tracking-wide">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          aria-hidden="true"
                        >
                          headphones
                        </span>
                        Diagram & deskripsi
                      </span>
                      <input
                        className="w-4 h-4 accent-primary cursor-pointer"
                        id="mode-3"
                        aria-label="Jelajah visual"
                        name="learning-mode"
                        type="radio"
                        value="audio-eksplorasi"
                        checked={selected === "explore"}
                        disabled={!available("explore")}
                        onChange={() => setSelected("explore")}
                      />
                    </div>

                    <div className="bg-lavender-tint/60 rounded-xl p-3 border border-lavender/30 mb-3 space-y-1.5">
                      <div className="flex items-center justify-between pb-1 border-b border-lavender/20">
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-tertiary text-[15px]"
                            aria-hidden="true"
                          >
                            graphic_eq
                          </span>
                          <span className="text-[11px] font-bold text-contrast-ink">
                            Narasi Santai
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-tertiary">
                          12 Menit
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1 py-1">
                        <span className="w-1 h-3 bg-tertiary/70 rounded-full"></span>
                        <span className="w-1 h-5 bg-tertiary rounded-full"></span>
                        <span className="w-1 h-2 bg-tertiary/60 rounded-full"></span>
                        <span className="w-1 h-6 bg-tertiary rounded-full"></span>
                        <span className="w-1 h-4 bg-tertiary/80 rounded-full"></span>
                        <span className="w-1 h-2 bg-tertiary/50 rounded-full"></span>
                      </div>
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-contrast-ink ui-card-title">
                      Jelajah visual
                    </h3>
                    <p className="text-on-surface-variant text-[13px] leading-snug mt-1">
                      Jelajahi deskripsi diagram materi secara bertahap, dengan
                      pilihan baca nyaring dari peramban.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-divider">
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      Narasi Ramah
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      Teks Sinkron
                    </span>
                  </div>
                  {!available("explore") && (
                    <p className="p-3 text-sm text-error">
                      Format ini belum tersedia pada materi ini.
                    </p>
                  )}
                </div>

                <div
                  className="mode-card cursor-pointer rounded-2xl p-5 border-2 border-divider hover:border-outline bg-surface shadow-sm transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
                  id="mode-card-4"
                  data-selected={selected === "transcript"}
                  onClick={() => {
                    if (available("transcript")) setSelected("transcript");
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-peach-tint text-[#8C4A19] text-[11px] font-bold tracking-wide">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          aria-hidden="true"
                        >
                          palette
                        </span>
                        Transkrip & audio
                      </span>
                      <input
                        className="w-4 h-4 accent-primary cursor-pointer"
                        id="mode-4"
                        aria-label="Transkrip & audio"
                        name="learning-mode"
                        type="radio"
                        value="visual-caption"
                        checked={selected === "transcript"}
                        disabled={!available("transcript")}
                        onChange={() => setSelected("transcript")}
                      />
                    </div>

                    <div className="bg-peach-tint/60 rounded-xl p-3 border border-peach/30 mb-3 space-y-1.5">
                      <div className="flex items-center justify-between pb-1 border-b border-peach/25">
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[#8C4A19] text-[15px]"
                            aria-hidden="true"
                          >
                            schema
                          </span>
                          <span className="text-[11px] font-bold text-contrast-ink">
                            Diagram Anatomi
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#8C4A19]">
                          3 Poin
                        </span>
                      </div>
                      <div className="flex items-center justify-around py-0.5 text-center">
                        <div className="bg-surface px-1.5 py-1 rounded text-[9px] font-bold text-contrast-ink border border-divider">
                          Korteks
                        </div>
                        <span className="text-[10px] text-peach">→</span>
                        <div className="bg-surface px-1.5 py-1 rounded text-[9px] font-bold text-contrast-ink border border-divider">
                          Medula
                        </div>
                      </div>
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-contrast-ink ui-card-title">
                      Transkrip &amp; Audio
                    </h3>
                    <p className="text-on-surface-variant text-[13px] leading-snug mt-1">
                      Baca transkrip materi dan dengarkan narasi melalui suara
                      peramban dengan kecepatan yang dapat disesuaikan.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-divider">
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      Diagram Pastel
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                      Kartu Intisari
                    </span>
                  </div>
                  {!available("transcript") && (
                    <p className="p-3 text-sm text-error">
                      Format ini belum tersedia pada materi ini.
                    </p>
                  )}
                </div>

                <div
                  className="mode-card cursor-pointer rounded-2xl p-5 border-2 border-divider hover:border-outline bg-surface shadow-sm transition-all hover:translate-y-[-2px] flex flex-col md:flex-row md:items-center justify-between gap-4 md:col-span-2 group"
                  id="mode-card-5"
                  data-selected={selected === "standard"}
                  onClick={() => {
                    if (available("standard")) setSelected("standard");
                  }}
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-divider">
                      <span
                        className="material-symbols-outlined text-secondary text-[28px]"
                        aria-hidden="true"
                      >
                        import_contacts
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-extrabold text-base md:text-lg text-contrast-ink ui-card-title">
                          Belajar Biasa
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                          Standard
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-[13px]">
                        Format bab e-book terstruktur sesuai buku teks sekolah.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-divider">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                        Buku Rapi
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-canvas text-secondary text-[11px] font-semibold">
                        Cari Cepat
                      </span>
                    </div>
                    <input
                      className="w-4 h-4 accent-primary cursor-pointer"
                      id="mode-5"
                      aria-label="Belajar Biasa"
                      name="learning-mode"
                      type="radio"
                      value="standar"
                      checked={selected === "standard"}
                      disabled={!available("standard")}
                      onChange={() => setSelected("standard")}
                    />
                  </div>
                  {!available("standard") && (
                    <p className="p-3 text-sm text-error">
                      Format ini belum tersedia pada materi ini.
                    </p>
                  )}
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-space-md">
                <div className="bg-surface rounded-2xl p-5 border border-divider shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                      <Image
                        alt=""
                        className="w-full h-full object-contain object-contain"
                        src="/design/mimo-final.png"
                        width={1408}
                        height={1120}
                      ></Image>
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-base text-primary">
                        Saran dari Mimo
                      </p>
                      <p className="text-[12px] font-metadata text-secondary">
                        Pendamping Belajarmu
                      </p>
                    </div>
                  </div>

                  <div className="relative bg-lavender-tint/80 border border-lavender/30 rounded-2xl p-3.5 text-contrast-ink font-mimo-voice text-[14px] leading-relaxed">
                    <p>
                      &quot;Cobain <strong>&#x27;Teman Baca&#x27;</strong> yuk,
                      pas banget buat santai!&quot;
                    </p>
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-canvas hover:bg-surface-container text-primary font-label text-[13px] font-bold transition-colors border border-divider"
                    type="button"
                    onClick={onBack}
                  >
                    <span
                      className="material-symbols-outlined text-[17px]"
                      aria-hidden="true"
                    >
                      accessibility_new
                    </span>
                    Sesuaikan Aksesibilitas
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                    <span
                      className="material-symbols-outlined text-[15px] text-success"
                      aria-hidden="true"
                    >
                      verified_user
                    </span>
                    <span>Progres tersimpan otomatis tiap pindah mode.</span>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-4 border border-divider shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                    Topik Belajar
                  </span>
                  <p className="font-display font-bold text-sm text-contrast-ink">
                    {material.concepts[0]?.title || material.title}
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    {material.concepts[0]?.title || material.title}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div className="screen-action-bar sticky bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-divider py-3 px-margin-mobile md:px-margin-tablet lg:px-margin shadow-lg">
          {canSaveDefault && (
            <label className="max-w-6xl mx-auto flex items-center gap-2 mb-3 text-sm ui-container">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Jadikan pilihan utama
            </label>
          )}
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 ui-container">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  id="selected-mode-icon"
                  aria-hidden="true"
                >
                  menu_book
                </span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-secondary font-medium hidden sm:inline">
                    Pilihan:
                  </span>
                  <p
                    className="font-display font-bold text-sm md:text-base text-contrast-ink"
                    id="selected-mode-label"
                  >
                    {
                      {
                        reading: "Teman Baca",
                        focus: "Selangkah demi Selangkah",
                        explore: "Jelajah visual",
                        transcript: "Transkrip & audio",
                        standard: "Belajar Biasa",
                      }[selected]
                    }
                  </p>
                </div>
                <p className="text-[11px] text-outline hidden md:block">
                  Bisa ganti mode kapan saja di dalam materi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                className="hidden sm:inline-flex items-center px-3.5 py-2.5 rounded-xl bg-canvas hover:bg-surface-container text-primary font-label text-[13px] font-bold transition-colors border border-divider"
                type="button"
                onClick={() => onSelect(selected, remember)}
              >
                Pratinjau
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-sm font-bold transition-colors shadow-sm"
                onClick={() => onSelect(selected, remember)}
                disabled={busy || !available(selected)}
                type="button"
              >
                <span>Mulai Belajar Sekarang</span>
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
    </>
  );
}

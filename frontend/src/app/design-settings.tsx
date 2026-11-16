"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { readingStyle } from "./reading-style";
import type { Session } from "@supabase/supabase-js";
import {
  defaultProfile,
  type Profile,
  type Preferences,
  type Mode,
} from "@/lib/types";
const modeOptions: [Mode, string][] = [
  ["standard", "Teks & Visual"],
  ["reading", "Teman Baca"],
  ["focus", "Langkah demi Langkah"],
  ["explore", "Jelajahi Diagram"],
  ["transcript", "Audio & Transkrip"],
];
export function SettingsDesign({
  profile,
  onSave,
  busy,
  account,
  signOut,
  onBack,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  account: Session;
  signOut: () => void;
  onBack: () => void;
}) {
  const [value, setValue] = useState(profile),
    [tab, setTab] = useState("accessibility"),
    [speechNotice, setSpeechNotice] = useState("");
  const prefs = value.preferences;
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );
  const update = <K extends keyof Preferences>(key: K, v: Preferences[K]) =>
    setValue({ ...value, preferences: { ...prefs, [key]: v } });
  const previewStyle = {
    ...readingStyle(prefs),
    color: prefs.high_contrast ? "#101a16" : undefined,
    backgroundColor: prefs.high_contrast ? "white" : undefined,
  };

  function speak() {
    if (!window.speechSynthesis) {
      setSpeechNotice("Baca nyaring belum tersedia di peramban ini.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      "Satu langkah kecil hari ini sudah berarti. Kamu bebas menyesuaikan ritme belajar.",
    );
    u.lang = "id-ID";
    u.rate = prefs.speech_rate;
    u.onerror = () =>
      setSpeechNotice("Suara belum dapat diputar. Coba peramban lain.");
    window.speechSynthesis.speak(u);
    setSpeechNotice("Memutar contoh dengan suara peramban.");
  }
  function exportProfile() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "temanbelajar-preferensi.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="stitch-settings final-settings">
        <p className="sr-only">{account.user.email || "Akun demo anonim"}</p>
        <nav
          aria-label="Bagian pengaturan"
          className="final-settings-tabs flex gap-3 max-w-[1200px] w-full mx-auto px-margin py-4 ui-container"
        >
          <button
            onClick={() => setTab("accessibility")}
            aria-pressed={tab === "accessibility"}
          >
            Aksesibilitas
          </button>
          <button
            onClick={() => setTab("profile")}
            aria-pressed={tab === "profile"}
          >
            Profil
          </button>
        </nav>
        <p
          role="status"
          className="max-w-[1200px] w-full mx-auto px-margin text-sm ui-container"
        >
          {JSON.stringify(value) === JSON.stringify(profile)
            ? "Preferensi tersimpan."
            : "Ada perubahan yang belum disimpan."}
        </p>
        {tab === "accessibility" ? (
          <div className="final-design final-screen-23 w-full bg-canvas flex-1 screen-page">
            <div className="flex flex-col w-full">
              <section className="max-w-[1200px] w-full mx-auto px-margin pt-space-lg pb-space-md ui-container">
                <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
                  <nav className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant ui-breadcrumb">
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Beranda
                    </a>
                    <span>›</span>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Pengaturan
                    </a>
                    <span>›</span>
                    <span className="font-label text-primary font-semibold">
                      Aksesibilitas &amp; Kenyamanan Belajar
                    </span>
                  </nav>
                  <div className="flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-[12px] font-label font-bold">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span>Simpan untuk menerapkan perubahan</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-md border-b border-divider">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-space-xs mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-mint-tint text-success font-label text-[11px] uppercase tracking-wider font-extrabold">
                        Alat Inklusif &amp; Kognitif
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-butter-tint text-warning font-label text-[11px] uppercase tracking-wider font-extrabold">
                        Target WCAG 2.2 AA
                      </span>
                    </div>
                    <h1 className="font-page-title text-page-title text-primary tracking-tight ui-page-title">
                      Pengaturan Aksesibilitas
                    </h1>
                    <p className="font-body text-body text-on-surface-variant mt-1.5 leading-relaxed">
                      Atur tampilan dan alat bantu belajar yang paling pas buat
                      energimu. Bebas dari label rumit—semua perubahan langsung
                      terlihat di kotak pratinjau bacaan di bawah!
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm shrink-0">
                    <button
                      className="px-space-md py-2.5 rounded-xl border border-control-border bg-surface hover:bg-canvas text-primary font-label text-label flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                      id="btn-reset-defaults"
                      type="button"
                      onClick={() =>
                        setValue({
                          ...value,
                          preferences: { ...defaultProfile.preferences },
                        })
                      }
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        restart_alt
                      </span>
                      <span>Kembalikan Default</span>
                    </button>
                    <button
                      className="px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label flex items-center gap-1.5 transition-all shadow-sm"
                      id="btn-save-settings"
                      type="button"
                      onClick={() => onSave(value)}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        aria-hidden="true"
                      >
                        bookmark_check
                      </span>
                      <span>Simpan Preferensi</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="max-w-[1200px] w-full mx-auto px-margin pb-20 ui-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  <aside className="lg:col-span-5 lg:sticky lg:top-[9rem] flex flex-col gap-space-md order-1 lg:order-2">
                    <div className="bg-surface rounded-2xl p-6 border border-divider">
                      <h2 className="font-bold text-xl ui-section-title">
                        Pratinjau Teks Nyata
                      </h2>
                      <div
                        className="mt-6 space-y-4"
                        data-reading-preview
                        style={previewStyle}
                      >
                        <h3 className="font-bold ui-card-title">
                          Belajar satu langkah dulu
                        </h3>
                        <p
                          className={
                            prefs.reading_ruler
                              ? "bg-mint-tint p-3 rounded-xl"
                              : ""
                          }
                        >
                          Setiap orang punya cara belajar yang nyaman. Kamu bisa
                          membaca pelan-pelan, mendengarkan penjelasan, atau
                          membagi bacaan menjadi langkah kecil.
                        </p>
                        <p>
                          Satu langkah kecil hari ini sudah berarti. Kamu bebas
                          menyesuaikan ritme belajar.
                        </p>
                      </div>
                      <button
                        onClick={speak}
                        className="bg-primary text-white px-5 py-3 rounded-xl mt-5"
                      >
                        Coba bacakan kalimat ini
                      </button>
                      <p role="status" className="text-sm mt-3">
                        {speechNotice}
                      </p>
                    </div>
                  </aside>

                  <div className="lg:col-span-7 flex flex-col gap-space-lg order-2 lg:order-1">
                    <section
                      aria-labelledby="section-typography"
                      className="bg-surface rounded-2xl p-space-lg border border-divider shadow-sm"
                    >
                      <div className="flex items-center gap-space-sm mb-space-md pb-space-xs border-b border-divider">
                        <div className="w-9 h-9 rounded-xl bg-mint-tint text-success flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[22px]"
                            aria-hidden="true"
                          >
                            format_size
                          </span>
                        </div>
                        <div>
                          <h2
                            className="font-section-title text-section-title text-primary ui-section-title"
                            id="section-typography"
                          >
                            1. Tampilan Teks &amp; Bacaan
                          </h2>
                          <p className="font-metadata text-metadata text-on-surface-variant">
                            Sesuaikan jenis huruf, ukuran, dan jarak baris agar
                            mata tidak cepat lelah.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-space-lg">
                        <div>
                          <label className="block font-label text-label text-primary mb-space-xs font-bold">
                            Jenis Huruf (Font)
                          </label>
                          <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs"
                            id="font-family-selector"
                          >
                            <button
                              className="font-option-btn p-3 rounded-xl border-2 border-primary bg-secondary-container/40 text-left flex items-start justify-between"
                              data-font="default"
                              type="button"
                              onClick={() => update("font_family", "jakarta")}
                              disabled={busy}
                              aria-pressed={prefs.font_family === "jakarta"}
                            >
                              <div>
                                <span className="font-bold text-primary block text-[15px]">
                                  Plus Jakarta Sans
                                </span>
                                <span className="text-xs font-metadata text-on-surface-variant">
                                  Standar jernih ramah mata (Default)
                                </span>
                              </div>
                              <span
                                className="material-symbols-outlined text-primary text-[18px] check-indicator"
                                aria-hidden="true"
                              >
                                check_circle
                              </span>
                            </button>
                            <button
                              className="font-option-btn p-3 rounded-xl border border-divider bg-surface hover:bg-surface-container-low text-left flex items-start justify-between"
                              data-font="lexend"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              <div>
                                <span className="font-bold text-primary block text-[15px] tracking-wide">
                                  Lexend / Dyslexic
                                </span>
                                <span className="text-xs font-metadata text-on-surface-variant">
                                  Bentuk huruf mudah dibedakan
                                </span>
                              </div>
                              <span
                                className="material-symbols-outlined text-transparent text-[18px] check-indicator"
                                aria-hidden="true"
                              >
                                check_circle
                              </span>
                            </button>
                            <button
                              className="font-option-btn p-3 rounded-xl border border-divider bg-surface hover:bg-surface-container-low text-left flex items-start justify-between"
                              data-font="nunito"
                              type="button"
                              onClick={() => update("font_family", "nunito")}
                              disabled={busy}
                              aria-pressed={prefs.font_family === "nunito"}
                            >
                              <div>
                                <span className="font-bold text-primary block text-[15px] font-nunito">
                                  Nunito (Bulat Lembut)
                                </span>
                                <span className="text-xs font-metadata text-on-surface-variant">
                                  Karakter ramah bersahabat
                                </span>
                              </div>
                              <span
                                className="material-symbols-outlined text-transparent text-[18px] check-indicator"
                                aria-hidden="true"
                              >
                                check_circle
                              </span>
                            </button>
                            <button
                              className="font-option-btn p-3 rounded-xl border border-divider bg-surface hover:bg-surface-container-low text-left flex items-start justify-between"
                              data-font="system"
                              type="button"
                              onClick={() => update("font_family", "system")}
                              disabled={busy}
                              aria-pressed={prefs.font_family === "system"}
                            >
                              <div>
                                <span className="font-bold text-primary block text-[15px] font-preview-system">
                                  Sistem Bersih (Monospace)
                                </span>
                                <span className="text-xs font-metadata text-on-surface-variant">
                                  Spasi teratur tanpa distraksi
                                </span>
                              </div>
                              <span
                                className="material-symbols-outlined text-transparent text-[18px] check-indicator"
                                aria-hidden="true"
                              >
                                check_circle
                              </span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-space-xs">
                            <label
                              className="font-label text-label text-primary font-bold"
                              htmlFor="font-size-slider"
                            >
                              Ukuran Huruf
                            </label>
                            <span
                              className="font-label text-label font-bold text-primary px-2.5 py-0.5 rounded-full bg-surface-container"
                              id="font-size-display"
                            >
                              18px (Sedang • Default)
                            </span>
                          </div>
                          <div className="flex items-center gap-space-md">
                            <button
                              aria-label="Kecilkan Huruf"
                              className="w-10 h-10 rounded-xl border border-divider bg-surface hover:bg-canvas text-primary font-bold flex items-center justify-center active:scale-95 transition-transform"
                              id="font-size-minus"
                              type="button"
                              onClick={() =>
                                update(
                                  "font_size",
                                  Math.max(14, prefs.font_size - 2),
                                )
                              }
                              disabled={busy}
                            >
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                remove
                              </span>
                            </button>
                            <input
                              aria-valuemax={26}
                              aria-valuemin={14}
                              aria-valuenow={prefs.font_size}
                              className="w-full accent-primary bg-surface-container h-2 rounded-lg cursor-pointer"
                              id="font-size-slider"
                              max="26"
                              min="14"
                              step="2"
                              type="range"
                              value={prefs.font_size}
                              onChange={(e) =>
                                update("font_size", Number(e.target.value))
                              }
                              aria-label="Ukuran huruf"
                            />
                            <button
                              aria-label="Besarkan Huruf"
                              className="w-10 h-10 rounded-xl border border-divider bg-surface hover:bg-canvas text-primary font-bold flex items-center justify-center active:scale-95 transition-transform"
                              id="font-size-plus"
                              type="button"
                              onClick={() =>
                                update(
                                  "font_size",
                                  Math.min(32, prefs.font_size + 2),
                                )
                              }
                              disabled={busy}
                            >
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                add
                              </span>
                            </button>
                          </div>
                          <div className="flex justify-between text-[11px] font-metadata text-outline mt-1 px-1">
                            <span>Kecil (14px)</span>
                            <span>Standar (18px)</span>
                            <span>Besar (22px)</span>
                            <span>Ekstra (26px)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                          <div>
                            <label className="block font-label text-label text-primary mb-space-xs font-bold">
                              Jarak Antar Baris (Line Height)
                            </label>
                            <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl">
                              <button
                                className="lh-btn flex-1 py-1.5 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-all"
                                data-lh="1.5"
                                type="button"
                                onClick={() => update("line_height", 1.5)}
                                disabled={busy}
                                aria-pressed={prefs.line_height === 1.5}
                              >
                                Santai 1.5x
                              </button>
                              <button
                                className="lh-btn flex-1 py-1.5 rounded-lg text-xs font-label bg-surface font-bold text-primary shadow-sm transition-all"
                                data-lh="1.8"
                                type="button"
                                onClick={() => update("line_height", 1.8)}
                                disabled={busy}
                                aria-pressed={prefs.line_height === 1.8}
                              >
                                Lapang 1.8x
                              </button>
                              <button
                                className="lh-btn flex-1 py-1.5 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-all"
                                data-lh="2.1"
                                type="button"
                                onClick={() => update("line_height", 2.1)}
                                disabled={busy}
                                aria-pressed={prefs.line_height === 2.1}
                              >
                                Ekstra 2.1x
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block font-label text-label text-primary mb-space-xs font-bold">
                              Spasi Antar Huruf (Tracking)
                            </label>
                            <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl">
                              <button
                                className="ls-btn flex-1 py-1.5 rounded-lg text-xs font-label bg-surface font-bold text-primary shadow-sm transition-all"
                                data-ls="0em"
                                type="button"
                                onClick={() => update("letter_spacing", 0)}
                                disabled={busy}
                                aria-pressed={prefs.letter_spacing === 0}
                              >
                                Normal
                              </button>
                              <button
                                className="ls-btn flex-1 py-1.5 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-all"
                                data-ls="0.06em"
                                type="button"
                                onClick={() => update("letter_spacing", 0.06)}
                                disabled={busy}
                                aria-pressed={prefs.letter_spacing === 0.06}
                              >
                                +0.06 Renggang
                              </button>
                              <button
                                className="ls-btn flex-1 py-1.5 rounded-lg text-xs font-label text-on-surface-variant hover:text-primary transition-all"
                                data-ls="0.12em"
                                type="button"
                                onClick={() => update("letter_spacing", 0.12)}
                                disabled={busy}
                                aria-pressed={prefs.letter_spacing === 0.12}
                              >
                                +0.12 Ekstra
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-label text-label text-primary mb-space-xs font-bold">
                            Lebar Kolom Paragraf
                          </label>
                          <div className="grid grid-cols-3 gap-space-xs">
                            <button
                              className="cw-btn p-2.5 rounded-xl border border-divider text-center hover:bg-canvas transition-colors"
                              data-width="48ch"
                              type="button"
                              onClick={() => update("reading_width", 50)}
                              disabled={busy}
                              aria-pressed={prefs.reading_width === 50}
                            >
                              <span className="block text-xs font-bold text-primary">
                                Sempit (~50 char)
                              </span>
                              <span className="text-[11px] text-outline font-metadata">
                                Fokus Tinggi
                              </span>
                            </button>
                            <button
                              className="cw-btn p-2.5 rounded-xl border-2 border-primary bg-secondary-container/30 text-center transition-colors"
                              data-width="65ch"
                              type="button"
                              onClick={() => update("reading_width", 65)}
                              disabled={busy}
                              aria-pressed={prefs.reading_width === 65}
                            >
                              <span className="block text-xs font-bold text-primary">
                                Sedang (~65 char)
                              </span>
                              <span className="text-[11px] text-outline font-metadata">
                                Rekomendasi Nyaman
                              </span>
                            </button>
                            <button
                              className="cw-btn p-2.5 rounded-xl border border-divider text-center hover:bg-canvas transition-colors"
                              data-width="100%"
                              type="button"
                              onClick={() => update("reading_width", 80)}
                              disabled={busy}
                              aria-pressed={prefs.reading_width === 80}
                            >
                              <span className="block text-xs font-bold text-primary">
                                Lebar Penuh
                              </span>
                              <span className="text-[11px] text-outline font-metadata">
                                Layar Penuh
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      aria-labelledby="section-contrast"
                      className="bg-surface rounded-2xl p-space-lg border border-divider shadow-sm"
                    >
                      <div className="flex items-center gap-space-sm mb-space-md pb-space-xs border-b border-divider">
                        <div className="w-9 h-9 rounded-xl bg-butter-tint text-warning flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[22px]"
                            aria-hidden="true"
                          >
                            contrast
                          </span>
                        </div>
                        <div>
                          <h2
                            className="font-section-title text-section-title text-primary ui-section-title"
                            id="section-contrast"
                          >
                            2. Kontras &amp; Tema Visual Kanvas
                          </h2>
                          <p className="font-metadata text-metadata text-on-surface-variant">
                            Pilih palet kanvas yang paling ramah untuk kondisi
                            pencahayaan dan kelelahan visualmu.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-space-md">
                        <div
                          className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs"
                          id="theme-selector"
                        >
                          <button
                            className="theme-card-btn p-3 rounded-xl border-2 border-primary bg-canvas text-left flex flex-col justify-between h-28 relative"
                            data-theme="cream"
                            type="button"
                            onClick={() => update("high_contrast", false)}
                            disabled={busy}
                            aria-pressed={prefs.high_contrast === false}
                          >
                            <span className="w-5 h-5 rounded-full bg-[#112520] border border-white"></span>
                            <div>
                              <span className="text-xs font-bold text-primary block">
                                Krem Hangat
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                Default TemanBelajar
                              </span>
                            </div>
                            <span
                              className="material-symbols-outlined text-primary text-[16px] absolute top-2 right-2 check-indicator"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </button>

                          <button
                            className="theme-card-btn p-3 rounded-xl border border-divider bg-surface text-left flex flex-col justify-between h-28 relative hover:border-secondary"
                            data-theme="white"
                            type="button"
                            disabled={true}
                            title="Fitur ini belum tersedia di layanan saat ini."
                          >
                            <span className="w-5 h-5 rounded-full bg-white border border-gray-400"></span>
                            <div>
                              <span className="text-xs font-bold text-primary block">
                                Putih Bersih
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                Kontras Tajam Terang
                              </span>
                            </div>
                            <span
                              className="material-symbols-outlined text-transparent text-[16px] absolute top-2 right-2 check-indicator"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </button>

                          <button
                            className="theme-card-btn p-3 rounded-xl border border-divider bg-[#101A16] text-left flex flex-col justify-between h-28 relative hover:border-secondary"
                            data-theme="high-contrast"
                            type="button"
                            onClick={() => update("high_contrast", true)}
                            disabled={busy}
                            aria-pressed={prefs.high_contrast === true}
                          >
                            <span className="w-5 h-5 rounded-full bg-[#FFE7A3] border border-black"></span>
                            <div>
                              <span className="text-xs font-bold text-[#FFE7A3] block">
                                Kontras Tinggi
                              </span>
                              <span className="text-[10px] text-gray-400">
                                Kuning di atas Hitam
                              </span>
                            </div>
                            <span
                              className="material-symbols-outlined text-transparent text-[16px] absolute top-2 right-2 check-indicator"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </button>

                          <button
                            className="theme-card-btn p-3 rounded-xl border border-divider bg-[#273B35] text-left flex flex-col justify-between h-28 relative hover:border-secondary"
                            data-theme="dimmed"
                            type="button"
                            disabled={true}
                            title="Fitur ini belum tersedia di layanan saat ini."
                          >
                            <span className="w-5 h-5 rounded-full bg-[#EAF7ED]"></span>
                            <div>
                              <span className="text-xs font-bold text-[#EAF7ED] block">
                                Redup Malam
                              </span>
                              <span className="text-[10px] text-gray-300">
                                Nuansa Hijau Teduh
                              </span>
                            </div>
                            <span
                              className="material-symbols-outlined text-transparent text-[16px] absolute top-2 right-2 check-indicator"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/60 border border-divider">
                          <div className="flex items-start gap-space-xs max-w-md">
                            <span
                              className="material-symbols-outlined text-secondary text-[20px] mt-0.5"
                              aria-hidden="true"
                            >
                              filter_vintage
                            </span>
                            <div>
                              <p className="font-label text-label font-bold text-primary">
                                Filter Pelindung Silau (Anti-Glare Tint)
                              </p>
                              <p className="text-xs font-metadata text-on-surface-variant">
                                Menambahkan lapisan pastel sangat halus untuk
                                memotong pancaran cahaya biru langsung.
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              id="toggle-tint"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </section>

                    <section
                      aria-labelledby="section-reading-tools"
                      className="bg-surface rounded-2xl p-space-lg border border-divider shadow-sm"
                    >
                      <div className="flex items-center gap-space-sm mb-space-md pb-space-xs border-b border-divider">
                        <div className="w-9 h-9 rounded-xl bg-lavender-tint text-tertiary-container flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[22px]"
                            aria-hidden="true"
                          >
                            auto_stories
                          </span>
                        </div>
                        <div>
                          <h2
                            className="font-section-title text-section-title text-primary ui-section-title"
                            id="section-reading-tools"
                          >
                            3. Alat Bantu Membaca &amp; Sensorik
                          </h2>
                          <p className="font-metadata text-metadata text-on-surface-variant">
                            Fitur interaktif pemandu pandangan agar baris teks
                            tidak melompat.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-space-md">
                        <div className="p-3.5 rounded-xl border border-divider bg-surface space-y-space-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-label text-label font-bold text-primary flex items-center gap-1.5">
                                <span>
                                  Penggaris Fokus Baris (Reading Ruler)
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-mint-tint text-success font-bold">
                                  Aktif
                                </span>
                              </p>
                              <p className="text-xs font-metadata text-on-surface-variant">
                                Sorot baris yang sedang ditunjuk kursor mouse
                                atau sentuhan jarimu.
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input
                                className="sr-only peer"
                                id="toggle-ruler"
                                type="checkbox"
                                checked={prefs.reading_ruler}
                                onChange={(e) =>
                                  update("reading_ruler", e.target.checked)
                                }
                                aria-label="Penggaris baca"
                              />
                              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div className="pt-2 border-t border-divider/60 flex flex-wrap items-center justify-between gap-space-sm text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-metadata text-on-surface-variant">
                                Warna Penggaris:
                              </span>
                              <div
                                className="flex items-center gap-1.5"
                                id="ruler-color-options"
                              >
                                <button
                                  className="w-6 h-6 rounded-full bg-secondary-container border-2 border-primary"
                                  data-ruler-color="mint"
                                  title="Fitur ini belum tersedia di layanan saat ini."
                                  type="button"
                                  disabled={true}
                                ></button>
                                <button
                                  className="w-6 h-6 rounded-full bg-butter border border-divider"
                                  data-ruler-color="butter"
                                  title="Fitur ini belum tersedia di layanan saat ini."
                                  type="button"
                                  disabled={true}
                                ></button>
                                <button
                                  className="w-6 h-6 rounded-full bg-lavender border border-divider"
                                  data-ruler-color="lavender"
                                  title="Fitur ini belum tersedia di layanan saat ini."
                                  type="button"
                                  disabled={true}
                                ></button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-metadata text-on-surface-variant">
                                Lebar Panduan:
                              </span>
                              <select
                                className="text-xs bg-surface-container rounded-lg border-0 py-1 px-2 font-label text-primary"
                                disabled={true}
                                title="Suara memakai pilihan bawaan browser."
                              >
                                <option value="1">1 Baris Fokus</option>
                                <option value="3">
                                  3 Baris (Paragraf Mini)
                                </option>
                                <option value="window">
                                  Jendela Baca Penuh
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div>
                            <p className="font-label text-label font-bold text-primary">
                              Sorot Kalimat Aktif saat Disentuh
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Mewarnai kalimat yang sedang diklik agar mudah
                              kembali setelah jeda berpikir.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              checked={prefs.reading_ruler}
                              onChange={(e) =>
                                update("reading_ruler", e.target.checked)
                              }
                              aria-label="Penggaris baca"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div>
                            <p className="font-label text-label font-bold text-primary">
                              Glosarium Otomatis Kata Sulit
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Beri garis titik-titik lembut pada istilah ilmiah
                              materi (seperti <em>glomerulus</em>) untuk
                              penjelasan instan tanpa membuka tab baru.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div>
                            <p className="font-label text-label font-bold text-primary">
                              Kamus Ilustrasi &amp; Sketsa Konsep
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Sertakan diagram sederhana ketika menyentuh
                              istilah konsep yang rumit.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </section>

                    <section
                      aria-labelledby="section-audio"
                      className="bg-surface rounded-2xl p-space-lg border border-divider shadow-sm"
                    >
                      <div className="flex items-center gap-space-sm mb-space-md pb-space-xs border-b border-divider">
                        <div className="w-9 h-9 rounded-xl bg-peach-tint text-primary flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[22px]"
                            aria-hidden="true"
                          >
                            record_voice_over
                          </span>
                        </div>
                        <div>
                          <h2
                            className="font-section-title text-section-title text-primary ui-section-title"
                            id="section-audio"
                          >
                            4. Audio &amp; Baca Nyaring (Text-to-Speech)
                          </h2>
                          <p className="font-metadata text-metadata text-on-surface-variant">
                            Dengarkan materi dengan intonasi ramah bahasa
                            Indonesia.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-space-md">
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/60 border border-divider">
                          <div>
                            <p className="font-label text-label font-bold text-primary">
                              Aktifkan Tombol Bacakan Teks (TTS)
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Tampilkan tombol mikro-suara di samping paragraf
                              dan butir soal latihan.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              id="toggle-tts-master"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                          <div>
                            <label className="block font-label text-label text-primary mb-space-xs font-bold">
                              Pilihan Karakter Suara
                            </label>
                            <select
                              className="w-full bg-surface border border-control-border rounded-xl py-2 px-3 text-xs font-label text-primary focus:ring-2 focus:ring-primary"
                              disabled={true}
                              title="Suara memakai pilihan bawaan browser."
                            >
                              <option>
                                Suara Ramah Mimo (Nada Ceria &amp; Kalem)
                              </option>
                              <option>
                                Suara Guru Pendamping (Artikulasi Lambat)
                              </option>
                              <option>Suara Netral Alami</option>
                            </select>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-space-xs">
                              <label className="font-label text-label text-primary font-bold">
                                Kecepatan Bicara
                              </label>
                              <span
                                className="text-xs font-bold text-primary"
                                id="speed-indicator"
                              >
                                1.0x (Normal)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="speed-btn flex-1 py-1.5 rounded-lg text-xs font-label bg-surface border border-divider hover:bg-canvas"
                                data-speed="0.8"
                                type="button"
                                onClick={() => update("speech_rate", 0.8)}
                                disabled={busy}
                                aria-pressed={prefs.speech_rate === 0.8}
                              >
                                0.8x Tenang
                              </button>
                              <button
                                className="speed-btn flex-1 py-1.5 rounded-lg text-xs font-label bg-primary text-on-primary font-bold"
                                data-speed="1.0"
                                type="button"
                                onClick={() => update("speech_rate", 1.0)}
                                disabled={busy}
                                aria-pressed={prefs.speech_rate === 1.0}
                              >
                                1.0x Normal
                              </button>
                              <button
                                className="speed-btn flex-1 py-1.5 rounded-lg text-xs font-label bg-surface border border-divider hover:bg-canvas"
                                data-speed="1.2"
                                type="button"
                                onClick={() => update("speech_rate", 1.2)}
                                disabled={busy}
                                aria-pressed={prefs.speech_rate === 1.2}
                              >
                                1.2x Cepat
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="flex items-center gap-space-xs cursor-pointer text-xs font-metadata text-primary">
                            <input
                              className="w-4 h-4 rounded text-primary border-control-border focus:ring-primary"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <span>
                              Otomatis sorot kata yang sedang diucapkan narator
                              suara (Karaoke Tracking)
                            </span>
                          </label>
                          <label className="flex items-center gap-space-xs cursor-pointer text-xs font-metadata text-primary">
                            <input
                              className="w-4 h-4 rounded text-primary border-control-border focus:ring-primary"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <span>
                              Beri jeda napas 1.5 detik lebih panjang di setiap
                              akhir tanda titik (.)
                            </span>
                          </label>
                        </div>
                      </div>
                    </section>

                    <section
                      aria-labelledby="section-motion"
                      className="bg-surface rounded-2xl p-space-lg border border-divider shadow-sm"
                    >
                      <div className="flex items-center gap-space-sm mb-space-md pb-space-xs border-b border-divider">
                        <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[22px]"
                            aria-hidden="true"
                          >
                            motion_photos_off
                          </span>
                        </div>
                        <div>
                          <h2
                            className="font-section-title text-section-title text-primary ui-section-title"
                            id="section-motion"
                          >
                            5. Fokus, Gerak, &amp; Keterangan (Captions)
                          </h2>
                          <p className="font-metadata text-metadata text-on-surface-variant">
                            Kontrol responsif untuk kenyamanan vestibular dan
                            konsentrasi tanpa distraksi.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-space-sm">
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div className="max-w-md">
                            <p className="font-label text-label font-bold text-primary">
                              Kurangi Efek Gerakan (Reduced Motion)
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Matikan animasi geser dan goyangan mascot. Ganti
                              seluruh transisi dengan transisi memudar instan.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              checked={prefs.reduced_motion}
                              onChange={(e) =>
                                update("reduced_motion", e.target.checked)
                              }
                              aria-label="Kurangi gerakan"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div className="max-w-md">
                            <p className="font-label text-label font-bold text-primary">
                              Perisai Fokus Belajar (Focus Shield Mode)
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Sembunyikan bilah samping dan lencana progres saat
                              kamu mulai membaca materi atau kuis.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              checked={prefs.mode === "focus"}
                              onChange={(e) =>
                                update(
                                  "mode",
                                  e.target.checked ? "focus" : "reading",
                                )
                              }
                              aria-label="Mode fokus"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-divider bg-surface">
                          <div className="max-w-md">
                            <p className="font-label text-label font-bold text-primary">
                              Transkrip Teks Otomatis pada Semua Media
                            </p>
                            <p className="text-xs font-metadata text-on-surface-variant">
                              Selalu lampirkan teks tertulis di bawah diagram
                              audio maupun ilustrasi bersuara.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              checked={prefs.captions}
                              onChange={(e) =>
                                update("captions", e.target.checked)
                              }
                              aria-label="Tampilkan transkrip"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="w-full bg-surface border-t border-divider py-space-sm shadow-md mt-auto">
                <div className="max-w-[1200px] mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm ui-container">
                  <div className="flex items-center gap-space-xs text-xs font-metadata text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <span>
                      Pratinjau mengikuti pilihanmu. Simpan untuk menerapkannya
                      pada materi belajar lainnya.
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                    <a
                      className="px-space-md py-2 rounded-xl text-primary hover:bg-canvas font-label text-label text-xs transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Batal
                    </a>
                    <button
                      className="px-space-lg py-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      id="btn-bottom-save"
                      type="button"
                      onClick={() => onSave(value)}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        check
                      </span>
                      <span>Terapkan preferensi</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="fixed bottom-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg border border-primary-hover flex items-center gap-2 transform translate-y-20 opacity-0 pointer-events-none transition-all duration-300"
                id="save-toast"
              >
                <span
                  className="material-symbols-outlined text-secondary-fixed text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  task_alt
                </span>
                <span className="font-label text-xs">
                  Pengaturan aksesibilitas berhasil diperbarui!
                </span>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 pb-8 ui-container">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={prefs.timer_enabled}
                  onChange={(e) => update("timer_enabled", e.target.checked)}
                />
                Tampilkan waktu belajar
              </label>
              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  checked={prefs.show_mimo}
                  onChange={(e) => update("show_mimo", e.target.checked)}
                />
                Tampilkan Mimo
              </label>
            </div>
          </div>
        ) : (
          <div className="final-design final-screen-24 w-full bg-canvas flex-1 screen-page">
            <div className="flex flex-col w-full">
              <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin py-space-lg space-y-space-xl ui-container">
                <section
                  aria-label="Konteks Pengaturan"
                  className="space-y-space-sm"
                >
                  <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant flex-wrap"
                  >
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Beranda
                    </a>
                    <span className="text-outline-variant">/</span>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Pengaturan
                    </a>
                    <span className="text-outline-variant">/</span>
                    <span
                      aria-current="page"
                      className="text-primary font-bold"
                    >
                      Profil &amp; Preferensi Belajar
                    </span>
                  </nav>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs">
                    <div className="space-y-1 max-w-3xl">
                      <h1 className="font-display font-extrabold text-display-mobile md:text-page-title text-primary tracking-tight ui-page-title">
                        Profil &amp; Preferensi Belajar
                      </h1>
                      <p className="font-reading text-reading text-on-surface-variant leading-relaxed">
                        Kelola profilmu, atur komitmen waktu harian tanpa rasa
                        terbebani, serta kendalikan data belajarmu dengan aman
                        dan transparan.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-mint-tint rounded-full border border-secondary/20 self-start lg:self-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-success text-[18px]"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      <span className="text-label font-label text-success font-semibold text-[13px]">
                        Simpan untuk menerapkan perubahan
                      </span>
                    </div>
                  </div>

                  <div className="pt-space-sm border-b border-divider">
                    <div
                      aria-label="Sub-kategori Pengaturan"
                      className="flex items-center gap-space-xs overflow-x-auto pb-1"
                      role="navigation"
                    >
                      <button
                        aria-current="location"
                        className="px-space-md py-space-sm rounded-lg bg-secondary-container text-on-secondary-fixed font-label text-label font-bold whitespace-nowrap shadow-sm flex items-center gap-1.5"

                        type="button"
                        onClick={() =>
                          document
                            .getElementById("profil-preferensi")
                            ?.scrollIntoView({ block: "start" })
                        }
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          badge
                        </span>
                        Profil &amp; Akun
                      </button>
                      <a
                        className="px-space-md py-space-sm rounded-lg text-on-surface-variant font-label text-label hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap flex items-center gap-space-xs"
                        href="#"

                        onClick={(e) => {
                          e.preventDefault();
                          (() => setTab("accessibility"))();
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          accessibility_new
                        </span>
                        Aksesibilitas &amp; Kenyamanan
                        <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-lavender-tint text-primary border border-lavender/40">
                          Target WCAG 2.2 AA
                        </span>
                      </a>
                      <a
                        className="px-space-md py-space-sm rounded-lg text-on-surface-variant font-label text-label hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap flex items-center gap-1.5"
                        href="#"

                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("rencana-preferensi")
                            ?.scrollIntoView({ block: "start" });
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          event_repeat
                        </span>
                        Rencana &amp; Jadwal
                      </a>
                      <a
                        className="px-space-md py-space-sm rounded-lg text-on-surface-variant font-label text-label hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap flex items-center gap-1.5"
                        href="#"

                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("privasi-preferensi")
                            ?.scrollIntoView({ block: "start" });
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          verified_user
                        </span>
                        Privasi &amp; Keamanan Data
                      </a>
                    </div>
                  </div>
                </section>

                <section
                  id="profil-preferensi"
                  className="bg-surface rounded-2xl border border-divider p-space-md md:p-space-lg relative overflow-hidden shadow-sm"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-6 flex items-start gap-space-md">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary-container flex items-center justify-center text-primary font-display font-black text-3xl shadow-sm border border-secondary/30">
                          CM
                        </div>
                        <span className="absolute -bottom-1 -right-1 p-1 bg-surface rounded-full shadow-sm">
                          <span
                            className="material-symbols-outlined text-success text-[18px] block"
                            aria-hidden="true"
                          >
                            verified
                          </span>
                        </span>
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-label font-bold px-2 py-0.5 rounded-full bg-butter-tint text-on-surface border border-butter/40">
                            Siswa Pelajar SMP & SMA
                          </span>
                          <span className="text-[12px] font-label font-bold px-2 py-0.5 rounded-full bg-mint-tint text-success border border-secondary/30">
                            Akun Pelajar Terverifikasi
                          </span>
                        </div>
                        <h2 className="font-section-title text-section-title text-primary font-bold tracking-tight truncate ui-section-title">
                          {value.display_name}
                        </h2>
                        <p className="font-metadata text-metadata text-on-surface-variant flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[16px] text-outline"
                            aria-hidden="true"
                          >
                            alternate_email
                          </span>
                          cece.manda@sekolah.id
                        </p>
                        <div className="pt-1 flex items-center gap-1.5">
                          <span className="text-[12px] font-metadata text-on-surface-variant">
                            Minat saat ini:
                          </span>
                          <span className="text-[12px] font-label font-semibold px-2 py-0.5 rounded-md bg-lavender-tint text-primary">
                            🔬 Sains &amp; Biologi Explorer
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-space-md bg-surface-container-low/70 rounded-xl p-space-md border border-divider">
                      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center">
                        <Image
                          alt=""
                          className="w-full h-full object-contain select-none pointer-events-none object-contain"
                          src="/design/mimo-final.png"
                          width={1408}
                          height={1120}
                        ></Image>
                      </div>

                      <div className="bg-surface rounded-xl p-space-sm md:p-space-md border border-divider relative shadow-sm">
                        <div className="flex items-center gap-1 text-[12px] font-label font-bold text-secondary mb-1">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            aria-hidden="true"
                          >
                            chat_bubble
                          </span>
                          Pesan Hangat dari Mimo
                        </div>
                        <p className="font-mimo-voice text-[14px] md:text-mimo-voice text-primary leading-snug">
                          {value.display_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                  <div className="lg:col-span-7 space-y-space-lg">
                    <section
                      aria-labelledby="heading-data-diri"
                      className="bg-surface rounded-2xl border border-divider p-space-md md:p-space-lg space-y-space-md shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-divider pb-space-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-mint-tint text-success flex items-center justify-center font-bold font-label">
                            1
                          </span>
                          <div>
                            <h3
                              className="font-section-title text-card-title text-primary font-bold ui-card-title"
                              id="heading-data-diri"
                            >
                              Data Diri &amp; Jenjang Sekolah
                            </h3>
                            <p className="font-metadata text-metadata text-on-surface-variant">
                              Menentukan kurikulum dasar dan tingkat kedalaman
                              materi.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-label text-success font-semibold px-2 py-1 bg-mint-tint rounded-md hidden sm:inline-block">
                          Kurikulum Merdeka 2024
                        </span>
                      </div>
                      <form className="space-y-space-md">
                        <div className="space-y-1.5">
                          <label
                            className="block font-label text-label text-primary font-bold"
                            htmlFor="nama-panggilan"
                          >
                            Nama Panggilan di Aplikasi
                          </label>
                          <input
                            aria-describedby="nama-hint"
                            className="w-full h-11 px-space-md rounded-xl border border-control-border bg-surface text-primary font-body text-body focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-tertiary transition-all"
                            id="nama-panggilan"
                            type="text"
                            value={value.display_name}
                            onChange={(e) =>
                              setValue({
                                ...value,
                                display_name: e.target.value,
                              })
                            }
                            maxLength={80}
                            required={true}
                          />
                          <p
                            className="font-metadata text-metadata text-on-surface-variant text-[13px]"
                            id="nama-hint"
                          >
                            Nama ini yang akan dipanggil oleh Mimo saat
                            mendampingi sesi belajar.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block font-label text-label text-primary font-bold">
                            Tingkat Kelas Saat Ini
                          </label>
                          <div
                            aria-label="Jenjang Kelas"
                            className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                            role="radiogroup"
                          >
                            <button
                              aria-checked="false"
                              className="h-10 rounded-xl border border-divider bg-surface text-on-surface-variant font-label text-label hover:bg-surface-container transition-all"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMP 7
                            </button>
                            <button
                              aria-checked="true"
                              className="h-10 rounded-xl border-2 border-primary bg-secondary-container text-primary font-label text-label font-bold shadow-sm"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMP 8
                            </button>
                            <button
                              aria-checked="false"
                              className="h-10 rounded-xl border border-divider bg-surface text-on-surface-variant font-label text-label hover:bg-surface-container transition-all"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMP 9
                            </button>
                            <button
                              aria-checked="false"
                              className="h-10 rounded-xl border border-divider bg-surface text-on-surface-variant font-label text-label hover:bg-surface-container transition-all"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMA 10
                            </button>
                            <button
                              aria-checked="false"
                              className="h-10 rounded-xl border border-divider bg-surface text-on-surface-variant font-label text-label hover:bg-surface-container transition-all"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMA 11
                            </button>
                            <button
                              aria-checked="false"
                              className="h-10 rounded-xl border border-divider bg-surface text-on-surface-variant font-label text-label hover:bg-surface-container transition-all"
                              role="radio"
                              type="button"
                              disabled={true}
                              title="Fitur ini belum tersedia di layanan saat ini."
                            >
                              SMA 12
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block font-label text-label text-primary font-bold">
                              Mata Pelajaran Fokus Utama (Bisa Pilih Lebih dari
                              1)
                            </label>
                            <span className="text-[12px] font-metadata text-on-surface-variant">
                              2 dipilih
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              aria-pressed={value.subjects.includes(
                                "IPA / Biologi",
                              )}
                              className="h-9 px-space-md rounded-full bg-secondary-container border border-primary text-primary font-label text-label font-bold flex items-center gap-1.5 transition-all"
                              type="button"
                              onClick={() =>
                                setValue({
                                  ...value,
                                  subjects: value.subjects.includes(
                                    "IPA / Biologi",
                                  )
                                    ? value.subjects.filter(
                                        (s) => s !== "IPA / Biologi",
                                      )
                                    : [...value.subjects, "IPA / Biologi"],
                                })
                              }
                              disabled={busy}
                            >
                              <span
                                className="material-symbols-outlined text-[16px]"
                                aria-hidden="true"
                              >
                                check
                              </span>
                              IPA / Biologi
                            </button>

                            <button
                              aria-pressed={value.subjects.includes(
                                "Matematika",
                              )}
                              className="h-9 px-space-md rounded-full bg-lavender-tint border border-primary text-primary font-label text-label font-bold flex items-center gap-1.5 transition-all"
                              type="button"
                              onClick={() =>
                                setValue({
                                  ...value,
                                  subjects: value.subjects.includes(
                                    "Matematika",
                                  )
                                    ? value.subjects.filter(
                                        (s) => s !== "Matematika",
                                      )
                                    : [...value.subjects, "Matematika"],
                                })
                              }
                              disabled={busy}
                            >
                              <span
                                className="material-symbols-outlined text-[16px]"
                                aria-hidden="true"
                              >
                                check
                              </span>
                              Matematika
                            </button>

                            <button
                              aria-pressed={value.subjects.includes(
                                "Bahasa Indonesia",
                              )}
                              className="h-9 px-space-md rounded-full bg-surface border border-divider text-on-surface-variant hover:bg-surface-container font-label text-label transition-all"
                              type="button"
                              onClick={() =>
                                setValue({
                                  ...value,
                                  subjects: value.subjects.includes(
                                    "Bahasa Indonesia",
                                  )
                                    ? value.subjects.filter(
                                        (s) => s !== "Bahasa Indonesia",
                                      )
                                    : [...value.subjects, "Bahasa Indonesia"],
                                })
                              }
                              disabled={busy}
                            >
                              Bahasa Indonesia
                            </button>
                            <button
                              aria-pressed={value.subjects.includes(
                                "Bahasa Inggris",
                              )}
                              className="h-9 px-space-md rounded-full bg-surface border border-divider text-on-surface-variant hover:bg-surface-container font-label text-label transition-all"
                              type="button"
                              onClick={() =>
                                setValue({
                                  ...value,
                                  subjects: value.subjects.includes(
                                    "Bahasa Inggris",
                                  )
                                    ? value.subjects.filter(
                                        (s) => s !== "Bahasa Inggris",
                                      )
                                    : [...value.subjects, "Bahasa Inggris"],
                                })
                              }
                              disabled={busy}
                            >
                              Bahasa Inggris
                            </button>
                            <button
                              aria-pressed={value.subjects.includes(
                                "IPS Terpadu",
                              )}
                              className="h-9 px-space-md rounded-full bg-surface border border-divider text-on-surface-variant hover:bg-surface-container font-label text-label transition-all"
                              type="button"
                              onClick={() =>
                                setValue({
                                  ...value,
                                  subjects: value.subjects.includes(
                                    "IPS Terpadu",
                                  )
                                    ? value.subjects.filter(
                                        (s) => s !== "IPS Terpadu",
                                      )
                                    : [...value.subjects, "IPS Terpadu"],
                                })
                              }
                              disabled={busy}
                            >
                              IPS Terpadu
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="block font-label text-label text-primary font-bold">
                            Gaya Tutur Kata Mimo
                          </label>
                          <div
                            aria-label="Gaya Komunikasi Mimo"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm"
                            role="radiogroup"
                          >
                            <label className="flex items-start gap-3 p-space-sm rounded-xl border-2 border-primary bg-mint-tint/60 cursor-pointer transition-all">
                              <input
                                className="mt-1 text-primary focus:ring-tertiary w-4 h-4"
                                name="mimo-style"
                                type="radio"
                                disabled={true}
                                checked={false}
                                title="Belum tersedia."
                              />
                              <div>
                                <span className="font-label text-label text-primary font-bold block">
                                  Santai &amp; Bersahabat
                                </span>
                                <span className="font-metadata text-metadata text-on-surface-variant text-[13px] block">
                                  Penuh perumpamaan analogi sehari-hari dan kata
                                  penyemangat lembut (Cocok untuk rileks).
                                </span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-space-sm rounded-xl border border-divider bg-surface hover:bg-surface-container cursor-pointer transition-all">
                              <input
                                className="mt-1 text-primary focus:ring-tertiary w-4 h-4"
                                name="mimo-style"
                                type="radio"
                                disabled={true}
                                checked={false}
                                title="Belum tersedia."
                              />
                              <div>
                                <span className="font-label text-label text-primary font-bold block">
                                  Langsung ke Inti (To the Point)
                                </span>
                                <span className="font-metadata text-metadata text-on-surface-variant text-[13px] block">
                                  Ringkas, cepat, langsung ke poin kunci materi
                                  tanpa basa-basi pengantar.
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="pt-space-sm flex items-center justify-end">
                          <button
                            className="h-11 px-space-lg rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold flex items-center gap-2 transition-colors"
                            type="button"
                            onClick={() => onSave(value)}
                            disabled={busy}
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              save
                            </span>
                            Simpan Perubahan Profil
                          </button>
                        </div>
                      </form>
                    </section>

                    <section
                      id="rencana-preferensi"
                      aria-labelledby="heading-target-waktu"
                      className="bg-surface rounded-2xl border border-divider p-space-md md:p-space-lg space-y-space-md shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-divider pb-space-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-butter-tint text-warning flex items-center justify-center font-bold font-label">
                            2
                          </span>
                          <div>
                            <h3
                              className="font-section-title text-card-title text-primary font-bold ui-card-title"
                              id="heading-target-waktu"
                            >
                              Target &amp; Komitmen Waktu Belajar
                            </h3>
                            <p className="font-metadata text-metadata text-on-surface-variant">
                              Terhubung langsung ke Algoritma Rencana Belajar
                              adaptif.
                            </p>
                          </div>
                        </div>
                        <span
                          className="material-symbols-outlined text-outline"
                          aria-hidden="true"
                        >
                          tune
                        </span>
                      </div>

                      <div className="p-space-sm md:p-space-md rounded-xl bg-surface-container-low border border-divider flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          info
                        </span>
                        <p className="font-metadata text-metadata text-on-surface leading-relaxed text-[13px]">
                          <strong>Keterangan Transparan:</strong> Jika kamu
                          mengubah target durasi harian, sistem akan otomatis
                          menyesuaikan susunan di{" "}
                          <em>Rencana Belajar (Layar 20 &amp; 21)</em> tanpa
                          menghapus progres yang sudah kamu capai.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block font-label text-label text-primary font-bold">
                          Target Waktu Belajar Harian
                        </label>
                        <div
                          aria-label="Preset Durasi Belajar"
                          className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm"
                          role="radiogroup"
                        >
                          <div className="p-space-sm rounded-xl border border-divider hover:border-control-border bg-surface cursor-pointer transition-all flex items-center justify-between">
                            <div>
                              <p className="font-label text-label font-bold text-primary">
                                15 Menit / Hari
                              </p>
                              <p className="font-metadata text-metadata text-on-surface-variant text-[12px]">
                                Santai &amp; Ringan (1 Micro-lesson)
                              </p>
                            </div>
                            <input
                              className="text-primary focus:ring-tertiary"
                              name="waktu-harian"
                              type="radio"
                              checked={value.daily_minutes === 15}
                              onChange={() =>
                                setValue({ ...value, daily_minutes: 15 })
                              }
                            />
                          </div>

                          <div className="p-space-sm rounded-xl border-2 border-primary bg-secondary-container/50 cursor-pointer shadow-sm transition-all flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-label text-label font-bold text-primary">
                                  25 Menit / Hari
                                </p>
                                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-primary text-on-primary">
                                  Rekomendasi
                                </span>
                              </div>
                              <p className="font-metadata text-metadata text-on-surface-variant text-[12px]">
                                Ritme Nyaman Pomodoro (2 Sesi Belajar)
                              </p>
                            </div>
                            <input
                              className="text-primary focus:ring-tertiary"
                              name="waktu-harian"
                              type="radio"
                              checked={value.daily_minutes === 25}
                              onChange={() =>
                                setValue({ ...value, daily_minutes: 25 })
                              }
                            />
                          </div>

                          <div className="p-space-sm rounded-xl border border-divider hover:border-control-border bg-surface cursor-pointer transition-all flex items-center justify-between">
                            <div>
                              <p className="font-label text-label font-bold text-primary">
                                40 Menit / Hari
                              </p>
                              <p className="font-metadata text-metadata text-on-surface-variant text-[12px]">
                                Fokus Mendalam &amp; Latihan Soal PAS
                              </p>
                            </div>
                            <input
                              className="text-primary focus:ring-tertiary"
                              name="waktu-harian"
                              type="radio"
                              disabled={true}
                              checked={false}
                              title="Belum tersedia."
                            />
                          </div>

                          <div className="p-space-sm rounded-xl border border-divider hover:border-control-border bg-surface cursor-pointer transition-all flex items-center justify-between">
                            <div>
                              <p className="font-label text-label font-bold text-primary">
                                Atur Durasi Sendiri
                              </p>
                              <p className="font-metadata text-metadata text-on-surface-variant text-[12px]">
                                Fleksibel sesuai ketersediaan waktumu
                              </p>
                            </div>
                            <span
                              className="material-symbols-outlined text-outline text-[18px]"
                              aria-hidden="true"
                            >
                              edit
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <label className="block font-label text-label text-primary font-bold">
                            Hari Belajar Rutin Mingguan
                          </label>
                          <span className="text-[12px] font-label text-success font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-success"></span>
                            Friendly Streak Terlindungi di Hari Rehat
                          </span>
                        </div>
                        <div
                          aria-label="Pilihan hari belajar"
                          className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center"
                        >
                          <button
                            aria-pressed={value.available_days.includes(0)}
                            className="py-2.5 rounded-xl border border-primary bg-primary text-on-primary font-label text-label font-bold"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(0)
                                  ? value.available_days.filter((d) => d !== 0)
                                  : [...value.available_days, 0],
                              })
                            }
                            disabled={busy}
                          >
                            Sen
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(1)}
                            className="py-2.5 rounded-xl border border-primary bg-primary text-on-primary font-label text-label font-bold"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(1)
                                  ? value.available_days.filter((d) => d !== 1)
                                  : [...value.available_days, 1],
                              })
                            }
                            disabled={busy}
                          >
                            Sel
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(2)}
                            className="py-2.5 rounded-xl border border-primary bg-primary text-on-primary font-label text-label font-bold"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(2)
                                  ? value.available_days.filter((d) => d !== 2)
                                  : [...value.available_days, 2],
                              })
                            }
                            disabled={busy}
                          >
                            Rab
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(3)}
                            className="py-2.5 rounded-xl border border-primary bg-primary text-on-primary font-label text-label font-bold"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(3)
                                  ? value.available_days.filter((d) => d !== 3)
                                  : [...value.available_days, 3],
                              })
                            }
                            disabled={busy}
                          >
                            Kam
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(4)}
                            className="py-2.5 rounded-xl border border-primary bg-primary text-on-primary font-label text-label font-bold"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(4)
                                  ? value.available_days.filter((d) => d !== 4)
                                  : [...value.available_days, 4],
                              })
                            }
                            disabled={busy}
                          >
                            Jum
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(5)}
                            className="py-2.5 rounded-xl border border-dashed border-divider bg-peach-tint text-on-surface-variant font-label text-label flex flex-col items-center justify-center"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(5)
                                  ? value.available_days.filter((d) => d !== 5)
                                  : [...value.available_days, 5],
                              })
                            }
                            disabled={busy}
                          >
                            <span>Sab</span>
                            <span className="text-[9px] font-bold text-outline">
                              Rehat
                            </span>
                          </button>

                          <button
                            aria-pressed={value.available_days.includes(6)}
                            className="py-2.5 rounded-xl border border-dashed border-divider bg-peach-tint text-on-surface-variant font-label text-label flex flex-col items-center justify-center"
                            type="button"
                            onClick={() =>
                              setValue({
                                ...value,
                                available_days: value.available_days.includes(6)
                                  ? value.available_days.filter((d) => d !== 6)
                                  : [...value.available_days, 6],
                              })
                            }
                            disabled={busy}
                          >
                            <span>Min</span>
                            <span className="text-[9px] font-bold text-outline">
                              Rehat
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-xl border border-divider bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-label font-bold uppercase tracking-wider text-outline">
                            Target Akademik Utama
                          </span>
                          <p className="font-label text-label text-primary font-bold">
                            Persiapan Penilaian Akhir Semester (PAS) IPA Bab 4
                            &amp; 5
                          </p>
                          <p className="font-metadata text-metadata text-on-surface-variant text-[13px]">
                            Target selesai: 12 Desember 2024 • Estimasi
                            kelonggaran: Sangat Cukup (+3 hari buffer)
                          </p>
                        </div>
                        <button
                          className="px-space-md py-1.5 rounded-lg border border-divider hover:bg-surface-container font-label text-label text-primary font-semibold self-start sm:self-center transition-colors"
                          type="button"
                          onClick={() =>
                            document.getElementById("profile-goal")?.focus()
                          }
                          disabled={busy}
                        >
                          Ubah Target
                        </button>
                      </div>

                      <div className="p-space-sm rounded-xl bg-butter-tint/70 border border-butter/60 flex items-start gap-2.5">
                        <span className="text-[18px] leading-tight">💡</span>
                        <p className="font-metadata text-metadata text-warning text-[13px] leading-relaxed">
                          <strong>Smart Notice:</strong> Jika kamu menurunkan
                          target harian ke 15 menit, Mimo akan mengusulkan
                          pemindahan 1 kuis mini ke esok hari secara otomatis
                          via pembaruan <em>Rencana Belajar v2.5</em>.
                        </p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">
                        <label className="block">
                          Target belajar
                          <input
                            id="profile-goal"
                            className="block w-full mt-2"
                            value={value.goal}
                            maxLength={200}
                            onChange={(e) =>
                              setValue({ ...value, goal: e.target.value })
                            }
                          />
                        </label>
                        <label className="block">
                          Tanggal ujian (opsional)
                          <input
                            type="date"
                            className="block w-full mt-2"
                            value={value.exam_date || ""}
                            onChange={(e) =>
                              setValue({
                                ...value,
                                exam_date: e.target.value || null,
                              })
                            }
                          />
                        </label>
                        <label className="block">
                          Durasi harian (menit)
                          <input
                            type="number"
                            min={5}
                            max={120}
                            className="block w-full mt-2"
                            value={value.daily_minutes}
                            onChange={(e) =>
                              setValue({
                                ...value,
                                daily_minutes: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                        <label className="block">
                          Zona waktu
                          <select
                            className="block w-full mt-2"
                            value={value.timezone}
                            onChange={(e) =>
                              setValue({ ...value, timezone: e.target.value })
                            }
                          >
                            {[
                              "Asia/Jakarta",
                              "Asia/Makassar",
                              "Asia/Jayapura",
                            ].map((z) => (
                              <option key={z}>{z}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          Format utama
                          <select
                            className="block w-full mt-2"
                            value={prefs.mode}
                            onChange={(e) =>
                              update("mode", e.target.value as Mode)
                            }
                          >
                            {modeOptions.map(([v, t]) => (
                              <option key={v} value={v}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </section>
                  </div>

                  <div className="lg:col-span-5 space-y-space-lg">
                    <section
                      aria-labelledby="heading-notifikasi"
                      className="bg-surface rounded-2xl border border-divider p-space-md md:p-space-lg space-y-space-md shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-divider pb-space-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-lavender-tint text-tertiary flex items-center justify-center font-bold font-label">
                            3
                          </span>
                          <div>
                            <h3
                              className="font-section-title text-card-title text-primary font-bold ui-card-title"
                              id="heading-notifikasi"
                            >
                              Pengingat Ramah Sensorik
                            </h3>
                            <p className="font-metadata text-metadata text-on-surface-variant">
                              Bebas rasa panik atau guilt-trip.
                            </p>
                          </div>
                        </div>
                        <span
                          className="material-symbols-outlined text-outline"
                          aria-hidden="true"
                        >
                          notifications_off
                        </span>
                      </div>

                      <div className="p-space-sm rounded-xl bg-lavender-tint/50 border border-lavender/30 text-[13px] font-metadata text-on-surface-variant flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-tertiary text-[18px]"
                          aria-hidden="true"
                        >
                          verified_user
                        </span>
                        <span>
                          <strong>Komitmen Kami:</strong> TemanBelajar tidak
                          pernah mengirimkan spam atau pesan yang menimbulkan
                          rasa bersalah jika kamu istirahat.
                        </span>
                      </div>

                      <div className="space-y-space-sm divide-y divide-divider">
                        <div className="pt-space-xs flex items-center justify-between gap-space-sm">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Pengingat Jadwal Belajar Harian
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Pukul 08.45 WIB (15 menit sebelum waktu
                              komitmenmu).
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="pt-space-sm flex items-center justify-between gap-space-sm">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Sapaan Semangat dari Mimo
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Pesan ramah di pagi hari untuk memulai hari
                              belajar dengan senyum.
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              checked={prefs.show_mimo}
                              onChange={(e) =>
                                update("show_mimo", e.target.checked)
                              }
                              aria-label="Tampilkan Mimo"
                            />
                            <div className="w-11 h-6 bg-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="pt-space-sm flex items-center justify-between gap-space-sm">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Pengingat Waktu Rehat &amp; Minum Air
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Muncul halus setelah 20 menit membaca agar mata
                              tidak cepat lelah.
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="pt-space-sm flex items-center justify-between gap-space-sm">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Rangkuman Progres Mingguan
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Apresiasi pencapaian belajar dikirim tiap hari
                              Jumat sore.
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              disabled={true}
                              checked={false}
                              title="Fitur ini belum tersedia."
                            />
                            <div className="w-11 h-6 bg-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </section>

                    <section
                      id="privasi-preferensi"
                      aria-labelledby="heading-privasi"
                      className="bg-surface rounded-2xl border border-divider p-space-md md:p-space-lg space-y-space-md shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-divider pb-space-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-peach-tint text-error flex items-center justify-center font-bold font-label">
                            4
                          </span>
                          <div>
                            <h3
                              className="font-section-title text-card-title text-primary font-bold ui-card-title"
                              id="heading-privasi"
                            >
                              Privasi &amp; Kendali Data Mandiri
                            </h3>
                            <p className="font-metadata text-metadata text-on-surface-variant">
                              Hak penuh kamu atas jejak belajar digital.
                            </p>
                          </div>
                        </div>
                        <span
                          className="material-symbols-outlined text-outline"
                          aria-hidden="true"
                        >
                          lock
                        </span>
                      </div>

                      <div className="p-space-sm md:p-space-md rounded-xl bg-surface-container-low border border-divider space-y-1">
                        <div className="flex items-center gap-1.5 text-primary font-label text-label font-bold">
                          <span
                            className="material-symbols-outlined text-[18px] text-success"
                            aria-hidden="true"
                          >
                            security
                          </span>
                          Kebijakan Data Etis &amp; Ramah Pelajar
                        </div>
                        <p className="font-metadata text-metadata text-on-surface-variant text-[13px] leading-relaxed">
                          Data belajarmu semata-mata dipakai untuk melacak
                          pemahaman konsep matematika &amp; sains (Bayesian
                          Knowledge Tracing). Kami{" "}
                          <strong>tidak pernah menjual data</strong> atau
                          memasang iklan.
                        </p>
                      </div>

                      <div className="space-y-space-sm pt-1">
                        <div className="flex items-center justify-between p-space-sm rounded-xl border border-divider hover:bg-surface-container transition-colors">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Unduh Salinan Data Belajar
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Format terbuka (.json / .csv) lengkap dengan jejak
                              penguasaan bab.
                            </span>
                          </div>
                          <button
                            className="h-9 px-space-md rounded-lg border border-divider bg-surface hover:bg-surface-container font-label text-label font-semibold text-primary transition-colors flex items-center gap-1 flex-shrink-0"
                            type="button"
                            onClick={exportProfile}
                            disabled={busy}
                          >
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              download
                            </span>
                            Unduh
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-space-sm rounded-xl border border-divider hover:bg-surface-container transition-colors">
                          <div className="space-y-0.5">
                            <span className="font-label text-label font-bold text-primary block">
                              Reset Riwayat Latihan
                            </span>
                            <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                              Mulai ulang penguasaan bab dari nol tanpa
                              menghapus akun.
                            </span>
                          </div>
                          <button
                            className="h-9 px-space-md rounded-lg border border-divider bg-surface hover:bg-surface-container text-warning font-label text-label font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                            type="button"
                            disabled={true}
                            title="Fitur ini belum tersedia di layanan saat ini."
                          >
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              restart_alt
                            </span>
                            Reset
                          </button>
                        </div>

                        <div className="p-space-sm rounded-xl border border-error/30 bg-error-surface/40 space-y-2">
                          <div className="flex items-start justify-between gap-space-sm">
                            <div>
                              <span className="font-label text-label font-bold text-error block">
                                Hapus Akun &amp; Seluruh Data
                              </span>
                              <span className="font-metadata text-metadata text-on-surface-variant text-[12px] block">
                                {value.display_name}
                              </span>
                            </div>
                          </div>
                          <button
                            className="w-full h-10 rounded-lg border border-error text-error hover:bg-error hover:text-on-error font-label text-label font-bold transition-all flex items-center justify-center gap-1.5"
                            type="button"
                            disabled={true}
                            title="Fitur ini belum tersedia di layanan saat ini."
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              delete_outline
                            </span>
                            Hapus Akun &amp; Seluruh Data Belajar
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <aside
                  aria-label="Bilah Konfirmasi Perubahan"
                  className="screen-action-bar sticky bottom-4 z-40 bg-surface/95 backdrop-blur-md rounded-2xl border border-divider p-space-sm md:p-space-md shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                    <span className="font-metadata text-metadata text-on-surface-variant text-[13px]">
                      Perubahan diterapkan setelah disimpan.{" "}
                      <strong>Preferensi belajar</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                    <button
                      className="h-10 px-space-md rounded-xl border border-divider hover:bg-surface-container font-label text-label text-primary font-semibold transition-colors"
                      type="button"
                      onClick={() => setValue(profile)}
                      disabled={busy}
                    >
                      Batal
                    </button>
                    <button
                      className="h-10 px-space-lg rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold flex items-center gap-2 shadow-sm transition-colors"
                      type="button"
                      onClick={() => onSave(value)}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        done_all
                      </span>
                      Simpan preferensi belajar
                    </button>
                  </div>
                </aside>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 pb-8 ui-container">
              <button
                onClick={signOut}
                disabled={busy}
                className="text-error border border-error px-5 py-3 rounded-xl"
              >
                Keluar dari akun
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

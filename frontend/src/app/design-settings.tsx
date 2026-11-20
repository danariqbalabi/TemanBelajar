"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { readingStyle } from "./reading-style";
import { SettingsGroup } from "./settings-group";
import type { Session } from "@supabase/supabase-js";
import {
  defaultProfile,
  type Profile,
  type Preferences,
  type Mode,
} from "@/lib/types";
const modeOptions: [Mode, string][] = [
  ["standard", "Belajar standar"],
  ["reading", "Teman Baca"],
  ["focus", "Selangkah demi Selangkah"],
  ["explore", "Jelajah visual"],
  ["transcript", "Transkrip & audio"],
];
export function SettingsDesign({
  profile,
  onSave,
  busy,
  account,
  signOut,
  onBack,
  onAccount,
}: {
  profile: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  account: Session;
  signOut: () => void;
  onBack: () => void;
  onAccount?: () => void;
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
    setValue((current) => ({
      ...current,
      preferences: { ...current.preferences, [key]: v },
    }));
  const previewStyle = {
    ...readingStyle(prefs),
    color: prefs.high_contrast ? "#101a16" : "#273b35",
    backgroundColor: prefs.high_contrast ? "#fff" : "#faf3e4",
  };

  function openSettingsGroup(id: string) {
    const element = document.getElementById(id);
    if (element instanceof HTMLDetailsElement) element.open = true;
    element?.scrollIntoView?.({ block: "start" });
  }
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
        {account.user.is_anonymous && onAccount && (
          <div className="ui-container py-3 flex flex-wrap items-center justify-between gap-3">
            <p>Kamu sedang mencoba demo Manda. Punya akun sendiri?</p>
            <button
              type="button"
              className="workspace-button"
              onClick={onAccount}
            >
              Masuk atau daftar dengan email
            </button>
          </div>
        )}
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
                    <h1 className="font-page-title text-page-title text-primary tracking-tight ui-page-title">
                      Tampilan & alat bantu
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

              <div className="max-w-[1200px] w-full mx-auto px-margin pb-space-lg ui-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                  <aside className="lg:col-span-5 lg:sticky lg:top-[9rem] flex flex-col gap-space-md order-1 lg:order-2">
                    <div className="bg-surface rounded-2xl p-6 border border-divider">
                      <h2 className="font-bold text-xl ui-section-title">
                        Pratinjau bacaan
                      </h2>
                      <div
                        className="settings-reading-preview mt-4 space-y-4"
                        data-reading-preview
                        data-contrast={prefs.high_contrast}
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
                        Coba suara
                      </button>
                      <p role="status" className="text-sm mt-3">
                        {speechNotice}
                      </p>
                    </div>
                  </aside>

                  <div className="lg:col-span-7 flex flex-col gap-space-lg order-2 lg:order-1">
                    <SettingsGroup
                      title="Teks & bacaan"
                      icon="text_fields"
                      description="Font, ukuran, dan jarak baca"
                      headingId="section-typography"
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
                              {prefs.font_size} px
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
                              disabled={busy || prefs.font_size <= 14}
                            >
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                remove
                              </span>
                            </button>
                            <input
                              aria-valuemax={32}
                              aria-valuemin={14}
                              aria-valuenow={prefs.font_size}
                              className="w-full accent-primary bg-surface-container h-2 rounded-lg cursor-pointer"
                              id="font-size-slider"
                              max="32"
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
                              disabled={busy || prefs.font_size >= 32}
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
                            <span>Ekstra (32px)</span>
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
                    </SettingsGroup>

                    <SettingsGroup
                      title="Warna & kontras"
                      icon="palette"
                      description="Tampilan yang nyaman untuk matamu"
                      headingId="section-contrast"
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
                          id="theme-selector"
                          className="settings-theme-grid"
                          role="group"
                          aria-label="Tema bacaan"
                        >
                          {(
                            [
                              [false, "Krem Hangat", "Latar krem lembut"],
                              [
                                true,
                                "Kontras Tinggi",
                                "Teks gelap di atas putih",
                              ],
                            ] as const
                          ).map(([contrast, label, description]) => (
                            <button
                              key={label}
                              type="button"
                              className="theme-card-btn"
                              data-theme={contrast ? "high-contrast" : "cream"}
                              aria-pressed={prefs.high_contrast === contrast}
                              disabled={busy}
                              onClick={() => update("high_contrast", contrast)}
                            >
                              <span
                                className="settings-theme-swatch"
                                aria-hidden="true"
                              >
                                Aa
                              </span>
                              <span>
                                <strong>{label}</strong>
                                <small>{description}</small>
                              </span>
                              {prefs.high_contrast === contrast && (
                                <span
                                  className="settings-theme-check material-symbols-outlined"
                                  aria-hidden="true"
                                >
                                  check_circle
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="workspace-muted" role="status">
                          Pratinjau:{" "}
                          {prefs.high_contrast
                            ? "Kontras Tinggi"
                            : "Krem Hangat"}
                          . Simpan untuk menerapkan.
                        </p>
                      </div>
                    </SettingsGroup>

                    <SettingsGroup
                      title="Alat bantu baca"
                      icon="auto_stories"
                      description="Penggaris dan panduan fokus"
                      headingId="section-reading-tools"
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
                              <span
                                className="settings-comfort-switch"
                                aria-hidden="true"
                              />
                            </label>
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
                            <span
                              className="settings-comfort-switch"
                              aria-hidden="true"
                            />
                          </label>
                        </div>
                      </div>
                    </SettingsGroup>

                    <SettingsGroup
                      title="Suara & audio"
                      icon="headphones"
                      description="Coba suara dan atur kecepatannya"
                      headingId="section-audio"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
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
                      </div>
                    </SettingsGroup>

                    <SettingsGroup
                      title="Gerakan & fokus"
                      icon="filter_vintage"
                      description="Kurangi animasi dan atur pendamping"
                      headingId="section-motion"
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
                            <span
                              className="settings-comfort-switch"
                              aria-hidden="true"
                            />
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
                            <span
                              className="settings-comfort-switch"
                              aria-hidden="true"
                            />
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
                            <span
                              className="settings-comfort-switch"
                              aria-hidden="true"
                            />
                          </label>
                        </div>
                        {(
                          [
                            [
                              "timer_enabled",
                              "Tampilkan waktu belajar",
                              "Lihat durasi sesi saat belajar.",
                              "timer",
                            ],
                            [
                              "show_mimo",
                              "Tampilkan Mimo",
                              "Teman kecil yang menemani belajarmu.",
                              "pets",
                            ],
                          ] as const
                        ).map(([key, label, description, icon]) => (
                          <label className="settings-comfort-toggle" key={key}>
                            <span
                              className="settings-comfort-icon material-symbols-outlined"
                              aria-hidden="true"
                            >
                              {icon}
                            </span>
                            <span className="settings-comfort-copy">
                              <strong>{label}</strong>
                              <small>{description}</small>
                            </span>
                            <input
                              type="checkbox"
                              role="switch"
                              aria-label={label}
                              checked={prefs[key]}
                              onChange={(event) =>
                                update(key, event.target.checked)
                              }
                              disabled={busy}
                            />
                            <span
                              className="settings-comfort-switch"
                              aria-hidden="true"
                            />
                          </label>
                        ))}
                      </div>
                    </SettingsGroup>
                  </div>
                </div>
              </div>

              <div className="settings-save-container ui-container">
                <aside
                  className="settings-save-bar"
                  aria-label="Simpan tampilan dan alat bantu"
                >
                  <span className="settings-save-hint">
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      tune
                    </span>
                    Pratinjau siap. Simpan untuk menerapkan.
                  </span>
                  <div className="settings-save-actions">
                    <button
                      type="button"
                      className="workspace-button"
                      onClick={() => setValue(profile)}
                      disabled={busy}
                    >
                      Batalkan perubahan
                    </button>
                    <button
                      type="button"
                      id="btn-bottom-save"
                      className="workspace-button primary"
                      onClick={() => onSave(value)}
                      disabled={busy}
                    >
                      Terapkan preferensi
                    </button>
                  </div>
                </aside>
              </div>
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
                          openSettingsGroup("rencana-preferensi");
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
                          openSettingsGroup("privasi-preferensi");
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
                    <SettingsGroup
                      title="Profil kamu"
                      icon="face"
                      description="Nama dan mata pelajaran"
                      headingId="heading-data-diri"
                      defaultOpen
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
                    </SettingsGroup>

                    <SettingsGroup
                      title="Ritme belajar"
                      icon="schedule"
                      description="Waktu, hari, dan tujuan belajar"
                      headingId="heading-target-waktu"
                      id="rencana-preferensi"
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

                      <fieldset className="settings-rhythm">
                        <legend>Target waktu per hari</legend>
                        <div className="settings-duration">
                          {[15, 25, 40].map((minutes) => (
                            <label key={minutes}>
                              <input
                                type="radio"
                                name="waktu-harian"
                                checked={value.daily_minutes === minutes}
                                disabled={busy}
                                onChange={() =>
                                  setValue((current) => ({
                                    ...current,
                                    daily_minutes: minutes,
                                  }))
                                }
                              />
                              {minutes} menit
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="settings-rhythm">
                        <legend>Hari belajar</legend>
                        <div className="settings-days">
                          {[
                            "Sen",
                            "Sel",
                            "Rab",
                            "Kam",
                            "Jum",
                            "Sab",
                            "Min",
                          ].map((day, index) => {
                            const selected =
                              value.available_days.includes(index);
                            return (
                              <button
                                key={day}
                                type="button"
                                aria-pressed={selected}
                                disabled={busy}
                                onClick={() =>
                                  setValue((current) => ({
                                    ...current,
                                    available_days:
                                      current.available_days.includes(index)
                                        ? current.available_days.filter(
                                            (day) => day !== index,
                                          )
                                        : [...current.available_days, index],
                                  }))
                                }
                              >
                                {day}
                                <small>{selected ? "Belajar" : "Rehat"}</small>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

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
                    </SettingsGroup>
                  </div>

                  <div className="lg:col-span-5 space-y-space-lg">
                    <SettingsGroup
                      title="Akun & privasi"
                      icon="shield"
                      description="Preferensi, ekspor, dan akses akun"
                      headingId="heading-privasi"
                      id="privasi-preferensi"
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
                      </div>
                    </SettingsGroup>
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

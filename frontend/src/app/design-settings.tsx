"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
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
  const previewStyle: CSSProperties = {
    fontFamily:
      prefs.font_family === "nunito"
        ? "Nunito"
        : prefs.font_family === "system"
          ? "system-ui"
          : '"Plus Jakarta Sans"',
    fontSize: prefs.font_size,
    lineHeight: prefs.line_height,
    letterSpacing: prefs.letter_spacing + "em",
    maxWidth: prefs.reading_width + "ch",
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
    <form
      className="stitch-screen stitch-settings"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(value);
      }}
    >
      <nav aria-label="Bagian pengaturan" className="flex gap-3 p-4">
        {[
          ["accessibility", "Aksesibilitas"],
          ["profile", "Profil"],
        ].map(([id, t]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={
              "min-h-[44px] px-5 rounded-xl " +
              (tab === id
                ? "bg-primary text-surface"
                : "bg-surface text-primary")
            }
          >
            {t}
          </button>
        ))}
      </nav>
      <p role="status" className="px-4 text-xs text-text-secondary">
        {JSON.stringify(value) === JSON.stringify(profile)
          ? "Preferensi tersimpan."
          : "Ada perubahan yang belum disimpan."}
      </p>
      {tab === "accessibility" ? (
        <div className="revamp-settings-page px-4 py-6 md:px-8">
          <div className="flex flex-col w-full pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
              <button
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-label text-label w-fit group"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Pengaturan</span>
              </button>
              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-primary font-label text-label hover:bg-surface-container-high transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-focus"
                  id="btn-reset"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setValue({
                      ...value,
                      preferences: { ...defaultProfile.preferences },
                    })
                  }
                >
                  Kembalikan ke Pengaturan Awal
                </button>
                <button
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-label shadow-sm hover:bg-primary-hover active:bg-primary-pressed transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-focus flex items-center gap-2"
                  id="btn-save"
                  type="button"
                  disabled={busy}
                  onClick={() => onSave(value)}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  <span>Simpan Preferensi</span>
                </button>
              </div>
            </div>

            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs tracking-wide uppercase mb-3">
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  accessibility_new
                </span>
                <span>Kustomisasi Ramah Neurodivergen</span>
              </div>
              <h1 className="font-display text-page-title md:text-[34px] text-primary tracking-tight font-extrabold flex items-center gap-3">
                Pengaturan Aksesibilitas
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-surface-container text-lg shadow-sm"
                >
                  🛠️
                </span>
              </h1>
              <p className="font-reading text-text-secondary text-reading max-w-3xl mt-2 leading-relaxed">
                Sesuaikan kenyamanan membaca, tampilan visual, audio narasi, dan
                ritme belajarmu. Berlaku otomatis di semua layar.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <section className="bg-surface rounded-2xl p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 pb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                      >
                        auto_stories
                      </span>
                    </div>
                    <div>
                      <h2 className="font-section-title text-section-title text-primary">
                        Tampilan &amp; Kenyamanan Baca
                      </h2>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Atur beban visual huruf agar mata tidak cepat lelah.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary flex items-center gap-1.5">
                          <span>Ukuran Teks Isi</span>
                          <span className="text-xs text-text-secondary font-metadata font-normal">
                            (Font Size)
                          </span>
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="text-size-indicator"
                        >{`${prefs.font_size}px • Baris ${prefs.line_height}`}</span>
                      </div>
                      <div
                        aria-label="Pilih Ukuran Teks"
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Kecil (14px)"
                          data-type="text-size"
                          data-val="14"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_size", 14)}
                          aria-pressed={prefs.font_size === 14}
                        >
                          Kecil{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            14px
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Standar (16px)"
                          data-type="text-size"
                          data-val="16"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_size", 16)}
                          aria-pressed={prefs.font_size === 16}
                        >
                          Standar{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            16px
                          </span>
                        </button>
                        <button
                          className="opt-btn active-opt py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98]"
                          data-label="Besar (18px)"
                          data-type="text-size"
                          data-val="18"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_size", 18)}
                          aria-pressed={prefs.font_size === 18}
                        >
                          Besar{" "}
                          <span className="block text-[11px] font-metadata opacity-90">
                            18px • Aktif
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Ekstra Besar (20px)"
                          data-type="text-size"
                          data-val="20"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_size", 20)}
                          aria-pressed={prefs.font_size === 20}
                        >
                          Ekstra{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            20px
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary flex items-center gap-1.5">
                          <span>Kerapatan Spasi Baris</span>
                          <span className="text-xs text-text-secondary font-metadata font-normal">
                            (Line Height)
                          </span>
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="line-height-indicator"
                        >
                          {prefs.line_height}
                        </span>
                      </div>
                      <div
                        aria-label="Pilih Kerapatan Baris"
                        className="grid grid-cols-3 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Rapat (1.4)"
                          data-type="line-height"
                          data-val="1.4"
                          type="button"
                          disabled={busy}
                          onClick={() => update("line_height", 1.4)}
                          aria-pressed={prefs.line_height === 1.4}
                        >
                          Rapat{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            1.4
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Normal (1.6)"
                          data-type="line-height"
                          data-val="1.6"
                          type="button"
                          disabled={busy}
                          onClick={() => update("line_height", 1.6)}
                          aria-pressed={prefs.line_height === 1.6}
                        >
                          Normal{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            1.6
                          </span>
                        </button>
                        <button
                          className="opt-btn active-opt py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98]"
                          data-label="Lapang (1.75)"
                          data-type="line-height"
                          data-val="1.75"
                          type="button"
                          disabled={busy}
                          onClick={() => update("line_height", 1.75)}
                          aria-pressed={prefs.line_height === 1.75}
                        >
                          Lapang{" "}
                          <span className="block text-[11px] font-metadata opacity-90">
                            1.75 • Aktif
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary">
                          Rupa Huruf Pembelajaran
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="font-family-indicator"
                        >
                          {prefs.font_family}
                        </span>
                      </div>
                      <div
                        aria-label="Pilih Jenis Huruf"
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn active-opt p-3 rounded-xl text-left font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98]"
                          data-label="Plus Jakarta Sans"
                          data-type="font-family"
                          data-val="Plus Jakarta Sans"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_family", "jakarta")}
                          aria-pressed={prefs.font_family === "jakarta"}
                        >
                          <span className="font-bold block text-sm">
                            Plus Jakarta Sans
                          </span>
                          <span className="text-[11px] font-metadata block opacity-80">
                            Seimbang &amp; netral
                          </span>
                        </button>
                        <button
                          className="opt-btn p-3 rounded-xl text-left font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Font Ramah Disleksia"
                          data-type="font-family"
                          data-val="OpenDyslexic"
                          type="button"
                          disabled={true}
                          aria-pressed={prefs.font_family === "nunito"}
                          title="OpenDyslexic belum didukung penyimpanan preferensi"
                        >
                          <span className="font-bold block text-sm tracking-wide">
                            OpenDyslexic
                          </span>
                          <span className="text-[11px] font-metadata block opacity-80">
                            Beban bawah huruf berat
                          </span>
                        </button>
                        <button
                          className="opt-btn p-3 rounded-xl text-left font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="Sistem Default"
                          data-type="font-family"
                          data-val="system-ui"
                          type="button"
                          disabled={busy}
                          onClick={() => update("font_family", "system")}
                          aria-pressed={prefs.font_family === "system"}
                        >
                          <span className="font-bold block text-sm">
                            Sistem Default
                          </span>
                          <span className="text-[11px] font-metadata block opacity-80">
                            Mengikuti gaya bawaan HP/PC
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-primary mt-0.5 shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            highlight
                          </span>
                        </div>
                        <div>
                          <span className="font-label text-label text-primary block">
                            Penggaris Baca Interaktif (Reading Guide)
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary block mt-0.5">
                            Menyorot kalimat yang sedang dibaca agar mata tidak
                            melompat dan bebas pusing.
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-13 h-7 px-0.5 bg-primary rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-focus shrink-0"
                        id="toggle-ruler"
                        role="switch"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          update("reading_ruler", !prefs.reading_ruler)
                        }
                        aria-checked={prefs.reading_ruler}
                        aria-label="Penggaris Baca"
                      >
                        <span className="w-6 h-6 rounded-full bg-surface shadow-md transform translate-x-6 transition-transform flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-surface rounded-2xl p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 pb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                      >
                        timer
                      </span>
                    </div>
                    <div>
                      <h2 className="font-section-title text-section-title text-primary">
                        Fokus &amp; Ritme Belajar
                      </h2>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Pencegah over-stimulasi dengan micro-sprint dan minimal
                        distraksi.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 pt-2">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-primary mt-0.5 shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            center_focus_strong
                          </span>
                        </div>
                        <div>
                          <span className="font-label text-label text-primary block">
                            Mode Fokus Satu Tugas (One Task at a Time)
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary block mt-0.5">
                            Menyembunyikan menu samping dan panel yang tidak
                            relevan saat membaca materi.
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-13 h-7 px-0.5 bg-primary rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-focus shrink-0"
                        id="toggle-single-task"
                        role="switch"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          update(
                            "mode",
                            prefs.mode === "focus" ? "reading" : "focus",
                          )
                        }
                        aria-checked={prefs.mode === "focus"}
                      >
                        <span className="w-6 h-6 rounded-full bg-surface shadow-md transform translate-x-6 transition-transform flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary flex items-center gap-1.5">
                          <span>Durasi Sesi Rekomendasi (Micro-Sprint)</span>
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="session-duration-indicator"
                        >{`${value.daily_minutes} Menit`}</span>
                      </div>
                      <div
                        aria-label="Durasi Sesi"
                        className="grid grid-cols-3 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn active-opt py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98]"
                          data-label="10 Menit"
                          data-type="duration"
                          data-val="10"
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setValue({ ...value, daily_minutes: 10 })
                          }
                          aria-pressed={value.daily_minutes === 10}
                        >
                          10 Menit{" "}
                          <span className="block text-[11px] font-metadata opacity-90 font-normal">
                            Sangat Ramah Cemas
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="15 Menit"
                          data-type="duration"
                          data-val="15"
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setValue({ ...value, daily_minutes: 15 })
                          }
                          aria-pressed={value.daily_minutes === 15}
                        >
                          15 Menit{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            Fokus Standar
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="25 Menit"
                          data-type="duration"
                          data-val="25"
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setValue({ ...value, daily_minutes: 25 })
                          }
                          aria-pressed={value.daily_minutes === 25}
                        >
                          25 Menit{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            Pomodoro Klasik
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-primary mt-0.5 shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            motion_photos_off
                          </span>
                        </div>
                        <div>
                          <span className="font-label text-label text-primary block">
                            Reduksi Gerak (Prefers Reduced Motion)
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary block mt-0.5">
                            Mematikan animasi meluncur, zoom, dan transisi
                            berlebihan di seluruh aplikasi.
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-13 h-7 px-0.5 bg-primary rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-focus shrink-0"
                        id="toggle-reduced-motion"
                        role="switch"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          update("reduced_motion", !prefs.reduced_motion)
                        }
                        aria-checked={prefs.reduced_motion}
                        aria-label="Redam animasi"
                      >
                        <span className="w-6 h-6 rounded-full bg-surface shadow-md transform translate-x-6 transition-transform flex items-center justify-center">
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </section>

                <section className="bg-surface rounded-2xl p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 pb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                      >
                        volume_up
                      </span>
                    </div>
                    <div>
                      <h2 className="font-section-title text-section-title text-primary">
                        Audio &amp; Narasi Mimo
                      </h2>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Dengarkan materi pembelajaran dan temani suasana
                        belajar.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 pt-2">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-text-secondary mt-0.5 shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            record_voice_over
                          </span>
                        </div>
                        <div>
                          <span className="font-label text-label text-primary block">
                            Bacakan Narasi Otomatis
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary block mt-0.5">
                            Jika nonaktif, audio hanya berbunyi saat kamu
                            menekan tombol speaker di modul bacaan.
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-13 h-7 px-0.5 bg-surface-container-highest rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-focus shrink-0"
                        id="toggle-auto-read"
                        role="button"
                        type="button"
                        disabled={busy}
                        onClick={speak}
                        aria-label="Uji suara baca"
                      >
                        {"Uji suara"}
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary">
                          Kecepatan Suara Narasi
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="speed-indicator"
                        >{`${prefs.speech_rate}x`}</span>
                      </div>
                      <div
                        aria-label="Kecepatan Narasi"
                        className="grid grid-cols-3 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="0.8x Pelan"
                          data-type="audio-speed"
                          data-val="0.8"
                          type="button"
                          disabled={busy}
                          onClick={() => update("speech_rate", 0.8)}
                          aria-pressed={prefs.speech_rate === 0.8}
                        >
                          0.8x{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            Pelan &amp; Jelas
                          </span>
                        </button>
                        <button
                          className="opt-btn active-opt py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98]"
                          data-label="1.0x Normal"
                          data-type="audio-speed"
                          data-val="1.0"
                          type="button"
                          disabled={busy}
                          onClick={() => update("speech_rate", 1.0)}
                          aria-pressed={prefs.speech_rate === 1.0}
                        >
                          1.0x{" "}
                          <span className="block text-[11px] font-metadata opacity-90">
                            Normal • Aktif
                          </span>
                        </button>
                        <button
                          className="opt-btn py-3 px-3 rounded-xl text-center font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98]"
                          data-label="1.2x Cepat"
                          data-type="audio-speed"
                          data-val="1.2"
                          type="button"
                          disabled={busy}
                          onClick={() => update("speech_rate", 1.2)}
                          aria-pressed={prefs.speech_rate === 1.2}
                        >
                          1.2x{" "}
                          <span className="block text-[11px] font-metadata opacity-80">
                            Cepat Ringkas
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-label text-label text-primary flex items-center gap-1.5">
                          <span>Ambience Latar Penenang Cemas</span>
                          <span className="text-xs text-text-secondary font-metadata font-normal">
                            (Binaural White Noise)
                          </span>
                        </label>
                        <span
                          className="font-metadata text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant"
                          id="ambience-indicator"
                        >
                          {"Hening • audio latar belum tersedia"}
                        </span>
                      </div>
                      <div
                        aria-label="Ambience Latar"
                        className="grid grid-cols-3 gap-2.5"
                        role="radiogroup"
                      >
                        <button
                          className="opt-btn active-opt p-3 rounded-xl text-left font-label text-label transition-all bg-secondary-container text-primary shadow-sm font-bold ring-2 ring-secondary active:scale-[0.98] flex items-center gap-2.5"
                          data-label="Hujan Tenang"
                          data-type="ambience"
                          data-val="rain"
                          type="button"
                          disabled={true}
                          title="Audio latar belum tersedia"
                          aria-pressed={false}
                        >
                          <span
                            className="material-symbols-outlined text-[20px] text-primary"
                            aria-hidden="true"
                          >
                            water_drop
                          </span>
                          <div>
                            <span className="block text-sm">Hujan Tenang</span>
                            <span className="text-[11px] font-metadata block opacity-80">
                              Rintik lembut
                            </span>
                          </div>
                        </button>
                        <button
                          className="opt-btn p-3 rounded-xl text-left font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98] flex items-center gap-2.5"
                          data-label="Hutan Hijau"
                          data-type="ambience"
                          data-val="forest"
                          type="button"
                          disabled={true}
                          title="Audio latar belum tersedia"
                          aria-pressed={false}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                          >
                            forest
                          </span>
                          <div>
                            <span className="block text-sm">Hutan Hijau</span>
                            <span className="text-[11px] font-metadata block opacity-80">
                              Desir dedaunan
                            </span>
                          </div>
                        </button>
                        <button
                          className="opt-btn p-3 rounded-xl text-left font-label text-label transition-all bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-primary active:scale-[0.98] flex items-center gap-2.5"
                          data-label="Mati"
                          data-type="ambience"
                          data-val="off"
                          type="button"
                          disabled={true}
                          title="Audio latar belum tersedia"
                          aria-pressed={true}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                          >
                            volume_off
                          </span>
                          <div>
                            <span className="block text-sm">Mati</span>
                            <span className="text-[11px] font-metadata block opacity-80">
                              Hening total
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
                <div className="bg-surface rounded-2xl p-6 shadow-md transition-all">
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-primary text-[20px]"
                        aria-hidden="true"
                      >
                        preview
                      </span>
                      <h3 className="font-card-title text-card-title text-primary">
                        Pratinjau Teks Nyata
                      </h3>
                    </div>
                    <span className="font-metadata text-[11px] font-semibold tracking-wider uppercase text-text-secondary bg-surface-container px-2 py-0.5 rounded">
                      Live Demo
                    </span>
                  </div>
                  <p className="font-metadata text-xs text-text-secondary mb-3">
                    Tampilan ini mencerminkan format membaca saat kamu membuka
                    bab Matematika atau IPA:
                  </p>

                  <div
                    className="p-5 rounded-xl bg-surface-container-low shadow-inner relative overflow-hidden transition-all duration-200"
                    id="preview-box"
                  >
                    <div className="text-xs font-label uppercase tracking-wider text-muted-gray mb-2 flex items-center justify-between">
                      <span>BAB 4 • TEOREMA PYTHAGORAS</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-text-secondary"
                        aria-hidden="true"
                      >
                        bookmark
                      </span>
                    </div>

                    <div
                      className="text-on-surface font-body transition-all duration-150"
                      id="preview-paragraph"
                      style={previewStyle}
                    >
                      <p className="mb-3">
                        Perhatikan segitiga siku-siku di hadapanmu.
                        <span
                          className="bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded shadow-sm inline font-medium"
                          id="preview-highlight"
                        >
                          Sudut siku-siku 90° adalah jangkar utamamu untuk
                          menemukan hipotenusa.
                        </span>
                        Sisi terpanjang selalu berada tepat berseberangan
                        dengannya.
                      </p>
                      <p className="text-text-secondary text-sm">
                        Cobalah tarik garis imajiner dari sudut siku-siku ke
                        sisi seberang.
                      </p>
                    </div>

                    <div
                      className="mt-3 pt-2 flex items-center justify-between text-xs text-secondary font-label"
                      id="preview-ruler-bar"
                      style={{ display: "flex" }}
                      hidden={!prefs.reading_ruler}
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[15px]"
                          aria-hidden="true"
                        >
                          straighten
                        </span>
                        Penggaris Baca: Aktif
                      </span>
                      <span className="font-metadata text-[11px] text-text-secondary">
                        Baris 1 dari 2
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3">
                    <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                      <span className="font-metadata text-[11px] text-text-secondary">
                        Ukuran / Jarak
                      </span>
                      <span
                        className="font-label text-xs text-primary font-bold"
                        id="metric-size-line"
                      >{`${prefs.font_size}px • Baris ${prefs.line_height}`}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                      <span className="font-metadata text-[11px] text-text-secondary">
                        Sesi Sprint
                      </span>
                      <span
                        className="font-label text-xs text-primary font-bold"
                        id="metric-duration"
                      >{`${value.daily_minutes} Menit`}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-secondary-container/60 shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Image
                        className="w-12 h-12 object-contain"
                        data-alt="Cute friendly chameleon mascot named Mimo in minimalist flat 2D vector zine illustration style with soft green #91AF87 and gentle eyes wearing tiny reading glasses."
                        src="/design/mimo-0.png"
                        width={1024}
                        height={1024}
                        alt="Mimo, teman belajarmu"
                      ></Image>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-display font-bold text-sm text-primary">
                          Mimo Siaga
                        </span>
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                      </div>
                      <p className="font-mimo-voice text-sm text-primary leading-snug">
                        &quot;Pengaturan ini langsung aktif di sesi{" "}
                        <strong>Teman Baca</strong> dan{" "}
                        <strong>Focus Navigator</strong> Manda ya! Santai saja
                        belajarnya.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-success text-[20px] shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  <span className="font-metadata text-xs text-text-secondary leading-snug">
                    Semua perubahan disimpan otomatis ke profil lokal Manda
                    tanpa perlu koneksi internet kencang.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <section className="max-w-6xl mx-auto p-6 bg-surface rounded-2xl mt-6">
            <div className="flex flex-wrap gap-4">
              <label>
                <input
                  type="checkbox"
                  checked={prefs.high_contrast}
                  onChange={(e) => update("high_contrast", e.target.checked)}
                />
                Kontras tinggi
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={prefs.timer_enabled}
                  onChange={(e) => update("timer_enabled", e.target.checked)}
                />
                Timer opsional
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={prefs.show_mimo}
                  onChange={(e) => update("show_mimo", e.target.checked)}
                />
                Tampilkan Mimo
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={prefs.captions}
                  onChange={(e) => update("captions", e.target.checked)}
                />
                Tampilkan transkrip
              </label>
            </div>
            <label className="block mt-4">
              Lebar bacaan
              <input
                type="range"
                min={40}
                max={80}
                value={prefs.reading_width}
                onChange={(e) => update("reading_width", +e.target.value)}
              />
              <output>{prefs.reading_width} karakter</output>
            </label>
            <label className="block">
              Jarak huruf
              <input
                type="range"
                min={0}
                max={0.2}
                step={0.01}
                value={prefs.letter_spacing}
                onChange={(e) => update("letter_spacing", +e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => update("font_family", "nunito")}
              className="min-h-[44px] px-4 bg-canvas rounded-xl"
            >
              Nunito Ramah
            </button>
            <p role="status">{speechNotice}</p>
            <p className="text-xs text-text-secondary mt-3">
              Suara baca mengikuti suara bahasa Indonesia yang tersedia di
              peramban.
            </p>
          </section>
        </div>
      ) : (
        <div className="revamp-settings-page px-4 py-6 md:px-8">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-7xl mx-auto space-y-space-lg">
              <div className="absolute -top-10 -right-8 w-96 h-96 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute top-1/2 -left-12 w-80 h-80 bg-peach/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface p-space-lg rounded-xl shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-[11px] uppercase tracking-wider">
                      Pengaturan Profil Siswa
                    </span>
                    <span className="text-muted-gray text-xs">•</span>
                    <span className="text-text-secondary text-xs font-metadata">
                      {account.user.is_anonymous
                        ? "Akun demo"
                        : account.user.email}
                    </span>
                  </div>
                  <h1 className="font-page-title text-page-title sm:text-[34px] text-primary tracking-tight flex items-center gap-2">
                    Profil &amp; Preferensi Akun{" "}
                    <span aria-hidden="true" className="text-2xl">
                      👤
                    </span>
                  </h1>
                  <p className="text-text-secondary font-reading text-metadata sm:text-body max-w-2xl">
                    Kelola identitas belajar, target mingguan, integrasi jadwal,
                    dan kendali privasi datamu secara aman dan mandiri.
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 p-space-sm bg-surface-container-low rounded-xl">
                  <span className="flex items-center gap-1.5 text-xs font-label text-success">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Mode Adaptif Aktif
                  </span>
                  <span className="text-[11px] font-metadata text-text-secondary">
                    Pembaruan: Hari ini, 09:12 WIB
                  </span>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                <div className="lg:col-span-8 space-y-space-lg">
                  <section
                    aria-labelledby="heading-identitas"
                    className="bg-surface p-space-lg rounded-xl shadow-sm space-y-space-md"
                  >
                    <h2 className="text-xl font-bold text-primary">
                      Identitas Belajar Siswa
                    </h2>
                    <label className="block">
                      Nama panggilan
                      <input
                        required
                        maxLength={80}
                        value={value.display_name}
                        onChange={(e) =>
                          setValue({ ...value, display_name: e.target.value })
                        }
                      />
                    </label>
                    <p className="text-sm text-text-secondary">
                      {account.user.is_anonymous
                        ? "Akun demo anonim. Simpan akses perangkat ini agar progres bisa dibuka kembali."
                        : account.user.email}
                    </p>
                    <label className="block">
                      Zona waktu
                      <select
                        value={value.timezone}
                        onChange={(e) =>
                          setValue({ ...value, timezone: e.target.value })
                        }
                      >
                        {["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"].map(
                          (z) => (
                            <option key={z} value={z}>
                              {z}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <button
                      type="submit"
                      disabled={busy}
                      className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
                    >
                      Perbarui data diri
                    </button>
                  </section>

                  <section
                    aria-labelledby="heading-target"
                    className="bg-surface p-space-lg rounded-xl shadow-sm space-y-space-md"
                  >
                    <h2 className="text-xl font-bold text-primary">
                      Target & Komitmen Belajar
                    </h2>
                    <label className="block">
                      Waktu harian (menit)
                      <input
                        required
                        type="number"
                        min={5}
                        max={240}
                        value={value.daily_minutes}
                        onChange={(e) =>
                          setValue({ ...value, daily_minutes: +e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      Tujuan belajar
                      <textarea
                        maxLength={500}
                        value={value.goal}
                        onChange={(e) =>
                          setValue({ ...value, goal: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      Tanggal ujian (opsional)
                      <input
                        type="date"
                        value={value.exam_date || ""}
                        onChange={(e) =>
                          setValue({
                            ...value,
                            exam_date: e.target.value || null,
                          })
                        }
                      />
                    </label>
                    <fieldset>
                      <legend>Hari belajar pilihan</legend>
                      <div className="flex flex-wrap gap-3">
                        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                          (d, i) => (
                            <label key={d}>
                              <input
                                type="checkbox"
                                checked={value.available_days.includes(i)}
                                onChange={(e) =>
                                  setValue({
                                    ...value,
                                    available_days: e.target.checked
                                      ? [...value.available_days, i]
                                      : value.available_days.filter(
                                          (v) => v !== i,
                                        ),
                                  })
                                }
                              />
                              {d}
                            </label>
                          ),
                        )}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend>Mata pelajaran</legend>
                      {[
                        "Matematika",
                        "IPA",
                        "Bahasa Indonesia",
                        "Bahasa Inggris",
                        "IPS",
                      ].map((s) => (
                        <label key={s}>
                          <input
                            type="checkbox"
                            checked={value.subjects.includes(s)}
                            onChange={(e) =>
                              setValue({
                                ...value,
                                subjects: e.target.checked
                                  ? [...value.subjects, s]
                                  : value.subjects.filter((v) => v !== s),
                              })
                            }
                          />
                          {s}
                        </label>
                      ))}
                    </fieldset>
                    <label className="block">
                      Mode belajar bawaan
                      <select
                        value={prefs.mode}
                        onChange={(e) => update("mode", e.target.value as Mode)}
                      >
                        {modeOptions.map(([v, t]) => (
                          <option key={v} value={v}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="submit"
                      disabled={busy}
                      className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
                    >
                      Simpan Semua Preferensi
                    </button>
                  </section>

                  <section
                    aria-labelledby="heading-privasi"
                    className="bg-surface p-space-lg rounded-xl shadow-sm space-y-space-md"
                  >
                    <h2 className="text-xl font-bold text-primary">
                      Kendali Preferensi & Data
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Preferensi tersimpan mengikuti akunmu. Unduhan berisi
                      profil dan preferensi yang terlihat di halaman ini.
                    </p>
                    <button
                      type="button"
                      onClick={exportProfile}
                      className="min-h-[44px] px-4 rounded-xl bg-canvas"
                    >
                      Unduh preferensi (.JSON)
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={signOut}
                      className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
                    >
                      Keluar dari akun
                    </button>
                    <p className="text-xs text-text-secondary">
                      Reset estimasi dan penghapusan akun belum tersedia melalui
                      aplikasi.
                    </p>
                  </section>
                </div>

                <aside className="lg:col-span-4 space-y-space-lg">
                  <div className="bg-surface p-space-lg rounded-xl shadow-sm space-y-space-md">
                    <div className="flex items-center justify-between pb-2">
                      <span className="font-label text-xs text-text-secondary uppercase tracking-wider">
                        Identifikasi Akun
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-success"
                        title="Status Aktif"
                      ></span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                        <span className="text-xs font-metadata text-text-secondary">
                          Kode Siswa
                        </span>
                        <span className="font-label text-xs font-bold text-primary font-mono bg-surface px-2 py-0.5 rounded shadow-sm">
                          {account.user.is_anonymous
                            ? "Akun demo"
                            : account.user.email}
                        </span>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                        <span className="text-xs font-metadata text-text-secondary">
                          Status Layanan
                        </span>
                        <span className="font-label text-xs font-semibold text-success flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            check_circle
                          </span>
                          Siswa Aktif TemanBelajar
                        </span>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                        <span className="text-[11px] font-metadata text-text-secondary">
                          Versi Aplikasi
                        </span>
                        <span className="font-label text-xs text-primary leading-tight">
                          TemanBelajar v1.4.0
                        </span>
                        <span className="text-[10px] font-metadata text-secondary">
                          {"Target aksesibilitas WCAG 2.2 AA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <nav
                    aria-label="Tautan Pengaturan Terkait"
                    className="bg-surface p-space-lg rounded-xl shadow-sm space-y-3"
                  >
                    <h3 className="font-card-title text-sm font-bold text-primary">
                      Pengaturan Lainnya
                    </h3>
                    <div className="space-y-2">
                      <button
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-xs transition-colors group"
                        type="button"
                        onClick={() => setTab("accessibility")}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="p-1.5 rounded-lg bg-surface text-secondary shadow-sm">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              accessibility_new
                            </span>
                          </span>
                          <span className="truncate">
                            {"Atur Aksesibilitas "}
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined text-[16px] text-text-secondary group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>

                      <button
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-xs transition-colors group"
                        type="button"
                        onClick={() => setTab("accessibility")}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="p-1.5 rounded-lg bg-surface text-secondary shadow-sm">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              calendar_month
                            </span>
                          </span>
                          <span className="truncate">
                            {"Atur Jam &amp; Hari Mandiri "}
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined text-[16px] text-text-secondary group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>

                      <button
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-xs transition-colors group"
                        type="button"
                        onClick={() => setTab("accessibility")}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="p-1.5 rounded-lg bg-surface text-secondary shadow-sm">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              menu_book
                            </span>
                          </span>
                          <span className="truncate">
                            Panduan Etika &amp; Privasi
                          </span>
                        </div>
                        <span
                          className="material-symbols-outlined text-[16px] text-text-secondary group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </nav>

                  <div className="relative overflow-hidden bg-gradient-to-br from-secondary-container/60 via-secondary-container/40 to-surface-container p-space-lg rounded-xl shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-mimo-belly/60 flex items-center justify-center shrink-0 shadow-sm">
                        <span
                          className="material-symbols-outlined text-mimo-outline text-[28px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          cruelty_free
                        </span>
                      </div>
                      <div>
                        <span className="font-mimo-voice text-primary text-sm font-bold block">
                          Pesan dari Mimo
                        </span>
                        <span className="text-[11px] font-metadata text-text-secondary">
                          Sahabat Belajarmu
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-surface/90 rounded-xl rounded-tl-none shadow-sm">
                      <p className="font-mimo-voice text-xs sm:text-[13px] text-primary leading-relaxed">
                        {value.display_name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-metadata text-text-secondary">
                        TemanBelajar Peduli Kesejahteraanmu
                      </span>
                      <span className="text-xs">🌿</span>
                    </div>
                  </div>

                  <div className="p-space-md bg-surface rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-label text-text-secondary">
                        Kenyamanan Ritme Pekan Ini
                      </span>
                      <span className="font-label text-success font-bold">
                        {"Preferensi pribadimu"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        aria-hidden="true"
                        className="w-12 h-12 shrink-0 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-surface-container"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></path>
                        <path
                          className="text-secondary"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray="100, 100"
                          strokeLinecap="round"
                          strokeWidth="4"
                        ></path>
                      </svg>
                      <p className="text-xs font-metadata text-text-secondary leading-snug">
                        Kamu menjaga durasi tetap di bawah batas lelah 35 menit
                        selama 5 hari berturut-turut. Hebat!
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

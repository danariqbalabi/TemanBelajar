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
      <nav
        aria-label="Bagian pengaturan"
        className="flex gap-space-sm mb-space-lg"
      >
        {[
          ["accessibility", "Aksesibilitas"],
          ["profile", "Profil"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={
              "h-11 px-space-lg rounded-xl font-label text-label " +
              (tab === id
                ? "bg-primary text-on-primary"
                : "bg-surface text-primary")
            }
          >
            {label}
          </button>
        ))}
      </nav>
      <p
        role="status"
        className="font-metadata text-metadata text-text-secondary mb-space-sm"
      >
        {JSON.stringify(value) === JSON.stringify(profile)
          ? "Preferensi tersimpan."
          : "Ada perubahan yang belum disimpan."}
      </p>
      {tab === "accessibility" ? (
        <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata">
              <button
                type="button"
                className="hover:text-primary transition-colors flex items-center gap-1"

                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  home
                </span>
                <span>Beranda</span>
              </button>
              <span
                className="material-symbols-outlined text-[14px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
              <span>Pengaturan</span>
              <span
                className="material-symbols-outlined text-[14px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
              <span className="text-primary font-label">
                Aksesibilitas Belajar
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs">
              <div>
                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-fixed/60 mb-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  <span className="font-metadata text-[12px] text-on-secondary-fixed-variant font-medium">
                    Standar WCAG 2.2 Level AA • Otomatis di Semua Modul
                  </span>
                </div>
                <h1 className="font-page-title text-page-title text-primary tracking-tight">
                  Pengaturan Aksesibilitas Belajar
                </h1>
                <p className="font-body text-body text-text-secondary max-w-3xl mt-1">
                  Sesuaikan kenyamanan membaca, tampilan visual, audio, dan
                  fokus belajarmu. Kamu memegang kendali penuh dan bisa mengubah
                  preferensi ini kapan saja tanpa tekanan.
                </p>
              </div>
              <div className="flex items-center gap-space-sm self-start lg:self-center shrink-0">
                <button
                  className="inline-flex items-center gap-space-xs h-11 px-space-md rounded-xl bg-surface hover:bg-surface-container text-text-secondary hover:text-primary font-label text-label transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  id="btn-reset"
                  type="button"
                  onClick={() =>
                    setValue({
                      ...value,
                      preferences: { ...defaultProfile.preferences },
                    })
                  }
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    restart_alt
                  </span>
                  <span>Reset Default</span>
                </button>
                <button
                  className="inline-flex items-center gap-space-xs h-11 px-space-lg rounded-xl bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed font-label text-label transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-focus"
                  id="btn-save-top"
                  type="button"
                  onClick={() => onSave(value)}
                  disabled={busy}
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
          </div>

          <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
            <button
              className="tab-btn inline-flex items-center gap-space-xs h-10 px-space-md rounded-full bg-secondary-container text-on-secondary-container font-label text-label shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              data-tab-target="reading"
              type="button"
              onClick={() =>
                document
                  .getElementById("section-reading")
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                menu_book
              </span>
              <span>Membaca &amp; Teks</span>
            </button>
            <button
              className="tab-btn inline-flex items-center gap-space-xs h-10 px-space-md rounded-full bg-surface text-text-secondary hover:bg-surface-container hover:text-primary font-label text-label shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              data-tab-target="display"
              type="button"
              onClick={() =>
                document
                  .getElementById("section-display")
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                palette
              </span>
              <span>Tampilan &amp; Kontras</span>
            </button>
            <button
              className="tab-btn inline-flex items-center gap-space-xs h-10 px-space-md rounded-full bg-surface text-text-secondary hover:bg-surface-container hover:text-primary font-label text-label shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              data-tab-target="audio"
              type="button"
              onClick={() =>
                document
                  .getElementById("section-audio")
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                volume_up
              </span>
              <span>Suara &amp; Audio</span>
            </button>
            <button
              className="tab-btn inline-flex items-center gap-space-xs h-10 px-space-md rounded-full bg-surface text-text-secondary hover:bg-surface-container hover:text-primary font-label text-label shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              data-tab-target="focus"
              type="button"
              onClick={() =>
                document
                  .getElementById("section-focus")
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                psychology
              </span>
              <span>Fokus &amp; Kognitif</span>
            </button>
            <button
              className="tab-btn inline-flex items-center gap-space-xs h-10 px-space-md rounded-full bg-surface text-text-secondary hover:bg-surface-container hover:text-primary font-label text-label shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
              data-tab-target="navigation"
              type="button"
              onClick={() =>
                document
                  .getElementById("section-focus")
                  ?.scrollIntoView({ block: "start" })
              }
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                keyboard
              </span>
              <span>Navigasi &amp; Gerak</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-7 flex flex-col space-y-space-lg">
              <section
                className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
                id="section-reading"
              >
                <h2 className="font-section-title text-section-title text-primary">
                  Tipografi & Ukuran Teks
                </h2>
                <p className="font-body text-body text-text-secondary">
                  Pilih tampilan yang paling nyaman untukmu.
                </p>
                <div className="grid grid-cols-2 gap-space-sm">
                  <button
                    type="button"
                    className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                    aria-pressed={prefs.font_family === "jakarta"}
                    onClick={() => update("font_family", "jakarta")}
                  >
                    Plus Jakarta Sans
                  </button>
                  <button
                    type="button"
                    className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                    aria-pressed={prefs.font_family === "nunito"}
                    onClick={() => update("font_family", "nunito")}
                  >
                    Nunito Ramah
                  </button>
                  <button
                    type="button"
                    className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                    aria-pressed={prefs.font_family === "system"}
                    onClick={() => update("font_family", "system")}
                  >
                    Font Sistem
                  </button>
                </div>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Ukuran teks (px)
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={14}
                    max={32}
                    step={1}
                    value={prefs.font_size}
                    onChange={(e) => update("font_size", +e.target.value)}
                  />
                  <output>{prefs.font_size}</output>
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Jarak baris
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={1.2}
                    max={2.5}
                    step={0.05}
                    value={prefs.line_height}
                    onChange={(e) => update("line_height", +e.target.value)}
                  />
                  <output>{prefs.line_height}</output>
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Jarak huruf (em)
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={0}
                    max={0.2}
                    step={0.01}
                    value={prefs.letter_spacing}
                    onChange={(e) => update("letter_spacing", +e.target.value)}
                  />
                  <output>{prefs.letter_spacing}</output>
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Lebar bacaan (karakter)
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={40}
                    max={80}
                    step={1}
                    value={prefs.reading_width}
                    onChange={(e) => update("reading_width", +e.target.value)}
                  />
                  <output>{prefs.reading_width}</output>
                </label>
              </section>

              <section
                className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
                id="section-display"
              >
                <h2 className="font-section-title text-section-title text-primary">
                  Tampilan, Kontras & Alat Bantu
                </h2>
                <div className="grid grid-cols-2 gap-space-sm">
                  <button
                    type="button"
                    className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                    aria-pressed={prefs.high_contrast === false}
                    onClick={() => update("high_contrast", false)}
                  >
                    Krem Hangat
                  </button>
                  <button
                    type="button"
                    className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                    aria-pressed={prefs.high_contrast === true}
                    onClick={() => update("high_contrast", true)}
                  >
                    Kontras Tinggi
                  </button>
                </div>
                <label className="flex items-center justify-between gap-space-md p-space-sm rounded-xl bg-surface-container-low font-label text-label text-primary">
                  <span>Penggaris Baca</span>
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
                    checked={prefs.reading_ruler}
                    onChange={(e) => update("reading_ruler", e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between gap-space-md p-space-sm rounded-xl bg-surface-container-low font-label text-label text-primary">
                  <span>Tampilkan Mimo</span>
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
                    checked={prefs.show_mimo}
                    onChange={(e) => update("show_mimo", e.target.checked)}
                  />
                </label>
                <p className="font-metadata text-metadata text-text-secondary">
                  Pilihan warna dan huruf mengikuti preferensi yang didukung
                  aplikasi.
                </p>
              </section>

              <section
                className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
                id="section-audio"
              >
                <h2 className="font-section-title text-section-title text-primary">
                  Suara Narasi & Audio Pendamping
                </h2>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Kecepatan bicara
                  <input
                    className="w-full accent-primary"
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={prefs.speech_rate}
                    onChange={(e) => update("speech_rate", +e.target.value)}
                  />
                  <output>{prefs.speech_rate}</output>
                </label>
                <label className="flex items-center justify-between gap-space-md p-space-sm rounded-xl bg-surface-container-low font-label text-label text-primary">
                  <span>Tampilkan transkrip</span>
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
                    checked={prefs.captions}
                    onChange={(e) => update("captions", e.target.checked)}
                  />
                </label>
                <p className="font-body text-body text-text-secondary">
                  Baca nyaring menggunakan suara bahasa Indonesia yang tersedia
                  di perambanmu.
                </p>
                <button
                  type="button"
                  className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                  onClick={speak}
                >
                  Uji suara baca
                </button>
                <p
                  role="status"
                  className="font-metadata text-metadata text-secondary"
                >
                  {speechNotice}
                </p>
              </section>

              <section
                className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
                id="section-focus"
              >
                <h2 className="font-section-title text-section-title text-primary">
                  Kognitif, Fokus & Pengurangan Gerak
                </h2>
                <label className="flex items-center justify-between gap-space-md p-space-sm rounded-xl bg-surface-container-low font-label text-label text-primary">
                  <span>Kurangi gerak animasi</span>
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
                    checked={prefs.reduced_motion}
                    onChange={(e) => update("reduced_motion", e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between gap-space-md p-space-sm rounded-xl bg-surface-container-low font-label text-label text-primary">
                  <span>Tampilkan timer opsional</span>
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
                    checked={prefs.timer_enabled}
                    onChange={(e) => update("timer_enabled", e.target.checked)}
                  />
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Format awal
                  <select
                    className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                    value={prefs.mode}
                    onChange={(e) =>
                      update("mode", e.target.value as Preferences["mode"])
                    }
                  >
                    {modeOptions.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="font-metadata text-metadata text-text-secondary">
                  Timer dapat dimatikan kapan saja tanpa mengurangi hasil
                  latihan.
                </p>
              </section>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-space-lg lg:sticky lg:top-24">
              <div className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                    <span className="font-card-title text-card-title text-primary">
                      Pratinjau Tampilan Nyata
                    </span>
                  </div>
                  <span className="font-metadata text-[12px] text-text-secondary bg-surface-container px-2 py-0.5 rounded-full">
                    Simulasi Bab 4 Matematika
                  </span>
                </div>

                <div className="flex items-center justify-between bg-surface-container-low px-space-sm py-1.5 rounded-xl text-primary font-metadata text-[12px]">
                  <button
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-secondary-container text-primary font-label transition-colors"
                    id="preview-tts-play"
                    type="button"
                    onClick={speak}
                  >
                    {"Uji suara baca"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-container font-bold text-primary"
                      id="btn-quick-smaller"
                      title="Kecilkan Teks"
                      type="button"
                      onClick={() =>
                        update("font_size", Math.max(14, prefs.font_size - 1))
                      }
                    >
                      A-
                    </button>
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-container font-bold text-primary"
                      id="btn-quick-bigger"
                      title="Besarkan Teks"
                      type="button"
                      onClick={() =>
                        update("font_size", Math.min(32, prefs.font_size + 1))
                      }
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div
                  className="relative rounded-xl p-space-lg bg-[#FAF9F4] text-primary transition-all duration-200 overflow-hidden min-h-[280px] shadow-inner"
                  id="live-reader-box"
                >
                  <div
                    className="pointer-events-none absolute left-0 right-0 top-[68px] h-9 bg-primary/10 rounded border-y border-primary/20 transition-all duration-300"
                    id="preview-reading-ruler"
                    hidden={!prefs.reading_ruler}
                  ></div>

                  <div className="flex items-center justify-between mb-space-sm text-text-secondary text-[12px] font-metadata">
                    <span className="uppercase tracking-wider font-semibold">
                      Teorema Pythagoras • SMP Kelas 8
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        aria-hidden="true"
                      >
                        timer
                      </span>{" "}
                      3 menit
                    </span>
                  </div>
                  <h3
                    className="text-[22px] font-bold text-primary leading-tight mb-space-sm transition-all"
                    id="preview-heading"
                  >
                    1. Mengenal Unsur Segitiga Siku-Siku
                  </h3>

                  <p
                    className="font-body text-[20px] leading-[1.75] text-contrast-ink tracking-normal transition-all"
                    id="preview-paragraph"
                    style={previewStyle}
                  >
                    <span
                      className="bg-butter/70 rounded px-1 transition-colors"
                      id="preview-sentence-highlight"
                    >
                      Pada segitiga siku-siku, sisi miring yang berhadapan
                      langsung dengan sudut 90° disebut sebagai hipotenusa.
                    </span>
                    Hubungan kuadrat panjang sisi-sisinya dirumuskan secara
                    elegan sebagai{" "}
                    <strong className="font-bold text-primary">
                      a² + b² = c²
                    </strong>
                    . Kita dapat menentukan panjang sisi yang belum diketahui
                    dengan mudah melalui perbandingan tersebut.
                  </p>

                  <div className="mt-space-md pt-space-sm border-t border-divider flex items-center justify-between text-[12px] text-text-secondary font-metadata">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-secondary text-[16px]"
                        aria-hidden="true"
                      >
                        visibility
                      </span>
                      <span id="preview-status-font">{`${prefs.font_family} • ${prefs.font_size}px • Baris ${prefs.line_height}`}</span>
                    </span>
                    <span className="text-success font-semibold">
                      Ramah Disleksia &amp; ADHD
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-container/50 rounded-2xl p-space-md flex items-center gap-space-md shadow-xs">
                <div className="w-24 h-24 shrink-0 rounded-2xl bg-surface p-1 flex items-center justify-center overflow-hidden shadow-xs">
                  <Image
                    src="/design/mimo.png"
                    width={1024}
                    height={1024}
                    alt="Mimo, teman belajarmu"
                    className="w-20 h-20 object-contain"
                  ></Image>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-secondary">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      favorite
                    </span>
                    <span className="font-label text-[13px] font-bold">
                      Pesan Hangat dari Mimo
                    </span>
                  </div>
                  <p className="font-mimo-voice text-mimo-voice text-primary text-[15px] leading-snug">
                    “Kenyamananmu adalah nomor satu! Setiap mata dan cara kerja
                    otak itu unik. Kalau kamu merasa hurufnya kekecilan atau
                    warna layarnya terlalu silau, atur sesukamu di sini. Mimo
                    selalu menyesuaikan diri dengan gayamu!”
                  </p>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                <div className="flex items-center gap-space-xs text-primary font-label text-label">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px]"
                    aria-hidden="true"
                  >
                    keyboard
                  </span>
                  <span>Pintasan Keyboard &amp; Screen Reader</span>
                </div>
                <div className="grid grid-cols-2 gap-space-xs text-[12px]">
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-text-secondary font-metadata">
                      Menu Cepat
                    </span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface shadow-xs font-semibold text-primary">
                      Alt + A
                    </kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-text-secondary font-metadata">
                      Penggaris Baca
                    </span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface shadow-xs font-semibold text-primary">
                      Alt + R
                    </kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-text-secondary font-metadata">
                      Audio Mimo
                    </span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface shadow-xs font-semibold text-primary">
                      Spasi
                    </kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <span className="text-text-secondary font-metadata">
                      Pindah Fokus
                    </span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface shadow-xs font-semibold text-primary">
                      Tab / Shift
                    </kbd>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container flex items-start gap-2 text-text-secondary font-metadata text-[11px] leading-relaxed">
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    shield
                  </span>
                  <span>
                    Semua preferensi ini disimpan di perambanmu secara lokal dan{" "}
                    <strong>tidak pernah</strong> dianalisis sebagai diagnosis
                    medis atau label kecerdasan.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-30 w-full bg-surface/95 backdrop-blur-md rounded-2xl p-space-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs text-success font-metadata text-[13px]">
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                check_circle
              </span>
              <span className="font-medium">
                Perubahan langsung aktif dan tersimpan secara lokal di
                komputermu
              </span>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-space-md py-2.5 rounded-xl bg-surface-container text-primary font-label text-label hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-focus"

                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-space-md py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-label text-label hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-focus"

                onClick={() => setTab("profile")}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  auto_stories
                </span>
                <span>Profil & tujuan</span>
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-focus"
                id="btn-save-bottom"
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
                <span>Terapkan &amp; Simpan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg pb-space-xxl">
          <nav
            aria-label="Jejak Navigasi"
            className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata"
          >
            <button
              className="hover:text-primary transition-colors flex items-center gap-1"
              data-path="beranda"
              type="button"
              onClick={() => setTab("accessibility")}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                home
              </span>
              <span>Beranda</span>
            </button>
            <span className="text-outline-variant">/</span>
            <button
              className="hover:text-primary transition-colors"
              data-path="pengaturan-aksesibilitas"
              type="button"
              onClick={() => setTab("accessibility")}
            >
              Pengaturan
            </button>
            <span className="text-outline-variant">/</span>
            <span aria-current="page" className="text-primary font-semibold">
              Profil &amp; Preferensi Akun
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="space-y-1">
              <div className="flex items-center gap-space-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px]">
                  Layar 24 • Batch 5
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-metadata text-[11px] text-text-secondary">
                  Pusat Kendali Diri
                </span>
              </div>
              <h1 className="font-page-title text-page-title text-primary tracking-tight">
                Profil &amp; Preferensi Belajar
              </h1>
              <p className="font-body text-body text-text-secondary max-w-3xl">
                Kelola tujuan belajarmu, alokasi waktu luang santai, mata
                pelajaran prioritas, dan kendali privasi data secara transparan
                tanpa tekanan.
              </p>
            </div>
            <div className="flex items-center gap-space-sm shrink-0 self-start lg:self-center">
              <button
                className="inline-flex items-center gap-space-xs h-11 px-space-md rounded-xl bg-surface text-primary font-label text-label shadow-sm hover:bg-surface-container transition-colors focus:ring-2 focus:ring-focus outline-none"
                data-path="pengaturan-aksesibilitas"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  tune
                </span>
                <span>Aksesibilitas</span>
              </button>
              <button
                className="inline-flex items-center gap-space-xs h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label shadow-md hover:bg-primary-hover active:bg-primary-pressed transition-all focus:ring-2 focus:ring-focus outline-none"
                id="topSaveBtn"
                type="submit"
                disabled={busy}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-surface p-space-lg shadow-sm">
            <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center font-display text-page-title text-primary">
              {value.display_name.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="font-section-title text-section-title text-primary">
              {value.display_name}
            </h2>
            <label className="flex flex-col gap-space-xs font-label text-label text-primary">
              Nama panggilan
              <input
                required
                maxLength={80}
                className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                value={value.display_name}
                onChange={(e) =>
                  setValue({ ...value, display_name: e.target.value })
                }
              />
            </label>
            <label className="flex flex-col gap-space-xs font-label text-label text-primary">
              Zona waktu
              <select
                className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                value={value.timezone}
                onChange={(e) =>
                  setValue({ ...value, timezone: e.target.value })
                }
              >
                {["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"].map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </label>
            <p className="font-body text-body text-text-secondary">
              {account.user.is_anonymous
                ? "Akun demo anonim. Simpan akses perangkat ini agar progres tetap bisa dibuka."
                : account.user.email}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={signOut}
              className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
            >
              Keluar dari akun
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-8 space-y-space-lg">
              <section className="rounded-2xl bg-surface p-space-lg shadow-sm space-y-space-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Target Waktu Harian & Batas Nyaman
                </h2>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Waktu harian (menit)
                  <input
                    required
                    type="number"
                    min={5}
                    max={240}
                    className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                    value={value.daily_minutes}
                    onChange={(e) =>
                      setValue({ ...value, daily_minutes: +e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Tujuan belajar
                  <textarea
                    maxLength={500}
                    className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                    value={value.goal}
                    onChange={(e) =>
                      setValue({ ...value, goal: e.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Tanggal ujian (opsional)
                  <input
                    type="date"
                    className="p-space-sm rounded-xl bg-surface-container-low text-primary w-full"
                    value={value.exam_date || ""}
                    onChange={(e) =>
                      setValue({ ...value, exam_date: e.target.value || null })
                    }
                  />
                </label>
                <fieldset>
                  <legend className="font-label text-label text-primary">
                    Hari belajar pilihan
                  </legend>
                  <div className="flex flex-wrap gap-space-sm mt-space-sm">
                    {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                      (d, i) => (
                        <label
                          key={d}
                          className="p-space-sm rounded-xl bg-surface-container-low text-primary"
                        >
                          <input
                            type="checkbox"
                            checked={value.available_days.includes(i)}
                            onChange={(e) =>
                              setValue({
                                ...value,
                                available_days: e.target.checked
                                  ? [...value.available_days, i]
                                  : value.available_days.filter((x) => x !== i),
                              })
                            }
                          />
                          {d}
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>
              </section>

              <section className="rounded-2xl bg-surface p-space-lg shadow-sm space-y-space-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Mata Pelajaran & Topik Prioritas
                </h2>
                <div className="grid grid-cols-2 gap-space-sm">
                  {[
                    "Matematika",
                    "IPA",
                    "Bahasa Indonesia",
                    "Bahasa Inggris",
                    "IPS",
                  ].map((s) => (
                    <label
                      key={s}
                      className="flex gap-space-sm p-space-md rounded-xl bg-surface-container-low text-primary font-label text-label"
                    >
                      <input
                        type="checkbox"
                        checked={value.subjects.includes(s)}
                        onChange={(e) =>
                          setValue({
                            ...value,
                            subjects: e.target.checked
                              ? [...value.subjects, s]
                              : value.subjects.filter((x) => x !== s),
                          })
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-surface p-space-lg shadow-sm space-y-space-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Mode Belajar Bawaan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  {modeOptions.map(([v, t]) => (
                    <label
                      key={v}
                      className="flex gap-space-sm p-space-md rounded-xl bg-surface-container-low text-primary font-label text-label"
                    >
                      <input
                        type="radio"
                        name="learning_style"
                        checked={prefs.mode === v}
                        onChange={() => update("mode", v)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
                <p className="font-metadata text-metadata text-text-secondary">
                  Ketersediaan format mengikuti isi materi. Kamu selalu bisa
                  mengganti format saat belajar.
                </p>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-space-lg">
              <div className="rounded-2xl bg-secondary-container p-space-lg shadow-sm space-y-space-md relative overflow-hidden">
                <div className="flex items-center gap-space-sm">
                  <div className="w-14 h-14 rounded-2xl bg-surface p-1 shadow-sm shrink-0 flex items-center justify-center">
                    <Image
                      src="/design/mimo.png"
                      alt="Mimo, teman belajarmu"
                      width={1024}
                      height={1024}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-mimo-voice text-mimo-voice text-primary">
                      Mimo si Bunglon
                    </span>
                    <p className="font-metadata text-[12px] text-on-secondary-container">
                      Pendamping Belajar Pribadimu
                    </p>
                  </div>
                </div>

                <div className="relative bg-surface p-space-md rounded-2xl shadow-sm text-primary space-y-space-xs">
                  <p className="font-body text-[14px] leading-relaxed text-on-surface">
                    “Hai {value.display_name}! Pengaturan profil di sini
                    sepenuhnya milikmu. Mau belajar 10 menit atau 20 menit
                    sehari, yang terpenting adalah kenyamananmu. Tidak ada
                    tuntutan ranking atau perbandingan dengan siapa pun di
                    TemanBelajar!”
                  </p>
                  <div className="pt-2 flex items-center justify-between text-secondary">
                    <span className="font-metadata text-[11px]">
                      Ruang Bebas Cemas 🌿
                    </span>
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      sentiment_satisfied
                    </span>
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    className="inline-flex items-center justify-center gap-space-xs w-full py-2.5 px-space-md rounded-xl bg-surface/80 hover:bg-surface text-primary font-label text-[13px] shadow-sm transition-all focus:ring-2 focus:ring-focus outline-none"
                    type="button"
                    onClick={() => setTab("accessibility")}
                  >
                    <span
                      className="material-symbols-outlined text-[18px] text-secondary"
                      aria-hidden="true"
                    >
                      chat_bubble
                    </span>
                    <span>Sesuaikan aksesibilitas</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-surface p-space-lg shadow-sm space-y-space-md">
                <h2 className="font-section-title text-section-title text-primary">
                  Kendali Preferensi & Data
                </h2>
                <p className="font-body text-body text-text-secondary">
                  Preferensi yang disimpan akan dipakai saat kamu membuka sesi
                  berikutnya.
                </p>
                <button
                  type="button"
                  onClick={exportProfile}
                  className="h-11 px-space-md rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-secondary-container"
                >
                  Unduh preferensi (.JSON)
                </button>
                <p className="font-metadata text-metadata text-text-secondary">
                  Ekspor ini berisi profil dan preferensi yang terlihat di
                  halaman ini.
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-30 p-space-md rounded-2xl bg-surface/95 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <button
                className="inline-flex items-center gap-space-xs text-text-secondary hover:text-primary font-label text-label transition-colors"
                data-path="beranda"
                type="button"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                <span>Kembali ke Beranda</span>
              </button>
              <span className="text-outline-variant hidden sm:inline">•</span>
              <button
                className="inline-flex items-center gap-space-xs text-text-secondary hover:text-primary font-label text-label transition-colors"
                data-path="pengaturan-aksesibilitas"
                type="button"
                onClick={() => setTab("accessibility")}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  accessibility_new
                </span>
                <span>Pengaturan Aksesibilitas</span>
              </button>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs h-11 px-space-xl rounded-xl bg-primary text-on-primary font-label text-label shadow-md hover:bg-primary-hover active:bg-primary-pressed transition-all focus:ring-2 focus:ring-focus outline-none"
                id="saveAllBtn"
                type="submit"
                disabled={busy}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  save
                </span>
                <span>Simpan Semua Preferensi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

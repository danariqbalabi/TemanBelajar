"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultProfile, type Profile, type Preferences } from "@/lib/types";
export function OnboardingDesign({
  initial,
  onSave,
  busy,
  error,
  onBack,
}: {
  initial: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
  onBack?: () => void;
}) {
  const [step, setStep] = useState(0),
    [value, setValue] = useState(initial),
    [needs, setNeeds] = useState(["membaca"]),
    [issue, setIssue] = useState("");
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [],
  );
  function goto(next: number) {
    if (!value.display_name.trim()) {
      setIssue("Isi nama panggilan terlebih dahulu.");
      return;
    }
    setIssue("");
    setStep(next);
    window.scrollTo({ top: 0 });
  }
  function finish() {
    onSave({
      ...value,
      display_name: value.display_name.trim(),
      onboarding_step: 4,
    });
  }
  function pref(p: Partial<Preferences>) {
    setValue({ ...value, preferences: { ...value.preferences, ...p } });
  }
  function toggleNeed(key: string) {
    setNeeds(
      needs.includes(key) ? needs.filter((n) => n !== key) : [...needs, key],
    );
    if (key === "membaca")
      pref({
        reading_ruler: !value.preferences.reading_ruler,
        mode: "reading",
      });
    if (key === "fokus") pref({ reduced_motion: true, mode: "focus" });
    if (key === "audio") pref({ mode: "transcript" });
    if (key === "deskripsi") pref({ mode: "explore" });
    if (key === "biasa") pref({ mode: "standard" });
  }
  function toggleSubject(s: string) {
    setValue({
      ...value,
      subjects: value.subjects.includes(s)
        ? value.subjects.filter((x) => x !== s)
        : [...value.subjects, s],
    });
  }
  function toggleDay(day: number) {
    setValue({
      ...value,
      available_days: value.available_days.includes(day)
        ? value.available_days.filter((x) => x !== day)
        : [...value.available_days, day],
    });
  }
  function speak() {
    if (!("speechSynthesis" in window)) {
      setIssue("Baca nyaring belum tersedia di browser ini.");
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      "Cahaya menyediakan energi untuk fotosintesis. Klorofil membantu menyerap energi cahaya.",
    );
    speech.lang = "id-ID";
    speech.rate = value.preferences.speech_rate;
    speechSynthesis.speak(speech);
  }
  return (
    <div className="stitch-shell stitch-onboarding bg-canvas min-h-screen">
      <header className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
        <Image
          src="/design/logo-revamp.png"
          alt="TemanBelajar"
          width={640}
          height={240}
          className="h-12 w-auto object-contain"
        />
        {onBack && (
          <button
            onClick={onBack}
            className="min-h-[44px] px-4 rounded-xl bg-surface"
          >
            Kembali ke beranda
          </button>
        )}
        <span>Langkah {step + 1}/4</span>
      </header>
      {(error || issue) && (
        <p role="alert" className="max-w-5xl mx-auto p-4 text-error">
          {error || issue}
        </p>
      )}
      {step === 0 && (
        <div className="stitch-screen revamp-onboarding max-w-6xl mx-auto px-4 py-8">
          <label className="block text-sm font-semibold mb-6">
            Nama panggilan
            <input
              required
              maxLength={80}
              value={value.display_name}
              onChange={(e) =>
                setValue({ ...value, display_name: e.target.value })
              }
              className="block w-full mt-2 p-3 rounded-xl bg-surface"
            />
          </label>
          <div className="flex flex-col w-full">
            <div className="relative w-full overflow-hidden">
              <div className="absolute -top-32 -left-24 w-96 h-96 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute top-1/2 -right-32 w-80 h-80 bg-butter/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="max-w-[1040px] mx-auto px-margin-mobile sm:px-gutter py-space-md sm:py-space-lg flex flex-col gap-space-lg sm:gap-space-xl">
                <header className="w-full bg-surface/90 backdrop-blur-md rounded-2xl p-space-md sm:p-space-lg shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
                    <Image
                      src="/design/mimo-welcome.png"
                      alt="TemanBelajar Logo"
                      className="h-9 w-auto object-contain"
                      width={1024}
                      height={1024}
                    ></Image>
                  </div>

                  <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden relative">
                    <div
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={25}
                      className="bg-secondary-container h-full rounded-full transition-all duration-500 ease-out relative"
                      role="progressbar"
                      style={{ width: "25%" }}
                    >
                      <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                    </div>
                  </div>
                </header>

                <section
                  aria-labelledby="mimo-heading"
                  className="relative w-full bg-gradient-to-r from-surface-container to-surface-container-low rounded-2xl p-space-md sm:p-space-lg shadow-sm overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-space-md sm:gap-space-lg">
                    <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container shadow-md">
                      <Image
                        src="/design/mimo-welcome.png"
                        alt="Mimo"
                        className="w-full h-full object-contain rounded-full"
                        width={1024}
                        height={1024}
                      ></Image>
                      <div className="absolute -bottom-1 -right-1 bg-peach text-contrast-ink text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                        Mimo
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="font-metadata text-metadata text-text-secondary uppercase tracking-wider mb-1 font-bold">
                        Sahabat Belajarmu
                      </p>
                      <h1
                        className="font-mimo-voice text-card-title sm:text-section-title text-primary font-extrabold leading-snug"
                        id="mimo-heading"
                      >
                        {"\n              “Biar belajarnya makin nyaman, {NAME} biasanya paling terbantu sama cara apa?”\n            ".replace(
                          "{NAME}",
                          value.display_name,
                        )}
                      </h1>
                    </div>
                    <div className="hidden md:flex flex-col items-end shrink-0 self-center bg-surface/80 px-3 py-2 rounded-xl">
                      <span className="font-metadata text-[12px] text-text-secondary">
                        Personalisasi Otomatis
                      </span>
                      <span className="font-label text-metadata text-primary font-bold">
                        Kurikulum Merdeka
                      </span>
                    </div>
                  </div>
                </section>

                <section aria-label="Pilihan Kebutuhan Belajar">
                  <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-space-md sm:gap-space-lg m-0 p-0 border-none">
                    <legend className="sr-only">
                      Pilih metode bantuan belajar yang sesuai kebutuhan Anda
                    </legend>

                    <label
                      className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-secondary-container text-primary shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-focus"
                      style={{ boxShadow: "inset 0 0 0 2px #273B35" }}
                    >
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="bantuan-membaca"
                        checked={needs.includes("membaca")}
                        onChange={() => toggleNeed("membaca")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface/90 text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          menu_book
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Bantuan Membaca
                          </span>
                        </div>
                        <p className="font-body text-label text-on-surface-variant font-medium line-clamp-2">
                          Penggaris baca, spasi teks lapang, sorot kata
                        </p>
                      </div>

                      <div className="check-badge absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-secondary-container text-primary shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-focus"
                      style={{ boxShadow: "inset 0 0 0 2px #273B35" }}
                    >
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="fokus-selangkah"
                        checked={needs.includes("fokus")}
                        onChange={() => toggleNeed("fokus")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface/90 text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          headphones
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Fokus Selangkah demi Selangkah
                          </span>
                        </div>
                        <p className="font-body text-label text-on-surface-variant font-medium line-clamp-2">
                          1 instruksi per layar, minim distraksi visual
                        </p>
                      </div>

                      <div className="check-badge absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>

                    <label className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-surface text-on-surface shadow-sm hover:shadow-md hover:bg-surface-container-low focus-within:ring-2 focus-within:ring-focus">
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="mendengarkan-audio"
                        checked={needs.includes("audio")}
                        onChange={() => toggleNeed("audio")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          volume_up
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Mendengarkan Audio
                          </span>
                        </div>
                        <p className="font-body text-label text-text-secondary font-medium line-clamp-2">
                          Penjelasan narasi suara santai dan jernih
                        </p>
                      </div>

                      <div className="check-badge hidden absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>

                    <label className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-surface text-on-surface shadow-sm hover:shadow-md hover:bg-surface-container-low focus-within:ring-2 focus-within:ring-focus">
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="visual-deskripsi"
                        checked={needs.includes("deskripsi")}
                        onChange={() => toggleNeed("deskripsi")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          image
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Visual &amp; Deskripsi Gambar
                          </span>
                        </div>
                        <p className="font-body text-label text-text-secondary font-medium line-clamp-2">
                          Diagram interaktif dan bantuan teks visual
                        </p>
                      </div>

                      <div className="check-badge hidden absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>

                    <label className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-surface text-on-surface shadow-sm hover:shadow-md hover:bg-surface-container-low focus-within:ring-2 focus-within:ring-focus">
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="teks-kartu-langkah"
                        checked={needs.includes("kartu")}
                        onChange={() => toggleNeed("kartu")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          view_timeline
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Teks &amp; Kartu Langkah
                          </span>
                        </div>
                        <p className="font-body text-label text-text-secondary font-medium line-clamp-2">
                          Poin-poin ringkas dengan visualisasi terstruktur
                        </p>
                      </div>

                      <div className="check-badge hidden absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>

                    <label className="group relative cursor-pointer select-none rounded-2xl p-space-lg transition-all duration-200 min-h-[140px] flex items-start gap-space-md bg-surface text-on-surface shadow-sm hover:shadow-md hover:bg-surface-container-low focus-within:ring-2 focus-within:ring-focus">
                      <input
                        className="sr-only choice-checkbox"
                        name="kebutuhan"
                        type="checkbox"
                        value="belajar-standar"
                        checked={needs.includes("biasa")}
                        onChange={() => toggleNeed("biasa")}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <span
                          className="material-symbols-outlined text-[32px]"
                          aria-hidden="true"
                        >
                          bolt
                        </span>
                      </div>
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-space-xs mb-1">
                          <span className="font-card-title text-card-title font-bold leading-tight truncate">
                            Belajar Seperti Biasa
                          </span>
                        </div>
                        <p className="font-body text-label text-text-secondary font-medium line-clamp-2">
                          Tampilan standar nyaman tanpa bantuan khusus
                        </p>
                      </div>

                      <div className="check-badge hidden absolute top-space-md right-space-md w-7 h-7 rounded-full bg-primary-container text-on-primary items-center justify-center shadow-sm">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                    </label>
                  </fieldset>
                </section>

                <footer className="w-full flex flex-col gap-space-md mt-space-sm pt-space-md bg-surface/60 backdrop-blur-sm rounded-2xl p-space-md sm:p-space-lg">
                  <div className="flex items-center gap-space-sm text-text-secondary">
                    <span
                      className="material-symbols-outlined text-warning text-[22px] shrink-0"
                      aria-hidden="true"
                    >
                      lightbulb
                    </span>
                    <p className="font-body text-metadata sm:text-label">
                      Pilihan ini santai dan bisa Manda ganti kapan pun di menu{" "}
                      <strong>Pengaturan</strong>.
                    </p>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-space-xl py-space-sm rounded-xl font-label text-label text-text-secondary hover:text-primary hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      data-path="onboarding-skip"
                      type="button"
                      onClick={() => goto(1)}
                      aria-label="Lewati kebutuhan belajar"
                    >
                      Lewati Dulu
                    </button>

                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm min-h-[52px] px-space-xl py-space-sm rounded-xl bg-primary-container hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus font-bold"
                      data-path="preferensi-tampilan"
                      id="btn-lanjut"
                      type="button"
                      onClick={() => goto(1)}
                      aria-label="Lanjut ke langkah berikutnya"
                    >
                      <span id="btn-lanjut-text">
                        Lanjut ke Preferensi Tampilan (2 Terpilih)
                      </span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="stitch-screen revamp-onboarding max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col w-full">
            <div className="max-w-[1240px] w-full mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
              <header className="flex flex-col gap-space-sm">
                <div
                  aria-label="Progres orientasi belajar: 50 persen"
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={50}
                  className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden"
                  role="progressbar"
                ></div>
              </header>

              <section className="flex items-start sm:items-center gap-space-md bg-surface-container-low p-space-md rounded-2xl shadow-sm">
                <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-secondary-container flex items-center justify-center shadow-sm">
                  <Image
                    src="/design/mimo-5.png"
                    alt="Mimo si Pendamping Belajar"
                    className="w-full h-full object-cover rounded-full"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata text-metadata uppercase tracking-wider text-text-secondary font-bold">
                    Mimo si Pendamping Belajar
                  </span>
                  <p className="font-mimo-voice text-card-title text-contrast-ink tracking-tight mt-0.5">
                    {'\n          "{NAME} mau tampilan bacanya diatur seperti apa biar mata nggak gampang lelah?"\n        '.replace(
                      "{NAME}",
                      value.display_name,
                    )}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <section className="lg:col-span-6 flex flex-col gap-space-lg bg-surface p-space-lg rounded-2xl shadow-sm">
                  <fieldset className="flex flex-col gap-space-xs">
                    <legend className="font-label text-label text-primary font-bold flex items-center gap-space-xs mb-1">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px] text-secondary"
                      >
                        format_size
                      </span>
                      Ukuran Teks
                    </legend>
                    <div
                      aria-label="Pilihan ukuran teks"
                      className="grid grid-cols-3 gap-space-xs sm:gap-space-sm"
                      role="radiogroup"
                    >
                      <button
                        aria-checked={value.preferences.font_size === 16}
                        className="size-chip min-h-[48px] px-space-xs py-space-sm flex flex-col items-center justify-center rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-size="16"
                        role="radio"
                        type="button"
                        onClick={() => pref({ font_size: 16 })}
                      >
                        <span className="font-label text-label">Sedang</span>
                        <span className="font-metadata text-[12px] opacity-75">
                          16px
                        </span>
                      </button>
                      <button
                        aria-checked={value.preferences.font_size === 18}
                        className="size-chip min-h-[48px] px-space-xs py-space-sm flex flex-col items-center justify-center rounded-xl bg-primary-container text-on-primary transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-size="18"
                        role="radio"
                        type="button"
                        onClick={() => pref({ font_size: 18 })}
                      >
                        <span className="font-label text-label">Nyaman</span>
                        <span className="font-metadata text-[12px] text-on-primary-container">
                          18px • Aktif
                        </span>
                      </button>
                      <button
                        aria-checked={value.preferences.font_size === 20}
                        className="size-chip min-h-[48px] px-space-xs py-space-sm flex flex-col items-center justify-center rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-size="20"
                        role="radio"
                        type="button"
                        onClick={() => pref({ font_size: 20 })}
                      >
                        <span className="font-label text-label">Besar</span>
                        <span className="font-metadata text-[12px] opacity-75">
                          20px
                        </span>
                      </button>
                    </div>
                  </fieldset>

                  <fieldset className="flex flex-col gap-space-xs">
                    <legend className="font-label text-label text-primary font-bold flex items-center gap-space-xs mb-1">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px] text-secondary"
                      >
                        format_line_spacing
                      </span>
                      Jarak Baris Kalimat
                    </legend>
                    <div
                      aria-label="Pilihan jarak baris"
                      className="grid grid-cols-2 gap-space-sm"
                      role="radiogroup"
                    >
                      <button
                        aria-checked={value.preferences.line_height === 1.4}
                        className="spacing-chip min-h-[48px] px-space-md py-space-sm flex items-center justify-center gap-space-xs rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-spacing="normal"
                        role="radio"
                        type="button"
                        onClick={() => pref({ line_height: 1.4 })}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          density_small
                        </span>
                        <span className="font-label text-label">
                          Normal (1.4x)
                        </span>
                      </button>
                      <button
                        aria-checked={value.preferences.line_height === 1.7}
                        className="spacing-chip min-h-[48px] px-space-md py-space-sm flex items-center justify-center gap-space-xs rounded-xl bg-primary-container text-on-primary shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-spacing="spacious"
                        role="radio"
                        type="button"
                        onClick={() => pref({ line_height: 1.7 })}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          density_medium
                        </span>
                        <span className="font-label text-label">
                          Lapang (1.7x) • Aktif
                        </span>
                      </button>
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-space-sm">
                    <span className="font-label text-label text-primary font-bold">
                      Bantuan Fokus &amp; Sensorik
                    </span>

                    <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[22px] text-secondary"
                        >
                          highlight
                        </span>
                        <div className="flex flex-col">
                          <label
                            className="font-label text-label text-on-surface cursor-pointer font-bold"
                            htmlFor="toggle-ruler"
                          >
                            Sorot Kalimat Aktif (Reading Ruler)
                          </label>
                          <span className="font-metadata text-metadata text-text-secondary">
                            Pita warna lembut mengikuti kalimat yang dibaca
                          </span>
                        </div>
                      </div>
                      <button
                        aria-checked={value.preferences.reading_ruler}
                        className="shrink-0 w-12 h-7 bg-primary-container rounded-full p-1 transition-colors relative focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        id="toggle-ruler"
                        role="switch"
                        type="button"
                        onClick={() =>
                          pref({
                            reading_ruler: !value.preferences.reading_ruler,
                          })
                        }
                        aria-label="Penggaris baca"
                      >
                        <span className="block w-5 h-5 bg-surface rounded-full shadow-md transform translate-x-5 transition-transform"></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[22px] text-secondary"
                        >
                          volume_up
                        </span>
                        <div className="flex flex-col">
                          <label
                            className="font-label text-label text-on-surface cursor-pointer font-bold"
                            htmlFor="toggle-tts"
                          >
                            Tombol Bacakan Otomatis
                          </label>
                          <span className="font-metadata text-metadata text-text-secondary">
                            Siapkan suara pemandu ramah di sisi materi
                          </span>
                        </div>
                      </div>
                      <button
                        aria-checked={value.preferences.captions}
                        className="shrink-0 w-12 h-7 bg-primary-container rounded-full p-1 transition-colors relative focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        id="toggle-tts"
                        role="switch"
                        type="button"
                        onClick={() =>
                          pref({ captions: !value.preferences.captions })
                        }
                        aria-label="Tampilkan transkrip"
                      >
                        <span className="block w-5 h-5 bg-surface rounded-full shadow-md transform translate-x-5 transition-transform"></span>
                      </button>
                    </div>
                  </div>

                  <fieldset className="flex flex-col gap-space-xs">
                    <legend className="font-label text-label text-primary font-bold flex items-center gap-space-xs mb-1">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px] text-secondary"
                      >
                        palette
                      </span>
                      Tema Kontras Ruang Baca
                    </legend>
                    <div
                      aria-label="Tema kontras teks"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm"
                      role="radiogroup"
                    >
                      <button
                        aria-checked={value.preferences.high_contrast === false}
                        className="contrast-card p-space-md rounded-xl bg-background text-on-surface shadow-sm ring-2 ring-primary flex items-start gap-space-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-contrast="warm"
                        role="radio"
                        type="button"
                        onClick={() => pref({ high_contrast: false })}
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface border-0 flex items-center justify-center shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px] text-secondary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                            aria-hidden="true"
                          >
                            light_mode
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label text-label font-bold">
                            Krem Hangat
                          </span>
                          <span className="font-metadata text-[12px] text-text-secondary">
                            Standar zine editorial ramah fotofobia
                          </span>
                        </div>
                      </button>
                      <button
                        aria-checked={value.preferences.high_contrast === true}
                        className="contrast-card p-space-md rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container flex items-start gap-space-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        data-contrast="high"
                        role="radio"
                        type="button"
                        onClick={() => pref({ high_contrast: true })}
                      >
                        <div className="w-8 h-8 rounded-lg bg-inverse-surface text-inverse-on-surface flex items-center justify-center shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            contrast
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label text-label font-bold">
                            Kontras Tinggi
                          </span>
                          <span className="font-metadata text-[12px] text-text-secondary">
                            Tinta tajam untuk ketegasan ekstra
                          </span>
                        </div>
                      </button>
                    </div>
                  </fieldset>
                </section>

                <section className="lg:col-span-6 flex flex-col gap-space-sm sticky top-24">
                  <div className="flex items-center justify-between px-space-xs">
                    <span className="font-metadata text-metadata font-bold tracking-wider uppercase text-text-secondary flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                      Pratinjau Langsung Materi
                    </span>
                    <span className="font-metadata text-[12px] bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-md font-semibold">
                      Tersinkronisasi Real-Time
                    </span>
                  </div>

                  <div
                    className="w-full bg-surface rounded-[16px] p-space-lg shadow-md transition-all duration-200 flex flex-col gap-space-md"
                    id="preview-box"
                  >
                    <div className="flex items-center justify-between pb-space-sm border-b-0 border-divider">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-metadata text-[12px] px-2 py-0.5 rounded-md bg-surface-container font-semibold text-text-secondary">
                          Matematika • Kelas VIII
                        </span>
                        <span className="font-metadata text-[12px] text-text-secondary">
                          Bab 3: Geometri
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-space-xs"
                        id="tts-widget"
                        style={{ display: "flex" }}
                      >
                        <button
                          aria-label="Putar narasi audio materi"
                          className="h-9 px-3 rounded-lg bg-surface-container-low hover:bg-secondary-container text-primary flex items-center gap-1 font-label text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                          type="button"
                          onClick={speak}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                            aria-hidden="true"
                          >
                            play_circle
                          </span>
                          <span>Dengarkan</span>
                        </button>
                      </div>
                    </div>

                    <article className="flex flex-col gap-space-sm font-reading">
                      <h2 className="font-card-title text-card-title font-bold text-primary flex items-center gap-space-xs">
                        <span>📐</span>
                        <span>Teorema Pythagoras</span>
                      </h2>
                      <p
                        className="p-space-xs rounded-lg bg-secondary-container text-on-secondary-fixed transition-all duration-200 font-medium text-[18px] leading-[1.7]"
                        id="preview-sentence-highlight"
                      >
                        Sisi miring (hipotenusa) selalu berada tepat di depan
                        sudut siku-siku sembilan puluh derajat.
                      </p>
                      <p
                        className="text-on-surface transition-all duration-200 opacity-90 text-[18px] leading-[1.7]"
                        id="preview-sentence-normal"
                        style={{
                          fontSize: value.preferences.font_size,
                          lineHeight: value.preferences.line_height,
                          letterSpacing:
                            value.preferences.letter_spacing + "em",
                        }}
                      >
                        Dalam segitiga siku-siku, kuadrat panjang hipotenusa
                        setara dengan jumlah kuadrat dari dua sisi siku-siku
                        lainnya. Hubungan ini dirumuskan sebagai{" "}
                        <span className="font-mono bg-surface-container-low px-1.5 py-0.5 rounded text-[15px]">
                          c² = a² + b²
                        </span>
                        .
                      </p>
                    </article>

                    <div className="mt-space-xs bg-surface-container-low p-space-md rounded-xl flex items-center justify-center">
                      <svg
                        aria-label="Ilustrasi segitiga siku-siku dengan sisi alas a, tinggi b, dan hipotenusa c"
                        className="w-full max-w-[260px] h-32"
                        fill="none"
                        viewBox="0 0 240 120"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <polygon
                          className="fill-secondary-container/40 stroke-primary"
                          points="50,100 190,100 50,20"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                        ></polygon>

                        <path
                          className="stroke-primary"
                          d="M 50 86 L 64 86 L 64 100"
                          fill="none"
                          strokeWidth="2"
                        ></path>

                        <text
                          className="fill-primary font-bold text-[14px]"
                          x="32"
                          y="65"
                        >
                          b
                        </text>
                        <text
                          className="fill-primary font-bold text-[14px]"
                          x="120"
                          y="116"
                        >
                          a
                        </text>
                        <text
                          className="fill-primary font-bold text-[14px]"
                          x="135"
                          y="55"
                        >
                          c (hipotenusa)
                        </text>
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-muted-gray text-[12px] pt-space-xs">
                      <span className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px] text-success"
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        {"Target aksesibilitas WCAG 2.2 AA"}
                      </span>
                      <span className="font-mono" id="applied-summary">
                        18px / Jarak 1.7x
                      </span>
                    </div>
                  </div>

                  <p
                    className="font-metadata text-metadata text-text-secondary px-space-xs"
                    style={{
                      fontSize: value.preferences.font_size,
                      lineHeight: value.preferences.line_height,
                      letterSpacing: value.preferences.letter_spacing + "em",
                    }}
                  >
                    {"\n          💡 Pengaturan ini bersifat fleksibel. {NAME} dapat menekan ikon huruf di pojok baca kapan pun untuk menyelaraskan kembali.\n        ".replace(
                      "{NAME}",
                      value.display_name,
                    )}
                  </p>
                </section>
              </div>

              <footer className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <button
                  className="w-full sm:w-auto min-h-[48px] px-space-lg rounded-xl bg-surface hover:bg-surface-container text-text-secondary hover:text-on-surface font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                  id="btn-reset"
                  type="button"
                  onClick={() => pref(defaultProfile.preferences)}
                >
                  Gunakan Pengaturan Awal
                </button>
                <div className="flex items-center gap-space-sm w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto min-h-[48px] px-space-xl rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold flex items-center justify-center gap-space-xs shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                    type="button"
                    onClick={() => goto(2)}
                    aria-label="Lanjut ke langkah berikutnya"
                  >
                    <span>Simpan &amp; Lanjut ke Tujuan Belajar</span>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]"
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="stitch-screen revamp-onboarding max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10">
              <header className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    className="inline-flex items-center gap-2 px-3 py-2 -ml-2 rounded-xl text-primary font-semibold hover:bg-surface-container transition-all active:scale-95 min-h-[44px]"
                    type="button"
                    onClick={() => goto(1)}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span className="text-sm">Kembali</span>
                  </button>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container font-medium text-xs text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span>Langkah 3 dari 4 : Target &amp; Waktu Belajar</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-secondary-container rounded-full transition-all duration-700 ease-out"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </header>

              <section className="relative bg-surface rounded-2xl shadow-sm p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none"></div>

                <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container/40 overflow-hidden shadow-sm">
                  <Image
                    src="/design/mimo-0.png"
                    alt="Mimo Waving"
                    className="w-full h-full object-cover rounded-full"
                    width={1024}
                    height={1024}
                  ></Image>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mimo-body opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm uppercase tracking-wider text-secondary">
                      Mimo si Bunglon
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-muted-gray font-medium">
                      Sahabat Belajarmu
                    </span>
                  </div>
                  <p className="font-bold text-lg sm:text-xl text-primary leading-snug">
                    {"\n          “Biar belajarnya nggak bikin kewalahan, kita atur ritme yang paling santai buat {NAME}, ya!”\n        ".replace(
                      "{NAME}",
                      value.display_name,
                    )}
                  </p>
                </div>
              </section>

              <form
                className="flex flex-col gap-8 sm:gap-10"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-gray flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-base text-secondary"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                      Blok 01 · Mata Pelajaran Utama
                    </label>
                    <span className="text-xs font-medium text-text-secondary">
                      Pilih yang mau difokuskan
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    id="subject-group"
                  >
                    <button
                      className="chip-item flex items-center justify-between gap-3 p-3.5 rounded-xl text-left bg-secondary-container text-primary font-bold shadow-sm transition-all min-h-[48px] active:scale-[0.98]"
                      type="button"
                      onClick={() => toggleSubject("Matematika")}
                      role="checkbox"
                      aria-checked={value.subjects.includes("Matematika")}
                    >
                      <span className="text-sm truncate">Matematika SMP 8</span>
                      <span
                        className="material-symbols-outlined text-lg shrink-0 check-icon"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                    </button>

                    <button
                      className="chip-item flex items-center justify-between gap-3 p-3.5 rounded-xl text-left bg-secondary-container text-primary font-bold shadow-sm transition-all min-h-[48px] active:scale-[0.98]"
                      type="button"
                      onClick={() => toggleSubject("IPA")}
                      role="checkbox"
                      aria-checked={value.subjects.includes("IPA")}
                    >
                      <span className="text-sm truncate">
                        IPA (Biologi &amp; Fisika)
                      </span>
                      <span
                        className="material-symbols-outlined text-lg shrink-0 check-icon"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                    </button>

                    <button
                      className="chip-item flex items-center justify-between gap-3 p-3.5 rounded-xl text-left bg-surface text-on-surface-variant font-medium shadow-sm hover:bg-surface-container-low transition-all min-h-[48px] active:scale-[0.98]"
                      type="button"
                      onClick={() => toggleSubject("Bahasa Indonesia")}
                      role="checkbox"
                      aria-checked={value.subjects.includes("Bahasa Indonesia")}
                    >
                      <span className="text-sm truncate">Bahasa Indonesia</span>
                      <span
                        className="material-symbols-outlined text-lg shrink-0 text-muted-gray/50 check-icon"
                        aria-hidden="true"
                      >
                        radio_button_unchecked
                      </span>
                    </button>

                    <button
                      className="chip-item flex items-center justify-between gap-3 p-3.5 rounded-xl text-left bg-surface text-on-surface-variant font-medium shadow-sm hover:bg-surface-container-low transition-all min-h-[48px] active:scale-[0.98]"
                      type="button"
                      onClick={() => toggleSubject("Bahasa Inggris")}
                      role="checkbox"
                      aria-checked={value.subjects.includes("Bahasa Inggris")}
                    >
                      <span className="text-sm truncate">Bahasa Inggris</span>
                      <span
                        className="material-symbols-outlined text-lg shrink-0 text-muted-gray/50 check-icon"
                        aria-hidden="true"
                      >
                        radio_button_unchecked
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-gray flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-base text-secondary"
                        aria-hidden="true"
                      >
                        schedule
                      </span>
                      Blok 02 · Durasi Belajar Harian
                    </label>
                    <span className="text-xs font-medium text-text-secondary">
                      Bisa diganti kapan saja
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    id="duration-cards"
                  >
                    <button
                      className="duration-card relative text-left p-5 sm:p-6 rounded-2xl bg-surface transition-all shadow-md active:scale-[0.99] flex flex-col justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      data-duration="10-15"
                      type="button"
                      onClick={() => setValue({ ...value, daily_minutes: 15 })}
                      aria-pressed={value.daily_minutes === 15}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-primary">
                          {"\n                Pilihan {NAME} 🌿\n              ".replace(
                            "{NAME}",
                            value.display_name,
                          )}
                        </span>
                        <span className="status-indicator flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary">
                          <span
                            className="material-symbols-outlined text-base"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-primary tracking-tight font-display">
                          10–15 Menit
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
                          Paling Santai &amp; Direkomendasikan
                        </p>
                      </div>

                      <div className="w-full flex items-center gap-2 pt-2">
                        <div className="h-1.5 flex-1 rounded-full bg-secondary-container"></div>
                        <div className="h-1.5 w-6 rounded-full bg-surface-container"></div>
                        <div className="h-1.5 w-6 rounded-full bg-surface-container"></div>
                      </div>
                    </button>

                    <button
                      className="duration-card relative text-left p-5 sm:p-6 rounded-2xl bg-surface/70 hover:bg-surface transition-all shadow-sm active:scale-[0.99] flex flex-col justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      data-duration="20-25"
                      type="button"
                      onClick={() => setValue({ ...value, daily_minutes: 25 })}
                      aria-pressed={value.daily_minutes === 25}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded text-muted-gray bg-surface-container">
                          Standar
                        </span>
                        <span className="status-indicator flex items-center justify-center w-7 h-7 rounded-full bg-surface-container text-muted-gray">
                          <span
                            className="material-symbols-outlined text-base opacity-40"
                            aria-hidden="true"
                          >
                            radio_button_unchecked
                          </span>
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-on-surface tracking-tight font-display">
                          20–25 Menit
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
                          Sedang &amp; Fokus Produktif
                        </p>
                      </div>
                      <div className="w-full flex items-center gap-2 pt-2">
                        <div className="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div className="h-1.5 w-6 rounded-full bg-surface-container"></div>
                      </div>
                    </button>

                    <button
                      className="duration-card relative text-left p-5 sm:p-6 rounded-2xl bg-surface/70 hover:bg-surface transition-all shadow-sm active:scale-[0.99] flex flex-col justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      data-duration="custom"
                      type="button"
                      onClick={() => setValue({ ...value, daily_minutes: 15 })}
                      aria-pressed={value.daily_minutes === 15}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded text-muted-gray bg-surface-container">
                          Eksploratif
                        </span>
                        <span className="status-indicator flex items-center justify-center w-7 h-7 rounded-full bg-surface-container text-muted-gray">
                          <span
                            className="material-symbols-outlined text-base opacity-40"
                            aria-hidden="true"
                          >
                            tune
                          </span>
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-on-surface tracking-tight font-display">
                          Atur Sendiri
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
                          Fleksibel Sesuai Energi Hari Itu
                        </p>
                      </div>
                      <div className="w-full flex items-center gap-2 pt-2">
                        <div className="h-1.5 flex-1 rounded-full bg-surface-container"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-surface-container"></div>
                        <div className="h-1.5 flex-1 rounded-full bg-surface-container"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-gray flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-base text-secondary"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      Blok 03 · Hari Belajar Pilihan
                    </label>
                    <span className="text-xs text-text-secondary font-medium">
                      Klik untuk menyalakan/mematikan hari
                    </span>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 bg-surface p-4 sm:p-5 rounded-2xl shadow-sm">
                    <button
                      aria-pressed={value.available_days.includes(0)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-primary text-on-primary shadow-sm active:scale-95"
                      type="button"
                      onClick={() => toggleDay(0)}
                    >
                      <span className="text-sm">Sen</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(1)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-primary text-on-primary shadow-sm active:scale-95"
                      type="button"
                      onClick={() => toggleDay(1)}
                    >
                      <span className="text-sm">Sel</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(2)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-primary text-on-primary shadow-sm active:scale-95"
                      type="button"
                      onClick={() => toggleDay(2)}
                    >
                      <span className="text-sm">Rab</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(3)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-primary text-on-primary shadow-sm active:scale-95"
                      type="button"
                      onClick={() => toggleDay(3)}
                    >
                      <span className="text-sm">Kam</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(4)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-surface-container text-muted-gray hover:bg-surface-container-high active:scale-95"
                      type="button"
                      onClick={() => toggleDay(4)}
                    >
                      <span className="text-sm">Jum</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(5)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-surface-container text-muted-gray hover:bg-surface-container-high active:scale-95"
                      type="button"
                      onClick={() => toggleDay(5)}
                    >
                      <span className="text-sm">Sab</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                    </button>

                    <button
                      aria-pressed={value.available_days.includes(6)}
                      className="day-pill flex-1 min-w-[48px] h-14 sm:h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold transition-all bg-surface-container text-muted-gray hover:bg-surface-container-high active:scale-95"
                      type="button"
                      onClick={() => toggleDay(6)}
                    >
                      <span className="text-sm">Min</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-5 pt-4">
                  <div className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-surface-container-low text-text-secondary text-xs sm:text-sm font-medium text-center">
                    <span className="text-base shrink-0">🌱</span>
                    <span>
                      {"Tidak ada penalti jika {NAME} melewatkan sesi atau sedang lelah.".replace(
                        "{NAME}",
                        value.display_name,
                      )}
                    </span>
                  </div>

                  <button
                    className="w-full sm:w-auto min-w-[320px] h-14 px-8 rounded-2xl bg-primary text-on-primary font-bold text-base flex items-center justify-center gap-3 shadow-md hover:bg-primary-hover active:bg-primary-pressed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    type="button"
                    onClick={() => goto(3)}
                    aria-label="Lanjut ke langkah berikutnya"
                  >
                    <span>
                      {"Lihat Rencana Belajar {NAME}".replace(
                        "{NAME}",
                        value.display_name,
                      )}
                    </span>
                    <span
                      className="material-symbols-outlined text-xl"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <label className="block">
              Waktu harian (menit)
              <input
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
              Tanggal ujian (opsional)
              <input
                type="date"
                value={value.exam_date || ""}
                onChange={(e) =>
                  setValue({ ...value, exam_date: e.target.value || null })
                }
              />
            </label>
            <label className="block sm:col-span-2">
              Tujuan belajar
              <textarea
                maxLength={500}
                value={value.goal}
                onChange={(e) => setValue({ ...value, goal: e.target.value })}
              />
            </label>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="stitch-screen revamp-onboarding max-w-6xl mx-auto px-4 py-8">
          <p className="p-4 mb-6 bg-butter/40 rounded-xl text-sm">
            Pratinjau alur belajar. Jadwal nyata bisa kamu susun di Rencana
            Belajar setelah menyimpan preferensi.
          </p>
          <div className="flex flex-col w-full">
            <section className="w-full bg-surface-container-low/70 py-space-md">
              <div className="max-w-[1140px] mx-auto px-gutter flex flex-col gap-space-sm">
                <div className="flex items-center justify-between gap-space-md">
                  <button
                    className="inline-flex items-center gap-space-xs text-secondary hover:text-primary font-label text-label transition-colors group"
                    type="button"
                    onClick={() => goto(2)}
                    disabled={busy}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span>Ubah Tujuan</span>
                  </button>
                  <div className="flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-[13px] font-bold tracking-tight">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      Langkah 4 dari 4
                    </span>
                    <span className="hidden sm:inline font-card-title text-card-title text-primary">
                      Rencana Belajar Siap!
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary w-full transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(73,101,80,0.35)]"></div>
                </div>
              </div>
            </section>

            <section className="w-full py-space-xl">
              <div className="max-w-[1140px] mx-auto px-gutter flex flex-col gap-space-lg">
                <div className="relative overflow-hidden bg-gradient-to-r from-secondary-container via-surface-container-low to-butter/40 rounded-xl p-space-md sm:p-space-lg shadow-sm">
                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface p-1.5 shadow-md flex items-center justify-center">
                          <Image
                            alt="Mimo sang Bunglon melompat gembira merayakan rencana belajar yang sudah siap"
                            className="w-full h-full object-contain rounded-full"
                            src="/design/mimo-3.png"
                            width={1024}
                            height={1024}
                          ></Image>
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-peach text-contrast-ink text-xs font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                          <span>🎉</span> 100%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-metadata text-metadata text-text-secondary uppercase tracking-widest font-semibold">
                          Ruang Belajar Ramah Pikiran
                        </span>
                        <h1 className="font-display text-section-title sm:text-page-title text-primary leading-tight">
                          {"\n                Hore {NAME}! Ruang belajarmu sudah siap dan disesuaikan 🦎🎉\n              ".replace(
                            "{NAME}",
                            value.display_name,
                          )}
                        </h1>
                        <p className="font-body text-body text-on-surface-variant text-sm sm:text-base mt-0.5">
                          Didesain santai sesuai ritmemu: tanpa terburu-buru,
                          tanpa beban berlebih.
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:flex flex-col items-end shrink-0 pl-space-md text-right">
                      <span className="px-space-sm py-1 bg-surface/90 text-primary font-label text-xs rounded-full shadow-xs">
                        Mode Ramah Neurodiversitas
                      </span>
                      <span className="font-metadata text-metadata text-muted-gray mt-1">
                        Status: Siap Dinikmati
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
                  <div className="lg:col-span-7 bg-surface rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-start justify-between gap-space-sm">
                        <div className="flex flex-col">
                          <span className="font-metadata text-metadata text-text-secondary uppercase tracking-wider font-semibold">
                            Identitas &amp; Gaya Belajar
                          </span>
                          <h2 className="font-section-title text-section-title text-primary font-bold">
                            {value.display_name}
                          </h2>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              school
                            </span>
                            Pelajar SMP Kelas 8 · Fase D
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label text-xs rounded-full font-bold">
                          Profil Aktif
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 text-primary shadow-xs">
                            <span
                              className="material-symbols-outlined text-[24px]"
                              aria-hidden="true"
                            >
                              menu_book
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label text-label text-primary font-bold">
                              Bantuan Membaca
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary">
                              Font ramah mata, pemandu baris zine &amp; visual
                              pendukung.
                            </span>
                          </div>
                        </div>

                        <div className="bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 text-primary shadow-xs">
                            <span
                              className="material-symbols-outlined text-[24px]"
                              aria-hidden="true"
                            >
                              headphones
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label text-label text-primary font-bold">
                              Fokus Bertahap
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary">
                              Pecahan materi mikro dengan jeda audio
                              menenangkan.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs">
                            <span
                              className="material-symbols-outlined text-success text-[20px]"
                              aria-hidden="true"
                            >
                              timer
                            </span>
                            <span className="font-label text-label text-primary font-bold">
                              Ritme Harian Pilihan
                            </span>
                          </div>
                          <span className="font-metadata text-metadata text-primary font-bold px-2 py-0.5 bg-secondary-fixed rounded-md">{`${value.daily_minutes} menit per hari`}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-secondary pt-1">
                          <span>
                            Komitmen Tenang:{" "}
                            <strong>4 Hari dalam Seminggu</strong>
                          </span>
                          <span className="text-xs text-muted-gray">
                            Fleksibel seutuhnya
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-2 pt-space-xs">
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary-container text-primary font-bold text-xs">
                            <span>Sen</span>
                            <span
                              className="material-symbols-outlined text-[16px] text-success"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary-container text-primary font-bold text-xs">
                            <span>Sel</span>
                            <span
                              className="material-symbols-outlined text-[16px] text-success"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container text-muted-gray text-xs">
                            <span>Rab</span>
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              pause
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary-container text-primary font-bold text-xs">
                            <span>Kam</span>
                            <span
                              className="material-symbols-outlined text-[16px] text-success"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary-container text-primary font-bold text-xs">
                            <span>Jum</span>
                            <span
                              className="material-symbols-outlined text-[16px] text-success"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container text-muted-gray text-xs">
                            <span>Sab</span>
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              coffee
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container text-muted-gray text-xs">
                            <span>Min</span>
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              self_improvement
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-space-md pt-space-sm flex items-center justify-between text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[16px] text-success"
                          aria-hidden="true"
                        >
                          eco
                        </span>
                        Ritme disesuaikan dengan kurva atensi remaja
                      </span>
                      <span className="font-semibold text-primary">
                        Kurikulum Merdeka 2025
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-surface rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-metadata text-metadata text-text-secondary uppercase tracking-wider font-semibold">
                            Simulasi Hari Perdana
                          </span>
                          <h2 className="font-section-title text-section-title text-primary font-bold">
                            Jadwal Santai Besok
                          </h2>
                        </div>
                        <span
                          className="material-symbols-outlined text-secondary text-[24px]"
                          aria-hidden="true"
                        >
                          calendar_today
                        </span>
                      </div>

                      <div className="flex flex-col gap-space-md relative pl-6">
                        <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-secondary-fixed"></div>

                        <div className="relative flex flex-col gap-1">
                          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold shadow-xs">
                            1
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-metadata text-xs font-bold uppercase tracking-wider text-secondary">
                              09.00 · 10 Menit
                            </span>
                            <span className="px-2 py-0.5 bg-butter/60 text-contrast-ink text-xs font-semibold rounded-md">
                              {value.subjects.join(" • ") || "Materi pilihanmu"}
                            </span>
                          </div>
                          <h3 className="font-card-title text-body font-bold text-primary">
                            Mengenal Segitiga Siku-siku &amp; Sisi Miring
                          </h3>
                          <p className="font-metadata text-metadata text-text-secondary">
                            Eksplorasi visual interaktif dengan analogi tangga
                            taman dan karakter Mimo.
                          </p>
                        </div>

                        <div className="relative flex flex-col gap-1">
                          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold shadow-xs">
                            2
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-metadata text-xs font-bold uppercase tracking-wider text-secondary">
                              09.10 · 5 Menit
                            </span>
                            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-xs font-semibold rounded-md">
                              Refleksi
                            </span>
                          </div>
                          <h3 className="font-card-title text-body font-bold text-primary">
                            Kuis Santai 2 Soal bareng Mimo
                          </h3>
                          <p className="font-metadata text-metadata text-text-secondary">
                            Bukan ujian bertekanan. Cukup tebak pola sederhana
                            tanpa pengukur waktu mundur.
                          </p>
                        </div>
                      </div>

                      <div className="bg-secondary-container/60 rounded-xl p-space-sm flex items-start gap-space-sm mt-space-xs">
                        <span
                          className="material-symbols-outlined text-success text-[22px] shrink-0"
                          aria-hidden="true"
                        >
                          check_circle
                        </span>
                        <div className="flex flex-col">
                          <span className="font-label text-label text-primary font-bold">
                            Bebas atur jam atau tunda
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary">
                            Tidak ada hukuman poin atau rasa bersalah jika kamu
                            butuh istirahat lebih lama.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-space-md flex items-center gap-2 text-xs text-muted-gray">
                      <span
                        className="material-symbols-outlined text-[16px] text-peach"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                      <span>
                        Tip: Notifikasi pengingat hanya dikirim jika kamu
                        mengizinkannya.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-space-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                      <span
                        className="material-symbols-outlined text-[24px]"
                        aria-hidden="true"
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label text-label text-primary font-bold">
                        Rencana Disimpan ke Akun Pelajar
                      </span>
                      <span className="font-metadata text-metadata text-text-secondary">
                        Kamu bisa menyetel ulang format visual dan jadwal di
                        menu pengaturan kapan pun.
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto">
                    <button
                      className="font-label text-label text-text-secondary hover:text-primary transition-colors underline underline-offset-4 text-center sm:text-right order-2 sm:order-1"
                      type="button"
                      onClick={() => goto(1)}
                      disabled={busy}
                    >
                      Atur ulang preferensi kapan saja
                    </button>
                    <button
                      className="w-full sm:w-auto h-[52px] px-8 rounded-xl bg-primary-container text-on-primary font-label text-base font-bold flex items-center justify-center gap-2 hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus order-1 sm:order-2"
                      type="button"
                      onClick={finish}
                      disabled={busy}
                    >
                      <span>
                        {"Masuk ke Beranda Utama {NAME}".replace(
                          "{NAME}",
                          value.display_name,
                        )}
                      </span>
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

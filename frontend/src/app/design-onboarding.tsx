"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultProfile, type Profile, type Preferences } from "@/lib/types";
export function OnboardingDesign({
  initial,
  onSave,
  busy,
  error,
}: {
  initial: Profile;
  onSave: (p: Profile) => void;
  busy: boolean;
  error: string;
}) {
  const [step, setStep] = useState(0),
    [value, setValue] = useState(initial),
    [needs, setNeeds] = useState(["membaca"]),
    [example, setExample] = useState(0),
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
    <div
      className={
        "stitch-shell stitch-landing stitch-onboarding " +
        (value.preferences.reduced_motion ? "calm" : "")
      }
    >
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90">
        <div className="h-20 max-w-[1280px] mx-auto px-gutter flex items-center justify-between">
          <Image
            src="/design/logo.png"
            alt="TemanBelajar"
            width={640}
            height={240}
            className="stitch-logo"
          />
          <span className="font-label text-label text-secondary">
            Langkah {step + 1} dari 4
          </span>
        </div>
      </header>
      {step === 0 ? (
        <main className="w-full pt-20 bg-background" id="main-content">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-[1040px] mx-auto px-gutter-mobile sm:px-gutter-tablet md:px-gutter py-space-md sm:py-space-lg md:py-space-xl flex flex-col gap-space-lg">
              <header className="w-full flex flex-col gap-space-sm">
                <div className="flex items-center justify-between gap-space-md">
                  <button
                    aria-label="Kembali ke halaman masuk"
                    className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-primary-hover active:text-primary-pressed transition-colors rounded-lg px-space-xs py-space-xs -ml-space-xs focus:ring-2 focus:ring-focus outline-none"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(0)}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]"
                    >
                      arrow_back
                    </span>
                    <span>Kembali</span>
                  </button>

                  <div className="flex items-center gap-space-xs bg-surface-container-high px-space-md py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-metadata text-metadata font-bold text-primary tracking-wide">
                      Langkah 1 dari 4
                    </span>
                  </div>

                  <button
                    aria-label="Buka panduan cepat aksesibilitas layar"
                    className="inline-flex items-center gap-space-xs text-primary-container bg-surface font-label text-label px-space-md py-2 rounded-xl shadow-sm hover:bg-surface-container-low transition-all active:scale-[0.98] focus:ring-2 focus:ring-focus outline-none"
                    id="quick-a11y-trigger"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(1)}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-secondary"
                    >
                      accessibility_new
                    </span>
                    <span className="hidden sm:inline">
                      Pintasan Aksesibilitas
                    </span>
                  </button>
                </div>

                <div
                  aria-label="Progres langkah orientasi belajar"
                  className="w-full flex flex-col gap-1.5 pt-space-xs"
                  role="region"
                >
                  <div className="w-full h-2 rounded-full bg-secondary-container/60 overflow-hidden">
                    <div
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={25}
                      className="h-full bg-primary-container rounded-full transition-all duration-500 ease-out"
                      role="progressbar"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-metadata text-text-secondary px-0.5">
                    <span className="font-bold text-primary">
                      1. Kebutuhan Belajar
                    </span>
                    <span>2. Tampilan &amp; Bacaan</span>
                    <span>3. Target Minat</span>
                    <span>4. Ritme Belajar</span>
                  </div>
                </div>
              </header>

              <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                <div className="lg:col-span-8 flex flex-col gap-space-xs">
                  <div className="inline-flex items-center gap-2 text-secondary font-label text-label">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]"
                    >
                      psychology_alt
                    </span>
                    <span className="uppercase tracking-wider">
                      Personalisasi Ruang Tenang
                    </span>
                  </div>
                  <h1 className="font-display text-page-title sm:text-display-mobile md:text-display text-primary tracking-tight font-extrabold leading-tight">
                    Biar belajarnya makin nyaman, kamu butuh bantuan apa?
                  </h1>
                  <p className="font-reading text-reading text-text-secondary max-w-2xl pt-1">
                    Pilih semua yang kamu butuhkan. Pilihan ini opsional dan
                    bisa kamu ubah kapan saja tanpa perlu tes atau diagnosis
                    khusus.
                  </p>
                </div>

                <div className="lg:col-span-4 flex items-center lg:items-end justify-center">
                  <div className="relative w-full bg-secondary-container/50 rounded-2xl p-space-md shadow-sm flex gap-space-md items-start">
                    <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface flex items-center justify-center shadow-sm overflow-hidden p-1">
                      <Image
                        alt="Mimo, teman belajarmu"
                        className="w-full h-full object-contain"
                        data-alt="Hand-drawn picture-book editorial illustration of Mimo the friendly chameleon with pastel green scales, a soft buttery belly, and rosy cheeks. Mimo is sitting cheerfully atop a neat stack of three colorful books, gently waving one clawed hand with a warm, empathetic, welcoming smile. Soft natural lighting, warm cream paper texture background, calming educational atmosphere."
                        src="/design/mimo.png"
                        width={1024}
                        height={1024}
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="font-display font-extrabold text-card-title text-primary">
                          Mimo si Sahabat
                        </span>
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          eco
                        </span>
                      </div>
                      <p className="font-mimo-voice text-mimo-voice text-primary-container leading-snug">
                        “Nggak ada jawaban salah di sini! Kamu bebas memilih
                        lebih dari satu, atau pilih belajar seperti biasa.”
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <form
                className="w-full flex flex-col gap-space-xl"
                id="kebutuhan-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="flex flex-col gap-space-xs font-label text-label text-primary">
                  Nama panggilan
                  <input
                    value={value.display_name}
                    onChange={(e) =>
                      setValue({ ...value, display_name: e.target.value })
                    }
                    required
                    maxLength={80}
                    className="h-12 px-space-md rounded-xl bg-surface border border-control-border"
                  />
                </label>
                <fieldset className="w-full">
                  <legend className="sr-only">
                    Daftar preferensi dan kebutuhan akomodasi belajar adaptif
                  </legend>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-space-md sm:gap-space-lg"
                    id="cards-container"
                  >
                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="membaca"
                    >
                      <input
                        aria-describedby="desc-membaca"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="membaca"
                        checked={needs.includes("membaca")}
                        onChange={() => toggleNeed("membaca")}
                      />

                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-secondary-container text-primary">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            menu_book
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku butuh bantuan membaca
                            </h2>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-membaca"
                          >
                            Font ramah disleksia (OpenDyslexic), pengaturan
                            jarak baris ekstra lega, pemandu baca (
                            <span className="italic">reading ruler</span>), dan
                            pemecah paragraf mandiri.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-primary-container text-on-primary shadow-sm"
                          data-indicator="membaca"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            format_size
                          </span>
                          Alat Bantu Disleksia &amp; Kelelahan Mata
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="fokus"
                    >
                      <input
                        aria-describedby="desc-fokus"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="fokus"
                        checked={needs.includes("fokus")}
                        onChange={() => toggleNeed("fokus")}
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-secondary-container text-primary">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            center_focus_strong
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku gampang kehilangan fokus
                            </h2>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-fokus"
                          >
                            Focus Navigator selangkah demi selangkah,
                            sembunyikan materi yang belum dibahas, dan timer
                            santai tanpa desakan panik.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-primary-container text-on-primary shadow-sm"
                          data-indicator="fokus"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            timer
                          </span>
                          Peredam Distraksi &amp; ADHD
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="audio"
                    >
                      <input
                        aria-describedby="desc-audio"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="audio"
                        checked={needs.includes("audio")}
                        onChange={() => toggleNeed("audio")}
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-surface-container text-text-secondary group-hover:bg-secondary-container/40">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            headphones
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku lebih nyaman mendengarkan
                            </h2>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-audio"
                          >
                            Narasi suara manusia alami dengan penanda kata
                            aktif, kecepatan putar 0.75x–1.5x, dan minim
                            distraksi visual.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-surface-container-high text-transparent"
                          data-indicator="audio"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            volume_up
                          </span>
                          Audio Narasi Adaptif
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="deskripsi"
                    >
                      <input
                        aria-describedby="desc-deskripsi"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="deskripsi"
                        checked={needs.includes("deskripsi")}
                        onChange={() => toggleNeed("deskripsi")}
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-surface-container text-text-secondary group-hover:bg-secondary-container/40">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            visibility
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku butuh deskripsi gambar
                            </h2>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-deskripsi"
                          >
                            Teks alternatif mendalam untuk diagram sains, bagan
                            alur, dan penjelasan bagian-bagian visual yang
                            terstruktur rapi.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-surface-container-high text-transparent"
                          data-indicator="deskripsi"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            auto_stories
                          </span>
                          Dukungan Tunanetra &amp; Low-Vision
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="visual"
                    >
                      <input
                        aria-describedby="desc-visual"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="visual"
                        checked={needs.includes("visual")}
                        onChange={() => toggleNeed("visual")}
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-surface-container text-text-secondary group-hover:bg-secondary-container/40">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            dashboard_customize
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku lebih nyaman dengan teks dan visual
                            </h2>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-visual"
                          >
                            Transkrip baca lengkap tersinkronisasi, kartu komik
                            mini konsep, dan diagram skematis warna ramah mata.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-surface-container-high text-transparent"
                          data-indicator="visual"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            closed_caption
                          </span>
                          Transkrip &amp; Visual Infografis
                        </span>
                      </div>
                    </label>

                    <label
                      className="group relative flex flex-col justify-between p-space-lg rounded-2xl cursor-pointer transition-all duration-200 bg-surface shadow-sm hover:shadow-md hover:bg-surface-container-lowest"
                      data-card-id="biasa"
                    >
                      <input
                        aria-describedby="desc-biasa"
                        className="sr-only peer"
                        name="kebutuhan"
                        type="checkbox"
                        value="biasa"
                        checked={needs.includes("biasa")}
                        onChange={() => toggleNeed("biasa")}
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 peer-checked:bg-secondary-container/20"></div>
                      <div className="relative z-10 flex items-start gap-space-md">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-surface-container text-text-secondary group-hover:bg-secondary-container/40">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[28px]"
                          >
                            auto_awesome
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-space-md">
                          <div className="flex items-center gap-space-xs">
                            <h2 className="font-card-title text-card-title text-primary group-hover:text-primary-hover">
                              Aku mau belajar seperti biasa
                            </h2>
                            <span className="text-[11px] font-metadata font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-butter/60 text-warning">
                              Mandiri
                            </span>
                          </div>
                          <p
                            className="font-body text-metadata sm:text-body text-text-secondary mt-1"
                            id="desc-biasa"
                          >
                            Tampilan editorial zine standar yang tenang dan
                            bersih. Seluruh alat bantu tetap tersedia kapan pun
                            kamu butuhkan.
                          </p>
                        </div>

                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 bg-surface-container-high text-transparent"
                          data-indicator="biasa"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[20px]"
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 mt-space-md pt-space-xs flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1 font-metadata text-[12px] font-semibold text-text-secondary bg-surface-container px-2.5 py-1 rounded-full">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            aria-hidden="true"
                          >
                            tune
                          </span>
                          Opsi mandiri tanpa penyesuaian awal
                        </span>
                      </div>
                    </label>
                  </div>
                </fieldset>

                <aside className="w-full bg-surface-container-low rounded-2xl p-space-md sm:p-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-butter flex items-center justify-center shrink-0 text-primary">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                    </div>
                    <div>
                      <div className="font-card-title text-card-title text-primary">
                        Modus Belajar Ramah Saraf
                      </div>
                      <div
                        className="font-metadata text-metadata text-text-secondary"
                        id="selection-summary-text"
                      >{`${needs.length} dukungan dipilih. Kamu bisa mengubahnya kapan saja.`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs text-secondary font-label text-label self-end sm:self-center">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      verified
                    </span>
                    <span>Bebas diubah di Profil</span>
                  </div>
                </aside>

                <div className="w-full bg-surface/90 backdrop-blur-md sticky bottom-4 z-30 rounded-2xl p-space-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <button
                    className="w-full sm:w-auto h-12 px-space-lg rounded-xl text-primary font-label text-label hover:bg-surface-container-low transition-colors inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-focus outline-none text-center"
                    id="btn-skip"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(1)}
                  >
                    <span>Lewati dulu</span>
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px] text-muted-gray"
                    >
                      fast_forward
                    </span>
                  </button>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-space-sm">
                    <button
                      className="w-full sm:w-auto h-12 px-space-xl rounded-xl bg-primary-container text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all inline-flex items-center justify-center gap-space-xs shadow-md focus:ring-2 focus:ring-focus outline-none"
                      id="btn-continue"
                      type="button"
                      disabled={busy}
                      onClick={() => goto(1)}
                      aria-label="Lanjut ke langkah berikutnya"
                    >
                      <span>Lanjut ke Pengaturan Bacaan &amp; Tampilan</span>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px]"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>

                <footer className="w-full text-center flex items-center justify-center gap-space-xs text-text-secondary font-metadata text-metadata -mt-space-md">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[16px] text-secondary"
                  >
                    lock
                  </span>
                  <span>
                    Kerahasiaan terjaga: Pilihanmu hanya disimpan di perangkat
                    untuk menyesuaikan antarmuka belajarmu.
                  </span>
                </footer>
              </form>
            </div>
          </div>
        </main>
      ) : step === 1 ? (
        <main className="w-full pt-20 bg-background" id="main-content">
          <div className="flex flex-col w-full">
            <section className="w-full bg-surface-container-low py-space-md shadow-sm">
              <div className="max-w-[1200px] mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-start">
                  <button
                    className="inline-flex items-center gap-space-xs font-label text-label text-primary hover:text-primary-hover px-space-md py-space-sm rounded-xl bg-surface shadow-sm transition-all focus:ring-2 focus:ring-focus focus:outline-none"
                    data-path="onboarding-kebutuhan"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(0)}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span>Kembali</span>
                  </button>
                  <div className="flex items-center gap-space-sm">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Langkah 2 dari 4:{" "}
                      <strong className="font-label text-primary">
                        Tampilan &amp; Bacaan
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs w-full md:w-64">
                  <div className="h-2 flex-1 rounded-full bg-secondary"></div>
                  <div className="h-2 flex-1 rounded-full bg-secondary shadow-sm"></div>
                  <div className="h-2 flex-1 rounded-full bg-divider"></div>
                  <div className="h-2 flex-1 rounded-full bg-divider"></div>
                </div>
              </div>
            </section>

            <div className="max-w-[1200px] mx-auto px-gutter py-space-xl w-full">
              <header className="mb-space-xl">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container font-label text-label text-primary">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      auto_awesome
                    </span>
                    Dipersonalisasi sesuai responmu di Langkah 1
                  </span>
                </div>
                <h1 className="font-page-title text-page-title text-primary tracking-tight">
                  Atur cara belajarmu
                </h1>
                <p className="font-body text-body text-text-secondary mt-space-xs max-w-2xl">
                  Coba dan sesuaikan kenyamanan membaca serta fokusmu secara
                  langsung di sini. Kamu bisa ubah pengaturan ini kapan saja.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  <section className="bg-surface rounded-2xl p-space-lg shadow-sm">
                    <div className="flex items-center justify-between pb-space-sm mb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                          <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                          >
                            menu_book
                          </span>
                        </div>
                        <div>
                          <h2 className="font-section-title text-section-title text-primary">
                            Kenyamanan Bacaan &amp; Teks
                          </h2>
                          <p className="font-metadata text-metadata text-text-secondary">
                            Direkomendasikan karena kamu butuh ruang baca yang
                            tenang
                          </p>
                        </div>
                      </div>
                      <span className="font-metadata text-metadata bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
                        Prioritas
                      </span>
                    </div>

                    <div className="mb-space-lg">
                      <label className="block font-label text-label text-primary mb-space-xs">
                        Jenis Huruf Bacaan
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                        <button
                          className="font-btn flex flex-col items-center justify-center p-space-sm rounded-xl bg-surface-container-low text-text-secondary hover:bg-surface-container transition-all text-center focus:ring-2 focus:ring-focus"
                          id="font-standard"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_family: "jakarta" })}
                          aria-pressed={
                            value.preferences.font_family === "jakarta"
                          }
                        >
                          <span className="font-label text-label">
                            Plus Jakarta
                          </span>
                          <span className="font-metadata text-metadata text-muted-gray text-xs">
                            Standar Rapi
                          </span>
                        </button>
                        <button
                          className="font-btn active-state flex flex-col items-center justify-center p-space-sm rounded-xl bg-secondary-container text-primary font-bold shadow-sm transition-all text-center focus:ring-2 focus:ring-focus"
                          id="font-dyslexic"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_family: "nunito" })}
                          aria-pressed={
                            value.preferences.font_family === "nunito"
                          }
                        >
                          <div className="flex items-center gap-1">
                            <span className="font-label text-label">
                              {"Nunito"}
                            </span>
                            <span
                              className="material-symbols-outlined text-[16px] text-success"
                              aria-hidden="true"
                            >
                              check_circle
                            </span>
                          </div>
                          <span className="font-metadata text-metadata text-secondary text-xs">
                            Pilihan huruf bulat
                          </span>
                        </button>
                        <button
                          className="font-btn flex flex-col items-center justify-center p-space-sm rounded-xl bg-surface-container-low text-text-secondary hover:bg-surface-container transition-all text-center focus:ring-2 focus:ring-focus"
                          id="font-clean"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_family: "system" })}
                          aria-pressed={
                            value.preferences.font_family === "system"
                          }
                        >
                          <span className="font-label text-label">
                            Huruf Sistem
                          </span>
                          <span className="font-metadata text-metadata text-muted-gray text-xs">
                            Tinggi &amp; Terbuka
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="mb-space-lg">
                      <div className="flex items-center justify-between mb-space-xs">
                        <label className="font-label text-label text-primary">
                          Ukuran Teks
                        </label>
                        <span
                          className="font-metadata text-metadata text-secondary font-bold"
                          id="current-size-label"
                        >{`${value.preferences.font_size}px`}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-space-xs">
                        <button
                          className="size-btn py-space-sm px-space-xs rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-surface-container transition-all text-center"
                          data-size="16"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_size: 16 })}
                          aria-pressed={value.preferences.font_size === 16}
                        >
                          16px
                        </button>
                        <button
                          className="size-btn active-size py-space-sm px-space-xs rounded-xl bg-secondary-container text-primary font-bold shadow-sm transition-all text-center"
                          data-size="18"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_size: 18 })}
                          aria-pressed={value.preferences.font_size === 18}
                        >
                          18px
                        </button>
                        <button
                          className="size-btn py-space-sm px-space-xs rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-surface-container transition-all text-center"
                          data-size="20"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_size: 20 })}
                          aria-pressed={value.preferences.font_size === 20}
                        >
                          20px
                        </button>
                        <button
                          className="size-btn py-space-sm px-space-xs rounded-xl bg-surface-container-low text-primary font-label text-label hover:bg-surface-container transition-all text-center"
                          data-size="24"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ font_size: 24 })}
                          aria-pressed={value.preferences.font_size === 24}
                        >
                          24px
                        </button>
                      </div>
                    </div>

                    <div className="mb-space-lg">
                      <label className="block font-label text-label text-primary mb-space-xs">
                        Jarak Antar Baris
                      </label>
                      <div className="grid grid-cols-2 gap-space-sm">
                        <button
                          className="lh-btn p-space-sm rounded-xl bg-surface-container-low text-text-secondary hover:bg-surface-container transition-all flex items-center justify-center gap-space-xs"
                          id="lh-normal"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ line_height: 1.5 })}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            density_medium
                          </span>
                          <span className="font-label text-label">
                            Renggang Biasa (1.5x)
                          </span>
                        </button>
                        <button
                          className="lh-btn active-lh p-space-sm rounded-xl bg-secondary-container text-primary font-bold shadow-sm transition-all flex items-center justify-center gap-space-xs"
                          id="lh-relaxed"
                          type="button"
                          disabled={busy}
                          onClick={() => pref({ line_height: 1.8 })}
                        >
                          <span
                            className="material-symbols-outlined text-[18px] text-success"
                            aria-hidden="true"
                          >
                            density_large
                          </span>
                          <span className="font-label text-label">
                            Ekstra Lega (1.8x)
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-space-md pt-space-xs">
                      <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                        <div className="flex items-start gap-space-sm pr-space-md">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              straighten
                            </span>
                          </div>
                          <div>
                            <span className="font-label text-label text-primary block">
                              Pemandu Baris (Reading Ruler)
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary block">
                              Memberikan pita sorot Soft Mint pada baris yang
                              sedang kamu baca agar mata tidak mudah lompat.
                            </span>
                          </div>
                        </div>
                        <button
                          aria-checked={value.preferences.reading_ruler}
                          className="w-12 h-6 rounded-full bg-primary flex items-center p-0.5 cursor-pointer transition-colors focus:ring-2 focus:ring-focus shrink-0"
                          id="toggle-ruler"
                          role="switch"
                          type="button"
                          disabled={busy}
                          aria-label="Penggaris baca"
                          onClick={() =>
                            pref({
                              reading_ruler: !value.preferences.reading_ruler,
                            })
                          }
                        >
                          <span className="w-5 h-5 rounded-full bg-surface shadow-sm transform translate-x-6 transition-transform"></span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                        <div className="flex items-start gap-space-sm pr-space-md">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              format_align_left
                            </span>
                          </div>
                          <div>
                            <span className="font-label text-label text-primary block">
                              Pemecah Paragraf Singkat
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary block">
                              Secara otomatis membagi teks tebal jadi 2-3 baris
                              kalimat pendek tanpa mengurangi isi materi.
                            </span>
                          </div>
                        </div>
                        <button
                          aria-checked={value.preferences.mode === "focus"}
                          className="w-12 h-6 rounded-full bg-primary flex items-center p-0.5 cursor-pointer transition-colors focus:ring-2 focus:ring-focus shrink-0"
                          id="toggle-chunk"
                          role="switch"
                          type="button"
                          disabled={busy}
                          aria-label="Mode fokus"
                          onClick={() =>
                            pref({
                              mode:
                                value.preferences.mode === "focus"
                                  ? "reading"
                                  : "focus",
                            })
                          }
                        >
                          <span className="w-5 h-5 rounded-full bg-surface shadow-sm transform translate-x-6 transition-transform"></span>
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="bg-surface rounded-2xl p-space-lg shadow-sm">
                    <div className="flex items-center justify-between pb-space-sm mb-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                          <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                          >
                            filter_center_focus
                          </span>
                        </div>
                        <div>
                          <h2 className="font-section-title text-section-title text-primary">
                            Fokus &amp; Stimulasi Sensorik
                          </h2>
                          <p className="font-metadata text-metadata text-text-secondary">
                            Membantumu tetap tenang saat belajar mandiri tanpa
                            distraksi
                          </p>
                        </div>
                      </div>
                      <span className="font-metadata text-metadata bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
                        Prioritas
                      </span>
                    </div>

                    <div className="mb-space-lg">
                      <label className="block font-label text-label text-primary mb-space-xs">
                        Focus Navigator (Satu Langkah dalam Satu Waktu)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                        <label className="flex items-center gap-space-sm p-space-sm rounded-xl bg-secondary-container text-primary font-bold cursor-pointer transition-all">
                          <input
                            className="w-4 h-4 text-primary accent-primary"
                            name="focus-mode"
                            type="radio"
                            checked={value.preferences.mode === "focus"}
                            onChange={() => pref({ mode: "focus" })}
                          />
                          <span className="font-label text-label">
                            Fokus 1 Blok Materi Saja
                          </span>
                        </label>
                        <label className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-text-secondary cursor-pointer hover:bg-surface-container transition-all">
                          <input
                            className="w-4 h-4 text-primary accent-primary"
                            name="focus-mode"
                            type="radio"
                            checked={value.preferences.mode === "reading"}
                            onChange={() => pref({ mode: "reading" })}
                          />
                          <span className="font-label text-label">
                            Tampilkan Seluruh Lembar
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-space-md">
                      <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                        <div className="flex items-start gap-space-sm pr-space-md">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              notifications_off
                            </span>
                          </div>
                          <div>
                            <span className="font-label text-label text-primary block">
                              Redam Distraksi &amp; Notifikasi
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary block">
                              Sembunyikan pop-up pencapaian, angka berkedip, dan
                              suara denting saat sesi belajar aktif.
                            </span>
                          </div>
                        </div>
                        <button
                          aria-checked={value.preferences.reduced_motion}
                          className="w-12 h-6 rounded-full bg-primary flex items-center p-0.5 cursor-pointer transition-colors focus:ring-2 focus:ring-focus shrink-0"
                          role="switch"
                          type="button"
                          disabled={busy}
                          aria-label="Redam distraksi"
                          onClick={() =>
                            pref({
                              reduced_motion: !value.preferences.reduced_motion,
                            })
                          }
                        >
                          <span className="w-5 h-5 rounded-full bg-surface shadow-sm transform translate-x-6 transition-transform"></span>
                        </button>
                      </div>

                      <div className="p-space-sm rounded-xl bg-surface-container-low">
                        <label className="block font-label text-label text-primary mb-space-xs">
                          Timer Santai Tanpa Panik
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                          <button
                            className="p-space-sm rounded-xl bg-secondary-container text-primary font-bold flex items-center justify-center gap-space-xs text-left"
                            type="button"
                            disabled={busy}
                            onClick={() => pref({ timer_enabled: true })}
                          >
                            <span
                              className="material-symbols-outlined text-[18px] text-success"
                              aria-hidden="true"
                            >
                              hourglass_top
                            </span>
                            <span className="font-label text-label">
                              Aktif (Bisa dijeda kapan pun)
                            </span>
                          </button>
                          <button
                            className="p-space-sm rounded-xl bg-surface text-text-secondary hover:bg-surface-container flex items-center justify-center gap-space-xs text-left"
                            type="button"
                            disabled={busy}
                            onClick={() => pref({ timer_enabled: false })}
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              timer_off
                            </span>
                            <span className="font-label text-label">
                              Sembunyikan Timer Sama Sekali
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <details className="group bg-surface rounded-2xl p-space-lg shadow-sm">
                    <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                          <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                          >
                            palette
                          </span>
                        </div>
                        <div>
                          <h2 className="font-section-title text-section-title text-primary">
                            Suara &amp; Kontras Warna
                          </h2>
                          <p className="font-metadata text-metadata text-text-secondary">
                            Pilihan tambahan untuk kenyamanan mata di malam hari
                            dan pembaca audio
                          </p>
                        </div>
                      </div>
                      <span
                        className="material-symbols-outlined text-text-secondary group-open:rotate-180 transition-transform"
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </summary>
                    <div className="pt-space-lg mt-space-md space-y-space-md">
                      <div>
                        <label className="block font-label text-label text-primary mb-space-xs">
                          Pilihan Palet Warna Kanvas
                        </label>
                        <div className="grid grid-cols-2 gap-space-sm">
                          <button
                            className="p-space-md rounded-xl bg-secondary-container text-primary font-bold flex items-center gap-space-sm text-left"
                            type="button"
                            disabled={busy}
                            onClick={() => pref({ high_contrast: false })}
                          >
                            <span className="w-5 h-5 rounded-full bg-background border-2 border-primary"></span>
                            <div>
                              <span className="block font-label text-label">
                                Lembut Krem Alami
                              </span>
                              <span className="font-metadata text-metadata text-xs text-text-secondary">
                                Hangat &amp; teduh di mata
                              </span>
                            </div>
                          </button>
                          <button
                            className="p-space-md rounded-xl bg-surface-container-low text-text-secondary hover:bg-surface-container flex items-center gap-space-sm text-left"
                            type="button"
                            disabled={busy}
                            onClick={() => pref({ high_contrast: true })}
                          >
                            <span className="w-5 h-5 rounded-full bg-contrast-ink"></span>
                            <div>
                              <span className="block font-label text-label">
                                Kontras Tinggi Hitam
                              </span>
                              <span className="font-metadata text-metadata text-xs text-muted-gray">
                                Garis tepi ekstra tegas
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
                        <div className="flex items-start gap-space-sm pr-space-md">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              record_voice_over
                            </span>
                          </div>
                          <div>
                            <span className="font-label text-label text-primary block">
                              Tombol Baca Nyaring Otomatis
                            </span>
                            <span className="font-metadata text-metadata text-text-secondary block">
                              Sematkan tombol putar suara ramah di setiap
                              paragraf untuk didengarkan sambil membaca.
                            </span>
                          </div>
                        </div>
                        <button
                          aria-checked={value.preferences.mode === "transcript"}
                          className="w-12 h-6 rounded-full bg-primary flex items-center p-0.5 cursor-pointer transition-colors focus:ring-2 focus:ring-focus shrink-0"
                          role="switch"
                          type="button"
                          disabled={busy}
                          aria-label="Mode transkrip dan audio"
                          onClick={() =>
                            pref({
                              mode:
                                value.preferences.mode === "transcript"
                                  ? "reading"
                                  : "transcript",
                            })
                          }
                        >
                          <span className="w-5 h-5 rounded-full bg-surface shadow-sm transform translate-x-6 transition-transform"></span>
                        </button>
                      </div>
                    </div>
                  </details>
                </div>

                <aside className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
                  <div className="bg-surface rounded-2xl p-space-lg shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between pb-space-sm mb-space-md">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                        <span className="font-label text-label uppercase tracking-wider text-primary text-xs">
                          Pratinjau Nyata
                        </span>
                      </div>
                      <span className="font-metadata text-metadata bg-secondary-container text-primary px-space-sm py-0.5 rounded-full font-bold text-xs">
                        Materi SMP Kelas 8
                      </span>
                    </div>

                    <div className="mb-space-md">
                      <span className="font-metadata text-metadata text-text-secondary uppercase tracking-widest text-xs">
                        IPA Biologi · Modul 2
                      </span>
                      <h3 className="font-card-title text-card-title text-primary tracking-tight mt-0.5">
                        Fotosintesis: Menangkap Cahaya
                      </h3>
                    </div>

                    <div
                      className="bg-surface-container-low rounded-xl p-space-md relative min-h-[220px] transition-all"
                      id="preview-container"
                    >
                      <div className="flex items-center gap-1.5 mb-space-sm text-secondary font-label text-xs">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          pin_drop
                        </span>
                        <span>Langkah 1 dari 2 dalam sub-bab ini</span>
                      </div>

                      <div
                        className="space-y-space-md text-primary font-reading text-reading leading-[1.8] tracking-wide select-none"
                        id="preview-text-body"
                        style={{
                          fontSize: value.preferences.font_size,
                          lineHeight: value.preferences.line_height,
                          letterSpacing: `${value.preferences.letter_spacing}em`,
                          fontFamily:
                            value.preferences.font_family === "nunito"
                              ? "Nunito"
                              : value.preferences.font_family === "system"
                                ? "system-ui"
                                : "Plus Jakarta Sans",
                        }}
                      >
                        <div
                          className="bg-secondary-container px-space-sm py-1.5 rounded-lg -mx-space-sm shadow-sm transition-all"
                          id="ruler-line"
                          hidden={!value.preferences.reading_ruler}
                        >
                          <p id="para-1">
                            {example
                              ? "Air dan karbon dioksida digunakan tumbuhan untuk membentuk gula."
                              : "Cahaya menyediakan energi untuk fotosintesis. Klorofil membantu menyerap energi cahaya."}
                          </p>
                        </div>

                        <p
                          className="opacity-80 transition-opacity"
                          id="para-2"
                        >
                          Cahaya ini kemudian diubah menjadi energi kimia dalam
                          bentuk glukosa manis serta melepas oksigen segar ke
                          udara.
                        </p>
                      </div>

                      <div className="mt-space-md pt-space-sm flex items-center justify-between gap-space-xs flex-wrap">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-primary font-label text-xs shadow-sm hover:bg-surface-container transition-all"
                          id="btn-audio-sample"
                          type="button"
                          disabled={busy}
                          onClick={speak}
                        >
                          <span
                            className="material-symbols-outlined text-[16px] text-secondary"
                            aria-hidden="true"
                          >
                            volume_up
                          </span>
                          <span id="audio-label">Dengarkan Audio (0.8x)</span>
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-text-secondary font-label text-xs shadow-sm hover:bg-surface-container transition-all"
                          id="btn-switch-sentence"
                          type="button"
                          disabled={busy}
                          onClick={() => setExample(1 - example)}
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            aria-hidden="true"
                          >
                            shuffle
                          </span>
                          <span>Ganti Contoh</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-space-lg flex items-start gap-space-sm p-space-md rounded-2xl bg-secondary-container/60">
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                        <span
                          className="material-symbols-outlined text-success text-[28px]"
                          aria-hidden="true"
                        >
                          pets
                        </span>
                      </div>

                      <div className="bg-surface rounded-xl p-space-sm shadow-sm flex-1 relative">
                        <div className="flex items-center gap-1.5 mb-1">
                          <strong className="font-mimo-voice text-mimo-voice text-primary text-sm font-extrabold">
                            Mimo si Teman Belajar
                          </strong>
                          <span className="w-2 h-2 rounded-full bg-peach"></span>
                        </div>
                        <p className="font-body text-body text-primary text-xs leading-relaxed">
                          “Gimana rasanya di matamu? Kalau masih kurang pas,
                          kamu bisa ubah lagi kapan pun lewat tombol{" "}
                          <strong className="font-bold text-primary">
                            Pintasan Aksesibilitas
                          </strong>{" "}
                          di bilah atas saat kamu mulai membaca modul nanti.”
                        </p>
                      </div>
                    </div>

                    <div className="mt-space-md flex flex-wrap items-center gap-1.5 font-metadata text-xs text-text-secondary">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container">
                        {"Nunito"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container">
                        Ukuran: 18px
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container">
                        Line-height: 1.8x
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container">
                        Ruler: Aktif
                      </span>
                    </div>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm">
                    <span
                      className="material-symbols-outlined text-success text-[22px] shrink-0"
                      aria-hidden="true"
                    >
                      verified
                    </span>
                    <p className="font-metadata text-metadata text-text-secondary text-xs">
                      <strong className="text-primary font-semibold">
                        WCAG 2.2 AA Compliant
                      </strong>{" "}
                      · Seluruh setelan disimpan langsung di peramban lokal
                      perangkatmu sehingga kamu tetap nyaman tanpa membebani
                      memori kuota.
                    </p>
                  </div>
                </aside>
              </div>

              <div className="mt-space-section pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <button
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-space-xl rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container transition-all shadow-sm focus:ring-2 focus:ring-focus"
                  id="btn-reset-default"
                  type="button"
                  disabled={busy}
                  onClick={() => pref({ ...defaultProfile.preferences })}
                >
                  <span
                    className="material-symbols-outlined text-[18px] mr-1.5"
                    aria-hidden="true"
                  >
                    restart_alt
                  </span>
                  Pakai pengaturan awal
                </button>

                <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-space-xl rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md focus:ring-2 focus:ring-focus"
                    data-path="onboarding-minat"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(2)}
                    aria-label="Lanjut ke langkah berikutnya"
                  >
                    <span>
                      Pakai pengaturan ini &amp; Lanjut ke Target Minat
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] ml-2"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : step === 2 ? (
        <main className="w-full pt-20 bg-background" id="main-content">
          <div className="flex flex-col w-full">
            <div className="w-full bg-surface-container-low/70 border-b border-divider py-space-md">
              <div className="max-w-[1200px] mx-auto px-gutter-mobile sm:px-gutter flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-md">
                  <button
                    className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-xl text-primary font-label text-label hover:bg-surface transition-colors focus:ring-2 focus:ring-focus"
                    data-path="onboarding/aksesibilitas"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(1)}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      arrow_back
                    </span>
                    <span>Kembali</span>
                  </button>
                  <div className="h-4 w-px bg-outline-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-metadata text-metadata text-text-secondary">
                      Langkah 3 dari 4
                    </span>
                    <span className="font-label text-label text-primary font-bold">
                      Target &amp; Ritme Belajar
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end">
                  <div
                    aria-label="Progress onboarding"
                    className="flex items-center gap-1.5"
                  >
                    <span
                      className="w-8 h-2 rounded-full bg-secondary-container"
                      title="Langkah 1 Selesai"
                    ></span>
                    <span
                      className="w-8 h-2 rounded-full bg-secondary-container"
                      title="Langkah 2 Selesai"
                    ></span>
                    <span
                      className="w-12 h-2 rounded-full bg-primary"
                      title="Langkah 3 Aktif"
                    ></span>
                    <span
                      className="w-8 h-2 rounded-full bg-surface-container-highest"
                      title="Langkah 4"
                    ></span>
                  </div>
                  <button
                    className="inline-flex items-center gap-space-xs text-text-secondary hover:text-primary font-metadata text-metadata px-space-sm py-1.5 rounded-full bg-surface shadow-sm focus:ring-2 focus:ring-focus transition-all"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(1)}
                  >
                    <span
                      className="material-symbols-outlined text-primary text-[18px]"
                      aria-hidden="true"
                    >
                      accessibility_new
                    </span>
                    <span className="hidden sm:inline">
                      Pintasan Aksesibilitas
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-gutter-mobile sm:px-gutter py-space-xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                <div className="lg:col-span-7 flex flex-col gap-space-xl">
                  <header className="flex flex-col gap-space-sm">
                    <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-peach/40 text-primary w-fit font-label text-metadata tracking-wide font-bold">
                      <span
                        className="material-symbols-outlined text-[16px] text-primary"
                        aria-hidden="true"
                      >
                        adjust
                      </span>
                      <span>PERSONALISASI RITME BELAJAR</span>
                    </div>
                    <h1 className="font-page-title text-page-title text-primary tracking-tight">
                      Tentukan ritme belajar yang paling cocok buat energimu
                    </h1>
                    <p className="font-reading text-reading text-text-secondary">
                      Nggak ada target yang terlalu kecil. Mau 15 menit atau 25
                      menit sehari, konsistensi santai jauh lebih berharga
                      daripada memaksakan diri.
                    </p>
                  </header>

                  <div className="p-space-lg rounded-[24px] bg-secondary-container/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-surface rounded-2xl p-1.5 shadow-sm overflow-hidden flex items-center justify-center">
                      <Image
                        className="w-full h-full object-contain"
                        data-alt="Chameleon mascot Mimo sitting relaxed on a gentle mint book stack, smiling warmhearted, illustrated in charming editorial zine soft brush style with pastel green, peach blush, and rounded outlines."
                        src="/design/mimo.png"
                        width={1024}
                        height={1024}
                        alt="Mimo, teman belajarmu"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label text-label text-primary font-bold">
                          Mimo
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          · Rekan Belajar Adaptifmu
                        </span>
                      </div>
                      <p className="font-mimo-voice text-mimo-voice text-primary italic leading-snug">
                        “Tenang aja, kalau suatu hari kamu capek atau ada PR
                        dadakan, jadwal ini bisa otomatis bergeser tanpa bikin
                        kamu merasa bersalah!”
                      </p>
                    </div>
                  </div>
                  <form
                    className="flex flex-col gap-space-xl"
                    id="learning-goals-form"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <fieldset className="flex flex-col gap-space-sm">
                      <div className="flex flex-col">
                        <legend className="font-card-title text-card-title text-primary font-bold">
                          Mata Pelajaran yang Ingin Kamu Utamakan
                        </legend>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Pilih 1 atau lebih materi yang ingin diprioritaskan
                          pembimbingannya.
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <label className="cursor-pointer relative flex flex-col p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <input
                            className="peer sr-only"
                            name="subject"
                            type="checkbox"
                            value="ipa"
                            checked={value.subjects.includes("IPA")}
                            onChange={() => toggleSubject("IPA")}
                          />
                          <div className="peer-checked:hidden absolute top-4 right-4 w-5 h-5 rounded-md bg-surface-container-high flex items-center justify-center"></div>
                          <div className="hidden peer-checked:flex absolute top-4 right-4 w-5 h-5 rounded-md bg-primary text-on-primary items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              check
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                biotech
                              </span>
                            </div>
                            <span className="font-label text-label font-bold text-primary">
                              IPA Biologi &amp; Sains
                            </span>
                          </div>
                          <p className="font-metadata text-metadata text-text-secondary mb-3">
                            Siklus Sel, Fotosintesis Daun, dan Keseimbangan
                            Ekosistem
                          </p>
                          <div className="mt-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/70 text-primary font-metadata text-[12px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                              Materi Demo Siap
                            </span>
                          </div>
                        </label>

                        <label className="cursor-pointer relative flex flex-col p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <input
                            className="peer sr-only"
                            name="subject"
                            type="checkbox"
                            value="matematika"
                            checked={value.subjects.includes("Matematika")}
                            onChange={() => toggleSubject("Matematika")}
                          />
                          <div className="peer-checked:hidden absolute top-4 right-4 w-5 h-5 rounded-md bg-surface-container-high flex items-center justify-center"></div>
                          <div className="hidden peer-checked:flex absolute top-4 right-4 w-5 h-5 rounded-md bg-primary text-on-primary items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              check
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                calculate
                              </span>
                            </div>
                            <span className="font-label text-label font-bold text-primary">
                              Matematika &amp; Logika
                            </span>
                          </div>
                          <p className="font-metadata text-metadata text-text-secondary mb-3">
                            Aljabar Tanpa Rumit, Geometri Visual, Statistika
                            Sehari-hari
                          </p>
                          <div className="mt-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-text-secondary font-metadata text-[12px]">
                              Pendekatan Visual Step-by-Step
                            </span>
                          </div>
                        </label>

                        <label className="cursor-pointer relative flex flex-col p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <input
                            className="peer sr-only"
                            name="subject"
                            type="checkbox"
                            value="indonesia"
                            checked={value.subjects.includes(
                              "Bahasa Indonesia",
                            )}
                            onChange={() => toggleSubject("Bahasa Indonesia")}
                          />
                          <div className="peer-checked:hidden absolute top-4 right-4 w-5 h-5 rounded-md bg-surface-container-high flex items-center justify-center"></div>
                          <div className="hidden peer-checked:flex absolute top-4 right-4 w-5 h-5 rounded-md bg-primary text-on-primary items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              check
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-peach/40 flex items-center justify-center text-primary">
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                auto_stories
                              </span>
                            </div>
                            <span className="font-label text-label font-bold text-primary">
                              Bahasa &amp; Literasi
                            </span>
                          </div>
                          <p className="font-metadata text-metadata text-text-secondary mb-3">
                            Menulis Esai Reflektif, Menemukan Gagasan Pokok
                            Nyaman
                          </p>
                          <div className="mt-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-text-secondary font-metadata text-[12px]">
                              Font Ramah Membaca
                            </span>
                          </div>
                        </label>

                        <label className="cursor-pointer relative flex flex-col p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <input
                            className="peer sr-only"
                            name="subject"
                            type="checkbox"
                            value="ips"
                            checked={value.subjects.includes("IPS")}
                            onChange={() => toggleSubject("IPS")}
                          />
                          <div className="peer-checked:hidden absolute top-4 right-4 w-5 h-5 rounded-md bg-surface-container-high flex items-center justify-center"></div>
                          <div className="hidden peer-checked:flex absolute top-4 right-4 w-5 h-5 rounded-md bg-primary text-on-primary items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              aria-hidden="true"
                            >
                              check
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-butter/60 flex items-center justify-center text-primary">
                              <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                              >
                                explore
                              </span>
                            </div>
                            <span className="font-label text-label font-bold text-primary">
                              IPS &amp; Sejarah Tematik
                            </span>
                          </div>
                          <p className="font-metadata text-metadata text-text-secondary mb-3">
                            Peta Interaktif Jalur Rempah, Dinamika Sosial &amp;
                            Ekonomi
                          </p>
                          <div className="mt-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-text-secondary font-metadata text-[12px]">
                              Naratif Audio Tersedia
                            </span>
                          </div>
                        </label>
                      </div>
                    </fieldset>

                    <fieldset className="flex flex-col gap-space-sm">
                      <div className="flex flex-col">
                        <legend className="font-card-title text-card-title text-primary font-bold">
                          Berapa lama kamu ingin belajar per sesi?
                        </legend>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Pilih durasi yang terasa realistis dan tidak bikin
                          deg-degan.
                        </span>
                      </div>
                      <div className="flex flex-col gap-space-sm pt-space-xs">
                        <label className="cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-start gap-space-md">
                            <input
                              className="mt-1 peer sr-only"
                              name="duration"
                              type="radio"
                              value="15"
                              checked={value.daily_minutes === 15}
                              onChange={() =>
                                setValue({ ...value, daily_minutes: 15 })
                              }
                            />
                            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-on-primary"></span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-space-xs">
                                <span className="font-card-title text-card-title font-bold text-primary">
                                  15 Menit / Hari
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-metadata text-[11px] font-bold">
                                  Sangat Direkomendasikan
                                </span>
                              </div>
                              <p className="font-metadata text-metadata text-text-secondary mt-0.5">
                                Sesi ringan &amp; santai. 1 modul konsep ringkas
                                + 1 latihan santai tanpa beban timer.
                              </p>
                            </div>
                          </div>
                          <div className="mt-space-sm sm:mt-0 flex items-center gap-1 text-primary font-label text-label shrink-0 bg-surface-container-low px-space-sm py-1 rounded-xl">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              spa
                            </span>
                            <span>Fokus Tenang</span>
                          </div>
                        </label>

                        <label className="cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-start gap-space-md">
                            <input
                              className="mt-1 peer sr-only"
                              name="duration"
                              type="radio"
                              value="25"
                              checked={value.daily_minutes === 25}
                              onChange={() =>
                                setValue({ ...value, daily_minutes: 25 })
                              }
                            />
                            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0"></div>
                            <div className="flex flex-col">
                              <span className="font-card-title text-card-title font-bold text-primary">
                                25 Menit / Hari
                              </span>
                              <p className="font-metadata text-metadata text-text-secondary mt-0.5">
                                Ritme Pomodoro Lembut. 1 bab konsep terarah +
                                latihan cek pemahaman + jeda peregangan.
                              </p>
                            </div>
                          </div>
                          <div className="mt-space-sm sm:mt-0 flex items-center gap-1 text-text-secondary font-label text-label shrink-0 bg-surface-container-low px-space-sm py-1 rounded-xl">
                            <span
                              className="material-symbols-outlined text-[18px]"
                              aria-hidden="true"
                            >
                              timer
                            </span>
                            <span>Moderat</span>
                          </div>
                        </label>

                        <label className="cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-space-md rounded-2xl bg-surface shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-start gap-space-md w-full">
                            <input
                              className="mt-1 peer sr-only"
                              name="duration"
                              type="radio"
                              value="custom"
                              checked={![15, 25].includes(value.daily_minutes)}
                              onChange={() =>
                                setValue({ ...value, daily_minutes: 20 })
                              }
                            />
                            <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0"></div>
                            <div className="flex flex-col w-full">
                              <span className="font-card-title text-card-title font-bold text-primary">
                                Atur Durasi Sendiri
                              </span>
                              <p className="font-metadata text-metadata text-text-secondary mt-0.5">
                                Tentukan menit sesuai kelonggaran jadwal
                                pribadimu (10 - 45 menit).
                              </p>
                              <div className="mt-space-sm flex items-center gap-space-sm">
                                <input
                                  aria-label="Jumlah menit belajar per sesi"
                                  className="w-24 h-10 px-3 rounded-xl bg-surface-container-low text-primary font-label text-label focus:ring-2 focus:ring-focus outline-none"
                                  max="240"
                                  min="5"
                                  type="number"
                                  value={value.daily_minutes}
                                  onChange={(e) =>
                                    setValue({
                                      ...value,
                                      daily_minutes: +e.target.value,
                                    })
                                  }
                                />
                                <span className="font-metadata text-metadata text-text-secondary">
                                  menit per sesi
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </fieldset>

                    <div className="flex flex-col gap-space-sm">
                      <div className="flex flex-col">
                        <label className="font-card-title text-card-title text-primary font-bold">
                          Hari Belajar yang Paling Nyaman
                        </label>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Pilih hari-hari di mana energimu biasanya lebih
                          stabil.
                        </span>
                      </div>

                      <div
                        className="flex flex-wrap gap-2 pt-space-xs"
                        id="weekdays-group"
                      >
                        <button
                          aria-pressed={value.available_days.includes(0)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-secondary-container text-primary font-bold shadow-sm"
                          data-day="senin"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(0)}
                        >
                          Senin
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(1)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-secondary-container text-primary font-bold shadow-sm"
                          data-day="selasa"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(1)}
                        >
                          Selasa
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(2)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-surface text-text-secondary hover:bg-surface-container shadow-sm"
                          data-day="rabu"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(2)}
                        >
                          Rabu
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(3)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-secondary-container text-primary font-bold shadow-sm"
                          data-day="kamis"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(3)}
                        >
                          Kamis
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(4)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-surface text-text-secondary hover:bg-surface-container shadow-sm"
                          data-day="jumat"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(4)}
                        >
                          Jumat
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(5)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-secondary-container text-primary font-bold shadow-sm"
                          data-day="sabtu"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(5)}
                        >
                          Sabtu
                        </button>
                        <button
                          aria-pressed={value.available_days.includes(6)}
                          className="day-chip px-4 py-2.5 rounded-full font-label text-label transition-all bg-surface text-text-secondary hover:bg-surface-container shadow-sm"
                          data-day="minggu"
                          type="button"
                          disabled={busy}
                          onClick={() => toggleDay(6)}
                        >
                          Minggu
                        </button>
                      </div>
                      <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata mt-1">
                        <span
                          className="material-symbols-outlined text-[18px] text-success"
                          aria-hidden="true"
                        >
                          event_available
                        </span>
                        <span id="days-counter-label">{`${value.available_days.length} hari pilihanmu`}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-card-title text-card-title text-primary font-bold"
                        htmlFor="optional-goal"
                      >
                        Ada target tertentu yang mau kamu capai? (Opsional)
                      </label>
                      <span className="font-metadata text-metadata text-text-secondary">
                        Membantu Mimo mengurutkan bab materi yang paling
                        mendesak.
                      </span>
                      <div className="relative mt-space-xs">
                        <select
                          className="w-full h-12 px-4 pr-10 rounded-xl bg-surface text-primary font-body text-body shadow-sm focus:ring-2 focus:ring-focus appearance-none outline-none"
                          id="optional-goal"
                          value={value.goal}
                          onChange={(e) =>
                            setValue({ ...value, goal: e.target.value })
                          }
                        >
                          <option value="">
                            Mulai belajar dengan lebih santai
                          </option>
                          <option>
                            Sekadar memahami materi sekolah dengan lebih santai
                          </option>
                          <option>
                            Persiapan Penilaian Tengah Semester (PTS) Bulan
                            Depan
                          </option>
                          <option>
                            Mengejar ketertinggalan materi Matematika/IPA
                          </option>
                          <option>
                            Bebas target ujian, ingin memupuk rasa ingin tahu
                            saja
                          </option>
                        </select>
                        <span
                          className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[22px]"
                          aria-hidden="true"
                        >
                          expand_more
                        </span>
                      </div>
                    </div>
                  </form>
                </div>

                <aside className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
                  <div className="p-space-lg rounded-[24px] bg-surface shadow-md flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            calendar_month
                          </span>
                        </div>
                        <h2 className="font-card-title text-card-title text-primary font-bold">
                          Pratinjau Ritme Belajarmu
                        </h2>
                      </div>
                      <span className="font-metadata text-metadata text-success bg-secondary-container/60 px-2 py-0.5 rounded-full font-bold">
                        Bebas Stres
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-space-sm p-space-sm rounded-xl bg-surface-container-low">
                      <div className="flex flex-col">
                        <span className="font-metadata text-metadata text-text-secondary">
                          Waktu / Sesi
                        </span>
                        <span className="font-card-title text-card-title font-bold text-primary">
                          15 Menit
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-metadata text-metadata text-text-secondary">
                          Jadwal Mingguan
                        </span>
                        <span className="font-card-title text-card-title font-bold text-primary">
                          4 Hari Aktif
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-sm pt-space-xs">
                      <span className="font-label text-label font-bold text-primary flex items-center gap-1.5">
                        <span
                          className="material-symbols-outlined text-[18px] text-peach"
                          aria-hidden="true"
                        >
                          play_circle
                        </span>
                        Simulasi Hari Pertama Bersama Mimo:
                      </span>
                      <div className="flex flex-col gap-2 p-space-sm rounded-xl bg-surface-container">
                        <div className="flex items-start gap-space-sm">
                          <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-metadata text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label text-label text-primary font-bold">
                              09.00 - 09.10 (10 Menit)
                            </span>
                            <p className="font-metadata text-metadata text-text-secondary">
                              Baca santai konsep Fotosintesis via Reading
                              Companion ramah disleksia.
                            </p>
                          </div>
                        </div>
                        <div className="h-px bg-outline-variant/40 ml-3"></div>
                        <div className="flex items-start gap-space-sm">
                          <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary font-metadata text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label text-label text-primary font-bold">
                              09.10 - 09.15 (5 Menit)
                            </span>
                            <p className="font-metadata text-metadata text-text-secondary">
                              Cek pemahaman 2 soal tanpa batasan waktu ataupun
                              penalti salah.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-space-md rounded-2xl bg-secondary-container/40 flex items-start gap-space-sm">
                      <span
                        className="material-symbols-outlined text-success text-[24px] shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        sentiment_satisfied
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label text-label font-bold text-primary">
                          Prinsip Nol Rasa Bersalah
                        </span>
                        <p className="font-metadata text-metadata text-text-secondary">
                          Kalau kamu terlewat suatu hari, tidak akan ada tanda
                          silang merah, alarm bising, atau pengurangan poin.
                          Mimo akan langsung menggeser jadwalmu secara luwes.
                        </p>
                      </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-primary-container p-space-md text-on-primary flex items-center justify-between">
                      <div className="flex flex-col z-10 max-w-[70%]">
                        <span className="font-metadata text-[12px] uppercase text-primary-fixed tracking-wider">
                          Modul Pertama
                        </span>
                        <span className="font-card-title text-card-title font-bold text-on-primary mt-1">
                          Fotosintesis: Menangkap Cahaya
                        </span>
                        <span className="font-metadata text-metadata text-primary-fixed-dim mt-0.5">
                          IPA Biologi SMP/MTs
                        </span>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                        <span
                          className="material-symbols-outlined text-secondary-container text-[36px]"
                          aria-hidden="true"
                        >
                          nature
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata px-space-sm">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      lock
                    </span>
                    <span>
                      Target ini sepenuhnya milikmu dan bisa dijeda kapan saja
                      melalui Pengaturan.
                    </span>
                  </div>
                </aside>
              </div>

              <div className="mt-space-xxl pt-space-lg border-t border-divider flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md">
                <button
                  className="font-label text-label text-text-secondary hover:text-primary transition-colors py-2 px-space-sm text-center"
                  data-path="onboarding/rencana"
                  type="button"
                  disabled={busy}
                  onClick={() => goto(3)}
                >
                  Lewati pengaturan target (Gunakan ritme santai bawaan 15
                  menit)
                </button>
                <div className="flex items-center gap-space-md w-full sm:w-auto">
                  <button
                    className="inline-flex items-center justify-center gap-space-xs w-full sm:w-auto h-12 px-space-xl rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md focus:ring-2 focus:ring-focus"
                    data-path="onboarding/rencana"
                    type="button"
                    disabled={busy}
                    onClick={() => goto(3)}
                    aria-label="Lanjut ke langkah berikutnya"
                  >
                    <span>Lihat Rencana Belajarku</span>
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
        </main>
      ) : (
        <main className="w-full pt-20 bg-background" id="main-content">
          <div className="flex flex-col w-full">
            <section className="w-full bg-surface-bright/80 backdrop-blur-md sticky top-20 z-30 py-space-sm px-gutter">
              <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-space-md">
                <button
                  aria-label="Kembali ke halaman pemilihan target belajar"
                  className="inline-flex items-center gap-space-xs text-primary font-label text-label hover:text-secondary transition-colors focus:ring-2 focus:ring-focus rounded-lg px-space-xs py-space-xs"
                  type="button"
                  disabled={busy}
                  onClick={() => goto(2)}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[20px]"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Target Belajar</span>
                </button>

                <div
                  aria-label="Status onboarding"
                  className="flex items-center gap-space-md"
                  role="region"
                >
                  <div aria-hidden="true" className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="w-7 h-2.5 rounded-full bg-primary flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    </span>
                  </div>
                  <span className="font-metadata text-metadata text-primary font-bold">
                    Langkah 4 dari 4:{" "}
                    <span className="text-secondary font-semibold">
                      Rencana Siap!
                    </span>
                  </span>
                </div>

                <button
                  aria-label="Pengaturan Aksesibilitas Cepat (Alt + A)"
                  className="inline-flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container text-primary font-metadata text-metadata px-space-sm py-space-xs rounded-full transition-colors focus:ring-2 focus:ring-focus"
                  id="a11y-panel-toggle"
                  type="button"
                  disabled={busy}
                  onClick={() => goto(1)}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary text-[18px]"
                  >
                    accessibility_new
                  </span>
                  <span className="font-semibold">Pintasan Aksesibilitas</span>
                  <kbd className="hidden sm:inline bg-surface px-1.5 py-0.5 rounded text-[11px] text-text-secondary font-metadata">
                    Alt+A
                  </kbd>
                </button>
              </div>
            </section>

            <div className="w-full max-w-[1200px] mx-auto px-gutter pt-space-md pb-space-xxl">
              <header className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-space-md sm:p-space-xl mb-space-lg relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none"
                ></div>
                <div
                  aria-hidden="true"
                  className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-butter/25 blur-2xl pointer-events-none"
                ></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                  <div className="lg:col-span-8 flex flex-col gap-space-sm">
                    <div className="inline-flex items-center gap-space-xs bg-secondary-container text-on-secondary-container px-space-sm py-space-xs rounded-full w-fit">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px] text-primary"
                      >
                        arrow_back_ios_new
                      </span>
                      <span className="font-metadata text-metadata font-bold tracking-wide uppercase text-primary">
                        Rencana Belajarmu Telah Tersusun
                      </span>
                    </div>
                    <h1 className="font-display text-display text-primary tracking-tight">{`Halo, ${value.display_name}! Rencana awalmu siap.`}</h1>
                    <p className="font-body text-body text-text-secondary max-w-2xl">
                      Semuanya disesuaikan dengan cara belajar pilihanmu:
                      santai, tanpa desakan waktu, dan fleksibel mengikuti
                      energimu setiap hari.
                    </p>

                    <div className="mt-space-sm bg-secondary-container/40 rounded-xl p-space-md flex items-start gap-space-md relative">
                      <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-secondary text-[24px]"
                        >
                          sentiment_satisfied
                        </span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <span className="font-label text-label text-primary uppercase tracking-wider text-[12px]">
                          Pesan Hangat dari Mimo:
                        </span>
                        <p className="font-mimo-voice text-mimo-voice text-primary">
                          “Selamat bergabung! Mulai hari ini, belajar nggak lagi
                          bikin deg-degan. Kalau kamu lelah atau ada jadwal
                          dadakan, serahkan ke Mimo buat atur ulang ya!”
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center items-center relative">
                    <div className="relative w-52 sm:w-64 h-52 sm:h-64 flex items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-butter/30 rounded-full scale-95 blur-md"
                      ></div>

                      <Image
                        alt="Mimo, teman belajarmu"
                        className="w-full h-full object-contain relative z-10 drop-shadow-sm select-none"
                        data-alt="Mimo the friendly pale green chameleon sitting calmly atop a stack of three soft pastel colored books in soft mint, lavender, and gentle peach tones. Mimo is smiling warmly and waving with one hand, featuring big curious eyes and subtle rosy blush on its cheeks. Hand-drawn editorial zine illustration style with soft organic outlines and a warm cream minimalist background."
                        src="/design/mimo.png"
                        width={1024}
                        height={1024}
                      />
                    </div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                <section className="lg:col-span-8 flex flex-col gap-space-lg">
                  <article className="bg-surface rounded-2xl shadow-sm p-space-lg flex flex-col gap-space-md">
                    <div className="flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-primary text-[24px]"
                        >
                          tune
                        </span>
                        <h2 className="font-section-title text-section-title text-primary">
                          Profil Belajarmu Saat Ini
                        </h2>
                      </div>
                      <button
                        aria-label="Ubah preferensi sensori dan baca"
                        className="font-label text-label text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 focus:ring-2 focus:ring-focus rounded-lg px-2 py-1"
                        type="button"
                        disabled={busy}
                        onClick={() => goto(1)}
                      >
                        <span>Ubah Preferensi</span>
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[16px]"
                        >
                          edit
                        </span>
                      </button>
                    </div>

                    <div className="inline-flex items-center gap-space-xs bg-secondary-fixed/50 px-space-sm py-space-xs rounded-xl w-fit">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-success text-[18px]"
                      >
                        menu_book
                      </span>
                      <span className="font-label text-label text-on-secondary-fixed font-bold">
                        Modus Teman Baca (Reading Companion) &amp; Focus
                        Navigator
                      </span>
                    </div>

                    <div
                      aria-label="Rincian fitur aksesibilitas dan jadwal aktif"
                      className="flex flex-wrap gap-space-xs pt-space-xs"
                      role="list"
                    >
                      <div
                        className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-full"
                        role="listitem"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-text-secondary text-[16px]"
                        >
                          format_size
                        </span>
                        <span className="font-metadata text-metadata text-primary font-semibold">{`${value.preferences.font_family === "nunito" ? "Nunito" : value.preferences.font_family === "system" ? "Huruf Sistem" : "Plus Jakarta Sans"} · ${value.preferences.font_size}px`}</span>
                      </div>
                      <div
                        className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-full"
                        role="listitem"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-text-secondary text-[16px]"
                        >
                          view_stream
                        </span>
                        <span className="font-metadata text-metadata text-primary font-semibold">
                          Reading Ruler Aktif
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-full"
                        role="listitem"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-text-secondary text-[16px]"
                        >
                          do_not_disturb_on
                        </span>
                        <span className="font-metadata text-metadata text-primary font-semibold">
                          Redam Distraksi
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-full"
                        role="listitem"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-text-secondary text-[16px]"
                        >
                          timer
                        </span>
                        <span className="font-metadata text-metadata text-primary font-semibold">{`Ritme Santai ${value.daily_minutes} Menit/Hari`}</span>
                      </div>
                      <div
                        className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-full"
                        role="listitem"
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-text-secondary text-[16px]"
                        >
                          calendar_month
                        </span>
                        <span className="font-metadata text-metadata text-primary font-semibold">{`${value.available_days.length} Hari Pilihan`}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs pt-space-xs text-muted-gray">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px]"
                      >
                        info
                      </span>
                      <p className="font-metadata text-metadata">
                        Semua setelan ini bisa kamu sesuaikan kapan saja lewat
                        menu Pengaturan di ruang akunmu.
                      </p>
                    </div>
                  </article>

                  <article className="bg-surface rounded-2xl shadow-sm p-space-lg flex flex-col gap-space-md">
                    <div className="flex flex-wrap items-center justify-between gap-space-sm">
                      <div>
                        <span className="font-label text-label uppercase text-secondary font-bold tracking-wider">
                          Langkah Pertama
                        </span>
                        <h2 className="font-section-title text-section-title text-primary">
                          {"Pratinjau Alur Belajar Perdana"}
                        </h2>
                      </div>

                      <div className="bg-secondary-container text-primary font-label text-label px-space-sm py-space-xs rounded-xl flex items-center gap-space-xs">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          schedule
                        </span>
                        <span>{`Total Waktu: ${value.daily_minutes} Menit · Contoh alur`}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-md pt-space-xs">
                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md transition-all hover:bg-surface-container">
                        <div className="flex items-start gap-space-md">
                          <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 mt-0.5 text-primary">
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined text-[22px]"
                            >
                              auto_stories
                            </span>
                          </div>
                          <div className="flex flex-col gap-space-xs">
                            <div className="flex flex-wrap items-center gap-space-xs">
                              <span className="font-label text-label font-bold text-primary">{`${Math.round((value.daily_minutes * 2) / 3)} menit • Waktu fleksibel`}</span>
                              <span className="bg-surface px-2 py-0.5 rounded-full font-metadata text-[12px] text-text-secondary">
                                IPA Biologi SMP/MTs Kelas 8
                              </span>
                            </div>
                            <h3 className="font-card-title text-card-title text-primary">
                              Membaca Santai: Fotosintesis &amp; Menangkap
                              Cahaya
                            </h3>
                            <p className="font-body text-body text-text-secondary text-[14px]">
                              Format editorial pendek dengan visual bersahabat
                              dan ringkasan intisari otomatis.
                            </p>
                            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                              <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-md font-metadata text-[12px] text-primary">
                                <span
                                  aria-hidden="true"
                                  className="material-symbols-outlined text-[14px] text-secondary"
                                >
                                  hearing
                                </span>
                                Tersedia Audio Narasi
                              </span>
                              <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-md font-metadata text-[12px] text-primary">
                                <span
                                  aria-hidden="true"
                                  className="material-symbols-outlined text-[14px] text-secondary"
                                >
                                  speed
                                </span>
                                Kecepatan Terbimbing
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          aria-label="Mulai membaca materi Fotosintesis"
                          className="shrink-0 bg-primary-container text-on-primary hover:bg-primary-hover font-label text-label px-space-md py-space-xs rounded-xl flex items-center gap-1 focus:ring-2 focus:ring-focus transition-colors shadow-sm"
                          type="button"
                          disabled={busy}
                          onClick={() => goto(3)}
                        >
                          <span>Pratinjau</span>
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                          >
                            chevron_right
                          </span>
                        </button>
                      </div>

                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md transition-all hover:bg-surface-container">
                        <div className="flex items-start gap-space-md">
                          <div className="w-10 h-10 rounded-xl bg-butter/60 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined text-[22px]"
                            >
                              quiz
                            </span>
                          </div>
                          <div className="flex flex-col gap-space-xs">
                            <div className="flex flex-wrap items-center gap-space-xs">
                              <span className="font-label text-label font-bold text-primary">{`${value.daily_minutes - Math.round((value.daily_minutes * 2) / 3)} menit • Latihan santai`}</span>
                              <span className="bg-surface px-2 py-0.5 rounded-full font-metadata text-[12px] text-text-secondary">
                                Refleksi Santai
                              </span>
                            </div>
                            <h3 className="font-card-title text-card-title text-primary">
                              Latihan 2 Soal Penguatan Konsep
                            </h3>
                            <p className="font-body text-body text-text-secondary text-[14px]">
                              Menghubungkan klorofil dengan pembentukan oksigen
                              lewat teka-teki interaktif.
                            </p>
                            <div className="pt-space-xs">
                              <span className="inline-flex items-center gap-1 bg-secondary-container/60 text-primary px-2.5 py-1 rounded-full font-metadata text-[12px] font-semibold">
                                <span
                                  aria-hidden="true"
                                  className="material-symbols-outlined text-[14px] text-success"
                                >
                                  sentiment_very_satisfied
                                </span>
                                Bebas coba berkali-kali tanpa nilai merah
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 font-metadata text-metadata text-muted-gray bg-surface px-space-sm py-space-xs rounded-xl">
                          Otomatis terbuka
                        </span>
                      </div>
                    </div>
                  </article>

                  <article className="bg-surface rounded-2xl shadow-sm p-space-lg flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-secondary text-[24px]"
                      >
                        favorite
                      </span>
                      <h2 className="font-section-title text-section-title text-primary">
                        Bagaimana TemanBelajar Beradaptasi Buat Kamu
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
                        <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-primary mb-1">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                          >
                            spa
                          </span>
                        </div>
                        <h3 className="font-card-title text-card-title text-primary text-[16px]">
                          Nol Rasa Bersalah
                        </h3>
                        <p className="font-body text-body text-text-secondary text-[14px]">
                          Hari ini sedang capek atau banyak tugas sekolah?
                          Jadwal otomatis digeser tanpa berkurang poin atau
                          teguran.
                        </p>
                      </div>

                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
                        <div className="w-8 h-8 rounded-lg bg-butter/60 flex items-center justify-center text-primary mb-1">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                          >
                            lightbulb
                          </span>
                        </div>
                        <h3 className="font-card-title text-card-title text-primary text-[16px]">
                          Penjelasan Masuk Akal
                        </h3>
                        <p className="font-body text-body text-text-secondary text-[14px]">
                          Setiap materi yang Mimo rekomendasikan selalu
                          dilengkapi alasan konkret mengapa topik ini cocok buat
                          langkahmu.
                        </p>
                      </div>

                      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
                        <div className="w-8 h-8 rounded-lg bg-tertiary-fixed/60 flex items-center justify-center text-primary mb-1">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px]"
                          >
                            lock
                          </span>
                        </div>
                        <h3 className="font-card-title text-card-title text-primary text-[16px]">
                          Privasi &amp; Kendali
                        </h3>
                        <p className="font-body text-body text-text-secondary text-[14px]">
                          Catatan belajarmu tersimpan aman di perangkat lokal.
                          Tidak ada pelacakan performa kompetitif atau papan
                          peringkat.
                        </p>
                      </div>
                    </div>
                  </article>
                </section>

                <aside className="lg:col-span-4 flex flex-col gap-space-md sticky top-36">
                  <div className="bg-secondary-container rounded-2xl p-space-lg flex flex-col gap-space-md shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label text-label uppercase text-on-secondary-container tracking-wider text-[12px] font-bold">
                        Rangkuman Rencana
                      </span>
                      <span className="bg-surface/80 text-primary font-metadata text-[12px] font-bold px-2 py-0.5 rounded-full">
                        Aktif Hari Ini
                      </span>
                    </div>
                    <h2 className="font-card-title text-card-title text-primary text-[20px]">
                      Ringkasan Rencana Mingguan
                    </h2>

                    <div className="flex flex-col gap-space-sm bg-surface/70 rounded-xl p-space-md">
                      <div className="flex items-center justify-between">
                        <span className="font-metadata text-metadata text-text-secondary flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px] text-secondary"
                          >
                            event_repeat
                          </span>
                          Frekuensi:
                        </span>
                        <span className="font-label text-label text-primary font-bold">{`${value.available_days.length} Sesi / Minggu`}</span>
                      </div>
                      <div className="w-full h-px bg-surface-container"></div>
                      <div className="flex items-center justify-between">
                        <span className="font-metadata text-metadata text-text-secondary flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px] text-secondary"
                          >
                            hourglass_bottom
                          </span>
                          Durasi Belajar:
                        </span>
                        <span className="font-label text-label text-primary font-bold">{`~${value.available_days.length * value.daily_minutes} Menit total`}</span>
                      </div>
                      <div className="w-full h-px bg-surface-container"></div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-metadata text-metadata text-text-secondary flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px] text-secondary"
                          >
                            bookmarks
                          </span>
                          Materi Fokus:
                        </span>
                        <span className="font-label text-label text-primary font-bold text-right">
                          {value.subjects.join(" & ") || "Belum dipilih"}
                        </span>
                      </div>
                      <div className="w-full h-px bg-surface-container"></div>
                      <div className="flex items-center justify-between">
                        <span className="font-metadata text-metadata text-text-secondary flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[18px] text-secondary"
                          >
                            style
                          </span>
                          Gaya Desain:
                        </span>
                        <span className="font-label text-label text-primary font-bold">
                          Editorial Zine
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface rounded-xl p-space-sm flex items-center gap-space-sm">
                      <div
                        aria-hidden="true"
                        className="w-3 h-3 rounded-full bg-success animate-pulse"
                      ></div>
                      <div className="flex flex-col">
                        <span className="font-metadata text-metadata font-bold text-primary text-[13px]">
                          Materi Demo Siap:
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary text-[12px]">
                          Fotosintesis &amp; Klorofil
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs pt-space-xs">
                      <button
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold flex items-center justify-center gap-space-xs shadow-md transition-all focus:ring-2 focus:ring-focus"
                        role="button"
                        type="button"
                        disabled={busy}
                        onClick={() => finish()}
                      >
                        <span>Mulai Belajar Sekarang</span>
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[20px]"
                        >
                          arrow_forward
                        </span>
                      </button>

                      <button
                        className="w-full h-11 rounded-xl bg-surface hover:bg-surface-container-low text-primary font-label text-label font-semibold flex items-center justify-center gap-space-xs transition-colors focus:ring-2 focus:ring-focus"
                        type="button"
                        disabled={busy}
                        onClick={() => goto(2)}
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          history
                        </span>
                        <span>Ubah Tujuan &amp; Ritme</span>
                      </button>
                    </div>

                    <div className="text-center pt-space-xs">
                      <p className="font-metadata text-metadata text-text-secondary text-[12px]">
                        Atau ingin langsung melihat beranda?
                        <button
                          className="text-primary font-bold hover:underline focus:ring-1 focus:ring-focus rounded"
                          type="button"
                          disabled={busy}
                          onClick={() => finish()}
                        >
                          Masuk ke Beranda Utama
                        </button>
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl p-space-md shadow-sm flex items-start gap-space-sm">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-butter text-[28px] shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      tips_and_updates
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label text-label text-primary font-bold text-[13px]">
                        Kiat Dari Mimo:
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary text-[13px]">
                        Nggak perlu terburu-buru menghafal. Nikmati membaca
                        dengan segelas air putih hangat dan posisi duduk yang
                        paling nyaman buatmu.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>

              <section
                aria-label="Jaminan Aksesibilitas dan Privasi"
                className="mt-space-xl pt-space-lg bg-surface-container-low rounded-2xl p-space-md sm:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-text-secondary"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      verified_user
                    </span>
                  </div>
                  <p className="font-metadata text-metadata">
                    Standar Aksesibilitas{" "}
                    <strong className="text-primary font-semibold">
                      WCAG 2.2 AA
                    </strong>{" "}
                    aktif: kontras warna terjamin, navigasi penuh papan ketik
                    (Tab &amp; Enter), ramah pembaca layar (screen-reader),
                    serta tanpa animasi berkedip mendadak.
                  </p>
                </div>
                <div className="flex items-center gap-space-md shrink-0">
                  <button
                    className="text-primary font-metadata text-metadata hover:underline focus:ring-2 focus:ring-focus rounded px-1"
                    type="button"
                    disabled={busy}
                    onClick={() => window.scrollTo({ top: 0 })}
                  >
                    Kembali ke Atas ↑
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      )}
      {(error || issue) && (
        <p role="alert" className="stitch-landing-error">
          {issue || error}
        </p>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export function Landing({
  onContinue,
  error,
}: {
  onContinue: () => void;
  error: string;
}) {
  const [previewMode, setPreviewMode] = useState("focus"),
    [previewStep, setPreviewStep] = useState(0),
    [paused, setPaused] = useState(true),
    [seconds, setSeconds] = useState(0),
    [ruler, setRuler] = useState(false),
    [previewNotice, setPreviewNotice] = useState("");
  const paragraphs = [
    "Tumbuhan memakai energi cahaya saat melakukan fotosintesis. Klorofil membantu menyerap energi cahaya.",
    "Air dan karbon dioksida digunakan untuk membentuk gula. Proses ini juga menghasilkan oksigen.",
    "Gula yang terbentuk dapat digunakan tumbuhan sebagai sumber energi dan bahan pertumbuhan.",
  ];
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [paused]);
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [],
  );
  function speak() {
    if (!("speechSynthesis" in window)) {
      setPreviewNotice("Baca nyaring belum tersedia di browser ini.");
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(paragraphs.join(" "));
    speech.lang = "id-ID";
    speech.rate = 0.85;
    speechSynthesis.speak(speech);
  }
  return (
    <div className="stitch-shell stitch-landing">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-space-sm focus:left-space-sm focus:z-50 focus:px-space-md focus:py-space-sm focus:bg-surface focus:text-primary focus:outline-none focus:ring-2 focus:ring-focus rounded-xl shadow-[0_4px_16px_rgba(39,59,53,0.08)] font-label text-label"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-[1280px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <Image
              alt="TemanBelajar"
              className="h-8 w-auto object-contain"
              src="/design/logo.png"
              width={640}
              height={240}
            />
            <span className="font-display text-card-title text-primary tracking-tight font-extrabold">
              SMP &amp; SMA
            </span>
          </div>
          <nav
            className="hidden lg:flex items-center gap-space-lg"
            data-active-classes="bg-secondary-container text-primary font-bold rounded-full px-space-md py-space-xs"
          >
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="cara-kerja"
              href="#cara-kerja"
            >
              Cara Kerja
            </a>
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="fitur-belajar"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              Fitur Belajar
            </a>
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="aksesibilitas"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              Aksesibilitas
            </a>
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="untuk-sekolah"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              Untuk Sekolah
            </a>
          </nav>
          <div className="flex items-center gap-space-sm">
            <a
              className="hidden sm:inline-flex items-center justify-center h-11 px-space-lg rounded-xl bg-surface text-primary-container font-label text-label hover:bg-surface-container-low transition-colors outline-none focus:outline-none focus:ring-2 focus:ring-focus"
              data-path="masuk"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              Masuk
            </a>
            <a
              className="inline-flex items-center justify-center h-11 px-space-lg rounded-xl bg-primary-container text-on-primary font-label text-label hover:bg-primary-hover hover:text-on-primary active:bg-primary-pressed transition-colors shadow-[0_4px_16px_rgba(39,59,53,0.08)] outline-none focus:outline-none focus:ring-2 focus:ring-focus"
              data-path="mulai-belajar"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              Mulai Belajar
            </a>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs shrink-0">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-on-primary text-[18px]"
              >
                person
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full pt-20 bg-background" id="main-content">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-48 right-12 w-64 h-64 bg-butter/30 rounded-full blur-2xl pointer-events-none -z-10"></div>
            <div className="absolute top-72 left-8 w-72 h-72 bg-peach/25 rounded-full blur-2xl pointer-events-none -z-10"></div>

            <section className="max-w-[1280px] mx-auto px-gutter pt-space-xl pb-space-xxl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
                  <div className="inline-flex items-center gap-space-xs bg-surface shadow-sm rounded-full px-space-md py-space-xs">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-success"></span>
                    <span className="font-label text-label text-primary font-bold">
                      Ruang Belajar Ramah Neurodiversitas
                    </span>
                    <span className="font-metadata text-metadata text-muted-gray">
                      • SMP &amp; SMA
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    <h1 className="font-display text-display text-primary tracking-tight">
                      Setiap orang punya cara belajarnya sendiri.
                    </h1>
                    <p className="font-reading text-reading text-text-secondary max-w-xl">
                      Kenalan sama cara belajar yang paling nyaman buat kamu.
                      Tanpa kuis tergesa-gesa, bebas stres, dan Mimo selalu siap
                      nemenin langkahmu!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto pt-space-xs">
                    <a
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs h-12 px-space-xl rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed shadow-md transition-all"
                      data-path="mulai-belajar"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onContinue();
                      }}
                    >
                      <span>Mulai belajar</span>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]"
                      >
                        arrow_forward
                      </span>
                    </a>
                    <a
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs h-12 px-space-xl rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container-low shadow-sm transition-all"
                      href="#cara-kerja"
                    >
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[20px] text-secondary"
                      >
                        play_circle
                      </span>
                      <span>Lihat cara kerjanya</span>
                    </a>
                  </div>

                  <div className="pt-space-md flex flex-wrap items-center gap-space-md text-text-secondary font-metadata text-metadata">
                    <div className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-success text-[18px]"
                      >
                        check_circle
                      </span>
                      <span>{"Coba materi contoh tanpa email"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-success text-[18px]"
                      >
                        timer_off
                      </span>
                      <span>Bebas Atur Ritme Sendiri</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-success text-[18px]"
                      >
                        accessibility_new
                      </span>
                      <span>{"Target aksesibilitas WCAG 2.2 AA"}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
                  <div className="relative bg-surface rounded-2xl p-space-md shadow-md max-w-sm mb-space-sm z-20 self-end mr-4">
                    <div className="flex items-start gap-space-xs">
                      <span className="text-xl">🌿</span>
                      <p className="font-mimo-voice text-mimo-voice text-primary">
                        &quot;Hai! Aku Mimo. Yuk temukan caramu memahami materi
                        tanpa rasa cemas!&quot;
                      </p>
                    </div>

                    <div className="absolute -bottom-2 right-12 w-4 h-4 bg-surface rotate-45 shadow-sm"></div>
                  </div>

                  <div className="relative w-full max-w-[380px] bg-gradient-to-b from-surface-container-lowest to-surface-container rounded-3xl p-space-lg shadow-sm flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary-container/50 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-peach/40 rounded-full blur-xl"></div>
                    <Image
                      className="w-full max-w-[300px] h-auto object-contain relative z-10 drop-shadow-sm transition-transform duration-300 hover:scale-105"
                      data-alt="A friendly green chameleon named Mimo waving pleasantly while sitting atop a neat stack of colorful pastel textbooks in shades of mint, lavender, and soft orange. Clean storybook indie zine illustration style with soft organic lines, warm cream background, and deep forest green outlines."
                      src="/design/mimo.png"
                      width={1024}
                      height={1024}
                      alt="Mimo, teman belajarmu"
                    />

                    <div className="absolute bottom-6 left-4 bg-secondary-container text-primary font-label text-label px-space-md py-space-xs rounded-full shadow-sm z-20 flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px]"
                      >
                        school
                      </span>
                      <span>Adaptif untuk SMP &amp; SMA</span>
                    </div>
                    <div className="absolute top-6 left-4 bg-butter text-primary font-label text-label px-space-md py-space-xs rounded-full shadow-sm z-20 flex items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px]"
                      >
                        tune
                      </span>
                      <span>Bebas atur kecepatanmu</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section
            className="w-full max-w-[1280px] mx-auto px-gutter py-space-xxl"
            id="cara-kerja"
          >
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
              <span className="bg-secondary-container text-primary font-label text-label px-space-md py-space-xs rounded-full mb-space-sm">
                Pilihan Format Belajar Adaptif
              </span>
              <h2 className="font-display text-page-title text-primary tracking-tight">
                5 Cara Belajar yang Bisa Kamu Pilih
              </h2>
              <p className="font-reading text-reading text-text-secondary mt-space-xs">
                {
                  "Pilih format yang tersedia untuk materi kamu. Ganti format tanpa kehilangan posisi belajar."
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
              <div className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[26px]"
                      >
                        menu_book
                      </span>
                    </div>
                    <span className="bg-secondary-container text-primary font-label text-label px-space-sm py-space-xs rounded-full">
                      Teman Baca
                    </span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    Reading Companion
                  </h3>
                  <p className="font-body text-body text-text-secondary mb-space-md">
                    Dirancang untuk membaca tanpa pusing. Sesuaikan ukuran font,
                    jarak baris ekstra lega, pemandu penggaris baca, dan sorotan
                    baris kalimat aktif.
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center gap-space-sm font-metadata text-metadata text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary text-[20px]"
                  >
                    format_size
                  </span>
                  <span>
                    {"Ukuran, jarak baris, dan jenis huruf dapat disesuaikan"}
                  </span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-primary">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[26px]"
                      >
                        splitscreen
                      </span>
                    </div>
                    <span className="bg-tertiary-fixed text-primary font-label text-label px-space-sm py-space-xs rounded-full">
                      Selangkah demi Selangkah
                    </span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    Focus Navigator
                  </h3>
                  <p className="font-body text-body text-text-secondary mb-space-md">
                    Satu tugas dalam satu waktu. Layar menyembunyikan materi
                    yang belum dibahas sehingga pikiran tetap tenang dan fokus
                    tidak terpecah.
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center gap-space-sm font-metadata text-metadata text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-tertiary text-[20px]"
                  >
                    pause_circle
                  </span>
                  <span>Timer mikro mandiri yang bisa dijeda bebas</span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="w-12 h-12 rounded-xl bg-peach/40 flex items-center justify-center text-primary">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[26px]"
                      >
                        headphones
                      </span>
                    </div>
                    <span className="bg-peach/50 text-primary font-label text-label px-space-sm py-space-xs rounded-full">
                      Dengarkan &amp; Jelajahi
                    </span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    Audio &amp; Visual Explorer
                  </h3>
                  <p className="font-body text-body text-text-secondary mb-space-md">
                    {
                      "Dengarkan bacaan dengan suara perangkatmu, atau jelajahi deskripsi diagram pada materi yang mendukungnya."
                    }
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center gap-space-sm font-metadata text-metadata text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-warning text-[20px]"
                  >
                    graphic_eq
                  </span>
                  <span>Pilihan nada ramah &amp; kecepatan 0.75x–1.5x</span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="w-12 h-12 rounded-xl bg-butter flex items-center justify-center text-primary">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[26px]"
                      >
                        auto_stories
                      </span>
                    </div>
                    <span className="bg-butter text-primary font-label text-label px-space-sm py-space-xs rounded-full">
                      Teks &amp; Visual
                    </span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    Visual &amp; Caption Cards
                  </h3>
                  <p className="font-body text-body text-text-secondary mb-space-md">
                    {
                      "Baca transkrip dan penjelasan konsep pada materi yang menyediakan dukungan tersebut."
                    }
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center gap-space-sm font-metadata text-metadata text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-primary text-[20px]"
                  >
                    photo_album
                  </span>
                  <span>
                    {"Diagram dengan deskripsi teks yang dapat dibaca"}
                  </span>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div className="max-w-md">
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <span className="bg-surface-container text-primary font-label text-label px-space-sm py-space-xs rounded-full">
                      Belajar Biasa
                    </span>
                    <span className="font-metadata text-metadata text-muted-gray">
                      • Standard Tranquil
                    </span>
                  </div>
                  <h3 className="font-card-title text-card-title text-primary mb-space-xs">
                    Ruang Baca Editorial yang Hening &amp; Lengkap
                  </h3>
                  <p className="font-body text-body text-text-secondary">
                    Pengalaman membaca gaya editorial majalah edukasi zine yang
                    tenang. Seluruh alat bantu universal (kamus klik cepat,
                    pemecah paragraf, dan tombol Mimo) siap dipanggil kapan pun
                    dibutuhkan.
                  </p>
                </div>
                <div className="w-full md:w-auto bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-space-xs shrink-0">
                  <div className="flex items-center gap-2 text-primary font-label text-label">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-success text-[20px]"
                    >
                      done_all
                    </span>
                    <span>Semua format terhubung otomatis</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-metadata text-metadata">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      sync
                    </span>
                    <span>Beralih mode tidak mengulang materi</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[1280px] mx-auto px-gutter py-space-xl">
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-space-xxl shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <span className="bg-butter font-label text-label text-primary px-space-sm py-space-xs rounded-full">
                      Pratinjau Interaktif Materi
                    </span>
                    <span className="font-metadata text-metadata text-muted-gray">
                      IPA SMP Kelas 8 · Modul Merdeka
                    </span>
                  </div>
                  <h2 className="font-display text-page-title text-primary">
                    Fotosintesis &amp; Peran Cahaya
                  </h2>
                </div>

                <div className="inline-flex p-1 bg-surface-container rounded-2xl gap-1">
                  <button
                    className="flex items-center gap-1.5 px-space-md py-space-xs rounded-xl font-label text-label bg-surface text-primary shadow-sm transition-all"
                    id="btn-mode-step"
                    onClick={() => setPreviewMode("focus")}
                    aria-pressed={previewMode === "focus"}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      splitscreen
                    </span>
                    <span>Langkah demi Langkah</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-space-md py-space-xs rounded-xl font-label text-label text-text-secondary hover:text-primary transition-all"
                    id="btn-mode-audio"
                    onClick={() => setPreviewMode("audio")}
                    aria-pressed={previewMode === "audio"}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      headphones
                    </span>
                    <span>Audio &amp; Visual</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-space-md py-space-xs rounded-xl font-label text-label text-text-secondary hover:text-primary transition-all"
                    id="btn-mode-text"
                    onClick={() => setPreviewMode("reading")}
                    aria-pressed={previewMode === "reading"}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      menu_book
                    </span>
                    <span>Teman Baca</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-space-lg lg:p-space-xl flex flex-col gap-space-lg min-h-[380px]">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-8 h-8 rounded-full bg-secondary-container text-primary font-bold text-sm flex items-center justify-center">
                        1
                      </span>
                      <span className="font-label text-label text-primary">
                        {`Langkah ${previewStep + 1} dari 3: ${["Sumber Energi Matahari", "Bahan Fotosintesis", "Hasil Fotosintesis"][previewStep]}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-md font-metadata text-metadata text-text-secondary">
                      <span className="flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          schedule
                        </span>{" "}
                        10 menit
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-[18px]"
                        >
                          trending_up
                        </span>{" "}
                        Sedang berkembang
                      </span>
                    </div>
                  </div>

                  <div
                    className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
                    id="preview-content-box"
                    data-mode={previewMode}
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="font-metadata text-metadata bg-secondary-fixed text-primary px-2 py-0.5 rounded-md font-semibold">
                        Kloroplas &amp; Foton
                      </span>
                      <span className="font-metadata text-metadata text-muted-gray">
                        Disederhanakan untuk pemahaman inti
                      </span>
                    </div>
                    <div
                      className={ruler ? "preview-ruler" : ""}
                      aria-live="polite"
                    >
                      {previewMode === "focus" ? (
                        <p
                          tabIndex={ruler ? 0 : undefined}
                          className="font-reading text-reading text-on-surface leading-relaxed"
                        >
                          {paragraphs[previewStep]}
                        </p>
                      ) : (
                        paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="font-reading text-reading text-on-surface leading-relaxed mb-space-sm"
                          >
                            {p}
                          </p>
                        ))
                      )}
                      {previewMode === "audio" && (
                        <button
                          onClick={speak}
                          className="px-space-md py-space-sm rounded-xl bg-secondary-container text-primary"
                        >
                          Bacakan contoh
                        </button>
                      )}
                      {previewNotice && <p role="status">{previewNotice}</p>}
                    </div>

                    <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-around gap-space-sm text-center">
                      <div className="flex flex-col items-center">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-warning text-3xl"
                        >
                          light_mode
                        </span>
                        <span className="font-label text-label text-primary mt-1">
                          Cahaya Surya
                        </span>
                        <span className="font-metadata text-metadata text-muted-gray">
                          Foton diserap
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-muted-gray rotate-90 sm:rotate-0"
                      >
                        add
                      </span>
                      <div className="flex flex-col items-center">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-tertiary text-3xl"
                        >
                          water_drop
                        </span>
                        <span className="font-label text-label text-primary mt-1">
                          Air (H₂O)
                        </span>
                        <span className="font-metadata text-metadata text-muted-gray">
                          Dari akar tanah
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-muted-gray rotate-90 sm:rotate-0"
                      >
                        arrow_forward
                      </span>
                      <div className="flex flex-col items-center bg-secondary-container px-space-md py-space-xs rounded-xl">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-3xl"
                        >
                          eco
                        </span>
                        <span className="font-label text-label text-primary mt-1">
                          Glukosa &amp; O₂
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Energi kehidupan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <button
                        className="h-10 px-space-md rounded-xl bg-surface hover:bg-surface-container text-primary font-label text-label shadow-sm inline-flex items-center gap-1.5 transition-colors"
                        id="preview-pause-btn"
                        onClick={() => setPaused(!paused)}
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                          id="preview-pause-icon"
                        >
                          pause
                        </span>
                        <span id="preview-pause-text">
                          {paused ? "Mulai Waktu" : "Jeda Waktu"}
                        </span>
                      </button>
                      <span className="font-metadata text-metadata text-text-secondary">
                        Waktu fokus berjalan:{" "}
                        <strong
                          className="text-primary font-bold"
                          id="preview-timer-val"
                        >{`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        className="h-10 px-space-md rounded-xl bg-surface text-text-secondary font-label text-label hover:text-primary transition-colors"
                        onClick={() =>
                          setPreviewStep(Math.max(0, previewStep - 1))
                        }
                      >
                        Kembali
                      </button>
                      <button
                        className="h-10 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover shadow-sm inline-flex items-center gap-1"
                        onClick={() => setPreviewStep((previewStep + 1) % 3)}
                      >
                        <span>{`Lanjut ke Langkah ${((previewStep + 1) % 3) + 1}`}</span>
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[16px]"
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-space-md">
                  <div className="bg-secondary-container rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                        M
                      </span>
                      <span className="font-label text-label text-primary font-bold">
                        Catatan Mimo untukmu
                      </span>
                    </div>
                    <p className="font-mimo-voice text-mimo-voice text-primary">
                      &quot;Ingat, kamu nggak perlu menghafal rumus kimianya
                      sekarang. Cukup bayangkan daun sebagai kompor tenaga surya
                      alami!&quot;
                    </p>
                    <div className="flex items-center justify-between pt-space-xs text-text-secondary font-metadata text-metadata">
                      <span>Bisa dipahami?</span>
                      <div className="flex items-center gap-1">
                        <button
                          className="px-2.5 py-1 bg-surface rounded-lg hover:bg-surface-container font-label text-xs text-primary transition-colors"
                          onClick={() =>
                            setPreviewNotice(
                              "Satu konsep sudah kamu pahami. Kamu boleh lanjut saat siap.",
                            )
                          }
                        >
                          Paham!
                        </button>
                        <button
                          className="px-2.5 py-1 bg-surface rounded-lg hover:bg-surface-container font-label text-xs text-primary transition-colors"
                          onClick={() => {
                            setPreviewStep(0);
                            setPreviewNotice(
                              "Kita ulang dari langkah pertama, pelan-pelan.",
                            );
                          }}
                        >
                          Ulangi pelan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                    <span className="font-label text-label text-primary">
                      Alat Baca Nyaman di Layar
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-container text-primary font-metadata text-metadata hover:bg-surface-container-high transition-colors"
                        onClick={() => setRuler(!ruler)}
                        aria-pressed={ruler}
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          format_underlined
                        </span>
                        <span>Garis Baca</span>
                      </button>
                      <button
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-container text-primary font-metadata text-metadata hover:bg-surface-container-high transition-colors"
                        onClick={speak}
                      >
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          volume_up
                        </span>
                        <span>Baca Nyaring</span>
                      </button>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-space-sm font-metadata text-metadata text-text-secondary flex items-center justify-between">
                      <span>Ukuran Teks</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-surface rounded">
                          A-
                        </span>
                        <span className="text-sm font-bold px-2 py-0.5 bg-primary text-on-primary rounded">
                          A
                        </span>
                        <span className="text-base font-bold px-2 py-0.5 bg-surface rounded">
                          A+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[1280px] mx-auto px-gutter py-space-xxl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <span className="bg-peach/60 text-primary font-label text-label px-space-md py-space-xs rounded-full w-fit">
                  Smart Planner Bebas Rasa Bersalah
                </span>
                <h2 className="font-display text-page-title text-primary tracking-tight">
                  Rencana Belajar Harian yang Bisa Kamu Atur Sendiri
                </h2>
                <p className="font-reading text-reading text-text-secondary">
                  Tertinggal jadwal? Nggak masalah. TemanBelajar tidak pernah
                  memberi tanda merah atau hukuman. Sistem otomatis menyarankan
                  penyesuaian jadwal yang realistis agar energimu tetap terjaga.
                </p>

                <div className="bg-surface rounded-2xl p-space-md shadow-sm flex items-start gap-space-sm">
                  <div className="w-9 h-9 rounded-xl bg-butter flex items-center justify-center text-primary shrink-0">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]"
                    >
                      lightbulb
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label text-label text-primary">
                      Usulan Jadwal Cerdas Mimo:
                    </span>
                    <p className="font-metadata text-metadata text-text-secondary mt-0.5">
                      &quot;Cek pemahaman fotosintesis disarankan digeser ke
                      besok pukul 09.00 WIB agar kamu sempat mengistirahatkan
                      mata dan mengulang peran cahaya hari ini tanpa
                      terburu-buru.&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-surface rounded-3xl p-space-lg lg:p-space-xl shadow-md flex flex-col gap-space-md">
                <div className="flex items-center justify-between pb-space-xs">
                  <div>
                    <span className="font-metadata text-metadata text-muted-gray uppercase tracking-wider">
                      Jadwal Hari Ini
                    </span>
                    <h3 className="font-card-title text-card-title text-primary">
                      Senin, 14 Oktober • Waktu Indonesia Barat (WIB)
                    </h3>
                  </div>
                  <span className="bg-secondary-container text-primary font-label text-label px-space-md py-1 rounded-full text-xs font-bold">
                    3 Agenda
                  </span>
                </div>

                <div className="flex flex-col gap-space-sm">
                  <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-md">
                      <span className="w-8 h-8 rounded-full bg-success text-on-primary flex items-center justify-center shrink-0">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          check
                        </span>
                      </span>
                      <div>
                        <span className="font-label text-label text-primary">
                          Ulang materi fotosintesis
                        </span>
                        <div className="font-metadata text-metadata text-text-secondary flex items-center gap-2">
                          <span>09.00 WIB</span>
                          <span>•</span>
                          <span>15 menit</span>
                          <span>•</span>
                          <span>Modul IPA</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-secondary-fixed text-primary font-metadata text-metadata font-bold px-space-md py-1 rounded-full w-fit">
                      Selesai
                    </span>
                  </div>

                  <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-md">
                      <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 animate-pulse">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          play_arrow
                        </span>
                      </span>
                      <div>
                        <span className="font-label text-label text-primary">
                          Latihan singkat 2 soal pemahaman
                        </span>
                        <div className="font-metadata text-metadata text-text-secondary flex items-center gap-2">
                          <span>09.15 WIB</span>
                          <span>•</span>
                          <span>10 menit</span>
                          <span>•</span>
                          <span className="text-focus font-semibold">
                            Tersisa 4 menit
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-butter text-primary font-metadata text-metadata font-bold px-space-md py-1 rounded-full w-fit">
                      Sedang dikerjakan
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-md">
                      <span className="w-8 h-8 rounded-full bg-surface-container text-muted-gray flex items-center justify-center shrink-0">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-[18px]"
                        >
                          schedule
                        </span>
                      </span>
                      <div>
                        <span className="font-label text-label text-primary">
                          Cek pemahaman peran cahaya
                        </span>
                        <div className="font-metadata text-metadata text-text-secondary flex items-center gap-2">
                          <span>09.25 WIB</span>
                          <span>•</span>
                          <span>10 menit</span>
                          <span>•</span>
                          <span>Kuis santai bebas batas waktu</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="font-metadata text-metadata text-text-secondary hover:text-primary underline px-2 py-1"
                        onClick={onContinue}
                      >
                        Tunda ke besok
                      </button>
                      <span className="bg-surface-container-high text-text-secondary font-metadata text-metadata font-bold px-space-md py-1 rounded-full">
                        Belum mulai
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-space-xs font-metadata text-metadata text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-success text-[18px]"
                    >
                      bolt
                    </span>
                    <span>
                      Rekomendasi disesuaikan otomatis dengan energimu
                    </span>
                  </span>
                  <button
                    className="font-label text-label text-primary hover:underline font-bold"
                    onClick={onContinue}
                  >
                    Atur Ulang Jadwal
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[1280px] mx-auto px-gutter py-space-xxl">
            <div className="bg-surface rounded-3xl p-space-lg lg:p-space-xxl shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                <div className="lg:col-span-6 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-space-xs bg-secondary-container text-primary font-label text-label px-space-md py-space-xs rounded-full w-fit">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      verified
                    </span>
                    <span>{"Target aksesibilitas WCAG 2.2 AA"}</span>
                  </div>
                  <h2 className="font-display text-page-title text-primary tracking-tight">
                    Aksesibilitas Bukan Fitur Tambahan. Ini Pondasi Kami.
                  </h2>
                  <p className="font-reading text-reading text-text-secondary">
                    Setiap tombol, warna, dan teks di TemanBelajar dirancang
                    ramah untuk pembaca disleksia, ADHD, autisme, serta siapa
                    pun yang membutuhkan lingkungan belajar yang tenang tanpa
                    stimulasi berlebih.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-label text-primary flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-[18px]"
                        >
                          keyboard
                        </span>
                        Navigasi Keyboard Penuh
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Dapat dijelajahi 100% menggunakan tombol Tab, Spasi, dan
                        Enter tanpa perlu mouse.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-label text-primary flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-[18px]"
                        >
                          contrast
                        </span>
                        Rasio Kontras 11:1
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Jauh melampaui standar minimal 4.5:1 untuk keterbacaan
                        tajam tanpa silau.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-label text-primary flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-[18px]"
                        >
                          screen_search_desktop
                        </span>
                        Dukungan Pembaca Layar
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Struktur semantik ARIA yang bersih untuk NVDA, JAWS, dan
                        TalkBack.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-label text-primary flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-success text-[18px]"
                        >
                          sentiment_very_satisfied
                        </span>
                        Bebas Cemas &amp; Waktu Paksa
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary">
                        Tidak ada hitung mundur panik atau bunyi peringatan
                        stres saat mengerjakan soal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label text-label text-primary font-bold">
                      Panel Kenyamanan Membaca
                    </span>
                    <span className="font-metadata text-metadata text-text-secondary">
                      Tekan{" "}
                      <kbd className="px-1.5 py-0.5 bg-surface rounded text-primary font-mono text-xs shadow-sm">
                        Alt + A
                      </kbd>
                    </span>
                  </div>

                  <div className="bg-surface rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-space-sm">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-primary text-[22px]"
                      >
                        contrast
                      </span>
                      <div>
                        <span className="font-label text-label text-primary block">
                          Mode Kontras Ekstra
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Tinta hitam pekat di atas kanvas murni
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="bg-surface rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-space-sm">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-primary text-[22px]"
                      >
                        spellcheck
                      </span>
                      <div>
                        <span className="font-label text-label text-primary block">
                          Font Ramah Disleksia
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Bobot huruf bawah lebih tebal untuk cegah huruf
                          tertukar
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={true}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="bg-surface rounded-xl p-space-md flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-space-sm">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-primary text-[22px]"
                      >
                        vertical_distribute
                      </span>
                      <div>
                        <span className="font-label text-label text-primary block">
                          Pemandu Baris (Reading Ruler)
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Meredupkan baris atas &amp; bawah agar mata tetap
                          terarah
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="p-space-xs text-center">
                    <span className="font-metadata text-metadata text-text-secondary">
                      Pengaturan tersimpan otomatis di perangkatmu tanpa perlu
                      login.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[1280px] mx-auto px-gutter py-space-xl">
            <div className="relative bg-secondary-container rounded-3xl p-space-xl lg:p-space-xxl shadow-md overflow-hidden flex flex-col md:flex-row items-center justify-between gap-space-xl">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-butter/40 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-peach/40 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-start gap-space-sm max-w-xl">
                <div className="flex items-center gap-space-xs bg-surface/80 rounded-full px-space-md py-1">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-success text-[18px]"
                  >
                    arrow_back_ios_new
                  </span>
                  <span className="font-label text-label text-primary font-bold">
                    Mulai langkah pertamamu
                  </span>
                </div>
                <h2 className="font-display text-page-title text-primary tracking-tight">
                  Siap mulai belajar dengan caramu?
                </h2>
                <p className="font-reading text-reading text-on-secondary-container">
                  Mulai dalam 2 menit tanpa perlu diagnosis atau tes rumit.
                  Pilih mata pelajaran yang ingin kamu pahami hari ini dan
                  biarkan Mimo memandu langkahnya.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-space-md w-full md:w-auto shrink-0">
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs h-12 px-space-xl rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed shadow-md transition-all text-center"
                  data-path="daftar-gratis"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onContinue();
                  }}
                >
                  <span>Mulai Sekarang — Gratis</span>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px]"
                  >
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="w-full bg-surface-container-low mt-space-section">
        <div className="max-w-[1280px] mx-auto px-gutter py-space-xxl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-space-xl">
            <div className="md:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <Image
                  alt="Mimo, teman belajarmu"
                  className="h-7 w-auto object-contain"
                  src="/design/mimo.png"
                  width={1024}
                  height={1024}
                />
                <span className="font-display text-card-title text-primary font-extrabold">
                  TemanBelajar
                </span>
              </div>
              <p className="font-body text-body text-text-secondary max-w-md">
                Platform belajar adaptif berbasis pendekatan editorial zine yang
                tenang, bebas tekanan, dan ramah neurodiversitas untuk pelajar
                SMP &amp; SMA se-Indonesia.
              </p>
              <div className="flex items-center gap-space-xs bg-surface-container rounded-xl p-space-sm w-fit">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-success text-[20px]"
                >
                  verified_user
                </span>
                <span className="font-metadata text-metadata text-text-secondary">
                  Komitmen Aksesibilitas WCAG 2.1 AA
                </span>
              </div>
            </div>
            <div className="md:col-span-2 md:col-start-7 flex flex-col gap-space-sm">
              <span className="font-label text-label text-primary uppercase tracking-wider">
                Eksplorasi
              </span>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="cara-kerja"
                href="#cara-kerja"
              >
                Cara Kerja
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="fitur-belajar"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Fitur Belajar
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="kurikulum-merdeka"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Kurikulum Merdeka
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="mimo-copilot"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Mengenal Mimo
              </a>
            </div>
            <div className="md:col-span-2 flex flex-col gap-space-sm">
              <span className="font-label text-label text-primary uppercase tracking-wider">
                Kemitraan
              </span>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="untuk-sekolah"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Untuk Sekolah
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="pendidik"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Ruang Pendidik
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="dinas-pendidikan"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Dinas Pendidikan
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="riset"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Riset Efektivitas
              </a>
            </div>
            <div className="md:col-span-2 flex flex-col gap-space-sm">
              <span className="font-label text-label text-primary uppercase tracking-wider">
                Dukungan
              </span>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="aksesibilitas"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Pusat Aksesibilitas
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="panduan-orang-tua"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Panduan Orang Tua
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="bantuan"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Bantuan &amp; Kontak
              </a>
              <a
                className="font-metadata text-metadata text-text-secondary hover:text-primary transition-colors"
                data-path="privasi"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Privasi Pelajar
              </a>
            </div>
          </div>
          <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-metadata text-metadata text-muted-gray">
            <span>
              © 2025 TemanBelajar Nusantara. Dirancang dengan kehangatan untuk
              ruang belajar mandiri.
            </span>
            <div className="flex items-center gap-space-md">
              <a
                className="hover:text-primary transition-colors"
                data-path="syarat-ketentuan"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Syarat &amp; Ketentuan
              </a>
              <a
                className="hover:text-primary transition-colors"
                data-path="kebijakan-privasi"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
      {error && (
        <p role="alert" className="stitch-landing-error">
          {error}
        </p>
      )}
    </div>
  );
}

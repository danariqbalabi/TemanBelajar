"use client";
import Image from "next/image";
export function Landing({
  onContinue,
  error,
}: {
  onContinue: () => void;
  error: string;
}) {
  return (
    <>
      <div className="stitch-shell stitch-landing revamp-landing">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-space-sm focus:left-space-sm focus:z-50 focus:px-space-md focus:py-space-sm focus:bg-surface focus:text-primary focus:outline-none focus:ring-2 focus:ring-focus rounded-xl shadow-[0_4px_16px_rgba(39,59,53,0.08)] font-label text-label"
          href="#main-content"
        >
          Lewati ke konten utama
        </a>
        <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-20 max-w-[1280px] mx-auto px-gutter flex items-center justify-between gap-space-md">
            <a
              href="#"
              className="flex items-center gap-space-sm outline-none focus:ring-2 focus:ring-focus rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              <Image
                src="/design/logo-revamp.png"
                alt="TemanBelajar Logo"
                width={1024}
                height={1024}
                className="h-10 w-auto object-contain"
              ></Image>
            </a>
            <nav className="hidden lg:flex items-center gap-space-lg">
              <a
                className="font-label text-label text-on-surface-variant hover:text-primary transition-colors py-space-xs"
                data-path="cara-kerja"
                href="#cara-kerja"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Cara Kerja
              </a>
              <a
                className="font-label text-label text-on-surface-variant hover:text-primary transition-colors py-space-xs"
                data-path="fitur-belajar"
                href="#mode-belajar"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Fitur Belajar
              </a>
              <a
                className="font-label text-label text-on-surface-variant hover:text-primary transition-colors py-space-xs"
                data-path="aksesibilitas"
                href="#aksesibilitas"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Aksesibilitas
              </a>
              <a
                className="font-label text-label text-on-surface-variant hover:text-primary transition-colors py-space-xs"
                data-path="tentang-mimo"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Tentang Mimo
              </a>
            </nav>
            <div className="flex items-center gap-space-sm">
              <a
                className="inline-flex items-center justify-center h-11 px-space-lg rounded-xl bg-surface text-primary-container font-label text-label hover:bg-surface-container-low transition-colors outline-none focus:ring-2 focus:ring-focus"
                data-path="masuk"
                href="#masuk"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                Masuk
              </a>
              <a
                className="inline-flex items-center justify-center h-11 px-space-lg rounded-xl bg-primary-container text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-[0_4px_16px_rgba(39,59,53,0.08)] outline-none focus:ring-2 focus:ring-focus gap-2"
                data-path="mulai-belajar"
                href="#demo-manda"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue();
                }}
              >
                <span>Mulai Belajar</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </header>
        <main className="w-full pt-20 bg-background" id="main-content">
          <div className="flex flex-col w-full">
            <section className="relative w-full py-space-xl lg:py-space-xxl overflow-hidden">
              <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-butter/30 blur-3xl pointer-events-none"></div>
              <div className="max-w-[1240px] mx-auto px-gutter relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                  <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-primary font-label text-xs font-bold tracking-wide shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                      Belajar sesuai ritmemu
                    </div>
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary leading-[1.15] tracking-tight text-balance">
                      Belajar Santai, Pakai Caramu Sendiri 🌿
                    </h1>
                    <p className="font-body text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
                      Mimo si bunglon siap nemenin Manda belajar materi sekolah
                      dengan cara yang paling bikin kamu nyaman, tanpa rasa
                      cemas dan tanpa label kaku.
                    </p>

                    <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                      <a
                        className="inline-flex items-center justify-center min-h-[48px] px-space-lg rounded-xl bg-primary-container text-on-primary font-label text-base font-bold shadow-md hover:bg-primary-hover active:bg-primary-pressed transition-all focus:outline-none focus:ring-2 focus:ring-focus"
                        href="#demo-manda"
                        onClick={(e) => {
                          e.preventDefault();
                          onContinue();
                        }}
                      >
                        Mulai Sekarang (Demo Manda)
                      </a>
                      <a
                        className="inline-flex items-center justify-center min-h-[48px] px-space-lg rounded-xl bg-surface text-primary font-label text-base font-bold shadow-sm hover:bg-surface-container-low transition-all focus:outline-none focus:ring-2 focus:ring-focus"
                        href="#mode-belajar"
                        onClick={(e) => {
                          e.preventDefault();
                          onContinue();
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] mr-2 text-secondary"
                          aria-hidden="true"
                        >
                          tune
                        </span>
                        Lihat 5 Mode Belajar
                      </a>
                    </div>

                    <div className="flex items-center gap-space-sm pt-space-sm text-text-secondary text-xs sm:text-sm font-label">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                          ⏱️
                        </div>
                        <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                          🎧
                        </div>
                        <div className="w-7 h-7 rounded-full bg-butter flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                          🌱
                        </div>
                      </div>
                      <span>
                        Belajar mikro 12 menit • Nol tekanan ujian dadakan
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center items-center relative">
                    <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary-container via-surface-container-high to-peach/30 scale-105 shadow-xl"></div>

                      <div className="relative w-full h-full rounded-full bg-surface-container-low p-5 flex items-center justify-center overflow-hidden shadow-inner">
                        <Image
                          src="/design/mimo-welcome.png"
                          alt="Mimo si bunglon dengan ikat kepala biru menyapa dengan ramah"
                          width={1024}
                          height={1024}
                          className="w-full h-full object-contain select-none drop-shadow-md rounded-full transition-transform duration-500 hover:scale-105"
                        ></Image>
                      </div>

                      <div className="absolute -bottom-3 sm:bottom-0 left-1/2 -translate-x-1/2 bg-surface text-primary px-space-md py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                        <span className="text-base">🦎</span>
                        <span className="font-headline font-bold text-sm text-primary tracking-tight">
                          Halo Manda!
                        </span>
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                      </div>

                      <div className="absolute top-4 -right-2 bg-surface/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md hidden sm:flex items-center gap-1.5 text-xs font-label text-primary animate-bounce">
                        <span>🌿</span>
                        <span>Santai, pelan-pelan ya!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-space-xl" id="mode-belajar">
              <div className="max-w-[1240px] mx-auto px-gutter">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-space-sm">
                  <div>
                    <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
                      Pendekatan Neuro-Inclusive
                    </span>
                    <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-primary mt-1">
                      Didesain Nyaman, Bukan Membebani
                    </h2>
                  </div>
                  <span className="font-metadata text-xs text-text-secondary">
                    Pilih preferensi kapan pun kamu mau
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                  <div
                    className="bg-surface rounded-xl p-space-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
                    tabIndex={0}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary shadow-sm">
                          <span
                            className="material-symbols-outlined text-[26px]"
                            aria-hidden="true"
                          >
                            pace
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-secondary-container text-primary font-label text-xs font-bold">
                          10-15 Menit
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-primary mb-2">
                        Atur Ritme Belajar
                      </h3>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        Belajar 10-15 menit per sesi, jadwal fleksibel tanpa
                        rasa bersalah.
                      </p>
                    </div>

                    <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                      <span className="font-metadata text-xs text-secondary font-semibold">
                        Fokus Singkat (Pomodoro Santai)
                      </span>
                      <span
                        className="material-symbols-outlined text-success text-[18px]"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                    </div>
                  </div>

                  <div
                    className="bg-surface rounded-xl p-space-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
                    tabIndex={0}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
                          <span
                            className="material-symbols-outlined text-[26px]"
                            aria-hidden="true"
                          >
                            auto_stories
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary font-label text-xs font-bold">
                          Multi-Sensori
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-primary mb-2">
                        Format Adaptif
                      </h3>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        Mode bacaan lapang, audio narasi, atau kartu visual
                        selangkah demi selangkah.
                      </p>
                    </div>

                    <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                      <span className="font-metadata text-xs text-tertiary font-semibold">
                        Teks • Audio • Ilustrasi
                      </span>
                      <span
                        className="material-symbols-outlined text-focus text-[18px]"
                        aria-hidden="true"
                      >
                        volume_up
                      </span>
                    </div>
                  </div>

                  <div
                    className="bg-surface rounded-xl p-space-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
                    tabIndex={0}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-md">
                        <div className="w-12 h-12 rounded-xl bg-butter flex items-center justify-center text-primary shadow-sm">
                          <span
                            className="material-symbols-outlined text-[26px]"
                            aria-hidden="true"
                          >
                            sentiment_satisfied
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-butter text-primary font-label text-xs font-bold">
                          Aman Emosional
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-primary mb-2">
                        Bebas Diagnosis Kaku
                      </h3>
                      <p className="font-body text-sm text-text-secondary leading-relaxed">
                        Kami tidak mendiagnosis kekuranganmu; semua berpusat
                        pada kenyamanan belajarmu.
                      </p>
                    </div>

                    <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                      <span className="font-metadata text-xs text-primary font-semibold">
                        Tanpa Ranking Kompetitif
                      </span>
                      <span
                        className="material-symbols-outlined text-warning text-[18px]"
                        aria-hidden="true"
                      >
                        shield
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="w-full py-space-lg mb-space-lg"
              id="aksesibilitas"
            >
              <div className="max-w-[1240px] mx-auto px-gutter">
                <div className="bg-surface rounded-xl p-space-md sm:p-space-lg shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm text-center lg:text-left">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-primary text-[22px]"
                        aria-hidden="true"
                      >
                        accessibility_new
                      </span>
                    </div>
                    <div>
                      <span className="font-headline font-bold text-base text-primary block leading-snug">
                        Standar Kenyamanan Akses
                      </span>
                      <span className="font-metadata text-xs text-text-secondary">
                        Dibuat cermat agar ramah energi kognitif setiap pelajar
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5">
                    <div className="min-h-[44px] px-4 rounded-full bg-surface-container flex items-center gap-2 text-xs sm:text-sm font-label font-semibold text-primary shadow-xs">
                      <span>🌱</span>
                      <span>Target WCAG 2.2 AA</span>
                    </div>
                    <div className="min-h-[44px] px-4 rounded-full bg-surface-container flex items-center gap-2 text-xs sm:text-sm font-label font-semibold text-primary shadow-xs">
                      <span>🖱️</span>
                      <span>Bebas Drag &amp; Drop</span>
                    </div>
                    <div className="min-h-[44px] px-4 rounded-full bg-surface-container flex items-center gap-2 text-xs sm:text-sm font-label font-semibold text-primary shadow-xs">
                      <span>🎧</span>
                      <span>Audio &amp; Teks Ramah Kognitif</span>
                    </div>
                    <div className="min-h-[44px] px-4 rounded-full bg-surface-container flex items-center gap-2 text-xs sm:text-sm font-label font-semibold text-primary shadow-xs">
                      <span>⌨️</span>
                      <span>Ramah Keyboard Penuh</span>
                    </div>
                  </div>
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
                    src="/design/logo-revamp.png"
                    alt="TemanBelajar Logo"
                    width={1024}
                    height={1024}
                    className="h-10 w-auto object-contain"
                  ></Image>
                </div>
                <p className="font-body text-body text-text-secondary max-w-md">
                  Platform belajar adaptif berbasis pendekatan editorial zine
                  yang tenang, bebas tekanan, dan ramah neurodiversitas untuk
                  pelajar SMP &amp; SMA se-Indonesia.
                </p>
                <div className="flex items-center gap-space-xs bg-surface-container rounded-xl p-space-sm w-fit">
                  <span
                    className="material-symbols-outlined text-success text-[20px]"
                    aria-hidden="true"
                  >
                    verified_user
                  </span>
                  <span className="font-metadata text-metadata text-text-secondary">
                    Komitmen Aksesibilitas WCAG 2.2 AA
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
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onContinue();
                  }}
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
      </div>
      {error && (
        <p role="alert" className="stitch-landing-error">
          {error}
        </p>
      )}
    </>
  );
}

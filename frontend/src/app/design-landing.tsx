"use client";
import { Brand } from "./brand";
import { useRef } from "react";
import { useScrollNavbar } from "./use-scroll-navbar";
import { LandingHow } from "./landing-how";
import { MimoMascot } from "./mimo-mascot";
export function Landing({
  onContinue,
  onLogin,
  onRegister,
  error,
}: {
  onContinue: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
  error: string;
}) {
  const header = useRef<HTMLElement>(null);
  useScrollNavbar(header);
  const register = onRegister || onLogin || onContinue;
  return (
    <>
      <div className="final-design final-screen-1 min-h-screen bg-canvas text-primary antialiased selection:bg-mint selection:text-primary relative overflow-x-hidden stitch-shell stitch-landing">
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-dot-pattern pointer-events-none z-0"
        ></div>

        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-primary text-surface px-5 py-2.5 rounded-control font-bold shadow-zine"
          href="#main-content"
        >
          Lompat ke konten utama
        </a>

        <header
          ref={header}
          className="w-full border-b border-divider bg-surface sticky top-0 z-40 transition-all"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 py-3 flex flex-wrap gap-3 items-center justify-between ui-container">
            <a
              aria-label="TemanBelajar Beranda"
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xl p-1 -ml-1 transition-transform hover:scale-[1.01]"
              href="#main-content"
            >
              <Brand />
            </a>

            <nav
              aria-label="Navigasi Utama"
              className="hidden xl:flex items-center gap-2 bg-canvas/80 p-1.5 rounded-full border border-divider shadow-inner"
            >
              <a
                className="text-text-secondary hover:text-primary hover:bg-surface px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                href="#cara-kerja"
              >
                Cara Kerja
              </a>
              <a
                className="text-text-secondary hover:text-primary hover:bg-surface px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                href="#mode-belajar"
              >
                5 Mode Belajar
              </a>
              <a
                className="text-text-secondary hover:text-primary hover:bg-surface px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                href="#contoh-nyata"
              >
                Contoh Nyata
              </a>
              <a
                className="text-text-secondary hover:text-primary hover:bg-surface px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                href="#aksesibilitas"
              >
                Aksesibilitas
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-bold text-primary border border-divider hover:bg-canvas hover:border-primary/30 transition-all"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  (onLogin || onContinue)();
                }}
              >
                Masuk
              </a>
              <a
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-surface text-sm font-bold px-5 py-2.5 rounded-xl shadow-zine-sm hover:shadow-zine transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  register();
                }}
              >
                <span>Daftar gratis</span>
                <span
                  className="material-symbols-outlined text-base"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </header>

        <main
          className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-8 ui-container"
          id="main-content"
        >
          <section
            aria-labelledby="hero-title"
            className="landing-hero-motion relative pt-4 pb-6 lg:pt-6 lg:pb-8 grid lg:grid-cols-12 gap-6 items-center"
          >
            <div className="landing-starfield" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className="absolute -top-3 left-4 w-28 h-6 washi-tape rotate-[-4deg] rounded-sm opacity-90 pointer-events-none hidden md:block"></div>

            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-tint border-2 border-primary/20 text-xs font-black tracking-wide uppercase text-primary mb-6 shadow-zine-sm">
                <span>🌱</span>
                <span>APLIKASI BELAJAR INKLUSIF · NO PRESSURE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5B638]"></span>
              </div>

              <h1
                className="font-nunito font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-primary leading-[1.12] tracking-tight mb-6 ui-hero-title"
                id="hero-title"
              >
                Setiap orang punya <br className="hidden sm:inline" />
                <span className="relative inline-block px-1">
                  <span className="relative z-10">cara belajarnya</span>

                  <span className="absolute bottom-1.5 left-0 w-full h-4 sm:h-5 bg-butter -rotate-1 rounded-sm z-0"></span>
                </span>{" "}
                sendiri.
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl font-medium">
                Mimo nemenin kamu pahami materi sekolah, selangkah demi
                selangkah.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-6">
                <a
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 bg-primary hover:bg-primary-hover text-surface text-base font-extrabold px-8 py-4 rounded-xl shadow-zine hover:shadow-zine-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onContinue();
                  }}
                >
                  <span>Coba demo gratis</span>
                  <span
                    className="material-symbols-outlined text-lg"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </a>
                <a
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-surface hover:bg-mint-tint border-2 border-primary text-primary text-base font-bold px-7 py-3.5 rounded-xl shadow-zine-sm hover:shadow-zine transition-all"
                  href="#cara-kerja"
                >
                  Lihat cara kerja
                </a>
              </div>

              <button
                type="button"
                className="sm:hidden workspace-subtle-link mb-4"
                onClick={onLogin || onContinue}
              >
                Masuk atau daftar dengan email
              </button>
              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs font-semibold text-text-secondary border-t border-divider pt-6 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-mint text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                    ✓
                  </span>
                  <span>Ramah pembaca layar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-lavender text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                    ✓
                  </span>
                  <span>5 mode belajar fleksibel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-butter text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                    ✓
                  </span>
                  <span>Rekomendasi tanpa bikin stres</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex flex-col items-center justify-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-[430px]">
                <div className="inline-flex items-center gap-2 bg-mint text-primary text-xs font-black px-4 py-1.5 rounded-t-xl border-t-2 border-x-2 border-primary uppercase tracking-wider ml-6 shadow-sm">
                  <span>TEMAN BELAJARMU</span> 🦎
                </div>

                <div className="relative bg-mint-tint border-2 border-primary rounded-feature rounded-tl-none p-6 sm:p-8 shadow-zine flex flex-col items-center justify-center overflow-visible">
                  <div className="absolute -top-3.5 right-6 w-20 h-5 washi-tape rotate-3 rounded-sm opacity-90 pointer-events-none"></div>

                  <div className="absolute -left-4 sm:-left-8 top-16 bg-surface border-2 border-primary rounded-full px-3.5 py-1.5 text-xs font-bold text-primary shadow-zine-sm flex items-center gap-2 rotate-[-4deg] animate-pulse">
                    <span>🎧</span> Audio bersuara jernih
                  </div>

                  <div className="absolute -right-3 sm:-right-7 top-32 bg-surface border-2 border-primary rounded-full px-3.5 py-1.5 text-xs font-bold text-primary shadow-zine-sm flex items-center gap-2 rotate-[3deg]">
                    <span>⚡</span> Timer bebas cemas
                  </div>

                  <div className="landing-mimo-stage w-full flex justify-center my-2">
                    <div className="landing-mimo-orbit" aria-hidden="true">
                      <span />
                      <span />
                    </div>
                    <MimoMascot context="Kenalan" />
                  </div>

                  <div className="absolute -bottom-4 right-8 bg-lavender-tint border-2 border-primary rounded-full px-4 py-1 text-xs font-bold text-primary shadow-zine-sm flex items-center gap-1.5 rotate-[-2deg]">
                    <span>📖</span> Penggaris fokus baca
                  </div>

                  <div className="w-full mt-4 bg-surface border-2 border-primary rounded-card p-4 shadow-zine-sm flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-2xl shrink-0 leading-none"
                    >
                      👋
                    </span>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-primary/70 block mb-0.5">
                        Suara Mimo
                      </span>
                      <p className="font-nunito font-extrabold text-sm sm:text-base text-primary leading-snug">
                        “Hai! Mau dengerin, baca pelan-pelan, atau lihat diagram
                        visual? Kamu yang tentukan!”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <LandingHow />

          <section
            aria-labelledby="mode-title"
            className="py-8 sm:py-10 border-t-2 border-dashed border-divider"
            id="mode-belajar"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-tint border border-butter text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  <span>🎨</span> Ragam Pilihan
                </div>
                <h2
                  className="font-nunito font-black text-3xl sm:text-4xl text-primary ui-section-title"
                  id="mode-title"
                >
                  5 Mode Belajar yang Bisa Kamu Pilih
                </h2>
              </div>
              <p className="text-text-secondary text-sm sm:text-base max-w-md font-medium">
                Tiap mode punya alat bantunya sendiri. Pilih yang paling pas
                buatmu.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-mint-tint rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface border-2 border-primary flex items-center justify-center text-xl shadow-zine-sm">
                      📖
                    </div>
                    <span className="bg-surface text-primary border border-primary/20 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Reading Companion
                    </span>
                  </div>
                  <h3 className="font-nunito font-extrabold text-xl text-primary mb-2 ui-card-title">
                    Teman Baca
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 font-medium">
                    Bantuan membaca ramah disleksia: penggaris fokus baca,
                    pengaturan jarak spasi baris, font OpenDyslexic opsional,
                    dan audio sinkron.
                  </p>
                </div>

                <div className="bg-surface rounded-xl p-3 border border-primary/20 text-xs font-bold text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-mint"></span>{" "}
                    Penggaris Fokus
                  </span>
                  <span className="text-primary font-black">
                    Aktif (Tingkat 2)
                  </span>
                </div>
              </div>

              <div className="bg-lavender-tint rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface border-2 border-primary flex items-center justify-center text-xl shadow-zine-sm">
                      🎯
                    </div>
                    <span className="bg-surface text-primary border border-primary/20 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Focus Navigator
                    </span>
                  </div>
                  <h3 className="font-nunito font-extrabold text-xl text-primary mb-2 ui-card-title">
                    Selangkah demi Selangkah
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 font-medium">
                    Memecah materi kompleks menjadi kartu tugas mikro tunggal.
                    Timer jeda istirahat ramah tanpa tekanan hitung mundur yang
                    memicu cemas.
                  </p>
                </div>

                <div className="bg-surface rounded-xl p-3 border border-primary/20 text-xs font-bold text-primary flex items-center justify-between">
                  <span>Langkah 1 dari 3</span>
                  <div className="flex gap-1">
                    <span className="w-5 h-2 bg-lavender rounded-full border border-primary"></span>
                    <span className="w-5 h-2 bg-canvas rounded-full border border-divider"></span>
                    <span className="w-5 h-2 bg-canvas rounded-full border border-divider"></span>
                  </div>
                </div>
              </div>

              <div className="bg-butter-tint rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface border-2 border-primary flex items-center justify-center text-xl shadow-zine-sm">
                      🎧
                    </div>
                    <span className="bg-surface text-primary border border-primary/20 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Audio &amp; Explorer
                    </span>
                  </div>
                  <h3 className="font-nunito font-extrabold text-xl text-primary mb-2 ui-card-title">
                    Dengarkan &amp; Jelajahi
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 font-medium">
                    Penyampaian podcast edukatif yang santai, dilengkapi
                    waveform visual, kecepatan 0.75x–1.5x, serta alt-text
                    deskriptif pada tiap gambar.
                  </p>
                </div>

                <div className="bg-surface rounded-xl p-3 border border-primary/20 text-xs font-bold text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    ▶ Suara Jernih 1.0x
                  </span>
                  <span className="font-mono text-xs text-text-secondary">
                    03:45 / 07:12
                  </span>
                </div>
              </div>

              <div className="bg-peach-tint rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface border-2 border-primary flex items-center justify-center text-xl shadow-zine-sm">
                      🖼️
                    </div>
                    <span className="bg-surface text-primary border border-primary/20 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Visual &amp; Caption
                    </span>
                  </div>
                  <h3 className="font-nunito font-extrabold text-xl text-primary mb-2 ui-card-title">
                    Teks &amp; Visual
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 font-medium">
                    Transkrip yang disinkronkan langsung dengan keterangan
                    visual, bagan alir terstruktur, kartu konsep, dan rangkuman
                    intisari diagram.
                  </p>
                </div>

                <div className="bg-surface rounded-xl p-3 border border-primary/20 text-xs font-bold text-primary flex items-center justify-between">
                  <span>Bagan Konsep Daun</span>
                  <span className="text-xs bg-peach px-2 py-0.5 rounded-md font-bold">
                    Diagram + Keterangan
                  </span>
                </div>
              </div>

              <div className="bg-surface rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-canvas border-2 border-primary flex items-center justify-center text-xl shadow-zine-sm">
                      📝
                    </div>
                    <span className="bg-canvas text-primary border border-primary/20 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      Standard Learning
                    </span>
                  </div>
                  <h3 className="font-nunito font-extrabold text-xl text-primary mb-2 ui-card-title">
                    Belajar Biasa
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 font-medium">
                    Tampilan artikel bacaan klasik yang rapi dengan navigasi bab
                    terstruktur, catatan tepi, dan alat bantu aksesibilitas yang
                    selalu siap dipanggil.
                  </p>
                </div>

                <div className="bg-canvas rounded-xl p-3 border border-divider text-xs font-bold text-text-secondary flex items-center justify-between">
                  <span>Aksesibilitas Universal</span>
                  <span className="text-primary font-bold">
                    Siap dipakai
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-mint via-butter-tint to-lavender-tint rounded-feature p-6 border-2 border-primary shadow-zine flex flex-col justify-center items-start relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-surface/30 rounded-full blur-xl pointer-events-none"></div>
                <span aria-hidden="true" className="text-2xl mb-2">
                  🔄
                </span>
                <h3 className="font-nunito font-black text-xl text-primary mb-2 ui-card-title">
                  Bebas Ganti Kapan Saja
                </h3>
                <p className="text-xs sm:text-sm text-primary/90 font-medium leading-relaxed mb-4">
                  Mata lelah membaca? Pindah ke mode audio hanya dengan satu
                  klik tanpa mengulang dari awal sesi.
                </p>
                <a
                  className="inline-flex items-center gap-1.5 text-xs font-black text-primary underline underline-offset-4 hover:text-primary-hover"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onContinue();
                  }}
                >
                  Coba demo gratis →
                </a>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="showcase-title"
            className="py-8 sm:py-10 border-t-2 border-dashed border-divider"
            id="contoh-nyata"
          >
            <div className="bg-surface rounded-feature border-2 border-primary p-5 sm:p-6 shadow-zine grid lg:grid-cols-12 gap-6 items-center relative">
              <div className="absolute -top-3.5 right-10 w-24 h-6 washi-tape rotate-[-2deg] rounded-sm pointer-events-none hidden sm:block"></div>

              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-tint border border-mint text-xs font-extrabold text-primary mb-4">
                  <span>🔬</span> CONTOH MATERI NYATA: BIOLOGI SMP/SMA
                </div>
                <h2
                  className="font-nunito font-black text-3xl sm:text-4xl text-primary mb-4 leading-tight ui-section-title"
                  id="showcase-title"
                >
                  Dari pemahaman konsep sampai latihan ramah cemas
                </h2>
                <p className="text-text-secondary text-base leading-relaxed mb-6 font-medium">
                  Pada topik{" "}
                  <strong className="text-primary font-bold">
                    Fotosintesis &amp; Peran Cahaya
                  </strong>
                  , kamu bisa memilih menyimak penjelasan diagram kloroplas yang
                  diuraikan perlahan atau mendengarkan penjelasan audio ringkas.
                </p>
                <ul className="space-y-3.5 mb-8 text-sm font-semibold text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-mint text-primary font-black flex items-center justify-center text-xs shrink-0 border border-primary/20">
                      ✓
                    </span>
                    <span>
                      <strong className="text-primary">
                        Progres Asli:
                      </strong>{" "}
                      Dihitung dari latihan yang benar-benar kamu kerjakan,
                      bukan tebakan.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-lavender text-primary font-black flex items-center justify-center text-xs shrink-0 border border-primary/20">
                      ✓
                    </span>
                    <span>
                      <strong className="text-primary">
                        Dijelasin Ulang:
                      </strong>{" "}
                      Jawaban belum tepat? Mimo bantu jelasin lagi dengan cara
                      yang lain.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-butter text-primary font-black flex items-center justify-center text-xs shrink-0 border border-primary/20">
                      ✓
                    </span>
                    <span>
                      <strong className="text-primary">
                        Latihan Santai:
                      </strong>{" "}
                      Soal singkat setelah membaca, tanpa nilai yang bikin
                      tegang.
                    </span>
                  </li>
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-surface text-sm font-extrabold px-6 py-3.5 rounded-xl shadow-zine-sm hover:shadow-zine transition-all"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onContinue();
                    }}
                  >
                    <span>Coba demo gratis</span>
                    <span
                      className="material-symbols-outlined text-base"
                      aria-hidden="true"
                    >
                      science
                    </span>
                  </a>
                  <span className="text-xs text-text-secondary font-medium">
                    Gratis · Tanpa perlu daftar
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="bg-mint rounded-card p-6 border-2 border-primary shadow-zine-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-black uppercase tracking-wider text-primary">
                        Rekomendasi Mimo Hari Ini
                      </span>
                    </div>
                    <span className="bg-surface text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      ⏱️ 15 Menit
                    </span>
                  </div>
                  <h3 className="font-nunito font-black text-xl text-primary mb-2 ui-card-title">
                    Ulangi peran cahaya lewat audio santai
                  </h3>
                  <p className="text-xs sm:text-sm text-primary/90 font-medium mb-4 leading-relaxed bg-surface/60 p-3 rounded-xl border border-primary/10">
                    “Di latihan terakhir, konsep{" "}
                    <span className="font-bold underline decoration-wavy decoration-primary/40">
                      peran fotolisis air dan cahaya
                    </span>{" "}
                    masih perlu diperkuat. Yuk, kita dengarkan penjelasannya
                    dengan cara yang berbeda!”
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-surface text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm">
                        Mulai 15 menit
                      </span>
                      <span className="text-xs font-bold text-primary underline underline-offset-4 px-2 py-1">
                        Lihat alasannya
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-primary/70">
                      Biologi · Bab 3
                    </span>
                  </div>
                </div>

                <div className="bg-canvas rounded-card p-5 border-2 border-primary shadow-zine-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Jadwal Fleksibelmu
                    </span>
                    <span className="text-xs text-text-secondary font-medium">
                      Bisa digeser kapan pun
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="bg-surface rounded-xl p-3 border border-divider flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-mint-tint border border-mint text-primary font-black text-xs flex items-center justify-center">
                          09.00
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">
                            Sesi Baca: Fotosintesis &amp; Klorofil
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            Mode Teman Baca · 15 menit
                          </p>
                        </div>
                      </div>
                      <span className="bg-mint text-primary text-[11px] font-black px-2.5 py-0.5 rounded-md border border-primary/20">
                        Siap Mulai
                      </span>
                    </div>
                    <div className="bg-surface/70 rounded-xl p-3 border border-divider/60 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-lavender-tint border border-lavender text-primary font-black text-xs flex items-center justify-center">
                          16.30
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">
                            Latihan Singkat: 2 Pertanyaan Reflektif
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            Bebas cemas · 5 menit
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-primary">
                        Geser ke Besok
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="film-title"
            className="my-4 grid items-center gap-5 rounded-feature border border-divider bg-mint-tint p-5 sm:p-6 lg:grid-cols-[1fr_2fr]"
          >
            <div>
              <h2
                id="film-title"
                className="ui-section-title font-nunito text-3xl font-black text-primary"
              >
                Belajar bareng Manda
              </h2>
              <p className="mt-3">
                Dalam 58 detik, lihat cara Manda membaca, berlatih, dan
                mengambil jeda.
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer font-bold">
                  Baca transkrip video
                </summary>
                <p className="mt-2">
                  Untuk pelajar penyandang disabilitas, cara materi disajikan
                  bisa menentukan seberapa mudah mereka ikut belajar. Ada yang
                  lebih nyaman mendengarkan, ada yang butuh teks lebih besar,
                  atau satu bagian bacaan dalam satu waktu.
                </p>
                <p className="mt-2">
                  TemanBelajar membantu kamu mengatur cara belajar sesuai
                  kebutuhanmu. Kamu bisa besarkan huruf, atur kontras, atau
                  nyalakan penggaris baca. Kalau lebih nyaman mendengarkan,
                  putar audio sambil mengikuti transkrip.
                </p>
                <p className="mt-2">
                  Lalu, cek apa yang sudah kamu pahami. Manda, misalnya, sudah
                  bisa mencari hipotenusa, tapi masih keliru saat mencari sisi
                  siku-siku. TemanBelajar menunjukkan di mana letak salahnya dan
                  menyarankan latihan yang sesuai.
                </p>
                <p className="mt-2">
                  Kalau butuh jeda, geser jadwalnya. Progresmu tetap tersimpan,
                  dan Mimo siap menemani saat kamu kembali. TemanBelajar. Ruang
                  belajar yang bisa kamu sesuaikan.
                </p>
              </details>
            </div>
            <video
              className="aspect-video w-full rounded-2xl bg-black"
              controls
              playsInline
              preload="metadata"
              aria-labelledby="film-title"
            >
              <source src="/media/temanbelajar.mp4" type="video/mp4" />
              <track
                default
                kind="captions"
                src="/media/temanbelajar-id.vtt"
                srcLang="id"
                label="Bahasa Indonesia"
              />
              <a href="/media/temanbelajar.mp4">Buka video TemanBelajar</a>
            </video>
          </section>

          <section
            aria-labelledby="inclusive-title"
            className="py-8 sm:py-10 border-t-2 border-dashed border-divider"
            id="aksesibilitas"
          >
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-tint border border-lavender text-xs font-bold uppercase tracking-wider text-primary mb-3">
                <span>💜</span> Belajar Nyaman Untuk Semua
              </div>
              <h2
                className="font-nunito font-black text-3xl sm:text-4xl text-primary ui-section-title"
                id="inclusive-title"
              >
                Dirancang untuk belajar yang lebih nyaman
              </h2>
              <p className="text-text-secondary mt-3 text-base">
                TemanBelajar dirancang khusus agar setiap pelajar merasa
                dihargai tanpa harus melabeli diri sendiri.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-surface rounded-card p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <p className="text-sm text-text-secondary leading-relaxed font-medium mb-4">
                  “Dulu suka pusing kalau lihat teks bacaan panjang di buku
                  paket. Di TemanBelajar aku pakai penggaris fokus dan audio
                  Mimo. Nilai Biologi dan IPA-ku naik pesat!”
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-divider">
                  <div className="w-9 h-9 rounded-full bg-mint text-primary font-black text-xs flex items-center justify-center border border-primary">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">Rania A.</p>
                    <p className="text-[11px] text-text-secondary">
                      Siswa Kelas 8 SMP · Jakarta
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-card p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <p className="text-sm text-text-secondary leading-relaxed font-medium mb-4">
                  “Fitur &#x27;Geser ke Besok&#x27; ngebantu banget pas lagi
                  banyak tugas sekolah. Nggak ada hukuman pengurangan poin yang
                  bikin bersalah. Belajar jadi santai tapi konsisten.”
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-divider">
                  <div className="w-9 h-9 rounded-full bg-butter text-primary font-black text-xs flex items-center justify-center border border-primary">
                    F
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">Fajar K.</p>
                    <p className="text-[11px] text-text-secondary">
                      Siswa Kelas 11 SMA · Bandung
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-card p-6 border-2 border-primary shadow-zine flex flex-col justify-between">
                <p className="text-sm text-text-secondary leading-relaxed font-medium mb-4">
                  “Sebagai guru BK, saya sangat mengapresiasi pendekatan tanpa
                  diagnosis medis. Siswa yang punya gaya belajar berbeda bisa
                  langsung nyaman memilih modenya.”
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-divider">
                  <div className="w-9 h-9 rounded-full bg-lavender text-primary font-black text-xs flex items-center justify-center border border-primary">
                    I
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">
                      Ibu Nurul W., M.Pd.
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Konselor Pendidikan · Yogyakarta
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-canvas rounded-feature p-5 sm:p-6 border-2 border-primary shadow-zine-sm grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-start">
                <span className="text-2xl mb-2">👁️</span>
                <h4 className="font-nunito font-extrabold text-base text-primary mb-1 ui-label-title">
                  Target WCAG 2.2 AA
                </h4>
                <p className="text-xs text-text-secondary">
                  Kontras tinggi teruji, navigasi keyboard penuh, dan fokus
                  visual yang jelas.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl mb-2">🔒</span>
                <h4 className="font-nunito font-extrabold text-base text-primary mb-1 ui-label-title">
                  Privasi Terjaga
                </h4>
                <p className="text-xs text-text-secondary">
                  Data belajar hanya disimpan untuk kenyamananmu, tanpa profil
                  iklan komersial.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl mb-2">🎛️</span>
                <h4 className="font-nunito font-extrabold text-base text-primary mb-1 ui-label-title">
                  Kontrol Multi-Sensorik
                </h4>
                <p className="text-xs text-text-secondary">
                  Pengaturan kecepatan audio 0.75x–1.5x, spasi baris leluasa,
                  dan opsi kontras.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl mb-2">🌱</span>
                <h4 className="font-nunito font-extrabold text-base text-primary mb-1 ui-label-title">
                  Tanpa Diagnosis Medis
                </h4>
                <p className="text-xs text-text-secondary">
                  Cukup pilih preferensi kenyamanan tanpa perlu mengisi tes atau
                  sertifikat medis.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 bg-gradient-to-r from-mint-tint via-butter-tint to-peach-tint rounded-feature p-6 sm:p-8 border-2 border-primary shadow-zine text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border-2 border-primary text-xs font-black uppercase text-primary mb-6 shadow-zine-sm">
              <span>🎒</span> AYO MULAI!
            </div>
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="font-nunito font-black text-3xl sm:text-5xl text-primary mb-4 leading-tight ui-section-title">
                Siap mulai bareng Mimo?
              </h2>
              <p className="text-text-secondary text-base sm:text-lg mb-8 font-medium">
                Daftar untuk simpan progresmu, atau coba demo dulu tanpa
                daftar.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-surface text-base font-extrabold px-8 py-4 rounded-xl shadow-zine hover:shadow-zine-hover transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    register();
                  }}
                >
                  <span>Daftar gratis</span>
                  <span
                    className="material-symbols-outlined text-lg"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </a>
                <a
                  className="inline-flex items-center gap-2 bg-surface hover:bg-canvas border-2 border-primary text-primary text-base font-bold px-7 py-4 rounded-xl shadow-zine-sm transition-all"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onContinue();
                  }}
                >
                  Coba demo gratis
                </a>
              </div>
              <p className="text-xs text-text-secondary mt-5 font-semibold">
                ✨ Gratis untuk siswa SMP &amp; SMA
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t-2 border-primary bg-surface py-8 mt-4 relative z-10">
          <div className="max-w-7xl mx-auto px-6 ui-container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-divider">
              <div className="flex flex-col gap-2">
                <Brand />
                <span className="text-xs font-semibold text-text-secondary">
                  Belajar pelan-pelan juga boleh.
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-text-secondary">
                <a
                  className="hover:text-primary transition-colors"
                  href="#cara-kerja"
                >
                  Cara Kerja
                </a>
                <a
                  className="hover:text-primary transition-colors"
                  href="#mode-belajar"
                >
                  5 Mode Belajar
                </a>
                <a
                  className="hover:text-primary transition-colors"
                  href="#contoh-nyata"
                >
                  Contoh Nyata
                </a>
                <a
                  className="hover:text-primary transition-colors"
                  href="#aksesibilitas"
                >
                  Aksesibilitas
                </a>
                <a
                  className="hover:text-primary transition-colors"
                  href="#aksesibilitas"
                >
                  Privasi Siswa
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 text-xs font-semibold text-text-secondary">
              <p>
                © {new Date().getFullYear()} TemanBelajar. Didesain untuk siswa
                SMP &amp; SMA di seluruh Indonesia.
              </p>
              <p className="flex items-center gap-1.5">
                <span>Dibuat dengan ramah &amp; inklusif bersama Mimo 🦎</span>
              </p>
            </div>
          </div>
        </footer>
        {error && (
          <p className="mx-auto max-w-xl p-4 text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}

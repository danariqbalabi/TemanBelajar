"use client";
import { useState } from "react";
import Image from "next/image";
import { auth } from "@/lib/api";
import type { Run } from "./page";
export function AccountDesign({
  onBack,
  run,
  busy,
  error,
}: {
  onBack: () => void;
  run: Run;
  busy: boolean;
  error: string;
}) {
  const [email, setEmail] = useState(""),
    [message, setMessage] = useState("");
  function demo() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.signInAnonymously();
      if (error) throw error;
    });
  }
  function sendLink() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { error } = await auth.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setMessage("Tautan masuk sudah dikirim. Periksa emailmu.");
    });
  }
  return (
    <div className="stitch-shell stitch-landing stitch-account">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-space-sm focus:left-space-sm focus:z-50 focus:px-space-md focus:py-space-sm focus:bg-surface focus:text-primary focus:outline-none focus:ring-2 focus:ring-focus rounded-xl shadow-[0_4px_16px_rgba(39,59,53,0.08)] font-label text-label"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-[1280px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <a
              href="#"
              data-path="beranda"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            >
              <Image
                src="/design/logo-revamp.png"
                alt="TemanBelajar Logo"
                className="h-10 w-auto object-contain"
                width={1024}
                height={1024}
              ></Image>
            </a>
          </div>
          <nav
            className="hidden lg:flex items-center gap-space-lg"
            data-active-classes="bg-secondary-container text-primary font-bold rounded-full px-space-md py-space-xs"
          >
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="cara-kerja"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            >
              Cara Kerja
            </a>
            <a
              className="font-label text-label text-on-surface-variant hover:text-on-surface transition-colors py-space-xs"
              data-path="fitur-belajar"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
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
                onBack();
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
                onBack();
              }}
            >
              Untuk Sekolah
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#"
              data-path="bantuan"
              className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            >
              Butuh Bantuan?
            </a>
          </div>
        </div>
      </header>
      <main className="w-full pt-20 bg-background" id="main-content">
        <div className="flex flex-col w-full relative overflow-hidden py-6 sm:py-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-butter/30 blur-3xl pointer-events-none"></div>
          <div className="max-w-[720px] w-full mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-8 sm:mb-10">
              <a
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 hover:bg-surface text-text-secondary hover:text-primary transition-all duration-200 text-sm font-semibold shadow-sm group"
                data-path="beranda"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                Kembali ke Halaman Utama
              </a>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-gray bg-surface-container/60 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                Ruang Tenang Aktif
              </div>
            </div>

            <div className="w-full bg-surface rounded-3xl shadow-[0_12px_40px_rgba(27,48,41,0.06)] p-6 sm:p-10 relative mt-8 flex flex-col items-center">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                <div className="relative flex flex-col items-center">
                  <div className="mb-1.5 px-3.5 py-1.5 bg-white text-primary text-xs font-bold rounded-full shadow-[0_4px_16px_rgba(39,59,53,0.08)] border border-secondary-container/60 flex items-center gap-1.5 animate-bounce">
                    <span
                      className="material-symbols-outlined text-[16px] text-primary"
                      aria-hidden="true"
                    >
                      waving_hand
                    </span>
                    <span>Hai! Aku Mimo. Yuk kenalan dulu!</span>
                  </div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-secondary-fixed/40 p-1.5 shadow-md border-2 border-white backdrop-blur-sm">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        src="/design/mimo-welcome.png"
                        alt="Mimo Maskot TemanBelajar"
                        className="w-24 h-24 object-contain mx-auto drop-shadow-sm"
                        width={1024}
                        height={1024}
                      ></Image>
                    </div>
                    <div className="absolute bottom-0 right-1 w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary text-xs shadow-sm border border-white">
                      ✨
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 pb-4 text-center max-w-md flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-wide uppercase mb-3">
                  Ruang Masuk Pelajar
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-display mb-2">
                  Hai Manda! Senang ketemu kamu 🦎
                </h1>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  Pilih cara masukmu untuk mulai menyusun ruang belajar yang
                  nyaman dan bebas distraksi.
                </p>
              </div>

              <div className="w-full grid grid-cols-1 gap-5 mt-6 mb-8">
                <div className="relative rounded-2xl bg-secondary-container/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:bg-secondary-container/60 group">
                  <div className="absolute -top-3 right-6 bg-primary text-on-primary text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    Paling Cepat
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 p-1">
                        <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                          M
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-primary text-base sm:text-lg">
                            Masuk Akun Demo Manda
                          </h3>
                          <span className="text-xs bg-white text-secondary font-semibold px-2 py-0.5 rounded-full">
                            SMP Kelas 8
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary leading-normal">
                          Profil siap pakai, catatan tersusun, dan target
                          belajar mingguan sudah disiapkan.
                        </p>
                      </div>
                    </div>

                    <button
                      className="h-12 w-full sm:w-auto px-6 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shrink-0"
                      type="button"
                      disabled={busy}
                      onClick={demo}
                    >
                      <span>Mulai Bersama Manda</span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <div className="mt-4 pt-3 flex items-center gap-3 text-xs text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px] text-success"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      Sekali klik langsung belajar
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[16px] text-success"
                        aria-hidden="true"
                      >
                        timer
                      </span>
                      Tanpa ketik kata sandi
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-surface-container-low p-5 sm:p-6 transition-all duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-text-secondary shadow-sm shrink-0">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        alternate_email
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface text-base">
                        Masuk dengan Email
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary">
                        Tanpa kata sandi rumit. Kami mengirimkan tautan masuk
                        instan ke kontakmu.
                      </p>
                    </div>
                  </div>
                  <form
                    className="flex flex-col sm:flex-row gap-2.5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendLink();
                    }}
                  >
                    <div className="relative flex-grow">
                      <span
                        className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-gray text-[18px]"
                        aria-hidden="true"
                      >
                        mail
                      </span>
                      <input
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface text-on-surface text-sm placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-focus shadow-xs"
                        placeholder="nama@sekolah.id atau email pribadimu"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                        aria-label="Alamat email"
                      />
                    </div>
                    <button
                      className="h-11 px-5 rounded-xl bg-surface-container-highest hover:bg-surface-variant active:bg-surface-container text-primary font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0"
                      type="submit"
                      disabled={busy}
                    >
                      <span>Kirim Tautan</span>
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        send
                      </span>
                    </button>
                  </form>
                </div>
              </div>

              <div className="w-full flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pb-6 text-xs text-muted-gray">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    aria-hidden="true"
                  >
                    spa
                  </span>{" "}
                  Mode Tenang Sensorik
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    aria-hidden="true"
                  >
                    visibility
                  </span>{" "}
                  Teks Ramah Disleksia
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    aria-hidden="true"
                  >
                    do_not_disturb_on
                  </span>{" "}
                  Bebas Notifikasi Mengejutkan
                </span>
              </div>

              <div className="w-full bg-surface-container rounded-2xl p-3.5 sm:p-4 flex items-center justify-center gap-3 text-center sm:text-left">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-xs">
                  <span
                    className="material-symbols-outlined text-[18px] text-success"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-snug">
                  <strong className="font-bold text-primary">
                    Privasi terjaga:
                  </strong>{" "}
                  Data belajarmu tersimpan aman di perangkat dan tidak pernah
                  dibagikan kepada pihak lain.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-muted-gray space-y-1">
              <p>
                Mengalami kendala saat masuk? Hubungi wali kelas atau guru
                pendampingmu.
              </p>
              <p className="font-medium">
                TemanBelajar hadir mendampingi ritme belajarmu tanpa buru-buru.
              </p>
            </div>
          </div>
        </div>
        {message && (
          <p role="status" className="max-w-xl mx-auto p-4 text-primary">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="max-w-xl mx-auto p-4 text-error">
            {error}
          </p>
        )}
      </main>
      <footer className="w-full bg-surface-container-low mt-space-section">
        <div className="max-w-[1280px] mx-auto px-gutter py-space-xxl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-space-xl">
            <div className="md:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <Image
                  src="/design/logo-revamp.png"
                  alt="TemanBelajar Logo"
                  className="h-9 w-auto object-contain"
                  width={1024}
                  height={1024}
                ></Image>
              </div>
              <p className="font-body text-body text-text-secondary max-w-md">
                Platform belajar adaptif berbasis pendekatan editorial zine yang
                tenang, bebas tekanan, dan ramah neurodiversitas untuk pelajar
                SMP &amp; SMA se-Indonesia.
              </p>
              <div className="flex items-center gap-space-xs bg-surface-container rounded-xl p-space-sm w-fit">
                <span
                  className="material-symbols-outlined text-success text-[20px]"
                  aria-hidden="true"
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
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
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
                  onBack();
                }}
              >
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

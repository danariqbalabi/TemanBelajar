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
    [password, setPassword] = useState(""),
    [name, setName] = useState("Manda"),
    [signup, setSignup] = useState(false),
    [message, setMessage] = useState(""),
    [showPasswordForm, setShowPasswordForm] = useState(false),
    [showPassword, setShowPassword] = useState(false),
    [calm, setCalm] = useState(true);
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
      if (!email.includes("@"))
        throw Error("Isi alamat email terlebih dahulu.");
      const { error } = await auth.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      setMessage("Tautan masuk sudah dikirim. Periksa emailmu.");
    });
  }
  function login() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      if (!email.includes("@"))
        throw Error("Isi alamat email terlebih dahulu.");
      const { error } = await auth.auth.signInWithPassword({ email, password });
      if (error) throw error;
    });
  }
  function registerAccount() {
    run(async () => {
      if (!auth) throw Error("Layanan akun belum tersedia.");
      const { data, error } = await auth.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: name.trim() },
        },
      });
      if (error) throw error;
      if (!data.session)
        setMessage(
          "Periksa email untuk mengonfirmasi akun, lalu masuk kembali.",
        );
    });
  }
  return (
    <div
      className={
        "stitch-shell stitch-landing stitch-account " + (calm ? "calm" : "")
      }
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-space-sm focus:left-space-sm focus:z-50 focus:px-space-md focus:py-space-sm focus:bg-surface focus:text-primary focus:outline-none focus:ring-2 focus:ring-focus rounded-xl shadow-[0_4px_16px_rgba(39,59,53,0.08)] font-label text-label"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
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
              TemanBelajar
            </span>
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
          <div className="flex items-center gap-space-sm">
            <a
              className="hidden sm:inline-flex items-center justify-center h-11 px-space-lg rounded-xl bg-surface text-primary-container font-label text-label hover:bg-surface-container-low transition-colors outline-none focus:outline-none focus:ring-2 focus:ring-focus"
              data-path="masuk"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
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
                onBack();
              }}
            >
              Mulai Belajar
            </a>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs shrink-0">
              <span
                className="material-symbols-outlined text-on-primary text-[18px]"
                aria-hidden="true"
              >
                person
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full pt-20 bg-background" id="main-content">
        <div className="flex flex-col w-full">
          <div className="max-w-[1280px] w-full mx-auto px-gutter py-space-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-xl">
              <div className="flex items-center gap-space-sm text-text-secondary font-metadata text-metadata">
                <span className="inline-flex items-center gap-1 font-label text-label text-primary">
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    eco
                  </span>
                  Ruang Masuk Siswa
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-text-secondary">
                  SMP &amp; SMA Se-Indonesia
                </span>
              </div>
              <div className="flex items-center gap-space-sm self-start sm:self-auto">
                <button
                  className="inline-flex items-center gap-space-xs px-space-md h-9 rounded-full bg-surface text-primary font-label text-metadata shadow-sm hover:bg-surface-container-low transition-colors"
                  id="calm-mode-btn"
                  title="Mode Tenang: Minim kontras tajam & animasi"
                  type="button"
                  disabled={busy}
                  onClick={() => setCalm(!calm)}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    spa
                  </span>
                  <span>
                    {calm ? "Mode Tenang: Aktif" : "Mode Tenang: Nonaktif"}
                  </span>
                </button>
                <div className="inline-flex items-center gap-1 px-space-sm h-9 rounded-full bg-surface text-text-secondary font-metadata text-metadata shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px] text-success"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  <span>Bebas Tekanan</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                <div className="bg-surface rounded-2xl p-space-lg sm:p-space-xl shadow-sm relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary-container/40 pointer-events-none blur-2xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-butter/30 pointer-events-none blur-xl"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-space-lg">
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-surface-container-low flex items-center justify-center p-space-sm shadow-sm">
                        <Image
                          alt="Mimo, teman belajarmu"
                          className="w-full h-full object-contain"
                          src="/design/mimo.png"
                          width={1024}
                          height={1024}
                        />
                      </div>
                      <span className="mt-space-xs inline-flex items-center gap-1 font-metadata text-metadata text-secondary bg-secondary-container px-space-sm py-0.5 rounded-full font-bold">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                        Mimo siap nemenin
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col items-start text-left">
                      <div className="bg-secondary-container/70 text-primary-container p-space-md sm:p-space-lg rounded-2xl rounded-tl-none relative shadow-sm w-full">
                        <div className="hidden sm:block absolute -left-2.5 top-5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-secondary-container/70 border-b-[8px] border-b-transparent"></div>
                        <h1 className="font-display text-page-title text-primary tracking-tight mb-space-xs">
                          Hai! Aku Mimo. Yuk, kenalan dulu! 👋
                        </h1>
                        <p className="font-mimo-voice text-mimo-voice text-primary-container leading-relaxed">
                          “Di TemanBelajar, kamu nggak perlu tes rumit atau kuis
                          membingungkan. Cukup pilih caramu belajar dan kita
                          susun jadwal yang pas buat energimu.”
                        </p>
                      </div>

                      <p className="mt-space-md font-body text-body text-text-secondary">
                        Belajar mandiri itu bukan perlombaan cepat-cepatan. Di
                        sini, kamu yang memegang kendali penuh atas ritme,
                        istirahat, dan format materi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-space-xl pt-space-lg grid grid-cols-1 sm:grid-cols-3 gap-space-md bg-surface-container-low p-space-md rounded-xl">
                    <div className="flex items-start gap-space-xs">
                      <div className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          timer_off
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label text-label text-primary font-bold">
                          Bebas Tekanan Waktu
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Tidak ada hitung mundur kuis yang memicu panik.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <div className="w-8 h-8 rounded-full bg-butter flex items-center justify-center shrink-0 mt-0.5 text-primary">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          event_repeat
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label text-label text-primary font-bold">
                          Jadwal Fleksibel
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          Atur ulang sesi kapan pun energimu menurun.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 mt-0.5 text-primary">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          accessibility_new
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label text-label text-primary font-bold">
                          Aksesibilitas Penuh
                        </span>
                        <span className="font-metadata text-metadata text-text-secondary">
                          {
                            "Ukuran teks, baca nyaring, dan mode fokus pilihanmu."
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col sm:flex-row items-center gap-space-md justify-between">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <span
                        className="material-symbols-outlined text-[24px]"
                        aria-hidden="true"
                      >
                        school
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-card-title text-card-title text-primary">
                        Untuk Siswa SMP &amp; SMA Se-Indonesia
                      </span>
                      <span className="font-metadata text-metadata text-text-secondary">
                        {
                          "Materi contoh untuk dicoba, atau unggah catatan dari sekolahmu."
                        }
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container font-label text-metadata text-primary shrink-0">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      lock
                    </span>
                    100% Gratis Siswa
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-surface rounded-2xl p-space-lg sm:p-space-xl shadow-md flex flex-col gap-space-lg relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <Image
                        alt="TemanBelajar"
                        className="h-7 w-auto object-contain"
                        src="/design/logo.png"
                        width={640}
                        height={240}
                      />
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-secondary-container text-primary font-label text-metadata font-bold">
                      Langkah Cepat
                    </span>
                  </div>

                  <div
                    aria-label="Pilihan Akses Masuk"
                    className="bg-surface-container p-1 rounded-xl flex items-center gap-1"
                    role="tablist"
                  >
                    <button
                      aria-controls="panel-login"
                      aria-selected={!signup}
                      className={
                        "flex-1 h-10 rounded-lg font-label text-label " +
                        (!signup
                          ? "bg-surface text-primary shadow-sm"
                          : "bg-transparent text-text-secondary")
                      }
                      id="tab-btn-login"
                      role="tab"
                      type="button"
                      onClick={() => setSignup(false)}
                      disabled={busy}
                    >
                      Masuk Cepat
                    </button>
                    <button
                      aria-controls="panel-register"
                      aria-selected={signup}
                      className={
                        "flex-1 h-10 rounded-lg font-label text-label " +
                        (signup
                          ? "bg-surface text-primary shadow-sm"
                          : "bg-transparent text-text-secondary")
                      }
                      id="tab-btn-register"
                      role="tab"
                      type="button"
                      onClick={() => setSignup(true)}
                      disabled={busy}
                    >
                      Buat Akun Siswa
                    </button>
                  </div>

                  <div
                    className={signup ? "hidden" : "flex flex-col gap-space-md"}
                    id="panel-login"
                  >
                    <form
                      className="flex flex-col gap-space-md"
                      id="magic-link-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendLink();
                      }}
                    >
                      <div className="flex flex-col gap-space-xs text-left">
                        <label
                          className="font-label text-label text-primary font-bold flex items-center justify-between"
                          htmlFor="student-identifier"
                        >
                          <span>{"Alamat email"}</span>
                          <span className="text-text-secondary font-metadata text-metadata font-normal">
                            Contoh: nadia@smp8.id
                          </span>
                        </label>
                        <div className="relative flex items-center">
                          <span
                            className="material-symbols-outlined absolute left-space-md text-muted-gray text-[20px] pointer-events-none"
                            aria-hidden="true"
                          >
                            mail
                          </span>
                          <input
                            className="w-full h-11 pl-11 pr-space-md rounded-xl bg-surface text-primary font-body text-body placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                            id="student-identifier"
                            aria-label="Alamat email"
                            name="identifier"
                            placeholder="nama@sekolah.id"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                          />
                        </div>
                        <p className="font-metadata text-metadata text-text-secondary">
                          Kami kirimkan tautan masuk langsung tanpa perlu
                          mengingat kata sandi.
                        </p>
                      </div>

                      <button
                        className="w-full h-11 rounded-xl bg-primary-container text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm flex items-center justify-center gap-space-xs focus:outline-none focus:ring-2 focus:ring-focus"
                        type="submit"
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          send
                        </span>
                        <span>Kirim Tautan Masuk ke Email</span>
                      </button>
                    </form>

                    <div className="pt-space-xs">
                      <button
                        className="text-left font-label text-label text-secondary hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-focus rounded-lg px-1 py-0.5"
                        id="toggle-password-view-btn"
                        type="button"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        aria-expanded={showPasswordForm}
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          id="toggle-icon"
                          aria-hidden="true"
                        >
                          expand_more
                        </span>
                        <span>Atau masuk dengan kata sandi sekolah</span>
                      </button>
                      <form
                        className={
                          showPasswordForm
                            ? "flex flex-col gap-space-sm mt-space-sm bg-surface-container-low p-space-md rounded-xl"
                            : "hidden"
                        }
                        id="password-subfield"
                        onSubmit={(e) => {
                          e.preventDefault();
                          login();
                        }}
                      >
                        <label
                          className="font-label text-label text-primary font-bold"
                          htmlFor="student-password"
                        >
                          Kata Sandi
                        </label>
                        <div className="relative flex items-center">
                          <span
                            className="material-symbols-outlined absolute left-space-md text-muted-gray text-[20px] pointer-events-none"
                            aria-hidden="true"
                          >
                            key
                          </span>
                          <input
                            className="w-full h-11 pl-11 pr-11 rounded-xl bg-surface text-primary font-body text-body placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-focus"
                            id="student-password"
                            placeholder="Masukkan kata sandimu"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                            minLength={8}
                            autoComplete="current-password"
                          />
                          <button
                            aria-label="Lihat kata sandi"
                            className="absolute right-space-md text-muted-gray hover:text-primary transition-colors"
                            id="show-password-btn"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={busy}
                          >
                            <span
                              className="material-symbols-outlined text-[20px]"
                              id="eye-icon"
                              aria-hidden="true"
                            >
                              visibility
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-metadata">
                          <a
                            className="font-metadata text-metadata text-secondary hover:underline"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              sendLink();
                            }}
                          >
                            Lupa kata sandi?
                          </a>
                          <button
                            className="h-9 px-space-md rounded-lg bg-primary text-on-primary font-label text-metadata hover:bg-primary-hover"
                            type="submit"
                            disabled={busy}
                          >
                            Masuk
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="relative flex items-center justify-center my-space-xs">
                      <div className="w-full h-[1px] bg-divider"></div>
                      <span className="absolute bg-surface px-space-md font-metadata text-metadata text-muted-gray">
                        atau eksplorasi instan
                      </span>
                    </div>

                    <a
                      className="w-full min-h-[52px] p-space-sm sm:px-space-md rounded-xl bg-secondary-container hover:bg-secondary-fixed text-primary font-label text-label flex items-center justify-between transition-all shadow-sm group focus:outline-none focus:ring-2 focus:ring-focus"
                      data-path="demo-nadia"
                      href="#"
                      id="instant-demo-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!busy) demo();
                      }}
                      aria-disabled={busy}
                    >
                      <div className="flex items-center gap-space-sm text-left">
                        <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 shadow-xs">
                          <span
                            className="material-symbols-outlined text-[20px] text-success group-hover:scale-110 transition-transform"
                            aria-hidden="true"
                          >
                            play_circle
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-card-title text-label text-primary font-extrabold flex items-center gap-1">
                            Coba Demo Langsung
                            <span className="bg-primary text-on-primary text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                              Tanpa Daftar
                            </span>
                          </span>
                          <span className="font-metadata text-metadata text-text-secondary">
                            {"Profil Manda • Materi contoh SMP & SMA"}
                          </span>
                        </div>
                      </div>
                      <span
                        className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </a>
                  </div>

                  <div
                    className={signup ? "flex flex-col gap-space-md" : "hidden"}
                    id="panel-register"
                  >
                    <div className="bg-surface-container-low p-space-md rounded-xl flex items-center gap-space-sm">
                      <span
                        className="material-symbols-outlined text-secondary text-[24px]"
                        aria-hidden="true"
                      >
                        verified
                      </span>
                      <p className="font-metadata text-metadata text-text-secondary leading-snug">
                        {
                          "Buat akun untuk menyimpan preferensi dan progres belajarmu."
                        }
                      </p>
                    </div>
                    <form
                      className="flex flex-col gap-space-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        registerAccount();
                      }}
                    >
                      <div className="flex flex-col gap-space-xs text-left">
                        <label
                          className="font-label text-label text-primary font-bold"
                          htmlFor="register-name"
                        >
                          Nama Panggilan
                        </label>
                        <input
                          className="w-full h-11 px-space-md rounded-xl bg-surface text-primary font-body text-body placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                          id="register-name"
                          placeholder="Nama yang kamu sukai (misal: Rian)"
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={80}
                          autoComplete="nickname"
                        />
                      </div>
                      <div className="flex flex-col gap-space-xs text-left">
                        <label
                          className="font-label text-label text-primary font-bold"
                          htmlFor="register-email"
                        >
                          Alamat Email
                        </label>
                        <input
                          className="w-full h-11 px-space-md rounded-xl bg-surface text-primary font-body text-body placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                          id="register-email"
                          placeholder="emailmu@gmail.com atau email sekolah"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                      <div className="flex flex-col gap-space-xs text-left">
                        <label
                          htmlFor="register-password"
                          className="font-label text-label text-primary font-bold"
                        >
                          Kata sandi
                        </label>
                        <input
                          id="register-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-11 px-space-md rounded-xl bg-surface text-primary font-body text-body focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                        />
                      </div>
                      <button
                        className="w-full h-11 mt-space-xs rounded-xl bg-primary-container text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm flex items-center justify-center gap-space-xs focus:outline-none focus:ring-2 focus:ring-focus"
                        type="submit"
                        disabled={busy}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                        >
                          how_to_reg
                        </span>
                        <span>Mulai Belajar Mandiri (Gratis)</span>
                      </button>
                    </form>
                  </div>

                  <div
                    className={
                      message
                        ? "p-space-md rounded-xl bg-secondary-container text-primary font-body text-metadata flex items-center gap-space-sm"
                        : "hidden"
                    }
                    id="status-toast"
                    role="status"
                  >
                    <span
                      className="material-symbols-outlined text-success"
                      aria-hidden="true"
                    >
                      mark_email_read
                    </span>
                    <span id="toast-message">{message}</span>
                  </div>

                  <div className="pt-space-md flex flex-col gap-space-xs text-left bg-surface-container-low p-space-md rounded-xl">
                    <div className="flex items-center gap-space-xs text-text-secondary font-label text-metadata font-bold">
                      <span
                        className="material-symbols-outlined text-[18px] text-success"
                        aria-hidden="true"
                      >
                        shield
                      </span>
                      Komitmen Privasi Pelajar TemanBelajar
                    </div>
                    <p className="font-metadata text-metadata text-muted-gray leading-relaxed">
                      {
                        "Progres dan preferensi belajarmu tersimpan pada akunmu. Kamu memilih materi yang ingin dibantu susun oleh AI."
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-space-md text-center">
                  <p className="font-metadata text-metadata text-text-secondary">
                    Mengalami kesulitan masuk?{" "}
                    <a
                      className="text-primary font-bold hover:underline"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBack();
                      }}
                    >
                      Hubungi Tim Bantuan Siswa
                    </a>{" "}
                    lewat WhatsApp atau panduan audio.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-space-xxl pt-space-xl grid grid-cols-1 md:grid-cols-4 gap-gutter">
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-xs">
                <span className="font-label text-metadata text-secondary uppercase font-bold tracking-wider">
                  01 · Format Bebas
                </span>
                <h2 className="font-card-title text-card-title text-primary">
                  Teks Singkat &amp; Komik Mini
                </h2>
                <p className="font-metadata text-metadata text-text-secondary">
                  Ringkasan konsep sains dan sosial dalam kartu padat tanpa
                  dinding teks membosankan.
                </p>
              </div>
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-xs">
                <span className="font-label text-metadata text-secondary uppercase font-bold tracking-wider">
                  02 · Kontrol Stimulasi
                </span>
                <h2 className="font-card-title text-card-title text-primary">
                  Bebas Bunyi Mengagetkan
                </h2>
                <p className="font-metadata text-metadata text-text-secondary">
                  Tidak ada bunyi buzzer saat keliru menjawab. Mimo membantumu
                  mencoba lagi secara perlahan.
                </p>
              </div>
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-xs">
                <span className="font-label text-metadata text-secondary uppercase font-bold tracking-wider">
                  03 · Kurikulum Merdeka
                </span>
                <h2 className="font-card-title text-card-title text-primary">
                  Capaian Pembelajaran Pas
                </h2>
                <p className="font-metadata text-metadata text-text-secondary">
                  Sesuai materi semester sekolah tanpa beban PR ganda yang
                  membebani sore harimu.
                </p>
              </div>
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-xs">
                <span className="font-label text-metadata text-secondary uppercase font-bold tracking-wider">
                  04 · Ramah Ponsel Lemot
                </span>
                <h2 className="font-card-title text-card-title text-primary">
                  {"Ramah Perangkat"}
                </h2>
                <p className="font-metadata text-metadata text-text-secondary">
                  {
                    "Teks yang ringkas dan kontrol bacaan untuk belajar sesuai ritmemu."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full bg-surface-container-low mt-space-section">
        <div className="max-w-[1280px] mx-auto px-gutter py-space-xxl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-space-xl">
            <div className="md:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <Image
                  alt="TemanBelajar"
                  className="h-7 w-auto object-contain"
                  src="/design/logo.png"
                  width={640}
                  height={240}
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
      {error && (
        <p role="alert" className="stitch-landing-error">
          {error}
        </p>
      )}
    </div>
  );
}

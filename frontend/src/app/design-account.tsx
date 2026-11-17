"use client";
import { Brand } from "./brand";
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
        email: email.trim(),
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
    <>
      <div className="final-design final-screen-2 bg-canvas font-body text-body text-on-surface min-h-screen flex items-center justify-center stitch-shell stitch-landing stitch-account">
        <main className="w-full max-w-[1200px] mx-auto px-margin bg-canvas flex items-center justify-center ui-container">
          <div className="flex flex-col w-full py-8 md:py-12">
            <header className="w-full flex flex-wrap gap-4 items-center justify-between mb-8">
              <a
                className="standalone-brand"
                href="#"
                aria-label="Kembali ke beranda"
                onClick={(event) => {
                  event.preventDefault();
                  onBack();
                }}
              >
                <Brand />
              </a>
              <div className="flex items-center gap-2.5">
                <a
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-butter-tint hover:bg-butter text-primary text-metadata font-label border border-warning/20 shadow-sm transition-all"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    demo();
                  }}
                  aria-disabled={busy}
                >
                  <span
                    className="material-symbols-outlined text-[1.125rem] text-warning"
                    aria-hidden="true"
                  >
                    bolt
                  </span>
                  <span>Jelajahi Demo</span>
                </a>
                <button
                  aria-label="Bantuan Aksesibilitas"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-secondary-fixed text-primary text-metadata font-label transition-colors"
                  type="button"
                  onClick={() =>
                    document.getElementById("email-input")?.focus()
                  }
                >
                  <span
                    className="material-symbols-outlined text-[1.15rem]"
                    aria-hidden="true"
                  >
                    accessibility_new
                  </span>
                  <span className="hidden sm:inline text-[0.8125rem]">
                    Aksesibilitas
                  </span>
                </button>
              </div>
            </header>

            <div className="w-full bg-surface rounded-[1.75rem] shadow-[0_3px_0_rgba(39,59,53,0.09)] overflow-hidden">
              <div className="relative w-full">
                <div className="absolute -top-3 left-12 z-20 bg-butter/90 border border-warning/30 px-5 py-1 rounded-sm shadow-sm transform -rotate-2 select-none pointer-events-none">
                  <span className="text-[0.7rem] font-display font-extrabold text-primary tracking-widest uppercase flex items-center gap-1.5">
                    <span>📎</span> EDISI BELAJAR MANDIRI
                  </span>
                </div>
                <div className="absolute -top-3 right-16 z-20 bg-peach/90 border border-peach px-4 py-1 rounded-sm shadow-sm transform rotate-2 select-none pointer-events-none hidden md:block">
                  <span className="text-[0.7rem] font-display font-extrabold text-primary tracking-widest uppercase">
                    ✨ SMP &amp; SMA
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
                <section className="lg:col-span-5 bg-mint-tint p-6 sm:p-8 md:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-secondary-container">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-primary font-label text-metadata shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span>🌱 Sahabat Belajar SMP &amp; SMA</span>
                      </div>
                      <span className="font-display font-extrabold text-[0.75rem] text-primary/70 tracking-wider uppercase bg-surface/80 px-2.5 py-0.5 rounded-full">
                        HALO TEMAN BARU! 🦎✨
                      </span>
                    </div>
                    <h1 className="font-display text-[2rem] md:text-[2.35rem] text-primary leading-[1.18] font-extrabold mb-3 tracking-tight ui-page-title">
                      Hai! Aku Mimo.
                      <br />
                      <span className="relative inline-block">
                        Yuk, kenalan dulu!
                        <span className="absolute left-0 bottom-1 w-full h-2.5 bg-butter/60 -z-10 rounded-sm transform -rotate-1"></span>
                      </span>
                    </h1>
                    <p className="font-reading text-reading text-on-surface-variant mb-5 leading-relaxed">
                      Di sini kamu bebas belajar dengan caramu sendiri. Nggak
                      ada tes medis rumit, nggak ada timer yang bikin panik, dan
                      tanpa penilaian yang bikin cemas.
                    </p>
                    <div className="relative w-full my-2 py-4 flex flex-col items-center justify-center">
                      <div className="absolute inset-2 bg-secondary-fixed/40 rounded-[2.5rem] transform rotate-1 -z-0 border border-secondary-container"></div>
                      <div className="absolute -top-1 left-2 z-20 bg-surface px-3 py-1 rounded-full shadow-sm border border-secondary-container flex items-center gap-1.5 animate-bounce">
                        <span className="text-xs">🎧</span>
                        <span className="font-label text-[0.75rem] font-bold text-primary">
                          Bebas Pilih Cara
                        </span>
                      </div>
                      <div className="absolute -bottom-2 right-2 z-20 bg-surface px-3 py-1 rounded-full shadow-sm border border-secondary-container flex items-center gap-1.5">
                        <span className="text-xs">⚡</span>
                        <span className="font-label text-[0.75rem] font-bold text-primary">
                          100% Tanpa Tekanan
                        </span>
                      </div>
                      <Image
                        alt=""
                        className="relative z-10 w-48 sm:w-56 h-auto object-contain select-none transform hover: transition-transform duration-300 object-contain"
                        src="/design/mimo-final.png"
                        width={1408}
                        height={1120}
                      ></Image>
                    </div>
                    <div className="mt-4 bg-lavender-tint/90 border border-lavender/50 rounded-2xl p-4 relative shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-lavender shadow-xs text-lg">
                          💬
                        </div>
                        <p className="font-mimo-voice text-[1.05rem] text-primary leading-snug">
                          “Mau mulai materi sekolahmu, atau intip simulasi seru
                          dulu? Santai aja, aku temani tiap langkahmu!”
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-secondary-container/80">
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/75 border border-secondary-container shadow-xs text-metadata text-primary font-reading">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shrink-0 font-bold">
                          <span
                            className="material-symbols-outlined text-[1rem]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                        <span>
                          <strong className="font-bold">100% Gratis</strong>{" "}
                          untuk seluruh pelajar SMP &amp; SMA se-Indonesia
                        </span>
                      </li>
                      <li className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/75 border border-secondary-container shadow-xs text-metadata text-primary font-reading">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shrink-0 font-bold">
                          <span
                            className="material-symbols-outlined text-[1rem]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                        <span>
                          <strong className="font-bold">
                            Tanpa kata sandi
                          </strong>{" "}
                          (Magic link instan dikirim ke email kamu)
                        </span>
                      </li>
                      <li className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/75 border border-secondary-container shadow-xs text-metadata text-primary font-reading">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shrink-0 font-bold">
                          <span
                            className="material-symbols-outlined text-[1rem]"
                            aria-hidden="true"
                          >
                            check
                          </span>
                        </span>
                        <span>
                          Langsung pakai{" "}
                          <strong className="font-bold">
                            tanpa syarat tes medis
                          </strong>{" "}
                          atau surat diagnosis
                        </span>
                      </li>
                    </ul>
                  </div>
                </section>
                <section className="lg:col-span-7 bg-surface p-6 sm:p-8 md:p-12 flex flex-col justify-between">
                  <div className="max-w-xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-7">
                      <nav
                        aria-label="Mode Masuk"
                        className="flex items-center gap-1.5 bg-canvas p-1.5 rounded-full border border-divider shadow-xs"
                      >
                        <button
                          aria-current="page"
                          className="px-4 py-2 rounded-full bg-secondary-fixed text-primary font-label text-metadata font-bold shadow-xs transition-all flex items-center gap-2"
                          type="button"
                          onClick={() =>
                            document.getElementById("email-input")?.focus()
                          }
                        >
                          <span
                            className="material-symbols-outlined text-[1.125rem]"
                            aria-hidden="true"
                          >
                            mail
                          </span>
                          <span>Masuk / Buat Akun</span>
                        </button>
                        <a
                          className="px-4 py-2 rounded-full text-on-surface-variant hover:text-primary font-label text-metadata font-semibold transition-colors flex items-center gap-1.5"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            demo();
                          }}
                          aria-disabled={busy}
                        >
                          <span
                            className="material-symbols-outlined text-[1.125rem] text-warning"
                            aria-hidden="true"
                          >
                            bolt
                          </span>
                          <span>Coba Demo Kilat</span>
                        </a>
                      </nav>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[0.75rem] font-bold text-success bg-secondary-container/50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>{" "}
                        Bebas Kuota Lambat
                      </span>
                    </div>
                    <div className="mb-6">
                      <h2 className="font-display text-[1.65rem] md:text-[1.85rem] text-primary font-extrabold tracking-tight ui-section-title">
                        Mulai langkah belajarmu
                      </h2>
                      <p className="font-reading text-reading text-on-surface-variant mt-1.5 leading-relaxed">
                        Masukkan email sekolah atau pribadi kamu. Kami kirimkan
                        tautan masuk instan tanpa perlu repot menghafal kata
                        sandi.
                      </p>
                    </div>
                    <form
                      className="space-y-4"
                      id="magic-auth-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendLink();
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline">
                          <label
                            className="font-label text-label text-primary font-bold flex items-center gap-1.5"
                            htmlFor="email-input"
                          >
                            <span>Alamat Email Siswa atau Orang Tua</span>
                            <span className="text-error">*</span>
                          </label>
                          <span className="text-[0.75rem] text-on-surface-variant font-reading bg-canvas px-2 py-0.5 rounded">
                            Wajib diisi
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            aria-describedby="email-hint email-error"
                            autoComplete="email"
                            className="w-full min-h-[50px] pl-4 pr-11 py-3 rounded-xl bg-canvas/60 text-primary font-reading text-body placeholder:text-outline outline-none ring-1 ring-control-border focus:ring-2 focus:ring-primary focus:bg-surface focus:ring-offset-2 transition-all"
                            id="email-input"
                            name="email"
                            placeholder="contoh: fajar@belajar.id atau emailmu@gmail.com"
                            required={true}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={busy}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                            <span
                              className="material-symbols-outlined text-[1.25rem]"
                              aria-hidden="true"
                            >
                              alternate_email
                            </span>
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 mt-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low/70 text-metadata text-on-surface-variant font-reading"
                          id="email-hint"
                        >
                          <span
                            className="material-symbols-outlined text-[1rem] text-success"
                            aria-hidden="true"
                          >
                            verified_user
                          </span>
                          <span>
                            Tautan masuk ajaib (magic link) langsung dikirimkan
                            ke inbox kamu.
                          </span>
                        </div>
                        <div
                          className="text-error text-sm"
                          id="email-error"
                          role="alert"
                          hidden={!error}
                        >
                          {error}
                        </div>
                      </div>
                      <button
                        className="w-full min-h-[50px] px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-base font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        id="submit-btn"
                        type="submit"
                        disabled={busy}
                      >
                        <span>Kirim Tautan Masuk Ajaib</span>
                        <span
                          className="material-symbols-outlined text-[1.2rem]"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>
                      {message && (
                        <p
                          role="status"
                          className="p-4 rounded-xl bg-mint-tint text-success"
                        >
                          {message}
                        </p>
                      )}
                    </form>
                    <div className="relative my-6 flex items-center justify-center">
                      <div className="w-full h-px bg-divider"></div>
                      <span className="absolute px-4 bg-surface font-reading text-metadata text-on-surface-variant">
                        atau masuk lebih cepat dengan
                      </span>
                    </div>
                    <button
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-surface hover:bg-canvas text-primary font-label text-label ring-1 ring-control-border flex items-center justify-center gap-3 transition-colors cursor-pointer focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-xs"
                      type="button"
                      disabled={true}
                      title="Connexion Google belum dikonfigurasi. Gunakan email atau demo."
                    >
                      Masuk dengan Google (belum tersedia)
                    </button>
                    <div
                      className="mt-7 p-5 bg-butter-tint/80 border-2 border-primary/20 rounded-2xl relative shadow-sm"
                      id="mode-demo"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-butter text-warning font-display font-extrabold text-[0.75rem] tracking-wider uppercase border border-warning/20">
                          ⚡ PENASARAN CARA KERJANYA?
                        </span>
                        <span className="text-[0.75rem] text-primary font-bold font-label bg-surface px-2.5 py-0.5 rounded-full border border-divider">
                          Tanpa Registrasi
                        </span>
                      </div>
                      <p className="font-reading text-metadata text-primary mb-3.5 leading-relaxed">
                        Mau langsung intip 5 mode belajar adaptif dan simulasi
                        fotosintesis interaktif berbasis kartu visual tanpa
                        perlu mendaftar?
                      </p>
                      <a
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface hover:bg-butter text-primary font-label text-label font-bold ring-1 ring-control-border hover:ring-primary transition-all group shadow-xs"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          demo();
                        }}
                        aria-disabled={busy}
                      >
                        <span>Coba Demo Materi Fotosintesis</span>
                        <span
                          className="material-symbols-outlined text-[1.2rem] text-warning group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        >
                          bolt
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-divider max-w-xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[0.8125rem] text-on-surface-variant font-reading">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="material-symbols-outlined text-[1rem] text-success"
                          aria-hidden="true"
                        >
                          lock
                        </span>
                        <span>Data belajar disimpan di akunmu.</span>
                      </div>
                      <a
                        className="text-primary font-semibold underline hover:text-secondary-fixed-variant transition-colors flex items-center gap-1"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onBack();
                        }}
                      >
                        <span>Kembali ke halaman awal</span>
                        <span
                          className="material-symbols-outlined text-[0.875rem]"
                          aria-hidden="true"
                        >
                          accessibility
                        </span>
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

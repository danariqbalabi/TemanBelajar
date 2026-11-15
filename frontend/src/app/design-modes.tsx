"use client";
import { useState } from "react";
import Image from "next/image";
import type { Material, Mode } from "@/lib/types";
export function ModePicker({
  material,
  busy,
  onBack,
  onSelect,
  canSaveDefault,
}: {
  material: Material;
  busy: boolean;
  onBack: () => void;
  onSelect: (mode: Mode, remember: boolean) => void;
  canSaveDefault: boolean;
}) {
  const [remember, setRemember] = useState(false);
  const available = (mode: Mode) =>
    mode === "explore"
      ? material.concepts.every((c) => c.diagram_description)
      : mode === "transcript"
        ? material.concepts.every((c) => c.transcript)
        : true;
  return (
    <div className="stitch-screen revamp-modes px-6 py-8">
      <div className="flex flex-col w-full">
        <div
          className="fixed bottom-6 right-6 z-50 bg-[#273B35] text-[#F8F7F2] font-semibold text-xs px-5 py-3 rounded-2xl shadow-modal transition-all duration-300 transform translate-y-16 opacity-0 pointer-events-none flex items-center gap-2"
          id="feedback-toast"
        >
          <span
            className="material-symbols-outlined text-sm text-[#C8E8CE]"
            aria-hidden="true"
          >
            check_circle
          </span>
          <span>Memuat mode belajar...</span>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <a
              className="inline-flex items-center gap-2.5 text-xs font-bold text-[#505C55] hover:text-[#273B35] transition-colors bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-xl shadow-card"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            >
              <span
                className="material-symbols-outlined text-base"
                aria-hidden="true"
              >
                arrow_back
              </span>
              <span>Kembali ke Ringkasan Materi</span>
            </a>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#273B35]/5 text-xs font-semibold text-[#273B35]">
              <span
                className="material-symbols-outlined text-sm text-[#28583E]"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                change_history
              </span>
              <span>
                Topik: <strong>Teorema Pythagoras (Sisi Miring)</strong>
              </span>
            </div>
          </header>

          <section className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8E8CE] text-[#28583E] text-[11px] font-bold tracking-wide">
              <span className="text-sm">🌿</span>
              <span>Bebas Pilih Sesuai Mood &amp; Energimu</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#273B35] tracking-tight">
                {"Mau belajar pakai cara yang mana hari ini?"}
              </h1>
              <p className="text-base sm:text-lg text-[#505C55] font-medium leading-relaxed">
                Pilih format yang paling nyaman buat pikiranmu. Manda bisa ganti
                cara kapan pun saat sesi berlangsung tanpa khawatir nilai atau
                progres berkurang.
              </p>
            </div>
          </section>

          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <article
                className="mode-card relative bg-[#F4F9F4] rounded-3xl p-6 sm:p-7 shadow-card transition-all duration-200 overflow-hidden ring-2 ring-[#C8E8CE]"
                id="mode-reading"
              >
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#C8E8CE]/60 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="space-y-3.5 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#28583E] text-white text-[11px] font-extrabold tracking-wide">
                      <span>✨</span>
                      <span>Paling Cocok Hari Ini • Pilihan Manda</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-[#28583E]">
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          auto_stories
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-[#273B35] leading-snug">
                          Teman Baca{" "}
                          <span className="text-xs sm:text-sm font-semibold text-[#505C55] block sm:inline sm:ml-1">
                            (Reading Companion)
                          </span>
                        </h2>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#28583E] mt-0.5">
                          <span
                            className="material-symbols-outlined text-xs"
                            aria-hidden="true"
                          >
                            schedule
                          </span>
                          Estimasi ± 10 Menit
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-[#273B35] leading-relaxed font-medium">
                      Teks lapang ramah disleksia, penggaris fokus kalimat
                      interaktif, dan glosarium definisi instan tanpa bikin mata
                      lelah.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-semibold text-[#505C55] flex items-center gap-1 shadow-xs">
                        <span
                          className="material-symbols-outlined text-[13px] text-[#28583E]"
                          aria-hidden="true"
                        >
                          view_stream
                        </span>{" "}
                        Penggaris Kalimat
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-semibold text-[#505C55] flex items-center gap-1 shadow-xs">
                        <span
                          className="material-symbols-outlined text-[13px] text-[#28583E]"
                          aria-hidden="true"
                        >
                          font_download
                        </span>{" "}
                        Font Bionic &amp; Lapang
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 text-[11px] font-semibold text-[#505C55] flex items-center gap-1 shadow-xs">
                        <span
                          className="material-symbols-outlined text-[13px] text-[#28583E]"
                          aria-hidden="true"
                        >
                          volume_up
                        </span>{" "}
                        Dengarkan Kalimat
                      </span>
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0 w-full sm:w-auto">
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#273B35] hover:bg-[#1B3029] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                      type="button"
                      onClick={() => onSelect("reading", remember)}
                      disabled={busy || !available("reading")}
                    >
                      <span>Mulai dengan Teman Baca</span>
                      <span
                        className="material-symbols-outlined text-lg"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
                {!available("reading") && (
                  <p className="text-sm text-text-secondary mt-3">
                    Format ini belum tersedia untuk isi materi ini.
                  </p>
                )}
              </article>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <article
                  className="mode-card bg-white rounded-3xl p-5 shadow-card hover:shadow-md transition-all flex flex-col justify-between group"
                  id="mode-audio"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#A8B7F5]/25 text-[#3B4C9B] flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          headphones
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#505C55] bg-[#F8F7F2] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs"
                          aria-hidden="true"
                        >
                          timer
                        </span>
                        ± 12 Menit
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#273B35] group-hover:text-[#3B4C9B] transition-colors">
                        Dengarkan &amp; Jelajahi
                      </h3>
                      <span className="text-[11px] text-[#737B75] font-medium block">
                        Audio &amp; Visual Interaktif
                      </span>
                    </div>
                    <p className="text-xs text-[#505C55] leading-relaxed">
                      Narasi suara jernih dan santai, dilengkapi eksplorasi
                      bagian-bagian diagram segitiga secara interaktif.
                    </p>
                  </div>
                  <div className="pt-4 mt-2">
                    <button
                      className="w-full py-2.5 px-3 rounded-xl bg-[#F8F7F2] hover:bg-[#273B35] hover:text-white text-xs font-bold text-[#273B35] transition-all flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={() => onSelect("explore", remember)}
                      disabled={busy || !available("explore")}
                    >
                      <span>Pilih Mode Ini</span>
                      <span
                        className="material-symbols-outlined text-sm"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </button>
                  </div>
                  {!available("explore") && (
                    <p className="text-sm text-text-secondary mt-3">
                      Format ini belum tersedia untuk isi materi ini.
                    </p>
                  )}
                </article>

                <article
                  className="mode-card bg-white rounded-3xl p-5 shadow-card hover:shadow-md transition-all flex flex-col justify-between group"
                  id="mode-step"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FFE7A3]/40 text-[#61450E] flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          bolt
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#505C55] bg-[#F8F7F2] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs"
                          aria-hidden="true"
                        >
                          timer
                        </span>
                        ± 10 Menit
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#273B35] group-hover:text-[#61450E] transition-colors">
                        Langkah demi Langkah
                      </h3>
                      <span className="text-[11px] text-[#737B75] font-medium block">
                        Focus Navigator
                      </span>
                    </div>
                    <p className="text-xs text-[#505C55] leading-relaxed">
                      Satu instruksi per layar. Minim distraksi visual, sangat
                      pas jika kamu sedang ingin fokus perlahan.
                    </p>
                  </div>
                  <div className="pt-4 mt-2">
                    <button
                      className="w-full py-2.5 px-3 rounded-xl bg-[#F8F7F2] hover:bg-[#273B35] hover:text-white text-xs font-bold text-[#273B35] transition-all flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={() => onSelect("focus", remember)}
                      disabled={busy || !available("focus")}
                    >
                      <span>Pilih Mode Ini</span>
                      <span
                        className="material-symbols-outlined text-sm"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </button>
                  </div>
                  {!available("focus") && (
                    <p className="text-sm text-text-secondary mt-3">
                      Format ini belum tersedia untuk isi materi ini.
                    </p>
                  )}
                </article>

                <article
                  className="mode-card bg-white rounded-3xl p-5 shadow-card hover:shadow-md transition-all flex flex-col justify-between group"
                  id="mode-caption"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FFCA9D]/30 text-[#8F470E] flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          visibility
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#505C55] bg-[#F8F7F2] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs"
                          aria-hidden="true"
                        >
                          timer
                        </span>
                        ± 15 Menit
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#273B35] group-hover:text-[#8F470E] transition-colors">
                        Belajar dengan Teks &amp; Visual
                      </h3>
                      <span className="text-[11px] text-[#737B75] font-medium block">
                        Caption Learning
                      </span>
                    </div>
                    <p className="text-xs text-[#505C55] leading-relaxed">
                      Kartu konsep berurutan dengan animasi diagram segitiga dan
                      penjelasan ringkas bergambar.
                    </p>
                  </div>
                  <div className="pt-4 mt-2">
                    <button
                      className="w-full py-2.5 px-3 rounded-xl bg-[#F8F7F2] hover:bg-[#273B35] hover:text-white text-xs font-bold text-[#273B35] transition-all flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={() => onSelect("transcript", remember)}
                      disabled={busy || !available("transcript")}
                    >
                      <span>Pilih Mode Ini</span>
                      <span
                        className="material-symbols-outlined text-sm"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </button>
                  </div>
                  {!available("transcript") && (
                    <p className="text-sm text-text-secondary mt-3">
                      Format ini belum tersedia untuk isi materi ini.
                    </p>
                  )}
                </article>

                <article
                  className="mode-card bg-white rounded-3xl p-5 shadow-card hover:shadow-md transition-all flex flex-col justify-between group"
                  id="mode-standard"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#E5E8E1] text-[#273B35] flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          article
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#505C55] bg-[#F8F7F2] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-xs"
                          aria-hidden="true"
                        >
                          all_inclusive
                        </span>
                        Fleksibel
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#273B35] group-hover:text-[#28583E] transition-colors">
                        Belajar Biasa
                      </h3>
                      <span className="text-[11px] text-[#737B75] font-medium block">
                        Standard Learning
                      </span>
                    </div>
                    <p className="text-xs text-[#505C55] leading-relaxed">
                      Format bacaan standar bersih dengan opsi pembacaan suara
                      jika dibutuhkan sewaktu-waktu.
                    </p>
                  </div>
                  <div className="pt-4 mt-2">
                    <button
                      className="w-full py-2.5 px-3 rounded-xl bg-[#F8F7F2] hover:bg-[#273B35] hover:text-white text-xs font-bold text-[#273B35] transition-all flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={() => onSelect("standard", remember)}
                      disabled={busy || !available("standard")}
                    >
                      <span>Pilih Mode Ini</span>
                      <span
                        className="material-symbols-outlined text-sm"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </button>
                  </div>
                  {!available("standard") && (
                    <p className="text-sm text-text-secondary mt-3">
                      Format ini belum tersedia untuk isi materi ini.
                    </p>
                  )}
                </article>
              </div>
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-gradient-to-b from-white via-[#F8F7F2] to-[#C8E8CE]/30 rounded-3xl p-6 shadow-card flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-40 h-40 rounded-full bg-[#FFE7A3]/30 absolute -top-8 -right-8 blur-2xl pointer-events-none"></div>

                <div className="relative w-44 h-44 mb-3 flex items-center justify-center">
                  <Image
                    alt="Mimo si Bunglon ramah sedang mendapatkan ide terang dengan lampu menyala di atas kepalanya"
                    className="w-full h-full object-contain drop-shadow-md select-none transform hover:scale-105 transition-transform duration-300"
                    src="/design/mimo-0.png"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-card text-left space-y-2 relative border border-[#C8E8CE]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28583E] animate-pulse"></span>
                    <span className="text-xs font-extrabold text-[#273B35] tracking-tight">
                      Catatan Hangat dari Mimo:
                    </span>
                  </div>
                  <p className="text-xs text-[#505C55] font-medium leading-relaxed">
                    &quot;Tenang aja, kalau di tengah jalan ngerasa kurang
                    cocok, kamu tinggal klik tombol{" "}
                    <strong className="text-[#273B35] bg-[#C8E8CE]/50 px-1.5 py-0.5 rounded-md">
                      &#x27;Ganti Cara&#x27;
                    </strong>{" "}
                    di atas layar tanpa kehilangan progres sama sekali!&quot;
                  </p>
                </div>

                <div className="w-full mt-4 bg-white/80 rounded-2xl p-3.5 shadow-card text-left flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#C8E8CE] text-[#28583E] flex items-center justify-center font-bold text-xs">
                      📐
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#273B35] block">
                        Bocoran Rumus
                      </span>
                      <span className="text-[10px] text-[#737B75] font-mono">
                        c² = a² + b² (Sisi Miring)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#28583E] bg-[#C8E8CE]/40 px-2 py-1 rounded-md">
                    Ringan
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-card flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-[#28583E] text-xl mt-0.5"
                  aria-hidden="true"
                >
                  sentiment_satisfied
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#273B35]">
                    Keleluasaan Penuh
                  </h4>
                  <p className="text-[11px] text-[#505C55] leading-relaxed">
                    Tidak ada batasan waktu kaku. Kamu bebas berhenti sejenak
                    untuk istirahat mata kapan pun.
                  </p>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <button
          onClick={onBack}
          className="min-h-[44px] px-4 rounded-xl border border-divider"
        >
          Kembali ke ringkasan
        </button>
        {canSaveDefault && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Simpan sebagai format awal
          </label>
        )}
      </div>
    </div>
  );
}

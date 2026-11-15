"use client";
import { useRef } from "react";
import Image from "next/image";
import type { Material } from "@/lib/types";
export function SummaryDesign({
  material,
  onBack,
  onChoose,
  onPlan,
}: {
  material: Material;
  onBack: () => void;
  onChoose: () => void;
  onPlan: () => void;
}) {
  const sourceDialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm">
                <button
                  className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary-hover transition-colors px-3 py-1.5 rounded-xl bg-surface shadow-sm"
                  type="button"
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-base"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Materi Saya</span>
                </button>
                <span className="text-muted-gray">•</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-mint text-mint-dark">
                  Matematika SMP Kelas 8
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface text-text-secondary hover:text-primary transition-all shadow-sm"
                  type="button"
                  onClick={() => sourceDialog.current?.showModal()}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    aria-hidden="true"
                  >
                    bookmark
                  </span>
                  Simpan Modul
                </button>
                <button
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface text-text-secondary hover:text-primary transition-all shadow-sm"
                  type="button"
                  onClick={() => sourceDialog.current?.showModal()}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    aria-hidden="true"
                  >
                    share
                  </span>
                  Bagikan
                </button>
              </div>
            </div>

            <header className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-8 md:p-10 shadow-card">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-mint/30 blur-2xl pointer-events-none"></div>
              <div className="absolute -right-4 -top-8 w-48 h-48 rounded-full bg-butter/40 blur-xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-mint/50 text-mint-dark text-xs font-bold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-mint-dark animate-pulse"></span>
                    Modul Pembelajaran Mandiri
                  </div>
                  <h1 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight leading-tight">
                    {material.title}
                  </h1>
                  <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed max-w-2xl">
                    Konsep kuadrat sisi miring, tripel pythagoras, dan
                    penggunaannya dalam soal kontekstual.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-canvas text-primary text-xs font-semibold shadow-xs">
                      <span
                        className="material-symbols-outlined text-base text-mint-dark"
                        aria-hidden="true"
                      >
                        schedule
                      </span>
                      <span>
                        Estimasi Belajar: <strong>25 Menit Total</strong>
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-canvas text-primary text-xs font-semibold shadow-xs">
                      <span
                        className="material-symbols-outlined text-base text-lavender"
                        aria-hidden="true"
                      >
                        extension
                      </span>
                      <span>
                        <strong>6 Konsep Kunci</strong>
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-canvas text-primary text-xs font-semibold shadow-xs">
                      <span
                        className="material-symbols-outlined text-base text-success"
                        aria-hidden="true"
                      >
                        analytics
                      </span>
                      <span>
                        Penguasaan:{" "}
                        <strong className="text-mint-dark">
                          {"Hasil latihan tersedia di halaman progres"}
                        </strong>
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-canvas text-text-secondary text-xs font-medium shadow-xs">
                      <span
                        className="material-symbols-outlined text-base"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                      <span>Sumber: Bab 3 Buku Paket Kemendikbudristek</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-surface font-sans font-bold text-base shadow-modal transition-all transform hover:-translate-y-0.5"
                    type="button"
                    onClick={onChoose}
                  >
                    <span>Pilih Cara Belajar</span>
                    <span
                      className="material-symbols-outlined text-xl"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-8 bg-mint rounded-full"></div>
                    <div>
                      <h2 className="font-display font-bold text-xl text-primary tracking-tight">
                        Alur Konsep yang Dipelajari
                      </h2>
                      <p className="text-xs text-text-secondary">
                        Peta navigasi terstruktur agar belajar terarah tanpa
                        rasa kewalahan
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-gray uppercase tracking-wider bg-surface px-3 py-1.5 rounded-xl shadow-xs">
                    Modul 02 / 05
                  </span>
                </div>

                <div className="space-y-3.5">
                  {material.concepts.map((c, i) => (
                    <article
                      className="p-5 rounded-2xl bg-surface shadow-card flex items-start gap-4 transition-all hover:shadow-md"
                      key={c.id}
                    >
                      <span className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-primary">
                          {c.title}
                        </h3>
                        <p className="text-sm text-text-secondary mt-2">
                          {c.paragraphs[0]}
                        </p>
                        <p className="text-xs text-text-secondary mt-3">
                          ± {c.estimated_minutes} menit •{" "}
                          {c.prerequisites.length} prasyarat
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-surface shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-text-secondary font-medium">
                    <span
                      className="material-symbols-outlined text-lg text-primary"
                      aria-hidden="true"
                    >
                      description
                    </span>
                    <span>
                      Tersedia dokumen asli kurikulum nasional (PDF Bab 3).
                    </span>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-mint-dark px-3.5 py-2 rounded-xl bg-canvas hover:bg-mint/40 transition-colors"
                    type="button"
                    onClick={() => sourceDialog.current?.showModal()}
                  >
                    <span>Lihat Dokumen Asli / Halaman Referensi</span>
                    <span
                      className="material-symbols-outlined text-sm"
                      aria-hidden="true"
                    >
                      open_in_new
                    </span>
                  </button>
                </div>
              </section>

              <aside className="lg:col-span-4 space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-mint/40 p-6 shadow-card space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-surface p-1 shadow-sm shrink-0 flex items-center justify-center">
                      <Image
                        className="w-full h-full object-contain rounded-xl"
                        data-alt="Charming 2D vector chameleon character Mimo sitting comfortably reading an open colorful geometry workbook, pastel sage green skin, light mint belly, big curious expressive eyes, blush on cheeks, warm clean minimal cartoon style"
                        src="/design/mimo-5.png"
                        width={1024}
                        height={1024}
                        alt="Mimo, teman belajarmu"
                      ></Image>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-mint-dark bg-mint px-2 py-0.5 rounded-md">
                        🌿 Teman Belajarmu
                      </div>
                      <h3 className="font-display font-bold text-base text-primary mt-0.5">
                        Mimo si Bunglon
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface text-primary text-xs sm:text-sm font-medium leading-relaxed shadow-sm">
                    <span className="font-bold text-mint-dark">
                      {
                        "Satu langkah kecil sudah berarti. Pilih format yang nyaman untukmu."
                      }
                    </span>{" "}
                    {material.title}
                  </div>
                </div>

                <div className="rounded-3xl bg-surface p-6 shadow-card space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-base text-primary">
                      Pilihan Format Belajar
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Pilih mode yang paling nyaman untuk indra belajarmu
                    </p>
                  </div>
                  <div
                    aria-label="Format Belajar"
                    className="space-y-3"
                    role="radiogroup"
                  >
                    <label className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-canvas hover:bg-mint/20 cursor-pointer transition-all shadow-xs">
                      <input
                        className="mt-1 text-primary focus:ring-mint-dark"
                        name="learning_format"
                        type="radio"
                        disabled={true}
                        aria-label="Pilih format di langkah berikutnya"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-lg text-primary"
                            aria-hidden="true"
                          >
                            menu_book
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-primary">
                            Teman Baca
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Format teks lapang &amp; penggaris fokus baca anti
                          lelah.
                        </p>
                      </div>
                    </label>

                    <label className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-canvas hover:bg-mint/20 cursor-pointer transition-all shadow-xs">
                      <input
                        className="mt-1 text-primary focus:ring-mint-dark"
                        name="learning_format"
                        type="radio"
                        disabled={true}
                        aria-label="Pilih format di langkah berikutnya"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-lg text-primary"
                            aria-hidden="true"
                          >
                            headphones
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-primary">
                            Audio &amp; Visual Explorer
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Dengarkan narasi ramah sambil mengamati animasi
                          segitiga.
                        </p>
                      </div>
                    </label>

                    <label className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-canvas hover:bg-mint/20 cursor-pointer transition-all shadow-xs">
                      <input
                        className="mt-1 text-primary focus:ring-mint-dark"
                        name="learning_format"
                        type="radio"
                        disabled={true}
                        aria-label="Pilih format di langkah berikutnya"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-lg text-primary"
                            aria-hidden="true"
                          >
                            bolt
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-primary">
                            Focus Navigator
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Pecah materi ke dalam langkah mikro 2 menit satu
                          kartu.
                        </p>
                      </div>
                    </label>
                  </div>

                  <button
                    className="w-full py-4 px-5 rounded-2xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-surface font-sans font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-modal transition-all transform hover:-translate-y-0.5"
                    type="button"
                    onClick={onChoose}
                  >
                    {"Pilih Cara Belajar"}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-butter/30 shadow-xs flex items-center gap-3 text-xs text-butter-dark">
                  <span className="text-xl shrink-0">💡</span>
                  <p className="font-medium">
                    Sesi singkat bisa kamu sesuaikan dengan waktu dan
                    kebutuhanmu. Belajar jangka panjang dibanding belajar
                    maraton 2 jam.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
        <button
          onClick={onPlan}
          className="mt-6 min-h-[44px] px-5 rounded-xl bg-canvas text-primary"
        >
          Susun rencana belajar
        </button>
        <dialog ref={sourceDialog} className="stitch-reason max-w-3xl">
          <h2>Sumber Materi</h2>
          {material.sources.map((s) => (
            <article key={s.id}>
              <h3 className="font-bold">{s.label}</h3>
              <p className="whitespace-pre-wrap">{s.text}</p>
            </article>
          ))}
          <button onClick={() => sourceDialog.current?.close()}>
            Tutup sumber
          </button>
        </dialog>
      </div>
    </>
  );
}

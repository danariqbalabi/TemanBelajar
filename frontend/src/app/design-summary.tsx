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
      <div className="final-design final-screen-11 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full">
          <section className="w-full bg-surface-container-low/70 py-space-sm">
            <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm ui-container">
              <div className="flex items-center flex-wrap gap-space-xs text-metadata font-metadata text-on-surface-variant">
                <a
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors font-label"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  <span>Kembali ke Materi Saya</span>
                </a>
                <span className="text-outline-variant">/</span>
                <span className="hover:text-primary cursor-pointer">
                  {material.subject}
                </span>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-label truncate max-w-[220px] md:max-w-none">
                  {material.title}
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <a
                  className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface text-primary hover:bg-mint-tint transition-all text-label font-label text-[13px] shadow-sm"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    (() => sourceDialog.current?.showModal())();
                  }}
                >
                  Lihat sumber asli
                </a>
              </div>
            </div>
          </section>

          <div className="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin py-space-lg flex flex-col gap-space-xl ui-container">
            <header className="relative w-full rounded-2xl bg-surface p-space-md md:p-space-xl shadow-md overflow-hidden">
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-mint-tint/80 pointer-events-none"></div>
              <div className="absolute -bottom-16 left-1/3 w-48 h-48 rounded-full bg-butter-tint/60 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label text-label text-[12px] tracking-wide uppercase">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      aria-hidden="true"
                    >
                      biotech
                    </span>

                    {material.subject}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mint-tint text-success font-label text-label text-[12px]">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      aria-hidden="true"
                    >
                      spa
                    </span>
                    Siap Dipelajari · Ramah Sensorik
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lavender-tint text-primary font-label text-label text-[12px]">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      aria-hidden="true"
                    >
                      auto_stories
                    </span>
                    {material.subject}
                  </span>
                </div>

                <div className="space-y-space-xs max-w-4xl">
                  <h1 className="font-page-title text-page-title text-primary tracking-tight ui-page-title">
                    {material.title}
                  </h1>
                  <p className="font-reading text-reading text-on-surface-variant max-w-3xl leading-relaxed">
                    Modul ini telah diringkas oleh{" "}
                    <strong className="text-primary font-bold">Mimo</strong>{" "}
                    menjadi {material.concepts.length} konsep inti yang bebas
                    pusing, ramah disleksia, dan terbagi ke dalam segmen santai
                    10–15 menit agar kamu bisa belajar dengan ritme sendiri.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                  {[
                    ["Konsep", material.concepts.length],
                    ["Latihan", material.question_count],
                    [
                      "Durasi",
                      material.concepts.reduce(
                        (n, c) => n + c.estimated_minutes,
                        0,
                      ) + " menit",
                    ],
                    ["Sumber", material.sources.length],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 rounded-xl bg-canvas">
                      <p className="text-xs">{label}</p>
                      <p className="font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                  <a
                    className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed transition-all font-label text-label shadow-sm"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onChoose();
                    }}
                  >
                    <span>Pilih Cara Belajar</span>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </a>
                  <button
                    className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl bg-secondary-container text-primary hover:bg-secondary-fixed transition-all font-label text-label"
                    type="button"
                    onClick={onChoose}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      aria-hidden="true"
                    >
                      play_arrow
                    </span>
                    <span>Mulai Langsung (Rekomendasi Mimo)</span>
                  </button>
                  <button
                    className="p-3 rounded-xl bg-surface-container hover:bg-surface-variant text-primary transition-colors"
                    title="Simpan ke Rencana Belajar"
                    type="button"
                    onClick={onPlan}
                    aria-label="Susun rencana belajar"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      bookmark_add
                    </span>
                  </button>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <section className="lg:col-span-8 flex flex-col gap-space-xl">
                <div className="w-full flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="inline-block w-3 h-3 rounded-full bg-secondary"></span>
                        <span className="text-metadata font-metadata text-secondary uppercase font-bold tracking-wider text-[11px]">
                          Alur Belajar Direkomendasikan
                        </span>
                      </div>
                      <h2 className="font-section-title text-section-title text-primary mt-1 ui-section-title">
                        Peta Konsep &amp; Urutan Belajar
                      </h2>
                    </div>
                    <p className="text-metadata font-metadata text-outline">
                      Ikuti nomor urut untuk pemahaman terbaik
                    </p>
                  </div>

                  <div className="flex flex-col gap-space-md relative">
                    {material.concepts.map((c, index) => (
                      <article
                        className="relative z-10 rounded-2xl bg-surface p-space-md md:p-space-lg shadow-sm hover:shadow-md transition-shadow"
                        key={c.id}
                      >
                        <div className="flex justify-between gap-4">
                          <span className="w-10 h-10 bg-mint rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm">
                            {c.estimated_minutes} menit
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mt-4 ui-card-title">
                          {c.title}
                        </h3>
                        <p className="my-3 text-text-secondary">
                          {c.paragraphs[0]}
                        </p>
                        <p className="text-sm">
                          {c.prerequisites.length
                            ? `${c.prerequisites.length} konsep prasyarat`
                            : "Bisa dimulai langsung"}
                        </p>
                        <button
                          className="bg-primary text-white rounded-xl px-5 py-3 mt-4"
                          onClick={onChoose}
                        >
                          Pelajari bagian ini →
                        </button>
                      </article>
                    ))}
                  </div>
                </div>

                <div
                  className="w-full flex flex-col gap-space-md pt-space-sm"
                  id="pilih-mode"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div>
                      <span className="text-metadata font-metadata text-secondary uppercase font-bold tracking-wider text-[11px]">
                        Kenyamanan Sensorik &amp; Kognitif
                      </span>
                      <h2 className="font-section-title text-section-title text-primary ui-section-title">
                        Tersedia 4 Mode Belajar Adaptif
                      </h2>
                    </div>
                    <a
                      className="inline-flex items-center gap-1 text-label font-label text-primary hover:underline"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onChoose();
                      }}
                    >
                      <span>Buka Mode Selector Lengkap</span>
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        open_in_new
                      </span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="p-space-md rounded-2xl bg-mint-tint flex flex-col justify-between gap-space-md shadow-sm transition-transform hover:-translate-y-0.5">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                            <span
                              className="material-symbols-outlined text-[22px]"
                              aria-hidden="true"
                            >
                              format_size
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-label text-[11px]">
                            Ramah Disleksia
                          </span>
                        </div>
                        <h4 className="font-card-title text-card-title text-primary mt-2 ui-label-title">
                          1. Teman Baca (Reading Companion)
                        </h4>
                        <p className="font-body text-body text-on-surface-variant text-[14px]">
                          Teks diformat dengan font ramah baca, pemenggalan suku
                          kata bantu, dan fitur mistar pemandu fokus baris per
                          baris.
                        </p>
                      </div>
                      <button
                        className="w-full py-2 rounded-xl bg-surface text-primary hover:bg-canvas font-label text-label text-[13px] flex items-center justify-center gap-1 transition-colors"
                        type="button"
                        onClick={onChoose}
                      >
                        <span>Pilih Mode Teman Baca</span>
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>

                    <div className="p-space-md rounded-2xl bg-butter-tint flex flex-col justify-between gap-space-md shadow-sm transition-transform hover:-translate-y-0.5">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                            <span
                              className="material-symbols-outlined text-[22px]"
                              aria-hidden="true"
                            >
                              checklist
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-label text-[11px]">
                            Bebas Distraksi
                          </span>
                        </div>
                        <h4 className="font-card-title text-card-title text-primary mt-2 ui-label-title">
                          2. Belajar Selangkah demi Selangkah
                        </h4>
                        <p className="font-body text-body text-on-surface-variant text-[14px]">
                          Navigasi per fragmen mini (chunking). Satu aktivitas
                          per layar, dilengkapi timer lembut tanpa alarm
                          mendadak.
                        </p>
                      </div>
                      <button
                        className="w-full py-2 rounded-xl bg-surface text-primary hover:bg-canvas font-label text-label text-[13px] flex items-center justify-center gap-1 transition-colors"
                        type="button"
                        onClick={onChoose}
                      >
                        <span>Pilih Mode Selangkah</span>
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>

                    <div className="p-space-md rounded-2xl bg-lavender-tint flex flex-col justify-between gap-space-md shadow-sm transition-transform hover:-translate-y-0.5">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                            <span
                              className="material-symbols-outlined text-[22px]"
                              aria-hidden="true"
                            >
                              headphones
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-label text-[11px]">
                            Audio Naratif
                          </span>
                        </div>
                        <h4 className="font-card-title text-card-title text-primary mt-2 ui-label-title">
                          3. Dengarkan &amp; Jelajahi
                        </h4>
                        <p className="font-body text-body text-on-surface-variant text-[14px]">
                          Baca nyaring dan deskripsi diagram mengikuti teks yang
                          tersedia pada materi.
                        </p>
                      </div>
                      <button
                        className="w-full py-2 rounded-xl bg-surface text-primary hover:bg-canvas font-label text-label text-[13px] flex items-center justify-center gap-1 transition-colors"
                        type="button"
                        onClick={onChoose}
                      >
                        <span>Pilih Mode Dengarkan</span>
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>

                    <div className="p-space-md rounded-2xl bg-peach-tint flex flex-col justify-between gap-space-md shadow-sm transition-transform hover:-translate-y-0.5">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                            <span
                              className="material-symbols-outlined text-[22px]"
                              aria-hidden="true"
                            >
                              palette
                            </span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-label text-[11px]">
                            Visual &amp; Teks
                          </span>
                        </div>
                        <h4 className="font-card-title text-card-title text-primary mt-2 ui-label-title">
                          4. Belajar Teks &amp; Visual
                        </h4>
                        <p className="font-body text-body text-on-surface-variant text-[14px]">
                          Diagram anatomi berwarna lembut dengan penomoran
                          jelas, kartu intisari, dan transkrip teks pendamping
                          lengkap.
                        </p>
                      </div>
                      <button
                        className="w-full py-2 rounded-xl bg-surface text-primary hover:bg-canvas font-label text-label text-[13px] flex items-center justify-center gap-1 transition-colors"
                        type="button"
                        onClick={onChoose}
                      >
                        <span>Pilih Mode Visual</span>
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="rounded-2xl bg-mint-tint p-6 border border-divider">
                  <Image
                    src="/design/mimo-final.png"
                    width={1408}
                    height={1120}
                    alt=""
                    className="w-32 h-auto object-contain mx-auto"
                  />
                  <h2 className="text-lg font-bold mt-4 ui-section-title">
                    Pesan Hangat Mimo
                  </h2>
                  <p className="mt-3">
                    Mulai dari {material.concepts[0]?.title}. Pilih format yang
                    nyaman, dan kamu bisa berganti kapan saja.
                  </p>
                  <button
                    onClick={onChoose}
                    className="bg-primary text-white px-5 py-3 rounded-xl mt-5"
                  >
                    Pilih cara belajar
                  </button>
                  <button onClick={onPlan} className="block mt-4">
                    Tambahkan ke rencana
                  </button>
                </div>
              </aside>
            </div>

            <section
              className="w-full rounded-2xl bg-surface p-space-md md:p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm"
              id="sumber-asli"
            >
              <div className="flex items-start sm:items-center gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-[26px]"
                    aria-hidden="true"
                  >
                    description
                  </span>
                </div>
                <div>
                  <h4 className="font-card-title text-card-title text-primary text-[16px] ui-label-title">{`${material.concepts.length} konsep · ${material.concepts.reduce((n, c) => n + c.estimated_minutes, 0)} menit`}</h4>
                  <p className="font-body text-body text-on-surface-variant text-[13px]">
                    {material.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs flex-shrink-0 w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-space-md py-2 rounded-xl bg-canvas hover:bg-surface-container text-primary font-label text-label text-[13px] transition-colors flex items-center justify-center gap-1"
                  type="button"
                  onClick={() => window.print()}
                >
                  Cetak ringkasan
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <dialog
        ref={sourceDialog}
        className="stitch-reason"
        aria-label="Teks sumber asli"
      >
        <h2 className="ui-section-title">Teks sumber asli</h2>
        {material.sources.map((s) => (
          <article key={s.id}>
            <h3 className="ui-card-title">{s.label}</h3>
            <p className="whitespace-pre-wrap">{s.text}</p>
          </article>
        ))}
        <button onClick={() => sourceDialog.current?.close()}>
          Tutup sumber
        </button>
      </dialog>
    </>
  );
}

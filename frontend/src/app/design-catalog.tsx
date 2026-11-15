"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { Material, LearningSession, Job } from "@/lib/types";
export function Catalog({
  materials,
  sessions,
  jobs,
  query,
  setQuery,
  onUpload,
  onDetail,
  onSettings,
  jobsPanel,
  uploadPanel,
  errorsPanel,
}: {
  materials: Material[];
  sessions: LearningSession[];
  jobs: Job[];
  query: string;
  setQuery: (q: string) => void;
  onUpload: () => void;
  onDetail: (m: Material) => void;
  onSettings: () => void;
  jobsPanel: ReactNode;
  uploadPanel: ReactNode;
  errorsPanel: ReactNode;
}) {
  const [subject, setSubject] = useState("Semua Topik"),
    [status, setStatus] = useState("all");
  const completed = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  const filtered = materials.filter(
    (m) =>
      (m.title + " " + m.subject).toLowerCase().includes(query.toLowerCase()) &&
      (subject === "Semua Topik" || m.subject === subject) &&
      (status === "all" ||
        (status === "learning" &&
          sessions.some(
            (s) => s.material_id === m.id && s.status !== "completed",
          )) ||
        (status === "ready" && !sessions.some((s) => s.material_id === m.id))),
  );
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        {errorsPanel}
        {uploadPanel}
        <div className="flex flex-col w-full">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mint text-primary">
                    Koleksi Aktif
                  </span>
                  <span className="text-xs text-text-secondary font-mono">{`${materials.length} materi tersedia`}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight font-sans">
                  {"Materi Belajarmu 🌿"}
                </h1>
                <p className="text-sm sm:text-base text-text-secondary">
                  Pilih materi yang ingin kamu pelajari hari ini dengan ritme
                  santai dan bebas cemas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-primary text-surface font-semibold text-sm shadow-md hover:bg-primary-hover active:bg-primary-pressed transition-all focus-visible:outline-focus min-h-[44px]"
                  type="button"
                  onClick={onUpload}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-lg leading-none"
                  >
                    add_circle
                  </span>
                  <span>+ Unggah Materi Baru</span>
                </button>
              </div>
            </header>

            <section
              aria-label="Alat Pencarian dan Filter Materi"
              className="space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                <div className="relative flex-1 max-w-xl">
                  <label className="sr-only" htmlFor="material-search">
                    Cari materi atau topik konsep
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-xl"
                    >
                      search
                    </span>
                  </div>
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface border-0 shadow-sm text-sm text-primary placeholder:text-muted-gray focus-visible:outline-focus transition-all"
                    id="material-search"
                    placeholder="Cari materi, rumus segitiga, fotosintesis..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Cari materi atau topik konsep"
                  />
                  <button
                    aria-label="Bersihkan pencarian"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-gray hover:text-primary hidden"
                    id="search-clear-btn"
                    type="button"
                    onClick={() => setQuery("")}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-base"
                    >
                      cancel
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                  <span className="text-xs font-semibold text-text-secondary hidden sm:inline">
                    Urutan:
                  </span>
                  <div className="relative">
                    <select
                      aria-label="Filter status materi"
                      className="appearance-none bg-surface text-primary text-xs font-semibold py-2.5 pl-3.5 pr-8 rounded-xl shadow-sm cursor-pointer hover:bg-canvas focus-visible:outline-focus transition-all border-0"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="all">Semua materi</option>
                      <option value="learning">Sedang dipelajari</option>
                      <option value="ready">Belum dimulai</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-sm"
                      >
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                aria-label="Filter Mata Pelajaran"
                className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar"
                role="tablist"
              >
                {[
                  "Semua Topik",
                  ...new Set(materials.map((m) => m.subject)),
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    aria-pressed={subject === s}
                    className={
                      "px-4 py-2 rounded-full text-sm min-h-[44px] " +
                      (subject === s
                        ? "bg-mint text-primary"
                        : "bg-surface text-text-secondary")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section
              aria-label="Daftar Modul Pembelajaran"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filtered.map((item) => (
                <article
                  className="bg-surface rounded-2xl p-6 shadow-card hover:shadow-lg transition-all flex flex-col justify-between relative group"
                  key={item.id}
                >
                  <div className="flex justify-between gap-3 text-xs text-text-secondary">
                    <span>{item.subject}</span>
                    <span>
                      {item.is_demo ? "Contoh terkurasi" : "Materi kamu"}
                    </span>
                  </div>
                  <div className="my-5">
                    <h2 className="text-xl font-extrabold text-primary">
                      {item.title}
                    </h2>
                    <p className="text-sm text-text-secondary mt-2">
                      {item.concepts.length} konsep • {item.question_count} soal
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-text-secondary">
                      {completed(item.id)} / {item.concepts.length} konsep
                      dibaca
                    </span>
                    <button
                      onClick={() => onDetail(item)}
                      className="px-5 py-2.5 rounded-xl bg-primary text-surface text-xs font-semibold min-h-[44px]"
                    >
                      Buka Ringkasan
                    </button>
                  </div>
                </article>
              ))}
              {!filtered.length && (
                <p className="p-6 rounded-2xl bg-surface text-text-secondary">
                  Belum ada materi yang cocok. Ubah pencarian atau unggah materi
                  baru.
                </p>
              )}
            </section>

            <section
              aria-label="Bantuan Pendamping Mimo"
              className="bg-mint rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
                  <Image
                    alt="Mimo si bunglon hijau menggemaskan sedang duduk santai sambil membaca buku dengan penuh semangat"
                    className="w-full h-full object-contain filter drop-shadow-md select-none transform hover:scale-105 transition-transform"
                    src="/design/mimo-0.png"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-primary text-xs font-bold shadow-xs">
                    <span>🦎 Mimo Siap Membantu</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-primary leading-snug">
                    Mau belajar bab atau tugas lain hari ini?
                  </h3>
                  <p className="text-xs sm:text-sm text-primary/80 max-w-2xl leading-relaxed">
                    Manda bisa unggah catatan sekolah dalam bentuk PDF, foto
                    rangkuman, atau ketik langsung. Mimo bantu susunkan zine
                    belajar yang ramah mata, tanpa dinding teks yang bikin
                    pusing!
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                    <button
                      className="px-4 py-2.5 rounded-xl bg-primary text-surface font-semibold text-xs shadow-sm hover:bg-primary-hover active:bg-primary-pressed transition-all min-h-[44px] focus-visible:outline-focus"
                      type="button"
                      onClick={onUpload}
                    >
                      Coba Materi Demo Lain
                    </button>
                    <button
                      className="px-4 py-2.5 rounded-xl bg-white/80 text-primary font-bold text-xs shadow-xs hover:bg-white active:bg-white/90 transition-all min-h-[44px] focus-visible:outline-focus"
                      type="button"
                      onClick={onSettings}
                    >
                      Atur Preferensi Format
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="mt-6">
          {jobsPanel}
          <p className="text-xs text-text-secondary">
            {jobs.filter((j) => j.status !== "ready").length} unggahan belum
            siap
          </p>
        </div>
      </div>
    </>
  );
}

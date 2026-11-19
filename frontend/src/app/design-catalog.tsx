"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
    [status, setStatus] = useState("all"),
    [list, setList] = useState(false),
    [sort, setSort] = useState("recent");
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  const completed = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  const latest = (id: string) =>
    sessions
      .filter((session) => session.material_id === id)
      .reduce(
        (value, session) =>
          Math.max(value, Date.parse(session.updated_at) || 0),
        0,
      );
  const filtered = materials
    .filter((material) => {
      const text = [
        material.title,
        material.subject,
        ...material.concepts.map((concept) => concept.title),
      ]
        .join(" ")
        .toLocaleLowerCase("id-ID");
      const started = sessions.some(
        (session) => session.material_id === material.id,
      );
      const finished =
        material.concepts.length > 0 &&
        completed(material.id) >= material.concepts.length;
      return (
        text.includes(query.trim().toLocaleLowerCase("id-ID")) &&
        (subject === "Semua Topik" || material.subject === subject) &&
        (status === "all" ||
          (status === "learning" && started && !finished) ||
          (status === "ready" && !started) ||
          (status === "completed" && finished))
      );
    })
    .toSorted((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title, "id")
        : latest(b.id) - latest(a.id),
    );
  return (
    <>
      <div className="final-design final-screen-8 w-full bg-canvas flex-1 screen-page">
        <button onClick={onSettings} className="sr-only focus:not-sr-only">
          Aksesibilitas
        </button>
        {errorsPanel}
        {uploadPanel}
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin py-space-xl flex flex-col gap-space-xl ui-container">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label text-label">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Katalog Belajar Pribadi
                  </span>
                  <span className="text-on-surface-variant font-metadata text-metadata">{`${materials.length} materi · ${jobs.filter((j) => j.status !== "ready").length} unggahan belum siap`}</span>
                </div>
                <h1 className="font-display text-page-title text-primary tracking-tight ui-page-title">
                  Materi Saya
                </h1>
                <p className="font-body text-body text-on-surface-variant">
                  Pilih materi. Temukan cara belajarmu.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm shrink-0">
                <button
                  className="inline-flex items-center justify-center gap-space-xs px-5 py-3 rounded-xl bg-surface text-primary font-label text-label hover:bg-canvas transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  type="button"
                  disabled={!materials.some((material) => material.is_demo)}
                  onClick={() => {
                    const m = materials.find((m) => m.is_demo);
                    if (m) onDetail(m);
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    lightbulb
                  </span>
                  Coba Materi Contoh
                </button>
                <button
                  className="inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
                  type="button"
                  onClick={onUpload}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    add_circle
                  </span>
                  + Tambah Materi Baru
                </button>
              </div>
            </header>
            <div className="collection-snapshot" aria-label="Ringkasan koleksi">
              {[
                {
                  icon: "auto_stories",
                  value: materials.length,
                  label: "Materi",
                  color: "mint",
                },
                {
                  icon: "category",
                  value: new Set(materials.map((item) => item.subject)).size,
                  label: "Mata pelajaran",
                  color: "lilac",
                },
                {
                  icon: "task_alt",
                  value: materials.filter(
                    (item) =>
                      item.concepts.length > 0 &&
                      completed(item.id) >= item.concepts.length,
                  ).length,
                  label: "Selesai dibaca",
                  color: "apricot",
                },
              ].map((item) => (
                <div
                  className="collection-stat"
                  data-color={item.color}
                  key={item.label}
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {jobs.length > 0 && (
              <section
                aria-label="Status Pemrosesan Berjalan"
                className="w-full bg-butter-tint rounded-2xl p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm"
              >
                {jobsPanel}
              </section>
            )}

            <section
              aria-label="Pencarian dan Filter Materi"
              className="flex flex-col gap-space-md"
            >
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    search
                  </span>
                </span>
                <input
                  className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-surface text-primary placeholder-outline font-body text-body shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary"
                  placeholder="Cari judul materi, bab, kata kunci, atau mata pelajaran..."
                  ref={search}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cari materi atau topik konsep"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <kbd className="hidden sm:inline-block px-2.5 py-1 bg-surface-container rounded-lg font-metadata text-metadata text-on-surface-variant text-xs font-semibold">
                    Ctrl + K
                  </kbd>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-xs overflow-x-auto pb-1 -mx-margin px-margin lg:mx-0 lg:px-0">
                  {[
                    "Semua Topik",
                    ...new Set(materials.map((m) => m.subject)),
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubject(s)}
                      aria-pressed={subject === s}
                      className="px-4 py-2 rounded-full bg-surface border border-divider"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
                  <div className="relative inline-block text-left">
                    <select
                      aria-label="Filter status belajar"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="appearance-none bg-surface text-primary font-label text-label pl-3.5 pr-8 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary cursor-pointer"
                    >
                      <option value="all">Semua Status</option>
                      <option value="learning">Sedang Dipelajari</option>
                      <option value="ready">Belum Mulai</option>
                      <option value="completed">Selesai</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </span>
                  </div>
                  <div className="relative inline-block text-left">
                    <select
                      aria-label="Urutkan materi"
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="appearance-none bg-surface text-primary font-label text-label pl-3.5 pr-8 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary cursor-pointer"
                    >
                      <option value="recent">Terakhir Dipelajari</option>
                      <option value="title">A-Z Judul</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        sort
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center bg-surface p-1 rounded-xl shadow-sm">
                    <button
                      aria-label="Tampilan kartu"
                      className="p-1.5 rounded-lg bg-surface-container text-primary"
                      type="button"
                      onClick={() => setList(false)}
                      aria-pressed={!list}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        grid_view
                      </span>
                    </button>
                    <button
                      aria-label="Tampilan daftar"
                      className="p-1.5 rounded-lg text-outline hover:text-primary transition-colors"
                      type="button"
                      onClick={() => setList(true)}
                      aria-pressed={list}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        format_list_bulleted
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section
              aria-label="Daftar Modul Belajar"
              className={
                "grid gap-6 " +
                (list
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")
              }
            >
              {filtered.map((item, index) => (
                <article
                  className="material-tile flex flex-col justify-between bg-surface rounded-3xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative"
                  data-color={
                    index % 3 === 0
                      ? "mint"
                      : index % 3 === 1
                        ? "lilac"
                        : "apricot"
                  }
                  key={item.id}
                >
                  <div className="flex justify-between text-sm">
                    <span>{item.subject}</span>
                    <span>
                      {item.is_demo ? "Materi contoh" : "Materi kamu"}
                    </span>
                  </div>
                  <div className="material-art my-5 p-5 rounded-2xl bg-mint-tint border border-divider">
                    <span className="material-art-orbit" aria-hidden="true" />
                    <span
                      className="material-symbols-outlined text-4xl"
                      aria-hidden="true"
                    >
                      {item.subject.toLocaleLowerCase("id").includes("mat")
                        ? "functions"
                        : item.subject.toLocaleLowerCase("id").includes("ipa")
                          ? "eco"
                          : "auto_stories"}
                    </span>
                    <p className="mt-3 text-sm">
                      {item.concepts.length} konsep · {item.question_count} soal
                    </p>
                  </div>
                  <h2 className="text-xl font-bold ui-card-title">
                    {item.title}
                  </h2>
                  <p className="text-sm mt-3">
                    {completed(item.id)} / {item.concepts.length} konsep dibaca
                  </p>
                  <div className="h-2 rounded-full bg-mint-tint my-4">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${item.concepts.length ? Math.min(100, (completed(item.id) / item.concepts.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onDetail(item)}
                    className="bg-primary text-white rounded-xl px-5 py-3 font-bold"
                  >
                    Buka Ringkasan →
                  </button>
                </article>
              ))}
              {!filtered.length && (
                <div className="col-span-full text-center bg-mint-tint rounded-3xl p-12">
                  <h2 className="text-2xl font-bold ui-section-title">
                    {materials.length
                      ? "Belum ada materi yang cocok"
                      : "Belum ada materi tersimpan"}
                  </h2>
                  <p className="mt-3">
                    {materials.length
                      ? "Coba kata kunci atau filter lain."
                      : "Tambahkan PDF atau tempel catatanmu untuk mulai belajar."}
                  </p>
                  <button
                    className="mt-6 bg-primary text-white px-5 py-3 rounded-xl"
                    onClick={() => {
                      if (materials.length) {
                        setQuery("");
                        setSubject("Semua Topik");
                        setStatus("all");
                      } else onUpload();
                    }}
                  >
                    {materials.length ? "Hapus filter" : "Tambah materi"}
                  </button>
                </div>
              )}
            </section>

            <section
              aria-label="Catatan Pendamping dari Mimo"
              className="w-full bg-surface rounded-3xl p-space-lg lg:p-space-xl shadow-sm flex flex-col md:flex-row items-center gap-space-lg"
            >
              <div className="w-28 h-28 shrink-0 flex items-center justify-center bg-mint-tint rounded-2xl p-2 relative">
                <Image
                  src="/design/mimo-final.png"
                  alt=""
                  width={1408}
                  height={1120}
                  className="w-32 h-auto object-contain"
                />
              </div>
              <div className="flex flex-col gap-space-xs text-center md:text-left">
                <div className="inline-flex items-center justify-center md:justify-start gap-1.5 text-secondary font-label text-label">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    verified
                  </span>
                  Tips Mimo
                </div>
                <blockquote className="font-mimo-voice text-mimo-voice text-primary max-w-3xl">
                  Mulai dari satu konsep. Atur tampilan bacaan yang nyaman
                  buatmu.
                </blockquote>
                <div className="flex items-center justify-center md:justify-start gap-space-sm mt-1 text-on-surface-variant font-metadata text-metadata">
                  <span>Ukuran teks bisa diatur</span>
                  <span>•</span>
                  <span>Pilihan mode fokus</span>
                  <span>•</span>
                  <span>Sumber bisa dibuka</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

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
    [status, setStatus] = useState("all"),
    [list, setList] = useState(false);
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
    <div className="stitch-screen">
      {errorsPanel}
      {uploadPanel}
      <div className="flex flex-col w-full gap-space-lg">
        <section className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata">
            <span>Pustaka Belajar Mandiri</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-label text-secondary">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                school
              </span>
              SMP Kelas 8
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-1">
              <h1 className="font-page-title text-page-title text-primary tracking-tight">
                Materi Saya
              </h1>
              <p className="font-body text-body text-text-secondary max-w-2xl">
                Semua catatan, ringkasan zine, dan bahan belajarmu tersusun rapi
                dan siap dipelajari dengan caramu tanpa batasan waktu.
              </p>
            </div>
            <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
              <button
                className="inline-flex items-center justify-center gap-space-xs h-11 px-space-md rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                type="button"
                onClick={onUpload}
                aria-label="+ Tambah materi"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  add_circle
                </span>
                <span>Tambah Materi Baru</span>
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-stretch">
          <div className="lg:col-span-8 bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col sm:flex-row items-center gap-space-md relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container/40 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative shrink-0 flex items-center justify-center w-28 h-28 rounded-2xl bg-surface-container-low p-2">
              <Image
                className="w-full h-full object-contain select-none"
                data-alt="Warm storybook illustration of Mimo the friendly chameleon in soft sage green with coral blushing cheeks, perched cheerfully atop a neat stack of pastel study books, waving one hand in an encouraging manner, styled after modern editorial children books on an ivory canvas"
                src="/design/mimo.png"
                width={1024}
                height={1024}
                alt="Mimo, teman belajarmu"
              />
            </div>

            <div className="flex flex-col gap-space-xs flex-1 z-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 self-center sm:self-start px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-metadata text-[12px]">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>Sapaan Mimo</span>
              </div>
              <p className="font-mimo-voice text-mimo-voice text-primary leading-snug">
                “Semua materi di sini sudah disesuaikan dengan format ramah
                bacaanmu. Mau lanjut baca{" "}
                <span className="text-secondary font-bold underline decoration-secondary/40 underline-offset-4">
                  Fotosintesis
                </span>{" "}
                atau coba materi matematika baru?”
              </p>
              <p className="font-metadata text-metadata text-text-secondary">
                Kamu memiliki kendali penuh atas ritme belajar hari ini. Tidak
                ada tenggat skor ataupun pengurangan nilai.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label text-label text-text-secondary uppercase tracking-wider text-[12px]">
                Status Koleksimu
              </span>
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                aria-hidden="true"
              >
                library_books
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col text-center">
                <span className="font-display text-[24px] text-primary font-bold leading-tight">
                  {materials.length}
                </span>
                <span className="font-metadata text-[12px] text-text-secondary leading-tight mt-0.5">
                  Siap Baca
                </span>
              </div>
              <div className="bg-tertiary-fixed/30 rounded-xl p-space-sm flex flex-col text-center">
                <span className="font-display text-[24px] text-tertiary font-bold leading-tight">
                  {jobs.filter((j) => j.status !== "ready").length}
                </span>
                <span className="font-metadata text-[12px] text-tertiary leading-tight mt-0.5">
                  Diproses
                </span>
              </div>
              <div className="bg-secondary-container/40 rounded-xl p-space-sm flex flex-col text-center">
                <span className="font-display text-[24px] text-secondary font-bold leading-tight">
                  {materials.filter((m) => m.is_demo).length}
                </span>
                <span className="font-metadata text-[12px] text-text-secondary leading-tight mt-0.5">
                  Demo
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-text-secondary pt-2">
              <span className="font-metadata text-[13px] flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[16px] text-success"
                  aria-hidden="true"
                >
                  check_circle
                </span>
                Format Zine Adaptif Aktif
              </span>
              <a
                className="font-label text-[13px] text-secondary hover:underline flex items-center gap-0.5"
                href="#koleksi-materi"
              >
                Lihat Semua
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  arrow_downward
                </span>
              </a>
            </div>
          </div>
        </section>

        {jobsPanel}

        <section
          className="flex flex-col gap-space-sm pt-2"
          id="koleksi-materi"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
            <div className="relative w-full lg:w-96">
              <span
                className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-gray text-[20px] pointer-events-none"
                aria-hidden="true"
              >
                search
              </span>
              <input
                aria-label="Cari materi pembelajaran"
                className="w-full h-11 pl-11 pr-4 bg-surface rounded-xl text-primary font-body text-body placeholder:text-muted-gray shadow-sm focus:outline-none focus:ring-2 focus:ring-focus transition-all"
                id="material-search"
                placeholder="Cari materi, bab, atau kata kunci..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
              <label className="sr-only" htmlFor="status-filter">
                Filter Status Materi
              </label>
              <div className="relative">
                <select
                  className="h-11 pl-3.5 pr-8 bg-surface rounded-xl font-label text-label text-primary shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer"
                  id="status-filter"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">Semua materi</option>
                  <option value="learning">Sedang dipelajari</option>
                  <option value="ready">Belum dimulai</option>
                  <option value="processing">Dalam proses</option>
                </select>
                <span
                  className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-gray text-[18px] pointer-events-none"
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </div>
              <button
                className="h-11 px-space-md rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container shadow-sm flex items-center gap-space-xs transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                onClick={onSettings}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  tune
                </span>
                <span>Format Bacaan</span>
              </button>
              <div className="h-6 w-px bg-divider hidden sm:block mx-1"></div>
              <button
                aria-label="Tampilan Kisi"
                className="w-11 h-11 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm"
                title="Tampilan Kisi"
                type="button"
                onClick={() => setList(false)}
                aria-pressed={!list}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  grid_view
                </span>
              </button>
              <button
                aria-label="Tampilan Daftar"
                className="w-11 h-11 rounded-xl bg-surface text-muted-gray hover:text-primary flex items-center justify-center shadow-sm transition-colors"
                title="Tampilan Daftar"
                type="button"
                onClick={() => setList(true)}
                aria-pressed={list}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  view_list
                </span>
              </button>
            </div>
          </div>

          <div
            aria-label="Filter Mata Pelajaran"
            className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none"
            role="tablist"
          >
            {["Semua Topik", ...new Set(materials.map((m) => m.subject))].map(
              (s) => (
                <button
                  key={s}
                  role="tab"
                  aria-selected={subject === s}
                  onClick={() => setSubject(s)}
                  className={
                    "h-9 px-4 rounded-full font-label text-label flex items-center gap-1.5 shrink-0 shadow-sm " +
                    (subject === s
                      ? "bg-secondary-container text-primary"
                      : "bg-surface text-text-secondary")
                  }
                >
                  {s}
                  <span className="text-[12px]">
                    {s === "Semua Topik"
                      ? materials.length
                      : materials.filter((m) => m.subject === s).length}
                  </span>
                </button>
              ),
            )}
          </div>
        </section>

        <section
          className={
            list
              ? "grid grid-cols-1 gap-space-md items-start"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md items-start"
          }
        >
          {filtered.map((m) => (
            <article
              className="bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden group hover:shadow-md transition-shadow"
              key={m.id}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-[12px]">{`${m.subject} • ${m.is_demo ? "Materi contoh" : "Materi kamu"}`}</span>
                <span className="font-metadata text-[13px] text-text-secondary flex items-center gap-1">{`~${m.concepts.reduce((n, c) => n + c.estimated_minutes, 0)} Menit`}</span>
              </div>

              <div className="w-full h-40 rounded-xl overflow-hidden relative bg-surface-container-low">
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="Editorial close-up diagram of a plant leaf cell and sunlight absorption in soft pastel shades of olive, sage green, and warm cream, with gentle textured paper grain and clear labels for chlorophyll"
                  width={1024}
                  height={1024}
                  src={
                    m.subject === "Matematika"
                      ? "/design/subject-math.png"
                      : "/design/subject-science.png"
                  }
                  alt={`Ilustrasi ${m.subject}`}
                />
                <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-primary font-metadata text-[12px] flex items-center gap-1 shadow-sm">
                  {m.sources[0]?.label || "Sumber materi"}
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h2 className="font-card-title text-card-title text-primary group-hover:text-secondary transition-colors">
                  {m.title}
                </h2>
                <p className="font-body text-metadata text-text-secondary line-clamp-2">
                  {m.concepts[0]?.paragraphs[0] ||
                    "Materi siap untuk dipelajari sesuai ritmemu."}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface-container text-text-secondary font-metadata text-[12px]">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[14px]"
                  >
                    auto_stories
                  </span>
                  Membaca
                </span>
                {m.concepts.every((c) => c.transcript) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface-container text-text-secondary font-metadata text-[12px]">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[14px]"
                    >
                      headphones
                    </span>
                    Transkrip & Audio
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface-container text-text-secondary font-metadata text-[12px]">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[14px]"
                  >
                    quiz
                  </span>
                  {m.question_count} Soal
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center font-metadata text-[13px]">
                  <span className="text-text-secondary flex items-center gap-1 font-label">{`${completed(m.id)} / ${m.concepts.length} konsep dibaca`}</span>
                  <span className="text-secondary font-semibold">
                    {completed(m.id)
                      ? "Lanjut sesuai ritmemu"
                      : "Siap dipelajari"}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full"
                    style={{
                      width: `${(completed(m.id) / m.concepts.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-space-xs pt-2">
                <button
                  className="flex-1 h-11 inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  onClick={() => onDetail(m)}
                >
                  <span>Buka Ringkasan</span>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </button>
                <button
                  aria-label={`Buka ${m.title}`}
                  className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-surface-container text-primary hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => onDetail(m)}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    picture_as_pdf
                  </span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="bg-surface rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md mt-2">
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 text-secondary">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                spa
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="font-label text-label text-primary font-bold">
                Standar Belajar Bebas Tekanan TemanBelajar
              </h3>
              <p className="font-metadata text-metadata text-text-secondary max-w-2xl">
                Setiap materi dapat dipelajari dengan kecepatanmu sendiri tanpa
                pengatur waktu mundur (timer) atau sanksi keterlambatan. Jika
                merasa lelah, gunakan jeda bernapas kapan saja.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 self-stretch sm:self-auto justify-end">
            <button
              className="h-10 px-space-md rounded-xl bg-surface-container text-primary font-label text-[13px] hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
            >
              Jelajahi Pustaka Umum
            </button>
            <button
              className="h-10 px-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant font-label text-[13px] hover:bg-secondary-fixed-dim transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
            >
              Atur Mode Tampilan
            </button>
          </div>
        </section>
      </div>
      {filtered.length === 0 && (
        <div className="bg-surface rounded-2xl p-space-lg">
          <h2 className="font-section-title text-section-title text-primary">
            Belum ada materi yang cocok
          </h2>
          <p className="font-body text-body text-text-secondary">
            Coba filter lain, lihat antrean, atau tambahkan materi sekolahmu.
          </p>
        </div>
      )}
    </div>
  );
}

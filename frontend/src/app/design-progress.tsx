"use client";
import { useState } from "react";
import Image from "next/image";
import type {
  LearningSession,
  Material,
  Mode,
  Progress,
  Recommendation,
} from "@/lib/types";
export function ProgressDesign({
  materials,
  sessions,
  selected,
  onSelect,
  progress,
  rec,
  error,
  start,
  onRefresh,
  onPlan,
  onSettings,
  onBack,
  displayName,
  timezone,
}: {
  materials: Material[];
  sessions: LearningSession[];
  selected: string;
  onSelect: (id: string) => void;
  progress: Progress | null;
  rec: Recommendation | null;
  error: string;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
  onRefresh: () => void;
  onPlan: () => void;
  onSettings: () => void;
  onBack: () => void;
  displayName: string;
  timezone: string;
}) {
  const material = materials.find((m) => m.id === selected),
    total = progress?.concepts.reduce((n, c) => n + c.observed.total, 0) || 0,
    correct =
      progress?.concepts.reduce((n, c) => n + c.observed.correct, 0) || 0,
    completed = new Set(
      sessions
        .filter((s) => s.material_id === selected)
        .flatMap((s) => s.completed_concepts),
    );
  const dateKey = (date: Date) =>
    date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone,
    });
  const [now] = useState(() => Date.now());
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 86400000),
      key = dateKey(date);
    return {
      key,
      label: date.toLocaleDateString("id-ID", {
        weekday: "short",
        timeZone: timezone,
      }),
      count: sessions.filter(
        (s) =>
          s.material_id === selected && dateKey(new Date(s.updated_at)) === key,
      ).length,
    };
  });
  return (
    <div className="stitch-screen">
      <div className="flex flex-col w-full pb-space-xxl">
        <section className="flex flex-col gap-space-sm mb-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-space-xs text-text-secondary font-metadata text-metadata"
            >
              <button
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded px-1"
                onClick={onBack}
              >
                Beranda
              </button>
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
              <span aria-current="page" className="font-label text-primary">
                Progres Belajar
              </span>
            </nav>
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-container/60 text-primary">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-metadata text-[13px] font-medium">{`${displayName} • Belajar sesuai ritmemu`}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-xs">
            <div className="max-w-3xl">
              <span className="font-metadata uppercase tracking-wider text-[12px] text-text-secondary font-bold">
                Laporan Pertumbuhan Pribadi
              </span>
              <h1 className="font-page-title text-page-title text-primary tracking-tight mt-1">
                Setiap Langkah Kecilmu Punya Cerita
              </h1>
              <p className="font-body text-body text-text-secondary mt-1">
                Lihat bagaimana pemahamanmu bertumbuh secara bertahap tanpa
                perlu dibandingkan dengan orang lain. Belajar santai dengan
                ritme nyaman, hasil nyata.
              </p>
            </div>

            <div
              aria-label="Filter Rentang Waktu"
              className="flex flex-wrap items-center gap-space-xs"
              role="group"
            ></div>
          </div>
        </section>

        <section
          aria-label="Ringkasan Kebiasaan Belajar"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl"
        >
          <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <p className="font-label text-label text-text-secondary">
              Sesi selesai
            </p>
            <p className="font-display text-page-title text-primary my-space-sm">
              {
                sessions.filter(
                  (s) => s.material_id === selected && s.status === "completed",
                ).length
              }
            </p>
            <p className="font-metadata text-metadata text-text-secondary">
              Untuk materi yang dipilih
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <p className="font-label text-label text-text-secondary">
              Konsep pernah dibaca
            </p>
            <p className="font-display text-page-title text-primary my-space-sm">
              {completed.size}
            </p>
            <p className="font-metadata text-metadata text-text-secondary">
              Untuk materi yang dipilih
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <p className="font-label text-label text-text-secondary">
              Jawaban tercatat
            </p>
            <p className="font-display text-page-title text-primary my-space-sm">
              {total}
            </p>
            <p className="font-metadata text-metadata text-text-secondary">
              Untuk materi yang dipilih
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <p className="font-label text-label text-text-secondary">
              Jawaban tepat
            </p>
            <p className="font-display text-page-title text-primary my-space-sm">
              {correct}
            </p>
            <p className="font-metadata text-metadata text-text-secondary">
              Untuk materi yang dipilih
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
          <section
            aria-labelledby="heading-concept-mastery"
            className="lg:col-span-8 flex flex-col gap-space-md bg-surface rounded-2xl p-space-lg shadow-sm"
          >
            <div>
              <span className="font-label text-label text-secondary">
                Pemahaman dari latihanmu
              </span>
              <h2
                id="heading-concept-mastery"
                className="font-section-title text-section-title text-primary mt-space-xs"
              >
                Peta Pemahaman Materi Aktif
              </h2>
              <label className="block font-label text-label text-primary mt-space-md">
                Materi
                <select
                  value={selected}
                  onChange={(e) => onSelect(e.target.value)}
                  className="block w-full rounded-xl p-space-sm bg-surface-container-low mt-space-xs"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error && <p role="alert">{error}</p>}
            {!selected ? (
              <p className="font-body text-body text-text-secondary">
                Tambahkan materi untuk melihat progres.
              </p>
            ) : !progress ? (
              <p role="status">Memuat progres...</p>
            ) : (
              progress.concepts.map((c) => (
                <article
                  key={c.id}
                  className="p-space-md rounded-xl bg-surface-container-low"
                >
                  <div className="flex flex-wrap justify-between gap-space-sm">
                    <h3 className="font-card-title text-card-title text-primary">
                      {c.title}
                    </h3>
                    <span className="font-label text-label text-secondary">
                      {c.observed.correct}/{c.observed.total} jawaban tepat
                    </span>
                  </div>
                  {c.mastery === null ? (
                    <p className="font-body text-body text-text-secondary mt-space-sm">
                      Estimasi penguasaan belum tersedia. Diperlukan skill yang
                      didukung model dan sedikitnya tiga jawaban.
                    </p>
                  ) : (
                    <div className="mt-space-sm">
                      <progress
                        className="w-full accent-primary"
                        max={1}
                        value={c.mastery}
                        aria-label={"Estimasi penguasaan " + c.title}
                      />
                      <p className="font-metadata text-metadata text-text-secondary">
                        Estimasi model: {Math.round(c.mastery * 100)}%
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => material && start(material, undefined, c.id)}
                    className="h-10 px-space-md rounded-xl bg-surface text-primary font-label text-label mt-space-sm"
                  >
                    Tinjau rangkuman
                  </button>
                </article>
              ))
            )}
            <p className="font-metadata text-metadata text-text-secondary">
              Jawaban tepat adalah hasil yang diamati. Estimasi BKT
              eksperimental saat ini hanya mendukung skill Pythagoras.
            </p>
            <button
              onClick={onRefresh}
              className="h-10 px-space-md rounded-xl bg-surface-container text-primary font-label text-label"
            >
              Perbarui progres
            </button>
          </section>

          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <section
              aria-labelledby="heading-rhythm"
              className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
            >
              <h2
                id="heading-rhythm"
                className="font-section-title text-section-title text-primary"
              >
                Aktivitas 7 Hari Terakhir
              </h2>
              <p className="font-metadata text-metadata text-text-secondary">
                Jumlah sesi berdasarkan tanggal pembaruan terakhir, bukan durasi
                belajar.
              </p>
              <div className="grid grid-cols-7 gap-space-xs items-end h-40">
                {days.map((d) => (
                  <div
                    key={d.key}
                    className="flex flex-col items-center gap-space-xs"
                  >
                    <span className="font-label text-label text-primary">
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-secondary-container"
                      style={{
                        height: Math.max(
                          4,
                          (d.count / Math.max(1, ...days.map((x) => x.count))) *
                            80,
                        ),
                      }}
                    />
                    <span className="font-metadata text-[11px] text-text-secondary">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="heading-mood"
              className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm"
            >
              <h2
                id="heading-mood"
                className="font-card-title text-card-title text-primary"
              >
                Ruang untuk Ritmemu
              </h2>
              <p className="font-body text-body text-text-secondary">
                Perasaanmu tak harus diukur dengan angka. Ambil jeda saat butuh;
                tidak ada streak yang harus dijaga.
              </p>
              <p className="font-metadata text-metadata text-secondary">
                Setiap langkah kecil tetap berarti.
              </p>
            </section>
          </div>
        </div>

        <section
          aria-labelledby="heading-mimo-feedback"
          className="w-full bg-secondary-container rounded-2xl p-space-lg md:p-space-xl shadow-sm mb-space-xl relative overflow-hidden"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/20 pointer-events-none blur-2xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-space-lg relative z-10">
            <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden bg-surface shadow-sm p-2 flex items-center justify-center">
              <Image
                src="/design/mimo.png"
                alt="Mimo, teman belajarmu"
                width={1024}
                height={1024}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col gap-space-sm flex-1">
              <div className="flex items-center gap-space-xs">
                <span className="px-2.5 py-1 rounded-full bg-surface text-primary font-label text-[12px] font-bold flex items-center gap-1 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px] text-secondary"
                    aria-hidden="true"
                  >
                    forum
                  </span>
                  Catatan Mimo Hari Ini
                </span>
                <span className="font-metadata text-[12px] text-on-secondary-container">{`${displayName} • Belajar sesuai ritmemu`}</span>
              </div>
              <blockquote className="font-mimo-voice text-mimo-voice text-primary leading-relaxed">{`${displayName} • Belajar sesuai ritmemu`}</blockquote>
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <button
                  className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  onClick={onBack}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    calendar_today
                  </span>
                  <span>Buka Rencana Belajar Hari Ini</span>
                </button>
                <button
                  className="inline-flex items-center gap-space-xs h-10 px-space-md rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
                  type="button"
                  onClick={() => window.print()}
                >
                  {"Cetak ringkasan progres"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="heading-next-targets"
          className="bg-surface rounded-2xl p-space-lg shadow-sm mb-space-xl"
        >
          <h2
            id="heading-next-targets"
            className="font-section-title text-section-title text-primary"
          >
            Target Belajar Berikutnya
          </h2>
          {rec && material ? (
            <div className="p-space-lg rounded-2xl bg-secondary-container">
              <h3 className="font-card-title text-card-title text-primary">
                {rec.title ||
                  material.concepts.find((c) => c.id === rec.concept_id)?.title}
              </h3>
              <p className="font-body text-body text-text-secondary mt-space-sm">
                {rec.reason}
              </p>
              <div className="flex flex-wrap gap-space-sm mt-space-md">
                <button
                  onClick={() => start(material, undefined, rec.concept_id)}
                  className="h-11 px-space-md rounded-xl bg-primary text-on-primary font-label text-label"
                >
                  Buka konsep penguatan
                </button>
                <button
                  onClick={onPlan}
                  className="h-11 px-space-md rounded-xl bg-surface text-primary font-label text-label"
                >
                  Lihat rencana belajar
                </button>
              </div>
            </div>
          ) : (
            <p className="font-body text-body text-text-secondary">
              Pilih materi untuk melihat saran belajar.
            </p>
          )}
        </section>

        <section
          aria-label="Aksi Halaman"
          className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm"
        >
          <div className="flex items-center gap-space-md w-full sm:w-auto">
            <button
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-focus"
              onClick={onBack}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                arrow_back
              </span>
              <span>Kembali ke Rencana Belajar</span>
            </button>
            <button
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface text-text-secondary hover:text-primary font-label text-label transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
              type="button"
              onClick={onSettings}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                tune
              </span>
              <span>Pengaturan Aksesibilitas</span>
            </button>
          </div>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm h-12 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-focus"
            onClick={onBack}
          >
            <span>Lanjut Belajar Modul Penguatan (5 Menit)</span>
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}

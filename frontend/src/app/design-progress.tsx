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
  start: (
    m: Material,
    mode?: Mode,
    conceptId?: string,
    practice?: boolean,
  ) => void;
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
    <>
      <div className="final-design final-screen-22 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg space-y-space-xl ui-container">
            <section className="flex flex-col gap-space-md">
              <nav
                aria-label="Jejak Navigasi"
                className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant flex-wrap"
              >
                <a
                  className="hover:text-primary transition-colors"
                  data-path="beranda"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Beranda
                </a>
                <span className="text-outline-variant">•</span>
                <span className="text-primary font-semibold">
                  Progres Belajar
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant">
                  Perkembangan Pemahaman Konsep
                </span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
                <div className="max-w-2xl space-y-space-xs">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-mint-tint text-success font-label text-[12px] uppercase tracking-wider font-bold">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    Pelacak Adaptif TemanBelajar
                  </div>
                  <h1 className="font-page-title text-page-title text-primary tracking-tight ui-page-title">{`Progres Belajarmu, ${displayName}`}</h1>
                  <p className="font-reading text-reading text-on-surface-variant">
                    Lihat seberapa jauh pemahamanmu berkembang, rayakan
                    pencapaian kecil, dan temukan topik yang asyik untuk diulang
                    santai.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm">
                  <span className="px-3 py-2 rounded-xl bg-mint-tint text-sm">
                    Pemahaman: seluruh riwayat
                  </span>
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="px-3 py-2 rounded-xl bg-surface"
                  >
                    Perbarui progres
                  </button>

                  <div className="flex items-center gap-space-xs">
                    <button
                      aria-label="Ekspor Rapor Mandiri PDF"
                      className="flex items-center gap-space-xs px-space-md py-2.5 bg-surface hover:bg-canvas rounded-xl text-primary font-label text-label shadow-sm min-h-[44px] transition-colors"
                      type="button"
                      onClick={() => window.print()}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        download
                      </span>
                      <span>Rapor Mandiri</span>
                    </button>
                    <button
                      aria-label="Atur Target Belajar"
                      className="flex items-center gap-space-xs px-space-md py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary rounded-xl font-label text-label min-h-[44px] transition-colors shadow-sm"
                      type="button"
                      onClick={onPlan}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        tune
                      </span>
                      <span>Atur Target</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative bg-surface rounded-[24px] p-space-md md:p-space-lg lg:p-space-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-space-lg">
                <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0 flex items-center justify-center">
                  <Image
                    alt=""
                    className="w-full h-full object-contain select-none object-contain"
                    src="/design/mimo-final.png"
                    width={1408}
                    height={1120}
                  ></Image>
                </div>

                <div className="flex-1 flex flex-col gap-space-sm w-full">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <div className="inline-flex items-center gap-space-xs px-space-sm py-1 bg-lavender-tint text-primary font-label text-label rounded-full">
                      <span
                        className="material-symbols-outlined text-[16px] text-tertiary"
                        aria-hidden="true"
                      >
                        record_voice_over
                      </span>
                      <span className="font-bold">Mimo berkata:</span>
                    </div>
                    <div className="flex items-center gap-space-xs text-metadata font-metadata text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      <span>{`${displayName}, setiap langkahmu berarti. Progres mengikuti aktivitas yang tersimpan.`}</span>
                      <span className="text-outline-variant">•</span>
                      <span>Ritme: Seimbang Tanpa Beban</span>
                    </div>
                  </div>
                  <div className="bg-lavender-tint rounded-[20px] p-space-md md:p-space-lg">
                    <p className="font-mimo-voice text-mimo-voice text-primary leading-relaxed">
                      {rec?.reason ||
                        "Pilih satu konsep yang ingin dipelajari. Hasil belajar akan muncul setelah aktivitas tersimpan."}
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm text-metadata font-metadata text-on-surface-variant pt-space-xs">
                    <span
                      className="material-symbols-outlined text-[16px] text-success"
                      aria-hidden="true"
                    >
                      psychology_alt
                    </span>
                    <span>
                      Didukung Analisis Pelacak Pengetahuan Bayesian (BKT) yang
                      menghargai proses belajarmu.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                [
                  "Sesi selesai",
                  sessions.filter(
                    (s) =>
                      s.material_id === selected && s.status === "completed",
                  ).length,
                ],
                ["Konsep dibaca", completed.size],
                ["Jawaban tersimpan", total],
                ["Jawaban tepat", correct],
              ].map(([label, count]) => (
                <div
                  key={label}
                  className="bg-surface rounded-2xl p-6 border border-divider"
                >
                  <h2 className="text-sm font-bold ui-section-title">
                    {label}
                  </h2>
                  <p className="text-3xl font-display font-bold my-3">
                    {count}
                  </p>
                </div>
              ))}
            </section>

            <section className="bg-surface rounded-[24px] p-space-md md:p-space-lg lg:p-space-xl shadow-sm flex flex-col gap-space-lg">
              <h2 className="font-section-title text-section-title text-primary tracking-tight ui-section-title">
                Rincian Penguasaan Tiap Konsep
              </h2>
              <label className="block mt-4">
                Materi
                <select
                  aria-label="Materi progres"
                  value={selected}
                  onChange={(e) => onSelect(e.target.value)}
                  className="block w-full mt-2"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
              {error && (
                <p role="alert" className="text-error">
                  {error}
                </p>
              )}
              {!progress ? (
                <p className="py-8">
                  {error ? "Progres belum dapat dimuat." : "Memuat progres…"}
                </p>
              ) : (
                progress.concepts.map((c) => (
                  <article
                    key={c.id}
                    className="bg-canvas border border-divider rounded-2xl p-5 mt-4"
                  >
                    <h3 className="font-bold text-lg ui-card-title">
                      {c.title}
                    </h3>
                    <p className="text-sm my-3">
                      {c.observed.correct}/{c.observed.total} jawaban tepat
                    </p>
                    {c.mastery === null ? (
                      <p className="text-sm">
                        Estimasi penguasaan belum tersedia. Diperlukan skill
                        yang didukung model dan sedikitnya tiga jawaban.
                      </p>
                    ) : (
                      <>
                        <progress
                          value={c.mastery}
                          max={1}
                          aria-label={"Estimasi penguasaan " + c.title}
                        />
                        <p className="text-sm">
                          Estimasi model: {Math.round(c.mastery * 100)}%
                        </p>
                      </>
                    )}
                    <button
                      onClick={() =>
                        material && start(material, undefined, c.id)
                      }
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-xl"
                    >
                      Tinjau konsep
                    </button>
                  </article>
                ))
              )}
            </section>

            <section className="bg-surface rounded-[24px] p-space-md md:p-space-lg lg:p-space-xl shadow-sm flex flex-col gap-space-lg">
              <h2 className="font-bold text-xl ui-section-title">
                Ritme Belajar
              </h2>
              <p className="text-sm my-3">
                Jumlah sesi berdasarkan pembaruan terakhir dalam 7 hari terakhir
                ({timezone}).
              </p>
              <div className="grid grid-cols-7 gap-3">
                {days.map((d) => (
                  <div
                    key={d.key}
                    className="text-center bg-mint-tint rounded-xl py-4"
                  >
                    <b>{d.count}</b>
                    <p className="text-sm">{d.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-space-md pb-space-lg">
              <h2 className="font-bold text-xl ui-section-title">
                Rekomendasi Langkah Berikutnya
              </h2>
              <div className="bg-mint-tint rounded-2xl p-6">
                <p>
                  {rec?.reason ||
                    "Mulai satu konsep pendek untuk membangun riwayat belajar."}
                </p>
                {rec && (
                  <button
                    className="mt-4 bg-primary text-white px-5 py-3 rounded-xl"
                    onClick={() =>
                      rec.action === "RESCHEDULE"
                        ? onPlan()
                        : material &&
                          start(
                            material,
                            undefined,
                            rec.concept_id,
                            rec.action === "PRACTICE",
                          )
                    }
                  >
                    Ikuti saran belajar
                  </button>
                )}
                <button onClick={onPlan} className="block mt-4">
                  Lihat rencana belajar →
                </button>
                <button onClick={onSettings} className="block mt-3">
                  Aksesibilitas
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

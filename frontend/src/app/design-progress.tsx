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
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        <button onClick={onBack}>Kembali ke beranda</button>
        <div className="flex flex-col w-full gap-space-xl">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-label">
                  SMP Kelas 8 • Semester Ganjil
                </span>
                <span className="text-xs text-text-secondary font-metadata flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  Data terkalibrasi aman
                </span>
              </div>
              <h1 className="text-page-title text-primary font-section-title tracking-tight flex items-center gap-2">{`Progres Belajar ${displayName} 🌿`}</h1>
              <p className="text-text-secondary text-reading text-sm sm:text-base leading-relaxed">
                Perkembangan belajarmu dihitung dari pemahaman nyata tanpa
                peringkat angka yang bikin cemas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                className="inline-flex items-center gap-2 min-h-[44px] px-space-md py-2.5 rounded-xl bg-surface shadow-sm hover:shadow text-primary font-label text-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus"
                type="button"
                onClick={onRefresh}
              >
                {"Perbarui progres"}
              </button>
              <button
                className="inline-flex items-center gap-2 min-h-[44px] px-space-md py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label text-sm transition-all focus:outline-none focus:ring-2 focus:ring-focus shadow-sm"
                type="button"
                onClick={() => window.print()}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-primary"
                  aria-hidden="true"
                >
                  download
                </span>
                <span>Unduh Rangkuman</span>
              </button>
            </div>
          </header>

          <section
            aria-label="Ringkasan Statistik Pekan Ini"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
          >
            {[
              [
                "Sesi selesai",
                sessions.filter(
                  (s) => s.material_id === selected && s.status === "completed",
                ).length,
              ],
              ["Konsep dibaca", completed.size],
              ["Jawaban tercatat", total],
              ["Jawaban tepat", correct],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="p-5 bg-surface rounded-2xl shadow-card"
              >
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-3xl font-bold text-primary mt-3">{value}</p>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <section
              aria-labelledby="bkt-title"
              className="lg:col-span-8 flex flex-col gap-space-md"
            >
              <h2 className="font-bold text-lg text-primary">
                Pemahaman per konsep
              </h2>
              <label className="block">
                Materi
                <select
                  value={selected}
                  onChange={(e) => onSelect(e.target.value)}
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
              {error && <p role="alert">{error}</p>}
              {!selected ? (
                <p>
                  Belum ada materi. Mulai dari materi contoh atau unggah
                  sumbermu.
                </p>
              ) : !progress ? (
                <p role="status">Memuat progres...</p>
              ) : (
                progress.concepts.map((c) => (
                  <article
                    key={c.id}
                    className="p-6 bg-surface rounded-2xl shadow-card"
                  >
                    <h3 className="text-lg font-bold">{c.title}</h3>
                    <p className="text-sm mt-3">
                      {c.observed.correct}/{c.observed.total} jawaban tepat
                    </p>
                    {c.mastery === null ? (
                      <p className="text-sm text-text-secondary">
                        Estimasi penguasaan belum tersedia. Diperlukan skill
                        yang didukung model dan sedikitnya tiga jawaban.
                      </p>
                    ) : (
                      <>
                        <progress
                          max={1}
                          value={c.mastery}
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
                      className="min-h-[44px] px-4 rounded-xl bg-primary text-surface mt-4"
                    >
                      Tinjau konsep
                    </button>
                  </article>
                ))
              )}
              <div className="p-6 rounded-2xl bg-surface">
                <h3 className="font-bold">Aktivitas 7 hari terakhir</h3>
                <p className="text-xs text-text-secondary">
                  Sesi berdasarkan tanggal pembaruan terakhir.
                </p>
                <div className="grid grid-cols-7 gap-2 mt-4">
                  {days.map((d) => (
                    <div key={d.key} className="text-center">
                      <b>{d.count}</b>
                      <p className="text-xs">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside
              aria-label="Rekomendasi & Pendamping Mimo"
              className="lg:col-span-4 flex flex-col gap-space-md"
            >
              <div className="p-6 rounded-2xl bg-mint shadow-card">
                <Image
                  src="/design/mimo-9.png"
                  alt="Mimo menyemangati belajarmu"
                  width={200}
                  height={200}
                  className="w-32 h-32 object-contain mx-auto"
                />
                <h3 className="font-display font-bold text-lg text-primary mt-4">
                  Setiap langkahmu berarti
                </h3>
                <p className="text-sm mt-3">
                  Jawaban tepat adalah hasil pengamatan. Estimasi BKT
                  eksperimental saat ini hanya mendukung Pythagoras.
                </p>
                {rec && (
                  <>
                    <p className="text-sm mt-4">{rec.reason}</p>
                    <button
                      onClick={() =>
                        material && start(material, undefined, rec.concept_id)
                      }
                      className="min-h-[44px] px-4 rounded-xl bg-primary text-surface mt-4"
                    >
                      Ikuti saran belajar
                    </button>
                  </>
                )}
                <button
                  onClick={onPlan}
                  className="min-h-[44px] px-4 rounded-xl bg-surface mt-3"
                >
                  Lihat rencana belajar
                </button>
                <button
                  onClick={onSettings}
                  className="min-h-[44px] px-4 rounded-xl bg-surface mt-3"
                >
                  Aksesibilitas
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

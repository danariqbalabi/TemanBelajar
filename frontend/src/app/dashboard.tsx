"use client";
import { useState } from "react";
import { MimoMascot } from "./mimo-mascot";
import type {
  LearningSession,
  Material,
  Mode,
  Plan,
  Profile,
  Recommendation,
  Preferences,
} from "@/lib/types";
export function Dashboard({
  profile,
  materials,
  sessions,
  plans,
  recommendation,
  start,
  navigate,
  onPreferences,
}: {
  profile: Profile;
  materials: Material[];
  sessions: LearningSession[];
  plans: Plan[];
  recommendation: Recommendation | null;
  start: (
    m: Material,
    mode?: Mode,
    conceptId?: string,
    practice?: boolean,
  ) => void;
  navigate: (p: string) => void;
  onPreferences?: (p: Partial<Preferences>) => void;
}) {
  const [showMimo, setShowMimo] = useState(true);
  const material =
      materials.find((m) => m.id === recommendation?.material_id) ||
      materials[0],
    concept = material?.concepts.find(
      (c) => c.id === recommendation?.concept_id,
    );
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: profile.timezone,
  });
  const day = (d: string) =>
    new Date(d).toLocaleDateString("en-CA", { timeZone: profile.timezone });
  const activities = plans
    .flatMap((p) => p.activities)
    .filter(
      (a) =>
        day(a.start_at) === day(new Date().toISOString()) &&
        a.status !== "skipped",
    )
    .sort((a, b) => a.start_at.localeCompare(b.start_at));
  const completed = (id: string) =>
    new Set(
      sessions
        .filter((s) => s.material_id === id)
        .flatMap((s) => s.completed_concepts),
    ).size;
  return (
    <>
      <div className="final-design final-screen-7 w-full bg-canvas flex-1 screen-page">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet xl:px-margin pb-space-xl flex flex-col gap-space-xl ui-container">
            <section
              aria-labelledby="beranda-greeting"
              className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
            >
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter-tint text-primary font-label text-[13px] tracking-wide shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Target {profile.daily_minutes} menit per hari
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mint-tint text-success font-label text-[12px]">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      aria-hidden="true"
                    >
                      spa
                    </span>
                    Bebas Stres &amp; Zero-Streak Penalty
                  </span>
                </div>
                <h1
                  className="font-display text-page-title-mobile md:text-page-title text-primary tracking-tight mt-1 ui-page-title"
                  id="beranda-greeting"
                >{`Hai, ${profile.display_name}! Siap belajar santai bareng Mimo?`}</h1>
                <p className="font-body text-body text-on-surface-variant leading-relaxed">
                  Satu langkah kecil hari ini tanpa pusing. Semua jadwal dan
                  materi sudah disesuaikan dengan kenyamanan matamu.
                </p>
              </div>

              <div className="flex items-center gap-space-sm bg-surface p-2 rounded-xl shadow-sm self-start md:self-auto">
                <button
                  type="button"
                  className="dashboard-ruler flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  aria-pressed={profile.preferences.reading_ruler}
                  aria-label="Penggaris baca"
                  onClick={() =>
                    onPreferences?.({
                      reading_ruler: !profile.preferences.reading_ruler,
                    })
                  }
                  disabled={!onPreferences}
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    visibility
                  </span>
                  <span className="font-label text-metadata">
                    Penggaris baca:{" "}
                    {profile.preferences.reading_ruler ? "Aktif" : "Nonaktif"}
                  </span>
                </button>
                <button
                  aria-label="Sesuaikan tampilan fokus"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                  type="button"
                  onClick={() => navigate("Pengaturan")}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                </button>
              </div>
            </section>

            <div
              className="hidden flex items-center justify-between gap-space-md p-space-md rounded-xl bg-peach-tint text-primary transition-all duration-300"
              id="reschedule-banner"
            >
              <div className="flex items-center gap-space-sm">
                <span
                  className="material-symbols-outlined text-[24px] text-secondary"
                  aria-hidden="true"
                >
                  hotel_class
                </span>
                <div>
                  <p className="font-label text-label font-bold text-primary">
                    Jadwal dialihkan ke besok tanpa pengurangan skor!
                  </p>
                  <p className="font-body text-metadata text-on-surface-variant">
                    Istirahat itu bagian penting dari daya ingat otakmu. Tarik
                    napas dalam-dalam, ya.
                  </p>
                </div>
              </div>
              <button
                className="px-space-md py-1.5 rounded-lg bg-surface text-primary font-label text-label hover:bg-surface-container transition-colors shadow-sm"
                type="button"
                onClick={() => setShowMimo(false)}
              >
                Tutup
              </button>
            </div>

            <section
              aria-label="Rekomendasi Belajar Utama Hari Ini"
              className="dashboard-feature w-full relative overflow-hidden rounded-[24px] text-primary"
            >
              <div className="dashboard-feature-layout">
                <div className="flex flex-col gap-2.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="dashboard-topic">
                      {material?.subject || "Materi"}
                    </span>
                    <span className="font-label text-primary">
                      Saran belajar hari ini
                    </span>
                  </div>
                  <h2 className="ui-section-title text-primary">
                    {recommendation?.title ||
                      concept?.title ||
                      material?.title ||
                      "Mulai dari materi contoh"}
                  </h2>
                  <p className="dashboard-feature-reason">
                    {recommendation?.reason ||
                      "Pilih satu konsep pendek untuk mulai belajar."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      className="inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md"
                      data-path="mulai-belajar"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (recommendation?.action === "RESCHEDULE")
                          navigate("Rencana Belajar");
                        else if (material)
                          start(
                            material,
                            undefined,
                            concept?.id,
                            recommendation?.action === "PRACTICE",
                          );
                      }}
                    >
                      <span>
                        {recommendation?.action === "RESCHEDULE"
                          ? "Atur jadwal"
                          : `${recommendation?.action === "PRACTICE" ? "Mulai latihan" : "Mulai belajar"} · ${recommendation?.estimated_minutes || concept?.estimated_minutes || profile.daily_minutes} menit`}
                      </span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </a>
                    <button
                      className="inline-flex items-center gap-1 px-space-md py-3 rounded-xl text-primary hover:bg-surface/50 font-label text-label transition-colors"
                      type="button"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      <span>Lihat jadwal</span>
                    </button>
                  </div>
                </div>
                {showMimo && profile.preferences.show_mimo && (
                  <div className="dashboard-feature-mimo relative">
                    <div
                      aria-hidden="true"
                      className="absolute top-0 inset-x-0 aspect-square rounded-full bg-surface/60 pointer-events-none ring-4 ring-secondary-fixed/50"
                    ></div>
                    <MimoMascot
                      context="Beranda"
                      reducedMotion={profile.preferences.reduced_motion}
                      onMotionSettings={() => navigate("Pengaturan")}
                    />
                  </div>
                )}
              </div>
            </section>

            <div className="dashboard-columns grid grid-cols-1 gap-space-lg items-start">
              <div className="min-w-0 flex flex-col gap-space-xl">
                <section
                  aria-labelledby="schedule-heading"
                  className="bg-surface rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm text-text-secondary">{date}</p>
                      <h2
                        className="font-section-title text-section-title text-primary ui-section-title"
                        id="schedule-heading"
                      >
                        Linimasa Belajar Hari Ini
                      </h2>
                    </div>
                    <button
                      className="px-4 py-2 border border-divider rounded-xl"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      Ubah jadwal
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activities.length ? (
                      activities.map((a) => (
                        <article
                          key={a.id}
                          className="flex items-center gap-4 p-4 bg-canvas rounded-xl border border-divider"
                        >
                          <span className="font-bold tabular-nums">
                            {new Date(a.start_at).toLocaleTimeString("id-ID", {
                              timeZone: profile.timezone,
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-bold ui-card-title">
                              {a.title}
                            </h3>
                            <p className="text-sm">
                              {a.duration_minutes} menit ·{" "}
                              {a.status === "completed"
                                ? "Selesai"
                                : "Terjadwal"}
                            </p>
                          </div>
                          <button
                            className="bg-primary text-white px-4 py-2 rounded-xl"
                            onClick={() => {
                              const selected = materials.find(
                                (m) => m.id === a.material_id,
                              );
                              if (selected)
                                start(
                                  selected,
                                  undefined,
                                  a.concept_id || undefined,
                                );
                            }}
                          >
                            Buka
                          </button>
                        </article>
                      ))
                    ) : (
                      <p className="py-6">
                        Belum ada jadwal hari ini. Kamu tetap bisa mulai dari
                        materi yang tersedia.
                      </p>
                    )}
                  </div>
                </section>

                <section
                  aria-labelledby="ongoing-materials"
                  className="flex flex-col gap-space-md"
                >
                  <h2
                    className="font-section-title text-section-title text-primary ui-section-title"
                    id="ongoing-materials"
                  >
                    Materi belajar
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {materials.slice(0, 2).map((m) => (
                      <article
                        key={m.id}
                        className="bg-surface border border-divider rounded-2xl p-6"
                      >
                        <p className="text-sm text-text-secondary">
                          {m.subject} ·{" "}
                          {m.is_demo ? "Materi contoh" : "Materi kamu"}
                        </p>
                        <h3 className="font-bold text-xl my-3 ui-card-title">
                          {m.title}
                        </h3>
                        <p>
                          {completed(m.id)} / {m.concepts.length} konsep dibaca
                        </p>
                        <button
                          className="mt-4 rounded-xl px-4 py-2 bg-primary text-white"
                          onClick={() => start(m)}
                        >
                          {sessions.some(
                            (session) =>
                              session.material_id === m.id &&
                              session.status !== "completed",
                          )
                            ? "Lanjut belajar"
                            : "Mulai belajar"}
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                <section
                  aria-labelledby="dashboard-rest-title"
                  className="dashboard-rest"
                >
                  <span
                    className="dashboard-rest-icon material-symbols-outlined"
                    aria-hidden="true"
                  >
                    spa
                  </span>
                  <div className="dashboard-rest-copy">
                    <h3 id="dashboard-rest-title" className="ui-card-title">
                      Butuh jeda?
                    </h3>
                    <p>
                      Kamu bisa ubah jadwal. Progres yang sudah tersimpan tetap
                      ada.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      Buka rencana belajar <span aria-hidden="true">?</span>
                    </button>
                  </div>
                </section>
              </div>

              <aside
                aria-label="Panel Utilitas dan Status Siswa"
                className="min-w-0 flex flex-col gap-space-lg"
              >
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg ui-section-title">
                      Preferensi Belajar
                    </h2>
                    <button onClick={() => navigate("Pengaturan")}>Ubah</button>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <dt>Durasi nyaman</dt>
                      <dd>{profile.daily_minutes} menit</dd>
                    </div>
                    <div>
                      <dt>Hari aktif</dt>
                      <dd>{profile.available_days.length} hari / pekan</dd>
                    </div>
                  </dl>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg ui-section-title">
                    Agenda Terdekat
                  </h2>
                  <p className="mt-3">
                    {profile.goal || "Belajar pelan-pelan sesuai ritmemu"}
                  </p>
                  <p>
                    {profile.exam_date
                      ? `Target: ${profile.exam_date}`
                      : "Belum ada tanggal ujian"}
                  </p>
                  <button
                    className="mt-4"
                    onClick={() => navigate("Rencana Belajar")}
                  >
                    Buka rencana belajar →
                  </button>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg ui-section-title">
                    Progres Belajar
                  </h2>
                  <p className="mt-3">
                    {sessions.filter((s) => s.status === "completed").length}{" "}
                    sesi selesai
                  </p>
                  <p className="text-sm mt-2">
                    Estimasi penguasaan dan dasar rekomendasi bisa kamu lihat di
                    halaman progres.
                  </p>
                  <button className="mt-4" onClick={() => navigate("Progres")}>
                    Lihat progres →
                  </button>
                </section>
                <section className="bg-surface rounded-2xl p-6 border border-divider">
                  <h2 className="font-bold text-lg ui-section-title">
                    Eksplorasi Gaya Belajar
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {(
                      [
                        ["reading", "Teman Baca"],
                        ["focus", "Selangkah demi Selangkah"],
                        ["explore", "Dengar & Jelajah"],
                        ["transcript", "Visual & Teks"],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        className="bg-mint-tint rounded-xl p-3 text-sm"
                        onClick={() => material && start(material, mode)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

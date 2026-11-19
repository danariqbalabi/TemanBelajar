"use client";
import { UiIcon } from "./workspace-ui";
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
  onDemoTour,
  busy = false,
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
  onDemoTour?: () => void;
  busy?: boolean;
}) {
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
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-tablet xl:px-margin pb-6 flex flex-col gap-4 ui-container">
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

              <div className="flex flex-wrap items-center gap-space-sm bg-surface p-2 rounded-xl shadow-sm self-start md:self-auto">
                {onDemoTour && (
                  <button
                    type="button"
                    className="min-h-11 px-3 rounded-lg bg-butter-tint text-primary font-label"
                    onClick={onDemoTour}
                  >
                    Mulai tur Mimo
                  </button>
                )}
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
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label text-label hover:bg-primary-hover active:bg-primary-pressed transition-all shadow-md"
                      data-path="mulai-belajar"
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (recommendation?.action === "RESCHEDULE")
                          navigate("Rencana Belajar");
                        else if (material)
                          start(
                            material,
                            undefined,
                            concept?.id,
                            recommendation?.action === "PRACTICE",
                          );
                        else navigate("Materi Saya");
                      }}
                    >
                      <span>
                        {recommendation?.action === "RESCHEDULE"
                          ? "Atur jadwal"
                          : !material
                            ? "Buka Materi Saya"
                            : `${recommendation?.action === "PRACTICE" ? "Mulai latihan" : "Mulai belajar"} · ${recommendation?.estimated_minutes || concept?.estimated_minutes || profile.daily_minutes} menit`}
                      </span>
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
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
                {profile.preferences.show_mimo && (
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

            <div className="dashboard-columns grid grid-cols-1 gap-4 items-start">
              <div className="min-w-0 flex flex-col gap-4">
                <section
                  aria-labelledby="schedule-heading"
                  className="dashboard-panel dashboard-agenda flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm text-text-secondary">{date}</p>
                      <h2
                        className="font-section-title text-section-title text-primary ui-section-title"
                        id="schedule-heading"
                      >
                        Jadwal hari ini
                      </h2>
                    </div>
                    <button
                      className="px-4 py-2 border border-divider rounded-xl"
                      onClick={() => navigate("Rencana Belajar")}
                    >
                      Ubah jadwal
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activities.length ? (
                      activities.map((a) => (
                        <article
                          key={a.id}
                          className="flex flex-wrap items-center gap-3 p-3 bg-surface rounded-xl border border-divider"
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
                      <p className="dashboard-empty">
                        Belum ada jadwal hari ini. Kamu tetap bisa mulai dari
                        materi yang tersedia.
                      </p>
                    )}
                  </div>
                </section>

                <section
                  aria-labelledby="ongoing-materials"
                  className="flex flex-col gap-2"
                >
                  <h2
                    className="font-section-title text-section-title text-primary ui-section-title"
                    id="ongoing-materials"
                  >
                    Materi belajar
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {materials.slice(0, 2).map((m) => (
                      <article
                        key={m.id}
                        className="dashboard-panel dashboard-book"
                      >
                        <p className="text-sm text-text-secondary">
                          {m.subject} ·{" "}
                          {m.is_demo ? "Materi contoh" : "Materi kamu"}
                        </p>
                        <h3 className="ui-card-title">{m.title}</h3>
                        <p>
                          {completed(m.id)} / {m.concepts.length} konsep dibaca
                        </p>
                        <progress
                          aria-label={`Konsep selesai untuk ${m.title}`}
                          value={completed(m.id)}
                          max={m.concepts.length}
                        />
                        <button
                          className="justify-self-start min-h-11 rounded-xl px-3 py-2 bg-primary text-white"
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
                aria-label="Ringkasan belajar"
                className="min-w-0 flex flex-col gap-3"
              >
                <section className="dashboard-panel dashboard-preferences">
                  <div className="dashboard-panel-heading">
                    <h2 className="ui-card-title">
                      <UiIcon name="tune" /> Ritme belajar
                    </h2>
                    <button
                      className="dashboard-link"
                      onClick={() => navigate("Pengaturan")}
                    >
                      Ubah
                    </button>
                  </div>
                  <dl className="dashboard-stats">
                    <div>
                      <dt>Per hari</dt>
                      <dd>{profile.daily_minutes} menit</dd>
                    </div>
                    <div>
                      <dt>Hari aktif</dt>
                      <dd>{profile.available_days.length} hari</dd>
                    </div>
                  </dl>
                </section>
                {(profile.goal || profile.exam_date) && (
                  <section className="dashboard-panel dashboard-target">
                    <div className="dashboard-panel-heading">
                      <h2 className="ui-card-title">
                        <UiIcon name="flag" /> Target belajar
                      </h2>
                      <button
                        className="dashboard-link"
                        onClick={() => navigate("Rencana Belajar")}
                      >
                        Lihat jadwal
                      </button>
                    </div>
                    {profile.goal && <p>{profile.goal}</p>}
                    {profile.exam_date && (
                      <p className="text-sm">
                        Ujian{" "}
                        <time dateTime={profile.exam_date}>
                          {new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                            timeZone: "UTC",
                          }).format(new Date(profile.exam_date))}
                        </time>
                      </p>
                    )}
                  </section>
                )}
                <section className="dashboard-panel dashboard-progress">
                  <div className="dashboard-panel-heading">
                    <h2 className="ui-card-title">
                      <UiIcon name="insights" /> Progres belajar
                    </h2>
                    <button
                      className="dashboard-link"
                      onClick={() => navigate("Progres")}
                    >
                      Lihat progres
                    </button>
                  </div>
                  <p>
                    <strong>
                      {sessions.filter((s) => s.status === "completed").length}
                    </strong>{" "}
                    sesi selesai
                  </p>
                </section>
                {material && (
                  <section className="dashboard-panel dashboard-formats">
                    <h2 className="ui-card-title">Cara belajar</h2>
                    <div className="dashboard-format-grid">
                      {(
                        [
                          ["reading", "Teman Baca", "menu_book"],
                          [
                            "focus",
                            "Langkah demi langkah",
                            "format_list_numbered",
                          ],
                          ["explore", "Teks & Visual", "image"],
                          ["transcript", "Transkrip & audio", "headphones"],
                        ] as const
                      )
                        .filter(([mode]) =>
                          mode === "explore"
                            ? !!(concept ?? material.concepts[0])
                                ?.diagram_description
                            : mode === "transcript"
                              ? !!(concept ?? material.concepts[0])?.transcript
                              : true,
                        )
                        .map(([mode, label, icon]) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              start(
                                material,
                                mode,
                                (concept ?? material.concepts[0])?.id,
                              )
                            }
                          >
                            <UiIcon name={icon} />
                            {label}
                          </button>
                        ))}
                    </div>
                  </section>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

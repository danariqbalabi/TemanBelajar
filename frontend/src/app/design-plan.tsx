"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { Activity, Material, Plan, Profile, Proposal } from "@/lib/types";
export function PlanDesign({
  plans,
  plan,
  materials,
  profile,
  busy,
  date,
  materialId,
  title,
  duration,
  setDate,
  setMaterialId,
  setTitle,
  setDuration,
  onSelectPlan,
  onSuggest,
  onRecompute,
  onEdit,
  onAddManual,
  onSave,
  onRefresh,
  onReview,
  onOpen,
  onStatus,
  onMaterials,
  onBack,
  editor,
  history,
  hasDraft,
}: {
  plans: Plan[];
  plan: Plan | undefined;
  materials: Material[];
  profile: Profile;
  busy: boolean;
  date: string;
  materialId: string;
  title: string;
  duration: number;
  setDate: (v: string) => void;
  setMaterialId: (v: string) => void;
  setTitle: (v: string) => void;
  setDuration: (v: number) => void;
  onSelectPlan: (id: string) => void;
  onSuggest: () => void;
  onRecompute: () => void;
  onEdit: () => void;
  onAddManual: () => void;
  onSave: () => void;
  onRefresh: () => void;
  onReview: (p: Proposal) => void;
  onOpen: (a: Activity) => void;
  onStatus: (a: Activity, s: Activity["status"]) => void;
  onMaterials: () => void;
  onBack: () => void;
  editor: ReactNode;
  history: ReactNode;
  hasDraft: boolean;
}) {
  const zone = plan?.timezone || profile.timezone;
  const dateKey = (d: string) =>
    new Date(d).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: zone,
    });
  const today = dateKey(new Date().toISOString());
  const [selectedDay, setSelectedDay] = useState(
      plan?.activities[0] ? dateKey(plan.activities[0].start_at) : today,
    ),
    [monthOffset, setMonthOffset] = useState(0),
    [controls, setControls] = useState(!plan);
  const dayActivities = (plan?.activities || [])
    .filter((a) => dateKey(a.start_at) === selectedDay)
    .toSorted((a, b) => a.start_at.localeCompare(b.start_at));
  const tomorrowKey = new Date(
      new Date(selectedDay + "T12:00:00Z").getTime() + 86400000,
    )
      .toISOString()
      .slice(0, 10),
    tomorrowActivities = (plan?.activities || []).filter(
      (a) => dateKey(a.start_at) === tomorrowKey,
    );
  const calendarDate = new Date(selectedDay + "T12:00:00Z");
  calendarDate.setUTCDate(1);
  calendarDate.setUTCMonth(calendarDate.getUTCMonth() + monthOffset);
  const blanks = (calendarDate.getUTCDay() + 6) % 7;
  const last = new Date(
    Date.UTC(calendarDate.getUTCFullYear(), calendarDate.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const calendarDays = [
    ...Array(blanks).fill(null),
    ...Array.from({ length: last }, (_, i) =>
      new Date(
        Date.UTC(
          calendarDate.getUTCFullYear(),
          calendarDate.getUTCMonth(),
          i + 1,
          12,
        ),
      )
        .toISOString()
        .slice(0, 10),
    ),
  ] as (string | null)[];
  const statusNames = {
      pending: "Siap dijalani",
      active: "Sedang berjalan",
      completed: "Selesai",
      skipped: "Dilewati",
    },
    pending = plan?.proposals?.find((p) => p.status === "pending");
  return (
    <div className="stitch-screen stitch-plan">
      {controls && (
        <section className="bg-surface rounded-2xl p-space-lg mb-space-lg">
          <h2 className="font-section-title text-section-title text-primary">
            Sesuaikan Langkah Belajarmu
          </h2>
          {plans.length > 1 && (
            <label className="font-label text-label text-primary">
              Rencana
              <select
                value={plan?.id}
                onChange={(e) => onSelectPlan(e.target.value)}
                className="h-11 px-space-md bg-surface-container-low rounded-xl ml-space-sm"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    Rencana versi {p.version} • {p.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md">
            <label className="flex flex-col gap-space-sm font-label text-label text-primary">
              Materi
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="h-11 px-space-md rounded-xl bg-surface-container-low"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-space-sm font-label text-label text-primary">
              Waktu mulai
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 px-space-md rounded-xl bg-surface-container-low"
              />
            </label>
          </div>
          <p className="font-metadata text-metadata text-text-secondary mt-space-sm">
            Batas harian {plan?.daily_minutes || profile.daily_minutes} menit.
            Zona rencana {zone}; isian waktu mengikuti perangkatmu.
          </p>
          <div className="flex flex-wrap gap-space-sm mt-space-md">
            {!plan ? (
              <button
                disabled={busy || !date || !materialId}
                onClick={onSuggest}
                className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
              >
                Susun usulan awal
              </button>
            ) : (
              <button
                disabled={busy || !date || !materialId}
                onClick={onRecompute}
                className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
              >
                Minta saran dari hasil belajar
              </button>
            )}
            <button
              disabled={busy}
              onClick={onRefresh}
              className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label"
            >
              Perbarui rencana
            </button>
          </div>
          <details className="mt-space-md">
            <summary className="font-label text-label text-primary">
              Tambah kegiatan sendiri
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md">
              <label className="flex flex-col gap-space-sm font-label text-label text-primary">
                Judul kegiatan
                <input
                  value={title}
                  maxLength={160}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 px-space-md rounded-xl bg-surface-container-low"
                />
              </label>
              <label className="flex flex-col gap-space-sm font-label text-label text-primary">
                Durasi (menit)
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                  className="h-11 px-space-md rounded-xl bg-surface-container-low"
                />
              </label>
            </div>
            <button
              disabled={!date || !title.trim()}
              onClick={onAddManual}
              className="h-11 px-space-lg rounded-xl bg-surface-container text-primary font-label text-label mt-space-md"
            >
              Tambahkan ke draf
            </button>
          </details>
        </section>
      )}
      {editor}
      <div className="flex flex-col w-full">
        <div className="max-w-7xl mx-auto w-full px-margin py-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <nav
              aria-label="Jejak Navigasi"
              className="flex items-center gap-space-xs font-metadata text-metadata text-text-secondary"
            >
              <button
                className="hover:text-primary transition-colors flex items-center gap-1"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  home
                </span>
                Beranda
              </button>
              <span className="text-outline-variant">/</span>
              <span className="font-label text-label text-primary">
                Rencana Belajar Harian
              </span>
              <span className="text-outline-variant">•</span>
              <span className="bg-surface-container-high px-space-sm py-0.5 rounded-full text-on-surface font-metadata text-metadata">
                {new Date(selectedDay + "T12:00:00Z").toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  },
                )}
              </span>
            </nav>

            <div className="flex items-center gap-space-sm bg-surface px-space-md py-1.5 rounded-full shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
              <span className="font-label text-label text-primary">{`${profile.display_name}, kamu bebas menyesuaikan jadwalmu.`}</span>
              <span className="text-outline-variant">•</span>
              <span className="font-metadata text-metadata text-text-secondary">
                SMP Kelas 8
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1 font-metadata text-metadata text-secondary">
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  visibility
                </span>
                Mode Visual
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="max-w-2xl">
              <h1 className="font-page-title text-page-title text-primary tracking-tight">
                Rencana Belajar Harianmu
              </h1>
              <p className="font-reading text-reading text-text-secondary mt-1">
                Atur jadwal belajarmu dengan santai tanpa paksaan. Waktu luangmu
                yang menentukan ritme, bukan deadline yang bikin cemas.
              </p>
            </div>

            <div className="flex items-center gap-space-sm">
              <button
                className="px-space-md py-2.5 bg-surface text-primary rounded-xl font-label text-label hover:bg-surface-container transition-all shadow-sm flex items-center gap-2 min-h-[44px]"
                disabled={busy}
                onClick={() => setControls(!controls)}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  calendar_month
                </span>
                Pilih Tanggal
              </button>
              <button
                className="px-space-md py-2.5 bg-surface text-primary rounded-xl font-label text-label hover:bg-surface-container transition-all shadow-sm flex items-center gap-2 min-h-[44px]"
                disabled={busy}
                onClick={() => {
                  onEdit();
                  setControls(true);
                }}
                aria-label="Edit rencana manual"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  tune
                </span>
                Preferensi Jam
              </button>
            </div>
          </div>

          {pending && (
            <section className="relative overflow-hidden bg-gradient-to-r from-butter via-secondary-container/60 to-secondary-fixed/50 rounded-2xl p-space-lg mb-space-xl">
              <div className="flex flex-col gap-space-sm">
                <span className="font-label text-label text-secondary">
                  Usulan Cerdas Mimo
                </span>
                <h2 className="font-section-title text-section-title text-primary">
                  Ada usulan penyesuaian untuk ditinjau
                </h2>
                <p className="font-body text-body text-text-secondary">
                  {pending?.reason}
                </p>
                <div className="flex gap-space-sm">
                  <button
                    disabled={busy}
                    onClick={() => pending && onReview(pending)}
                    className="h-11 px-space-lg rounded-xl bg-primary text-on-primary font-label text-label"
                  >
                    Tinjau perubahan
                  </button>
                </div>
              </div>
            </section>
          )}

          <section
            aria-label="Ringkasan Kapasitas Harian"
            className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl"
          >
            <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
              <p className="font-label text-label text-text-secondary">
                Target Harian
              </p>
              <p className="font-display text-page-title text-primary mt-space-sm">{`${plan?.daily_minutes || profile.daily_minutes} Menit`}</p>
            </div>

            <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
              <p className="font-label text-label text-text-secondary">
                Kegiatan Selesai
              </p>
              <p className="font-display text-page-title text-primary mt-space-sm">
                {String(
                  plan?.activities.filter((a) => a.status === "completed")
                    .length || 0,
                )}
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
              <p className="font-label text-label text-text-secondary">
                Versi Rencana
              </p>
              <p className="font-display text-page-title text-primary mt-space-sm">
                {plan ? String(plan.version) : "Belum dibuat"}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xxl">
            <section
              aria-labelledby="timeline-heading"
              className="lg:col-span-8 flex flex-col gap-space-md"
            >
              <div className="flex items-center justify-between bg-surface px-space-lg py-space-md rounded-2xl shadow-sm">
                <div>
                  <h2
                    className="font-section-title text-section-title text-primary tracking-tight"
                    id="timeline-heading"
                  >{`Linimasa ${new Date(selectedDay + "T12:00:00Z").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}`}</h2>
                  <p className="font-metadata text-metadata text-text-secondary">
                    {new Date(selectedDay + "T12:00:00Z").toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )}
                  </p>
                </div>
                <button
                  className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl font-label text-label text-xs transition-colors flex items-center gap-1 min-h-[44px]"
                  disabled={busy}
                  onClick={() => setControls(true)}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                  >
                    add_circle
                  </span>
                  Tambah Rencana Mandiri
                </button>
              </div>

              <div className="flex flex-col gap-space-md relative">
                {dayActivities.length ? (
                  dayActivities.map((a) => (
                    <article
                      className="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                      key={a.id}
                      data-status={a.status}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container" />
                      <div className="flex items-start gap-space-md">
                        <span className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-[22px]"
                          >
                            {a.status === "completed"
                              ? "check"
                              : a.kind === "practice"
                                ? "quiz"
                                : "menu_book"}
                          </span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-space-sm font-metadata text-metadata text-text-secondary">
                            <span>
                              {new Date(a.start_at).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: zone,
                                },
                              )}{" "}
                              • {a.duration_minutes} Menit
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container font-label text-[12px]">
                              {statusNames[a.status]}
                              {a.locked ? " • Terkunci" : ""}
                            </span>
                          </div>
                          <h3 className="font-card-title text-card-title text-primary mt-space-sm">
                            {a.title}
                          </h3>
                          <p className="font-body text-body text-text-secondary mt-space-xs">
                            {a.material_id
                              ? materials.find((m) => m.id === a.material_id)
                                  ?.title
                              : "Kegiatan mandiri pilihanmu"}
                          </p>
                          <div className="flex flex-wrap gap-space-sm mt-space-md">
                            {a.material_id && (
                              <button
                                disabled={busy}
                                onClick={() => onOpen(a)}
                                className="h-10 px-space-md rounded-xl bg-surface-container text-primary font-label text-label"
                              >
                                Buka materi
                              </button>
                            )}
                            {a.status === "pending" && (
                              <>
                                <button
                                  disabled={busy}
                                  onClick={() => onStatus(a, "active")}
                                  className="h-10 px-space-md rounded-xl bg-primary text-on-primary font-label text-label"
                                >
                                  Mulai kegiatan
                                </button>
                                <button
                                  disabled={busy}
                                  onClick={() => onStatus(a, "skipped")}
                                  className="h-10 px-space-md rounded-xl bg-surface-container-low text-text-secondary font-label text-label"
                                >
                                  Lewati
                                </button>
                              </>
                            )}
                            {a.status === "active" && (
                              <button
                                disabled={busy}
                                onClick={() => onStatus(a, "completed")}
                                className="h-10 px-space-md rounded-xl bg-primary text-on-primary font-label text-label"
                              >
                                Tandai selesai
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="p-space-lg bg-surface rounded-2xl">
                    <h3 className="font-card-title text-card-title text-primary">
                      Belum ada kegiatan tersimpan untuk hari ini.
                    </h3>
                    <p className="font-body text-body text-text-secondary mt-space-sm">
                      Satu langkah kecil sudah cukup untuk memulai.
                    </p>
                    <button
                      onClick={() => setControls(true)}
                      className="h-11 px-space-lg mt-space-md rounded-xl bg-primary text-on-primary font-label text-label"
                    >
                      Susun rencana ringan
                    </button>
                  </div>
                )}
              </div>
            </section>

            <aside
              aria-label="Jadwal Mendatang dan Pendamping Mimo"
              className="lg:col-span-4 flex flex-col gap-space-md"
            >
              <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md relative">
                <div className="flex items-center gap-space-md">
                  <div className="w-16 h-16 rounded-2xl bg-secondary-container p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                    <Image
                      className="w-full h-full object-contain"
                      data-alt="Mimo si bunglon ramah bergaya ilustrasi zine indie anak-anak, berwarna hijau lumut pastel cerah dengan pipi kemerahan peach lembut, sedang duduk santai di atas tumpukan buku pelajaran pastel, tersenyum hangat menyapa dengan tangan melambai ramah, pencahayaan alami latar krem hangat."
                      src="/design/mimo.png"
                      width={1024}
                      height={1024}
                      alt="Mimo, teman belajarmu"
                    />
                  </div>
                  <div>
                    <span className="font-metadata text-metadata text-secondary font-bold uppercase tracking-wider text-xs">
                      Co-Pilot Belajarmu
                    </span>
                    <h3 className="font-card-title text-card-title text-primary">
                      Mimo si Bunglon
                    </h3>
                    <span className="inline-flex items-center gap-1 font-metadata text-metadata text-muted-gray text-xs">
                      <span className="w-2 h-2 rounded-full bg-success inline-block"></span>{" "}
                      Selalu mendampingi
                    </span>
                  </div>
                </div>

                <div className="relative bg-secondary-container/60 rounded-2xl p-space-md text-primary">
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-secondary-container/60 transform rotate-45"></div>
                  <p className="font-mimo-voice text-mimo-voice text-contrast-ink leading-relaxed relative z-10">{`${profile.display_name}, kamu bebas menyesuaikan jadwalmu.`}</p>
                </div>
                <div className="flex flex-col gap-space-xs pt-space-xs">
                  <button
                    className="w-full py-2.5 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                    disabled={busy}
                    onClick={() => setControls(true)}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      coffee
                    </span>
                    Atur Hari Ini Sebagai Hari Santai / Libur
                  </button>
                  <button
                    className="w-full py-2.5 px-space-md rounded-xl bg-transparent hover:bg-surface-container-low text-text-secondary font-label text-label text-xs transition-colors text-center min-h-[44px]"
                    disabled={busy}
                    onClick={onMaterials}
                  >
                    Tanya Mimo tentang materi hari ini
                  </button>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <button
                    aria-label="Bulan sebelumnya"
                    onClick={() => setMonthOffset(monthOffset - 1)}
                    className="w-9 h-9 rounded-xl bg-surface-container text-primary"
                  >
                    ‹
                  </button>
                  <h3 className="font-card-title text-card-title text-primary">
                    {calendarDate.toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </h3>
                  <button
                    aria-label="Bulan berikutnya"
                    onClick={() => setMonthOffset(monthOffset + 1)}
                    className="w-9 h-9 rounded-xl bg-surface-container text-primary"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-space-md text-center">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                    (d) => (
                      <span
                        key={d}
                        className="font-metadata text-[11px] text-text-secondary"
                      >
                        {d}
                      </span>
                    ),
                  )}
                  {calendarDays.map((day, i) =>
                    day ? (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDay(day);
                          setMonthOffset(0);
                          setDate(day + "T09:00");
                        }}
                        aria-pressed={day === selectedDay}
                        className={
                          "h-9 rounded-lg font-label text-[12px] " +
                          (day === selectedDay
                            ? "bg-primary text-on-primary"
                            : "text-primary hover:bg-secondary-container")
                        }
                      >
                        {+day.slice(-2)}
                      </button>
                    ) : (
                      <span key={"blank" + i} />
                    ),
                  )}
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <h3 className="font-card-title text-card-title text-primary">
                  Rencana Besok
                </h3>
                {tomorrowActivities.length ? (
                  tomorrowActivities.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-xl bg-surface-container-low p-space-sm mt-space-sm"
                    >
                      <p className="font-label text-label text-primary">
                        {a.title}
                      </p>
                      <p className="font-metadata text-metadata text-text-secondary">
                        {a.duration_minutes} menit
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="font-body text-body text-text-secondary mt-space-sm">
                    Belum ada kegiatan tersimpan untuk besok.
                  </p>
                )}
                <button
                  onClick={() => setControls(true)}
                  className="h-10 px-space-md rounded-xl bg-surface-container text-primary font-label text-label mt-space-sm"
                >
                  Tambah kegiatan
                </button>
              </div>
            </aside>
          </div>

          <section
            aria-label="Bilah Aksi Penyesuaian Jadwal"
            className="sticky bottom-4 z-40 w-full bg-surface/95 backdrop-blur-md rounded-2xl p-space-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-space-md mb-space-lg"
          >
            <div className="flex items-center gap-space-md w-full sm:w-auto">
              <button
                className="px-space-md py-2.5 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-container transition-colors font-label text-label flex items-center gap-2 min-h-[44px]"
                onClick={onBack}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_back
                </span>
                Kembali ke Beranda
              </button>
              <button
                className="hidden md:flex px-space-md py-2.5 rounded-xl text-primary hover:bg-surface-container transition-colors font-label text-label items-center gap-2 min-h-[44px]"
                disabled={busy}
                onClick={onMaterials}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  library_add
                </span>
                + Tambah Materi dari Koleksi
              </button>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                className="flex-1 sm:flex-none px-space-md py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label text-label transition-colors min-h-[44px]"
                disabled={busy || !hasDraft}
                onClick={onSave}
              >
                Simpan Perubahan Jadwal
              </button>
              <button
                className="flex-1 sm:flex-none px-space-lg py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-label text-label shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px]"
                onClick={onBack}
              >
                <span>Lanjut Belajar: Kebalikan Kuadrat (5 Mnt)</span>
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
      {history}
    </div>
  );
}

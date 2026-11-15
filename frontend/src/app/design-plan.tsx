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
  const [controls, setControls] = useState(!plan);
  const zone = plan?.timezone || profile.timezone;
  const activities = (plan?.activities || []).toSorted((a, b) =>
    a.start_at.localeCompare(b.start_at),
  );
  const pending = plan?.proposals.find((p) => p.status === "pending");
  return (
    <>
      <div className="stitch-screen revamp-screen px-4 py-6 md:px-8">
        {pending && (
          <section className="p-5 rounded-2xl bg-butter/50 mb-6">
            <h2 className="text-lg font-bold">Ada usulan penyesuaian</h2>
            <p>{pending.reason}</p>
            <button
              disabled={busy}
              onClick={() => onReview(pending)}
              className="min-h-[44px] px-4 rounded-xl bg-primary text-surface mt-3"
            >
              Tinjau perubahan
            </button>
          </section>
        )}
        <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg pb-space-xxl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 w-fit text-primary font-label text-xs tracking-wide">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>Jadwal Harian Ramah Otak • Ritme Adaptif</span>
              </div>
              <h1 className="text-page-title md:text-display font-display text-primary tracking-tight leading-tight">{`Rencana Belajar ${profile.display_name} 📅`}</h1>
              <p className="text-text-secondary font-reading text-reading">
                {new Date().toLocaleDateString("id-ID", { timeZone: zone })}{" "}
                <span className="font-semibold text-primary">
                  Total 35 Menit
                </span>{" "}
                · Ritme Santai (WIB)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface shadow-sm hover:bg-surface-container-low text-primary font-label text-label transition-all active:scale-[0.98]"
                type="button"
                onClick={() => {
                  onEdit();
                  setControls(true);
                }}
                aria-label="Edit rencana manual"
                disabled={busy}
              >
                <span
                  className="material-symbols-outlined text-[19px] text-secondary"
                  aria-hidden="true"
                >
                  tune
                </span>
                <span>Atur Jam &amp; Hari Sendiri</span>
              </button>
              <button
                className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label text-label shadow-sm hover:bg-primary-hover transition-all active:scale-[0.98]"
                type="button"
                onClick={() => setControls(true)}
                disabled={busy}
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  aria-hidden="true"
                >
                  add_circle
                </span>
                <span>Pilih Aktivitas Tambahan</span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-peach/35 via-secondary-container/40 to-surface p-space-md md:p-space-lg shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-md max-w-3xl">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-surface/90 shadow-sm flex items-center justify-center text-secondary">
                  <Image
                    src="/design/mimo-0.png"
                    alt="Mimo si Bunglon"
                    className="w-10 h-10 object-contain drop-shadow-sm"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mimo-voice text-mimo-voice text-primary">
                      Ada usulan penyesuaian jadwal dari Mimo! 🌿
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-label bg-peach/70 text-on-surface">
                      Cerdas &amp; Nyaman
                    </span>
                  </div>
                  <p className="font-reading text-body text-text-secondary leading-relaxed">
                    {"Sesuai rencana yang kamu simpan"}
                  </p>
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface text-primary hover:bg-primary hover:text-on-primary font-label text-label shadow-sm transition-all whitespace-nowrap self-start md:self-center"
                type="button"
                onClick={onBack}
              >
                <span>Tinjau Usulan Perubahan Jadwal (Layar 21)</span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="absolute right-0 -bottom-8 w-48 h-48 bg-mimo-blush/20 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-8 flex flex-col gap-space-md">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[22px]"
                    aria-hidden="true"
                  >
                    schedule
                  </span>
                  <h2 className="text-section-title font-section-title text-primary">
                    Linimasa Belajar Hari Ini
                  </h2>
                </div>
                <span className="text-metadata font-metadata text-text-secondary">
                  4 Slot Sesi Terencana
                </span>
              </div>

              <div className="relative pl-6 md:pl-8 space-y-space-md before:absolute before:left-3 before:top-4 before:bottom-6 before:w-0.5 before:bg-divider">
                {activities.length ? (
                  activities.map((a) => (
                    <div className="relative group" key={a.id}>
                      <div className="p-5 rounded-2xl bg-surface shadow-card space-y-3">
                        <div className="flex justify-between gap-3 text-xs text-text-secondary">
                          <span>
                            {new Date(a.start_at).toLocaleString("id-ID", {
                              timeZone: zone,
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                            • {a.duration_minutes} menit
                          </span>
                          <span>
                            {a.status}
                            {a.locked ? " • Terkunci" : ""}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary">
                          {a.title}
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                          {a.material_id && (
                            <button
                              disabled={busy}
                              onClick={() => onOpen(a)}
                              className="min-h-[44px] px-4 rounded-xl bg-canvas"
                            >
                              Buka materi
                            </button>
                          )}
                          {a.status === "pending" && (
                            <>
                              <button
                                disabled={busy}
                                onClick={() => onStatus(a, "active")}
                                className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
                              >
                                Mulai kegiatan
                              </button>
                              <button
                                disabled={busy}
                                onClick={() => onStatus(a, "skipped")}
                                className="min-h-[44px] px-4 rounded-xl bg-canvas"
                              >
                                Lewati
                              </button>
                            </>
                          )}
                          {a.status === "active" && (
                            <button
                              disabled={busy}
                              onClick={() => onStatus(a, "completed")}
                              className="min-h-[44px] px-4 rounded-xl bg-primary text-surface"
                            >
                              Tandai selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-6 rounded-2xl bg-surface text-text-secondary">
                    Belum ada kegiatan tersimpan. Susun rencana ringan saat kamu
                    siap.
                  </p>
                )}
              </div>

              <div className="mt-4 p-space-md rounded-2xl bg-surface shadow-sm flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    aria-hidden="true"
                  >
                    spa
                  </span>
                </div>
                <p className="text-text-secondary font-metadata text-metadata leading-relaxed">
                  Semua sesi dirancang dalam pecahan{" "}
                  <strong className="text-primary font-semibold">{`${profile.daily_minutes} menit per hari`}</strong>{" "}
                  untuk menjaga konsentrasi optimal dan mencegah kelelahan mata.
                  Kamu selalu bebas berhenti sejenak.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="p-space-lg rounded-2xl bg-surface shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label text-primary">
                    Waktu Belajar Hari Ini
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-peach/40 text-on-surface font-metadata text-xs font-semibold">
                    {"Sesuai rencana yang kamu simpan"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-extrabold text-primary">
                    25
                  </span>
                  <span className="text-text-secondary font-metadata">
                    / 35 Menit Terpakai
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-700 ease-out"
                      style={{ width: "71.4%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-metadata font-metadata text-text-secondary text-xs">
                    <span>Selesai: 25 Mnt</span>
                    <span className="text-secondary font-semibold">
                      Sisa: 10 Menit Santai
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between bg-surface-container-low p-2.5 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-metadata text-text-secondary uppercase tracking-wider">
                      Ritme Jeda Otak
                    </span>
                    <span className="text-xs font-label text-primary">
                      2 Sesi Terselesaikan Mulus
                    </span>
                  </div>
                  <svg
                    className="w-20 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 80 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 18 L24 8 L46 14 L78 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="relative overflow-hidden p-space-lg rounded-2xl bg-surface shadow-sm flex flex-col items-center text-center">
                <div className="relative w-44 h-44 mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-secondary-container/40 blur-xl"></div>
                  <Image
                    alt="Mimo Si Bunglon Ramah sedang duduk santai membaca buku pastel dengan tenang"
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105 duration-300"
                    src="/design/mimo-0.png"
                    width={1024}
                    height={1024}
                  ></Image>
                </div>

                <div className="relative p-space-md rounded-2xl bg-surface-container-low w-full text-left space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-mimo-voice text-xs font-bold text-primary tracking-wide">
                      Pesan Pendamping Mimo
                    </span>
                  </div>
                  <p className="font-reading text-[15px] text-primary leading-snug">{`${profile.display_name}, jadwal bisa kamu sesuaikan kapan saja.`}</p>
                </div>
              </div>

              <div className="p-space-lg rounded-2xl bg-surface shadow-sm flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label text-primary">
                    Konsistensi Pekan Ini
                  </span>
                  <span
                    className="material-symbols-outlined text-secondary text-[20px]"
                    aria-hidden="true"
                  >
                    emoji_events
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-display font-bold text-primary">
                    4 dari 5 Hari
                  </span>
                  <span className="text-xs font-metadata text-success font-semibold flex items-center gap-0.5">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      aria-hidden="true"
                    >
                      trending_up
                    </span>{" "}
                    On Track
                  </span>
                </div>
                <p className="font-metadata text-metadata text-text-secondary text-xs">
                  Target belajar aktif minimal 20 menit per hari untuk pekan
                  ini.
                </p>

                <div className="grid grid-cols-5 gap-2 pt-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full py-2 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-label text-xs font-bold shadow-xs">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </div>
                    <span className="font-metadata text-[11px] text-text-secondary">
                      Sen
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full py-2 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-label text-xs font-bold shadow-xs">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    </div>
                    <span className="font-metadata text-[11px] text-text-secondary">
                      Sel
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full py-2 rounded-lg bg-secondary-container text-primary flex items-center justify-center font-label text-xs font-bold shadow-xs animate-pulse">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        timelapse
                      </span>
                    </div>
                    <span className="font-metadata text-[11px] font-bold text-primary">
                      Rab
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full py-2 rounded-lg bg-surface-container text-text-secondary flex items-center justify-center font-label text-xs">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                    </div>
                    <span className="font-metadata text-[11px] text-text-secondary">
                      Kam
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full py-2 rounded-lg bg-surface-container text-text-secondary flex items-center justify-center font-label text-xs">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        lock
                      </span>
                    </div>
                    <span className="font-metadata text-[11px] text-text-secondary">
                      Jum
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-6 p-6 rounded-2xl bg-surface space-y-4">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setControls(!controls)}>Atur rencana</button>
            <button disabled={busy} onClick={onRefresh}>
              Perbarui rencana
            </button>
            <button onClick={onMaterials}>Pilih materi</button>
          </div>
          {controls && (
            <>
              <label className="block">
                Rencana aktif
                <select
                  value={plan?.id || ""}
                  onChange={(e) => onSelectPlan(e.target.value)}
                >
                  <option value="">Rencana baru</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      Versi {p.version} • {p.activities.length} kegiatan
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Materi
                <select
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Waktu mulai (zona perangkat)
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="block">
                Judul kegiatan mandiri
                <input
                  value={title}
                  maxLength={200}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="block">
                Durasi (menit)
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button disabled={busy} onClick={onSuggest}>
                  Susun usulan awal
                </button>
                <button disabled={busy || !plan} onClick={onRecompute}>
                  Sesuaikan dari hasil latihan
                </button>
                <button disabled={busy} onClick={onAddManual}>
                  Tambah kegiatan mandiri
                </button>
                <button disabled={busy || !hasDraft} onClick={onSave}>
                  Simpan usulan perubahan
                </button>
              </div>
              {editor}
            </>
          )}
          {history}
        </section>
      </div>
    </>
  );
}

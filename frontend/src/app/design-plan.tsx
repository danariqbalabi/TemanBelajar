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
  const [dayOffset, setDayOffset] = useState(0);
  const activities = (plan?.activities || []).toSorted((a, b) =>
    a.start_at.localeCompare(b.start_at),
  );
  const pending = plan?.proposals.find((p) => p.status === "pending");
  const activeDay = new Date();
  activeDay.setDate(activeDay.getDate() + dayOffset);
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: zone });
  const visibleActivities = activities.filter(
    (a) => dayKey(new Date(a.start_at)) === dayKey(activeDay),
  );

  return (
    <>
      <div className="final-design final-screen-20 w-full pt-[8.25rem] bg-canvas flex-1">
        <div className="flex flex-col w-full">
          <div className="max-w-[1200px] w-full mx-auto px-margin-mobile sm:px-margin-tablet lg:px-margin py-space-lg space-y-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="space-y-space-xs">
                <div className="flex items-center gap-2 text-metadata font-metadata text-on-surface-variant">
                  <span>Beranda</span>
                  <span className="text-outline-variant">•</span>
                  <span>Rencana Belajar</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-semibold text-primary">{`${activeDay.toLocaleDateString("id-ID", { timeZone: zone })} · ${visibleActivities.reduce((n, a) => n + a.duration_minutes, 0)} menit`}</span>
                </div>
                <div className="flex items-center gap-space-sm pt-1">
                  <button onClick={onBack} className="text-sm mb-3">
                    Kembali ke beranda
                  </button>
                  <h1 className="font-page-title text-page-title text-primary tracking-tight">
                    Rencana Belajar Harian
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[12px] font-label font-bold">
                    Alur G • Adaptif
                  </span>
                </div>
                <p className="font-body text-body text-on-surface-variant max-w-2xl">
                  Waktu belajar ramah pikiran — atur sesuai energimu tanpa rasa
                  cemas dan tetap selaras dengan kurikulum sekolah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                <div className="flex items-center bg-surface rounded-xl p-1 shadow-sm">
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-primary font-bold hover:bg-surface-container transition-colors text-xs"
                    id="btn-dec-font"
                    title="Perkecil Ukuran Font"
                    type="button"
                    onClick={() => setControls(true)}
                  >
                    A-
                  </button>
                  <span className="w-[1px] h-4 bg-surface-container-high mx-1"></span>
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-primary font-bold hover:bg-surface-container transition-colors text-sm"
                    id="btn-inc-font"
                    title="Perbesar Ukuran Font"
                    type="button"
                    onClick={() => setControls(true)}
                  >
                    A+
                  </button>
                </div>
                <button
                  className="flex items-center gap-1.5 px-space-md py-2 bg-surface text-primary font-label text-label rounded-xl hover:bg-surface-container shadow-sm transition-colors"
                  type="button"
                  aria-label="Edit rencana manual"
                  onClick={() => {
                    onEdit();
                    setControls(true);
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    tune
                  </span>
                  <span>Atur Waktu</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-space-md py-2 bg-surface text-primary font-label text-label rounded-xl hover:bg-surface-container shadow-sm transition-colors"
                  type="button"
                  onClick={() => window.print()}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    print
                  </span>
                  <span className="hidden sm:inline">Cetak / Ekspor</span>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mint-tint via-surface-container-low to-butter-tint p-space-md sm:p-space-lg shadow-sm">
              <div
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10"
                hidden={!pending}
              >
                <div className="flex items-start gap-space-md max-w-3xl">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-butter flex items-center justify-center text-primary shadow-sm mt-0.5">
                    <span
                      className="material-symbols-outlined text-[24px]"
                      aria-hidden="true"
                    >
                      auto_fix_high
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-card-title text-card-title text-primary font-bold">
                        Ada Usulan Penyesuaian Jadwal dari Hasil Latihan
                        Terakhir!
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-butter text-warning font-label text-[11px] font-bold">
                        Rekomendasi Cerdas
                      </span>
                    </div>
                    <p className="font-body text-body text-on-surface-variant">
                      {pending?.reason ||
                        "Belum ada usulan baru. Atur kegiatan sesuai kebutuhanmu."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm shrink-0 self-start lg:self-center">
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-pressed text-on-primary font-label text-label font-bold shadow-md transition-all"
                    data-path="tinjau-jadwal"
                    data-screen="SCREEN_21"
                    type="button"
                    disabled={!pending || busy}
                    onClick={() => pending && onReview(pending)}
                  >
                    <span>Tinjau Usulan Jadwal</span>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </button>
                  <button
                    className="px-4 py-2.5 rounded-xl bg-surface/90 hover:bg-surface text-on-surface-variant font-label text-label transition-colors"
                    type="button"
                    onClick={() => setControls(false)}
                  >
                    Nanti Saja (Pertahankan)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {pending ? (
                <div className="bg-butter-tint rounded-2xl p-5 border border-divider">
                  <p>{pending.reason}</p>
                  <button onClick={() => onReview(pending)} className="mt-3">
                    Tinjau usulan jadwal
                  </button>
                </div>
              ) : (
                <p className="text-sm">
                  Belum ada usulan penyesuaian. Kamu bebas mengatur waktu
                  belajarmu sendiri.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              <section className="lg:col-span-8 flex flex-col space-y-space-md">
                <div className="flex items-center justify-between overflow-x-auto pb-1 no-scrollbar gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3.5 py-1.5 rounded-full bg-surface text-on-surface-variant hover:bg-surface-container text-label font-label text-xs sm:text-sm whitespace-nowrap transition-colors"
                      type="button"
                      onClick={() => setDayOffset(-1)}
                    >
                      Kemarin
                    </button>
                    <button
                      className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed text-label font-label font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm"
                      type="button"
                      onClick={() => setDayOffset(0)}
                    >
                      Hari ini
                    </button>
                    <button
                      className="px-3.5 py-1.5 rounded-full bg-surface text-on-surface-variant hover:bg-surface-container text-label font-label text-xs sm:text-sm whitespace-nowrap transition-colors"
                      type="button"
                      onClick={() => setDayOffset(1)}
                    >
                      Besok
                    </button>
                    <button
                      className="px-3.5 py-1.5 rounded-full bg-surface text-on-surface-variant hover:bg-surface-container text-label font-label text-xs sm:text-sm whitespace-nowrap transition-colors"
                      type="button"
                      onClick={() => setDayOffset(2)}
                    >
                      Lusa
                    </button>
                  </div>
                  <button
                    className="flex items-center gap-1 text-primary hover:underline font-label text-xs font-semibold shrink-0 pl-2"
                    type="button"
                    onClick={() => setControls(true)}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      calendar_view_week
                    </span>
                    <span>Kalender Pekan Ini</span>
                  </button>
                </div>

                <div className="space-y-space-md pt-2">
                  {visibleActivities.map((a) => (
                    <article
                      className="p-space-md sm:p-space-lg rounded-2xl bg-surface shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col sm:flex-row gap-space-md items-start sm:items-center justify-between"
                      key={a.id}
                    >
                      <div className="flex items-start gap-5">
                        <div className="font-bold tabular-nums shrink-0">
                          {new Date(a.start_at).toLocaleTimeString("id-ID", {
                            timeZone: zone,
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <p className="text-sm font-normal">
                            {a.duration_minutes} menit
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {a.status === "completed"
                              ? "Selesai"
                              : a.status === "skipped"
                                ? "Dilewati"
                                : "Terjadwal"}{" "}
                            ·{" "}
                            {a.kind === "manual"
                              ? "Kegiatan mandiri"
                              : "Saran belajar"}
                          </p>
                          <h2 className="text-xl font-bold my-3">{a.title}</h2>
                          <div className="flex flex-wrap gap-3">
                            <button
                              disabled={busy || !a.material_id}
                              onClick={() => onOpen(a)}
                              className="bg-primary text-white px-4 py-2 rounded-xl"
                            >
                              Mulai aktivitas
                            </button>
                            <button
                              disabled={busy || a.status === "completed"}
                              onClick={() => onStatus(a, "completed")}
                              className="px-4 py-2 rounded-xl border border-divider"
                            >
                              Tandai selesai
                            </button>
                            <button
                              disabled={busy || a.status === "skipped"}
                              onClick={() => onStatus(a, "skipped")}
                              className="px-4 py-2 rounded-xl border border-divider"
                            >
                              Lewati
                            </button>
                            <button
                              onClick={() => {
                                onEdit();
                                setControls(true);
                              }}
                            >
                              Ubah jadwal
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                  {!visibleActivities.length && (
                    <p className="bg-surface border border-divider rounded-2xl p-8">
                      Belum ada kegiatan pada hari ini. Pilih aktivitas saat
                      kamu siap.
                    </p>
                  )}
                </div>

                <button
                  className="w-full py-3.5 px-space-md rounded-2xl bg-surface hover:bg-surface-container-low text-primary font-label text-label font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  type="button"
                  onClick={() => setControls(true)}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    add_circle
                  </span>
                  <span>
                    + Tambah Aktivitas Belajar Sendiri atau Sesi Istirahat
                  </span>
                </button>
              </section>

              <aside className="lg:col-span-4 flex flex-col space-y-space-md">
                <div className="bg-mint-tint rounded-2xl p-6 border border-divider">
                  <Image
                    src="/design/mimo-final.png"
                    width={1408}
                    height={1120}
                    alt=""
                    className="w-36 h-auto object-contain mx-auto"
                  />
                  <h2 className="font-display font-bold text-xl mt-3">
                    Sesuai ritmemu, {profile.display_name}
                  </h2>
                  <p className="mt-3">
                    {visibleActivities.reduce(
                      (n, a) => n + a.duration_minutes,
                      0,
                    )}{" "}
                    menit terjadwal. Jadwal bisa diubah tanpa mengurangi hasil
                    belajarmu.
                  </p>
                  <p className="mt-3 text-sm">Zona waktu: {zone}</p>
                  <button onClick={onMaterials} className="mt-4">
                    Pilih materi →
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-10">
          {" "}
          <section className="mt-6 p-6 rounded-2xl bg-surface space-y-4">
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setControls(!controls)}>
                Atur rencana
              </button>
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
      </div>
    </>
  );
}

"use client";
import { useState, type ReactNode } from "react";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
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
  message,
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
  message: string;
}) {
  const [controls, setControls] = useState(!plan);
  const [proposalHidden, setProposalHidden] = useState(false);
  function openControls() {
    setControls(true);
    document
      .getElementById("plan-controls")
      ?.scrollIntoView?.({ block: "start" });
  }
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

  const scheduledMinutes = visibleActivities
    .filter((a) => a.status !== "skipped")
    .reduce((sum, a) => sum + a.duration_minutes, 0);
  return (
    <Workspace screen={20}>
      <WorkspaceHeading
        title="Rencana belajar"
        description="Belajar dan jeda, dalam satu tempat."
        back={onBack}
        actions={
          <>
            <button
              className="workspace-button"
              aria-label="Edit rencana manual"
              onClick={() => {
                onEdit();
                openControls();
              }}
            >
              <UiIcon name="edit_calendar" />
              Atur Waktu
            </button>
            <button className="workspace-button" onClick={() => window.print()}>
              <UiIcon name="print" />
              Cetak / Ekspor
            </button>
          </>
        }
      />
      {pending && !proposalHidden && (
        <div className="workspace-proposal-banner">
          <UiIcon name="event_repeat" />
          <div>
            <strong>Ada usulan jadwal baru</strong>
            <p>{pending.reason}</p>
          </div>
          <button
            className="workspace-button primary"
            disabled={busy}
            onClick={() => onReview(pending)}
          >
            Tinjau Usulan Jadwal
          </button>
          <button
            className="workspace-button"
            onClick={() => setProposalHidden(true)}
          >
            Tinjau nanti
          </button>
        </div>
      )}
      <div className="workspace-planner-grid">
        <section className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <h2>
                {activeDay.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  timeZone: zone,
                })}
              </h2>
              <span className="workspace-muted">
                {scheduledMinutes} menit terjadwal
              </span>
            </div>
            <button className="workspace-button" onClick={openControls}>
              <UiIcon name="add" />
              Tambah aktivitas atau istirahat
            </button>
          </div>
          <div className="workspace-day-tabs">
            {[
              [-1, "Kemarin"],
              [0, "Hari ini"],
              [1, "Besok"],
              [2, "Lusa"],
            ].map(([offset, label]) => (
              <button
                key={offset}
                aria-pressed={dayOffset === offset}
                onClick={() => setDayOffset(Number(offset))}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="workspace-timeline">
            {visibleActivities.map((activity) => (
              <article
                key={activity.id}
                className="workspace-activity"
                data-status={activity.status}
              >
                <div className="workspace-activity-time">
                  <strong>
                    {new Date(activity.start_at).toLocaleTimeString("id-ID", {
                      timeZone: zone,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                  <span>{activity.duration_minutes} mnt</span>
                </div>
                <div className="workspace-activity-content">
                  <span className="workspace-eyebrow">
                    {
                      {
                        pending: "Terjadwal",
                        active: "Berjalan",
                        completed: "Selesai",
                        skipped: "Dilewati",
                      }[activity.status]
                    }
                  </span>
                  <h3>{activity.title}</h3>
                  <div className="workspace-actions">
                    <button
                      className="workspace-button primary"
                      disabled={busy || !activity.material_id}
                      onClick={() => onOpen(activity)}
                    >
                      Mulai aktivitas
                    </button>
                    <button
                      className="workspace-button"
                      disabled={busy || activity.status === "completed"}
                      onClick={() => onStatus(activity, "completed")}
                    >
                      Tandai selesai
                    </button>
                    <details className="workspace-disclosure">
                      <summary>Lainnya</summary>
                      <div className="workspace-actions">
                        <button
                          className="workspace-button"
                          disabled={
                            busy ||
                            activity.status === "skipped" ||
                            activity.status === "completed"
                          }
                          onClick={() => onStatus(activity, "skipped")}
                        >
                          Lewati
                        </button>
                        <button
                          className="workspace-button"
                          onClick={() => {
                            onEdit();
                            openControls();
                          }}
                        >
                          Ubah jadwal
                        </button>
                      </div>
                    </details>
                  </div>
                </div>
              </article>
            ))}
            {!visibleActivities.length && (
              <div className="workspace-empty">
                <UiIcon name="event_available" />
                <h3>Hari ini masih lapang</h3>
                <p>Tambahkan satu kegiatan untuk mulai.</p>
                <button className="workspace-button" onClick={openControls}>
                  Atur rencana belajar
                </button>
              </div>
            )}
          </div>
        </section>
        <aside className="workspace-planner-aside">
          <div className="workspace-budget" data-tone="mint">
            <UiIcon name="timelapse" />
            <span className="workspace-eyebrow">Ritme harian</span>
            <strong>
              {scheduledMinutes}
              <small>
                {" "}
                / {plan?.daily_minutes || profile.daily_minutes} menit
              </small>
            </strong>
            <progress
              value={Math.min(
                scheduledMinutes,
                plan?.daily_minutes || profile.daily_minutes,
              )}
              max={plan?.daily_minutes || profile.daily_minutes}
              aria-label="Waktu belajar terjadwal"
            />
            <span className="workspace-muted">{zone}</span>
          </div>
          <button className="workspace-button" onClick={onMaterials}>
            <UiIcon name="auto_stories" />
            Pilih materi
          </button>
        </aside>
      </div>
      <section
        id="plan-controls"
        className="workspace-panel workspace-plan-controls"
        style={{ scrollMarginTop: "calc(var(--ui-header-height) + 16px)" }}
      >
        <div className="workspace-panel-heading">
          <h2>Editor rencana</h2>
          <div className="workspace-actions">
            <button
              className="workspace-button"
              data-tour="planner-open"
              aria-expanded={controls}
              onClick={() => setControls(!controls)}
            >
              {controls ? "Tutup editor" : "Atur rencana"}
            </button>
            <button
              className="workspace-button"
              disabled={busy}
              onClick={onRefresh}
            >
              Perbarui rencana
            </button>
          </div>
        </div>
        {message && (
          <p
            role="status"
            data-tour={
              message.startsWith("Rencana tersimpan.")
                ? "planner-saved"
                : undefined
            }
            className="workspace-inline-message"
          >
            {message}
          </p>
        )}
        {controls && (
          <>
            <div className="workspace-plan-fields">
              <label className="workspace-field">
                Rencana aktif
                <select
                  data-tour="planner-new"
                  value={plan?.id || ""}
                  onChange={(e) => onSelectPlan(e.target.value)}
                >
                  <option value="">Rencana baru</option>
                  {plans.map((item) => (
                    <option key={item.id} value={item.id}>
                      Versi {item.version} / {item.activities.length} kegiatan
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-field">
                Materi
                <select
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                >
                  {materials.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-field">
                Waktu mulai (zona perangkat)
                <input
                  data-tour="planner-date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label className="workspace-field">
                Judul kegiatan mandiri
                <input
                  value={title}
                  maxLength={160}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="workspace-field">
                Durasi (menit)
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                />
              </label>
            </div>
            <div className="workspace-actions">
              <button
                className="workspace-button"
                disabled={busy}
                data-tour="planner-suggest"
                onClick={onSuggest}
              >
                Susun usulan awal
              </button>
              <button
                className="workspace-button"
                disabled={busy || !plan}
                onClick={onRecompute}
              >
                Sesuaikan dari hasil latihan
              </button>
              <button
                className="workspace-button"
                disabled={busy}
                onClick={onAddManual}
              >
                Tambah kegiatan mandiri
              </button>
              <button
                className="workspace-button primary"
                disabled={busy || !hasDraft}
                data-tour="planner-save"
                onClick={onSave}
              >
                {plan ? "Simpan usulan perubahan" : "Simpan rencana"}
              </button>
            </div>
            {editor}
          </>
        )}
        {history}
      </section>
    </Workspace>
  );
}

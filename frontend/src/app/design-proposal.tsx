"use client";
import type { Plan, Proposal, Activity } from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function ProposalDesign({
  plan,
  proposal,
  busy,
  onAccept,
  onDismiss,
  onBack,
  onEdit,
  onRestore,
  onRefresh,
}: {
  plan: Plan;
  proposal: Proposal;
  busy: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onBack: () => void;
  onEdit: () => void;
  onRestore: (version: number) => void;
  onRefresh: () => void;
}) {
  const before = plan.history[String(proposal.base_version)] || plan.activities;
  const format = (activity: Activity) =>
    new Date(activity.start_at).toLocaleString("id-ID", {
      timeZone: plan.timezone,
      dateStyle: "medium",
      timeStyle: "short",
    });
  const ready =
    proposal.status === "pending" && proposal.base_version === plan.version;
  return (
    <Workspace screen={21}>
      <WorkspaceHeading
        title="Tinjau perubahan jadwal"
        description={`Dari jadwal ke-${proposal.base_version} · ${proposal.activities.length} kegiatan diusulkan`}
        back={onBack}
        actions={
          <button
            className="workspace-button"
            disabled={busy}
            onClick={onRefresh}
          >
            <UiIcon name="refresh" />
            Perbarui
          </button>
        }
      />
      <div className="workspace-inline-message">
        <strong>Jadwal belum berubah.</strong> Tinjau usulan sebelum
        menerapkannya.
      </div>
      <div className="workspace-secondary-grid">
        {[
          { title: "Jadwal sekarang", items: before },
          { title: "Usulan baru", items: proposal.activities },
        ].map((column) => (
          <section className="workspace-panel" key={column.title}>
            <h2>{column.title}</h2>
            <ol className="workspace-proposal-list">
              {column.items.map((activity) => (
                <li key={activity.id}>
                  <span className="workspace-eyebrow">{format(activity)}</span>
                  <strong>{activity.title}</strong>
                  <span className="workspace-muted">
                    {activity.duration_minutes} menit
                    {activity.locked ? " - Tidak bisa diubah" : ""}
                    {activity.status === "completed" ? " - Selesai" : ""}
                  </span>
                </li>
              ))}
            </ol>
            {!column.items.length && (
              <p className="workspace-muted workspace-loading">
                Belum ada kegiatan.
              </p>
            )}
          </section>
        ))}
      </div>
      <details className="workspace-panel workspace-disclosure">
        <summary>Alasan penyesuaian</summary>
        <p>{proposal.reason}</p>
      </details>
      <footer className="workspace-selection-bar">
        <span className="workspace-muted">
          {ready
            ? "Kegiatan yang sudah dikerjakan tidak ikut berubah."
            : "Usulan ini sudah dipakai, atau jadwalnya sudah berubah."}
        </span>
        <div className="workspace-actions">
          <button
            className="workspace-button"
            disabled={busy || proposal.status !== "pending"}
            onClick={onDismiss}
          >
            Tetap Pakai Jadwal Lama
          </button>
          <button className="workspace-button" disabled={busy} onClick={onEdit}>
            Edit usulan
          </button>
          <button
            className="workspace-button primary"
            disabled={busy || !ready}
            onClick={onAccept}
          >
            Pakai Rencana Baru (Terapkan)
          </button>
        </div>
      </footer>
      <details className="workspace-panel workspace-disclosure">
        <summary>Riwayat rencana</summary>
        <div className="workspace-option-list">
          {Object.keys(plan.history)
            .sort((a, b) => Number(b) - Number(a))
            .map((version) => (
              <button
                className="workspace-button"
                key={version}
                disabled={busy}
                onClick={() => onRestore(Number(version))}
              >
                Pakai jadwal ke-{version}
              </button>
            ))}
        </div>
        {!Object.keys(plan.history).length && (
          <p>Belum ada jadwal sebelumnya.</p>
        )}
      </details>
    </Workspace>
  );
}

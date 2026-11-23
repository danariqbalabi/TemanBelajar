"use client";
import { Modal } from "./modal";
import type { Job, Material } from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function JobDesign({
  job,
  busy,
  onBack,
  onProcess,
  onRefresh,
  onOpen,
  onSource,
  source,
  onCloseSource,
}: {
  job: Job;
  busy: boolean;
  onBack: () => void;
  onProcess: () => void;
  onRefresh: () => void;
  onOpen: () => void;
  onSource: () => void;
  source: Material["sources"] | null;
  onCloseSource: () => void;
}) {
  const labels: Record<string, string> = {
    queued: "Sumber tersimpan",
    processing: "Menyusun materi",
    failed: "Belum berhasil",
    ready: "Materi siap",
  };
  const step = job.status === "ready" ? 3 : job.status === "processing" ? 2 : 1;
  return (
    <Workspace screen={10}>
      <WorkspaceHeading
        title={labels[job.status]}
        description={job.title}
        back={onBack}
      />
      <section className="workspace-job-panel workspace-panel">
        <div className="workspace-job-symbol" data-status={job.status}>
          <UiIcon
            name={
              job.status === "ready"
                ? "task_alt"
                : job.status === "failed"
                  ? "refresh"
                  : "auto_stories"
            }
          />
        </div>
        <ol className="workspace-process-steps">
          {["Simpan sumber", "Susun konsep", "Siap dipelajari"].map(
            (label, index) => (
              <li key={label} data-done={index < step}>
                <span>{index + 1}</span>
                {label}
              </li>
            ),
          )}
        </ol>
        <p className="workspace-job-message" role="status">
          {job.error ||
            (job.status === "queued"
              ? "Mulai penyusunan saat kamu siap."
              : job.status === "processing"
                ? "Proses biasanya memerlukan hingga 90 detik. Sumbermu tetap tersimpan."
                : job.status === "ready"
                  ? "Konsep dan latihan sudah tersedia."
                  : "Sumber tersimpan. Kamu bisa mencoba kembali.")}
        </p>
        <div className="workspace-actions">
          {job.status === "ready" ? (
            <button
              className="workspace-button primary"
              disabled={busy}
              onClick={onOpen}
            >
              Buka materi
              <UiIcon name="arrow_forward" />
            </button>
          ) : job.status !== "processing" ? (
            <button
              className="workspace-button primary"
              disabled={busy}
              onClick={onProcess}
            >
              {job.status === "failed" ? "Coba lagi" : "Siapkan materi"}
            </button>
          ) : null}
          <button
            className="workspace-button"
            disabled={busy}
            onClick={onRefresh}
          >
            Perbarui status
          </button>
          <button
            className="workspace-button"
            disabled={busy}
            onClick={onSource}
          >
            Lihat sumber
          </button>
        </div>
        {job.status === "processing" && (
          <details className="workspace-disclosure">
            <summary>Proses terasa lama?</summary>
            <p>
              Perbarui status terlebih dahulu. Jika proses terputus, tunggu dua
              menit lalu coba lanjutkan.
            </p>
            <button
              className="workspace-button"
              disabled={busy}
              onClick={onProcess}
            >
              Coba lanjutkan proses
            </button>
          </details>
        )}
      </section>
      {source && (
        <Modal title="Sumber tersimpan" onClose={onCloseSource}>
          {source.map((item) => (
            <article key={item.id}>
              <h3>{item.label}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{item.text}</p>
            </article>
          ))}
        </Modal>
      )}
    </Workspace>
  );
}

"use client";
import { useRef } from "react";
import type { Material } from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function SummaryDesign({
  material,
  onBack,
  onChoose,
  onPlan,
}: {
  material: Material;
  onBack: () => void;
  onChoose: () => void;
  onPlan: () => void;
}) {
  const sourceDialog = useRef<HTMLDialogElement>(null);
  return (
    <Workspace screen={11}>
      <WorkspaceHeading
        title={material.title}
        description={material.subject}
        back={onBack}
        actions={
          <button
            className="workspace-button"
            onClick={() => sourceDialog.current?.showModal()}
          >
            <UiIcon name="description" />
            Lihat sumber asli
          </button>
        }
      />
      <div className="workspace-summary-layout">
        <section className="workspace-panel">
          <div className="workspace-panel-heading">
            <h2>Urutan belajar</h2>
            <span>{material.concepts.length} konsep</span>
          </div>
          <ol className="workspace-concept-list">
            {material.concepts.map((concept, index) => (
              <li key={concept.id}>
                <span className="workspace-step">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{concept.title}</h3>
                  <span className="workspace-muted">
                    {concept.estimated_minutes} menit
                  </span>
                  <details className="workspace-disclosure">
                    <summary>Intip konsep</summary>
                    <p>{concept.paragraphs[0]}</p>
                    <p>Transkrip: {concept.transcript?.trim() ? "tersedia" : "belum tersedia"}.</p>
                    <p>Deskripsi visual: {concept.diagram_description?.trim() ? "tersedia" : "belum tersedia"}.</p>
                  </details>
                </div>
                <UiIcon name="arrow_downward" />
              </li>
            ))}
          </ol>
        </section>
        <aside className="workspace-study-card" data-tone="mint">
          <span className="workspace-study-art" aria-hidden="true">
            <UiIcon name="auto_stories" />
          </span>
          <h2>Siap mulai?</h2>
          <dl className="workspace-mini-stats">
            <div>
              <dt>Durasi</dt>
              <dd>
                {material.concepts.reduce(
                  (sum, c) => sum + c.estimated_minutes,
                  0,
                )}{" "}
                menit
              </dd>
            </div>
            <div>
              <dt>Latihan</dt>
              <dd>{material.question_count} soal</dd>
            </div>
          </dl>
          <button type="button" className="workspace-button primary" onClick={onChoose}>
            Pilih Cara Belajar
            <UiIcon name="arrow_forward" />
          </button>
          <button
            className="workspace-button"
            aria-label="Susun rencana belajar"
            onClick={onPlan}
          >
            Tambahkan ke rencana
          </button>

        </aside>
      </div>
      <dialog
        ref={sourceDialog}
        className="workspace-source-dialog"
        aria-label="Sumber materi"
      >
        <div className="workspace-panel-heading">
          <h2>Sumber materi</h2>
          <button
            className="workspace-button"
            onClick={() => sourceDialog.current?.close()}
          >
            Tutup
          </button>
        </div>
        {material.sources.map((source) => (
          <article key={source.id}>
            <h3>{source.label}</h3>
            <p>{source.text}</p>
          </article>
        ))}
      </dialog>
    </Workspace>
  );
}

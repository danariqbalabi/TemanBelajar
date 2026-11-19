"use client";
import { useState } from "react";
import type { Material, Mode, Recommendation } from "@/lib/types";
import { modeNames } from "./materials";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function RecommendationDesign({
  material,
  recommendation,
  busy,
  displayName,
  onFollow,
  onBack,
  onOpen,
  onPlanner,
  onSettings,
  onSpeak,
}: {
  material: Material;
  recommendation: Recommendation;
  busy: boolean;
  displayName: string;
  onFollow: () => void;
  onBack: () => void;
  onOpen: (mode: Mode) => void;
  onPlanner: () => void;
  onSettings: () => void;
  onSpeak: (text?: string) => void;
}) {
  const [showReason, setShowReason] = useState(false);
  const concept = material.concepts.find(
    (c) => c.id === recommendation.concept_id,
  );
  const actions: Record<string, string> = {
    REVIEW: "Tinjau konsep",
    ADVANCE: "Lanjut belajar",
    PRACTICE: "Mulai latihan",
    RESCHEDULE: "Atur waktu belajar",
  };
  return (
    <Workspace screen={19}>
      <WorkspaceHeading
        title="Langkah berikutnya"
        description={material.title}
        back={onBack}
        actions={
          <button className="workspace-button" onClick={onSettings}>
            <UiIcon name="tune" />
            Atur tampilan
          </button>
        }
      />
      <section className="workspace-recommendation workspace-panel">
        <div className="workspace-recommendation-art" data-tone="lilac">
          <UiIcon
            name={
              recommendation.action === "RESCHEDULE"
                ? "event"
                : recommendation.action === "PRACTICE"
                  ? "quiz"
                  : "auto_stories"
            }
          />
        </div>
        <div>
          <span className="workspace-eyebrow">Saran untukmu</span>
          <h2>{recommendation.title || concept?.title || material.title}</h2>
          <span className="workspace-meta">
            <UiIcon name="schedule" />
            {recommendation.estimated_minutes} menit / {material.subject}
          </span>
          <p>{recommendation.reason}</p>
          <div className="workspace-actions">
            <button
              className="workspace-button primary"
              disabled={busy}
              onClick={onFollow}
            >
              {actions[recommendation.action]}
              <UiIcon name="arrow_forward" />
            </button>
            <button
              className="workspace-button"
              onClick={() => onSpeak(recommendation.reason)}
            >
              <UiIcon name="volume_up" />
              Dengarkan
            </button>
          </div>
        </div>
      </section>
      <div className="workspace-secondary-grid">
        <section className="workspace-panel">
          <h2>Cara belajar lain</h2>
          <div className="workspace-option-list">
            {recommendation.alternatives.map((alternative) => (
              <button
                className="workspace-button"
                disabled={busy}
                key={alternative.mode}
                onClick={() => onOpen(alternative.mode)}
              >
                {modeNames[alternative.mode]}
                <UiIcon name="arrow_forward" />
              </button>
            ))}
            {!recommendation.alternatives.length && (
              <p className="workspace-muted">
                Atur jadwal untuk melanjutkan saat kamu siap.
              </p>
            )}
          </div>
        </section>
        <section className="workspace-panel">
          <h2>Atur langkahmu</h2>
          <a
            href="#"
            className="workspace-subtle-link"
            onClick={(e) => {
              e.preventDefault();
              setShowReason(!showReason);
            }}
            aria-expanded={showReason}
          >
            Lihat Detail Alasannya
          </a>
          {showReason && (
            <p className="workspace-muted">
              {displayName}, saran memakai riwayat latihan dan waktu tersedia.{" "}
              {recommendation.estimate?.mastery == null
                ? "Estimasi penguasaan belum tersedia untuk konsep ini."
                : `Estimasi penguasaan ${Math.round(recommendation.estimate.mastery * 100)}%.`}
            </p>
          )}
          <a
            href="#"
            className="workspace-subtle-link"
            onClick={(e) => {
              e.preventDefault();
              onPlanner();
            }}
          >
            Lihat Penyesuaian di Rencana Belajar
          </a>
        </section>
      </div>
    </Workspace>
  );
}

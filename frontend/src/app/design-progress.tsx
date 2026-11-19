"use client";
import { useState } from "react";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
import type {
  LearningSession,
  Material,
  Mode,
  Progress,
  Recommendation,
} from "@/lib/types";
export function ProgressDesign({
  materials,
  sessions,
  selected,
  onSelect,
  progress,
  rec,
  error,
  start,
  onRefresh,
  onPlan,
  onSettings,
  onBack,
  displayName,
  timezone,
}: {
  materials: Material[];
  sessions: LearningSession[];
  selected: string;
  onSelect: (id: string) => void;
  progress: Progress | null;
  rec: Recommendation | null;
  error: string;
  start: (
    m: Material,
    mode?: Mode,
    conceptId?: string,
    practice?: boolean,
  ) => void;
  onRefresh: () => void;
  onPlan: () => void;
  onSettings: () => void;
  onBack: () => void;
  displayName: string;
  timezone: string;
}) {
  const material = materials.find((m) => m.id === selected),
    total = progress?.concepts.reduce((n, c) => n + c.observed.total, 0) || 0,
    correct =
      progress?.concepts.reduce((n, c) => n + c.observed.correct, 0) || 0,
    completed = new Set(
      sessions
        .filter((s) => s.material_id === selected)
        .flatMap((s) => s.completed_concepts),
    );
  const dateKey = (date: Date) =>
    date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: timezone,
    });
  const [now] = useState(() => Date.now());
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 86400000),
      key = dateKey(date);
    return {
      key,
      label: date.toLocaleDateString("id-ID", {
        weekday: "short",
        timeZone: timezone,
      }),
      count: sessions.filter(
        (s) =>
          s.material_id === selected && dateKey(new Date(s.updated_at)) === key,
      ).length,
    };
  });
  return (
    <Workspace screen={22}>
      <WorkspaceHeading
        title="Progres belajar"
        description="Ringkasan dari aktivitas yang tersimpan."
        back={onBack}
        actions={
          <>
            <button className="workspace-button" onClick={onRefresh}>
              <UiIcon name="refresh" />
              Perbarui progres
            </button>
            <button
              className="workspace-button"
              aria-label="Ekspor Rapor Mandiri PDF"
              onClick={() => window.print()}
            >
              <UiIcon name="download" />
              Cetak hasil
            </button>
          </>
        }
      />
      {selected === "manda-pythagoras" && (
        <p className="workspace-inline-message">
          Materi demo Manda ini sudah berisi enam jawaban contoh untuk ditinjau.
        </p>
      )}
      <div className="workspace-progress-filter">
        <label className="workspace-field">
          Materi
          <select
            aria-label="Materi progres"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
          >
            {materials.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <span className="workspace-muted">Seluruh riwayat</span>
      </div>
      {error && (
        <p role="alert" className="workspace-inline-error">
          {error}
        </p>
      )}
      <section className="progress-stats" aria-label="Ringkasan progres">
        {[
          {
            label: "Konsep dibaca",
            count: completed.size,
            icon: "auto_stories",
          },
          {
            label: "Sesi selesai",
            count: sessions.filter(
              (item) =>
                item.material_id === selected && item.status === "completed",
            ).length,
            icon: "task_alt",
          },
          { label: "Jawaban tersimpan", count: total, icon: "edit_note" },
          { label: "Jawaban tepat", count: correct, icon: "check_circle" },
        ].map((stat) => (
          <div key={stat.label} className="progress-stat">
            <UiIcon name={stat.icon} />
            <p>{stat.count}</p>
            <h2 className="progress-stat-label">{stat.label}</h2>
          </div>
        ))}
      </section>
      <div className="workspace-progress-layout">
        <section className="workspace-panel">
          <div className="workspace-panel-heading">
            <h2>Pemahaman per konsep</h2>
            <span>{progress?.concepts.length || 0} konsep</span>
          </div>
          {!progress ? (
            <p className="workspace-muted workspace-loading" role="status">
              {error ? "Progres belum dapat dimuat." : "Memuat progres..."}
            </p>
          ) : (
            progress.concepts.map((concept, index) => (
              <article className="workspace-progress-concept" key={concept.id}>
                <span className="workspace-step">{index + 1}</span>
                <div>
                  <h3>{concept.title}</h3>
                  <p>
                    {concept.observed.correct}/{concept.observed.total} jawaban
                    tepat
                  </p>
                  {concept.mastery === null ? (
                    <div className="workspace-muted">
                      Belum ada estimasi.
                      <details className="progress-help">
                        <summary>Kenapa?</summary>
                        <p>
                          {concept.mastery_status === "konsep belum didukung"
                            ? "Model belum mencakup konsep ini. Gunakan hasil jawaban dan pembahasan untuk memilih bagian yang ingin diulang."
                            : "Estimasi untuk konsep ini tersedia setelah tiga jawaban tersimpan."}
                        </p>
                      </details>
                    </div>
                  ) : (
                    <div className="workspace-mastery">
                      <progress
                        value={concept.mastery}
                        max={1}
                        aria-label={"Estimasi penguasaan " + concept.title}
                      />
                      <span>{Math.round(concept.mastery * 100)}% estimasi</span>
                    </div>
                  )}
                  <MistakeList mistakes={concept.mistakes} />
                  <button
                    className="workspace-subtle-link"
                    disabled={!material}
                    onClick={() =>
                      material && start(material, undefined, concept.id)
                    }
                  >
                    Tinjau konsep
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
        <aside className="workspace-progress-aside">
          <section className="workspace-panel">
            <div className="workspace-panel-heading">
              <h2>Ritme minggu ini</h2>
              <UiIcon name="bar_chart" />
            </div>
            <div className="workspace-week-chart">
              {days.map((day) => (
                <div key={day.key}>
                  <span className="workspace-day-count">{day.count}</span>
                  <div className="workspace-day-track">
                    <span
                      style={{
                        height: `${day.count ? Math.max(12, (day.count / Math.max(1, ...days.map((item) => item.count))) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <span>{day.label}</span>
                </div>
              ))}
            </div>
            <p className="workspace-muted">
              Sesi menurut pembaruan terakhir - {timezone}
            </p>
          </section>
          <section className="workspace-next-card">
            <span className="workspace-eyebrow">Langkah berikutnya</span>
            <h2>
              {rec?.title ||
                material?.concepts.find((item) => item.id === rec?.concept_id)
                  ?.title ||
                "Mulai satu konsep"}
            </h2>
            <p>
              {rec?.reason ||
                `${displayName}, pilih materi untuk mulai membangun riwayat belajar.`}
            </p>
            {rec?.practice_focus && (
              <p>
                <strong>Fokus latihan</strong> {rec.practice_focus}
              </p>
            )}
            <button
              className="workspace-button primary"
              disabled={!material}
              onClick={() =>
                rec?.action === "RESCHEDULE"
                  ? onPlan()
                  : material &&
                    start(
                      material,
                      undefined,
                      rec?.concept_id,
                      rec?.action === "PRACTICE",
                    )
              }
            >
              {rec?.action === "RESCHEDULE" ? "Atur waktu" : rec?.action === "PRACTICE" ? "Kerjakan latihan" : rec?.action === "REVIEW" ? "Ulangi konsep ini" : "Lanjut belajar"}
              <UiIcon name="arrow_forward" />
            </button>
            <div className="workspace-actions">
              <button className="workspace-subtle-link" onClick={onPlan}>
                Rencana belajar
              </button>
              <button className="workspace-subtle-link" onClick={onSettings}>
                Aksesibilitas
              </button>
            </div>
          </section>
        </aside>
      </div>
    </Workspace>
  );
}

function MistakeList({
  mistakes,
}: {
  mistakes: Progress["concepts"][number]["mistakes"];
}) {
  if (!mistakes?.length) return null;
  return (
    <details className="progress-help">
      <summary>Lihat jawaban yang perlu ditinjau</summary>
      <ol>
        {mistakes.map((item, index) => (
          <li key={index}>
            <strong>{item.prompt}</strong>
            <p>
              Dipilih: {item.selected}. Jawaban tepat: {item.correct}.
            </p>
            <p>{item.explanation}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}

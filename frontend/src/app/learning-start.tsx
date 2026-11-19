"use client";
import type { LearningSession, Material } from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";

export function LearningStart({
  materials,
  sessions,
  busy,
  start,
  onMaterials,
}: {
  materials: Material[];
  sessions: LearningSession[];
  busy: boolean;
  start: (material: Material) => void;
  onMaterials: () => void;
}) {
  const recent = sessions
    .filter(
      (session) =>
        session.status !== "completed" &&
        materials.some((material) => material.id === session.material_id),
    )
    .toSorted((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const material = materials.find((item) => item.id === recent?.material_id);
  const concept = material?.concepts.find(
    (item) => item.id === recent?.concept_id,
  );
  return (
    <Workspace screen={12}>
      <WorkspaceHeading
        title="Mulai belajar"
        description="Lanjutkan langkahmu atau pilih materi untuk hari ini."
      />
      {recent && material && (
        <section className="workspace-resume-card">
          <span className="workspace-resume-icon">
            <UiIcon name="auto_stories" />
          </span>
          <div>
            <span className="workspace-eyebrow">Lanjutkan sesi terakhir</span>
            <h2>{material.title}</h2>
            <p>{concept?.title || material.subject}</p>
            <span className="workspace-muted">
              Paragraf {recent.paragraph + 1} ·{" "}
              {recent.completed_concepts.length} konsep selesai
            </span>
          </div>
          <button
            className="workspace-button primary"
            disabled={busy}
            onClick={() => start(material)}
          >
            Lanjutkan sesi
            <UiIcon name="arrow_forward" />
          </button>
        </section>
      )}
      <section>
        <div className="workspace-panel-heading">
          <h2>{recent ? "Belajar materi lain" : "Mau mulai dari mana?"}</h2>
          <button className="workspace-subtle-link" onClick={onMaterials}>
            Kelola koleksi
          </button>
        </div>
        <div className="workspace-start-grid">
          {materials
            .filter((item) => item.id !== material?.id)
            .map((item, index) => (
              <article
                key={item.id}
                className="workspace-start-card"
                data-tone={
                  index % 3 === 0 ? "mint" : index % 3 === 1 ? "lilac" : "peach"
                }
              >
                <span className="workspace-start-icon">
                  <UiIcon name="menu_book" />
                </span>
                <span className="workspace-eyebrow">{item.subject}</span>
                <h3>{item.title}</h3>
                <p>
                  {item.concepts.length} konsep ·{" "}
                  {item.concepts.reduce(
                    (sum, c) => sum + c.estimated_minutes,
                    0,
                  )}{" "}
                  menit
                </p>
                <button
                  className="workspace-button"
                  disabled={busy}
                  onClick={() => start(item)}
                >
                  Mulai materi
                  <UiIcon name="arrow_forward" />
                </button>
              </article>
            ))}
        </div>
        {!materials.length && (
          <div className="workspace-panel workspace-empty">
            <UiIcon name="library_add" />
            <h3>Belum ada materi untuk dipelajari</h3>
            <p>Tambahkan sumber belajarmu ke koleksi terlebih dahulu.</p>
            <button className="workspace-button primary" onClick={onMaterials}>
              Buka Materi Saya
            </button>
          </div>
        )}
        {materials.length === 1 && material && (
          <p className="workspace-muted">
            Ingin belajar hal lain? Tambahkan materi di koleksimu.
          </p>
        )}
      </section>
    </Workspace>
  );
}

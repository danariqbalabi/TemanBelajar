"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
  LearningSession,
  Material,
  Mode,
  Progress,
  Recommendation,
} from "@/lib/types";
import type { Run } from "./page";
export function ProgressView({
  materials,
  sessions,
  run,
  start,
}: {
  materials: Material[];
  sessions: LearningSession[];
  run: Run;
  start: (m: Material, mode?: Mode, conceptId?: string) => void;
}) {
  const [selected, setSelected] = useState(materials[0]?.id || ""),
    [progress, setProgress] = useState<Progress | null>(null),
    [rec, setRec] = useState<Recommendation | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    if (!selected) return;
    Promise.all([
      api<Progress>(`/progress?material_id=${encodeURIComponent(selected)}`),
      api<Recommendation>(
        `/recommendations?material_id=${encodeURIComponent(selected)}&available_minutes=15`,
      ),
    ])
      .then(([p, r]) => {
        if (alive) {
          setProgress(p);
          setRec(r);
          setError("");
        }
      })
      .catch((e) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, [selected]);
  const material = materials.find((m) => m.id === selected);
  return (
    <>
      <h1>Progres Belajarmu</h1>
      <p>
        Hasil latihan membantu mengenali langkah selanjutnya. Angka bukan
        penilaian dirimu.
      </p>
      <label>
        Materi
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      <div className="stats progress-stats">
        <div>
          <small>Sesi materi selesai</small>
          <b>
            {
              sessions.filter(
                (s) => s.material_id === selected && s.status === "completed",
              ).length
            }
          </b>
        </div>
        <div>
          <small>Jawaban tercatat</small>
          <b>
            {progress?.concepts.reduce((n, c) => n + c.observed.total, 0) || 0}
          </b>
        </div>
      </div>
      <section>
        <h2>Pemahaman per konsep</h2>
        {progress?.concepts.map((c) => (
          <div className="concept-progress" key={c.id}>
            <div className="section-title">
              <h3>{c.title}</h3>
              <span>
                {c.observed.correct}/{c.observed.total} jawaban tepat
              </span>
            </div>
            {c.mastery === null ? (
              <p>
                Estimasi penguasaan belum tersedia. Skill perlu didukung model
                dan sedikitnya tiga jawaban tercatat.
              </p>
            ) : (
              <>
                <progress
                  value={c.mastery}
                  max={1}
                  aria-label={`Estimasi penguasaan ${c.title}`}
                />
                <p>
                  Estimasi model: {Math.round(c.mastery * 100)}% •{" "}
                  {c.mastery_status}
                </p>
              </>
            )}
            <small>
              {c.model_version
                ? `Model eksperimental ${c.model_version}`
                : "Belum ada estimasi model untuk konsep ini"}
            </small>
          </div>
        ))}
        {!progress && <p role="status">Memuat progres...</p>}
      </section>
      {rec && material && (
        <section className="hero">
          <span className="pill dark">LANGKAH BERIKUTNYA</span>
          <h2>
            {rec.title ||
              material.concepts.find((c) => c.id === rec.concept_id)?.title}
          </h2>
          <p>{rec.reason}</p>
          <div className="actions">
            <button
              className="primary"
              onClick={() => start(material, undefined, rec.concept_id)}
            >
              Ikuti saran ini
            </button>
            {rec.alternatives.map((a) => (
              <button
                key={a.mode}
                onClick={() => start(material, a.mode, rec.concept_id)}
              >
                {a.reason}
              </button>
            ))}
            <button
              onClick={() =>
                run(async () => {
                  const p = await api<Progress>(
                    `/progress?material_id=${selected}`,
                  );
                  setProgress(p);
                })
              }
            >
              Perbarui progres
            </button>
          </div>
        </section>
      )}
      <section>
        <h2>Membaca hasil dengan nyaman</h2>
        <p>
          Jawaban tepat adalah hasil yang diamati. Estimasi penguasaan memakai
          BKT eksperimental, saat ini khusus skill Pythagoras. Keduanya
          ditampilkan terpisah agar kamu tahu dasar rekomendasi.
        </p>
        <p>
          Belum ada jawaban? Mulai satu sesi pendek. Tidak ada streak yang harus
          dijaga.
        </p>
      </section>
    </>
  );
}

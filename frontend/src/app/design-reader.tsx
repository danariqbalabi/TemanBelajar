"use client";
import { useRef, useState } from "react";
import { readingStyle } from "./reading-style";
import { UiIcon } from "./workspace-ui";
import type { Material, LearningSession, Preferences } from "@/lib/types";

const formats = [
  ["reading", "Teman Baca"],
  ["focus", "Selangkah demi Selangkah"],
  ["explore", "Teks & Visual"],
  ["transcript", "Transkrip & audio"],
  ["standard", "Bacaan standar"],
] as const;

export function ReaderDesign({
  material,
  session,
  preferences,
  draft,
  setDraft,
  busy,
  feedback,
  speaking,
  onSpeak,
  update,
  onPractice,
  onSettings,
  onBack,
  onPreferences,
  elapsed,
}: {
  material: Material;
  session: LearningSession;
  preferences: Preferences;
  draft: string;
  setDraft: (s: string) => void;
  busy: boolean;
  feedback: string | null;
  speaking: boolean;
  onSpeak: (text?: string) => void;
  update: (patch: Partial<LearningSession>) => Promise<void>;
  onPractice: () => void;
  onSettings: () => void;
  onBack: () => void;
  onPreferences?: (p: Partial<Preferences>) => void;
  elapsed: number;
  displayName: string;
}) {
  const concept =
    material.concepts.find((c) => c.id === session.concept_id) ??
    material.concepts[0];
  const index = material.concepts.indexOf(concept);
  const sources = material.sources.filter((source) =>
    concept.source_ids.includes(source.id),
  );
  const [zen, setZen] = useState(false);
  const [notice, setNotice] = useState("");
  const sourceDialog = useRef<HTMLDialogElement>(null);
  const paused = session.status === "paused";
  const focus = session.mode === "focus";
  const audio = session.mode === "transcript";
  const visual = session.mode === "explore";
  const moreParagraphs =
    focus && session.paragraph < concept.paragraphs.length - 1;
  const done = session.completed_concepts.includes(concept.id);
  const nextConcept =
    material.concepts[index + 1] ??
    material.concepts.find(
      (c) => c.id !== concept.id && !session.completed_concepts.includes(c.id),
    );
  const paragraphs = focus
    ? [concept.paragraphs[session.paragraph]]
    : concept.paragraphs;
  const caption = concept.diagram_description;
  const photosynthesis =
    visual &&
    material.id === "demo-fotosintesis" &&
    concept.id === "peran-cahaya";

  function moveTo(target: typeof concept) {
    const unavailable =
      (audio && !target.transcript) || (visual && !target.diagram_description);
    return {
      concept_id: target.id,
      paragraph: 0,
      mode: unavailable ? ("reading" as const) : session.mode,
    };
  }

  function advance() {
    if (paused) {
      void update({ status: "active" });
      return;
    }
    if (moreParagraphs) {
      void update({ paragraph: session.paragraph + 1 });
      return;
    }
    const completed = [...new Set([...session.completed_concepts, concept.id])];
    void update({
      completed_concepts: completed,
      ...(nextConcept ? moveTo(nextConcept) : { status: "completed" }),
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        audio && concept.transcript
          ? concept.transcript
          : paragraphs.join("\n\n"),
      );
      setNotice("Bacaan disalin.");
    } catch {
      setNotice("Salin belum berhasil. Kamu bisa memilih teks secara manual.");
    }
  }

  return (
    <div className="stitch-reader lesson-reader" data-zen={zen}>
      <div className="lesson-shell">
        <header className="lesson-toolbar">
          <button
            type="button"
            className="workspace-button"
            onClick={onBack}
            disabled={busy}
          >
            <UiIcon name="arrow_back" /> Keluar dari bacaan
          </button>
          <label>
            Format belajar
            <select
              data-tour="format"
              aria-label="Format belajar"
              value={session.mode}
              disabled={busy}
              onChange={(event) =>
                void update({
                  mode: event.target.value as LearningSession["mode"],
                })
              }
            >
              {formats.map(([mode, label]) => (
                <option
                  key={mode}
                  value={mode}
                  disabled={
                    (mode === "explore" && !caption) ||
                    (mode === "transcript" && !concept.transcript)
                  }
                >
                  {label}
                </option>
              ))}
            </select>
          </label>
        </header>
        <article className="lesson-stage">
          <div className="lesson-heading">
            <div>
              <p>{material.title}</p>
              <h1>{concept.title}</h1>
            </div>
            <div className="lesson-progress">
              <span>
                Konsep {index + 1} dari {material.concepts.length}
              </span>
              <progress
                aria-label="Konsep selesai"
                value={session.completed_concepts.length}
                max={material.concepts.length}
              />
              {preferences.timer_enabled && (
                <span>
                  {Math.floor(elapsed / 60)} m {elapsed % 60} d
                </span>
              )}
            </div>
          </div>
          <div className="lesson-content" style={readingStyle(preferences)}>
            {audio ? (
              <>
                <button
                  className="workspace-button"
                  type="button"
                  onClick={() => onSpeak()}
                >
                  <UiIcon name={speaking ? "stop" : "volume_up"} />{" "}
                  {speaking ? "Hentikan audio" : "Putar audio"}
                </button>
                <p className="whitespace-pre-wrap">
                  {concept.transcript || concept.paragraphs.join("\n\n")}
                </p>
              </>
            ) : (
              <>
                {focus && (
                  <p className="lesson-step">
                    Bagian {session.paragraph + 1} dari{" "}
                    {concept.paragraphs.length}
                  </p>
                )}
                {photosynthesis && (
                  <div className="lesson-map" aria-label="Alur fotosintesis">
                    <details>
                      <summary>
                        <UiIcon name="light_mode" /> Masukan
                      </summary>
                      <p>
                        Cahaya memberi energi. Air dan karbon dioksida menjadi
                        bahan.
                      </p>
                    </details>
                    <details>
                      <summary>
                        <UiIcon name="eco" /> Di dalam daun
                      </summary>
                      <p>Tumbuhan memakai energi cahaya untuk membuat gula.</p>
                    </details>
                    <details>
                      <summary>
                        <UiIcon name="air" /> Hasil
                      </summary>
                      <p>Gula terbentuk dan oksigen dilepaskan.</p>
                    </details>
                  </div>
                )}
                {visual && caption && (
                  <details
                    className="lesson-visual"
                    open={preferences.captions || undefined}
                  >
                    <summary>
                      <UiIcon name="image" /> Deskripsi visual
                    </summary>
                    <p>{caption}</p>
                  </details>
                )}
                {paragraphs.map((part, i) => (
                  <p
                    key={i}
                    className={
                      session.mode === "reading" &&
                      preferences.reading_ruler &&
                      i === session.paragraph
                        ? "lesson-ruler"
                        : undefined
                    }
                  >
                    {part}
                  </p>
                ))}
              </>
            )}
          </div>
          <footer className="lesson-actions">
            <button
              type="button"
              className="workspace-button"
              disabled={busy || (!index && !(focus && session.paragraph))}
              onClick={() =>
                void update(
                  focus && session.paragraph
                    ? { paragraph: session.paragraph - 1 }
                    : moveTo(material.concepts[index - 1]),
                )
              }
            >
              Sebelumnya
            </button>
            <button
              type="button"
              className="workspace-button primary"
              data-tour="advance"
              disabled={busy}
              onClick={
                session.status === "completed" &&
                !moreParagraphs &&
                !nextConcept
                  ? onPractice
                  : advance
              }
            >
              {paused
                ? "Lanjutkan belajar"
                : moreParagraphs
                  ? "Bagian berikutnya"
                  : nextConcept
                    ? done
                      ? "Lanjut konsep"
                      : "Selesai & lanjut"
                    : session.status === "completed"
                      ? "Cek pemahaman"
                      : "Selesaikan materi"}{" "}
              <UiIcon name="arrow_forward" />
            </button>
          </footer>
        </article>
        <div className="lesson-extras">
          <details>
            <summary>
              <UiIcon name="tune" /> Alat bantu
            </summary>
            <div className="lesson-tools">
              {!audio && (
                <button
                  className="workspace-button"
                  onClick={() =>
                    onSpeak(speaking ? undefined : paragraphs.join(" "))
                  }
                >
                  {speaking ? "Hentikan audio" : "Bacakan teks"}
                </button>
              )}
              {session.mode === "reading" && onPreferences && (
                <button
                  className="workspace-button"
                  aria-pressed={preferences.reading_ruler}
                  onClick={() =>
                    onPreferences({ reading_ruler: !preferences.reading_ruler })
                  }
                >
                  Penggaris baca
                </button>
              )}
              <button
                className="workspace-button"
                aria-pressed={zen}
                onClick={() => setZen(!zen)}
              >
                Fokus penuh
              </button>
              <button className="workspace-button" onClick={copy}>
                Salin bacaan
              </button>
              <button
                className="workspace-button"
                disabled={!sources.length}
                onClick={() => sourceDialog.current?.showModal()}
              >
                Sumber materi
              </button>
              <button
                className="workspace-button"
                disabled={busy || paused || session.status === "completed"}
                onClick={() => void update({ status: "paused" })}
              >
                Jeda belajar
              </button>
              <button className="workspace-button" onClick={onSettings}>
                Atur aksesibilitas
              </button>
              {session.status !== "completed" && (
                <button
                  className="workspace-button"
                  disabled={busy}
                  onClick={onPractice}
                >
                  Cek pemahaman
                </button>
              )}
            </div>
          </details>
          <details>
            <summary>
              <UiIcon name="edit_note" /> Catatan sesi
            </summary>
            <label className="sr-only" htmlFor="lesson-note">
              Catatan sesi
            </label>
            <textarea
              id="lesson-note"
              value={draft}
              maxLength={3000}
              rows={3}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              type="button"
              className="workspace-button"
              disabled={busy}
              onClick={() => void update({})}
            >
              Simpan catatan
            </button>
          </details>
        </div>
        <p role="status">{notice || feedback}</p>
      </div>
      <dialog
        ref={sourceDialog}
        className="stitch-reason"
        aria-label="Sumber materi"
      >
        <h2>Sumber materi</h2>
        {sources.map((source) => (
          <section key={source.id}>
            <h3>{source.label}</h3>
            <p className="whitespace-pre-wrap">{source.text}</p>
          </section>
        ))}
        <button
          className="workspace-button"
          onClick={() => sourceDialog.current?.close()}
        >
          Tutup sumber
        </button>
      </dialog>
    </div>
  );
}

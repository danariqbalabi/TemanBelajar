"use client";
import { useEffect, useState } from "react";
import { api, mutation } from "@/lib/api";
import type {
  Attempt,
  LearningSession,
  Material,
  Mode,
  Preferences,
  Recommendation,
} from "@/lib/types";
import type { Run } from "./page";
import { modeNames } from "./materials";
import { Mimo } from "./profile";
export function Reader({
  material,
  session,
  preferences,
  run,
  busy,
  onUpdate,
  refresh,
  onPlanner,
}: {
  material: Material;
  session: LearningSession;
  preferences: Preferences;
  run: Run;
  busy: boolean;
  onUpdate: (s: LearningSession) => void;
  refresh: () => Promise<void>;
  onPlanner: () => void;
}) {
  const [draft, setDraft] = useState(session.draft),
    [attempt, setAttempt] = useState<Attempt | null>(null),
    [choice, setChoice] = useState<number | null>(null),
    [feedback, setFeedback] = useState<string | null>(null),
    [rec, setRec] = useState<Recommendation | null>(null),
    [speaking, setSpeaking] = useState(false),
    [elapsed, setElapsed] = useState(0);
  const concept =
      material.concepts.find((c) => c.id === session.concept_id) ||
      material.concepts[0],
    index = material.concepts.indexOf(concept),
    paragraph = session.paragraph;
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, [concept.id, session.mode]);
  useEffect(() => {
    if (!preferences.timer_enabled) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [preferences.timer_enabled]);
  function update(patch: Partial<LearningSession>) {
    const save = mutation<LearningSession>(
      `/sessions/${session.id}`,
      {
        expected_version: session.version,
        concept_id: session.concept_id,
        paragraph,
        mode: session.mode,
        status: "active",
        completed_concepts: session.completed_concepts,
        draft,
        ...patch,
      },
      "PUT",
    );
    return run(async () => {
      const next = await save();
      onUpdate(next);
      setFeedback("Tersimpan. Kamu bisa melanjutkan kapan saja.");
    });
  }
  function practice() {
    const create = mutation<Attempt>("/attempts", { session_id: session.id });
    run(async () => {
      setAttempt(await create());
      setChoice(null);
      setFeedback(null);
      setRec(null);
    });
  }
  async function recommendation() {
    setRec(
      await api<Recommendation>(
        `/recommendations?material_id=${encodeURIComponent(material.id)}&available_minutes=15`,
      ),
    );
    await refresh();
  }
  const nextQuestion = attempt?.questions.find((q) => !attempt.answers[q.id]);
  function answer() {
    if (!attempt || !nextQuestion || choice === null) return;
    const send = mutation<Attempt>(`/attempts/${attempt.id}/answers`, {
      expected_version: attempt.version,
      question_id: nextQuestion.id,
      selected_index: choice,
    });
    run(async () => {
      const result = await send();
      setAttempt(result);
      setFeedback(nextQuestion.id);
      setChoice(null);
      if (result.status === "completed") await recommendation();
    });
  }
  function speak() {
    if (!("speechSynthesis" in window)) {
      setFeedback(
        "Baca nyaring belum tersedia pada browser ini. Transkrip tetap bisa dibaca.",
      );
      return;
    }
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const speech = new SpeechSynthesisUtterance(
      concept.transcript || concept.paragraphs.join(" "),
    );
    speech.lang = "id-ID";
    speech.rate = preferences.speech_rate;
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);
    speechSynthesis.speak(speech);
    setSpeaking(true);
  }
  if (attempt) {
    const last = feedback
      ? attempt.questions.find((q) => q.id === feedback)
      : null;
    const complete = attempt.status === "completed";
    return (
      <section className="reader">
        <span className="pill">LATIHAN TANPA TIMER</span>
        <h1>
          {complete
            ? "Satu langkah lagi sudah kamu jalani."
            : "Pelan-pelan, satu pertanyaan dulu."}
        </h1>
        <p>
          {Object.keys(attempt.answers).length} dari {attempt.questions.length}{" "}
          pertanyaan dijawab
        </p>
        <progress
          aria-label="Progres latihan"
          value={Object.keys(attempt.answers).length}
          max={attempt.questions.length}
        />
        {last && (
          <div className="answer-feedback" role="status">
            <h2>
              {attempt.answers[last.id].correct
                ? "Pemahamanmu sudah tepat."
                : "Belum tepat, kita pahami bareng."}
            </h2>
            <p>{last.explanation}</p>
            <p>Jawaban yang tepat: {last.options[last.correct_index ?? 0]}</p>
            <details>
              <summary>Lihat sumber penjelasan</summary>
              {material.sources
                .filter((s) => last.source_ids.includes(s.id))
                .map((s) => (
                  <p key={s.id}>
                    <b>{s.label}</b>
                    <br />
                    {s.text}
                  </p>
                ))}
            </details>
          </div>
        )}
        {!complete && nextQuestion && (!last || !feedback) ? (
          <>
            <h2>{nextQuestion.prompt}</h2>
            <fieldset className="answers">
              <legend>Pilih satu jawaban</legend>
              {nextQuestion.options.map((o, i) => (
                <label key={i} className={choice === i ? "selected" : ""}>
                  <input
                    type="radio"
                    name="answer"
                    checked={choice === i}
                    onChange={() => setChoice(i)}
                  />
                  {o}
                </label>
              ))}
            </fieldset>
            <button
              className="primary"
              disabled={choice === null || busy}
              onClick={answer}
            >
              Simpan jawaban →
            </button>
          </>
        ) : !complete ? (
          <button className="primary" onClick={() => setFeedback(null)}>
            Pertanyaan berikutnya →
          </button>
        ) : (
          <>
            <h2>
              {Object.values(attempt.answers).filter((a) => a.correct).length}{" "}
              dari {attempt.questions.length} jawaban tepat
            </h2>
            <p>
              Hasil ini membantu menentukan langkah berikutnya. Kamu boleh
              mencoba lagi tanpa penalti.
            </p>
            {rec && (
              <div className="reason">
                <h3>Langkah berikutnya bersama Mimo</h3>
                <p>{rec.reason}</p>
                <p>
                  {rec.estimated_minutes} menit • {rec.action}
                </p>
                <button
                  onClick={() => {
                    setAttempt(null);
                    setFeedback(null);
                    update({ concept_id: rec.concept_id, paragraph: 0 });
                  }}
                >
                  Buka konsep yang disarankan
                </button>
                {rec.alternatives.map((a) => (
                  <button
                    key={a.mode}
                    onClick={() => {
                      setAttempt(null);
                      update({ mode: a.mode });
                    }}
                  >
                    {modeNames[a.mode]}
                  </button>
                ))}
                <button onClick={onPlanner}>Tinjau rencana belajar</button>
              </div>
            )}
            <div className="actions">
              <button onClick={practice} disabled={busy}>
                Ulang latihan
              </button>
              <button
                onClick={() => {
                  setAttempt(null);
                  setFeedback(null);
                }}
              >
                Kembali ke bacaan
              </button>
            </div>
          </>
        )}
        <button
          className="text-button"
          onClick={() => {
            setAttempt(null);
            setFeedback(null);
          }}
        >
          Jeda dan kembali ke materi
        </button>
      </section>
    );
  }
  return (
    <>
      <div className="section-title">
        <div>
          <span className="pill">
            {material.subject} • KONSEP {index + 1}/{material.concepts.length}
          </span>
          <h1>{material.title}</h1>
        </div>
        <button disabled={busy} onClick={() => update({ status: "paused" })}>
          Simpan & jeda
        </button>
      </div>
      <section className={`reader mode-${session.mode}`}>
        <div className="section-title">
          <span>{session.completed_concepts.length} konsep selesai</span>
          <select
            aria-label="Format belajar"
            value={session.mode}
            disabled={busy}
            onChange={(e) => update({ mode: e.target.value as Mode })}
          >
            {(
              [
                "standard",
                "reading",
                "focus",
                "explore",
                "transcript",
              ] as Mode[]
            )
              .filter(
                (m) =>
                  (m !== "explore" && m !== "transcript") ||
                  material.concepts.every((c) =>
                    m === "explore" ? c.diagram_description : c.transcript,
                  ),
              )
              .map((m) => (
                <option key={m} value={m}>
                  {modeNames[m]}
                </option>
              ))}
          </select>
        </div>
        <progress
          aria-label="Progres membaca"
          value={session.completed_concepts.length}
          max={material.concepts.length}
        />
        <h2>{concept.title}</h2>
        {preferences.timer_enabled && (
          <p aria-live="off">
            Waktu sesi: {Math.floor(elapsed / 60)}:
            {String(elapsed % 60).padStart(2, "0")} • tidak ada batas waktu
          </p>
        )}
        {preferences.show_mimo && (
          <div className="reader-mimo">
            <Mimo />
            <p>
              Satu konsep dulu. Kalau perlu jeda, catatan dan posisimu bisa
              disimpan.
            </p>
          </div>
        )}
        <div
          className={`reading ${preferences.reading_ruler ? "ruler" : ""} font-${preferences.font_family}`}
        >
          {session.mode === "explore" ? (
            <figure className="diagram">
              <div className="diagram-flow">
                <span>Sumber</span>
                <span aria-hidden="true">→</span>
                <span>Proses</span>
                <span aria-hidden="true">→</span>
                <span>Hasil</span>
              </div>
              <figcaption>{concept.diagram_description}</figcaption>
            </figure>
          ) : session.mode === "transcript" ? (
            <>
              <button onClick={speak}>
                {speaking ? "Hentikan audio" : "Bacakan transkrip"}
              </button>
              {preferences.captions && <p>{concept.transcript}</p>}
            </>
          ) : session.mode === "focus" ? (
            <>
              <p>{concept.paragraphs[paragraph]}</p>
              <div className="actions">
                <button
                  disabled={paragraph === 0 || busy}
                  onClick={() => update({ paragraph: paragraph - 1 })}
                >
                  ← Paragraf sebelumnya
                </button>
                <span>
                  {paragraph + 1}/{concept.paragraphs.length}
                </span>
                <button
                  disabled={paragraph >= concept.paragraphs.length - 1 || busy}
                  onClick={() => update({ paragraph: paragraph + 1 })}
                >
                  Paragraf berikutnya →
                </button>
              </div>
            </>
          ) : (
            concept.paragraphs.map((p, i) => (
              <p key={i} tabIndex={preferences.reading_ruler ? 0 : undefined}>
                {p}
              </p>
            ))
          )}
        </div>
        <details>
          <summary>Sumber bacaan</summary>
          {material.sources
            .filter((s) => concept.source_ids.includes(s.id))
            .map((s) => (
              <article key={s.id}>
                <h3>{s.label}</h3>
                <p>{s.text}</p>
              </article>
            ))}
        </details>
        <label className="notes-label">
          Catatan kecilmu
          <textarea
            value={draft}
            maxLength={3000}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Apa yang baru kamu pahami?"
          />
        </label>
        <button disabled={busy} onClick={() => update({})}>
          Simpan catatan
        </button>
        <div className="actions reader-navigation">
          <button
            disabled={index === 0 || busy}
            onClick={() =>
              update({
                concept_id: material.concepts[index - 1].id,
                paragraph: 0,
              })
            }
          >
            ← Konsep sebelumnya
          </button>
          <button
            className="primary"
            disabled={busy}
            onClick={() => {
              const completed = Array.from(
                new Set([...session.completed_concepts, concept.id]),
              );
              update({
                completed_concepts: completed,
                ...(index < material.concepts.length - 1
                  ? {
                      concept_id: material.concepts[index + 1].id,
                      paragraph: 0,
                    }
                  : {
                      status:
                        completed.length === material.concepts.length
                          ? "completed"
                          : "active",
                    }),
              });
            }}
          >
            {index < material.concepts.length - 1
              ? "Tandai selesai & lanjut →"
              : "Tandai konsep selesai"}
          </button>
          <button disabled={busy} onClick={practice}>
            Coba latihan
          </button>
        </div>
        {feedback && (
          <p className="success" role="status">
            {feedback}
          </p>
        )}
      </section>
    </>
  );
}

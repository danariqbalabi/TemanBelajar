"use client";
import { AnswerWalkthrough } from "./answer-walkthrough";
import { MimoAnswerHelp } from "./mimo-answer-help";
import { useEffect, useRef, useState } from "react";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
import type { Attempt, Material, Preferences } from "@/lib/types";
import { readingStyle } from "./reading-style";
export function QuestionDesign({
  attempt,
  material,
  preferences,
  question,
  choice,
  answered,
  busy,
  onChoice,
  onAnswer,
  onNext,
  onPause,
  onSpeak,
  speaking,
  audioNotice,
  displayName,
}: {
  attempt: Attempt;
  material: Material;
  preferences: Preferences;
  question: Attempt["questions"][number];
  choice: number | null;
  answered: boolean;
  busy: boolean;
  onChoice: (n: number | null) => void;
  onAnswer: () => void;
  onNext: () => void;
  onPause: () => void;
  onSpeak: (text?: string) => void;
  speaking: boolean;
  audioNotice: string | null;
  displayName: string;
}) {
  const [hints, setHints] = useState(false),
    [scratch, setScratch] = useState("");
  const [large, setLarge] = useState(false);
  const scratchKey = "temanbelajar-scratch:" + attempt.id;
  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(scratchKey) || "null");
        if (saved && alive) {
          setScratch(saved.text || "");
          if (
            saved.question === question.id &&
            !answered &&
            Number.isInteger(saved.choice) &&
            saved.choice >= 0 &&
            saved.choice < question.options.length
          )
            onChoice(saved.choice);
        }
      } catch {}
    });
    return () => {
      alive = false;
    };
  }, [scratchKey, question.id, question.options.length, answered, onChoice]);
  function persist(text: string, selection: number | null) {
    try {
      localStorage.setItem(
        scratchKey,
        JSON.stringify({ text, choice: selection, question: question.id }),
      );
    } catch {}
  }
  function scratchChange(text: string) {
    setScratch(text);
    persist(text, choice);
  }
  function select(i: number) {
    onChoice(i);
    persist(scratch, i);
  }
  const prompt = useRef<HTMLHeadingElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    (answered ? result.current : prompt.current)?.focus();
  }, [answered, question.id]);
  const index = attempt.question_ids.indexOf(question.id);
  const done = Object.keys(attempt.answers).length;
  return (
    <Workspace screen={17}>
      <WorkspaceHeading
        title="Latihan pemahaman"
        description={material.title}
        back={onPause}
        actions={
          <>
            <button
              className="workspace-button"
              onClick={() => onSpeak(speaking ? undefined : [
                question.prompt,
                ...question.options.map((option, i) => `Pilihan ${String.fromCharCode(65 + i)}. ${option}`),
              ].join(" "))}
            >
              <UiIcon name="volume_up" />
              {speaking ? "Hentikan bacaan" : "Bacakan soal dan pilihan"}
            </button>
            <button
              className="workspace-button"
              aria-pressed={large}
              onClick={() => setLarge(!large)}
            >
              Ukuran teks {large ? "normal" : "besar"}
            </button>
          </>
        }
      />
      <div role="status">{audioNotice}</div>
      <div className="workspace-question-progress">
        <span>
          Soal {index + 1} dari {attempt.questions.length}
        </span>
        <progress
          value={done}
          max={attempt.questions.length}
          aria-label="Progres latihan"
        />
        <span>{done} dijawab</span>
      </div>
      <div className="workspace-question-layout">
        <section
          className="workspace-panel workspace-question"
          style={{ ...readingStyle(preferences), fontSize: preferences.font_size * (large ? 1.25 : 1) }}
        >
          <span className="workspace-eyebrow">Pilih satu jawaban</span>
          <h2 ref={prompt} id="quiz-prompt" tabIndex={-1}>{question.prompt}</h2>
          <fieldset
            aria-labelledby="quiz-prompt"
            data-tour="choices"
            className="workspace-answers"
            disabled={busy || answered}
          >
            <legend className="sr-only">Pilih salah satu jawaban</legend>
            {question.options.map((option, i) => (
              <label
                key={i}
                data-selected={
                  (answered
                    ? attempt.answers[question.id]?.selected_index
                    : choice) === i
                }
                data-correct={answered && question.correct_index === i}
              >
                <input
                  type="radio"
                  name="answer"
                  aria-label={option}
                  checked={
                    (answered
                      ? attempt.answers[question.id]?.selected_index
                      : choice) === i
                  }
                  onChange={() => select(i)}
                />
                <span className="workspace-answer-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          {answered ? (
            <div className="workspace-answer-feedback">
              <h3 ref={result} tabIndex={-1} aria-describedby="quiz-explanation">
                {attempt.answers[question.id]?.correct
                  ? "Tepat!"
                  : "Mari tinjau kembali"}
              </h3>
              <p id="quiz-explanation">
                {!attempt.answers[question.id]?.correct && question.correct_index != null &&
                  "Jawaban yang tepat adalah " + question.options[question.correct_index] + ". "}
                {question.explanation}
              </p>
              <AnswerWalkthrough question={question} answer={attempt.answers[question.id]} sources={material.sources} onSpeak={onSpeak} />
              {attempt.answers[question.id]?.correct === false && (
                <MimoAnswerHelp
                  key={attempt.id + ":" + question.id}
                  attemptId={attempt.id}
                  questionId={question.id}
                  sources={material.sources}
                  preferences={preferences}
                  onSpeak={onSpeak}
                />
              )}
              <button
                className="workspace-button primary"
                data-tour="feedback"
                onClick={onNext}
                disabled={busy}
              >
                Pertanyaan berikutnya
                <UiIcon name="arrow_forward" />
              </button>
            </div>
          ) : (
            <div className="workspace-question-submit">
              <button
                className="workspace-button primary"
                disabled={busy || choice === null}
                data-tour="submit"
                onClick={onAnswer}
              >
                Periksa Jawaban Sekarang
                <UiIcon name="arrow_forward" />
              </button>
            </div>
          )}
        </section>
        <aside className="workspace-question-tools">
          <section className="workspace-panel">
            <h2>Catatan pribadi (opsional)</h2>
            <label className="workspace-field">
              <span className="sr-only">Catatan latihan</span>
              <textarea
                aria-label="Catatan latihan"
                rows={5}
                maxLength={3000}
                value={scratch}
                onChange={(e) => scratchChange(e.target.value)}
                placeholder="Tulis cara berpikirmu di sini..."
              />
            </label>
            <span className="workspace-muted">
              Untuk mencatat kata kunci atau cara berpikir. Catatan tersimpan di
              browser ini dan tidak dikirim sebagai jawaban.
            </span>
          </section>
          <section className="workspace-panel">
            <button
              className="workspace-subtle-link"
              aria-expanded={hints}
              onClick={() => setHints(!hints)}
            >
              Butuh petunjuk?
            </button>
            {hints && (
              <p className="workspace-muted">
                Baca kembali kata kunci soal. {displayName}, kamu bisa kembali
                ke materi dan melanjutkan latihan ini nanti.
              </p>
            )}
            {answered && (
              <details className="workspace-disclosure">
                <summary>Lihat sumber soal</summary>
                {material.sources
                  .filter((source) => question.source_ids.includes(source.id))
                  .map((source) => (
                    <div key={source.id}>
                      <strong>{source.label}</strong>
                      <p>{source.text}</p>
                    </div>
                  ))}
              </details>
            )}
          </section>
        </aside>
      </div>
    </Workspace>
  );
}

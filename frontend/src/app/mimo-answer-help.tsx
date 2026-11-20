"use client";

import { useId, useRef, useState } from "react";
import { api } from "@/lib/api";
import { userMessage } from "@/lib/errors";
import type { Material, Preferences } from "@/lib/types";
import { readingStyle } from "./reading-style";

type HelpMode = "steps" | "simple";
type AnswerHelp = {
  explanation: string[];
  source_id: string;
  source_quote: string;
  practice: {
    prompt: string;
    options: string[];
    correct_index: number;
    explanation: string;
  };
};

export function MimoAnswerHelp({
  attemptId,
  questionId,
  sources,
  preferences,
  onSpeak,
}: {
  attemptId: string;
  questionId: string;
  sources: Material["sources"];
  preferences: Preferences;
  onSpeak: (text: string) => void;
}) {
  const radioName = useId();
  const running = useRef(false);
  const [cache, setCache] = useState<Partial<Record<HelpMode, AnswerHelp>>>({});
  const [mode, setMode] = useState<HelpMode | null>(null);
  const [pending, setPending] = useState(false);
  const [issue, setIssue] = useState("");
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const help = mode ? cache[mode] : undefined;
  const source = sources.find((item) => item.id === help?.source_id);
  const explanation = help
    ? mode === "steps"
      ? [help.explanation[step]]
      : help.explanation
    : [];

  async function chooseMode(next: HelpMode) {
    if (running.current || (next === mode && help)) return;
    setMode(next);
    setStep(0);
    setChoice(null);
    setChecked(false);
    setIssue("");
    if (cache[next]) return;
    running.current = true;
    setPending(true);
    try {
      const result = await api<AnswerHelp>(
        `/attempts/${encodeURIComponent(attemptId)}/questions/${encodeURIComponent(questionId)}/help`,
        { mode: next },
      );
      setCache((previous) => ({ ...previous, [next]: result }));
    } catch (error) {
      setIssue(userMessage(error));
    } finally {
      setPending(false);
      running.current = false;
    }
  }

  return (
    <details className="workspace-disclosure mimo-answer-help">
      <summary>Mimo bantu aku paham</summary>
      <p>AI menjelaskan ulang berdasarkan materi dan jawabanmu.</p>
      <div className="workspace-actions">
        <button
          type="button"
          className="workspace-button"
          disabled={pending}
          aria-pressed={mode === "steps"}
          onClick={() => void chooseMode("steps")}
        >
          Pecah jadi langkah kecil
        </button>
        <button
          type="button"
          className="workspace-button"
          disabled={pending}
          aria-pressed={mode === "simple"}
          onClick={() => void chooseMode("simple")}
        >
          Jelasin lebih sederhana
        </button>
      </div>
      <p role="status">
        {pending
          ? "Mimo lagi nyiapin penjelasan…"
          : help
            ? "Penjelasan AI siap dibaca."
            : ""}
      </p>
      {issue && <p role="alert">{issue}</p>}
      {help && (
        <div style={readingStyle(preferences)}>
          <div aria-live="polite" aria-atomic="true">
            <strong>
              {mode === "steps"
                ? `Langkah ${step + 1} dari ${help.explanation.length}`
                : "Penjelasan sederhana"}
            </strong>
            {explanation.map((part, index) => (
              <p
                key={index}
                className={
                  preferences.reading_ruler ? "lesson-ruler" : undefined
                }
              >
                {part}
              </p>
            ))}
          </div>
          <div className="workspace-actions">
            {mode === "steps" && (
              <>
                <button
                  type="button"
                  className="workspace-button"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  Langkah sebelumnya
                </button>
                <button
                  type="button"
                  className="workspace-button"
                  disabled={step === help.explanation.length - 1}
                  onClick={() => setStep(step + 1)}
                >
                  Langkah berikutnya
                </button>
              </>
            )}
            <button
              type="button"
              className="workspace-button"
              onClick={() => onSpeak(explanation.join(" "))}
            >
              Bacakan penjelasan
            </button>
          </div>
          <details className="workspace-disclosure">
            <summary>Cek sumber penjelasan</summary>
            <strong>{source?.label ?? "Sumber materi"}</strong>
            <blockquote>{help.source_quote}</blockquote>
          </details>
          {(mode === "simple" || step === help.explanation.length - 1) && (
            <fieldset className="mimo-help-practice" disabled={checked}>
              <legend>Cek pemahaman</legend>
              <small>Soal tambahan ini tidak mengubah skor latihanmu.</small>
              <p>{help.practice.prompt}</p>
              {help.practice.options.map((option, index) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={radioName}
                    checked={choice === index}
                    onChange={() => setChoice(index)}
                  />
                  {option}
                </label>
              ))}
              <button
                type="button"
                className="workspace-button"
                disabled={choice === null}
                onClick={() => setChecked(true)}
              >
                Cek jawabanku
              </button>
            </fieldset>
          )}
          {checked &&
            (mode === "simple" || step === help.explanation.length - 1) && (
              <div role="status">
                <strong>
                  {choice === help.practice.correct_index
                    ? "Tepat! Kamu bisa lanjut."
                    : "Belum tepat. Coba baca alasannya atau pilih format bantuan lain."}
                </strong>
                {choice !== help.practice.correct_index && (
                  <p>
                    Jawaban yang tepat:{" "}
                    {help.practice.options[help.practice.correct_index]}
                  </p>
                )}
                <p>{help.practice.explanation}</p>
              </div>
            )}
        </div>
      )}
    </details>
  );
}

"use client";
import { useState } from "react";
import type { Attempt, Material } from "@/lib/types";

export function AnswerWalkthrough({ question, answer, sources, onSpeak }: {
  question: Attempt["questions"][number];
  answer?: Attempt["answers"][string];
  sources: Material["sources"];
  onSpeak: (text: string) => void;
}) {
  const [index, setIndex] = useState(0);
  if (!answer || question.correct_index == null) return null;
  const steps = [
    { title: "Jawabanmu", text: question.options[answer.selected_index] },
    ...(question.selected_hint ? [{ title: "Periksa pilihanmu", text: question.selected_hint }] : []),
    { title: "Pembahasan", text: question.explanation || question.options[question.correct_index] },
    ...sources.filter(source => question.source_ids.includes(source.id))
      .map(source => ({ title: source.label, text: source.text })),
  ];
  const step = steps[index];
  return (
    <details className="workspace-disclosure" onToggle={event => {
      if (!event.currentTarget.open) setIndex(0);
    }}>
      <summary>Jelaskan langkah ini</summary>
      <div aria-live="polite" aria-atomic="true">
        <strong>Langkah {index + 1} dari {steps.length} · {step.title}</strong>
        <p>{step.text}</p>
      </div>
      <div className="workspace-actions">
        <button type="button" className="workspace-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Sebelumnya</button>
        <button type="button" className="workspace-button" disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>Berikutnya</button>
        <button type="button" className="workspace-subtle-link" onClick={() => onSpeak(step.title + ". " + step.text)}>Bacakan langkah</button>
      </div>
    </details>
  );
}

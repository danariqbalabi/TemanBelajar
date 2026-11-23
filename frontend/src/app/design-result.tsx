"use client";
import { AnswerWalkthrough } from "./answer-walkthrough";
import { MimoAnswerHelp } from "./mimo-answer-help";
import { useState } from "react";
import type {
  Attempt,
  Material,
  Recommendation,
  Preferences,
} from "@/lib/types";
import { Workspace, WorkspaceHeading, UiIcon } from "./workspace-ui";
export function ResultDesign({
  attempt,
  material,
  busy,
  displayName,
  preferences,
  onBack,
  onRecommend,
  onRetry,
  onPlanner,
  onRest,
  onSaveReview,
  onSpeak,
  onRegister,
  notice,
}: {
  attempt: Attempt;
  material: Material;
  recommendation: Recommendation | null;
  busy: boolean;
  displayName: string;
  preferences: Preferences;
  onBack: () => void;
  onRecommend: () => void;
  onRetry: () => void;
  onPlanner: () => void;
  onRest: () => void;
  onSaveReview: () => void;
  onSpeak: (text?: string) => void;
  onPreferences?: (p: Partial<Preferences>) => void;
  onRegister?: () => void;
  notice: string | null;
}) {
  const correct = Object.values(attempt.answers).filter(
    (answer) => answer.correct,
  ).length;
  const [copied, setCopied] = useState("");
  async function copyReview() {
    try {
      await navigator.clipboard.writeText(
        attempt.questions
          .map((q) => q.prompt + "\n" + q.explanation)
          .join("\n\n"),
      );
      setCopied("Pembahasan disalin.");
    } catch {
      setCopied("Pilih teks pembahasan untuk menyalinnya secara manual.");
    }
  }
  return (
    <Workspace screen={18}>
      <WorkspaceHeading
        title="Latihan selesai"
        description={material.title}
        back={onBack}
        actions={
          <button className="workspace-button" onClick={() => window.print()}>
            <UiIcon name="download" />
            Cetak hasil
          </button>
        }
      />
      <section
        data-tour="result"
        className="workspace-result-summary"
        data-tone="mint"
      >
        <span className="workspace-result-icon">
          <UiIcon name="done_all" />
        </span>
        <div>
          <span className="workspace-eyebrow">Hasil latihanmu</span>
          <h2>
            {correct} dari {attempt.questions.length} jawaban tepat
          </h2>
          <p>{displayName}, kamu bisa meninjau pembahasannya di bawah.</p>
        </div>
        <a
          href="#"
          className="workspace-button primary"
          onClick={(e) => {
            e.preventDefault();
            onRecommend();
          }}
        >
          Mulai Rekomendasi Sekarang
          <UiIcon name="arrow_forward" />
        </a>
      </section>
      {onRegister && (
        <aside className="workspace-actions workspace-demo-invite">
          <p>
            Ini masih mode demo. Buat akun gratis supaya progres belajarmu
            selanjutnya tersimpan.
          </p>
          <button className="workspace-button" onClick={onRegister}>
            Daftar gratis
          </button>
        </aside>
      )}
      <div className="workspace-panel-heading">
        <h2>Pembahasan</h2>
        <div className="workspace-actions">
          <button
            className="workspace-button"
            disabled={busy}
            onClick={onSaveReview}
          >
            Simpan ke catatan
          </button>
          <button className="workspace-button" onClick={copyReview}>
            Salin pembahasan
          </button>
          <button
            className="workspace-button"
            onClick={() =>
              onSpeak(attempt.questions.map((q) => q.explanation).join(". "))
            }
          >
            <UiIcon name="volume_up" />
            Bacakan
          </button>
        </div>
      </div>
      <div className="workspace-review-list">
        {attempt.questions.map((question, index) => (
          <article
            className="workspace-review"
            key={question.id}
            data-correct={attempt.answers[question.id]?.correct}
          >
            <div className="workspace-review-status">
              <UiIcon
                name={
                  attempt.answers[question.id]?.correct
                    ? "check_circle"
                    : "replay"
                }
              />
              <span>
                Soal {index + 1} -{" "}
                {attempt.answers[question.id]?.correct
                  ? "Tepat"
                  : "Tinjau lagi"}
              </span>
            </div>
            <h3>{question.prompt}</h3>
            <p>{question.explanation}</p>
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
          </article>
        ))}
      </div>
      <p role="status">{notice || copied}</p>
      <footer className="workspace-actions workspace-footer">
        <button className="workspace-button" disabled={busy} onClick={onRetry}>
          Ulangi latihan
        </button>
        <button className="workspace-button" onClick={onPlanner}>
          Rencana belajar
        </button>
        <button className="workspace-button" disabled={busy} onClick={onRest}>
          Istirahat dulu
        </button>
      </footer>
    </Workspace>
  );
}

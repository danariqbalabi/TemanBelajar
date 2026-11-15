"use client";
import { useEffect, useState } from "react";
import { api, mutation } from "@/lib/api";
import type {
  Attempt,
  LearningSession,
  Material,
  Preferences,
  Recommendation,
} from "@/lib/types";
import type { Run } from "./page";
import { ReaderDesign } from "./design-reader";
import { QuestionDesign } from "./design-question";
import { ResultDesign } from "./design-result";
import { RecommendationDesign } from "./design-recommendation";
export function Reader({
  material,
  session,
  preferences,
  run,
  busy,
  onUpdate,
  refresh,
  onPlanner,
  onSettings = () => {},
  onBack = () => {},
  onPreferences,
  displayName = "Manda",
}: {
  material: Material;
  session: LearningSession;
  preferences: Preferences;
  run: Run;
  busy: boolean;
  onUpdate: (s: LearningSession) => void;
  refresh: () => Promise<void>;
  onPlanner: () => void;
  onSettings?: () => void;
  onBack?: () => void;
  onPreferences?: (p: Partial<Preferences>) => void;
  displayName?: string;
}) {
  const [draft, setDraft] = useState(session.draft),
    [attempt, setAttempt] = useState<Attempt | null>(null),
    [choice, setChoice] = useState<number | null>(null),
    [feedback, setFeedback] = useState<string | null>(null),
    [rec, setRec] = useState<Recommendation | null>(null),
    [speaking, setSpeaking] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [showRecommendation, setShowRecommendation] = useState(false);
  const concept =
      material.concepts.find((c) => c.id === session.concept_id) ||
      material.concepts[0],
    paragraph = session.paragraph;
  useEffect(() => {
    let alive = true;
    const saved = attemptPointer(session.id);
    if (saved)
      api<Attempt>(`/attempts/${saved}`)
        .then(async (result) => {
          if (!alive) return;
          setAttempt(result);
          if (result.status === "completed") {
            const suggestion = await api<Recommendation>(
              `/recommendations?material_id=${encodeURIComponent(material.id)}&available_minutes=15`,
            );
            if (alive) setRec(suggestion);
          }
        })
        .catch(() => {
          /* A missing pointer never blocks the source reading session. */
        });
    return () => {
      alive = false;
    };
  }, [session.id, material.id]);
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
        status: session.status === "completed" ? "completed" : "active",
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
  function practice(forceNew = false) {
    setShowRecommendation(false);
    const create = mutation<Attempt>("/attempts", { session_id: session.id });
    run(async () => {
      const pointer = !forceNew && attemptPointer(session.id);
      const result = pointer
        ? await api<Attempt>(`/attempts/${pointer}`)
        : await create();
      setAttempt(result);
      attemptPointer(session.id, result.id);
      setChoice(null);
      setFeedback(null);
      setRec(null);
      if (result.status === "completed") await recommendation();
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
  function speak(text?: string) {
    if (!("speechSynthesis" in window)) {
      setFeedback(
        "Baca nyaring belum tersedia pada browser ini. Transkrip tetap bisa dibaca.",
      );
      return;
    }
    if (speaking && !text) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      text || concept.transcript || concept.paragraphs.join(" "),
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
    if (!complete) {
      const question = last || nextQuestion;
      if (question)
        return (
          <QuestionDesign
            key={question.id}
            attempt={attempt}
            material={material}
            question={question}
            choice={choice}
            answered={!!last}
            busy={busy}
            onChoice={setChoice}
            onAnswer={answer}
            onNext={() => setFeedback(null)}
            onPause={() => {
              setAttempt(null);
              setFeedback(null);
            }}
            onSpeak={speak}
            displayName={displayName}
          />
        );
    }
    const backToReading = () => {
      setAttempt(null);
      setFeedback(null);
      setShowRecommendation(false);
    };
    const openConcept = (mode?: LearningSession["mode"]) => {
      backToReading();
      if (rec)
        update({
          concept_id: rec.concept_id,
          paragraph: 0,
          ...(mode ? { mode } : {}),
        });
    };
    const nextRecommendation = () => {
      setShowRecommendation(true);
      if (!rec) run(recommendation);
    };
    const saveReview = () => {
      const remaining = 3000 - draft.length - 2;
      if (remaining <= 0) {
        setFeedback(
          "Catatan sudah penuh. Salin pembahasan atau rapikan catatan terlebih dahulu.",
        );
        return;
      }
      const text =
        draft +
        "\n\n" +
        attempt.questions
          .map((q) => q.prompt + " " + q.explanation)
          .join("\n")
          .slice(0, remaining);
      setDraft(text);
      update({ draft: text });
    };
    if (showRecommendation) {
      if (!rec)
        return (
          <section>
            <h1>Menyiapkan langkah berikutnya...</h1>
            <button disabled={busy} onClick={() => run(recommendation)}>
              Muat rekomendasi
            </button>
            <button onClick={() => setShowRecommendation(false)}>
              Kembali ke hasil
            </button>
          </section>
        );
      return (
        <RecommendationDesign
          material={material}
          recommendation={rec}
          busy={busy}
          displayName={displayName}
          onFollow={() =>
            rec.action === "PRACTICE"
              ? practice(true)
              : rec.action === "RESCHEDULE"
                ? onPlanner()
                : openConcept()
          }
          onBack={backToReading}
          onOpen={openConcept}
          onPlanner={onPlanner}
          onSettings={onSettings}
          onSpeak={speak}
        />
      );
    }
    return (
      <ResultDesign
        attempt={attempt}
        material={material}
        recommendation={rec}
        busy={busy}
        displayName={displayName}
        onBack={backToReading}
        onRecommend={nextRecommendation}
        onRetry={() => practice(true)}
        onPlanner={onPlanner}
        onRest={() => {
          backToReading();
          update({
            status: session.status === "completed" ? "completed" : "paused",
          });
        }}
        onSaveReview={saveReview}
        onSpeak={speak}
        onPreferences={onPreferences}
        notice={
          feedback && !attempt.questions.some((q) => q.id === feedback)
            ? feedback
            : null
        }
      />
    );
  }
  return (
    <ReaderDesign
      key={session.concept_id + session.mode}
      material={material}
      session={session}
      preferences={preferences}
      draft={draft}
      setDraft={setDraft}
      busy={busy}
      feedback={feedback}
      speaking={speaking}
      onSpeak={speak}
      update={update}
      onPractice={() => practice()}
      onSettings={onSettings}
      onBack={onBack}
      onPreferences={onPreferences}
      elapsed={elapsed}
      displayName={displayName}
    />
  );
}
function attemptPointer(sessionId: string, value?: string): string | null {
  try {
    const key = `temanbelajar-attempt:${sessionId}`;
    if (value) localStorage.setItem(key, value);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

"use client";
import { useEffect, useState } from "react";
import { ProgressDesign } from "./design-progress";
import { userMessage } from "@/lib/errors";
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
  start,
  onPlan,
  onSettings,
  onBack,
  displayName,
  timezone,
}: {
  materials: Material[];
  sessions: LearningSession[];
  run: Run;
  onPlan: () => void;
  onSettings: () => void;
  onBack: () => void;
  displayName: string;
  timezone: string;
  start: (
    m: Material,
    mode?: Mode,
    conceptId?: string,
    practice?: boolean,
  ) => void;
}) {
  const [selected, setSelected] = useState(materials[0]?.id || ""),
    [progress, setProgress] = useState<Progress | null>(null),
    [rec, setRec] = useState<Recommendation | null>(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
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
        if (alive) setError(userMessage(e));
      });
    return () => {
      alive = false;
    };
  }, [selected, revision]);
  return (
    <ProgressDesign
      materials={materials}
      sessions={sessions}
      selected={selected}
      onSelect={(id) => {
        setSelected(id);
        setProgress(null);
        setRec(null);
        setError("");
      }}
      progress={progress}
      rec={rec}
      error={error}
      start={start}
      displayName={displayName}
      timezone={timezone}
      onPlan={onPlan}
      onSettings={onSettings}
      onBack={onBack}
      onRefresh={() => {
        setError("");
        setRevision((value) => value + 1);
      }}
    />
  );
}

export type Mode = "standard" | "reading" | "focus" | "explore" | "transcript";
export type Concept = {
  id: string;
  title: string;
  paragraphs: string[];
  source_ids: string[];
  estimated_minutes: number;
  prerequisites: string[];
  diagram_description: string | null;
  transcript: string | null;
};
export type Material = {
  id: string;
  title: string;
  subject: string;
  is_demo: boolean;
  generated_by_ai: boolean;
  concepts: Concept[];
  sources: { id: string; label: string; text: string }[];
  question_count: number;
};
export type Preferences = {
  font_size: number;
  line_height: number;
  high_contrast: boolean;
  reduced_motion: boolean;
  reading_ruler: boolean;
  timer_enabled: boolean;
  mode: Mode;
  font_family: "jakarta" | "nunito" | "system";
  letter_spacing: number;
  reading_width: number;
  speech_rate: number;
  show_mimo: boolean;
  captions: boolean;
};
export type Profile = {
  display_name: string;
  timezone: string;
  daily_minutes: number;
  goal: string;
  preferences: Preferences;
  subjects: string[];
  available_days: number[];
  exam_date: string | null;
  onboarding_step: number;
};
export const defaultProfile: Profile = {
  display_name: "Manda",
  timezone: "Asia/Jakarta",
  daily_minutes: 15,
  goal: "",
  subjects: ["IPA"],
  available_days: [0, 1, 2, 3, 4],
  exam_date: null,
  onboarding_step: 0,
  preferences: {
    font_size: 18,
    line_height: 1.7,
    high_contrast: false,
    reduced_motion: true,
    reading_ruler: false,
    timer_enabled: false,
    mode: "reading",
    font_family: "jakarta",
    letter_spacing: 0,
    reading_width: 68,
    speech_rate: 1,
    show_mimo: true,
    captions: true,
  },
};
export type LearningSession = {
  id: string;
  material_id: string;
  mode: Mode;
  concept_id: string;
  paragraph: number;
  completed_concepts: string[];
  draft: string;
  status: "active" | "paused" | "completed";
  version: number;
  updated_at: string;
};
export type Attempt = {
  id: string;
  session_id: string;
  material_id: string;
  version: number;
  status: string;
  question_ids: string[];
  questions: {
    id: string;
    concept_id: string;
    prompt: string;
    options: string[];
    source_ids: string[];
    correct_index: number | null;
    explanation: string | null;
  }[];
  answers: Record<
    string,
    { selected_index: number; correct: boolean; answered_at: string }
  >;
};
export type Job = {
  id: string;
  title: string;
  status: string;
  stage: string;
  error: string | null;
  material_id: string | null;
};
export type Estimate = {
  mastery: number | null;
  mastery_status: string;
  model_version: string | null;
};
export type Progress = {
  material_id: string;
  concepts: (Estimate & {
    id: string;
    title: string;
    observed: { correct: number; total: number };
  })[];
};
export type Recommendation = {
  action: string;
  material_id: string;
  concept_id: string;
  estimated_minutes: number;
  reason: string;
  title: string | null;
  alternatives: { action: string; mode: Mode; reason: string }[];
  estimate: Estimate | null;
};
export type Activity = {
  id: string;
  title: string;
  start_at: string;
  duration_minutes: number;
  status: "pending" | "active" | "completed" | "skipped";
  locked: boolean;
  prerequisites: string[];
  material_id: string | null;
  concept_id: string | null;
  kind: string;
};
export type Proposal = {
  id: string;
  reason: string;
  base_version: number;
  status: string;
  activities: Activity[];
  changes: {
    activity_id: string;
    before: Activity | null;
    after: Activity | null;
  }[];
};
export type Plan = {
  id: string;
  timezone: string;
  daily_minutes: number;
  version: number;
  activities: Activity[];
  history: Record<string, Activity[]>;
  proposals: Proposal[];
};

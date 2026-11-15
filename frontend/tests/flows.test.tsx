import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  defaultProfile,
  type Material,
  type LearningSession,
  type Attempt,
  type Plan,
  type Proposal,
} from "../src/lib/types";
const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../src/lib/api", () => ({
  api: request,
  auth: null,
  mutation: (path: string, body: object, method = "POST") => {
    const payload = { ...body, request_id: crypto.randomUUID() };
    return () => request(path, payload, method);
  },
}));
import { Reader } from "../src/app/reader";
import { Planner } from "../src/app/planner";
import { Materials } from "../src/app/materials";
import { Onboarding } from "../src/app/profile";
const material: Material = {
  id: "demo",
  title: "Fotosintesis",
  subject: "IPA",
  is_demo: true,
  generated_by_ai: false,
  question_count: 2,
  sources: [
    { id: "source", label: "Sumber terkurasi", text: "Cahaya memasok energi." },
  ],
  concepts: [
    {
      id: "c1",
      title: "Peran cahaya",
      paragraphs: ["Cahaya memasok energi.", "Air adalah bahan."],
      estimated_minutes: 5,
      prerequisites: [],
      source_ids: ["source"],
      diagram_description: "Cahaya menuju daun.",
      transcript: "Cahaya memasok energi.",
    },
  ],
};
const session: LearningSession = {
  id: "session",
  material_id: "demo",
  mode: "focus",
  concept_id: "c1",
  paragraph: 1,
  completed_concepts: [],
  draft: "catatan awal",
  status: "active",
  version: 3,
  updated_at: "",
};
const run = async (action: () => Promise<void>) => {
  await action();
};
const plan: Plan = {
  id: "plan",
  timezone: "Asia/Jakarta",
  daily_minutes: 15,
  version: 2,
  history: {},
  proposals: [],
  activities: [
    {
      id: "activity",
      title: "Kegiatan selesai",
      start_at: "2026-11-16T02:00:00Z",
      duration_minutes: 5,
      status: "completed",
      locked: false,
      prerequisites: [],
      material_id: "demo",
      concept_id: "c1",
      kind: "read",
    },
  ],
};
afterEach(() => {
  cleanup();
  localStorage.clear();
  request.mockReset();
});
describe("alur belajar", () => {
  it("melanjutkan latihan tersimpan dari soal yang belum dijawab", async () => {
    localStorage.setItem("temanbelajar-attempt:session", "saved-attempt");
    request.mockResolvedValue({
      id: "saved-attempt",
      session_id: "session",
      material_id: "demo",
      version: 2,
      status: "active",
      question_ids: ["q1", "q2"],
      answers: { q1: { selected_index: 0, correct: true, answered_at: "" } },
      questions: [
        {
          id: "q1",
          concept_id: "c1",
          prompt: "Pertanyaan lama",
          options: ["A", "B"],
          source_ids: ["source"],
          correct_index: 0,
          explanation: "Sudah dijawab",
        },
        {
          id: "q2",
          concept_id: "c1",
          prompt: "Pertanyaan yang dilanjutkan",
          options: ["Air", "Cahaya"],
          source_ids: ["source"],
          correct_index: null,
          explanation: null,
        },
      ],
    });
    render(
      <Reader
        material={material}
        session={session}
        preferences={defaultProfile.preferences}
        run={run}
        busy={false}
        onUpdate={() => {}}
        refresh={async () => {}}
        onPlanner={() => {}}
      />,
    );
    expect(await screen.findByText("Pertanyaan yang dilanjutkan")).toBeTruthy();
    expect(screen.queryByText("Pertanyaan lama")).toBeNull();
    expect(request.mock.calls[0][0]).toBe("/attempts/saved-attempt");
  });
  it("pergantian format mempertahankan posisi dan draft", async () => {
    const onUpdate = vi.fn();
    request.mockResolvedValue({ ...session, mode: "reading", version: 4 });
    render(
      <Reader
        material={material}
        session={session}
        preferences={defaultProfile.preferences}
        run={run}
        busy={false}
        onUpdate={onUpdate}
        refresh={async () => {}}
        onPlanner={() => {}}
      />,
    );
    await userEvent.selectOptions(
      screen.getByLabelText("Format belajar"),
      "reading",
    );
    await waitFor(() => expect(request).toHaveBeenCalled());
    expect(request.mock.calls[0][1]).toMatchObject({
      paragraph: 1,
      draft: "catatan awal",
      mode: "reading",
      expected_version: 3,
    });
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ version: 4 }),
    );
  });
  it("menampilkan satu soal dan menunggu jawaban server sebelum lanjut", async () => {
    const attempt: Attempt = {
      id: "attempt",
      session_id: "session",
      material_id: "demo",
      version: 1,
      status: "active",
      question_ids: ["q1", "q2"],
      answers: {},
      questions: [
        {
          id: "q1",
          concept_id: "c1",
          prompt: "Apa peran cahaya?",
          options: ["Energi", "Bahan gula"],
          source_ids: ["source"],
          correct_index: null,
          explanation: null,
        },
        {
          id: "q2",
          concept_id: "c1",
          prompt: "Apa bahan fotosintesis?",
          options: ["Air", "Cahaya"],
          source_ids: ["source"],
          correct_index: null,
          explanation: null,
        },
      ],
    };
    request.mockResolvedValueOnce(attempt).mockResolvedValueOnce({
      ...attempt,
      version: 2,
      answers: { q1: { selected_index: 0, correct: true, answered_at: "" } },
      questions: [
        {
          ...attempt.questions[0],
          correct_index: 0,
          explanation: "Cahaya menyediakan energi.",
        },
        attempt.questions[1],
      ],
    });
    render(
      <Reader
        material={material}
        session={session}
        preferences={defaultProfile.preferences}
        run={run}
        busy={false}
        onUpdate={() => {}}
        refresh={async () => {}}
        onPlanner={() => {}}
      />,
    );
    await userEvent.click(screen.getByText("Coba latihan"));
    expect(await screen.findByText("Apa peran cahaya?")).toBeTruthy();
    expect(screen.queryByText("Apa bahan fotosintesis?")).toBeNull();
    await userEvent.click(screen.getByLabelText("Energi"));
    await userEvent.click(screen.getByText("Simpan jawaban →"));
    expect(await screen.findByText("Cahaya menyediakan energi.")).toBeTruthy();
    expect(request.mock.calls[1][1]).toMatchObject({
      question_id: "q1",
      selected_index: 0,
      expected_version: 1,
    });
    await userEvent.click(screen.getByText("Pertanyaan berikutnya →"));
    expect(await screen.findByText("Apa bahan fotosintesis?")).toBeTruthy();
  });
});
describe("planner yang dapat ditinjau", () => {
  it("melindungi kegiatan selesai dalam draf", async () => {
    render(
      <Planner
        plans={[plan]}
        materials={[material]}
        profile={defaultProfile}
        run={run}
        busy={false}
        refresh={async () => {}}
        start={() => {}}
      />,
    );
    await userEvent.click(screen.getByText("Edit rencana manual"));
    expect(
      (screen.getByText("Hapus dari draf") as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getAllByLabelText("Mulai")[0] as HTMLInputElement).disabled,
    ).toBe(true);
    expect(request).not.toHaveBeenCalled();
  });
  it("memisahkan usulan dari penerapan perubahan", async () => {
    const proposal: Proposal = {
      id: "proposal",
      reason: "Tinjau lagi",
      base_version: 2,
      status: "pending",
      activities: plan.activities,
      changes: [],
    };
    request.mockResolvedValueOnce(proposal);
    render(
      <Planner
        plans={[plan]}
        materials={[material]}
        profile={defaultProfile}
        run={run}
        busy={false}
        refresh={async () => {}}
        start={() => {}}
      />,
    );
    await userEvent.click(screen.getByText("Edit rencana manual"));
    await userEvent.click(screen.getByText("Buat usulan perubahan"));
    expect(await screen.findByText("Terima perubahan")).toBeTruthy();
    expect(request.mock.calls[0][0]).toBe("/plans/plan/proposals");
    expect(
      request.mock.calls.some((c) => String(c[0]).endsWith("/accept")),
    ).toBe(false);
  });
});
it("menyimpan sumber terlebih dahulu tanpa memulai AI diam-diam", async () => {
  request.mockResolvedValue({ items: [] });
  const refresh = vi.fn(async () => {});
  render(
    <Materials
      materials={[material]}
      run={run}
      busy={false}
      refresh={refresh}
      start={() => {}}
    />,
  );
  await userEvent.click(screen.getByText("+ Tambah materi"));
  await userEvent.type(screen.getByLabelText("Judul"), "Catatan IPA");
  await userEvent.type(
    screen.getByLabelText("Teks materi"),
    "Cahaya menyediakan energi untuk fotosintesis pada daun.",
  );
  request.mockResolvedValueOnce({
    id: "job",
    title: "Catatan IPA",
    status: "queued",
    stage: "queued",
    error: null,
    material_id: null,
  });
  await userEvent.click(screen.getByText("Simpan sumber materi"));
  expect(await screen.findByText("Susun bersama Mimo")).toBeTruthy();
  expect(
    request.mock.calls.some((c) => String(c[0]).endsWith("/process")),
  ).toBe(false);
});
it("onboarding menampilkan pratinjau sebelum menyimpan profil", async () => {
  const save = vi.fn();
  render(
    <Onboarding initial={defaultProfile} onSave={save} busy={false} error="" />,
  );
  await userEvent.click(screen.getByText("Lanjut →"));
  await userEvent.click(screen.getByText("Lanjut →"));
  await userEvent.click(screen.getByText("Lanjut →"));
  expect(screen.getByText("Halo, Manda!")).toBeTruthy();
  expect(save).not.toHaveBeenCalled();
  await userEvent.click(screen.getByText("Buka ruang belajar →"));
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ display_name: "Manda", onboarding_step: 4 }),
  );
});

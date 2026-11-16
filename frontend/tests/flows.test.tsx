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
  ApiError: class extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
    }
  },
  auth: null,
  mutation: (path: string, body: object, method = "POST") => {
    const payload = { ...body, request_id: crypto.randomUUID() };
    return () => request(path, payload, method);
  },
}));
import { RecommendationDesign } from "../src/app/design-recommendation";
import { Catalog } from "../src/app/design-catalog";
import { ApiError } from "../src/lib/api";
import { Reader } from "../src/app/reader";
import { Planner } from "../src/app/planner";
import { Materials } from "../src/app/materials";
import { ProgressView } from "../src/app/progress";
import { SettingsDesign } from "../src/app/design-settings";
import { SummaryDesign } from "../src/app/design-summary";
import type { Session } from "@supabase/supabase-js";
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
it("kedua tautan pemilihan mode membuka pilihan, bukan kembali ke katalog", async () => {
  const onChoose = vi.fn();
  const onBack = vi.fn();
  render(
    <SummaryDesign
      material={material}
      onChoose={onChoose}
      onBack={onBack}
      onPlan={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Pilih Cara Belajar" }),
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Buka Mode Selector Lengkap" }),
  );
  expect(onChoose).toHaveBeenCalledTimes(2);
  expect(onBack).not.toHaveBeenCalled();
});
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
  it("menampilkan hasil tersimpan dan alasan rekomendasi dari server tanpa metrik contoh", async () => {
    localStorage.setItem("temanbelajar-attempt:session", "done");
    const completed: Attempt = {
      id: "done",
      session_id: "session",
      material_id: "demo",
      version: 3,
      status: "completed",
      question_ids: ["q1", "q2"],
      answers: {
        q1: { selected_index: 0, correct: true, answered_at: "" },
        q2: { selected_index: 0, correct: false, answered_at: "" },
      },
      questions: [
        {
          id: "q1",
          concept_id: "c1",
          prompt: "Apa peran cahaya?",
          options: ["Energi", "Bahan gula"],
          source_ids: ["source"],
          correct_index: 0,
          explanation: "Cahaya memasok energi yang dibutuhkan.",
        },
        {
          id: "q2",
          concept_id: "c1",
          prompt: "Mana sumber energi fotosintesis?",
          options: ["Air", "Cahaya"],
          source_ids: ["source"],
          correct_index: 1,
          explanation: "Cahaya, bukan air, menjadi sumber energi.",
        },
      ],
    };
    const reason =
      "Satu jawaban sebelumnya belum tepat. Ulangi konsep peran cahaya.";
    request.mockImplementation(async (path: string) =>
      path.startsWith("/attempts/")
        ? completed
        : {
            action: "REVIEW",
            material_id: "demo",
            concept_id: "c1",
            estimated_minutes: 5,
            reason,
            title: "Peran cahaya",
            alternatives: [],
            estimate: null,
          },
    );
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
    await waitFor(() => expect(request).toHaveBeenCalled());
    expect(
      screen.getByRole("button", { name: "Latihan pemahaman" }),
    ).toBeTruthy();
    await userEvent.click(
      screen.getByRole("button", { name: "Latihan pemahaman" }),
    );
    expect(await screen.findByText(/1 dari 2 jawaban tepat/)).toBeTruthy();
    expect(
      screen.getByText("Cahaya, bukan air, menjadi sumber energi."),
    ).toBeTruthy();
    await userEvent.click(
      screen.getByRole("link", { name: /Mulai Rekomendasi Sekarang/ }),
    );
    expect((await screen.findAllByText(reason)).length).toBeGreaterThan(0);
    expect(screen.queryByText(/42%/)).toBeNull();
  });
  it("melanjutkan latihan dari server tanpa pointer browser perangkat lama", async () => {
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
    expect(request.mock.calls[0][0]).toBe("/sessions/session/attempts/active");
    expect(request.mock.calls.some(([path]) => path === "/attempts")).toBe(
      false,
    );
  });
  it("pergantian format mempertahankan posisi dan draft", async () => {
    const onUpdate = vi.fn();
    request.mockImplementation(async (path: string) =>
      path.endsWith("/attempts/active")
        ? null
        : { ...session, mode: "reading", version: 4 },
    );
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
    await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    expect(
      request.mock.calls.find((call) => call[2] === "PUT")![1],
    ).toMatchObject({
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
    await userEvent.click(
      screen.getByRole("button", { name: "Latihan pemahaman" }),
    );
    expect(await screen.findByText("Apa peran cahaya?")).toBeTruthy();
    expect(screen.queryByText("Apa bahan fotosintesis?")).toBeNull();
    await userEvent.click(screen.getByLabelText("Energi"));
    await userEvent.click(
      screen.getByRole("button", { name: "Periksa Jawaban Sekarang" }),
    );
    expect(await screen.findByText("Cahaya menyediakan energi.")).toBeTruthy();
    expect(request.mock.calls[1][1]).toMatchObject({
      question_id: "q1",
      selected_index: 0,
      expected_version: 1,
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Pertanyaan berikutnya" }),
    );
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
    await userEvent.click(
      screen.getByRole("button", { name: "Edit rencana manual" }),
    );
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
    await userEvent.click(
      screen.getByRole("button", { name: "Edit rencana manual" }),
    );
    await userEvent.click(screen.getByText("Buat usulan perubahan"));
    expect(
      await screen.findByRole("button", {
        name: "Pakai Rencana Baru (Terapkan)",
      }),
    ).toBeTruthy();
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
  await userEvent.click(
    screen.getByRole("button", { name: /Tambah Materi Baru/ }),
  );
  await userEvent.type(screen.getByLabelText("Judul materi"), "Catatan IPA");
  await userEvent.click(
    screen.getByRole("button", { name: /Tempel Rangkuman/ }),
  );
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
  await userEvent.click(
    screen.getByRole("button", { name: "Siapkan Materi Bersama Mimo" }),
  );
  expect(
    await screen.findByRole("button", { name: "Mulai pemrosesan" }),
  ).toBeTruthy();
  expect(
    request.mock.calls.some((c) => String(c[0]).endsWith("/process")),
  ).toBe(false);
});
it("menghubungkan katalog, ringkasan, dan mode belajar tanpa membuka format yang belum tersedia", async () => {
  request.mockResolvedValue({ items: [] });
  const start = vi.fn();
  const noMedia = {
    ...material,
    concepts: material.concepts.map((c) => ({
      ...c,
      diagram_description: null,
      transcript: null,
    })),
  };
  render(
    <Materials
      materials={[noMedia]}
      run={run}
      busy={false}
      refresh={async () => {}}
      start={start}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Buka Ringkasan →" }),
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Pilih cara belajar" })[0],
  );
  const alternatives = screen.getAllByRole("radio");
  expect(
    alternatives.filter((b) => (b as HTMLButtonElement).disabled),
  ).toHaveLength(2);
  await userEvent.click(
    screen.getByRole("button", { name: "Mulai Belajar Sekarang" }),
  );
  expect(start).toHaveBeenCalledWith(noMedia, "reading");
});
it("onboarding menampilkan pratinjau sebelum menyimpan profil", async () => {
  const save = vi.fn();
  render(
    <Onboarding initial={defaultProfile} onSave={save} busy={false} error="" />,
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Simpan & Lanjut ke Aksesibilitas" }),
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Pakai Pengaturan Ini & Lanjut" }),
  );
  const math = screen.getByRole("button", { name: /Matematika/ });
  expect(math.getAttribute("aria-pressed")).toBe("false");
  await userEvent.click(math);
  expect(math.getAttribute("aria-pressed")).toBe("true");

  await userEvent.click(
    screen.getByRole("link", { name: "Lihat Rencana Belajarku" }),
  );
  expect(
    screen.getByRole("heading", {
      name: /Yeay! Rencana belajarmu udah siap/,
    }),
  ).toBeTruthy();
  expect(save).not.toHaveBeenCalled();
  await userEvent.click(
    screen.getByRole("link", { name: /Lanjut ke Beranda Utama/ }),
  );
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({
      display_name: "Manda",
      onboarding_step: 4,
      subjects: expect.arrayContaining(["IPA", "Matematika"]),
    }),
  );
});

it("menyimpan preferensi eksplisit dan mempertahankan profil saat tab diganti", async () => {
  const save = vi.fn();
  render(
    <SettingsDesign
      profile={defaultProfile}
      account={{ user: { is_anonymous: true } } as Session}
      busy={false}
      onSave={save}
      signOut={vi.fn()}
      onBack={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Nunito \(Bulat Lembut\)/ }),
  );
  expect(save).not.toHaveBeenCalled();
  await userEvent.click(
    screen.getAllByRole("checkbox", { name: "Penggaris baca" })[0],
  );
  await userEvent.click(screen.getByRole("button", { name: "Profil" }));
  const name = screen.getByLabelText("Nama Panggilan di Aplikasi");
  await userEvent.clear(name);
  await userEvent.type(name, "Manda santai");
  await userEvent.click(
    screen.getByRole("button", { name: "Simpan Perubahan Profil" }),
  );
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({
      display_name: "Manda santai",
      preferences: expect.objectContaining({
        font_family: "nunito",
        reading_ruler: true,
      }),
    }),
  );
});
it("memisahkan jawaban teramati dari estimasi model yang belum tersedia", async () => {
  request.mockImplementation(async (path: string) =>
    path.startsWith("/progress")
      ? {
          concepts: [
            {
              id: "c1",
              title: "Peran cahaya",
              mastery: null,
              mastery_status: "unavailable",
              model_version: null,
              observed: { correct: 1, total: 2 },
            },
          ],
        }
      : null,
  );
  render(
    <ProgressView
      materials={[material]}
      sessions={[{ ...session, updated_at: new Date().toISOString() }]}
      run={run}
      start={vi.fn()}
      onPlan={vi.fn()}
      onSettings={vi.fn()}
      onBack={vi.fn()}
      displayName="Manda"
      timezone="Asia/Jakarta"
    />,
  );
  expect(await screen.findByText("1/2 jawaban tepat")).toBeTruthy();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.getByText(/Estimasi penguasaan belum tersedia/)).toBeTruthy();
  expect(screen.queryByText(/82%/)).toBeNull();
});

import { ReaderDesign } from "../src/app/design-reader";
it.each(["reading", "standard", "focus", "explore", "transcript"] as const)(
  "mode %s memakai materi aktif tanpa contoh anatomi dari ekspor",
  (mode) => {
    render(
      <ReaderDesign
        material={material}
        session={{ ...session, mode }}
        preferences={defaultProfile.preferences}
        draft="catatan"
        setDraft={vi.fn()}
        busy={false}
        feedback={null}
        speaking={false}
        onSpeak={vi.fn()}
        update={vi.fn()}
        onPractice={vi.fn()}
        onSettings={vi.fn()}
        onBack={vi.fn()}
        elapsed={0}
        displayName="Manda"
      />,
    );
    expect(
      screen.getAllByText(
        /Peran cahaya|Cahaya memasok energi|Cahaya menuju daun|Air adalah bahan/,
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/glomerulus|urine|tubulus/i)).toBeNull();
    expect(screen.getByLabelText("Catatan sesi")).toBeTruthy();
    expect(screen.getByLabelText("Format belajar")).toBeTruthy();
  },
);

it("filter katalog, pencarian konsep, urutan judul, dan pintasan bekerja", async () => {
  const other = {
    ...material,
    id: "other",
    title: "Aljabar",
    subject: "Matematika",
    concepts: [
      { ...material.concepts[0], id: "algebra", title: "Persamaan linear" },
    ],
  };
  const setQuery = vi.fn();
  const { rerender } = render(
    <Catalog
      materials={[material, other]}
      sessions={[
        { ...session, completed_concepts: ["c1"], status: "completed" },
      ]}
      jobs={[]}
      query=""
      setQuery={setQuery}
      onUpload={vi.fn()}
      onDetail={vi.fn()}
      onSettings={vi.fn()}
      jobsPanel={null}
      uploadPanel={null}
      errorsPanel={null}
    />,
  );
  await userEvent.selectOptions(
    screen.getByLabelText("Filter status belajar"),
    "completed",
  );
  expect(screen.getByRole("heading", { name: "Fotosintesis" })).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Aljabar" })).toBeNull();
  await userEvent.selectOptions(
    screen.getByLabelText("Filter status belajar"),
    "all",
  );
  await userEvent.selectOptions(
    screen.getByLabelText("Urutkan materi"),
    "title",
  );
  expect(screen.getAllByRole("heading", { level: 2 })[0].textContent).toBe(
    "Aljabar",
  );
  await userEvent.keyboard("{Control>}k{/Control}");
  expect(document.activeElement).toBe(
    screen.getByLabelText("Cari materi atau topik konsep"),
  );
  rerender(
    <Catalog
      materials={[material, other]}
      sessions={[]}
      jobs={[]}
      query="linear"
      setQuery={setQuery}
      onUpload={vi.fn()}
      onDetail={vi.fn()}
      onSettings={vi.fn()}
      jobsPanel={null}
      uploadPanel={null}
      errorsPanel={null}
    />,
  );
  expect(screen.getByRole("heading", { name: "Aljabar" })).toBeTruthy();
  expect(screen.queryByRole("heading", { name: "Fotosintesis" })).toBeNull();
});

it("rencana baru tidak mengambil rencana lama dan input kosong mendapat pesan", async () => {
  render(
    <Planner
      plans={[plan]}
      materials={[material]}
      profile={defaultProfile}
      run={run}
      busy={false}
      refresh={async () => {}}
      start={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Edit rencana manual" }),
  );
  await userEvent.selectOptions(screen.getByLabelText("Rencana aktif"), "");
  expect(screen.queryByText("Kegiatan selesai")).toBeNull();
  expect(screen.getByLabelText("Rencana aktif")).toHaveProperty("value", "");
  await userEvent.click(
    screen.getByRole("button", { name: "Susun usulan awal" }),
  );
  expect(screen.getByRole("status").textContent).toContain("tanggal dan waktu");
  expect(request).not.toHaveBeenCalled();
});

it("latihan dengan referensi yang sudah hilang dapat dimulai kembali", async () => {
  localStorage.setItem("temanbelajar-attempt:session", "missing");
  request.mockImplementation(async (path: string) => {
    if (path === "/attempts/missing") throw new ApiError(404, "tidak ada");
    return {
      id: "new",
      session_id: "session",
      material_id: "demo",
      version: 1,
      status: "active",
      question_ids: ["q1"],
      answers: {},
      questions: [
        {
          id: "q1",
          concept_id: "c1",
          prompt: "Latihan baru",
          options: ["A", "B"],
          source_ids: ["source"],
        },
      ],
    };
  });
  render(
    <Reader
      material={material}
      session={session}
      preferences={defaultProfile.preferences}
      run={run}
      busy={false}
      onUpdate={vi.fn()}
      refresh={async () => {}}
      onPlanner={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Latihan pemahaman" }),
  );
  expect(await screen.findByText("Latihan baru")).toBeTruthy();
  expect(localStorage.getItem("temanbelajar-attempt:session")).toBe("new");
});

it("rekomendasi menuju jadwal dan tombol alasan tidak keluar dari screen", async () => {
  const onBack = vi.fn(),
    onPlanner = vi.fn();
  render(
    <RecommendationDesign
      material={material}
      recommendation={{
        action: "RESCHEDULE",
        material_id: "demo",
        concept_id: "c1",
        estimated_minutes: 20,
        reason: "Waktu tersedia belum cukup",
        title: "Peran cahaya",
        alternatives: [],
        estimate: null,
      }}
      busy={false}
      displayName="Manda"
      onFollow={vi.fn()}
      onBack={onBack}
      onOpen={vi.fn()}
      onPlanner={onPlanner}
      onSettings={vi.fn()}
      onSpeak={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("link", { name: "Lihat Detail Alasannya" }),
  );
  expect(onBack).not.toHaveBeenCalled();
  await userEvent.click(
    screen.getByRole("link", { name: "Lihat Penyesuaian di Rencana Belajar" }),
  );
  expect(onPlanner).toHaveBeenCalledOnce();
  expect(screen.queryByText("IPA Kelas 8 Bab 4")).toBeNull();
});

it("aksi rekomendasi latihan membuka soal langsung", async () => {
  request.mockResolvedValue({
    id: "direct",
    session_id: "session",
    material_id: "demo",
    version: 1,
    status: "active",
    question_ids: ["q1"],
    answers: {},
    questions: [
      {
        id: "q1",
        concept_id: "c1",
        prompt: "Soal dari rekomendasi",
        options: ["A", "B"],
        source_ids: ["source"],
      },
    ],
  });
  render(
    <Reader
      initialPractice
      material={material}
      session={session}
      preferences={defaultProfile.preferences}
      run={run}
      busy={false}
      onUpdate={vi.fn()}
      refresh={async () => {}}
      onPlanner={vi.fn()}
    />,
  );
  expect(await screen.findByText("Soal dari rekomendasi")).toBeTruthy();
  expect(request.mock.calls[0][0]).toBe("/sessions/session/attempts/active");
});

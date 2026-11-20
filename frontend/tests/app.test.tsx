import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  act,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { defaultProfile } from "../src/lib/types";
import { auth, ApiError } from "../src/lib/api";
const { request, authEvents } = vi.hoisted(() => ({
  request: vi.fn(),
  authEvents: {
    listener: undefined as
      | undefined
      | ((
          event: string,
          session: {
            user: {
              id: string;
              is_anonymous: boolean;
              user_metadata?: { display_name?: string };
            };
          },
        ) => void),
  },
}));
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
  auth: {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: "test-user", is_anonymous: true } } },
      }),
      onAuthStateChange: (listener: typeof authEvents.listener) => {
        authEvents.listener = listener;
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInAnonymously: async () => {
        authEvents.listener?.("SIGNED_IN", {
          user: { id: "demo-tour-user", is_anonymous: true },
        });
        return { error: null };
      },
      setSession: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      verifyOtp: vi.fn(),
    },
  },
  mutation: (path: string, body: object, method = "POST") => {
    const payload = { ...body, request_id: crypto.randomUUID() };
    return () => request(path, payload, method);
  },
}));
import Home from "../src/app/page";
it("separates the study launcher from the materials catalogue without an active session", async () => {
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? {
          ...defaultProfile,
          onboarding_step: 4,
          preferences: { ...defaultProfile.preferences, reduced_motion: false },
        }
      : { items: [] },
  );
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  const navigation = await screen.findByRole("navigation");
  await userEvent.click(
    within(navigation).getByRole("link", { name: "Mulai Belajar" }),
  );
  expect(
    await screen.findByRole("heading", { name: "Mulai belajar" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: /Tambah Materi Baru/ }),
  ).toBeNull();
  await userEvent.click(
    screen.getByRole("button", { name: "Buka Materi Saya" }),
  );
  expect(
    await screen.findByRole("heading", { name: "Materi Saya" }),
  ).toBeTruthy();
  expect(document.querySelector('[data-kind="navigation"]')?.textContent).toBe(
    "Materi Saya",
  );
  expect(
    document
      .querySelector('[data-kind="navigation"]')
      ?.getAttribute("aria-hidden"),
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: /Tambah Materi Baru/ }),
  ).toBeTruthy();
});
afterEach(() => {
  cleanup();
  request.mockReset();
  authEvents.listener = undefined;
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

it("tautan email langsung membuka ruang belajar tanpa klik landing lagi", async () => {
  window.history.replaceState(
    null,
    "",
    "/auth/callback#access_token=valid&refresh_token=valid-refresh&type=magiclink",
  );
  const session = {
    user: {
      id: "rani",
      is_anonymous: false,
      user_metadata: { display_name: "Rani" },
    },
  };
  vi.mocked(auth!.auth.setSession).mockResolvedValue({
    data: { session, user: session.user },
    error: null,
  } as unknown as Awaited<
    ReturnType<NonNullable<typeof auth>["auth"]["setSession"]>
  >);
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? { ...defaultProfile, display_name: "Rani" }
      : path.startsWith("/recommendations")
        ? null
        : { items: [] },
  );
  render(<Home />);
  expect(
    await screen.findByRole("heading", { name: /Hai, Rani!/ }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("heading", { name: /Setiap orang punya/ }),
  ).toBeNull();
  expect(location.hash).toBe("");
});

it("tautan kedaluwarsa membuka form masuk dan tidak masuk sebagai Manda", async () => {
  window.history.replaceState(
    null,
    "",
    "/auth/callback#error=access_denied&error_code=otp_expired",
  );
  render(<Home />);
  expect(
    await screen.findByRole("heading", { name: "Masuk ke ruang belajarmu" }),
  ).toBeTruthy();
  expect(screen.getByRole("alert").textContent).toMatch(/kedaluwarsa/);
  expect(
    screen.queryByRole("navigation", { name: "Navigasi utama" }),
  ).toBeNull();
  expect(request).not.toHaveBeenCalled();
});

it("akun baru memakai nama pendaftaran dan membuka pengaturan awal", async () => {
  window.history.replaceState(
    null,
    "",
    "/auth/callback#access_token=valid&refresh_token=valid-refresh&type=signup",
  );
  const session = {
    user: {
      id: "rani-baru",
      is_anonymous: false,
      user_metadata: { display_name: "Rani" },
    },
  };
  vi.mocked(auth!.auth.setSession).mockResolvedValue({
    data: { session, user: session.user },
    error: null,
  } as unknown as Awaited<
    ReturnType<NonNullable<typeof auth>["auth"]["setSession"]>
  >);
  request.mockImplementation(async (path: string) => {
    if (path === "/profile") throw new ApiError(404, "belum ada");
    return path.startsWith("/recommendations") ? null : { items: [] };
  });
  render(<Home />);
  expect(
    await screen.findByRole("heading", {
      name: "Belajar nyaman, mulai dari kamu",
    }),
  ).toBeTruthy();
  expect(
    (screen.getByLabelText("Nama panggilan") as HTMLInputElement).value,
  ).toBe("Rani");
});

it("tombol masuk tetap membuka form meski sesi demo tersimpan", async () => {
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? defaultProfile
      : path.startsWith("/recommendations")
        ? null
        : { items: [] },
  );
  render(<Home />);
  await userEvent.click(await screen.findByRole("link", { name: "Masuk" }));
  expect(
    await screen.findByRole("button", { name: "Masuk ke akun" }),
  ).toBeTruthy();
  expect(screen.getByRole("button", { name: "Daftar" })).toBeTruthy();
});
it("ignores a late workspace response after switching accounts", async () => {
  let second = false;
  let finishOld: (value: { items: [] }) => void = () => {};
  const delayed = new Promise<{ items: [] }>((resolve) => {
    finishOld = resolve;
  });
  request.mockImplementation(async (path: string) => {
    if (path === "/profile")
      return {
        ...defaultProfile,
        display_name: second ? "Akun Kedua" : "Akun Lama",
        onboarding_step: 4,
      };
    if (path === "/materials" && !second) return delayed;
    return { items: [] };
  });
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  await waitFor(() => expect(request).toHaveBeenCalledWith("/materials"));
  second = true;
  act(() =>
    authEvents.listener?.("SIGNED_IN", {
      user: { id: "second-user", is_anonymous: true },
    }),
  );
  expect(
    await screen.findByRole("heading", { name: /Hai, Akun Kedua!/ }),
  ).toBeTruthy();
  await act(async () => finishOld({ items: [] }));
  expect(
    screen.getByRole("heading", { name: /Hai, Akun Kedua!/ }),
  ).toBeTruthy();
  expect(screen.queryByText(/Hai, Akun Lama!/)).toBeNull();
});
it("keeps a failed bootstrap out of the workspace and supports retry", async () => {
  let fail = true;
  request.mockImplementation(async (path: string) => {
    if (path === "/profile") {
      if (fail) throw new TypeError("Failed to fetch");
      return { ...defaultProfile, onboarding_step: 4 };
    }
    return { items: [] };
  });
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  expect(
    await screen.findByRole("heading", {
      name: "Ruang belajar belum berhasil dimuat",
    }),
  ).toBeTruthy();
  expect(screen.queryByRole("navigation")).toBeNull();
  fail = false;
  await userEvent.click(
    screen.getByRole("button", { name: "Coba muat kembali" }),
  );
  expect(await screen.findByRole("navigation")).toBeTruthy();
  expect(screen.queryByRole("alert")).toBeNull();
});

it("requests recommendations for recent material using the saved daily budget", async () => {
  request.mockImplementation(async (path: string) => {
    if (path === "/profile")
      return { ...defaultProfile, daily_minutes: 5, onboarding_step: 4 };
    if (path === "/materials")
      return {
        items: [
          {
            id: "first",
            title: "Materi pertama",
            subject: "IPA",
            concepts: [],
          },
          {
            id: "recent",
            title: "Materi terbaru",
            subject: "IPA",
            concepts: [],
          },
        ],
      };
    if (path === "/sessions")
      return {
        items: [
          {
            material_id: "recent",
            updated_at: "2026-11-17T00:00:00Z",
            completed_concepts: [],
          },
        ],
      };
    if (path.startsWith("/recommendations")) return null;
    return { items: [] };
  });
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  await screen.findByRole("navigation");
  expect(request).toHaveBeenCalledWith(
    "/recommendations?material_id=recent&available_minutes=5",
  );
  expect(screen.getByText("Target 5 menit per hari")).toBeTruthy();
});
it("saves the complete editable profile while excluding server-owned fields", async () => {
  request.mockImplementation(
    async (path: string, body: unknown, method: string) => {
      if (path === "/profile")
        return method === "PUT"
          ? body
          : {
              ...defaultProfile,
              id: "server-owned-id",
              revision: 2,
              onboarding_step: 4,
            };
      if (path.startsWith("/recommendations")) return null;
      return { items: [] };
    },
  );
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  await screen.findByRole("navigation");
  await userEvent.click(
    screen.getByRole("button", { name: /Buka pengaturan/ }),
  );
  expect(
    within(
      screen.getByRole("navigation", { name: "Navigasi utama" }),
    ).queryByRole("link", {
      name: "Pengaturan",
    }),
  ).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Profil" }));
  const name = await screen.findByLabelText("Nama Panggilan di Aplikasi");
  await userEvent.clear(name);
  await userEvent.type(name, "Manda baru");
  await userEvent.click(
    screen.getByRole("button", { name: "Simpan Perubahan Profil" }),
  );
  await waitFor(() =>
    expect(
      request.mock.calls.some((c) => c[0] === "/profile" && c[2] === "PUT"),
    ).toBe(true),
  );
  const payload = request.mock.calls.find(
    (c) => c[0] === "/profile" && c[2] === "PUT",
  )![1];
  expect(payload.display_name).toBe("Manda baru");
  expect(payload.preferences).toEqual(defaultProfile.preferences);
  expect(payload.available_days).toEqual(defaultProfile.available_days);
  expect(payload).not.toHaveProperty("id");
});

it("menampilkan landing meski sesi tersimpan dan tidak memaksa onboarding yang belum selesai", async () => {
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? { ...defaultProfile, onboarding_step: 0 }
      : path.startsWith("/recommendations")
        ? null
        : { items: [] },
  );
  render(<Home />);
  expect(
    await screen.findByRole("heading", {
      name: /Setiap orang punya/,
    }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: "Atur preferensi belajar" }),
  ).toBeNull();
  await userEvent.click(
    screen.getByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  expect(
    await screen.findByRole("button", { name: "Atur preferensi belajar" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: "Kembali ke beranda" }),
  ).toBeNull();
  await userEvent.click(
    screen.getByRole("button", { name: "Atur preferensi belajar" }),
  );
  await userEvent.click(
    await screen.findByRole("button", { name: "Kembali ke beranda" }),
  );
  expect(
    await screen.findByRole("button", { name: "Atur preferensi belajar" }),
  ).toBeTruthy();
  expect(
    request.mock.calls.some((c) => c[0] === "/profile" && c[2] === "PUT"),
  ).toBe(false);
});

it("starts the Mimo guide only after choosing demo and allows skipping", async () => {
  const session = vi.spyOn(auth!.auth, "getSession").mockResolvedValueOnce({
    data: { session: null },
    error: null,
  });
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? defaultProfile
      : path.startsWith("/recommendations")
        ? null
        : { items: [] },
  );
  render(<Home />);
  expect(screen.queryByText("Lewati tur")).toBeNull();
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  expect(screen.queryByText("Lewati tur")).toBeNull();
  await userEvent.click(screen.getByRole("link", { name: "Coba demo Manda" }));
  expect(
    await screen.findByRole("heading", { name: "Mulai dari satu konsep" }),
  ).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Lewati tur" }));
  expect(screen.queryByText("Lewati tur")).toBeNull();
  session.mockRestore();
});

it("starts the guide when returning with an existing demo session", async () => {
  request.mockImplementation(async (path: string) =>
    path === "/profile"
      ? defaultProfile
      : path.startsWith("/recommendations")
        ? null
        : { items: [] },
  );
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  expect(
    await screen.findByRole("heading", { name: "Mulai dari satu konsep" }),
  ).toBeTruthy();
});

it("opens the reader when a recommendation points to a retired concept", async () => {
  const concept = {
    id: "current",
    title: "Konsep yang tersedia",
    paragraphs: ["Isi bacaan."],
    estimated_minutes: 5,
    source_ids: [],
  };
  const material = {
    id: "demo",
    title: "Materi demo",
    subject: "IPA",
    concepts: [concept],
    sources: [],
  };
  request.mockImplementation(
    async (path: string, body: unknown, method: string) => {
      if (path === "/profile") return { ...defaultProfile, onboarding_step: 4 };
      if (path === "/materials") return { items: [material] };
      if (path.startsWith("/recommendations"))
        return {
          action: "ADVANCE",
          material_id: "demo",
          concept_id: "retired",
          estimated_minutes: 5,
        };
      if (path === "/sessions" && method === "POST")
        return {
          ...(body as object),
          id: "opened",
          paragraph: 0,
          version: 1,
          status: "active",
          completed_concepts: [],
          draft: "",
          updated_at: "2026-11-20T00:00:00Z",
        };
      if (path.endsWith("/attempts/active")) return null;
      return { items: [] };
    },
  );
  render(<Home />);
  await userEvent.click(
    await screen.findByRole("link", { name: "Mulai Belajar Gratis" }),
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Mulai belajar.*5 menit/i }),
  );
  expect(
    await screen.findByRole("heading", { name: concept.title }),
  ).toBeTruthy();
  expect(
    request.mock.calls.find(
      ([path, , method]) => path === "/sessions" && method === "POST",
    )?.[1],
  ).toMatchObject({ concept_id: concept.id, material_id: material.id });
});

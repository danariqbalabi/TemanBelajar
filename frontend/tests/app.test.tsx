import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { defaultProfile } from "../src/lib/types";
const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../src/lib/api", () => ({
  api: request,
  ApiError: class extends Error {},
  auth: {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: "test-user", is_anonymous: true } } },
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  },
  mutation: (path: string, body: object, method = "POST") => {
    const payload = { ...body, request_id: crypto.randomUUID() };
    return () => request(path, payload, method);
  },
}));
import Home from "../src/app/page";
afterEach(() => {
  cleanup();
  request.mockReset();
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
    await screen.findByRole("link", { name: "Mulai belajar" }),
  );
  await screen.findByRole("navigation");
  await userEvent.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "Pengaturan",
    }),
  );
  await userEvent.click(screen.getByRole("button", { name: "Profil" }));
  const name = await screen.findByLabelText("Nama panggilan");
  await userEvent.clear(name);
  await userEvent.type(name, "Manda baru");
  await userEvent.click(
    screen.getByRole("button", { name: "Simpan Semua Preferensi" }),
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
      name: "Setiap orang punya cara belajarnya sendiri.",
    }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("button", { name: "Atur preferensi belajar" }),
  ).toBeNull();
  await userEvent.click(screen.getByRole("link", { name: "Mulai belajar" }));
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

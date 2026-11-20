import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const { otp, demo } = vi.hoisted(() => ({ otp: vi.fn(), demo: vi.fn() }));
vi.mock("../src/lib/api", () => ({
  auth: { auth: { signInWithOtp: otp, signInAnonymously: demo } },
}));
import { AccountDesign } from "../src/app/design-account";
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const run = async (action: () => Promise<void>) => {
  await action();
};
it("mengirim tautan masuk dari form revamp dengan redirect lokal", async () => {
  otp.mockResolvedValue({ error: null });
  render(<AccountDesign onBack={vi.fn()} run={run} busy={false} error="" />);
  await userEvent.click(
    screen.getByRole("button", { name: "Masuk lewat tautan email" }),
  );
  await userEvent.type(screen.getByLabelText(/Email/), "manda@example.invalid");
  await userEvent.click(
    screen.getByRole("button", { name: "Kirim tautan masuk" }),
  );
  await waitFor(() =>
    expect(otp).toHaveBeenCalledWith({
      email: "manda@example.invalid",
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        shouldCreateUser: false,
      },
    }),
  );
  expect(
    await screen.findByText(/Kalau email ini sudah terdaftar/),
  ).toBeTruthy();
});
it("tombol demo revamp membuat sesi anonim nyata", async () => {
  demo.mockResolvedValue({ error: null });
  render(<AccountDesign onBack={vi.fn()} run={run} busy={false} error="" />);
  await userEvent.click(screen.getByRole("link", { name: "Coba demo Manda" }));
  expect(demo).toHaveBeenCalledOnce();
});

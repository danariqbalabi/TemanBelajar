import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { userMessage } from "../src/lib/errors";
const { provider } = vi.hoisted(() => ({
  provider: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOtp: vi.fn(),
    signInAnonymously: vi.fn(),
    resend: vi.fn(),
  },
}));
vi.mock("../src/lib/api", () => ({ auth: { auth: provider } }));
import { AccountDesign } from "../src/app/design-account";
const errors: string[] = [];
const run = async (action: () => Promise<void>) => {
  try {
    await action();
  } catch (error) {
    errors.push(userMessage(error));
  }
};
function show() {
  return render(
    <AccountDesign onBack={vi.fn()} run={run} busy={false} error="" />,
  );
}
beforeEach(() => {
  errors.length = 0;
  for (const method of Object.values(provider))
    method
      .mockReset()
      .mockResolvedValue({ data: { session: null }, error: null });
});
afterEach(cleanup);
it("masuk memakai email dan kata sandi tanpa mengirim email", async () => {
  show();
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "siswa@example.test",
  );
  await userEvent.type(screen.getByLabelText("Kata sandi"), "rahasia-lama");
  await userEvent.click(screen.getByRole("button", { name: "Masuk ke akun" }));
  expect(provider.signInWithPassword).toHaveBeenCalledWith({
    email: "siswa@example.test",
    password: "rahasia-lama",
  });
  expect(provider.signInWithOtp).not.toHaveBeenCalled();
});
it("daftar dengan nama sendiri, konfirmasi email, dan kirim ulang", async () => {
  show();
  await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
  await userEvent.type(screen.getByLabelText("Nama panggilan"), "Rani");
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "rani@example.test",
  );
  await userEvent.type(
    screen.getByLabelText("Kata sandi", { exact: true }),
    "rahasia-baru",
  );
  await userEvent.type(
    screen.getByLabelText("Ulangi kata sandi"),
    "rahasia-baru",
  );
  await userEvent.click(screen.getByRole("button", { name: "Buat akun" }));
  expect(provider.signUp).toHaveBeenCalledWith({
    email: "rani@example.test",
    password: "rahasia-baru",
    options: {
      data: { display_name: "Rani" },
      emailRedirectTo: location.origin + "/auth/callback",
    },
  });
  expect(
    screen.getByText(
      /Periksa kotak masuk atau spam untuk mengonfirmasi emailmu/,
    ),
  ).toBeTruthy();
  await userEvent.click(
    screen.getByRole("button", { name: "Kirim ulang email konfirmasi" }),
  );
  expect(provider.resend).toHaveBeenCalledWith({
    type: "signup",
    email: "rani@example.test",
    options: { emailRedirectTo: location.origin + "/auth/callback" },
  });
});
it("kata sandi berbeda tidak mengirim permintaan daftar", async () => {
  show();
  await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
  await userEvent.type(screen.getByLabelText("Nama panggilan"), "Rani");
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "rani@example.test",
  );
  await userEvent.type(
    screen.getByLabelText("Kata sandi", { exact: true }),
    "rahasia-baru",
  );
  await userEvent.type(
    screen.getByLabelText("Ulangi kata sandi"),
    "beda-banget",
  );
  await userEvent.click(screen.getByRole("button", { name: "Buat akun" }));
  expect(screen.getByRole("alert").textContent).toMatch(/belum sama/);
  expect(provider.signUp).not.toHaveBeenCalled();
});
it("tautan email memakai callback dan pendaftaran tetap eksplisit", async () => {
  show();
  await userEvent.click(
    screen.getByRole("button", { name: "Masuk lewat tautan email" }),
  );
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "rani@example.test",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Kirim tautan masuk" }),
  );
  expect(provider.signInWithOtp).toHaveBeenCalledWith({
    email: "rani@example.test",
    options: {
      emailRedirectTo: location.origin + "/auth/callback",
      shouldCreateUser: false,
    },
  });
});
it("demo Manda tetap bisa masuk tanpa email", async () => {
  show();
  await userEvent.click(screen.getByRole("link", { name: "Coba demo Manda" }));
  expect(provider.signInAnonymously).toHaveBeenCalledTimes(1);
  expect(provider.signInWithPassword).not.toHaveBeenCalled();
});
it("password salah menampilkan pesan yang bisa dipahami", async () => {
  provider.signInWithPassword.mockResolvedValue({
    error: { code: "invalid_credentials" },
  });
  show();
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "rani@example.test",
  );
  await userEvent.type(screen.getByLabelText("Kata sandi"), "salah");
  await userEvent.click(screen.getByRole("button", { name: "Masuk ke akun" }));
  expect(errors).toContain(
    "Email atau kata sandi belum cocok. Coba periksa kembali.",
  );
});

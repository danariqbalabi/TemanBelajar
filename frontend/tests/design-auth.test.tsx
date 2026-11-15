import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const { passwordLogin, signup } = vi.hoisted(() => ({
  passwordLogin: vi.fn(),
  signup: vi.fn(),
}));
vi.mock("../src/lib/api", () => ({
  auth: { auth: { signInWithPassword: passwordLogin, signUp: signup } },
}));
import { AccountDesign } from "../src/app/design-account";
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const run = async (action: () => Promise<void>) => {
  await action();
};
it("source-design password form submits the typed email and password", async () => {
  passwordLogin.mockResolvedValue({ error: null });
  render(<AccountDesign onBack={() => {}} run={run} busy={false} error="" />);
  await userEvent.type(
    screen.getByLabelText("Alamat email"),
    "manda@example.invalid",
  );
  await userEvent.click(
    screen.getByText("Atau masuk dengan kata sandi sekolah"),
  );
  await userEvent.type(
    screen.getByLabelText("Kata Sandi"),
    "test-password-123",
  );
  await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
  await waitFor(() =>
    expect(passwordLogin).toHaveBeenCalledWith({
      email: "manda@example.invalid",
      password: "test-password-123",
    }),
  );
});
it("source-design registration preserves nickname and reports confirmation", async () => {
  signup.mockResolvedValue({ data: { session: null }, error: null });
  render(<AccountDesign onBack={() => {}} run={run} busy={false} error="" />);
  await userEvent.click(screen.getByRole("tab", { name: "Buat Akun Siswa" }));
  await userEvent.type(
    screen.getByLabelText("Alamat Email"),
    "manda@example.invalid",
  );
  await userEvent.type(
    screen.getByLabelText("Kata sandi"),
    "test-password-123",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Mulai Belajar Mandiri (Gratis)" }),
  );
  expect(
    await screen.findByText(
      "Periksa email untuk mengonfirmasi akun, lalu masuk kembali.",
    ),
  ).toBeTruthy();
  expect(signup.mock.calls[0][0]).toMatchObject({
    email: "manda@example.invalid",
    password: "test-password-123",
    options: { data: { display_name: "Manda" } },
  });
});

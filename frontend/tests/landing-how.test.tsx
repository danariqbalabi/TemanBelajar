import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { LandingHow } from "../src/app/landing-how";

afterEach(cleanup);
it("lets visitors try formats, reasons and a schedule without changing account data", async () => {
  render(<LandingHow />);
  expect(
    screen.getByRole("heading", { name: "Mulai dalam 3 langkah." }),
  ).toBeTruthy();
  expect(screen.queryByText(/bukan progres akunmu/)).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Fokus" }));
  expect(screen.getByText("Satu konsep dulu.")).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Fokus" }).getAttribute("aria-pressed"),
  ).toBe("true");
  const reason = screen.getByRole("button", {
    name: "Lihat alasan contoh rekomendasi",
  });
  await userEvent.click(reason);
  expect(reason.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByRole("status").textContent).toContain(
    "jawaban tentang sumber energi",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Coba geser ke besok" }),
  );
  expect(screen.getByText("BESOK")).toBeTruthy();
  await userEvent.click(
    screen.getByRole("button", { name: "Kembalikan ke hari ini" }),
  );
  expect(screen.getByText("HARI INI")).toBeTruthy();
});

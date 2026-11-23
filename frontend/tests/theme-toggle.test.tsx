import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { ThemeToggle } from "../src/app/theme-toggle";

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

it("mengganti mode gelap dan mengingat pilihannya", async () => {
  render(<ThemeToggle />);
  const toggle = screen.getByRole("button", { name: "Mode gelap" });
  expect(toggle.getAttribute("aria-pressed")).toBe("false");

  await userEvent.click(toggle);
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("temanbelajar-theme")).toBe("dark");
  expect(toggle.getAttribute("aria-pressed")).toBe("true");

  await userEvent.click(toggle);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("temanbelajar-theme")).toBe("light");
  expect(toggle.getAttribute("aria-pressed")).toBe("false");
});

it("membaca tema yang sudah terpasang sebelum halaman dimuat", () => {
  document.documentElement.dataset.theme = "dark";
  render(<ThemeToggle />);
  expect(
    screen
      .getByRole("button", { name: "Mode gelap" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

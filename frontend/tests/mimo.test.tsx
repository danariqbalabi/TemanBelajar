import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { MimoMascot } from "../src/app/mimo-mascot";
import { reactMimo } from "../src/lib/mimo";

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it("cycles poses without a popup or losing keyboard focus", async () => {
  const { container } = render(
    <MimoMascot variant="dock" context="Materi Saya" />,
  );
  const mascot = screen.getByRole("button", { name: "Sapa Mimo" });
  mascot.focus();
  for (const mood of ["wave", "cheer", "reading"]) {
    await userEvent.keyboard("{Enter}");
    expect(container.querySelector(`[data-mood='${mood}']`)).toBeTruthy();
    expect(document.activeElement).toBe(mascot);
  }
  expect(mascot.hasAttribute("aria-expanded")).toBe(false);
  expect(screen.getByRole("status").textContent).toBe("Mimo membaca!");
  expect(screen.queryByRole("button", { name: /Pose lain/ })).toBeNull();
  expect(container.querySelector(".mimo-bubble")).toBeNull();
});

it("can rest and wake without modifying account preferences", async () => {
  render(<MimoMascot variant="dock" />);
  await userEvent.click(screen.getByRole("button", { name: "Sapa Mimo" }));
  await userEvent.click(
    screen.getByRole("button", { name: "Istirahatkan Mimo" }),
  );
  expect(screen.queryByRole("button", { name: "Sapa Mimo" })).toBeNull();
  const wake = screen.getByRole("button", { name: "Bangunkan Mimo" });
  expect(document.activeElement).toBe(wake);
  await userEvent.click(wake);
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Sapa Mimo" }),
  );
});

it("reacts to completed actions without opening unsolicited messages", async () => {
  const { container, unmount } = render(<MimoMascot variant="dock" />);
  act(() => reactMimo({ mood: "cheer", message: "Satu konsep selesai." }));
  await waitFor(() =>
    expect(container.querySelector("[data-mood='cheer']")).toBeTruthy(),
  );
  expect(screen.getByRole("status").textContent).toBe("");
  expect(
    screen
      .getByRole("button", { name: "Sapa Mimo" })
      .getAttribute("aria-expanded"),
  ).toBeNull();
  unmount();
  act(() => reactMimo({ mood: "reading", message: "Pelan-pelan." }));
  expect(container.children).toHaveLength(0);
});

it("keeps pointer motion off for reduced-motion preferences while allowing pose changes", async () => {
  const { container } = render(<MimoMascot reducedMotion />);
  const mascot = screen.getByRole("button", { name: "Sapa Mimo" });
  fireEvent.pointerMove(mascot, {
    clientX: 12,
    clientY: 12,
    pointerType: "mouse",
  });
  expect(mascot.style.getPropertyValue("--mimo-look-x")).toBe("");
  expect(container.querySelector("[data-reduced-motion='true']")).toBeTruthy();
  await userEvent.click(mascot);
  expect(container.querySelector("[data-reduced-motion='true']")).toBeTruthy();
  expect(container.querySelector("[data-mood='cheer']")).toBeTruthy();
});

it("syncs mute between mascots and persists it", async () => {
  render(
    <>
      <MimoMascot />
      <MimoMascot variant="dock" />
    </>,
  );
  const controls = screen.getAllByRole("button", { name: "Suara Mimo" });
  await userEvent.click(controls[0]);
  expect(
    controls.every((c) => c.getAttribute("aria-pressed") === "false"),
  ).toBe(true);
  expect(localStorage.getItem("temanbelajar:mimo-muted")).toBe("true");
});

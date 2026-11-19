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
  vi.unstubAllGlobals();
});

it("cycles mascot poses with keyboard and closes its message without losing focus", async () => {
  const { container } = render(
    <MimoMascot variant="dock" context="Materi Saya" />,
  );
  const mascot = screen.getByRole("button", { name: "Sapa Mimo" });
  expect(container.querySelector("[data-mood='reading']")).toBeTruthy();
  mascot.focus();
  await userEvent.keyboard("{Enter}");
  expect(mascot.getAttribute("aria-expanded")).toBe("true");
  expect(container.querySelector("[data-mood='cheer']")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toContain("Tos kecil");
  await userEvent.click(screen.getByRole("button", { name: /Pose lain/ }));
  expect(container.querySelector("[data-mood='reading']")).toBeTruthy();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("status")).toBeNull();
  expect(document.activeElement).toBe(mascot);
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
  expect(screen.queryByRole("status")).toBeNull();
  expect(
    screen
      .getByRole("button", { name: "Sapa Mimo" })
      .getAttribute("aria-expanded"),
  ).toBe("false");
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
  expect(screen.getByText(/Mode tenang/)).toBeTruthy();
  expect(container.querySelector("[data-mood='cheer']")).toBeTruthy();
});

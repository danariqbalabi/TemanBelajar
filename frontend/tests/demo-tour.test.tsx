import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { DemoTour } from "../src/app/demo-tour";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("keeps the shade as the spotlight leaves the viewport and lets Mimo switch pose", async () => {
  render(
    <>
      <button data-path="mulai-belajar">Mulai</button>
      <DemoTour page="Beranda" suspended={false} onClose={() => {}} />
    </>,
  );
  const target = screen.getByRole("button", { name: "Mulai" });
  const rect = vi
    .spyOn(target, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(40, 160, 150, 48));
  window.dispatchEvent(new Event("scroll"));
  await waitFor(() =>
    expect(
      document
        .querySelector(".demo-tour-shade")
        ?.getAttribute("data-spotlight"),
    ).toBe("true"),
  );
  expect(document.querySelectorAll(".demo-tour-shade")).toHaveLength(1);
  rect.mockReturnValue(new DOMRect(40, -80, 150, 48));
  window.dispatchEvent(new Event("scroll"));
  await screen.findByRole("button", { name: "Lihat tombolnya" });
  expect(document.querySelectorAll(".demo-tour-shade")).toHaveLength(1);
  expect(
    document.querySelector(".demo-tour-shade")?.getAttribute("data-spotlight"),
  ).toBe("false");
  const mimo = screen.getByRole("button", { name: "Ganti pose Mimo" });
  await userEvent.click(mimo);
  expect(mimo.getAttribute("aria-pressed")).toBe("true");
});

it("only finishes the planner guide after a confirmed save", async () => {
  render(
    <>
      <input
        data-tour="planner-date"
        type="datetime-local"
        defaultValue="2026-11-20T09:00"
      />
      <select data-tour="planner-new">
        <option value="">Rencana baru</option>
      </select>
      <button data-tour="planner-suggest">Susun</button>
      <button data-tour="planner-save" disabled>
        Simpan
      </button>
      <DemoTour page="Rencana Belajar" suspended={false} onClose={() => {}} />
    </>,
  );
  expect(
    await screen.findByRole("heading", { name: "Susun jadwal awal" }),
  ).toBeTruthy();
  const save = screen.getByRole("button", { name: "Simpan" });
  (save as HTMLButtonElement).disabled = false;
  expect(
    await screen.findByRole("heading", { name: "Simpan jadwalmu" }),
  ).toBeTruthy();
  const confirmation = document.createElement("p");
  confirmation.dataset.tour = "planner-saved";
  document.body.append(confirmation);
  try {
    expect(
      await screen.findByRole("heading", { name: /Tur selesai/i }),
    ).toBeTruthy();
  } finally {
    confirmation.remove();
  }
});

it("leaves the page interactive when a guide target is missing", async () => {
  render(<DemoTour page="Beranda" suspended={false} onClose={() => {}} />);
  expect(await screen.findByText(/Langkah ini belum tersedia/)).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Lihat tombolnya" })).toBeNull();
  expect(document.querySelector(".demo-tour-shade")).toBeNull();
});

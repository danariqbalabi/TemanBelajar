import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { SettingsDesign } from "../src/app/design-settings";
import { defaultProfile } from "../src/lib/types";
afterEach(cleanup);
it("keeps comfort switches inside their group and saves their values", async () => {
  const save = vi.fn();
  render(
    <SettingsDesign
      profile={defaultProfile}
      onSave={save}
      busy={false}
      account={{ user: { email: "test@example.com" } } as Session}
      signOut={() => {}}
      onBack={() => {}}
    />,
  );
  const heading = screen.getByText("Gerakan & fokus");
  await userEvent.click(heading);
  const timer = screen.getByRole("switch", { name: "Tampilkan waktu belajar" });
  const mimo = screen.getByRole("switch", { name: "Tampilkan Mimo" });
  expect(timer.closest("details")).toBe(heading.closest("details"));
  expect(mimo.closest("details")).toBe(heading.closest("details"));
  await userEvent.click(timer);
  await userEvent.click(mimo);
  await userEvent.click(
    screen.getByRole("button", { name: "Terapkan preferensi" }),
  );
  expect(save.mock.calls[0][0].preferences.timer_enabled).toBe(
    !defaultProfile.preferences.timer_enabled,
  );
  expect(save.mock.calls[0][0].preferences.show_mimo).toBe(
    !defaultProfile.preferences.show_mimo,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Batalkan perubahan" }),
  );
  expect((timer as HTMLInputElement).checked).toBe(
    defaultProfile.preferences.timer_enabled,
  );
  expect((mimo as HTMLInputElement).checked).toBe(
    defaultProfile.preferences.show_mimo,
  );
});

it("previews the selected theme and saves it with the displayed font size", async () => {
  const save = vi.fn();
  render(
    <SettingsDesign
      profile={defaultProfile}
      onSave={save}
      busy={false}
      account={{ user: { email: "test@example.com" } } as Session}
      signOut={() => {}}
      onBack={() => {}}
    />,
  );
  await userEvent.click(screen.getByText("Warna & kontras"));
  const contrast = screen.getByRole("button", { name: /Kontras Tinggi/ });
  const cream = screen.getByRole("button", { name: /Krem Hangat/ });
  await userEvent.click(contrast);
  expect(contrast.getAttribute("aria-pressed")).toBe("true");
  expect(cream.getAttribute("aria-pressed")).toBe("false");
  const preview = screen
    .getByText("Belajar satu langkah dulu")
    .closest("[data-reading-preview]");
  expect(preview?.getAttribute("data-contrast")).toBe("true");

  await userEvent.click(screen.getByText("Teks & bacaan"));
  await userEvent.click(screen.getByRole("button", { name: "Besarkan Huruf" }));
  expect(document.getElementById("font-size-display")?.textContent).toBe(
    "20 px",
  );
  expect(screen.getByRole("slider", { name: "Ukuran huruf" })).toHaveProperty(
    "value",
    "20",
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Simpan Preferensi" }),
  );
  expect(save.mock.calls[0][0].preferences).toMatchObject({
    high_contrast: true,
    font_size: 20,
  });
  await userEvent.click(cream);
  expect(preview?.getAttribute("data-contrast")).toBe("false");
});

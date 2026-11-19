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

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SettingsDesign } from "../src/app/design-settings";
import { defaultProfile } from "../src/lib/types";
import type { Session } from "@supabase/supabase-js";

afterEach(cleanup);
it("opens settings on demand and preserves edits after collapsing", async () => {
  const onSave = vi.fn();
  render(
    <SettingsDesign
      profile={defaultProfile}
      onSave={onSave}
      busy={false}
      account={{ user: { is_anonymous: true } } as Session}
      signOut={vi.fn()}
      onBack={vi.fn()}
    />,
  );
  const title = screen.getByText("Teks & bacaan");
  const group = title.closest("details")!;
  expect(group.open).toBe(false);
  await userEvent.click(title);
  expect(group.open).toBe(true);
  const nunito = screen.getByRole("button", { name: /Nunito/ });
  await userEvent.click(nunito);
  await userEvent.click(title);
  expect(group.open).toBe(false);
  await userEvent.click(title);
  expect(
    screen.getByRole("button", { name: /Nunito/ }).getAttribute("aria-pressed"),
  ).toBe("true");
});

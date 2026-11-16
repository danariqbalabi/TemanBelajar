import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { useReadingDraft } from "../src/app/use-reading-draft";
import type { LearningSession } from "../src/lib/types";

const session = { id: "notes", draft: "saved", version: 1 } as LearningSession;
afterEach(() => {
  cleanup();
  localStorage.clear();
});

it("recovers unsaved notes after leaving and reopening a session", async () => {
  const first = renderHook(() => useReadingDraft(session));
  act(() => first.result.current.setDraft("my unsaved notes"));
  await waitFor(() =>
    expect(localStorage.getItem("temanbelajar-draft:notes")).toBe(
      "my unsaved notes",
    ),
  );
  first.unmount();
  const reopened = renderHook(() => useReadingDraft(session));
  expect(reopened.result.current.draft).toBe("my unsaved notes");
  expect(reopened.result.current.draftNotice).toContain("browser ini");
});

it("clears a saved draft without discarding edits made during the request", async () => {
  const hook = renderHook(({ value }) => useReadingDraft(value), {
    initialProps: { value: session },
  });
  act(() => hook.result.current.setDraft("first edit"));
  act(() => hook.result.current.setDraft("newer edit"));
  hook.rerender({ value: { ...session, draft: "first edit", version: 2 } });
  expect(hook.result.current.draft).toBe("newer edit");
  hook.rerender({ value: { ...session, draft: "newer edit", version: 3 } });
  await waitFor(() =>
    expect(localStorage.getItem("temanbelajar-draft:notes")).toBeNull(),
  );
  expect(hook.result.current.draftNotice).toBeNull();
});

it("loads refreshed server notes when there are no local edits", () => {
  const hook = renderHook(({ value }) => useReadingDraft(value), {
    initialProps: { value: session },
  });
  hook.rerender({
    value: { ...session, draft: "from another device", version: 2 },
  });
  expect(hook.result.current.draft).toBe("from another device");
});

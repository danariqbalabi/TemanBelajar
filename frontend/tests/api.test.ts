import { afterEach, beforeEach, expect, it, vi } from "vitest";
const { getSession, refreshSession } = vi.hoisted(() => ({
  getSession: vi.fn(),
  refreshSession: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getSession, refreshSession } }),
}));
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.invalid");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key");
  getSession.mockResolvedValue({
    data: { session: { access_token: "old-token" } },
  });
  refreshSession.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("retry preserves the original request id and payload after a network failure", async () => {
  const fetcher = vi
    .fn()
    .mockRejectedValueOnce(new TypeError("offline"))
    .mockResolvedValueOnce(Response.json({ id: "saved" }));
  vi.stubGlobal("fetch", fetcher);
  const { mutation } = await import("../src/lib/api");
  const save = mutation("/sessions", { material_id: "demo" });
  await expect(save()).rejects.toThrow("offline");
  await expect(save()).resolves.toEqual({ id: "saved" });
  expect(fetcher.mock.calls[0][1].body).toBe(fetcher.mock.calls[1][1].body);
  expect(JSON.parse(fetcher.mock.calls[1][1].body).request_id).toBeTruthy();
});
it("refreshes an expired token once while preserving the mutation body", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({ detail: "expired" }, { status: 401 }),
    )
    .mockResolvedValueOnce(Response.json({ id: "saved" }));
  vi.stubGlobal("fetch", fetcher);
  refreshSession.mockResolvedValue({
    data: { session: { access_token: "fresh-token" } },
  });
  const { mutation } = await import("../src/lib/api");
  await mutation("/sessions", { material_id: "demo" })();
  expect(refreshSession).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[1][1].headers.Authorization).toBe(
    "Bearer fresh-token",
  );
  expect(fetcher.mock.calls[0][1].body).toBe(fetcher.mock.calls[1][1].body);
});
it("keeps conflict status and server explanation available to the UI", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ detail: "versi berubah" }, { status: 409 }),
      ),
  );
  const { api, ApiError } = await import("../src/lib/api");
  try {
    await api("/sessions/session");
    throw Error("expected conflict");
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, message: "versi berubah" });
  }
});

it("accepts a valid null response for an absent active attempt", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(null)));
  const { api } = await import("../src/lib/api");
  await expect(api("/sessions/test/attempts/active")).resolves.toBeNull();
});

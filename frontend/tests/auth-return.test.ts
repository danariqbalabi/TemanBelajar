import { afterEach, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { finishAuthReturn } from "../src/lib/auth-return";

const session = { user: { id: "real-user", is_anonymous: false } };
function provider() {
  const result = { data: { session }, error: null };
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue(result),
      setSession: vi.fn().mockResolvedValue(result),
      exchangeCodeForSession: vi.fn().mockResolvedValue(result),
      verifyOtp: vi.fn().mockResolvedValue(result),
    },
  };
}
afterEach(() => window.history.replaceState(null, "", "/"));
it("memulihkan token tautan lama di root dan membersihkan URL", async () => {
  window.history.replaceState(
    null,
    "",
    "/#access_token=access&refresh_token=refresh&type=magiclink",
  );
  const client = provider();
  await expect(
    finishAuthReturn(client as unknown as SupabaseClient),
  ).resolves.toEqual({ session, callback: true });
  expect(client.auth.setSession).toHaveBeenCalledWith({
    access_token: "access",
    refresh_token: "refresh",
  });
  expect(location.hash).toBe("");
});
it("menukar kode callback sekali meski efek dipanggil dua kali", async () => {
  window.history.replaceState(
    null,
    "",
    "/auth/callback?code=once&next=https://external.invalid",
  );
  const client = provider();
  const first = finishAuthReturn(client as unknown as SupabaseClient);
  const second = finishAuthReturn(client as unknown as SupabaseClient);
  await Promise.all([first, second]);
  expect(client.auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  expect(location.pathname).toBe("/");
  expect(location.search).toBe("");
});
it("memverifikasi hash konfirmasi pendaftaran", async () => {
  window.history.replaceState(
    null,
    "",
    "/auth/callback?token_hash=hashed&type=signup",
  );
  const client = provider();
  await finishAuthReturn(client as unknown as SupabaseClient);
  expect(client.auth.verifyOtp).toHaveBeenCalledWith({
    token_hash: "hashed",
    type: "signup",
  });
});
it.each([
  "/auth/callback",
  "/#error=access_denied&error_code=otp_expired",
  "/auth/callback?token_hash=hashed&type=unknown",
  "/#access_token=access",
  "/auth/callback?token_hash=hashed&type=recovery",
])("menolak callback tidak valid tanpa memakai sesi demo: %s", async (url) => {
  window.history.replaceState(null, "", url);
  const client = provider();
  await expect(
    finishAuthReturn(client as unknown as SupabaseClient),
  ).rejects.toThrow(/Tautan masuk/);
  expect(client.auth.getSession).not.toHaveBeenCalled();
  expect(location.href).not.toMatch(/access_token|token_hash|error_code/);
});
it("menampilkan kegagalan kode yang sudah dipakai", async () => {
  window.history.replaceState(null, "", "/auth/callback?code=expired");
  const client = provider();
  client.auth.exchangeCodeForSession.mockResolvedValue({
    data: { session: null },
    error: { message: "expired" },
  });
  await expect(
    finishAuthReturn(client as unknown as SupabaseClient),
  ).rejects.toThrow(/kedaluwarsa/);
});

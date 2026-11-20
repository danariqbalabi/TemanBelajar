import type { Session, SupabaseClient } from "@supabase/supabase-js";

type AuthReturn = { session: Session | null; callback: boolean };
const pending = new WeakMap<SupabaseClient, Promise<AuthReturn>>();
const invalidLink = () =>
  new Error(
    "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru atau masuk dengan email dan kata sandi.",
  );

export function authCallbackUrl() {
  return `${window.location.origin}/auth/callback`;
}

// One exchange per redirect, including React Strict Mode's repeated effect.
export function finishAuthReturn(client: SupabaseClient): Promise<AuthReturn> {
  const inFlight = pending.get(client);
  if (inFlight) return inFlight;
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.slice(1));
  const callback =
    url.pathname === "/auth/callback" ||
    ["code", "token_hash", "error", "error_code"].some((key) =>
      url.searchParams.has(key),
    ) ||
    ["access_token", "refresh_token", "error", "error_code"].some((key) =>
      hash.has(key),
    );
  if (!callback)
    return client.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      return { session: data.session, callback: false };
    });
  const operation = (async () => {
    try {
      if (
        url.searchParams.has("error") ||
        url.searchParams.has("error_code") ||
        hash.has("error") ||
        hash.has("error_code")
      )
        throw invalidLink();
      const type = url.searchParams.get("type") || hash.get("type");
      // Password recovery needs a separate form; never silently consume it as login.
      if (type === "recovery") throw invalidLink();
      let session: Session | null;
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      if (code) {
        const { data, error } = await client.auth.exchangeCodeForSession(code);
        if (error) throw invalidLink();
        session = data.session;
      } else if (
        tokenHash &&
        ["email", "signup", "magiclink"].includes(type || "")
      ) {
        const { data, error } = await client.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "email" | "signup" | "magiclink",
        });
        if (error) throw invalidLink();
        session = data.session;
      } else if (hash.get("access_token") && hash.get("refresh_token")) {
        const { data, error } = await client.auth.setSession({
          access_token: hash.get("access_token")!,
          refresh_token: hash.get("refresh_token")!,
        });
        if (error) throw invalidLink();
        session = data.session;
      } else {
        throw invalidLink();
      }
      if (!session || session.user.is_anonymous) throw invalidLink();
      return { session, callback: true };
    } finally {
      // Remove credentials and provider errors from the address bar on either outcome.
      window.history.replaceState(null, "", "/");
    }
  })();
  pending.set(client, operation);
  void operation.finally(() => pending.delete(client)).catch(() => {});
  return operation;
}

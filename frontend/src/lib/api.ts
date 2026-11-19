import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const auth = url && key ? createClient(url, key) : null;
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export async function api<T>(
  path: string,
  body?: unknown,
  method?: string,
): Promise<T> {
  const session = auth ? (await auth.auth.getSession()).data.session : null;
  const form = body instanceof FormData;
  const send = (token?: string) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/v1${path}`,
      {
        method: method || (body ? "POST" : "GET"),
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(!form && body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? (form ? body : JSON.stringify(body)) : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(115_000),
      },
    );
  let response = await send(session?.access_token);
  if (response.status === 401 && session && auth) {
    const refreshed = await auth.auth.refreshSession();
    if (refreshed.data.session)
      response = await send(refreshed.data.session.access_token);
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(502, "Respons layanan belum dapat dibaca. Coba lagi.");
  }
  const detail =
    data && typeof data === "object" && "detail" in data ? data.detail : null;
  if (!response.ok)
    throw new ApiError(
      response.status,
      typeof detail === "string"
        ? detail
        : `Permintaan belum berhasil (${response.status}). Coba lagi.`,
    );
  return data as T;
}
export function mutation<T>(path: string, body: unknown, method = "POST") {
  const payload = { ...(body as object), request_id: requestId() };
  // Retain this closure for retry so a network failure cannot duplicate the action.
  return () => api<T>(path, payload, method);
}

function requestId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // randomUUID requires HTTPS or localhost. getRandomValues also works on a LAN.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

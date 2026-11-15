import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const auth = url && key ? createClient(url, key) : null;
export class ApiError extends Error {
  status: number;
  constructor(
    status: number,
    message: string,
  ) {
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/v1${path}`,
    {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        ...(!form && body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? (form ? body : JSON.stringify(body)) : undefined,
      cache: "no-store",
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(
      response.status,
      typeof data?.detail === "string"
        ? data.detail
        : `Permintaan belum berhasil (${response.status}). Coba lagi.`,
    );
  return data as T;
}
export function mutation<T>(path: string, body: unknown, method = "POST") {
  const payload = { ...(body as object), request_id: crypto.randomUUID() };
  // Retain this closure for retry so a network failure cannot duplicate the action.
  return () => api<T>(path, payload, method);
}

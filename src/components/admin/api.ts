"use client";

export type ApiResult<T = Record<string, unknown>> = { ok: true; data: T } | { ok: false; error: string };

/** JSON fetch against /api/admin/* that always resolves to a result, never throws. */
export async function adminRequest<T = Record<string, unknown>>(url: string, method: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (json as { error?: string }).error ?? `Request failed (${res.status}).` };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}

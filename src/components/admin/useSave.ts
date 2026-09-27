"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminRequest } from "./api";

/** Create-or-update submit handling shared by the content editors. */
export function useSave({
  createUrl,
  updateUrl,
  listHref,
  updateMethod = "PUT",
}: {
  createUrl: string;
  updateUrl?: string;
  listHref: string;
  updateMethod?: "PUT" | "PATCH";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(body: unknown) {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await adminRequest<{ id?: string }>(updateUrl ?? createUrl, updateUrl ? updateMethod : "POST", body);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    if (!updateUrl && res.data.id) {
      router.push(`${listHref}/${res.data.id}?created=1`);
    } else {
      setSaved(true);
      router.refresh();
    }
    return true;
  }

  return { save, busy, error, saved, setSaved };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { adminRequest } from "./api";
import { Button, Field, inputClass } from "./ui";

/**
 * Image URL input with a signed direct-to-Cloudinary upload. PUBLIC imagery only —
 * medical reports must never go through this (they use the private Spaces flow).
 */
const NOT_CONFIGURED = "Cloudinary isn't configured — paste an image URL instead.";
const MAX_BYTES = 15 * 1024 * 1024;

type Signature = { timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string };

// One availability check per page load, shared by every image field on the page.
let statusPromise: Promise<boolean> | null = null;
function cloudinaryConfigured() {
  statusPromise ??= adminRequest<{ configured: boolean }>("/api/admin/uploads/cloudinary-signature", "GET").then((r) => r.ok && r.data.configured);
  return statusPromise;
}

async function uploadToCloudinary(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const sig = await adminRequest<Signature>("/api/admin/uploads/cloudinary-signature", "POST", {});
  if (!sig.ok) return sig;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.data.apiKey);
  form.append("timestamp", String(sig.data.timestamp));
  form.append("signature", sig.data.signature);
  form.append("folder", sig.data.folder);
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.data.cloudName)}/image/upload`, { method: "POST", body: form });
    const json = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
    if (!res.ok || !json.secure_url) return { ok: false, error: json.error?.message ?? `Upload failed (${res.status}).` };
    return { ok: true, url: json.secure_url };
  } catch {
    return { ok: false, error: "Upload failed. Check your connection and try again." };
  }
}

export function ImageUrlInput({ id, value, onChange, required }: { id: string; value: string; onChange: (url: string) => void; required?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    cloudinaryConfigured().then((ok) => live && setConfigured(ok));
    return () => {
      live = false;
    };
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Choose an image file (JPEG, PNG, WebP…).");
    if (file.size > MAX_BYTES) return setError("That image is over 15 MB. Please resize it first.");
    setBusy(true);
    const res = await uploadToCloudinary(file);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    if (!res.ok) return setError(res.error);
    onChange(res.url);
  }

  const showPreview = /^https?:\/\/\S+$/.test(value);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input id={id} type="url" value={value} onChange={(e) => onChange(e.target.value)} required={required} className={inputClass} placeholder="https://res.cloudinary.com/…" />
        <span title={configured === false ? NOT_CONFIGURED : undefined} className="shrink-0">
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={!configured || busy} aria-describedby={configured === false ? `${id}-upload-off` : undefined}>
            {busy ? "Uploading…" : "Upload"}
          </Button>
        </span>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {configured === false && (
        <p id={`${id}-upload-off`} className="text-xs text-ink/60">
          {NOT_CONFIGURED}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs font-bold text-clay">
          {error}
        </p>
      )}
      {showPreview && (
        // Any host can be pasted here, so a plain <img> (not next/image, which only allows configured hosts).
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 w-auto max-w-full rounded-hair border border-nordic/15 bg-cream object-cover" />
      )}
    </div>
  );
}

/** Image URL + alt text pair, as stored on most content types ({ url, alt }). */
export function ImageField({
  id,
  label = "Image URL (Cloudinary)",
  hint = "Real photographs from Swetaranya only. Leave empty to show the placeholder.",
  value,
  onChange,
}: {
  id: string;
  label?: string;
  hint?: string;
  value: { url: string; alt: string };
  onChange: (v: { url: string; alt: string }) => void;
}) {
  return (
    <>
      <Field label={label} htmlFor={id} hint={hint}>
        <ImageUrlInput id={id} value={value.url} onChange={(url) => onChange({ ...value, url })} />
      </Field>
      <Field label="Alt text" htmlFor={`${id}-alt`} hint="Describe what the photograph shows, for screen readers.">
        <input id={`${id}-alt`} value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} className={inputClass} />
      </Field>
    </>
  );
}

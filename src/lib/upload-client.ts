import { ACCEPTED_REPORT_TYPES, MAX_REPORT_BYTES } from "./constants";

export function checkReportFile(file: File): string | null {
  if (!(ACCEPTED_REPORT_TYPES as readonly string[]).includes(file.type)) return "Reports can be PDF, JPG or PNG.";
  if (file.size > MAX_REPORT_BYTES) return "Reports can be up to 15 MB.";
  return null;
}

/** Presign → PUT straight to the private bucket → confirm. The file never passes through our server. */
export async function uploadReport(token: string, file: File, onProgress?: (pct: number) => void) {
  const presign = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, fileType: file.type, sizeBytes: file.size, originalName: file.name, consent: true }),
  });
  const p = await presign.json();
  if (!presign.ok) throw new Error(p.error ?? "Upload could not start.");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", p.url);
    Object.entries(p.headers as Record<string, string>).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("The upload was interrupted. Please try again.")));
    xhr.onerror = () => reject(new Error("The upload was interrupted. Please try again."));
    xhr.send(file);
  });

  const done = await fetch("/api/uploads/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, uploadId: p.uploadId }),
  });
  const d = await done.json();
  if (!done.ok) throw new Error(d.error ?? "We couldn't confirm the upload.");
  return d as { ok: true; retentionExpiresAt: string };
}

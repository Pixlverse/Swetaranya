"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminRequest } from "./api";
import { Button, type ButtonVariant } from "./ui";

/** A button that sends one request, then refreshes (or navigates). Optional confirm prompt. */
export function ActionButton({
  url,
  method,
  body,
  label,
  pendingLabel,
  confirm,
  variant = "secondary",
  redirectTo,
  disabled,
  title,
  className,
}: {
  url: string;
  method: string;
  body?: unknown;
  label: string;
  pendingLabel?: string;
  confirm?: string;
  variant?: ButtonVariant;
  redirectTo?: string;
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  async function run() {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(true);
    setError(null);
    const res = await adminRequest(url, method, body);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    startTransition(() => {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  const pending = busy || isRefreshing;
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button variant={variant} onClick={run} disabled={disabled || pending} title={title} className={className}>
        {pending ? (pendingLabel ?? "Working…") : label}
      </Button>
      {error && (
        <span role="alert" className="max-w-xs text-xs font-bold text-clay">
          {error}
        </span>
      )}
    </span>
  );
}

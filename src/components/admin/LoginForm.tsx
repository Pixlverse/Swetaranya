"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Field, inputClass } from "./ui";

export function LoginForm({ callbackUrl, initialError }: { callbackUrl: string; initialError: string | null }) {
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
      callbackUrl,
    });
    if (!res || res.error) {
      setBusy(false);
      setError("Sign-in failed. Check your email and password, or ask an admin whether your account is active.");
      return;
    }
    // Full navigation so the server layout picks up the new session cookie.
    window.location.assign(res.url && new URL(res.url, window.location.origin).origin === window.location.origin ? res.url : callbackUrl);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-soft border border-nordic/10 bg-white p-6" noValidate>
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Password" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      {error && (
        <p role="alert" className="rounded-hair bg-blush/20 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

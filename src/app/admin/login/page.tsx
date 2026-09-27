import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLogo } from "@/components/brand/Logo";

export const metadata: Metadata = { title: "Sign in" };

/** Only allow same-site relative callback paths. */
function safeCallback(raw: string | string[] | undefined) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/admin";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const callbackUrl = safeCallback(sp.callbackUrl);
  if (await getSession()) redirect(callbackUrl);
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <BrandLogo variant="primary" priority sizes="140px" className="mb-6 h-24 w-auto" />
        <h1 className="mb-6 text-2xl">Admin sign in</h1>
        <LoginForm callbackUrl={callbackUrl} initialError={sp.error ? "Sign-in failed. Check your email and password." : null} />
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { AdminRole } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/Logo";

const groups: { label: string; items: { href: string; label: string; roles?: AdminRole[] }[] }[] = [
  {
    label: "Guests",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/enquiries", label: "Enquiries" },
      { href: "/admin/consultations", label: "Consultations" },
      { href: "/admin/lifestyle", label: "Lifestyle Check" },
      { href: "/admin/constitution", label: "Constitution check" },
      { href: "/admin/ebooks/downloads", label: "E-book downloads" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/conditions", label: "Conditions" },
      { href: "/admin/therapies", label: "Therapies" },
      { href: "/admin/journal", label: "Journal" },
      { href: "/admin/videos", label: "Videos" },
      { href: "/admin/ebooks", label: "E-books" },
      { href: "/admin/pages", label: "Page sections" },
      { href: "/admin/testimonials", label: "Testimonials" },
    ],
  },
  { label: "System", items: [{ href: "/admin/settings", label: "Settings", roles: ["admin"] }] },
];

/** Every nav href, longest first, so "/admin/ebooks/downloads" doesn't also light up "/admin/ebooks". */
const allHrefs = groups.flatMap((g) => g.items.map((i) => i.href)).sort((a, b) => b.length - a.length);

export function AdminNav({ user }: { user: { name: string; email: string; role: AdminRole } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = allHrefs.find((h) => (h === "/admin" ? pathname === "/admin" : pathname === h || pathname.startsWith(`${h}/`)));
  const isActive = (href: string) => href === current;

  return (
    <aside className="border-b border-nordic/10 bg-nordic text-cream lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0">
      <div className="flex items-center justify-between px-4 py-4 lg:block">
        <Link href="/admin" className="flex items-center gap-3 text-cream" aria-label="Swetāranya admin — dashboard">
          <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-pill bg-logo-ground">
            <BrandLogo variant="emblem" decorative sizes="40px" className="h-full w-full object-cover" />
          </span>
          <span className="text-sm text-cream/70">Admin</span>
        </Link>
        <button
          type="button"
          className="rounded-hair border border-cream/30 px-3 py-1.5 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="admin-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
      </div>
      <nav id="admin-nav" aria-label="Admin" className={`${open ? "block" : "hidden"} px-2 pb-4 lg:block`}>
        {groups.map((g) => {
          const items = g.items.filter((i) => !i.roles || i.roles.includes(user.role));
          if (!items.length) return null;
          return (
            <div key={g.label} className="mb-4">
              <p className="px-2 pb-1 text-xs text-cream/50">{g.label}</p>
              <ul>
                {items.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(i.href) ? "page" : undefined}
                      className={`block rounded-hair px-2 py-1.5 text-sm transition-colors ${
                        isActive(i.href) ? "bg-cream/15 font-bold text-cream" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                      }`}
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div className="mt-6 border-t border-cream/15 px-2 pt-4 text-sm">
          <p className="font-bold text-cream">{user.name}</p>
          <p className="truncate text-xs text-cream/60">{user.email}</p>
          <p className="mt-0.5 text-xs text-cream/60">Role: {user.role}</p>
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-sm font-bold text-cream underline underline-offset-4 hover:text-keppel">
              Sign out
            </button>
            <Link href="/" className="text-sm text-cream/70 underline underline-offset-4 hover:text-cream">
              View site
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/brand/Logo";

type NavLink = { href: string; label: string; note?: string };
type NavItem = NavLink & { children?: NavLink[] };

export const NAV: NavItem[] = [
  { href: "/the-swetaranya-way", label: "The Swetaranya Way" },
  { href: "/treatments", label: "Treatments" },
  {
    href: "/your-stay",
    label: "Your Stay",
    children: [
      { href: "/your-stay", label: "The house and rooms", note: "Where you stay and what's included" },
      { href: "/a-day-at-swetaranya", label: "A day at Swetaranya", note: "Hour by hour, lamp to lamp" },
      { href: "/book-a-consultation", label: "Book a consultation", note: "Online or in person" },
    ],
  },
  { href: "/experience", label: "Experience" },
  {
    href: "/journal",
    label: "Learn",
    children: [
      { href: "/journal", label: "Journal", note: "Writing from the house" },
      { href: "/ebooks", label: "Guides to take home", note: "Free e-books" },
      { href: "/constitution-check", label: "Know your constitution", note: "Vata, Pitta, Kapha" },
      { href: "/lifestyle-check", label: "Lifestyle Check", note: "Eight questions on daily life" },
    ],
  },
  { href: "/about", label: "About" },
];

/** Hover or focus opens it; click toggles; Esc and leaving close it. */
function NavDropdown({ item, active, reduce }: { item: NavItem; active: boolean; reduce: boolean | null }) {
  const [open, setOpen] = useState(false);
  const id = `nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`group relative flex items-center gap-1.5 rounded-pill px-3.5 py-2 text-[1.02rem] transition-colors ${active ? "text-cream" : "text-cream/75 hover:text-cream"}`}
      >
        <RollLabel>{item.label}</RollLabel>
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {active && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-keppel" transition={{ duration: reduce ? 0 : 0.35 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
          >
            <ul className="w-72 rounded-[1.5rem] bg-nordic p-2 shadow-[0_24px_48px_-20px] shadow-nordic/80 ring-1 ring-cream/10">
              {item.children!.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} onClick={() => setOpen(false)} className="block rounded-[1rem] px-4 py-3 transition-colors hover:bg-cream/10 focus-visible:bg-cream/10">
                    <span className="block text-[0.98rem] text-cream">{c.label}</span>
                    {c.note && <span className="block text-[0.82rem] text-cream/60">{c.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Link label that rolls up to a second copy on hover — the change is the feedback. */
function RollLabel({ children }: { children: string }) {
  return (
    <span className="relative block h-[1.3em] overflow-hidden leading-[1.3em]">
      <span className="block transition-transform duration-500 ease-calm group-hover:-translate-y-full motion-reduce:transition-none">{children}</span>
      <span aria-hidden className="absolute inset-x-0 top-full block text-keppel transition-transform duration-500 ease-calm group-hover:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
    </span>
  );
}

/**
 * A free-floating nav: a nordic pill set off the page edges, so it reads as its own object moving
 * with you through the house rather than a bar bolted to the top of every page.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-pill focus:bg-nordic focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className={`on-dark pointer-events-auto mx-auto flex max-w-[80rem] items-center justify-between gap-2 rounded-pill bg-nordic p-2 shadow-[0_24px_48px_-24px] shadow-nordic/70 transition-[max-width,padding] duration-500 ease-calm sm:gap-4 sm:p-2.5 ${
            scrolled ? "xl:max-w-[74rem]" : ""
          }`}
        >
          {/* Logo files have an off-white ground, so they sit in shapes of that same colour on the nordic pill:
              the round emblem on phones, the secondary lockup in a cream pill from sm up. */}
          <Link href="/" aria-label="Swetāranya Ayurvedaśram — home" className="group shrink-0 rounded-pill">
            <span className="block h-12 w-12 overflow-hidden rounded-pill bg-logo-ground transition-transform duration-500 ease-calm group-hover:scale-[1.04] sm:hidden">
              <BrandLogo variant="emblem" decorative priority sizes="48px" className="h-full w-full object-cover" />
            </span>
            <span className="hidden h-14 items-center rounded-pill bg-logo-ground px-6 transition-transform duration-500 ease-calm group-hover:scale-[1.03] sm:flex">
              <BrandLogo variant="secondary" decorative priority sizes="190px" className="h-[3.25rem] w-auto" />
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.children ? item.children.some((c) => isActive(c.href)) : isActive(item.href);
                if (item.children) return <NavDropdown key={item.label} item={item} active={active} reduce={reduce} />;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative block rounded-pill px-3.5 py-2 text-[1.02rem] transition-colors ${active ? "text-cream" : "text-cream/75 hover:text-cream"}`}
                    >
                      <RollLabel>{item.label}</RollLabel>
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-keppel"
                          transition={{ duration: reduce ? 0 : 0.35 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/talk-to-the-physician"
              className="group rounded-pill bg-cream px-4 py-3.5 text-[0.9rem] font-bold text-nordic transition-colors duration-300 hover:bg-keppel hover:text-white sm:px-7 sm:py-4 sm:text-[1rem]"
            >
              <RollLabel>Talk to the Physician</RollLabel>
            </Link>
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-pill text-cream transition-colors hover:bg-cream/10 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpenOn(open ? null : pathname)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[2px] w-5 bg-cream transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2px] bg-cream transition-all duration-300 ${open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3.5"}`} />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              className="on-dark pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-7rem)] max-w-[80rem] overflow-y-auto rounded-[2rem] bg-nordic p-6 shadow-[0_24px_48px_-24px] shadow-nordic/70 xl:hidden"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <ul>
                {[{ href: "/", label: "Home" } as NavItem, ...NAV].map((item) => (
                  <li key={item.label} className="border-b border-cream/10 last:border-0">
                    {item.children ? (
                      <div className="py-3">
                        <p className="font-heading text-[1.7rem] leading-tight text-cream">{item.label}</p>
                        <ul className="mt-2 space-y-1 border-l border-keppel/60 pl-4">
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} aria-current={pathname === c.href ? "page" : undefined} className="block py-1.5 text-[1.05rem] text-cream/85 aria-[current=page]:text-keppel">
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="block py-3 font-heading text-[1.7rem] leading-tight text-cream aria-[current=page]:text-keppel">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

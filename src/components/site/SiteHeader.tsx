"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/brand/Logo";
import { Pending } from "@/components/site/Pending";
import { whatsappLink } from "@/lib/whatsapp";

const EASE = [0.22, 0.61, 0.36, 1] as const;

type NavLink = { href: string; label: string; note?: string };

/** Treatments are grouped by medical speciality, never by package. */
const SPECIALITIES: NavLink[] = [
  { href: "/treatments#conditions", label: "Orthopaedics", note: "Spine problems, Arthritis" },
  { href: "/treatments#conditions", label: "Neurology", note: "Paralysis & stroke, Parkinson's disease" },
  { href: "/treatments#conditions", label: "Dermatology", note: "Psoriasis, Skin diseases, Allergies" },
  { href: "/treatments#conditions", label: "Gastroenterology", note: "Gut disorders" },
  { href: "/treatments#conditions", label: "Lifestyle Diseases", note: "Diabetes, Weight loss" },
  { href: "/treatments#conditions", label: "Gynaecology", note: "Female infertility, PCOS & PCOD" },
  { href: "/treatments#conditions", label: "Mental Health", note: "Stress, Mental health" },
];
const HOW_TREATMENT_WORKS: NavLink = { href: "/treatments#journey", label: "How Treatment Works", note: "From consultation to your treatment plan" };

/** The case studies are still to be written: each slot shows its condition and a marked title and country. */
const CASES = ["Psoriasis", "Paralysis & stroke", "Disc prolapse", "PCOS", "Parkinson's disease", "Diabetes"];
const ALL_CASES: NavLink = { href: "/experience", label: "View all case studies", note: "Filterable by speciality and condition" };
const PATIENT_STORIES: NavLink = { href: "/experience", label: "Patient Stories", note: "Written and video, from nearly 50 countries" };

type Item = { label: string; href: string; menu?: "treatments" | "cases" };
const NAV: Item[] = [
  { label: "About", href: "/about" },
  { label: "Treatments", href: "/treatments", menu: "treatments" },
  { label: "Life at Swetaranya", href: "/life-at-swetaranya" },
  { label: "Learn Ayurveda", href: "/learn-ayurveda" },
  { label: "Case Studies", href: "/experience", menu: "cases" },
  { label: "From the Physician", href: "/journal" },
  { label: "Blog", href: "/journal" },
  { label: "Contact", href: "/talk-to-the-physician" },
];
const CTA: NavLink = { href: "/book-a-consultation", label: "Book an Online Consultation" };

const TOP_BAR = ["An Ayurvedic home hospital in Tirur, Kerala", "Since 2011", "Patients from nearly 50 countries"];

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

/** A small drop between top-bar facts, in place of middots. */
function Drop() {
  return (
    <svg viewBox="0 0 8 10" aria-hidden className="h-2 w-1.5 shrink-0 text-keppel">
      <path d="M4 0C4 0 0 4.6 0 6.6A4 4 0 0 0 8 6.6C8 4.6 4 0 4 0Z" fill="currentColor" />
    </svg>
  );
}

function MenuLink({ link, onPick }: { link: NavLink; onPick: () => void }) {
  return (
    <Link
      href={link.href}
      onClick={onPick}
      className="group/item flex items-start gap-3 rounded-[1.1rem] px-4 py-2.5 transition-colors hover:bg-cream/[0.07] focus-visible:bg-cream/[0.07]"
    >
      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-pill bg-keppel/50 transition-colors group-hover/item:bg-keppel" aria-hidden />
      <span>
        <span className="block text-[1rem] font-bold text-cream">{link.label}</span>
        {link.note && <span className="mt-0.5 block text-[0.86rem] leading-snug text-cream/60">{link.note}</span>}
      </span>
    </Link>
  );
}

function TreatmentsMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="grid w-[46rem] grid-cols-[minmax(0,1fr)_15rem] gap-2 p-2">
      <ul className="grid grid-cols-2 gap-x-1">
        {SPECIALITIES.map((s) => (
          <li key={s.label}>
            <MenuLink link={s} onPick={onPick} />
          </li>
        ))}
      </ul>
      {/* The one route that isn't a speciality gets its own panel. */}
      <Link
        href={HOW_TREATMENT_WORKS.href}
        onClick={onPick}
        className="group/how flex flex-col justify-between rounded-[1.25rem] bg-keppel p-5 text-nordic transition-colors hover:bg-cream"
      >
        <svg viewBox="0 0 48 48" aria-hidden className="h-11 w-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="10" cy="12" r="5" />
          <circle cx="38" cy="24" r="5" />
          <circle cx="12" cy="38" r="5" />
          <path d="M15 13c10 1 16 4 18 9M33 27c-4 6-11 9-16 10" />
        </svg>
        <span>
          <span className="block font-heading text-[1.35rem] leading-tight">{HOW_TREATMENT_WORKS.label}</span>
          <span className="mt-1.5 block text-[0.9rem] leading-snug text-nordic/75">{HOW_TREATMENT_WORKS.note}</span>
        </span>
      </Link>
    </div>
  );
}

function CasesMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="w-[34rem] p-2">
      <ul className="grid grid-cols-2 gap-1">
        {CASES.map((c) => (
          <li key={c} className="rounded-[1.1rem] px-4 py-3">
            <Pending tone="dark" className="text-[0.82rem]">[Case title]</Pending>
            <span className="mt-1.5 block text-[0.86rem] leading-snug text-cream/70">
              {c} · patient from <Pending tone="dark" className="text-[0.8rem]">[country]</Pending>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid grid-cols-2 gap-1 border-t border-cream/10 pt-1">
        <MenuLink link={ALL_CASES} onPick={onPick} />
        <MenuLink link={PATIENT_STORIES} onPick={onPick} />
      </div>
    </div>
  );
}

/** Hover or focus opens it; click toggles; Esc and leaving close it. */
function NavDropdown({ item, active, reduce }: { item: Item; active: boolean; reduce: boolean | null }) {
  const [open, setOpen] = useState(false);
  const id = `nav-${item.menu}`;
  const close = () => setOpen(false);
  return (
    <li
      // The wide treatments panel centres under the whole bar; the cases panel under its own button.
      className={item.menu === "treatments" ? "static" : "relative"}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && close()}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`group relative flex items-center gap-1.5 rounded-pill px-2.5 py-2 text-[0.95rem] transition-colors ${active || open ? "text-cream" : "text-cream/75 hover:text-cream"}`}
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
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="absolute left-1/2 top-full origin-top -translate-x-1/2 pt-5"
          >
            <div className="rounded-[1.75rem] bg-nordic shadow-[0_32px_64px_-24px] shadow-nordic/80 ring-1 ring-cream/10">
              {item.menu === "treatments" ? <TreatmentsMenu onPick={close} /> : <CasesMenu onPick={close} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Phone, WhatsApp and email: the phone number and email are still to be supplied. */
function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <Pending tone="dark" className="text-[0.78rem]">[PHONE NUMBER]</Pending>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-cream underline decoration-keppel decoration-2 underline-offset-4 hover:text-keppel">
        WhatsApp us
      </a>
      <Pending tone="dark" className="text-[0.78rem]">[EMAIL]</Pending>
    </span>
  );
}

/**
 * A free-floating nav: a nordic pill set off the page edges, so it reads as its own object moving
 * with you through the house. A thin line of facts sits above it at the top of the page and folds
 * away once you scroll.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);

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

  const isActive = (href: string) => {
    const path = href.split("#")[0];
    return pathname === path || pathname.startsWith(path + "/");
  };
  const closeMobile = () => setOpenOn(null);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-pill focus:bg-nordic focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/* Top bar: wide screens only, and only at the top of the page. */}
        <div
          className={`on-dark pointer-events-auto hidden overflow-hidden bg-nordic text-cream transition-[height,opacity] duration-500 ease-calm min-[1360px]:block ${
            scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
          }`}
          aria-hidden={scrolled}
        >
          <div className="mx-auto flex h-9 max-w-[88rem] items-center justify-between gap-6 px-8 text-[0.8rem] text-cream/75">
            <p className="flex items-center gap-3">
              {TOP_BAR.map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <Drop />}
                  {t}
                </span>
              ))}
            </p>
            <ContactLinks />
          </div>
        </div>

        <div className="px-3 pt-3 sm:px-5 sm:pt-4">
          <div
            className={`on-dark pointer-events-auto relative mx-auto flex max-w-[86rem] items-center justify-between gap-2 rounded-pill bg-nordic p-2 shadow-[0_24px_48px_-24px] shadow-nordic/70 transition-[max-width,padding] duration-500 ease-calm sm:gap-3 sm:p-2.5 ${
              scrolled ? "min-[1360px]:max-w-[84rem]" : ""
            }`}
          >
            {/* Logo files have an off-white ground, so they sit in shapes of that same colour on the nordic pill. */}
            <Link href="/" aria-label="Swetāranya Ayurvedaśram — home" className="group shrink-0 rounded-pill">
              <span className="block h-12 w-12 overflow-hidden rounded-pill bg-logo-ground transition-transform duration-500 ease-calm group-hover:scale-[1.04] sm:hidden">
                <BrandLogo variant="emblem" decorative priority sizes="48px" className="h-full w-full object-cover" />
              </span>
              <span className="hidden h-14 items-center rounded-pill bg-logo-ground px-5 transition-transform duration-500 ease-calm group-hover:scale-[1.03] sm:flex">
                <BrandLogo variant="secondary" decorative priority sizes="170px" className="h-12 w-auto" />
              </span>
            </Link>

            <nav aria-label="Main" className="static hidden min-[1360px]:block">
              <ul className="static flex items-center">
                {NAV.map((item) => {
                  const active = isActive(item.href);
                  if (item.menu) return <NavDropdown key={item.label} item={item} active={active} reduce={reduce} />;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group relative block rounded-pill px-2.5 py-2 text-[0.95rem] transition-colors ${active ? "text-cream" : "text-cream/75 hover:text-cream"}`}
                      >
                        <RollLabel>{item.label}</RollLabel>
                        {active && (
                          <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-keppel" transition={{ duration: reduce ? 0 : 0.35 }} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={CTA.href}
                className="group rounded-pill bg-cream px-4 py-3.5 text-[0.85rem] font-bold text-nordic transition-colors duration-300 hover:bg-keppel hover:text-nordic sm:px-6 sm:py-4 sm:text-[0.95rem]"
              >
                <RollLabel>{CTA.label}</RollLabel>
              </Link>
              <button
                type="button"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-pill text-cream transition-colors hover:bg-cream/10 min-[1360px]:hidden"
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
                className="on-dark pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-7rem)] max-w-[86rem] overflow-y-auto rounded-[2rem] bg-nordic p-6 shadow-[0_24px_48px_-24px] shadow-nordic/70 min-[1360px]:hidden"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <ul>
                  {[{ label: "Home", href: "/" } as Item, ...NAV].map((item) => (
                    <li key={item.label} className="border-b border-cream/10 last:border-0">
                      {item.menu ? (
                        <div>
                          <button
                            type="button"
                            aria-expanded={mobileMenu === item.menu}
                            onClick={() => setMobileMenu((m) => (m === item.menu ? null : item.menu!))}
                            className="flex w-full items-center justify-between py-3 text-left font-heading text-[1.6rem] leading-tight text-cream"
                          >
                            {item.label}
                            <svg viewBox="0 0 10 6" className={`h-2 w-3.5 transition-transform duration-300 ${mobileMenu === item.menu ? "rotate-180" : ""}`} aria-hidden>
                              <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </button>
                          <AnimatePresence initial={false}>
                            {mobileMenu === item.menu && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                                className="mb-3 space-y-0.5 overflow-hidden border-l border-keppel/60 pl-4"
                              >
                                {item.menu === "treatments"
                                  ? [...SPECIALITIES, HOW_TREATMENT_WORKS].map((s) => (
                                      <li key={s.label}>
                                        <Link href={s.href} onClick={closeMobile} className="block py-1.5">
                                          <span className="block text-[1.02rem] text-cream">{s.label}</span>
                                          <span className="block text-[0.85rem] text-cream/55">{s.note}</span>
                                        </Link>
                                      </li>
                                    ))
                                  : [
                                      ...CASES.map((c) => (
                                        <li key={c} className="py-1.5 text-[0.95rem] text-cream/75">
                                          <Pending tone="dark" className="text-[0.8rem]">[Case title]</Pending>
                                          <span className="mt-1 block text-[0.85rem]">
                                            {c} · patient from <Pending tone="dark" className="text-[0.75rem]">[country]</Pending>
                                          </span>
                                        </li>
                                      )),
                                      ...[ALL_CASES, PATIENT_STORIES].map((s) => (
                                        <li key={s.label}>
                                          <Link href={s.href} onClick={closeMobile} className="block py-1.5">
                                            <span className="block text-[1.02rem] text-cream">{s.label}</span>
                                            <span className="block text-[0.85rem] text-cream/55">{s.note}</span>
                                          </Link>
                                        </li>
                                      )),
                                    ]}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className="block py-3 font-heading text-[1.6rem] leading-tight text-cream aria-[current=page]:text-keppel"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-3 rounded-[1.5rem] bg-cream/[0.06] p-5 text-[0.88rem] text-cream/75">
                  <ul className="space-y-1.5">
                    {TOP_BAR.map((t) => (
                      <li key={t} className="flex items-center gap-2.5">
                        <Drop />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <ContactLinks />
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

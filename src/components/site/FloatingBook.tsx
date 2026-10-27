"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * The booking action, kept within reach on every page without crowding the nav: a pill pinned to the
 * bottom-right corner. It stays out of the way on the booking page itself.
 */
export function FloatingBook() {
  const reduce = !!useReducedMotion();
  const pathname = usePathname();
  if (pathname?.startsWith("/book-a-consultation")) return null;

  return (
    <motion.div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 sm:bottom-6 sm:right-6"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : 1.6, duration: 0.6, ease: EASE }}
    >
      <Link
        href="/book-a-consultation"
        className="group flex items-center gap-2.5 rounded-pill bg-nordic py-2 pl-2 pr-5 text-[0.92rem] font-bold text-cream shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] ring-2 ring-cream/70 transition-[background-color,color,transform] duration-300 ease-calm hover:-translate-y-0.5 hover:bg-keppel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-keppel active:translate-y-0 sm:text-[0.98rem]"
      >
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-pill bg-keppel text-cream transition-colors duration-300 group-hover:bg-nordic group-hover:text-cream">
          {/* A calendar with one day marked. */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
            <path d="M9.5 15l2 2 3.5-3.5" />
          </svg>
        </span>
        Book an Online Consultation
      </Link>
    </motion.div>
  );
}

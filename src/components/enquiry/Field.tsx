import type { ReactNode } from "react";

export const inputClass =
  "block w-full rounded-hair border-0 border-b border-nordic/30 bg-transparent px-0 py-3 text-[1.05rem] text-ink placeholder:text-ink/35 transition-colors focus:border-keppel focus:outline-none focus-visible:outline-none focus:ring-0 aria-[invalid=true]:border-terracotta";

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-bold text-nordic">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-[0.85rem] text-ink/60">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.88rem] text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

/** Confirmation check that draws itself once — shows the submit worked. */
export function DrawnCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden>
      <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" className="[stroke-dasharray:151] [stroke-dashoffset:151] animate-[draw_0.7s_ease-out_forwards]" />
      <path d="M15 27 l7 7 l15 -16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="[stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_0.45s_0.55s_ease-out_forwards]" />
    </svg>
  );
}

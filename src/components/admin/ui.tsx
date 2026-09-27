/** Small, functional building blocks for the admin panel. Sans only; brand tokens only. */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "block w-full rounded-hair border border-nordic/25 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-keppel focus:outline-none focus-visible:outline-2 focus-visible:outline-keppel disabled:bg-cream disabled:text-ink/50";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-hair px-3.5 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
export const buttonClass = {
  primary: `${buttonBase} bg-nordic text-cream hover:bg-keppel`,
  secondary: `${buttonBase} border border-nordic/25 bg-white text-nordic hover:border-nordic hover:bg-cream`,
  danger: `${buttonBase} border border-clay/40 bg-white text-clay hover:bg-blush/20`,
  ghost: `${buttonBase} px-2 text-nordic hover:bg-nordic/5`,
} as const;
export type ButtonVariant = keyof typeof buttonClass;

export function Button({ variant = "primary", className = "", ...props }: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type="button" {...props} className={`${buttonClass[variant]} ${className}`} />;
}

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link {...props} className={`${buttonClass[variant]} ${className}`} />;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-bold text-nordic">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-bold text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-nordic/10 pb-4">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink/70">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, actions, children, className = "" }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-soft border border-nordic/10 bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-nordic/10 px-4 py-3">
          {title && <h2 className="text-base">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

const badgeTones = {
  neutral: "bg-nordic/10 text-nordic",
  success: "bg-keppel/15 text-nordic",
  warning: "bg-terracotta/15 text-clay",
  danger: "bg-blush/25 text-clay",
  info: "bg-keppel/10 text-nordic",
} as const;
export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`inline-block whitespace-nowrap rounded-hair px-2 py-0.5 text-xs font-bold ${badgeTones[tone]}`}>{children}</span>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warning" | "danger"; children: ReactNode }) {
  const tones = {
    info: "border-keppel/40 bg-keppel/10",
    warning: "border-terracotta/40 bg-terracotta/10",
    danger: "border-clay/40 bg-blush/20",
  };
  return <div className={`rounded-hair border px-4 py-3 text-sm text-ink ${tones[tone]}`}>{children}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-hair border border-dashed border-nordic/20 px-4 py-8 text-center text-sm text-ink/60">{children}</p>;
}

/** Table wrapper that scrolls horizontally on narrow screens. */
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-soft border border-nordic/10 bg-white">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm [&_td]:border-t [&_td]:border-nordic/10 [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top [&_th]:bg-cream [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-bold [&_th]:text-nordic/80">
        {children}
      </table>
    </div>
  );
}

export function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
      {page > 1 ? (
        <ButtonLink variant="secondary" href={hrefFor(page - 1)}>
          Previous
        </ButtonLink>
      ) : (
        <span />
      )}
      <span className="text-ink/60">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <ButtonLink variant="secondary" href={hrefFor(page + 1)}>
          Next
        </ButtonLink>
      ) : (
        <span />
      )}
    </nav>
  );
}

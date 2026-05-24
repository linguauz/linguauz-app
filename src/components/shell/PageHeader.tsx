import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared page header used across every screen except the dashboard hero.
 * Matches the Claude Design pattern:
 *   - small uppercase eyebrow ("PAGE NAME")
 *   - large display title (often with one gradient word)
 *   - subdued subtitle / breadcrumb
 *   - right-aligned slot for chips/buttons
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 flex-wrap",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[10px] @md:text-[11px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-semibold">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 font-[var(--font-display)] font-bold leading-tight text-[22px] @md:text-[28px] @4xl:text-[34px]">
          {title}
        </h1>
        {subtitle && (
          <div className="mt-1 text-[12px] @md:text-[13px] text-[var(--text-muted)]">
            {subtitle}
          </div>
        )}
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </header>
  );
}

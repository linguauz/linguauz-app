"use client";

import { cn } from "@/lib/cn";
import { GRAMMAR_COLOR, GRAMMAR_LABEL, type GrammarRole } from "@/data/types";

interface ColorChipProps {
  text: string;
  role?: GrammarRole;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ColorChip({
  text,
  role,
  size = "md",
  withLabel = false,
  interactive,
  selected,
  onClick,
  className,
}: ColorChipProps) {
  const dim = !role;
  const color = role ? GRAMMAR_COLOR[role] : "rgba(255,255,255,0.4)";

  return (
    <span
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl font-medium transition select-none",
        size === "sm" && "px-2.5 py-1 text-[12px]",
        size === "md" && "px-3 py-1.5 text-[14px]",
        size === "lg" && "px-3.5 py-2 text-[15px]",
        interactive && "cursor-pointer hover:scale-[1.03] active:scale-[0.97]",
        dim ? "text-[var(--text-soft)]" : "text-white",
        className,
      )}
      style={
        dim
          ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
          : {
              background: `color-mix(in oklab, ${color} 22%, transparent)`,
              boxShadow: selected
                ? `0 0 0 2px ${color}, 0 0 24px color-mix(in oklab, ${color} 35%, transparent)`
                : `inset 0 0 0 1px color-mix(in oklab, ${color} 55%, transparent)`,
              color: "white",
            }
      }
    >
      <span>{text}</span>
      {withLabel && role && (
        <span
          className="text-[9px] font-bold uppercase tracking-wider opacity-80"
          style={{ color }}
        >
          {GRAMMAR_LABEL[role]}
        </span>
      )}
    </span>
  );
}

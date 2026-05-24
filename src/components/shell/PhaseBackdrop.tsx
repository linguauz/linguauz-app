"use client";

import { useEffect } from "react";
import { usePoydevor } from "@/store/usePoydevor";

/**
 * Syncs the current Phase + theme to <html> data attributes so globals.css
 * can swap the animated backdrop, glass surfaces and utility overrides.
 */
export function PhaseBackdrop() {
  const phase = usePoydevor((s) => s.currentPhase);
  const theme = usePoydevor((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-phase", String(phase));
  }, [phase]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return null;
}

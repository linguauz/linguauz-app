"use client";

import { useEffect } from "react";
import {
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";
import { playSound, setSoundEnabled } from "@/lib/sound";

export function TopBar() {
  const deviceFrame = usePoydevor((s) => s.deviceFrame);
  const setDeviceFrame = usePoydevor((s) => s.setDeviceFrame);
  const useSound = usePoydevor((s) => s.useSound);
  const toggleSound = usePoydevor((s) => s.toggleSound);
  const theme = usePoydevor((s) => s.theme);
  const toggleTheme = usePoydevor((s) => s.toggleTheme);
  const reset = usePoydevor((s) => s.reset);

  useEffect(() => {
    setSoundEnabled(useSound);
  }, [useSound]);

  // Sync theme to <html> for every route (onboarding / diagnostika don't
  // mount PhaseBackdrop, but they always render TopBar).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 backdrop-blur-xl bg-[rgba(5,13,29,0.7)] border-b border-white/8">
      <div className="h-full w-full max-w-[1400px] mx-auto px-4 grid grid-cols-3 items-center">
        {/* Left: logo */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-[#22d3a5] to-[#00a3ff] shadow-glow-cyan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 18l4-5 4 3 5-8 5 10"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-none">
            <div
              className="font-[var(--font-display)] font-bold tracking-tight"
              style={{ fontSize: 16 }}
            >
              Poydevor
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Ona tili
            </div>
          </div>
        </div>

        {/* Center: device toggle (the headline interaction) */}
        <div className="justify-self-center inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
          <DeviceButton
            label="Mobile"
            active={deviceFrame === "mobile"}
            onClick={() => {
              setDeviceFrame("mobile");
              playSound("click");
            }}
          >
            <Smartphone size={16} />
          </DeviceButton>
          <DeviceButton
            label="Desktop"
            active={deviceFrame === "desktop"}
            onClick={() => {
              setDeviceFrame("desktop");
              playSound("click");
            }}
          >
            <Monitor size={16} />
          </DeviceButton>
        </div>

        {/* Right: utilities */}
        <div className="justify-self-end flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              playSound("click");
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-[12px] text-[var(--text-soft)] transition"
            aria-label="Mavzuni almashtirish"
            title={theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim"}
          >
            {theme === "dark" ? (
              <Sun size={14} className="text-[var(--gold)]" />
            ) : (
              <Moon size={14} className="text-[var(--brand-violet)]" />
            )}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Yorug'" : "Qorong'i"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              if (!useSound) playSound("click");
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-[12px] text-[var(--text-soft)] transition"
            aria-label="Ovozni almashtirish"
          >
            {useSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{useSound ? "Ovoz" : "Jim"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Sayohatni boshidan boshlaysizmi?")) reset();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-[12px] text-[var(--text-soft)] transition"
            aria-label="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

function DeviceButton({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold transition",
        active
          ? "bg-gradient-to-br from-[#22d3a5] to-[#00a3ff] text-white shadow-glow-cyan"
          : "text-[var(--text-soft)] hover:text-white",
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

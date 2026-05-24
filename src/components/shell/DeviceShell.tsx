"use client";

import { useEffect, useState } from "react";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";

/**
 * DeviceShell wraps app content with either a mobile phone frame
 * or a desktop full-bleed layout, controlled by the TopBar toggle.
 */
export function DeviceShell({ children }: { children: React.ReactNode }) {
  const deviceFrame = usePoydevor((s) => s.deviceFrame);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR-safe default to mobile frame; client hydrates real value
  const mode = mounted ? deviceFrame : "mobile";

  if (mode === "mobile") {
    return (
      <div className="pt-14 min-h-screen w-full flex items-start justify-center px-4 pb-10">
        <div
          className="relative mt-6 w-[390px] max-w-full"
          style={{ minHeight: "780px" }}
        >
          {/* Phone bezel — gradient/border read from theme tokens. */}
          <div
            className="absolute -inset-2 rounded-[44px] border"
            style={{
              background:
                "linear-gradient(180deg, var(--phone-bezel), transparent)",
              borderColor: "var(--line)",
              boxShadow: "var(--shadow-card)",
            }}
          />
          {/* Phone notch */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1 z-20 h-5 w-32 rounded-b-2xl"
            style={{ background: "rgba(0,0,0,0.85)" }}
          />
          {/* Screen — @container makes child @-prefixed utilities respond to
              the frame's width (390px) rather than the viewport's width. */}
          <div
            className="@container relative rounded-[36px] overflow-hidden border min-h-[760px]"
            style={{
              background: "var(--phone-screen)",
              borderColor: "var(--line)",
            }}
          >
            <PhoneStatusBar />
            <div className="pt-8">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop full-bleed — still a container so @-prefixed utilities work
  // consistently, but at desktop width all breakpoints activate normally.
  return (
    <div className="pt-14 min-h-screen w-full">
      <div className="@container w-full max-w-[1400px] mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}

function PhoneStatusBar() {
  return (
    <div
      className="absolute top-0 inset-x-0 z-10 h-8 flex items-center justify-between px-6 text-[11px] font-medium"
      style={{ color: "var(--phone-status)" }}
    >
      <span>9:41</span>
      <span className="inline-flex items-center gap-1">
        <span
          className="h-2 w-3 rounded-sm"
          style={{ background: "var(--phone-status)" }}
        />
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "var(--phone-status)" }}
        />
        <span
          className="h-2 w-4 rounded-sm"
          style={{ background: "var(--phone-status)" }}
        />
      </span>
    </div>
  );
}

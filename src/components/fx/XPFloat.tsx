"use client";

interface XPFloatProps {
  amount: number;
  show: boolean;
}

export function XPFloat({ amount, show }: XPFloatProps) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center">
      <div
        key={Date.now()}
        className="animate-xp-float text-2xl font-bold text-[var(--brand-aqua)]"
        style={{ textShadow: "0 0 20px rgba(74,222,128,0.45)" }}
      >
        +{amount} XP
      </div>
    </div>
  );
}

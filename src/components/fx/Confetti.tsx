"use client";

import { useMemo } from "react";

interface ConfettiProps {
  count?: number;
}

const COLORS = ["#22d3a5", "#00a3ff", "#ff8a4c", "#a855f7", "#ffb800"];

export function Confetti({ count = 60 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.2 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.dur}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

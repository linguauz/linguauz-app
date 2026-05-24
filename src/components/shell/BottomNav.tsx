"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Trophy, LineChart, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

const NAV = [
  { href: "/bosh", label: "Bosh", icon: Home },
  { href: "/xarita", label: "Xarita", icon: Map },
  { href: "/yutuqlar", label: "Yutuq", icon: Trophy },
  { href: "/tahlil", label: "Tahlil", icon: LineChart },
  { href: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="sticky bottom-3 z-30 mx-3 mt-3 mb-3 rounded-2xl border border-white/10 glass-strong">
      <div className="grid grid-cols-5 gap-1 p-1.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => playSound("click")}
              className={cn(
                "group flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-medium transition",
                active
                  ? "bg-gradient-to-b from-[#22d3a5]/15 to-transparent text-white"
                  : "text-[var(--text-muted)] hover:text-white",
              )}
            >
              <Icon
                size={18}
                className={cn(active && "text-[var(--brand-aqua)]")}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

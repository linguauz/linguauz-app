"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  BookOpen,
  Trophy,
  LineChart,
  User,
  Award,
  Dumbbell,
  Settings,
} from "lucide-react";
import { usePoydevor, useLevel } from "@/store/usePoydevor";
import { STONES } from "@/data/curriculum";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

/* -----------------------------------------------------------------------
 * Nav structure — built on the fly so chip counts stay live.
 * --------------------------------------------------------------------- */
type NavChip =
  | { kind: "count"; value: string }
  | { kind: "tag"; value: string };

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  chip?: NavChip;
}

function useNavItems(
  completedCount: number,
  earnedBadges: number,
): { sayohat: NavItem[]; statistika: NavItem[] } {
  return {
    sayohat: [
      { href: "/bosh", label: "Bosh sahifa", icon: Home },
      {
        href: "/xarita",
        label: "Xarita",
        icon: Map,
        chip: {
          kind: "count",
          value: `${completedCount}/${STONES.length}`,
        },
      },
      {
        href: "/darslar",
        label: "Darslar",
        icon: BookOpen,
        chip: { kind: "tag", value: "Yangi" },
      },
      { href: "/mashqlar", label: "Mashqlar", icon: Dumbbell },
    ],
    statistika: [
      { href: "/tahlil", label: "Tahlil", icon: LineChart },
      {
        href: "/yutuqlar",
        label: "Yutuqlar",
        icon: Trophy,
        chip: { kind: "count", value: `${earnedBadges}/8` },
      },
      { href: "/profil", label: "Profil", icon: User },
      { href: "/yutuqlar?tab=cert", label: "Sertifikat", icon: Award },
    ],
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const name = usePoydevor((s) => s.name) || "Sayohatchi";
  const avatarColor = usePoydevor((s) => s.avatarColor);
  const earnedBadges = usePoydevor((s) => s.earnedBadges);
  const completed = usePoydevor((s) => s.completedStoneIds);
  const currentPhase = usePoydevor((s) => s.currentPhase);
  const level = useLevel();

  const nav = useNavItems(completed.length, earnedBadges.length);

  const phaseLabel =
    currentPhase === 1
      ? "Ko'lmak"
      : currentPhase === 2
        ? "Buloq"
        : currentPhase === 3
          ? "Daryo"
          : currentPhase === 4
            ? "Dengiz"
            : "Okean";

  return (
    <aside className="sticky top-20 h-[calc(100vh-5.5rem)] w-64 shrink-0 hidden md:flex flex-col gap-4 pr-1">
      {/* Logo card with its own border */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#22d3a5] to-[#00a3ff] shadow-glow-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 18l4-5 4 3 5-8 5 10"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <div className="font-[var(--font-display)] font-bold tracking-tight leading-tight">
              Poydevor
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mt-0.5">
              Ona tili
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="rounded-2xl border border-white/8 bg-white/[0.02] p-2 flex flex-col gap-0.5">
        <SidebarGroup label="Sayohat" />
        {nav.sayohat.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}

        <div className="h-px bg-white/6 my-2 mx-2" />

        <SidebarGroup label="Statistika" />
        {nav.statistika.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={
              pathname === item.href.split("?")[0] && item.href.includes("?")
                ? false
                : pathname === item.href
            }
          />
        ))}
      </nav>

      {/* Bottom rail: profile */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="grid place-items-center h-10 w-10 rounded-xl text-white font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${avatarColor}, #00a3ff)`,
              }}
            >
              {name.charAt(0).toUpperCase() || "P"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-deep)] bg-[var(--success)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate leading-tight">
              {name}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
              Level {level.level} · {phaseLabel}
            </div>
          </div>
          <Link
            href="/profil"
            onClick={() => playSound("click")}
            className="grid place-items-center h-7 w-7 rounded-lg text-[var(--text-faint)] hover:bg-white/8 hover:text-white transition"
            aria-label="Sozlamalar"
          >
            <Settings size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SidebarGroup({ label }: { label: string }) {
  return (
    <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] font-semibold">
      {label}
    </div>
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={() => playSound("click")}
      className={cn(
        "group flex items-center gap-3 px-3 h-10 rounded-xl text-[13px] transition",
        active
          ? "bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-[var(--text-soft)] hover:bg-white/4 hover:text-white",
      )}
    >
      <Icon size={16} />
      <span className="flex-1">{item.label}</span>
      {item.chip && <Chip chip={item.chip} />}
    </Link>
  );
}

function Chip({ chip }: { chip: NavChip }) {
  if (chip.kind === "count") {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand-aqua)]/12 text-[var(--brand-aqua)] font-semibold">
        {chip.value}
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] font-bold uppercase tracking-wider">
      {chip.value}
    </span>
  );
}


"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import { PHASES, STONES, stonesInPhase } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

type Filter = "all" | "done" | "current" | "locked";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Hammasi" },
  { id: "done", label: "Tugatilgan" },
  { id: "current", label: "Joriy" },
  { id: "locked", label: "Yopiq" },
];

export default function DarslarPage() {
  const completed = usePoydevor((s) => s.completedStoneIds);
  const unlocked = usePoydevor((s) => s.unlockedStoneIds);
  const stoneStars = usePoydevor((s) => s.stoneStars);

  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    let done = 0;
    let current = 0;
    let locked = 0;
    for (const s of STONES) {
      const isDone = completed.includes(s.id);
      const isUnlocked = unlocked.includes(s.id);
      if (isDone) done++;
      else if (isUnlocked) current++;
      else locked++;
    }
    return { done, current, locked, total: STONES.length };
  }, [completed, unlocked]);

  function statusOf(id: string): "done" | "current" | "locked" {
    if (completed.includes(id)) return "done";
    if (unlocked.includes(id)) return "current";
    return "locked";
  }

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <PageHeader
        eyebrow="Darslar"
        title={
          <>
            Barcha <span className="text-grad-cyan">darslar</span>
          </>
        }
        subtitle={
          <>
            <span className="text-white/85 font-semibold">
              {counts.done} / {counts.total}
            </span>{" "}
            tugatildi · {counts.current} joriy · {counts.locked} yopiq
          </>
        }
        right={
          <div className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-white/5 border border-white/10 text-[12px]">
            <BookOpen size={12} className="text-[var(--brand-aqua)]" />
            <span className="text-[var(--text-soft)]">Sayohat ro'yxati</span>
          </div>
        }
      />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count =
            f.id === "all"
              ? counts.total
              : f.id === "done"
                ? counts.done
                : f.id === "current"
                  ? counts.current
                  : counts.locked;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                playSound("click");
              }}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-semibold border transition",
                active
                  ? "bg-white text-black border-white shadow-[0_0_0_3px_rgba(34,211,165,0.25)]"
                  : "bg-white/4 border-white/10 hover:border-white/20 text-[var(--text-soft)]",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  active
                    ? "bg-black/15 text-black"
                    : "bg-white/8 text-[var(--text-muted)]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase groups */}
      <div className="space-y-5">
        {PHASES.filter((p) => p.stoneIds.length > 0).map((phase) => {
          const phaseStones = stonesInPhase(phase.id);
          const visible = phaseStones.filter((stone) => {
            if (filter === "all") return true;
            return statusOf(stone.id) === filter;
          });
          if (visible.length === 0) return null;
          return (
            <section
              key={phase.id}
              className="rounded-3xl border border-white/8 bg-white/[0.02] overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 @md:px-5 py-3 border-b border-white/8"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab, ${phase.accent} 14%, transparent) 0%, transparent 100%)`,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid place-items-center h-9 w-9 rounded-xl text-base shrink-0"
                    style={{
                      background: `color-mix(in oklab, ${phase.accent} 25%, transparent)`,
                    }}
                  >
                    {phase.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] font-semibold">
                      Phase {phase.id}
                    </div>
                    <div className="font-[var(--font-display)] font-bold text-[15px] @md:text-[17px] leading-tight">
                      {phase.name} — {phase.tagline}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] @md:text-[12px] text-[var(--text-muted)] shrink-0">
                  {
                    phaseStones.filter((s) => completed.includes(s.id))
                      .length
                  }{" "}
                  / {phaseStones.length}
                </div>
              </div>

              <ul className="divide-y divide-white/5">
                {visible.map((stone) => (
                  <LessonRow
                    key={stone.id}
                    stone={stone}
                    status={statusOf(stone.id)}
                    stars={stoneStars[stone.id] ?? 0}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonRow({
  stone,
  status,
  stars,
}: {
  stone: (typeof STONES)[number];
  status: "done" | "current" | "locked";
  stars: number;
}) {
  const isLocked = status === "locked";
  const inner = (
    <div className="flex items-center gap-3 @md:gap-4 px-4 @md:px-5 py-3 transition group">
      <span
        className={cn(
          "grid place-items-center h-10 w-10 rounded-xl shrink-0",
          status === "done" && "bg-[var(--success)]/15 text-[var(--success)]",
          status === "current" &&
            "bg-[var(--brand-aqua)]/15 text-[var(--brand-aqua)] shadow-[0_0_0_2px_rgba(74,222,128,0.35)]",
          status === "locked" && "bg-white/4 text-[var(--text-faint)]",
        )}
      >
        {status === "done" ? (
          <CheckCircle2 size={18} />
        ) : status === "locked" ? (
          <Lock size={16} />
        ) : (
          <span className="text-lg">{stone.emoji}</span>
        )}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] font-bold">
            Tosh {stone.globalIndex}
          </span>
          {status === "current" && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--brand-aqua)] text-black font-bold">
              Hozir
            </span>
          )}
          {status === "done" && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] font-bold">
              Tugadi
            </span>
          )}
        </div>
        <div className="font-[var(--font-display)] font-bold text-[14px] @md:text-[15px] leading-tight truncate">
          {stone.title}
        </div>
        <div className="text-[11px] text-[var(--text-muted)] truncate">
          {stone.subtitle}
        </div>
      </div>

      <div className="hidden @md:flex items-center gap-3 text-[11px] text-[var(--text-muted)] shrink-0">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} /> {stone.durationMin} daq
        </span>
        <span className="inline-flex items-center gap-1 text-[var(--brand-orange)]">
          <Sparkles size={12} /> +{stone.xp} XP
        </span>
      </div>

      {status === "done" && (
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={cn(
                i < stars
                  ? "text-[var(--gold)] fill-[var(--gold)]"
                  : "text-white/15",
              )}
            />
          ))}
        </div>
      )}

      {!isLocked && (
        <ChevronRight
          size={16}
          className="text-white/35 group-hover:text-white shrink-0"
        />
      )}
    </div>
  );

  if (isLocked) {
    return (
      <li className="opacity-65 cursor-not-allowed select-none">{inner}</li>
    );
  }

  return (
    <li>
      <Link
        href={`/dars/${stone.id}`}
        onClick={() => playSound("click")}
        className="block hover:bg-white/4 transition"
      >
        {inner}
      </Link>
    </li>
  );
}

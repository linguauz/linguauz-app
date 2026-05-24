"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Lock, ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { PHASES, STONES, stonesInPhase } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

export default function XaritaPage() {
  const completed = usePoydevor((s) => s.completedStoneIds);
  const unlocked = usePoydevor((s) => s.unlockedStoneIds);
  const currentPhaseId = usePoydevor((s) => s.currentPhase);

  const [selectedPhase, setSelectedPhase] = useState<number>(currentPhaseId);

  const phase = PHASES.find((p) => p.id === selectedPhase) ?? PHASES[0];
  const phaseStones = stonesInPhase(phase.id);
  const phaseDone = phaseStones.filter((s) => completed.includes(s.id)).length;

  const currentStoneId = useMemo(
    () =>
      unlocked.find((id) => !completed.includes(id) && id.startsWith(phase.slug[0])),
    [unlocked, completed, phase.slug],
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Xarita
          </div>
          <h1 className="text-[26px] md:text-[32px] font-[var(--font-display)] font-bold leading-tight">
            <span className="text-grad-cyan">Ko'lmakdan</span> Okeangacha
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px]">
          <MapPin size={12} className="text-[var(--brand-aqua)]" />
          {completed.length} / {STONES.length} tosh bosib o'tildi
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 snap-x-mandatory">
        {PHASES.map((p) => {
          const isActive = selectedPhase === p.id;
          const isLocked = p.stoneIds.length === 0;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPhase(p.id);
                playSound("click");
              }}
              className={cn(
                "snap-center shrink-0 inline-flex items-center gap-2 px-3 h-10 rounded-full border transition",
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-white/4 border-white/10 hover:border-white/20 text-[var(--text-soft)]",
                isLocked && "opacity-60",
              )}
              style={
                isActive
                  ? { boxShadow: `0 0 0 3px color-mix(in oklab, ${p.accent} 45%, transparent)` }
                  : undefined
              }
            >
              <span>{p.emoji}</span>
              <span className="text-[13px] font-semibold">
                {p.id}. {p.name}
              </span>
              {isLocked && <Lock size={12} className="opacity-70" />}
            </button>
          );
        })}
      </div>

      {/* Phase hero */}
      <PhaseBanner
        phase={phase}
        done={phaseDone}
        total={phaseStones.length || 0}
      />

      {/* River path */}
      {phaseStones.length > 0 ? (
        <RiverPath
          stones={phaseStones}
          completed={completed}
          unlocked={unlocked}
          currentStoneId={currentStoneId}
          accent={phase.accent}
        />
      ) : (
        <LockedPhase phase={phase} />
      )}
    </div>
  );
}

function PhaseBanner({
  phase,
  done,
  total,
}: {
  phase: (typeof PHASES)[number];
  done: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : (done / total) * 100;
  return (
    <div
      className="relative rounded-3xl p-5 md:p-6 overflow-hidden border border-white/8"
      style={{
        background: `linear-gradient(135deg, color-mix(in oklab, ${phase.accent} 25%, rgba(8,18,34,0.85)), rgba(8,18,34,0.85))`,
      }}
    >
      <div className="absolute inset-0 water-shimmer opacity-25 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">
            Phase {phase.id}
          </div>
          <h2 className="mt-1 text-[26px] md:text-[30px] font-[var(--font-display)] font-bold">
            {phase.emoji} {phase.name} — {phase.tagline}
          </h2>
          <p className="text-white/70 max-w-xl mt-1">{phase.description}</p>
        </div>
        {total > 0 && (
          <div className="min-w-[180px]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Taraqqiyot
            </div>
            <div className="mt-1 font-[var(--font-display)] font-bold text-xl">
              {done} / {total}
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/12 overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${pct}%`, boxShadow: "0 0 16px rgba(255,255,255,0.6)" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RiverPath({
  stones,
  completed,
  unlocked,
  currentStoneId,
  accent,
}: {
  stones: typeof STONES;
  completed: string[];
  unlocked: string[];
  currentStoneId: string | undefined;
  accent: string;
}) {
  return (
    <div className="relative pt-2 pb-6">
      {/* curved river line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M 80 40 Q 320 140, 80 240 Q 320 340, 80 440 Q 320 540, 200 600"
          stroke="url(#river)"
          strokeWidth="3"
          strokeDasharray="6 8"
          fill="none"
        />
      </svg>

      <ol className="relative space-y-6">
        {stones.map((stone, i) => {
          const isDone = completed.includes(stone.id);
          const isUnlocked = unlocked.includes(stone.id);
          const isCurrent = stone.id === currentStoneId;
          const align = i % 2 === 0 ? "left" : "right";
          return (
            <StoneRow
              key={stone.id}
              stone={stone}
              isDone={isDone}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              accent={accent}
              align={align}
            />
          );
        })}
      </ol>
    </div>
  );
}

function StoneRow({
  stone,
  isDone,
  isUnlocked,
  isCurrent,
  accent,
  align,
}: {
  stone: (typeof STONES)[number];
  isDone: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  accent: string;
  align: "left" | "right";
}) {
  const isLocked = !isUnlocked;
  const linkHref = isLocked
    ? "#"
    : isDone
      ? `/dars/${stone.id}` // review
      : `/dars/${stone.id}`;

  return (
    <li
      className={cn(
        "relative grid items-center gap-3",
        "grid-cols-[1fr_auto_1fr]",
      )}
    >
      {/* left content */}
      <div
        className={cn(
          "min-w-0",
          align === "left" ? "text-right pr-3" : "opacity-0 pointer-events-none",
        )}
      >
        {align === "left" && (
          <StoneCard
            stone={stone}
            isDone={isDone}
            isCurrent={isCurrent}
            isLocked={isLocked}
            href={linkHref}
          />
        )}
      </div>

      {/* stone bubble */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: stone.index * 0.06, duration: 0.4 }}
        className={cn(
          "relative grid place-items-center h-16 w-16 rounded-full shrink-0",
        )}
        style={
          isDone
            ? {
                background: `radial-gradient(circle, ${accent} 0%, color-mix(in oklab, ${accent} 50%, #052015) 80%)`,
                boxShadow: `0 0 0 2px color-mix(in oklab, ${accent} 70%, transparent), 0 0 32px color-mix(in oklab, ${accent} 50%, transparent)`,
              }
            : isCurrent
              ? {
                  background:
                    "radial-gradient(circle, #00a3ff 0%, #053a66 80%)",
                  boxShadow:
                    "0 0 0 3px rgba(0,163,255,0.55), 0 0 40px rgba(0,163,255,0.55)",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }
        }
      >
        {isCurrent && (
          <>
            <span
              className="absolute -inset-1 rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 0 0 rgba(0,163,255,0.55)",
                animation: "pulse-glow 2.4s infinite",
              }}
            />
          </>
        )}
        {isDone ? (
          <Check size={26} className="text-white" />
        ) : isLocked ? (
          <Lock size={20} className="text-white/40" />
        ) : (
          <span className="text-2xl">{stone.emoji}</span>
        )}
      </motion.div>

      {/* right content */}
      <div className={cn(align === "right" ? "pl-3" : "opacity-0 pointer-events-none")}>
        {align === "right" && (
          <StoneCard
            stone={stone}
            isDone={isDone}
            isCurrent={isCurrent}
            isLocked={isLocked}
            href={linkHref}
          />
        )}
      </div>
    </li>
  );
}

function StoneCard({
  stone,
  isDone,
  isCurrent,
  isLocked,
  href,
}: {
  stone: (typeof STONES)[number];
  isDone: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  href: string;
}) {
  const body = (
    <div
      className={cn(
        "rounded-2xl p-3.5 border transition",
        isCurrent
          ? "border-[var(--brand-aqua)]/60 bg-[var(--brand-aqua)]/10 shadow-glow-blue"
          : isDone
            ? "border-[var(--success)]/40 bg-[var(--success)]/8"
            : "border-white/10 bg-white/3",
        isLocked && "opacity-60",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
          Tosh {stone.globalIndex}
        </span>
        {isCurrent && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--brand-aqua)] text-black font-bold">
            HOZIR
          </span>
        )}
        {isDone && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--success)] text-black font-bold">
            TUGADI
          </span>
        )}
      </div>
      <div className="font-[var(--font-display)] font-bold leading-tight mt-0.5">
        {stone.title}
      </div>
      <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
        {stone.subtitle}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-faint)]">
        <span>{stone.durationMin} daq · +{stone.xp} XP</span>
        {!isLocked && <ChevronRight size={14} className="text-white/60" />}
      </div>
    </div>
  );

  if (isLocked) return body;
  return (
    <Link
      href={href}
      onClick={() => playSound("click")}
      className="block active:scale-[0.98] transition"
    >
      {body}
    </Link>
  );
}

function LockedPhase({ phase }: { phase: (typeof PHASES)[number] }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center">
      <div className="text-4xl">{phase.emoji}</div>
      <div className="mt-2 font-[var(--font-display)] font-bold text-xl">
        {phase.name} — yopiq bosqich
      </div>
      <p className="text-[var(--text-muted)] text-sm mt-2">
        Phase {phase.id} hozircha tezda chiqib keladi. Avvalgi bosqichlarni
        tugating va okean tomon yo'lda davom eting.
      </p>
    </div>
  );
}

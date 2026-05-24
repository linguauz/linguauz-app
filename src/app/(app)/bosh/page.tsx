"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Flame,
  BookMarked,
  Trophy,
  Target,
  Bell,
  Heart,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePoydevor, useLevel } from "@/store/usePoydevor";
import { PHASES, STONES, stoneById, stonesInPhase } from "@/data/curriculum";
import { cn } from "@/lib/cn";
import { relativeUz } from "@/lib/relativeTime";

/**
 * Bosh sahifa — dashboard rebuilt to match the Claude Design reference:
 *  - "Salom, [Name]!" header with subtle subtitle (no more big "bir tosh" hero copy)
 *  - JORIY BOSQICH phase card with a mini river-stone path and orange action
 *  - Level + Daily task stacked in a right rail (single column on mobile)
 *  - Three labelled stat cards
 *  - "So'nggi faoliyat" timeline with colored icons + relative timestamps
 */
export default function BoshPage() {
  const name = usePoydevor((s) => s.name) || "Sayohatchi";
  const streak = usePoydevor((s) => s.streak);
  const completed = usePoydevor((s) => s.completedStoneIds);
  const unlocked = usePoydevor((s) => s.unlockedStoneIds);
  const earnedBadges = usePoydevor((s) => s.earnedBadges);
  const activity = usePoydevor((s) => s.activity);
  const dailyTaskDone = usePoydevor((s) => s.dailyTaskDone);
  const currentPhase = usePoydevor((s) => s.currentPhase);
  const level = useLevel();

  const phase = PHASES.find((p) => p.id === currentPhase) ?? PHASES[0];
  const phaseStones = stonesInPhase(phase.id);
  const phaseDoneCount = phaseStones.filter((s) =>
    completed.includes(s.id),
  ).length;

  // Pick the active stone for the CTA → first unlocked but not completed in any phase
  const currentStone = useMemo(() => {
    const id = unlocked.find((sid) => !completed.includes(sid));
    return id ? stoneById(id) : phaseStones[0];
  }, [unlocked, completed, phaseStones]);

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <Header name={name} streak={streak} />

      {/* Phase hero (wide) + Level/Daily (rail). Stacks on small frames. */}
      <div className="grid gap-4 @4xl:gap-6 @4xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PhaseHeroCard
          phase={phase}
          phaseStones={phaseStones}
          phaseDoneCount={phaseDoneCount}
          currentStone={currentStone}
          completedIds={completed}
        />

        <div className="flex flex-col gap-4 @4xl:gap-5">
          <LevelCard
            level={level.level}
            title={level.title}
            xp={usePoydevor.getState().xp}
            progress={level.progress}
            bandNext={level.bandNext}
          />
          <DailyTaskCard done={dailyTaskDone} />
        </div>
      </div>

      {/* Three labelled stats */}
      <div className="grid grid-cols-1 @md:grid-cols-3 gap-3 @4xl:gap-4">
        <StatCard
          icon={<Flame size={18} />}
          tone="#ff8a4c"
          value={streak.toString()}
          unit="kun"
          label={`Streak · Rekord ${Math.max(streak, 7)}`}
        />
        <StatCard
          icon={<BookMarked size={18} />}
          tone="#22d3a5"
          value={String(completed.length)}
          unit={`/${STONES.length}`}
          label="Tugallangan tosh"
        />
        <StatCard
          icon={<Trophy size={18} />}
          tone="#ffb800"
          value={String(earnedBadges.length)}
          unit="/8"
          label="Yutuqlar"
        />
      </div>

      <ActivitySection items={activity} />
    </div>
  );
}

/* =================================================================
 * Header — greeting + streak + bell
 * ================================================================= */
function Header({
  name,
  streak,
}: {
  name: string;
  streak: number;
}) {
  const hearts = usePoydevor((s) => s.hearts);
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <h1 className="font-[var(--font-display)] font-bold leading-tight text-[24px] @md:text-[28px] @4xl:text-[34px]">
          Salom, {name}!{" "}
          <span className="inline-block animate-float-med">👋</span>
        </h1>
        <div className="mt-1 text-[12px] @md:text-[13px] text-[var(--text-muted)]">
          <span className="text-white/90 font-semibold">Bosh sahifa</span>
          <span className="mx-1.5 text-white/30">·</span>
          <span>Bugun bir tosh bosib o'tamizmi?</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden @md:flex items-center gap-1 px-3 h-9 rounded-full bg-white/5 border border-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              size={12}
              className={cn(
                "transition",
                i < hearts
                  ? "text-[var(--danger)] fill-[var(--danger)]"
                  : "text-white/15",
              )}
            />
          ))}
          <span className="ml-1.5 text-[11px] font-semibold">{hearts}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-[var(--brand-orange)]/12 border border-[var(--brand-orange)]/30 text-[var(--brand-orange)] font-semibold text-[12px]">
          <Flame size={14} />
          <span>{streak} kun</span>
          <span className="hidden @md:inline text-[var(--brand-orange)]/80 font-normal">
            ketma-ket
          </span>
        </div>
        <button
          type="button"
          aria-label="Bildirishnomalar"
          className="hidden @md:grid place-items-center h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/8 text-[var(--text-soft)]"
        >
          <Bell size={14} />
        </button>
      </div>
    </div>
  );
}

/* =================================================================
 * Phase hero card — dotted river stone path
 * ================================================================= */
function PhaseHeroCard({
  phase,
  phaseStones,
  phaseDoneCount,
  currentStone,
  completedIds,
}: {
  phase: (typeof PHASES)[number];
  phaseStones: typeof STONES;
  phaseDoneCount: number;
  currentStone: (typeof STONES)[number] | undefined;
  completedIds: string[];
}) {
  // Short, design-style description: topic chips + count, derived from data.
  const topicChips = phaseTopics(phase.id);
  const summary = `${topicChips.join(" · ")}. ${phaseStones.length} ta toshdan iborat poydevor.`;

  return (
    <div className="relative">
      {/* Gradient border — masked ring that follows the phase accent. */}
      <div
        className="absolute -inset-px rounded-[1.625rem] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${phase.accent} 70%, transparent) 0%, transparent 35%, transparent 65%, color-mix(in oklab, ${phase.accent} 45%, transparent) 100%)`,
        }}
      />
      <section
        className="phase-hero-card relative rounded-3xl overflow-hidden p-5 @md:p-6 @4xl:p-7 text-white"
        style={{
          background: `
            radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, ${phase.accent} 22%, transparent) 0%, transparent 60%),
            linear-gradient(140deg, rgba(13,29,52,0.94) 0%, rgba(8,18,34,0.94) 100%)
          `,
          boxShadow: `
            inset 0 0 0 1px color-mix(in oklab, ${phase.accent} 28%, transparent),
            0 30px 80px -30px color-mix(in oklab, ${phase.accent} 40%, transparent)
          `,
        }}
      >
        <div className="text-[10px] @md:text-[11px] uppercase tracking-[0.22em] text-white/55 font-semibold">
          Joriy bosqich
        </div>
        <h2 className="mt-1 font-[var(--font-display)] font-bold leading-tight text-[26px] @md:text-[30px] @4xl:text-[36px]">
          Phase {phase.id} — {phase.name}{" "}
          <span className="text-2xl @md:text-3xl align-middle">{phase.emoji}</span>
        </h2>
        <p className="mt-2 text-white/65 text-[13px] @md:text-[14px] max-w-xl">
          {summary}
        </p>

        <MiniRiver
          stones={phaseStones}
          completedIds={completedIds}
          currentId={currentStone?.id}
          accent={phase.accent}
        />

        <div className="mt-3 text-[12px] @md:text-[13px] text-white/75">
          <span className="font-bold text-white">{phaseDoneCount}</span>
          <span className="text-white/50">
            {" "}/ {phaseStones.length} tosh tugadi
          </span>
        </div>

        {currentStone && (
          <Link
            href={`/dars/${currentStone.id}`}
            className={cn(
              "inline-flex items-center gap-2 mt-5 h-12 px-5 rounded-full",
              "bg-gradient-to-r from-[#ff8a4c] via-[#ffb35a] to-[#22d3a5]",
              "text-black font-semibold text-[14px] @md:text-[15px]",
              "shadow-[0_18px_40px_-14px_rgba(255,138,76,0.55)] active:scale-[0.98] transition",
            )}
          >
            Davom etish · {currentStone.title}
            <ArrowRight size={16} />
          </Link>
        )}
      </section>
    </div>
  );
}

/**
 * Short topic chips per phase — used in the hero summary line so the copy
 * matches the design ("Tovush · So'z · Asosiy turkumlar.").
 */
function phaseTopics(phaseId: number): string[] {
  switch (phaseId) {
    case 1:
      return ["Tovush", "So'z", "Asosiy turkumlar"];
    case 2:
      return ["So'z ma'nosi", "O'zak · qo'shimcha", "So'z yasalishi"];
    case 3:
      return ["Ot", "Fe'l", "Sifat", "Ravish"];
    case 4:
      return ["Ega", "Kesim", "To'ldiruvchi", "Hol"];
    default:
      return ["Sintaksis", "Uslub", "Yozuv"];
  }
}

function MiniRiver({
  stones,
  completedIds,
  currentId,
  accent,
}: {
  stones: typeof STONES;
  completedIds: string[];
  currentId: string | undefined;
  accent: string;
}) {
  // Show 1 extra ghost dot at the end so the path always "continues" — gives
  // it that "next phase is coming" feel from the reference.
  const positions = useMemo(() => {
    const total = stones.length + 1;
    return Array.from({ length: total }, (_, i) => (i / (total - 1)) * 100);
  }, [stones.length]);

  return (
    <div className="relative mt-6 h-12 @md:h-14">
      {/* dashed water line */}
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-2"
      >
        <line
          x1="2"
          y1="5"
          x2="98"
          y2="5"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="0.7"
          strokeDasharray="1.4 2.2"
          strokeLinecap="round"
        />
      </svg>
      {/* stones */}
      {stones.map((stone, i) => {
        const isDone = completedIds.includes(stone.id);
        const isCurrent = stone.id === currentId;
        return (
          <span
            key={stone.id}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center",
              "h-5 w-5 @md:h-6 @md:w-6 rounded-full transition",
              isDone && "shadow-glow-green",
              isCurrent && "animate-pulse-glow",
            )}
            style={{
              left: `${positions[i]}%`,
              background: isDone
                ? `radial-gradient(circle, ${accent} 0%, color-mix(in oklab, ${accent} 50%, #052015) 100%)`
                : isCurrent
                  ? "radial-gradient(circle, #00a3ff 0%, #053a66 100%)"
                  : "rgba(255,255,255,0.08)",
              boxShadow: isDone
                ? `0 0 0 2px color-mix(in oklab, ${accent} 60%, transparent)`
                : isCurrent
                  ? "0 0 0 3px rgba(0,163,255,0.55), 0 0 18px rgba(0,163,255,0.6)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.12)",
            }}
            title={stone.title}
          />
        );
      })}
      {/* ghost trailing dot — the "next phase coming" hint */}
      <span
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 @md:h-5 @md:w-5 rounded-full opacity-50"
        style={{
          left: `${positions[positions.length - 1]}%`,
          background: "rgba(255,255,255,0.05)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}

/* =================================================================
 * Level card
 * ================================================================= */
function LevelCard({
  level,
  title,
  xp,
  progress,
  bandNext,
}: {
  level: number;
  title: string;
  xp: number;
  progress: number;
  bandNext: number;
}) {
  const remaining = Math.max(0, bandNext - xp);
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 @md:p-5">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center h-12 w-12 rounded-xl shrink-0 text-white font-bold text-base shadow-[0_10px_30px_-10px_rgba(255,138,76,0.65)] bg-gradient-to-br from-[#ff8a4c] via-[#ff8a4c] to-[#a855f7]">
          L{level}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] font-semibold">
            Level {level}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-[var(--font-display)] font-bold text-xl @md:text-[22px] leading-none">
              {xp}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">XP</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--phase-2)]/40 bg-[var(--phase-2)]/10 text-[var(--phase-2)] text-[11px] font-semibold shrink-0">
          <span>🌿</span> {title}
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#ff8a4c] via-[#22d3a5] to-[#00a3ff]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, progress * 100)}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-[var(--text-muted)]">
          {xp} / {bandNext}
        </span>
        <span className="text-[var(--text-soft)]">{remaining} XP qoldi</span>
      </div>
    </section>
  );
}

/* =================================================================
 * Daily task card
 * ================================================================= */
function DailyTaskCard({ done }: { done: number }) {
  const total = 3;
  const isDone = done >= total;
  return (
    <section
      className={cn(
        "rounded-3xl border p-4 @md:p-5 flex items-center gap-3",
        isDone
          ? "border-[var(--success)]/40 bg-[var(--success)]/8"
          : "border-white/10 bg-white/[0.04]",
      )}
    >
      <div
        className="grid place-items-center h-11 w-11 rounded-xl shrink-0"
        style={{ background: "rgba(255,138,76,0.16)", color: "#ff8a4c" }}
      >
        <Target size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-[var(--font-display)] font-bold text-[15px] leading-tight">
          Bugungi vazifa
        </div>
        <div className="mt-1 flex items-center gap-2 flex-wrap text-[12px] text-[var(--text-muted)]">
          <span>{total} mashq</span>
          <span className="inline-flex items-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i < done ? "bg-[var(--brand-orange)]" : "bg-white/20",
                )}
              />
            ))}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] font-semibold text-[10px]">
            +30 XP
          </span>
        </div>
      </div>
      {isDone && <CheckCircle2 size={18} className="text-[var(--success)]" />}
    </section>
  );
}

/* =================================================================
 * Stat card
 * ================================================================= */
function StatCard({
  icon,
  tone,
  value,
  unit,
  label,
}: {
  icon: React.ReactNode;
  tone: string;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 @md:p-4 flex items-center gap-3 min-w-0">
      <div
        className="grid place-items-center h-10 w-10 rounded-xl shrink-0"
        style={{
          background: `color-mix(in oklab, ${tone} 18%, transparent)`,
          color: tone,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1">
          <span className="font-[var(--font-display)] font-bold text-[20px] @md:text-[22px] leading-none">
            {value}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] leading-none">
            {unit}
          </span>
        </div>
        <div className="mt-1 text-[10px] @md:text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)] truncate font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
 * Activity section
 * ================================================================= */
function ActivitySection({
  items,
}: {
  items: ReturnType<typeof usePoydevor.getState>["activity"];
}) {
  return (
    <section className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 @md:p-5">
      <header className="flex items-center justify-between">
        <h3 className="font-[var(--font-display)] font-bold text-[16px] @md:text-[17px]">
          So'nggi faoliyat
        </h3>
        <Link
          href="/tahlil"
          className="inline-flex items-center gap-1 text-[12px] text-[var(--brand-aqua)] hover:text-white transition"
        >
          Tahlilga
          <ChevronRight size={14} />
        </Link>
      </header>

      <ul className="mt-3 divide-y divide-white/5">
        {items.length === 0 && (
          <li className="py-6 text-center text-[12px] text-[var(--text-muted)]">
            Hali faoliyat yo'q — birinchi toshni boshlang!
          </li>
        )}
        {items.slice(0, 5).map((it, i) => (
          <li
            key={i}
            className="py-3 flex items-center gap-3 first:pt-0 last:pb-0"
          >
            <ActivityIcon kind={it.kind} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">
                {it.label}
              </div>
              {it.detail && (
                <div className="text-[11px] text-[var(--text-muted)] truncate">
                  {it.detail}
                </div>
              )}
            </div>
            <div className="text-[11px] text-[var(--text-faint)] shrink-0">
              {relativeUz(it.date)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ActivityIcon({
  kind,
}: {
  kind:
    | "lesson-completed"
    | "quiz-completed"
    | "badge-earned"
    | "streak-bumped";
}) {
  const palette: Record<typeof kind, { color: string; node: React.ReactNode }> =
    {
      "lesson-completed": {
        color: "#22c55e",
        node: <CheckCircle2 size={14} />,
      },
      "quiz-completed": {
        color: "#22d3a5",
        node: <Sparkles size={14} />,
      },
      "badge-earned": {
        color: "#ffb800",
        node: <Award size={14} />,
      },
      "streak-bumped": {
        color: "#ff8a4c",
        node: <Flame size={14} />,
      },
    };
  const p = palette[kind];
  return (
    <span
      className="grid place-items-center h-9 w-9 rounded-xl shrink-0"
      style={{
        background: `color-mix(in oklab, ${p.color} 20%, transparent)`,
        color: p.color,
      }}
    >
      {p.node}
    </span>
  );
}

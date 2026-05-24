"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Dumbbell,
  Lock,
  ChevronRight,
  Star,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { PHASES, STONES, stonesInPhase } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

export default function MashqlarPage() {
  const completed = usePoydevor((s) => s.completedStoneIds);
  const unlocked = usePoydevor((s) => s.unlockedStoneIds);
  const stoneScores = usePoydevor((s) => s.stoneScores);
  const stoneStars = usePoydevor((s) => s.stoneStars);

  const summary = useMemo(() => {
    const taken = STONES.filter(
      (s) => typeof stoneScores[s.id] === "number",
    ).length;
    const perfect = STONES.filter((s) => stoneScores[s.id] === 100).length;
    const available = STONES.filter((s) => unlocked.includes(s.id)).length;
    return { taken, perfect, available, total: STONES.length };
  }, [stoneScores, unlocked]);

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <PageHeader
        eyebrow="Mashqlar"
        title={
          <>
            Bilimingni <span className="text-grad-warm">mustahkamla</span>
          </>
        }
        subtitle={
          <>
            <span className="text-white/85 font-semibold">{summary.taken}</span>{" "}
            ta mashq topshirildi · {summary.perfect} mukammal · {summary.available} ochiq
          </>
        }
        right={
          <div className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-white/5 border border-white/10 text-[12px]">
            <Dumbbell size={12} className="text-[var(--brand-orange)]" />
            <span className="text-[var(--text-soft)]">5 ta savol · har dars</span>
          </div>
        }
      />

      {/* Aggregate stats row */}
      <div className="grid grid-cols-1 @md:grid-cols-3 gap-3 @4xl:gap-4">
        <StatTile
          tone="#22d3a5"
          value={summary.taken.toString()}
          unit={`/${summary.total}`}
          label="Topshirildi"
        />
        <StatTile
          tone="#ffb800"
          value={summary.perfect.toString()}
          unit="ta mukammal"
          label="5/5 to'g'ri javob"
        />
        <StatTile
          tone="#00a3ff"
          value={summary.available.toString()}
          unit="ta ochiq"
          label="Hozir mavjud"
        />
      </div>

      {/* Phase groups */}
      <div className="space-y-5">
        {PHASES.filter((p) => p.stoneIds.length > 0).map((phase) => {
          const phaseStones = stonesInPhase(phase.id);
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
                      {phase.name}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] @md:text-[12px] text-[var(--text-muted)] shrink-0">
                  {
                    phaseStones.filter(
                      (s) => typeof stoneScores[s.id] === "number",
                    ).length
                  }{" "}
                  / {phaseStones.length} mashq
                </div>
              </div>

              <ul className="divide-y divide-white/5">
                {phaseStones.map((stone) => {
                  const isUnlocked = unlocked.includes(stone.id);
                  const isCompleted = completed.includes(stone.id);
                  const score = stoneScores[stone.id];
                  const stars = stoneStars[stone.id] ?? 0;
                  return (
                    <QuizRow
                      key={stone.id}
                      stone={stone}
                      isUnlocked={isUnlocked}
                      isCompleted={isCompleted}
                      score={score}
                      stars={stars}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function QuizRow({
  stone,
  isUnlocked,
  isCompleted,
  score,
  stars,
}: {
  stone: (typeof STONES)[number];
  isUnlocked: boolean;
  isCompleted: boolean;
  score: number | undefined;
  stars: number;
}) {
  const hasScore = typeof score === "number";
  const isLocked = !isUnlocked;

  const inner = (
    <div className="flex items-center gap-3 @md:gap-4 px-4 @md:px-5 py-3 transition group">
      <span
        className={cn(
          "grid place-items-center h-10 w-10 rounded-xl shrink-0 text-[16px]",
          isLocked && "bg-white/4 text-[var(--text-faint)]",
          !isLocked && !hasScore && "bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]",
          hasScore && score === 100 && "bg-[var(--gold)]/15 text-[var(--gold)]",
          hasScore && score !== 100 && "bg-[var(--brand-aqua)]/15 text-[var(--brand-aqua)]",
        )}
      >
        {isLocked ? <Lock size={16} /> : hasScore ? <RotateCcw size={16} /> : <Dumbbell size={16} />}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)] font-bold">
            Tosh {stone.globalIndex} · 5 savol
          </span>
          {isLocked && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/8 text-[var(--text-faint)] font-bold">
              Yopiq
            </span>
          )}
          {hasScore && score === 100 && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-bold">
              Mukammal
            </span>
          )}
          {!isLocked && !hasScore && (
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] font-bold">
              Yangi
            </span>
          )}
        </div>
        <div className="font-[var(--font-display)] font-bold text-[14px] @md:text-[15px] leading-tight truncate">
          {stone.title}
        </div>
        <div className="text-[11px] text-[var(--text-muted)] truncate">
          {hasScore
            ? `Eng yaxshi ball: ${score}% · qaytadan o'tish mumkin`
            : isCompleted
              ? "Dars tugatildi, hozir mashq vaqti"
              : isLocked
                ? "Avval dars qatorida ochiladi"
                : "Mashqni boshlang"}
        </div>
      </div>

      {hasScore && (
        <div className="hidden @md:flex items-center gap-0.5 shrink-0">
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
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[var(--brand-orange)] shrink-0">
          <Sparkles size={12} /> +20 XP
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
      <li className="opacity-60 cursor-not-allowed select-none">{inner}</li>
    );
  }

  return (
    <li>
      <Link
        href={`/mashq/${stone.id}`}
        onClick={() => playSound("click")}
        className="block hover:bg-white/4 transition"
      >
        {inner}
      </Link>
    </li>
  );
}

function StatTile({
  tone,
  value,
  unit,
  label,
}: {
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
        <Dumbbell size={16} />
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

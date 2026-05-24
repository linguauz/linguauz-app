"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";
import { LineChart, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import { STONES, PHASES } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/cn";

export default function TahlilPage() {
  const stoneScores = usePoydevor((s) => s.stoneScores);
  const completed = usePoydevor((s) => s.completedStoneIds);
  const activity = usePoydevor((s) => s.activity);
  const xp = usePoydevor((s) => s.xp);

  const phaseAverages = useMemo(() => {
    return PHASES.filter((p) => p.stoneIds.length > 0).map((p) => {
      const scores = p.stoneIds
        .map((id) => stoneScores[id])
        .filter((v): v is number => typeof v === "number");
      const avg =
        scores.length === 0
          ? 0
          : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      return { phase: p, avg, count: scores.length };
    });
  }, [stoneScores]);

  const weakStones = useMemo(() => {
    return STONES.filter(
      (s) => typeof stoneScores[s.id] === "number" && stoneScores[s.id] < 85,
    ).slice(0, 3);
  }, [stoneScores]);

  const strongStones = useMemo(() => {
    return STONES.filter(
      (s) => typeof stoneScores[s.id] === "number" && stoneScores[s.id] >= 90,
    ).slice(0, 3);
  }, [stoneScores]);

  // 7-day heatmap from activity
  const heatmap = useMemo(() => buildHeatmap(activity), [activity]);

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <PageHeader
        eyebrow="Tahlil"
        title={
          <>
            Sizning <span className="text-grad-cyan">poydevoringiz</span>
          </>
        }
        subtitle="Kuchli va zaif joylaringizni vaqtida toping"
        right={
          <div className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-white/5 border border-white/10 text-[12px]">
            <LineChart size={12} className="text-[var(--brand-aqua)]" />
            {completed.length} dars · {xp} XP
          </div>
        }
      />

      {/* Phase averages */}
      <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
        {phaseAverages.map(({ phase, avg, count }) => (
          <div key={phase.id} className="glass rounded-2xl p-3 @md:p-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg shrink-0">{phase.emoji}</span>
              <div className="min-w-0">
                <div className="text-[10px] @md:text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Phase {phase.id}
                </div>
                <div className="font-[var(--font-display)] font-bold leading-tight text-[14px] @md:text-[16px] truncate">
                  {phase.name}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[24px] @md:text-[28px] font-[var(--font-display)] font-bold leading-none">
              {avg}%
            </div>
            <div className="text-[10px] @md:text-[11px] text-[var(--text-muted)] mt-1">
              {count}/{phase.stoneIds.length} tahlil
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${avg}%`,
                  background: `linear-gradient(90deg, ${phase.accent}, color-mix(in oklab, ${phase.accent} 50%, #00a3ff))`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weak + Strong */}
      <div className="grid @2xl:grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[var(--warning)]" />
            <div className="font-[var(--font-display)] font-bold">
              Zaif joylari
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            85% dan past — qayta o'qish tavsiya etiladi
          </div>
          <div className="mt-3 space-y-2">
            {weakStones.length === 0 && (
              <div className="text-[12px] text-[var(--text-muted)]">
                Hozircha zaif joylar topilmadi 👌
              </div>
            )}
            {weakStones.map((s) => (
              <Link
                key={s.id}
                href={`/dars/${s.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 transition"
              >
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    Ball: {stoneScores[s.id]}% — mashqni takrorlang
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/40" />
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--success)]" />
            <div className="font-[var(--font-display)] font-bold">
              Kuchli tomonlaringiz
            </div>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            90%+ ball olgan toshlar
          </div>
          <div className="mt-3 space-y-2">
            {strongStones.length === 0 && (
              <div className="text-[12px] text-[var(--text-muted)]">
                Birinchi yulduzlarni yutishni boshlang!
              </div>
            )}
            {strongStones.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--success)]/8 border border-[var(--success)]/20"
              >
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-[var(--success)] truncate">
                    {stoneScores[s.id]}% — a'lo!
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Haftalik faollik
            </div>
            <div className="font-[var(--font-display)] font-bold">
              So'nggi 4 hafta
            </div>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">
            {heatmap.flat().filter(Boolean).length} faol kun
          </div>
        </div>
        <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: "auto repeat(7, 1fr)" }}>
          <span />
          {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((d) => (
            <span
              key={d}
              className="text-[10px] text-center text-[var(--text-faint)] uppercase tracking-wider"
            >
              {d}
            </span>
          ))}
          {heatmap.map((week, i) => (
            <Fragment key={`w${i}`}>
              <span className="text-[10px] text-[var(--text-faint)]">
                W{i + 1}
              </span>
              {week.map((day, j) => (
                <span
                  key={`${i}-${j}`}
                  className={cn(
                    "aspect-square rounded-md transition",
                    day === 0 && "bg-white/4",
                    day === 1 && "bg-[var(--brand-aqua)]/30",
                    day === 2 && "bg-[var(--brand-aqua)]/60",
                    day >= 3 && "bg-[var(--brand-aqua)]",
                  )}
                  title={`${day} faoliyat`}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Build a 4×7 heatmap from activity history. */
function buildHeatmap(
  activity: ReturnType<typeof usePoydevor.getState>["activity"],
): number[][] {
  const today = new Date();
  const grid: number[][] = Array.from({ length: 4 }, () => Array(7).fill(0));
  // index 0 = oldest (4 weeks ago), 3 = current week
  for (let weekIdx = 0; weekIdx < 4; weekIdx++) {
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const target = new Date(today);
      const offsetDays = (3 - weekIdx) * 7 + (6 - dayIdx);
      target.setDate(target.getDate() - offsetDays);
      const iso = target.toISOString().slice(0, 10);
      const count = activity.filter((a) => a.date === iso).length;
      grid[weekIdx][dayIdx] = count;
    }
  }
  // Demo: ensure last cell has activity even without history
  grid[3][6] = Math.max(1, grid[3][6]);
  return grid;
}

"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STONES, totalStones, stoneById, PHASES } from "@/data/curriculum";
import type { PhaseId } from "@/data/types";

/* -----------------------------------------------------------------------
 * Domain helpers
 * --------------------------------------------------------------------- */
export interface LevelInfo {
  level: number;
  title: string;
  /** XP at the start of this level (absolute). */
  bandMin: number;
  /** XP at which the next level begins (absolute). */
  bandNext: number;
  /** Fill ratio across the current band, 0..1. */
  progress: number;
}

const LEVEL_BANDS: { min: number; title: string }[] = [
  { min: 0, title: "Yangi Boshlovchi" },
  { min: 100, title: "Tovush Yo'lchisi" },
  { min: 200, title: "So'z Izlovchisi" },
  { min: 300, title: "Buloq Yo'lchisi" },
  { min: 500, title: "Gap Ustasi" },
  { min: 900, title: "Ona Tili Ustasi" },
];

export function levelFromXp(xp: number): LevelInfo {
  let level = 1;
  let bandMin = 0;
  let bandNext = LEVEL_BANDS[1]?.min ?? 100;
  let title = LEVEL_BANDS[0].title;
  for (let i = 0; i < LEVEL_BANDS.length; i++) {
    if (xp >= LEVEL_BANDS[i].min) {
      level = i + 1;
      bandMin = LEVEL_BANDS[i].min;
      bandNext = LEVEL_BANDS[i + 1]?.min ?? LEVEL_BANDS[i].min + 500;
      title = LEVEL_BANDS[i].title;
    }
  }
  const span = Math.max(1, bandNext - bandMin);
  const progress = Math.min(1, (xp - bandMin) / span);
  return { level, title, bandMin, bandNext, progress };
}

/* -----------------------------------------------------------------------
 * Store shape
 * --------------------------------------------------------------------- */
interface ActivityEntry {
  date: string; // YYYY-MM-DD
  kind:
    | "lesson-completed"
    | "quiz-completed"
    | "badge-earned"
    | "streak-bumped";
  label: string;
  detail?: string;
  xp?: number;
  stars?: number;
}

interface PoydevorState {
  /* === User === */
  onboarded: boolean;
  name: string;
  email: string;
  avatarColor: string;

  /* === Progress === */
  xp: number;
  streak: number;
  lastActiveDate: string | null; // ISO date YYYY-MM-DD
  weekStartDate: string | null;

  /* === Curriculum === */
  currentPhase: PhaseId;
  unlockedStoneIds: string[];
  completedStoneIds: string[];
  stoneScores: Record<string, number>; // stoneId → percentage 0..100
  stoneStars: Record<string, number>;

  /* === Quiz === */
  perfectQuizCount: number;
  hearts: number;
  lastHeartLossAt: number | null;

  /* === Badges === */
  earnedBadges: string[];

  /* === Activity === */
  activity: ActivityEntry[];

  /* === Daily task === */
  dailyTaskDate: string | null;
  dailyTaskDone: number; // 0..3

  /* === Settings === */
  mode: "junior" | "senior";
  useSound: boolean;
  deviceFrame: "mobile" | "desktop";
  theme: "dark" | "light";

  /* === Actions === */
  hydrateDaily: () => void;
  finishOnboarding: (payload: {
    name: string;
    email: string;
    mode?: "junior" | "senior";
  }) => void;
  setMode: (m: "junior" | "senior") => void;
  applyDiagnostic: (score: number, phase: PhaseId) => void;
  completeLesson: (stoneId: string) => void;
  completeQuiz: (stoneId: string, correct: number, total: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  toggleSound: () => void;
  setDeviceFrame: (f: "mobile" | "desktop") => void;
  toggleTheme: () => void;
  setTheme: (t: "dark" | "light") => void;
  logout: () => void;
  reset: () => void;
}

/* -----------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------- */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak(last: string | null): { streak: number; bumped: boolean } {
  if (!last) return { streak: 1, bumped: true };
  const t = new Date(today());
  const l = new Date(last);
  const diffDays = Math.round((t.getTime() - l.getTime()) / 86_400_000);
  if (diffDays === 0) return { streak: -1, bumped: false }; // sentinel "no change"
  if (diffDays === 1) return { streak: -1, bumped: true };
  return { streak: 1, bumped: true };
}

const NAME_PALETTE = [
  "#22d3a5",
  "#00a3ff",
  "#6c8cff",
  "#a855f7",
  "#f6b452",
  "#ff8a4c",
];

function avatarColorFor(name: string): string {
  if (!name) return NAME_PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return NAME_PALETTE[Math.abs(h) % NAME_PALETTE.length];
}

/* -----------------------------------------------------------------------
 * Pre-baked demo data — so the app feels "lived in" on first run
 * --------------------------------------------------------------------- */
function defaultActivity(name: string): ActivityEntry[] {
  return [
    {
      date: today(),
      kind: "streak-bumped",
      label: "Streak yangilandi",
      detail: `${name || "Sayohatchi"} bugun yana qaytib keldi`,
    },
    {
      date: today(),
      kind: "lesson-completed",
      label: "Tosh 3 · Ot Turkumi",
      detail: "5/5 to'g'ri javob",
      xp: 65,
      stars: 3,
    },
    {
      date: yesterday(),
      kind: "badge-earned",
      label: "Tovush Kashfiyotchisi",
      detail: "Phase 1 birinchi toshini tugatdingiz",
    },
  ];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const INITIAL_STONE = STONES[0].id;

/* -----------------------------------------------------------------------
 * Defaults — pre-baked demo state so the journey looks "lived in"
 * --------------------------------------------------------------------- */
const DEMO_DEFAULTS = {
  xp: 340,
  streak: 7,
  currentPhase: 1 as PhaseId,
  unlockedStoneIds: ["k-1", "k-2", "k-3", "k-4"],
  completedStoneIds: ["k-1", "k-2", "k-3"],
  stoneScores: { "k-1": 100, "k-2": 88, "k-3": 100 } as Record<string, number>,
  stoneStars: { "k-1": 3, "k-2": 2, "k-3": 3 } as Record<string, number>,
  earnedBadges: ["tovush", "streak-7", "mukammal"],
  perfectQuizCount: 3,
};

/* -----------------------------------------------------------------------
 * Store
 * --------------------------------------------------------------------- */
export const usePoydevor = create<PoydevorState>()(
  persist(
    (set) => ({
      onboarded: false,
      name: "",
      email: "",
      avatarColor: NAME_PALETTE[0],

      xp: DEMO_DEFAULTS.xp,
      streak: DEMO_DEFAULTS.streak,
      lastActiveDate: today(),
      weekStartDate: null,

      currentPhase: DEMO_DEFAULTS.currentPhase,
      unlockedStoneIds: DEMO_DEFAULTS.unlockedStoneIds,
      completedStoneIds: DEMO_DEFAULTS.completedStoneIds,
      stoneScores: DEMO_DEFAULTS.stoneScores,
      stoneStars: DEMO_DEFAULTS.stoneStars,

      perfectQuizCount: DEMO_DEFAULTS.perfectQuizCount,
      hearts: 5,
      lastHeartLossAt: null,

      earnedBadges: DEMO_DEFAULTS.earnedBadges,

      activity: [],

      dailyTaskDate: today(),
      dailyTaskDone: 1,

      mode: "junior",
      useSound: true,
      deviceFrame: "mobile",
      theme: "dark",

      /* ---------------- actions ---------------- */
      hydrateDaily: () =>
        set((s) => {
          // Reset daily task at day rollover
          if (s.dailyTaskDate !== today()) {
            return { dailyTaskDate: today(), dailyTaskDone: 0 };
          }
          return {};
        }),

      finishOnboarding: ({ name, email, mode }) =>
        set((s) => ({
          onboarded: true,
          name,
          email,
          ...(mode ? { mode, useSound: mode === "junior" } : {}),
          avatarColor: avatarColorFor(name),
          activity:
            s.activity.length > 0 ? s.activity : defaultActivity(name),
        })),

      setMode: (m) => set({ mode: m, useSound: m === "junior" }),

      applyDiagnostic: (score, phase) =>
        set((s) => {
          // Unlock stones up to (but not including) the assigned phase's first stone
          const assignedPhase = phase;
          const unlocked: string[] = [];
          for (const ph of PHASES) {
            if (ph.id < assignedPhase) {
              unlocked.push(...ph.stoneIds);
            } else if (ph.id === assignedPhase) {
              if (ph.stoneIds[0]) unlocked.push(ph.stoneIds[0]);
              break;
            }
          }
          // Merge with existing demo unlocks so we never go backwards
          const merged = Array.from(new Set([...s.unlockedStoneIds, ...unlocked]));
          return {
            currentPhase: assignedPhase,
            unlockedStoneIds: merged,
          };
        }),

      completeLesson: (stoneId) =>
        set((s) => {
          const stone = stoneById(stoneId);
          if (!stone) return {};
          const alreadyDone = s.completedStoneIds.includes(stoneId);
          const xpGain = alreadyDone ? 0 : stone.xp;

          // Unlock next stone if any
          const idx = STONES.findIndex((x) => x.id === stoneId);
          const next = STONES[idx + 1];
          const unlocked = new Set(s.unlockedStoneIds);
          unlocked.add(stoneId);
          if (next) unlocked.add(next.id);

          const completed = new Set(s.completedStoneIds);
          completed.add(stoneId);

          // Streak bump
          const { streak: bumpedStreak, bumped } = bumpStreak(s.lastActiveDate);
          const newStreak =
            bumpedStreak === -1
              ? bumped
                ? s.streak + 1
                : s.streak
              : bumpedStreak;

          // Badge earnings
          const badges = new Set(s.earnedBadges);
          if (stone.badgeId) badges.add(stone.badgeId);
          if (newStreak >= 7) badges.add("streak-7");
          // Phase complete badges
          const phasesDone = PHASES.filter(
            (p) =>
              p.stoneIds.length > 0 &&
              p.stoneIds.every((sid) => completed.has(sid)),
          ).map((p) => p.id);
          if (phasesDone.includes(2)) badges.add("soz-ustasi");
          if (phasesDone.includes(3)) badges.add("turkum-bilimdon");
          if (phasesDone.includes(4)) badges.add("gap-quruvchi");
          if (completed.size >= totalStones()) badges.add("poydevor");

          // Activity log
          const entry: ActivityEntry = {
            date: today(),
            kind: "lesson-completed",
            label: `${stone.emoji} ${stone.title}`,
            detail: `${stone.subtitle} · +${stone.xp} XP`,
            xp: stone.xp,
          };
          const activity: ActivityEntry[] = [entry, ...s.activity].slice(0, 12);

          return {
            xp: s.xp + xpGain,
            streak: newStreak,
            lastActiveDate: today(),
            completedStoneIds: Array.from(completed),
            unlockedStoneIds: Array.from(unlocked),
            earnedBadges: Array.from(badges),
            currentPhase: next ? (next.phaseId as PhaseId) : s.currentPhase,
            dailyTaskDone: Math.min(3, s.dailyTaskDone + 1),
            activity,
          };
        }),

      completeQuiz: (stoneId, correct, total) =>
        set((s) => {
          const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
          const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
          const stone = stoneById(stoneId);
          const xpBoost = pct === 100 ? 20 : pct >= 60 ? 10 : 0;
          const badges = new Set(s.earnedBadges);
          const perfectCount =
            pct === 100 ? s.perfectQuizCount + 1 : s.perfectQuizCount;
          if (perfectCount >= 3) badges.add("mukammal");

          const entry: ActivityEntry = {
            date: today(),
            kind: "quiz-completed",
            label: `${stone?.emoji ?? "📝"} ${stone?.title ?? "Mashq"}`,
            detail: `${correct}/${total} to'g'ri · ${stars}⭐`,
            xp: xpBoost,
            stars,
          };
          const activity: ActivityEntry[] = [entry, ...s.activity].slice(0, 12);

          return {
            xp: s.xp + xpBoost,
            stoneScores: { ...s.stoneScores, [stoneId]: pct },
            stoneStars: { ...s.stoneStars, [stoneId]: stars },
            perfectQuizCount: perfectCount,
            earnedBadges: Array.from(badges),
            activity,
          };
        }),

      loseHeart: () =>
        set((s) => {
          if (s.hearts <= 0) return {};
          return { hearts: s.hearts - 1, lastHeartLossAt: Date.now() };
        }),

      refillHearts: () => set({ hearts: 5, lastHeartLossAt: null }),

      toggleSound: () => set((s) => ({ useSound: !s.useSound })),

      setDeviceFrame: (f) => set({ deviceFrame: f }),

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      setTheme: (t) => set({ theme: t }),

      // Logout only ends the session — progress, XP and badges stay so a
      // re-login restores them. Reset wipes everything.
      logout: () => set({ onboarded: false }),

      reset: () =>
        set({
          onboarded: false,
          name: "",
          email: "",
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          currentPhase: 1,
          unlockedStoneIds: [INITIAL_STONE],
          completedStoneIds: [],
          stoneScores: {},
          stoneStars: {},
          perfectQuizCount: 0,
          hearts: 5,
          earnedBadges: [],
          activity: [],
          dailyTaskDate: today(),
          dailyTaskDone: 0,
        }),
    }),
    {
      name: "poydevor-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/**
 * Tracks whether the persisted state has finished rehydrating from
 * localStorage. Use this to gate redirects in layouts so we don't
 * bounce to /onboarding before Zustand reads the saved state.
 *
 * Note: `usePoydevor.persist` is only attached on the client (browser).
 * During Next.js prerender we always report `false`, so consumers should
 * render a neutral placeholder until the effect runs in the browser.
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const persist = usePoydevor.persist;
    if (!persist) return;
    const unsubFinish = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubFinish;
  }, []);
  return hydrated;
}

/* -----------------------------------------------------------------------
 * Derived selectors
 * --------------------------------------------------------------------- */
export function useLevel(): LevelInfo {
  const xp = usePoydevor((s) => s.xp);
  return levelFromXp(xp);
}

export function useStoneStatus(stoneId: string): {
  unlocked: boolean;
  completed: boolean;
  current: boolean;
  score: number | null;
  stars: number;
} {
  return usePoydevor((s) => {
    const unlocked = s.unlockedStoneIds.includes(stoneId);
    const completed = s.completedStoneIds.includes(stoneId);
    const isCurrent =
      unlocked && !completed &&
      stoneId === [...s.unlockedStoneIds].find((id) => !s.completedStoneIds.includes(id));
    return {
      unlocked,
      completed,
      current: !!isCurrent,
      score: s.stoneScores[stoneId] ?? null,
      stars: s.stoneStars[stoneId] ?? 0,
    };
  });
}

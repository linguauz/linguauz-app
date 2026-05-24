/**
 * Domain types for Poydevor — shared by data, store and UI.
 */

export type Mode = "junior" | "senior";

/**
 * Uzbek display names for the two modes. The journey is a master–apprentice
 * path: a "Shogird" (apprentice) learns with games, an "Ustoz" (master)
 * works in the calm academic mode.
 */
export const MODE_LABEL: Record<Mode, string> = {
  junior: "Shogird",
  senior: "Ustoz",
};

/** English tier kept alongside the Uzbek label, e.g. "Shogird · Junior". */
export const MODE_TIER: Record<Mode, string> = {
  junior: "Junior",
  senior: "Senior",
};

/** Accent color per mode, shared by onboarding + profile. */
export const MODE_ACCENT: Record<Mode, string> = {
  junior: "#22d3a5",
  senior: "#6c8cff",
};

export type PhaseId = 1 | 2 | 3 | 4 | 5;

export interface Phase {
  id: PhaseId;
  slug: string;
  name: string; // "Ko'lmak"
  emoji: string;
  tagline: string;
  description: string;
  /** Hex color used for glow / accents on this phase. */
  accent: string;
  /** Stones (lesson ids) inside this phase. */
  stoneIds: string[];
}

/* -----------------------------------------------------------------------
 * Grammar color codes — also referenced via CSS vars in globals.css.
 * --------------------------------------------------------------------- */
export type GrammarRole =
  | "ega"
  | "kesim"
  | "toldiruvchi"
  | "aniqlovchi"
  | "ravish"
  | "hol";

export const GRAMMAR_COLOR: Record<GrammarRole, string> = {
  ega: "var(--g-ega)",
  kesim: "var(--g-kesim)",
  toldiruvchi: "var(--g-toldiruvchi)",
  aniqlovchi: "var(--g-aniqlovchi)",
  ravish: "var(--g-ravish)",
  hol: "var(--g-hol)",
};

export const GRAMMAR_LABEL: Record<GrammarRole, string> = {
  ega: "EGA",
  kesim: "KESIM",
  toldiruvchi: "TO'LDIRUVCHI",
  aniqlovchi: "ANIQLOVCHI",
  ravish: "RAVISH",
  hol: "HOL",
};

/* -----------------------------------------------------------------------
 * Lesson cards — the lesson screen cycles through these in order.
 * --------------------------------------------------------------------- */
export interface ColoredWord {
  text: string;
  role?: GrammarRole; // undefined = neutral
}

export type LessonCard =
  | { type: "intro"; title: string; hook: string }
  | {
      type: "rule";
      title: string;
      rule: string;
      example?: ColoredWord[];
      examples?: ColoredWord[][];
    }
  | {
      type: "examples";
      title: string;
      sentences: ColoredWord[][];
      note?: string;
    }
  | {
      type: "tap";
      title: string;
      prompt: string;
      sentence: ColoredWord[];
      targetRole: GrammarRole;
    }
  | {
      type: "build";
      title: string;
      prompt: string;
      chips: ColoredWord[];
      slots: GrammarRole[];
    }
  | { type: "note"; title: string; body: string }
  | { type: "outro"; title: string; xp: number };

/* -----------------------------------------------------------------------
 * Quiz questions — 5 per stone, mixed types.
 * --------------------------------------------------------------------- */
export type QuizQuestion =
  | {
      type: "choice";
      prompt: string;
      options: string[];
      answer: number; // index
      explain: string;
    }
  | {
      type: "tap";
      prompt: string;
      sentence: string[]; // tokens
      answerIndex: number;
      explain: string;
    }
  | {
      type: "fill";
      prompt: string;
      before: string;
      after: string;
      options: string[];
      answer: number;
      explain: string;
    }
  | {
      type: "truefalse";
      prompt: string;
      claim: string;
      answer: boolean;
      explain: string;
    }
  | {
      type: "order";
      prompt: string;
      chips: string[];
      answer: number[]; // permutation of [0..n-1]
      hint: string;
      explain: string;
    };

/* -----------------------------------------------------------------------
 * Stone — one lesson + its quiz.
 * --------------------------------------------------------------------- */
export interface Stone {
  id: string;
  phaseId: PhaseId;
  index: number; // 1-based within phase
  globalIndex: number; // 1..16
  title: string;
  subtitle: string;
  emoji: string;
  durationMin: number;
  xp: number;
  cards: LessonCard[];
  quiz: QuizQuestion[];
  /** Optional badge unlocked at completion. */
  badgeId?: string;
}

/* -----------------------------------------------------------------------
 * Badges
 * --------------------------------------------------------------------- */
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlock: string;
  color: string; // tailwind / hex
}

/* -----------------------------------------------------------------------
 * Maqol
 * --------------------------------------------------------------------- */
export interface Maqol {
  uz: string;
  meaning: string;
}

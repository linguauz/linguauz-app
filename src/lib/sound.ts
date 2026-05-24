"use client";

/**
 * Lightweight Web Audio API sound effects — no audio files needed.
 * Tones are synthesized procedurally so the bundle stays tiny.
 */

type ToneId =
  | "click"
  | "correct"
  | "wrong"
  | "xp"
  | "levelup"
  | "badge"
  | "streak";

let ctx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

interface ToneSpec {
  freq: number;
  duration: number; // seconds
  type?: OscillatorType;
  /** Optional list of "notes" — each plays sequentially. */
  sequence?: { freq: number; duration: number; type?: OscillatorType; gain?: number }[];
  gain?: number;
}

const RECIPES: Record<ToneId, ToneSpec> = {
  click: { freq: 720, duration: 0.045, type: "sine", gain: 0.08 },
  correct: {
    freq: 880,
    duration: 0.16,
    sequence: [
      { freq: 880, duration: 0.08, type: "triangle", gain: 0.18 },
      { freq: 1320, duration: 0.14, type: "triangle", gain: 0.16 },
    ],
  },
  wrong: {
    freq: 220,
    duration: 0.22,
    sequence: [
      { freq: 240, duration: 0.1, type: "sawtooth", gain: 0.16 },
      { freq: 160, duration: 0.16, type: "sawtooth", gain: 0.14 },
    ],
  },
  xp: {
    freq: 660,
    duration: 0.18,
    sequence: [
      { freq: 660, duration: 0.06, type: "sine", gain: 0.15 },
      { freq: 990, duration: 0.06, type: "sine", gain: 0.13 },
      { freq: 1320, duration: 0.08, type: "sine", gain: 0.13 },
    ],
  },
  levelup: {
    freq: 523,
    duration: 0.5,
    sequence: [
      { freq: 523, duration: 0.1, type: "triangle", gain: 0.2 },
      { freq: 659, duration: 0.1, type: "triangle", gain: 0.2 },
      { freq: 784, duration: 0.12, type: "triangle", gain: 0.22 },
      { freq: 1047, duration: 0.18, type: "triangle", gain: 0.22 },
    ],
  },
  badge: {
    freq: 880,
    duration: 0.4,
    sequence: [
      { freq: 880, duration: 0.1, type: "sine", gain: 0.18 },
      { freq: 1175, duration: 0.1, type: "sine", gain: 0.18 },
      { freq: 1568, duration: 0.16, type: "sine", gain: 0.2 },
    ],
  },
  streak: {
    freq: 540,
    duration: 0.3,
    sequence: [
      { freq: 540, duration: 0.08, type: "square", gain: 0.13 },
      { freq: 720, duration: 0.08, type: "square", gain: 0.13 },
      { freq: 900, duration: 0.12, type: "square", gain: 0.15 },
    ],
  },
};

function playSegment(
  c: AudioContext,
  startAt: number,
  freq: number,
  duration: number,
  type: OscillatorType,
  gain: number,
): number {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  g.gain.setValueAtTime(0.0001, startAt);
  g.gain.exponentialRampToValueAtTime(gain, startAt + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(g).connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
  return startAt + duration;
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

export function playSound(id: ToneId): void {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  // Resume context on first user gesture (browser autoplay policy)
  if (c.state === "suspended") c.resume().catch(() => {});
  const recipe = RECIPES[id];
  const now = c.currentTime + 0.005;
  if (recipe.sequence && recipe.sequence.length > 0) {
    let cursor = now;
    for (const note of recipe.sequence) {
      cursor = playSegment(
        c,
        cursor,
        note.freq,
        note.duration,
        note.type ?? "sine",
        note.gain ?? 0.15,
      );
    }
    return;
  }
  playSegment(
    c,
    now,
    recipe.freq,
    recipe.duration,
    recipe.type ?? "sine",
    recipe.gain ?? 0.15,
  );
}

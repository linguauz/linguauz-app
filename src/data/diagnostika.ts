/**
 * Onboarding diagnostika — 3 quick questions that map to a starting Phase.
 */

export type DiagQ =
  | {
      type: "order";
      prompt: string;
      hint: string;
      chips: string[];
      answer: number[]; // indexes from chips → correct order
      explain: string;
    }
  | {
      type: "choice";
      prompt: string;
      options: string[];
      answer: number;
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
    };

export const DIAGNOSTIKA: DiagQ[] = [
  {
    type: "order",
    prompt: "So'zlardan to'g'ri gap tuzing",
    hint: "💡 Tartib: EGA · VAQT · JOY · KESIM",
    chips: ["Anvar", "kecha", "do'konga", "bordi"],
    answer: [0, 1, 2, 3],
    explain: '"Anvar kecha do\'konga bordi" — ega doim boshda, kesim oxirda.',
  },
  {
    type: "choice",
    prompt: "Qaysi gapda aniqlovchi to'g'ri ishlatilgan?",
    options: [
      "Men qizil olma yedim",
      "Olma qizil men yedim",
      "Yedim qizil olma men",
      "Men olma yedim qizil",
    ],
    answer: 0,
    explain: "Aniqlovchi (qizil) ot oldidan keladi: 'qizil olma'.",
  },
  {
    type: "fill",
    prompt: "Bo'sh joyni to'g'ri so'z bilan to'ldiring",
    before: "Kitob",
    after: "qo'yildi",
    options: ["stol ustiga", "tez", "yaxshi", "ko'k"],
    answer: 0,
    explain:
      "Bu yerda joy hol kerak — 'stol ustiga' qayerga? savoliga javob beradi.",
  },
];

/**
 * Decide the starting phase from the diagnostic score.
 * 100% → Phase 3 (Daryo) — already strong on basics
 * 67–88% → Phase 2 (Buloq)
 * <67% → Phase 1 (Ko'lmak)
 */
export function phaseFromDiag(score: number): 1 | 2 | 3 {
  if (score >= 100) return 3;
  if (score >= 67) return 2;
  return 1;
}

export function messageFromDiag(score: number): {
  title: string;
  body: string;
} {
  if (score === 100) {
    return {
      title: "🏆 Mukammal!",
      body: "Ona tilingiz a'lo darajada. Sayohatni Daryodan boshlaymiz.",
    };
  }
  if (score >= 67) {
    return {
      title: "⭐ Zo'r start!",
      body: "Asoslarni yaxshi bilasiz. Buloqdan davom etamiz.",
    };
  }
  return {
    title: "💪 Sayohat boshlandi",
    body: "Birga ko'lmakdan poydevor quramiz — okeangacha yetib boramiz.",
  };
}

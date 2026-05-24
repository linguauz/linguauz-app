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
  // 1 — Harf nima?
  {
    type: "choice",
    prompt: "Harf nima?",
    options: [
      "Tovushning yozuvdagi belgisi",
      "Talaffuz qilinadigan eng kichik birlik",
      "So'zning ma'noli qismi",
      "Gapning bo'lagi",
    ],
    answer: 0,
    explain:
      "Harf — tovushning yozuvda ifodalanadigan belgisi. Uni ko'ramiz va yozamiz.",
  },
  // 2 — Tovush nima?
  {
    type: "choice",
    prompt: "Tovush nima deyiladi?",
    options: [
      "Yozuvdagi belgi",
      "Talaffuz qilinadigan, eshitiladigan eng kichik birlik",
      "Bir nechta so'z birikmasi",
      "Gapning oxiridagi tinish belgisi",
    ],
    answer: 1,
    explain:
      "Tovush — biz talaffuz qiladigan va eshitadigan eng kichik birlik. Harf esa uning yozuvdagi belgisi.",
  },
  // 3 — Undosh harflarni topish
  {
    type: "choice",
    prompt: "Quyidagilardan qaysi qatorda faqat undosh harflar bor?",
    options: ["a, o, e", "b, d, m", "i, u, o'", "o, b, a"],
    answer: 1,
    explain:
      "b, d, m — undosh tovush harflari. a, o, e, i, u, o' — unli harflar.",
  },
  // 4 — Ot so'z turkumi savollari
  {
    type: "choice",
    prompt: "Ot so'z turkumi qaysi savollarga javob bo'ladi?",
    options: [
      "Qanday? Qanaqa?",
      "Nima qildi? Nima qilyapti?",
      "Kim? Nima?",
      "Qachon? Qayerda?",
    ],
    answer: 2,
    explain:
      "Ot narsa-buyum, shaxs nomini bildiradi va 'Kim? Nima?' savollariga javob beradi.",
  },
  // 5 — Birikmadan sifatni topish
  {
    type: "choice",
    prompt: "'Chiroyli gul' birikmasida qaysi so'z sifat?",
    options: ["gul", "chiroyli", "ikkalasi ham", "hech qaysi"],
    answer: 1,
    explain:
      "'Chiroyli' — belgini bildiradi va sifat. 'Gul' esa narsa nomi — ot.",
  },
  // 6 — Gapdan kesimni topish
  {
    type: "choice",
    prompt: "Gapdan kesimni toping: «Bolalar maktabga ketdi.»",
    options: ["bolalar", "maktabga", "ketdi"],
    answer: 2,
    explain:
      "Kesim ish-harakatni bildiradi: 'ketdi'. U 'nima qildi?' savoliga javob beradi.",
  },
  // 7 — Gapdan sifatni topish
  {
    type: "choice",
    prompt: "Gapdan sifatni toping: «Baland tog' qor bilan qoplandi.»",
    options: ["baland", "tog'", "qoplandi"],
    answer: 0,
    explain: "'Baland' tog'ning belgisini bildiradi — bu sifat.",
  },
  // 8 — Gapdan aniqlovchini topish
  {
    type: "choice",
    prompt: "Gapdan aniqlovchini toping: «Qizil olma pishdi.»",
    options: ["qizil", "olma", "pishdi"],
    answer: 0,
    explain:
      "Aniqlovchi otning belgisini ko'rsatadi va undan oldin keladi: 'qizil' olma.",
  },
  // 9 — Gapdan to'ldiruvchini topish
  {
    type: "choice",
    prompt: "Gapdan to'ldiruvchini toping: «Dilnoza kitobni o'qidi.»",
    options: ["Dilnoza", "kitobni", "o'qidi"],
    answer: 1,
    explain:
      "To'ldiruvchi ish-harakat tushgan narsani bildiradi va 'nimani?' savoliga javob beradi: 'kitobni'.",
  },
  // 10 — Gapdan holni topish
  {
    type: "choice",
    prompt: "Gapdan holni toping: «Bola tez yugurdi.»",
    options: ["bola", "tez", "yugurdi"],
    answer: 1,
    explain:
      "Hol ish-harakatning belgisini bildiradi va 'qanday? qay tarzda?' savoliga javob beradi: 'tez'.",
  },
];

/**
 * Decide the starting phase from the diagnostic score (10 questions).
 * ≥90% → Phase 3 (Daryo) — asoslarni mustahkam biladi
 * ≥60% → Phase 2 (Buloq)
 * <60% → Phase 1 (Ko'lmak)
 */
export function phaseFromDiag(score: number): 1 | 2 | 3 {
  if (score >= 90) return 3;
  if (score >= 60) return 2;
  return 1;
}

export function messageFromDiag(score: number): {
  title: string;
  body: string;
} {
  if (score >= 90) {
    return {
      title: "🏆 Mukammal!",
      body: "Ona tilingiz a'lo darajada. Sayohatni Daryodan boshlaymiz.",
    };
  }
  if (score >= 60) {
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

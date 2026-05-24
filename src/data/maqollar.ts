import type { Maqol } from "./types";

export const MAQOLLAR: Maqol[] = [
  {
    uz: "Bilim — eng katta boylik.",
    meaning: "Ilmdan boshqa hech narsa shu darajada qimmat emas.",
  },
  {
    uz: "Til — millatning ko'zgusi.",
    meaning: "Tilda xalqning ruhi, tarixi va kelajagi ko'rinadi.",
  },
  {
    uz: "Kitob o'qigan — nur ko'rgan.",
    meaning: "O'qish — ko'ngilning chirog'i.",
  },
  {
    uz: "Mehnat qilsang — rost keladi.",
    meaning: "Sabr va harakat oxiri samara beradi.",
  },
  {
    uz: "Otaning duosi — farzandning boyligi.",
    meaning: "Yaqinlarning qo'llab-quvvatlashi — eng katta sarmoya.",
  },
  {
    uz: "Yaxshi gap — yarim mol.",
    meaning: "Yumshoq so'z — kishini yarim yo'lda yutib oladi.",
  },
  {
    uz: "O'z tilini bilmagan — o'zini bilmagan.",
    meaning: "Ona tili o'zlikning poydevoridir.",
  },
];

export function maqolOfDay(seed: number): Maqol {
  return MAQOLLAR[seed % MAQOLLAR.length];
}

import type { Badge } from "./types";

export const BADGES: Badge[] = [
  {
    id: "tovush",
    name: "Tovush Kashfiyotchisi",
    emoji: "🔤",
    description: "Phase 1 birinchi toshini tugatdingiz.",
    unlock: "Phase 1 · Tosh 1",
    color: "#22d3a5",
  },
  {
    id: "soz-ustasi",
    name: "So'z Ustasi",
    emoji: "🧩",
    description: "Phase 2 — Buloq to'liq tugatildi.",
    unlock: "Phase 2 to'liq",
    color: "#00b39d",
  },
  {
    id: "turkum-bilimdon",
    name: "Turkum Bilimdon",
    emoji: "🏷️",
    description: "So'z turkumlari bo'limini mukammal tushundingiz.",
    unlock: "Phase 3 to'liq",
    color: "#00a3ff",
  },
  {
    id: "gap-quruvchi",
    name: "Gap Quruvchi",
    emoji: "🏗️",
    description: "Gap bo'laklarini ranglar bilan tartibga keltirdingiz.",
    unlock: "Phase 4 to'liq",
    color: "#6c8cff",
  },
  {
    id: "kuprik",
    name: "Ko'prik Bunyodkori",
    emoji: "🌉",
    description: "Faza orasidagi ko'prikni kechib o'tdingiz.",
    unlock: "Phase 2 · Tosh 5",
    color: "#f6b452",
  },
  {
    id: "streak-7",
    name: "7 Kunlik Oqim",
    emoji: "🔥",
    description: "Bir hafta uzluksiz oqimda qoldingiz.",
    unlock: "7 kun ketma-ket",
    color: "#ff8a4c",
  },
  {
    id: "mukammal",
    name: "Mukammal",
    emoji: "⭐",
    description: "Mashqdan to'liq 5/5 ball oldingiz.",
    unlock: "Quiz 5/5 — 3 marta",
    color: "#ffb800",
  },
  {
    id: "poydevor",
    name: "Poydevor",
    emoji: "🌊",
    description: "Barcha 16 toshni bosib o'tdingiz.",
    unlock: "Phase 1–4 to'liq",
    color: "#a855f7",
  },
];

export function findBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

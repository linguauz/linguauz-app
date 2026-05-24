"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import { stoneById } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import { ColorChip } from "@/components/grammar/ColorChip";
import {
  GRAMMAR_COLOR,
  GRAMMAR_LABEL,
  type ColoredWord,
  type GrammarRole,
  type LessonCard,
} from "@/data/types";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

export default function DarsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const stone = stoneById(params.id);
  const completeLesson = usePoydevor((s) => s.completeLesson);

  const [idx, setIdx] = useState(0);
  const [askHelp, setAskHelp] = useState(false);

  if (!stone) {
    return (
      <div className="p-6 text-center">
        <div className="text-2xl">🤷</div>
        <div className="mt-2 font-bold">Dars topilmadi</div>
        <Link
          href="/xarita"
          className="inline-block mt-4 px-4 py-2 rounded-full bg-white/8"
        >
          Xaritaga qaytish
        </Link>
      </div>
    );
  }

  const card = stone.cards[idx];
  const last = idx === stone.cards.length - 1;
  const stoneId = stone.id;

  function next() {
    playSound("click");
    if (last) {
      completeLesson(stoneId);
      playSound("xp");
      router.push(`/mashq/${stoneId}`);
      return;
    }
    setIdx((i) => i + 1);
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="grid place-items-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Tosh {stone.globalIndex} · {stone.subtitle}
          </div>
          <div className="font-[var(--font-display)] font-bold text-lg leading-tight">
            {stone.title}
          </div>
        </div>
        <div className="text-[11px] px-2 py-1 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] font-bold">
          +{stone.xp} XP
        </div>
      </div>

      {/* progress dots */}
      <div className="flex gap-1.5">
        {stone.cards.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition",
              i < idx ? "bg-[var(--brand-aqua)]" : i === idx ? "bg-white" : "bg-white/12",
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <CardRenderer card={card} />
        </motion.div>
      </AnimatePresence>

      {/* Help bottom sheet */}
      <AnimatePresence>
        {askHelp && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAskHelp(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: "spring", damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-3xl border-t border-x border-white/10 bg-[var(--bg-deep)] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="font-[var(--font-display)] font-bold text-lg">
                  💡 Izoh
                </div>
                <button
                  onClick={() => setAskHelp(false)}
                  className="p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-3 text-[var(--text-soft)] text-sm leading-relaxed">
                Bu kartochka {stone.title} mavzusining bir qismi.
                {card.type === "rule" && (
                  <div className="mt-2 p-3 rounded-xl bg-white/4 border border-white/8">
                    {card.rule}
                  </div>
                )}
                {card.type === "note" && (
                  <div className="mt-2 p-3 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25">
                    {card.body}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="grid grid-cols-[auto_1fr] gap-3 mt-4">
        <button
          type="button"
          onClick={() => setAskHelp(true)}
          className="inline-flex items-center gap-2 px-4 h-12 rounded-full border border-white/12 bg-white/4 hover:bg-white/8 text-[var(--text-soft)] text-sm"
        >
          <HelpCircle size={16} /> Izoh
        </button>
        <CardActionButton card={card} last={last} onNext={next} />
      </div>

      <div className="text-center text-[11px] text-[var(--text-faint)]">
        Karta {idx + 1} / {stone.cards.length}
      </div>
    </div>
  );
}

/* ============================================================
 * Card renderer
 * ============================================================ */

function CardRenderer({ card }: { card: LessonCard }) {
  if (card.type === "intro") return <IntroCard card={card} />;
  if (card.type === "rule") return <RuleCard card={card} />;
  if (card.type === "examples") return <ExamplesCard card={card} />;
  if (card.type === "tap") return <TapCard card={card} />;
  if (card.type === "build") return <BuildCard card={card} />;
  if (card.type === "arrange") return <ArrangeCard card={card} />;
  if (card.type === "note") return <NoteCard card={card} />;
  return <OutroCard card={card} />;
}

function IntroCard({ card }: { card: Extract<LessonCard, { type: "intro" }> }) {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 text-center">
      <div className="text-4xl">💧</div>
      <h2 className="text-[26px] font-[var(--font-display)] font-bold mt-3">
        {card.title}
      </h2>
      <p className="text-[var(--text-soft)] mt-3 max-w-md mx-auto">
        {card.hook}
      </p>
    </div>
  );
}

function RuleCard({ card }: { card: Extract<LessonCard, { type: "rule" }> }) {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        Qoida
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-xl mt-1">
        {card.title}
      </h2>
      <p className="text-[var(--text-soft)] mt-3 leading-relaxed">{card.rule}</p>

      {card.example && (
        <SentenceRow words={card.example} className="mt-4" />
      )}
      {card.examples && (
        <div className="mt-4 space-y-2">
          {card.examples.map((sentence, i) => (
            <SentenceRow key={i} words={sentence} />
          ))}
        </div>
      )}

      <ColorLegend />
    </div>
  );
}

function ExamplesCard({
  card,
}: {
  card: Extract<LessonCard, { type: "examples" }>;
}) {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        Misollar
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-xl mt-1">
        {card.title}
      </h2>
      <div className="mt-4 space-y-2">
        {card.sentences.map((s, i) => (
          <SentenceRow key={i} words={s} />
        ))}
      </div>
      {card.note && (
        <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/4 text-[12px] text-[var(--text-soft)]">
          {card.note}
        </div>
      )}
    </div>
  );
}

function TapCard({ card }: { card: Extract<LessonCard, { type: "tap" }> }) {
  const [pickIdx, setPickIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "correct" | "wrong">("idle");

  function tap(i: number) {
    if (phase !== "idle") return;
    const word = card.sentence[i];
    if (word.role === card.targetRole) {
      setPickIdx(i);
      setPhase("correct");
      playSound("correct");
    } else {
      setPickIdx(i);
      setPhase("wrong");
      playSound("wrong");
      setTimeout(() => {
        setPhase("idle");
        setPickIdx(null);
      }, 700);
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        Mashq
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-xl mt-1">
        {card.title}
      </h2>
      <p className="text-[var(--text-soft)] mt-1 text-sm">{card.prompt}</p>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {card.sentence.map((w, i) => {
          const isPicked = pickIdx === i;
          const role =
            isPicked && phase === "correct" ? card.targetRole : undefined;
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              className={cn(
                phase === "wrong" && isPicked && "animate-shake",
                "rounded-xl",
              )}
            >
              <ColorChip
                text={w.text}
                role={role}
                size="lg"
                interactive
                selected={isPicked && phase === "correct"}
              />
            </button>
          );
        })}
      </div>

      {phase === "correct" && (
        <div className="mt-4 p-3 rounded-xl bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] text-sm">
          ✓ To'g'ri! Bu — {GRAMMAR_LABEL[card.targetRole]}
        </div>
      )}
    </div>
  );
}

function BuildCard({ card }: { card: Extract<LessonCard, { type: "build" }> }) {
  const [picks, setPicks] = useState<(number | null)[]>(
    Array(card.slots.length).fill(null),
  );
  const [phase, setPhase] = useState<"idle" | "correct" | "wrong">("idle");

  function placeIntoFirstEmpty(chipIdx: number) {
    if (phase === "correct") return;
    if (picks.includes(chipIdx)) return;
    const next = [...picks];
    const slot = next.indexOf(null);
    if (slot === -1) return;
    next[slot] = chipIdx;
    setPicks(next);
    playSound("click");
    if (next.every((v) => v !== null)) {
      const ok = next.every((v, slotIdx) => {
        if (v == null) return false;
        return card.chips[v].role === card.slots[slotIdx];
      });
      if (ok) {
        setPhase("correct");
        playSound("correct");
      } else {
        setPhase("wrong");
        playSound("wrong");
        setTimeout(() => {
          setPhase("idle");
          setPicks(Array(card.slots.length).fill(null));
        }, 700);
      }
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        Qurish
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-xl mt-1">
        {card.title}
      </h2>
      <p className="text-[var(--text-soft)] mt-1 text-sm">{card.prompt}</p>

      <div
        className={cn(
          "mt-4 grid gap-2 p-3 rounded-2xl border-2 border-dashed",
          phase === "correct" && "border-[var(--success)] bg-[var(--success)]/10",
          phase === "wrong" && "border-[var(--danger)] bg-[var(--danger)]/10 animate-shake",
          phase === "idle" && "border-white/15 bg-white/3",
        )}
        style={{ gridTemplateColumns: `repeat(${card.slots.length}, minmax(0, 1fr))` }}
      >
        {card.slots.map((slotRole, i) => {
          const chipIdx = picks[i];
          const chip = chipIdx == null ? null : card.chips[chipIdx];
          return (
            <div key={i} className="min-h-[64px] grid place-items-center">
              {chip ? (
                <ColorChip text={chip.text} role={chip.role} size="sm" />
              ) : (
                <span
                  className="text-[10px] uppercase tracking-[0.18em] font-bold"
                  style={{ color: GRAMMAR_COLOR[slotRole] }}
                >
                  {GRAMMAR_LABEL[slotRole]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {card.chips.map((c, i) => {
          const used = picks.includes(i);
          return (
            <button
              key={i}
              disabled={used || phase === "correct"}
              onClick={() => placeIntoFirstEmpty(i)}
              className={cn(used && "opacity-40 cursor-not-allowed")}
            >
              <ColorChip
                text={c.text}
                role={c.role}
                size="md"
                interactive
              />
            </button>
          );
        })}
      </div>

      {phase === "correct" && (
        <div className="mt-4 p-3 rounded-xl bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] text-sm">
          ✓ Ranglar joyiga keldi!
        </div>
      )}
    </div>
  );
}

function ArrangeCard({
  card,
}: {
  card: Extract<LessonCard, { type: "arrange" }>;
}) {
  // Shuffle once per mount so the chips never start in the answer order.
  const [order] = useState(() => shuffle(card.tokens.map((_, i) => i)));
  const [placed, setPlaced] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "correct" | "wrong">("idle");

  function pick(i: number) {
    if (phase === "correct" || placed.includes(i)) return;
    const next = [...placed, i];
    setPlaced(next);
    playSound("click");
    if (next.length === card.tokens.length) {
      const ok = next.every((v, slot) => v === slot);
      if (ok) {
        setPhase("correct");
        playSound("correct");
      } else {
        setPhase("wrong");
        playSound("wrong");
        setTimeout(() => {
          setPhase("idle");
          setPlaced([]);
        }, 700);
      }
    }
  }

  function removeAt(slot: number) {
    if (phase === "correct") return;
    setPlaced((p) => p.filter((_, i) => i !== slot));
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        Qurish
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-xl mt-1">
        {card.title}
      </h2>
      <p className="text-[var(--text-soft)] mt-1 text-sm">{card.prompt}</p>

      <div
        className={cn(
          "mt-4 p-3 rounded-2xl min-h-[60px] flex flex-wrap gap-2 items-center border-2 border-dashed",
          phase === "correct" && "border-[var(--success)] bg-[var(--success)]/10",
          phase === "wrong" && "border-[var(--danger)] bg-[var(--danger)]/10 animate-shake",
          phase === "idle" && "border-white/15 bg-white/3",
        )}
      >
        {placed.length === 0 && (
          <span className="text-[12px] text-[var(--text-faint)] mx-auto">
            Bo'laklarni shu yerga joylashtiring
          </span>
        )}
        {placed.map((tokIdx, slot) => (
          <button
            key={slot}
            onClick={() => removeAt(slot)}
            disabled={phase === "correct"}
            className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#22d3a5]/30 to-[#00a3ff]/30 border border-white/15 text-sm font-medium"
          >
            {card.tokens[tokIdx]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.map((tokIdx) => {
          const used = placed.includes(tokIdx);
          return (
            <button
              key={tokIdx}
              disabled={used || phase === "correct"}
              onClick={() => pick(tokIdx)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm border transition",
                used
                  ? "bg-white/2 border-white/5 text-[var(--text-faint)] line-through cursor-not-allowed"
                  : "bg-white/5 border-white/12 hover:bg-white/10",
              )}
            >
              {card.tokens[tokIdx]}
            </button>
          );
        })}
      </div>

      {phase === "correct" && (
        <div className="mt-4 p-3 rounded-xl bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] text-sm">
          ✓ To'g'ri tartib!{card.note ? ` ${card.note}` : ""}
        </div>
      )}
    </div>
  );
}

function NoteCard({ card }: { card: Extract<LessonCard, { type: "note" }> }) {
  return (
    <div
      className="rounded-3xl p-5 border relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,184,0,0.18), rgba(168,85,247,0.08))",
        borderColor: "rgba(255,184,0,0.3)",
        boxShadow: "0 0 40px -10px rgba(255,184,0,0.3)",
      }}
    >
      <div className="flex items-center gap-2">
        <Lightbulb size={16} className="text-[var(--gold)]" />
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
          Kelajak uchun xatcho'p
        </div>
      </div>
      <h2 className="font-[var(--font-display)] font-bold text-lg mt-2">
        {card.title}
      </h2>
      <p className="text-white/85 mt-3 leading-relaxed text-[14px]">
        {card.body}
      </p>
    </div>
  );
}

function OutroCard({ card }: { card: Extract<LessonCard, { type: "outro" }> }) {
  return (
    <div className="glass-strong rounded-3xl p-6 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 16 }}
        className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-gradient-to-br from-[#22d3a5] to-[#00a3ff] shadow-glow-cyan"
      >
        <CheckCircle2 size={36} className="text-white" />
      </motion.div>
      <h2 className="mt-4 font-[var(--font-display)] font-bold text-xl">
        {card.title}
      </h2>
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-orange)]/15 border border-[var(--brand-orange)]/30 text-[var(--brand-orange)] font-bold text-sm">
        <Sparkles size={14} /> +{card.xp} XP
      </div>
      <p className="text-[var(--text-muted)] mt-3 text-sm">
        Endi mashqlar bilan mustahkamlaymiz.
      </p>
    </div>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SentenceRow({
  words,
  className,
}: {
  words: ColoredWord[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 justify-center", className)}>
      {words.map((w, i) =>
        w.role ? (
          <ColorChip key={i} text={w.text} role={w.role} size="md" />
        ) : (
          <span key={i} className="text-[var(--text-soft)] text-[14px]">
            {w.text}
          </span>
        ),
      )}
    </div>
  );
}

function ColorLegend() {
  const items: GrammarRole[] = [
    "ega",
    "kesim",
    "toldiruvchi",
    "aniqlovchi",
    "ravish",
    "hol",
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((role) => (
        <span
          key={role}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold"
          style={{
            color: GRAMMAR_COLOR[role],
            background: `color-mix(in oklab, ${GRAMMAR_COLOR[role]} 14%, transparent)`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: GRAMMAR_COLOR[role] }}
          />
          {GRAMMAR_LABEL[role]}
        </span>
      ))}
    </div>
  );
}

function CardActionButton({
  card,
  last,
  onNext,
}: {
  card: LessonCard;
  last: boolean;
  onNext: () => void;
}) {
  const label =
    card.type === "intro"
      ? "Boshlash"
      : card.type === "outro"
        ? "Mashqga o'tish"
        : last
          ? "Yakunlash"
          : "Tushundim";
  return (
    <button
      type="button"
      onClick={onNext}
      className="w-full h-12 rounded-full bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white font-semibold shadow-glow-cyan active:scale-[0.98] transition inline-flex items-center justify-center gap-2"
    >
      {label} <ArrowRight size={16} />
    </button>
  );
}

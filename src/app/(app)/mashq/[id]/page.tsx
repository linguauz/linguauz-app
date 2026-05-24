"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, X, Star } from "lucide-react";
import { stoneById, nextStone } from "@/data/curriculum";
import { usePoydevor } from "@/store/usePoydevor";
import type { QuizQuestion } from "@/data/types";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";
import { Confetti } from "@/components/fx/Confetti";

/** Fisher–Yates — shuffles a copy so options/chips never start in answer order. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MashqPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const stone = stoneById(params.id);
  const completeQuiz = usePoydevor((s) => s.completeQuiz);
  const loseHeart = usePoydevor((s) => s.loseHeart);
  const hearts = usePoydevor((s) => s.hearts);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [stage, setStage] = useState<"asking" | "result">("asking");

  if (!stone) return <NotFound />;
  const q = stone.quiz[idx];
  const total = stone.quiz.length;
  const stoneId = stone.id;

  function onAnswer(isCorrect: boolean) {
    if (isCorrect) {
      setCorrect((c) => c + 1);
      playSound("correct");
    } else {
      playSound("wrong");
      loseHeart();
    }
    setTimeout(() => {
      if (idx + 1 >= total) {
        completeQuiz(stoneId, isCorrect ? correct + 1 : correct, total);
        setStage("result");
      } else {
        setIdx((i) => i + 1);
      }
    }, 800);
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
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
            Mashq · {stone.title}
          </div>
          <div className="font-[var(--font-display)] font-bold text-lg leading-tight">
            {stage === "asking" ? `Savol ${idx + 1} / ${total}` : "Yakun"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              size={14}
              className={cn(
                "transition",
                i < hearts ? "text-[var(--danger)] fill-[var(--danger)]" : "text-white/15",
              )}
            />
          ))}
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] transition-all duration-500"
          style={{
            width: `${stage === "result" ? 100 : ((idx + 1) / total) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {stage === "asking" ? (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <QuestionView q={q} onAnswer={onAnswer} />
          </motion.div>
        ) : (
          <ResultView
            key="result"
            correct={correct}
            total={total}
            stoneId={stone.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6 text-center">
      <div className="text-2xl">🤷</div>
      <div className="mt-2 font-bold">Mashq topilmadi</div>
      <Link href="/xarita" className="inline-block mt-4 px-4 py-2 rounded-full bg-white/8">
        Xaritaga qaytish
      </Link>
    </div>
  );
}

/* ============================================================
 * Question dispatcher
 * ============================================================ */

function QuestionView({
  q,
  onAnswer,
}: {
  q: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  if (q.type === "choice") return <ChoiceView q={q} onAnswer={onAnswer} />;
  if (q.type === "tap") return <TapView q={q} onAnswer={onAnswer} />;
  if (q.type === "fill") return <FillView q={q} onAnswer={onAnswer} />;
  if (q.type === "truefalse") return <TFView q={q} onAnswer={onAnswer} />;
  return <OrderView q={q} onAnswer={onAnswer} />;
}

function QuestionHeader({
  index,
  total,
  prompt,
}: {
  index: number;
  total: number;
  prompt: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-aqua)]">
        Savol {index + 1} / {total}
      </div>
      <h2 className="mt-2 font-[var(--font-display)] font-bold text-[20px] leading-snug">
        {prompt}
      </h2>
    </div>
  );
}

function ChoiceView({
  q,
  onAnswer,
}: {
  q: Extract<QuizQuestion, { type: "choice" }>;
  onAnswer: (c: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [order] = useState(() => shuffle(q.options.map((_, i) => i)));

  function check() {
    if (pick == null) return;
    setRevealed(true);
    onAnswer(pick === q.answer);
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <QuestionHeader index={0} total={1} prompt={q.prompt} />
      <div className="mt-5 space-y-2">
        {order.map((i, pos) => {
          const opt = q.options[i];
          const isPick = pick === i;
          const isAnswer = i === q.answer;
          const tone = revealed
            ? isAnswer
              ? "correct"
              : isPick
                ? "wrong"
                : "idle"
            : isPick
              ? "picked"
              : "idle";
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => {
                setPick(i);
                playSound("click");
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition",
                tone === "idle" && "bg-white/4 border-white/10 hover:border-white/20",
                tone === "picked" && "bg-[var(--brand-aqua)]/15 border-[var(--brand-aqua)]/60",
                tone === "correct" && "bg-[var(--success)]/15 border-[var(--success)]/60",
                tone === "wrong" && "bg-[var(--danger)]/15 border-[var(--danger)]/60 animate-shake",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center h-7 w-7 rounded-lg shrink-0 text-[12px] font-bold",
                  tone === "idle" && "bg-white/5",
                  tone === "picked" && "bg-[var(--brand-aqua)] text-black",
                  tone === "correct" && "bg-[var(--success)] text-black",
                  tone === "wrong" && "bg-[var(--danger)] text-white",
                )}
              >
                {tone === "correct" ? (
                  <Check size={14} />
                ) : tone === "wrong" ? (
                  <X size={14} />
                ) : (
                  String.fromCharCode(65 + pos)
                )}
              </span>
              <span className="text-[14px]">{opt}</span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <Explanation text={q.explain} />
      )}
      <button
        type="button"
        disabled={pick == null || revealed}
        onClick={check}
        className={cn(
          "mt-5 w-full h-12 rounded-full font-semibold transition",
          pick != null && !revealed
            ? "bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white shadow-glow-cyan"
            : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed",
        )}
      >
        Tekshirish
      </button>
    </div>
  );
}

function TapView({
  q,
  onAnswer,
}: {
  q: Extract<QuizQuestion, { type: "tap" }>;
  onAnswer: (c: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function tap(i: number) {
    if (revealed) return;
    setPick(i);
    setRevealed(true);
    onAnswer(i === q.answerIndex);
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <QuestionHeader index={0} total={1} prompt={q.prompt} />
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        {q.sentence.map((w, i) => {
          const isAnswer = i === q.answerIndex;
          const isPick = pick === i;
          const tone = revealed
            ? isAnswer
              ? "correct"
              : isPick
                ? "wrong"
                : "idle"
            : "idle";
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => tap(i)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium border transition",
                tone === "idle" && "bg-white/5 border-white/10 hover:bg-white/10",
                tone === "correct" && "bg-[var(--success)]/20 border-[var(--success)]/60",
                tone === "wrong" && "bg-[var(--danger)]/20 border-[var(--danger)]/60 animate-shake",
              )}
            >
              {w}
            </button>
          );
        })}
      </div>
      {revealed && <Explanation text={q.explain} />}
    </div>
  );
}

function FillView({
  q,
  onAnswer,
}: {
  q: Extract<QuizQuestion, { type: "fill" }>;
  onAnswer: (c: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [order] = useState(() => shuffle(q.options.map((_, i) => i)));

  function pickOption(i: number) {
    if (revealed) return;
    setPick(i);
    playSound("click");
  }

  function check() {
    if (pick == null) return;
    setRevealed(true);
    onAnswer(pick === q.answer);
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <QuestionHeader index={0} total={1} prompt={q.prompt} />
      <div className="mt-5 p-4 rounded-2xl bg-white/4 border border-white/10 text-center text-[16px]">
        <span className="text-[var(--text-soft)]">{q.before}</span>{" "}
        <span
          className={cn(
            "inline-block min-w-[100px] px-3 py-1 rounded-xl border-2 border-dashed mx-1",
            pick != null
              ? "border-[var(--brand-aqua)] text-white font-semibold"
              : "border-white/20 text-[var(--text-faint)]",
          )}
        >
          {pick != null ? q.options[pick] : "____"}
        </span>{" "}
        <span className="text-[var(--text-soft)]">{q.after}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {order.map((i) => {
          const opt = q.options[i];
          const isPick = pick === i;
          const isAnswer = i === q.answer;
          const tone = revealed
            ? isAnswer
              ? "correct"
              : isPick
                ? "wrong"
                : "idle"
            : isPick
              ? "picked"
              : "idle";
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => pickOption(i)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm border transition",
                tone === "idle" && "bg-white/4 border-white/10 hover:border-white/20",
                tone === "picked" && "bg-[var(--brand-aqua)]/15 border-[var(--brand-aqua)]/60",
                tone === "correct" && "bg-[var(--success)]/15 border-[var(--success)]/60",
                tone === "wrong" && "bg-[var(--danger)]/15 border-[var(--danger)]/60 animate-shake",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && <Explanation text={q.explain} />}
      <button
        type="button"
        disabled={pick == null || revealed}
        onClick={check}
        className={cn(
          "mt-5 w-full h-12 rounded-full font-semibold transition",
          pick != null && !revealed
            ? "bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white shadow-glow-cyan"
            : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed",
        )}
      >
        Tekshirish
      </button>
    </div>
  );
}

function TFView({
  q,
  onAnswer,
}: {
  q: Extract<QuizQuestion, { type: "truefalse" }>;
  onAnswer: (c: boolean) => void;
}) {
  const [pick, setPick] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  function choose(v: boolean) {
    if (revealed) return;
    setPick(v);
    setRevealed(true);
    onAnswer(v === q.answer);
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <QuestionHeader index={0} total={1} prompt={q.prompt} />
      <div className="mt-5 p-4 rounded-2xl bg-white/4 border border-white/10 text-center">
        <span className="text-[16px] font-semibold">{q.claim}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[true, false].map((v) => {
          const isPick = pick === v;
          const isAnswer = v === q.answer;
          const tone = revealed
            ? isAnswer
              ? "correct"
              : isPick
                ? "wrong"
                : "idle"
            : "idle";
          return (
            <button
              key={String(v)}
              disabled={revealed}
              onClick={() => choose(v)}
              className={cn(
                "h-14 rounded-2xl border font-bold transition flex items-center justify-center gap-2",
                tone === "idle" && "bg-white/5 border-white/10 hover:bg-white/10",
                tone === "correct" && "bg-[var(--success)]/20 border-[var(--success)]/60",
                tone === "wrong" && "bg-[var(--danger)]/20 border-[var(--danger)]/60 animate-shake",
              )}
            >
              {v ? <Check size={18} /> : <X size={18} />}
              {v ? "To'g'ri" : "Noto'g'ri"}
            </button>
          );
        })}
      </div>
      {revealed && <Explanation text={q.explain} />}
    </div>
  );
}

function OrderView({
  q,
  onAnswer,
}: {
  q: Extract<QuizQuestion, { type: "order" }>;
  onAnswer: (c: boolean) => void;
}) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [order] = useState(() => shuffle(q.chips.map((_, i) => i)));

  function pickChip(i: number) {
    if (revealed) return;
    if (placed.includes(i)) return;
    setPlaced((p) => [...p, i]);
    playSound("click");
  }
  function removeAt(slot: number) {
    if (revealed) return;
    setPlaced((p) => p.filter((_, i) => i !== slot));
  }

  function check() {
    setRevealed(true);
    const ok =
      placed.length === q.answer.length &&
      placed.every((v, i) => v === q.answer[i]);
    onAnswer(ok);
  }

  return (
    <div className="glass-strong rounded-3xl p-5">
      <QuestionHeader index={0} total={1} prompt={q.prompt} />
      <div className="text-[11px] text-[var(--text-muted)] mt-1 text-center">
        {q.hint}
      </div>

      <div
        className={cn(
          "mt-5 p-3 rounded-2xl min-h-[64px] flex flex-wrap gap-2 border-2 border-dashed",
          revealed
            ? placed.every((v, i) => v === q.answer[i])
              ? "border-[var(--success)] bg-[var(--success)]/10"
              : "border-[var(--danger)] bg-[var(--danger)]/10 animate-shake"
            : "border-white/15 bg-white/3",
        )}
      >
        {placed.length === 0 && (
          <span className="text-[12px] text-[var(--text-faint)] self-center mx-auto">
            So'zlarni shu yerga joylashtiring
          </span>
        )}
        {placed.map((chipIdx, slot) => (
          <button
            key={slot}
            onClick={() => removeAt(slot)}
            disabled={revealed}
            className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#22d3a5]/30 to-[#00a3ff]/30 border border-white/15 text-sm font-medium"
          >
            {q.chips[chipIdx]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {order.map((i) => {
          const c = q.chips[i];
          const used = placed.includes(i);
          return (
            <button
              key={i}
              disabled={used || revealed}
              onClick={() => pickChip(i)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm border transition",
                used
                  ? "bg-white/2 border-white/5 text-[var(--text-faint)] line-through cursor-not-allowed"
                  : "bg-white/5 border-white/12 hover:bg-white/10",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {revealed && <Explanation text={q.explain} />}

      <button
        type="button"
        disabled={placed.length !== q.chips.length || revealed}
        onClick={check}
        className={cn(
          "mt-5 w-full h-12 rounded-full font-semibold transition",
          placed.length === q.chips.length && !revealed
            ? "bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white shadow-glow-cyan"
            : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed",
        )}
      >
        Tekshirish
      </button>
    </div>
  );
}

function Explanation({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 rounded-xl border border-white/10 bg-white/4 text-[12px] text-[var(--text-soft)]"
    >
      💡 {text}
    </motion.div>
  );
}

/* ============================================================
 * Result
 * ============================================================ */

function ResultView({
  correct,
  total,
  stoneId,
}: {
  correct: number;
  total: number;
  stoneId: string;
}) {
  const router = useRouter();
  const pct = Math.round((correct / total) * 100);
  const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
  const nx = nextStone(stoneId);

  const xpGain = pct === 100 ? 20 : pct >= 60 ? 10 : 0;

  return (
    <>
      {stars === 3 && <Confetti count={80} />}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-3xl p-6 text-center"
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
          Mashq yakuni
        </div>
        <div className="font-[var(--font-display)] font-bold text-[28px] mt-1">
          {pct === 100
            ? "Mukammal! 🏆"
            : pct >= 60
              ? "Zo'r ish! ⚡"
              : "Davom eting 💪"}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: i < stars ? 1 : 0.7, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.18, type: "spring" }}
            >
              <Star
                size={36}
                className={cn(
                  i < stars
                    ? "text-[var(--gold)] fill-[var(--gold)]"
                    : "text-white/15",
                )}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/4 border border-white/10">
          <span className="text-[13px]">
            <strong className="text-white">{correct}</strong> / {total} to'g'ri
          </span>
          <span className="text-[13px] text-[var(--brand-aqua)] font-bold">
            +{xpGain} XP
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push(`/mashq/${stoneId}`)}
            className="h-12 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10"
          >
            Yana bir marta
          </button>
          {nx ? (
            <Link
              href={`/dars/${nx.id}`}
              className="grid place-items-center h-12 rounded-full bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white font-semibold shadow-glow-cyan"
            >
              <span className="inline-flex items-center gap-2">
                Keyingi tosh <ArrowRight size={16} />
              </span>
            </Link>
          ) : (
            <Link
              href="/yutuqlar?tab=cert"
              className="grid place-items-center h-12 rounded-full bg-gradient-to-r from-[#ff8a4c] to-[#ffb800] text-black font-semibold"
            >
              Sertifikat
            </Link>
          )}
        </div>
        <Link
          href="/xarita"
          className="block mt-3 text-[12px] text-[var(--text-muted)] hover:text-white"
        >
          Xaritaga qaytish
        </Link>
      </motion.div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Sparkles } from "lucide-react";
import { TopBar } from "@/components/shell/TopBar";
import { DeviceShell } from "@/components/shell/DeviceShell";
import {
  DIAGNOSTIKA,
  messageFromDiag,
  phaseFromDiag,
  type DiagQ,
} from "@/data/diagnostika";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

export default function DiagnostikaPage() {
  const router = useRouter();
  const applyDiagnostic = usePoydevor((s) => s.applyDiagnostic);

  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stage, setStage] = useState<"asking" | "result">("asking");
  const q = DIAGNOSTIKA[idx];

  function onResult(isCorrect: boolean) {
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      playSound("correct");
    } else {
      playSound("wrong");
    }
    setTimeout(() => {
      if (idx + 1 >= DIAGNOSTIKA.length) {
        setStage("result");
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
  }

  const score = useMemo(
    () => Math.round((correctCount / DIAGNOSTIKA.length) * 100),
    [correctCount],
  );

  function finish() {
    const phase = phaseFromDiag(score);
    applyDiagnostic(score, phase);
    playSound("xp");
    router.replace("/bosh");
  }

  return (
    <>
      <TopBar />
      <DeviceShell>
        <div className="px-5 pt-4 pb-10 min-h-[700px]">
          {/* progress bar */}
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] transition-all duration-500"
              style={{
                width: `${
                  stage === "result"
                    ? 100
                    : ((idx + 1) / DIAGNOSTIKA.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)] mt-3">
            <span>
              Diagnostika · {Math.min(idx + 1, DIAGNOSTIKA.length)} / {DIAGNOSTIKA.length}
            </span>
            <span>{score}%</span>
          </div>

          <AnimatePresence mode="wait">
            {stage === "asking" ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <QuestionView q={q} onResult={onResult} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                <ResultView score={score} onFinish={finish} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DeviceShell>
    </>
  );
}

/* ============================================================
 * Question dispatcher
 * ============================================================ */

function QuestionView({
  q,
  onResult,
}: {
  q: DiagQ;
  onResult: (correct: boolean) => void;
}) {
  if (q.type === "order") return <OrderQuestion q={q} onResult={onResult} />;
  if (q.type === "choice") return <ChoiceQuestion q={q} onResult={onResult} />;
  return <FillQuestion q={q} onResult={onResult} />;
}

/* ============================================================
 * Order — drag-style sentence builder
 * ============================================================ */

function OrderQuestion({
  q,
  onResult,
}: {
  q: Extract<DiagQ, { type: "order" }>;
  onResult: (correct: boolean) => void;
}) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "correct" | "wrong">("idle");

  function pick(i: number) {
    if (placed.includes(i)) return;
    playSound("click");
    setPlaced((p) => [...p, i]);
  }
  function remove(slotIdx: number) {
    playSound("click");
    setPlaced((p) => p.filter((_, i) => i !== slotIdx));
  }

  function check() {
    const isCorrect =
      placed.length === q.answer.length &&
      placed.every((v, i) => v === q.answer[i]);
    setPhase(isCorrect ? "correct" : "wrong");
    onResult(isCorrect);
    setTimeout(() => setPhase("idle"), 800);
  }

  const chips = q.chips;
  const ready = placed.length === chips.length;

  return (
    <div className="mt-6">
      <h2 className="text-[20px] font-[var(--font-display)] font-bold leading-snug">
        {q.prompt}
      </h2>
      <div className="text-[12px] text-[var(--text-muted)] mt-1">{q.hint}</div>

      {/* Drop zone */}
      <div
        className={cn(
          "mt-6 rounded-2xl border-2 border-dashed min-h-[64px] p-3 flex flex-wrap gap-2 transition",
          phase === "correct" && "border-[var(--success)] bg-[var(--success)]/10",
          phase === "wrong" && "border-[var(--danger)] bg-[var(--danger)]/10 animate-shake",
          phase === "idle" && "border-white/15 bg-white/3",
        )}
      >
        {placed.length === 0 && (
          <span className="text-[12px] text-[var(--text-faint)] self-center mx-auto">
            So'zlarni shu yerga tartibda joylashtiring
          </span>
        )}
        {placed.map((chipIdx, slotIdx) => (
          <button
            key={`${chipIdx}-${slotIdx}`}
            onClick={() => remove(slotIdx)}
            className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#22d3a5]/30 to-[#00a3ff]/30 border border-white/15 text-sm font-medium"
          >
            {chips[chipIdx]}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((text, i) => {
          const used = placed.includes(i);
          return (
            <button
              key={i}
              disabled={used}
              onClick={() => pick(i)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium transition border",
                used
                  ? "bg-white/2 border-white/5 text-[var(--text-faint)] line-through cursor-not-allowed"
                  : "bg-white/5 border-white/12 hover:bg-white/10",
              )}
            >
              {text}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={check}
        className={cn(
          "mt-8 w-full h-12 rounded-full font-semibold transition",
          ready
            ? "bg-gradient-to-r from-[#22d3a5] to-[#00a3ff] text-white shadow-glow-cyan"
            : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed",
        )}
      >
        Tekshirish
      </button>
    </div>
  );
}

/* ============================================================
 * Multi-choice
 * ============================================================ */

function ChoiceQuestion({
  q,
  onResult,
}: {
  q: Extract<DiagQ, { type: "choice" }>;
  onResult: (correct: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function check() {
    if (pick == null) return;
    setRevealed(true);
    const isCorrect = pick === q.answer;
    onResult(isCorrect);
  }

  return (
    <div className="mt-6">
      <h2 className="text-[20px] font-[var(--font-display)] font-bold leading-snug">
        {q.prompt}
      </h2>

      <div className="mt-5 space-y-2">
        {q.options.map((opt, i) => {
          const isPicked = pick === i;
          const isAnswer = i === q.answer;
          const tone = revealed
            ? isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "idle"
            : isPicked
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
                "w-full flex items-center gap-3 p-3 rounded-2xl border transition text-left",
                tone === "idle" && "bg-white/4 border-white/10 hover:border-white/20",
                tone === "picked" &&
                  "bg-[var(--brand-aqua)]/15 border-[var(--brand-aqua)]/60",
                tone === "correct" &&
                  "bg-[var(--success)]/15 border-[var(--success)]/60",
                tone === "wrong" &&
                  "bg-[var(--danger)]/15 border-[var(--danger)]/60",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center h-7 w-7 rounded-lg shrink-0 text-[12px] font-bold border",
                  tone === "idle" && "bg-white/5 border-white/15",
                  tone === "picked" &&
                    "bg-[var(--brand-aqua)] border-[var(--brand-aqua)] text-black",
                  tone === "correct" &&
                    "bg-[var(--success)] border-[var(--success)] text-black",
                  tone === "wrong" &&
                    "bg-[var(--danger)] border-[var(--danger)] text-white",
                )}
              >
                {tone === "correct" ? (
                  <Check size={14} />
                ) : tone === "wrong" ? (
                  <X size={14} />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-[14px] flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/4 text-[12px] text-[var(--text-soft)]">
          💡 {q.explain}
        </div>
      )}

      <button
        type="button"
        disabled={pick == null || revealed}
        onClick={check}
        className={cn(
          "mt-6 w-full h-12 rounded-full font-semibold transition",
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

/* ============================================================
 * Fill blank
 * ============================================================ */

function FillQuestion({
  q,
  onResult,
}: {
  q: Extract<DiagQ, { type: "fill" }>;
  onResult: (correct: boolean) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function check() {
    if (pick == null) return;
    setRevealed(true);
    onResult(pick === q.answer);
  }

  return (
    <div className="mt-6">
      <h2 className="text-[20px] font-[var(--font-display)] font-bold leading-snug">
        {q.prompt}
      </h2>

      <div className="mt-6 p-5 rounded-2xl bg-white/4 border border-white/10 text-center text-[17px] font-medium">
        <span className="text-[var(--text-soft)]">{q.before}</span>{" "}
        <span
          className={cn(
            "inline-block min-w-[120px] px-3 py-1 mx-1 rounded-xl border-2 border-dashed",
            pick != null
              ? "border-[var(--brand-aqua)] text-white"
              : "border-white/20 text-[var(--text-faint)]",
          )}
        >
          {pick != null ? q.options[pick] : "____"}
        </span>{" "}
        <span className="text-[var(--text-soft)]">{q.after}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {q.options.map((opt, i) => {
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
                "px-3 py-2 rounded-xl text-sm border transition",
                tone === "idle" && "bg-white/4 border-white/10 hover:border-white/20",
                tone === "picked" &&
                  "bg-[var(--brand-aqua)]/15 border-[var(--brand-aqua)]/60",
                tone === "correct" &&
                  "bg-[var(--success)]/15 border-[var(--success)]/60",
                tone === "wrong" &&
                  "bg-[var(--danger)]/15 border-[var(--danger)]/60",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/4 text-[12px] text-[var(--text-soft)]">
          💡 {q.explain}
        </div>
      )}

      <button
        type="button"
        disabled={pick == null || revealed}
        onClick={check}
        className={cn(
          "mt-6 w-full h-12 rounded-full font-semibold transition",
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

/* ============================================================
 * Result
 * ============================================================ */

function ResultView({
  score,
  onFinish,
}: {
  score: number;
  onFinish: () => void;
}) {
  const msg = messageFromDiag(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="mt-8 text-center">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3a5" />
              <stop offset="50%" stopColor="#00a3ff" />
              <stop offset="100%" stopColor="#6c8cff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <div className="text-[36px] font-bold text-grad-cyan leading-none">
              {score}%
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mt-1">
              ona tili
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-[24px] font-[var(--font-display)] font-bold">
        {msg.title}
      </h2>
      <p className="text-[var(--text-muted)] text-sm mt-2 max-w-xs mx-auto">
        {msg.body}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/10 text-[12px]">
        <Sparkles size={12} className="text-[var(--brand-aqua)]" />
        Boshlang'ich nuqta:{" "}
        <strong className="text-white">
          {score >= 90 ? "Daryo 🏞️" : score >= 60 ? "Buloq 🌿" : "Ko'lmak 💧"}
        </strong>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="mt-8 mx-auto block w-full max-w-xs h-12 rounded-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] text-white font-semibold shadow-glow-cyan"
      >
        <span className="inline-flex items-center gap-2">
          Sayohatni boshlash <ArrowRight size={16} />
        </span>
      </button>
    </div>
  );
}

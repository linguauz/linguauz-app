"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Equal,
  Check,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/shell/TopBar";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

type StepId = "salom" | "sabab" | "usul" | "hisob";

const STEPS: StepId[] = ["salom", "sabab", "usul", "hisob"];

const STAGES = [
  { emoji: "💧", label: "Ko'lmak", tone: "#22d3a5" },
  { emoji: "🌿", label: "Buloq", tone: "#00b39d" },
  { emoji: "🏞️", label: "Daryo", tone: "#00a3ff" },
  { emoji: "🐋", label: "Dengiz", tone: "#6c8cff" },
  { emoji: "🌍", label: "Okean", tone: "#f6c46e" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const finishOnboarding = usePoydevor((s) => s.finishOnboarding);

  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function next() {
    playSound("click");
    if (isLast) return startJourney();
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    playSound("click");
    setIndex((i) => Math.max(i - 1, 0));
  }

  function startJourney() {
    if (!emailValid) return;
    const finalName = name.trim() || "Sayohatchi";
    finishOnboarding({ name: finalName, email: email.trim().toLowerCase() });
    playSound("xp");
    router.replace("/diagnostika");
  }

  const canAdvance = step === "hisob" ? emailValid : true;

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col pt-14">
      <TopBar />
      {/* Content area */}
      <div className="flex-1 grid place-items-center px-6 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* LEFT — visual */}
              <div className="hidden lg:grid place-items-center min-h-[420px]">
                <Visual step={step} />
              </div>

              {/* RIGHT — content */}
              <div className="max-w-xl">
                {step === "salom" && <Salom n={index} />}
                {step === "sabab" && <Sabab n={index} />}
                {step === "usul" && <Usul n={index} />}
                {step === "hisob" && (
                  <Hisob
                    n={index}
                    name={name}
                    email={email}
                    emailValid={emailValid}
                    onName={setName}
                    onEmail={setEmail}
                    onSubmit={startJourney}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-6 sm:px-10 lg:px-16 pb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Dots count={STEPS.length} active={index} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={back}
              disabled={index === 0}
              className={cn(
                "h-12 px-6 rounded-full border border-white/12 text-white/90 font-semibold transition inline-flex items-center gap-2",
                index === 0
                  ? "opacity-35 pointer-events-none"
                  : "hover:bg-white/8 bg-white/[0.03]",
              )}
            >
              <ArrowLeft size={16} /> Orqaga
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className={cn(
                "h-12 px-7 rounded-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] text-white font-semibold shadow-glow-cyan active:scale-[0.98] transition inline-flex items-center gap-2",
                !canAdvance && "opacity-40 pointer-events-none active:scale-100",
              )}
            >
              {isLast ? "Boshlash" : "Davom etish"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
 * Eyebrow — "01 · SALOM!"
 * ============================================================ */
function Eyebrow({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-[12px] font-semibold tracking-[0.32em] text-[var(--brand-aqua)] uppercase">
      0{n + 1} <span className="text-white/25">·</span> {label}
    </div>
  );
}

/* ============================================================
 * RIGHT-side content blocks
 * ============================================================ */
function Salom({ n }: { n: number }) {
  return (
    <div>
      <Eyebrow n={n} label="Salom!" />
      <h1 className="mt-4 text-[40px] sm:text-[52px] leading-[1.02] font-[var(--font-display)] font-extrabold">
        Poydevor —<br />
        <span className="text-grad-cyan">ona tilingni bil</span>
      </h1>
      <p className="mt-5 text-[17px] leading-relaxed text-[var(--text-soft)] max-w-md">
        O&apos;zbek tilini chuqur o&apos;rganing. Har bir mavzu —
        daryongizdagi yana bir tosh.{" "}
        <span className="font-semibold text-white">Ko&apos;lmakdan Okeangacha.</span>
      </p>

      <div className="mt-7 flex items-center gap-3">
        {STAGES.map((s) => (
          <span
            key={s.label}
            title={s.label}
            className="grid place-items-center h-11 w-11 rounded-2xl text-lg"
            style={{
              background: `color-mix(in oklab, ${s.tone} 16%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${s.tone} 45%, transparent)`,
            }}
          >
            {s.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

function Sabab({ n }: { n: number }) {
  return (
    <div>
      <Eyebrow n={n} label="Sabab" />
      <h2 className="mt-4 text-[36px] sm:text-[44px] leading-[1.05] font-[var(--font-display)] font-extrabold">
        Ona tili —<br />poydevor
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <FaceCard
          tone="rgba(239,68,68,0.45)"
          emoji="😵"
          text="Predlog? Tense? Artikl?"
        />
        <FaceCard
          tone="rgba(34,211,165,0.55)"
          emoji="💪"
          text="Kelishik bilaman → Predlog tushunaman"
        />
      </div>

      <p className="mt-6 text-[16px] leading-relaxed text-[var(--text-soft)] max-w-md">
        Ona tilini puxta bilgan odam istalgan chet tilini tez o&apos;rganadi.
        Tushunchalar miyada allaqachon bor.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full px-4 h-9 text-[13px] font-semibold text-[var(--success)] bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)]">
        <Check size={15} /> 91% foydalanuvchi tasdiqladi
      </div>
    </div>
  );
}

function Usul({ n }: { n: number }) {
  const items = [
    { c: "var(--g-ega)", t: "Rangli grammatika", d: "EGA, KESIM, to'ldiruvchi — har biri o'z rangida." },
    { c: "var(--g-kesim)", t: "Dars → Mashq", d: "Avval tushuntirish, so'ng 5 xil savol turi." },
    { c: "var(--g-toldiruvchi)", t: "Daryo xaritasi", d: "16 tosh, 5 bosqich — qadam-baqadam ochiladi." },
  ];
  return (
    <div>
      <Eyebrow n={n} label="Usul" />
      <h2 className="mt-4 text-[36px] sm:text-[44px] leading-[1.05] font-[var(--font-display)] font-extrabold">
        Qanday<br />
        <span className="text-grad-cyan">ishlaydi?</span>
      </h2>
      <div className="mt-7 space-y-4">
        {items.map((it) => (
          <div key={it.t} className="flex items-start gap-3">
            <span
              className="mt-1 h-3 w-3 rounded-full shrink-0"
              style={{ background: it.c, boxShadow: `0 0 16px ${it.c}` }}
            />
            <div>
              <div className="font-semibold text-[16px]">{it.t}</div>
              <div className="text-[14px] text-[var(--text-muted)]">{it.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hisob({
  n,
  name,
  email,
  emailValid,
  onName,
  onEmail,
  onSubmit,
}: {
  n: number;
  name: string;
  email: string;
  emailValid: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <Eyebrow n={n} label="Hisob" />
      <h2 className="mt-4 text-[36px] sm:text-[44px] leading-[1.05] font-[var(--font-display)] font-extrabold">
        Hisobingizni<br />yarating 👋
      </h2>
      <p className="mt-4 text-[15px] text-[var(--text-muted)]">
        Email orqali kiring — natijalaringiz shu hisobga bog&apos;lanadi.
      </p>

      <label className="block mt-7">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
          Email manzilingiz
        </span>
        <input
          autoFocus
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="ism@email.com"
          className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/12 focus:border-[var(--brand-aqua)] focus:bg-white/10 outline-none text-[16px] transition"
        />
        {email.length > 0 && !emailValid && (
          <span className="mt-1.5 block text-[11px] text-[var(--danger)]">
            To&apos;g&apos;ri email manzil kiriting.
          </span>
        )}
      </label>

      <label className="block mt-4">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
          Sizning ismingiz
        </span>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Masalan: Jasur"
          className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/12 focus:border-[var(--brand-aqua)] focus:bg-white/10 outline-none text-[16px] transition"
        />
      </label>
    </div>
  );
}

/* ============================================================
 * LEFT-side visuals
 * ============================================================ */
function Visual({ step }: { step: StepId }) {
  if (step === "sabab") return <PathVisual />;
  if (step === "usul") return <RiverVisual />;
  return <LogoVisual />;
}

function LogoVisual() {
  return (
    <div className="relative grid place-items-center">
      {[420, 320, 220].map((s, i) => (
        <span
          key={s}
          className="absolute rounded-full border border-white/8"
          style={{ height: s, width: s, opacity: 0.7 - i * 0.15 }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid place-items-center h-32 w-32 rounded-[28px] bg-gradient-to-br from-[#3b82f6] via-[#6c8cff] to-[#a855f7] shadow-glow-cyan"
      >
        <Equal size={56} className="text-white" strokeWidth={3} />
      </motion.div>
    </div>
  );
}

function PathVisual() {
  return (
    <div className="relative h-[280px] w-full max-w-sm grid place-items-center">
      <svg viewBox="0 0 320 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="pathg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <path
          d="M 70 130 C 130 60, 190 60, 250 100"
          fill="none"
          stroke="url(#pathg)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 12"
        />
      </svg>
      <span className="absolute left-[60px] top-1/2 grid place-items-center h-16 w-16 rounded-full bg-[var(--danger)] text-white shadow-lg">
        <HelpCircle size={30} />
      </span>
      <span className="absolute right-[40px] top-[40%] grid place-items-center h-16 w-16 rounded-full bg-[var(--success)] text-white shadow-lg">
        <Check size={30} strokeWidth={3} />
      </span>
    </div>
  );
}

function RiverVisual() {
  return (
    <div className="relative grid place-items-center gap-3">
      {[420, 300].map((s, i) => (
        <span
          key={s}
          className="absolute rounded-full border border-white/8"
          style={{ height: s, width: s, opacity: 0.6 - i * 0.2 }}
        />
      ))}
      <div className="flex flex-col items-center gap-2">
        {STAGES.map((s, i) => (
          <motion.span
            key={s.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="grid place-items-center h-14 w-14 rounded-2xl text-2xl"
            style={{
              background: `color-mix(in oklab, ${s.tone} 18%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${s.tone} 50%, transparent)`,
              marginLeft: i % 2 ? 56 : -56,
            }}
          >
            {s.emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Small building blocks
 * ============================================================ */
function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === active
              ? "w-7 bg-[var(--brand-aqua)]"
              : "w-1.5 bg-white/15",
          )}
        />
      ))}
    </div>
  );
}

function FaceCard({
  emoji,
  text,
  tone,
}: {
  emoji: string;
  text: string;
  tone: string;
}) {
  return (
    <div
      className="glass rounded-2xl p-4"
      style={{ boxShadow: `inset 0 0 0 1px ${tone}` }}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="mt-2 text-[13px] font-semibold leading-snug text-[var(--text-soft)]">
        {text}
      </div>
    </div>
  );
}


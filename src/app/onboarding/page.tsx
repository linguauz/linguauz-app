"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sprout,
  GraduationCap,
  Sparkles,
  Waves,
  Droplets,
  Mountain,
  Globe2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/shell/TopBar";
import { DeviceShell } from "@/components/shell/DeviceShell";
import { usePoydevor } from "@/store/usePoydevor";
import type { Mode } from "@/data/types";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

type Step = "intro" | "promise" | "mode" | "name";

const STAGES = [
  { icon: Droplets, label: "Ko'lmak", tone: "#22d3a5" },
  { icon: Waves, label: "Buloq", tone: "#00b39d" },
  { icon: Mountain, label: "Daryo", tone: "#00a3ff" },
  { icon: Waves, label: "Dengiz", tone: "#6c8cff" },
  { icon: Globe2, label: "Okean", tone: "#f6c46e" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const finishOnboarding = usePoydevor((s) => s.finishOnboarding);

  const [step, setStep] = useState<Step>("intro");
  const [mode, setMode] = useState<Mode>("junior");
  const [name, setName] = useState("");

  function next() {
    playSound("click");
    if (step === "intro") return setStep("promise");
    if (step === "promise") return setStep("mode");
    if (step === "mode") return setStep("name");
  }

  function back() {
    playSound("click");
    if (step === "promise") return setStep("intro");
    if (step === "mode") return setStep("promise");
    if (step === "name") return setStep("mode");
  }

  function startJourney() {
    const finalName = name.trim() || "Sayohatchi";
    finishOnboarding({ name: finalName, mode });
    playSound("xp");
    router.replace("/diagnostika");
  }

  return (
    <>
      <TopBar />
      <DeviceShell>
        <div className="relative">
          {/* Soft floating chips background */}
          <FloatingChipsBg />

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {(["intro", "promise", "mode", "name"] as Step[]).map((s) => (
              <span
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  step === s ? "w-8 bg-[var(--brand-aqua)]" : "w-1.5 bg-white/15",
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "intro" && (
              <StepShell key="intro">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {STAGES.map(({ icon: Icon, tone }, i) => (
                    <span
                      key={i}
                      className="grid place-items-center h-9 w-9 rounded-full"
                      style={{
                        background: `color-mix(in oklab, ${tone} 28%, transparent)`,
                        boxShadow: `0 0 24px color-mix(in oklab, ${tone} 35%, transparent)`,
                      }}
                    >
                      <Icon size={14} style={{ color: tone }} />
                    </span>
                  ))}
                </div>

                <h1 className="text-[34px] leading-[1.05] font-[var(--font-display)] font-bold text-center text-grad-cyan">
                  Ko'lmakdan
                  <br />
                  Okeangacha
                </h1>
                <p className="text-center text-[var(--text-soft)] mt-3 max-w-xs mx-auto">
                  Ona tilingni chuqur o'rgan — har qanday tilni zabt etishga
                  tayyor bo'l.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/30 text-[12px] text-[var(--success)] font-semibold">
                  <Sparkles size={12} /> 91% foydalanuvchi tasdiqladi
                </div>

                <PrimaryButton label="Davom etish" onClick={next} />
              </StepShell>
            )}

            {step === "promise" && (
              <StepShell key="promise">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)] text-center">
                  Nima uchun Poydevor?
                </div>
                <h2 className="text-[28px] leading-tight font-[var(--font-display)] font-bold text-center mt-2">
                  Ona tilini bilgan —
                  <br />
                  <span className="text-grad-cyan">tezroq o'rganadi</span>
                </h2>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <PromiseCard
                    tone="rgba(239,68,68,0.4)"
                    title="Boshqalar"
                    emoji="😵"
                    bullets={[
                      "Predlog nima?",
                      "Artikl nima?",
                      "Zamon nima?",
                    ]}
                    muted
                  />
                  <PromiseCard
                    tone="rgba(34,211,165,0.55)"
                    title="Bizniki"
                    emoji="💪"
                    bullets={[
                      "Kelishik orqali tushunaman",
                      "Aniqlik belgisi bilan",
                      "Zamon — o'tgan/hozir/kelasi",
                    ]}
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <SecondaryButton label="Orqaga" onClick={back} />
                  <PrimaryButton label="Davom etish" onClick={next} />
                </div>
              </StepShell>
            )}

            {step === "mode" && (
              <StepShell key="mode">
                <h2 className="text-[26px] leading-tight font-[var(--font-display)] font-bold text-center">
                  Qaysi sayohatni tanlaysiz?
                </h2>
                <p className="text-center text-[var(--text-muted)] text-sm mt-2">
                  Keyinroq profil sahifasida o'zgartirsangiz bo'ladi.
                </p>

                <div className="space-y-3 mt-6">
                  <ModeCard
                    selected={mode === "junior"}
                    onClick={() => {
                      setMode("junior");
                      playSound("click");
                    }}
                    icon={<Sprout size={20} />}
                    title="Junior"
                    subtitle="O'yin, XP, yuraklar va animatsiyalar bilan"
                    color="#22d3a5"
                    badge="Gamification"
                  />
                  <ModeCard
                    selected={mode === "senior"}
                    onClick={() => {
                      setMode("senior");
                      playSound("click");
                    }}
                    icon={<GraduationCap size={20} />}
                    title="Senior"
                    subtitle="Soddа, akademik va shovqinsiz"
                    color="#6c8cff"
                    badge="Professional"
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <SecondaryButton label="Orqaga" onClick={back} />
                  <PrimaryButton label="Davom etish" onClick={next} />
                </div>
              </StepShell>
            )}

            {step === "name" && (
              <StepShell key="name">
                <h2 className="text-[28px] leading-tight font-[var(--font-display)] font-bold text-center">
                  Ismingizni kiriting 👋
                </h2>
                <p className="text-center text-[var(--text-muted)] text-sm mt-2">
                  Sayohatda doim sizga shu nomda murojaat qilamiz.
                </p>

                <label className="block mt-8">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Sizning ismingiz
                  </span>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startJourney();
                    }}
                    placeholder="Masalan: Jasur"
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/12 focus:border-[var(--brand-aqua)] focus:bg-white/10 outline-none text-[16px] transition"
                  />
                </label>

                <div className="flex gap-3 mt-8">
                  <SecondaryButton label="Orqaga" onClick={back} />
                  <PrimaryButton label="Boshlash" onClick={startJourney} />
                </div>
              </StepShell>
            )}
          </AnimatePresence>
        </div>
      </DeviceShell>
    </>
  );
}

/* ============================================================
 * Small building blocks
 * ============================================================ */

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="px-6 pt-8 pb-10 relative"
    >
      {children}
    </motion.div>
  );
}

function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 mx-auto block w-full max-w-xs h-12 rounded-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] text-white font-semibold shadow-glow-cyan active:scale-[0.98] transition"
    >
      <span className="inline-flex items-center gap-2">
        {label} <ArrowRight size={16} />
      </span>
    </button>
  );
}

function SecondaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 rounded-full bg-white/5 border border-white/10 text-white/90 font-semibold hover:bg-white/10 transition"
    >
      {label}
    </button>
  );
}

function PromiseCard({
  title,
  emoji,
  bullets,
  tone,
  muted,
}: {
  title: string;
  emoji: string;
  bullets: string[];
  tone: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-3 text-left",
        muted && "opacity-80",
      )}
      style={{ boxShadow: `inset 0 0 0 1px ${tone}` }}
    >
      <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {title}
      </div>
      <div className="text-2xl mt-1">{emoji}</div>
      <ul className="space-y-1 mt-2">
        {bullets.map((b) => (
          <li key={b} className="text-[12px] text-[var(--text-soft)]">
            • {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModeCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
  color,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  badge: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-2xl transition border",
        selected
          ? "border-transparent"
          : "border-white/10 hover:border-white/20",
      )}
      style={
        selected
          ? {
              background: `linear-gradient(135deg, color-mix(in oklab, ${color} 22%, rgba(10,22,40,0.6)), rgba(10,22,40,0.6))`,
              boxShadow: `0 0 0 2px ${color}, 0 0 32px color-mix(in oklab, ${color} 40%, transparent)`,
            }
          : { background: "rgba(255,255,255,0.04)" }
      }
    >
      <div className="flex items-start gap-3">
        <div
          className="grid place-items-center h-10 w-10 rounded-xl shrink-0"
          style={{ background: `color-mix(in oklab, ${color} 26%, transparent)`, color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-display)] font-bold text-base">
              {title}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ color, background: `color-mix(in oklab, ${color} 18%, transparent)` }}
            >
              {badge}
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-snug">
            {subtitle}
          </p>
        </div>
        <span
          className={cn(
            "h-5 w-5 rounded-full border-2 transition",
            selected ? "bg-white border-white" : "border-white/30",
          )}
        />
      </div>
    </button>
  );
}

function FloatingChipsBg() {
  const items = [
    { text: "Ega", color: "#3b82f6", x: 10, y: 30, delay: 0 },
    { text: "Kesim", color: "#ef4444", x: 78, y: 18, delay: 0.8 },
    { text: "Aniqlovchi", color: "#f59e0b", x: 75, y: 70, delay: 1.4 },
    { text: "Ravish", color: "#a855f7", x: 8, y: 78, delay: 2 },
    { text: "Hol", color: "#06b6d4", x: 45, y: 85, delay: 1.1 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.text}
          className="absolute animate-float-slow text-[11px] font-semibold rounded-full px-2.5 py-1"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            color: it.color,
            background: `color-mix(in oklab, ${it.color} 18%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${it.color} 45%, transparent)`,
            animationDelay: `${it.delay}s`,
          }}
        >
          {it.text}
        </span>
      ))}
    </div>
  );
}

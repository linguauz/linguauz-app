"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Waves,
  Droplets,
  Mountain,
  Globe2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/shell/TopBar";
import { DeviceShell } from "@/components/shell/DeviceShell";
import { usePoydevor } from "@/store/usePoydevor";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

type Step = "intro" | "promise" | "name";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function next() {
    playSound("click");
    if (step === "intro") return setStep("promise");
    if (step === "promise") return setStep("name");
  }

  function back() {
    playSound("click");
    if (step === "promise") return setStep("intro");
    if (step === "name") return setStep("promise");
  }

  function startJourney() {
    if (!emailValid) return;
    const finalName = name.trim() || "Sayohatchi";
    finishOnboarding({ name: finalName, email: email.trim().toLowerCase() });
    playSound("xp");
    router.replace("/diagnostika");
  }

  return (
    <>
      <TopBar />
      <DeviceShell>
        <div className="relative">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {(["intro", "promise", "name"] as Step[]).map((s) => (
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

                <div className="flex items-center gap-3 mt-8">
                  <SecondaryButton label="Orqaga" onClick={back} />
                  <PrimaryButton label="Davom etish" onClick={next} className="" />
                </div>
              </StepShell>
            )}

            {step === "name" && (
              <StepShell key="name">
                <h2 className="text-[28px] leading-tight font-[var(--font-display)] font-bold text-center">
                  Hisobingizni yarating 👋
                </h2>
                <p className="text-center text-[var(--text-muted)] text-sm mt-2">
                  Email orqali kiring — natijalaringiz shu hisobga bog'lanadi.
                </p>

                <label className="block mt-8">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Email manzilingiz
                  </span>
                  <input
                    autoFocus
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startJourney();
                    }}
                    placeholder="ism@email.com"
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/12 focus:border-[var(--brand-aqua)] focus:bg-white/10 outline-none text-[16px] transition"
                  />
                  {email.length > 0 && !emailValid && (
                    <span className="mt-1.5 block text-[11px] text-[var(--danger)]">
                      To'g'ri email manzil kiriting.
                    </span>
                  )}
                </label>

                <label className="block mt-4">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Sizning ismingiz
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startJourney();
                    }}
                    placeholder="Masalan: Jasur"
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/12 focus:border-[var(--brand-aqua)] focus:bg-white/10 outline-none text-[16px] transition"
                  />
                </label>

                <div className="flex items-center gap-3 mt-8">
                  <SecondaryButton label="Orqaga" onClick={back} />
                  <PrimaryButton
                    label="Boshlash"
                    onClick={startJourney}
                    disabled={!emailValid}
                    className=""
                  />
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
  disabled,
  className = "mt-8 mx-auto block max-w-xs",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-12 rounded-full bg-gradient-to-r from-[#22d3a5] via-[#00a3ff] to-[#6c8cff] text-white font-semibold shadow-glow-cyan active:scale-[0.98] transition grid place-items-center",
        className,
        disabled && "opacity-40 pointer-events-none active:scale-100",
      )}
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

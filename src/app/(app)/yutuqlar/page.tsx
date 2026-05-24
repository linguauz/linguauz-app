"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Share2,
  Download,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { BADGES } from "@/data/badges";
import { usePoydevor, useLevel } from "@/store/usePoydevor";
import { PHASES } from "@/data/curriculum";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/cn";

type Tab = "badges" | "cert";

export default function YutuqlarPage() {
  const earned = usePoydevor((s) => s.earnedBadges);
  const completed = usePoydevor((s) => s.completedStoneIds);
  const name = usePoydevor((s) => s.name) || "Sayohatchi";
  const stoneScores = usePoydevor((s) => s.stoneScores);
  const level = useLevel();

  const [tab, setTab] = useState<Tab>("badges");

  const phase1Done = useMemo(
    () => PHASES[0].stoneIds.every((id) => completed.includes(id)),
    [completed],
  );

  const avgScore = useMemo(() => {
    const vals = Object.values(stoneScores);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [stoneScores]);

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <PageHeader
        eyebrow="Yutuqlar"
        title={
          <>
            Sizning <span className="text-grad-warm">trofeylaringiz</span>
          </>
        }
        subtitle={`${earned.length} / ${BADGES.length} badge · ${phase1Done ? "Sertifikat tayyor" : "Phase 1 ni tugating va sertifikat oching"}`}
        right={
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
            <TabBtn active={tab === "badges"} onClick={() => setTab("badges")}>
              Badgelar
            </TabBtn>
            <TabBtn active={tab === "cert"} onClick={() => setTab("cert")}>
              Sertifikat
            </TabBtn>
          </div>
        }
      />

      {tab === "badges" ? (
        <BadgeGrid earned={earned} />
      ) : (
        <CertificateView
          name={name}
          unlocked={phase1Done}
          avg={avgScore}
          completedCount={completed.length}
          level={level.title}
        />
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 px-4 rounded-full text-[13px] font-semibold transition",
        active
          ? "bg-gradient-to-br from-[#ff8a4c] to-[#ffb800] text-black"
          : "text-[var(--text-soft)] hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function BadgeGrid({ earned }: { earned: string[] }) {
  return (
    <div>
      <div className="text-[12px] text-[var(--text-muted)] mb-3">
        {earned.length} / {BADGES.length} badge olindi
      </div>
      <div className="grid grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 gap-3">
        {BADGES.map((b) => {
          const isOn = earned.includes(b.id);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl p-3 @md:p-4 border text-center relative overflow-hidden min-w-0",
                isOn
                  ? "border-white/15 bg-white/4"
                  : "border-white/8 bg-white/2 opacity-65",
              )}
              style={
                isOn
                  ? {
                      boxShadow: `0 0 30px -6px color-mix(in oklab, ${b.color} 35%, transparent)`,
                    }
                  : undefined
              }
            >
              <div
                className={cn(
                  "mx-auto h-14 w-14 grid place-items-center rounded-full text-2xl",
                  !isOn && "grayscale blur-[1px]",
                )}
                style={
                  isOn
                    ? {
                        background: `color-mix(in oklab, ${b.color} 25%, transparent)`,
                        boxShadow: `inset 0 0 0 2px color-mix(in oklab, ${b.color} 60%, transparent)`,
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                      }
                }
              >
                {b.emoji}
              </div>
              <div className="mt-2 font-[var(--font-display)] font-bold text-[12px] @md:text-[13px] leading-tight break-words">
                {b.name}
              </div>
              <div className="hidden @md:block text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                {b.description}
              </div>
              {isOn ? (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={10} /> Olindi
                </div>
              ) : (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] text-[10px]">
                  <Lock size={10} /> {b.unlock}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CertificateView({
  name,
  unlocked,
  avg,
  completedCount,
  level,
}: {
  name: string;
  unlocked: boolean;
  avg: number;
  completedCount: number;
  level: string;
}) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const code = `PDV-${Math.abs(
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  )
    .toString()
    .padStart(4, "0")}`;

  return (
    <div className="grid @3xl:grid-cols-[1.7fr_1fr] gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative rounded-3xl p-5 @3xl:p-8 border-2 overflow-hidden",
          unlocked ? "border-[var(--gold)]/40" : "border-white/10",
        )}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,184,0,0.16), rgba(168,85,247,0.1)), rgba(10,18,32,0.85)",
          boxShadow: unlocked
            ? "0 30px 80px -20px rgba(255,184,0,0.3)"
            : undefined,
        }}
      >
        {/* Decorative corners */}
        {["tl", "tr", "bl", "br"].map((pos) => (
          <span
            key={pos}
            className="absolute h-8 w-8 border-[var(--gold)]"
            style={{
              top: pos.startsWith("t") ? 16 : undefined,
              bottom: pos.startsWith("b") ? 16 : undefined,
              left: pos.endsWith("l") ? 16 : undefined,
              right: pos.endsWith("r") ? 16 : undefined,
              borderWidth: 2,
              borderRadius: 4,
              borderTopWidth: pos.startsWith("t") ? 2 : 0,
              borderBottomWidth: pos.startsWith("b") ? 2 : 0,
              borderLeftWidth: pos.endsWith("l") ? 2 : 0,
              borderRightWidth: pos.endsWith("r") ? 2 : 0,
              opacity: 0.7,
            }}
          />
        ))}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] text-[11px] uppercase tracking-[0.2em] font-bold">
            <Award size={12} /> Poydevor Sertifikati
          </div>
          <div className="mt-5 text-[var(--text-muted)] text-[11px] uppercase tracking-[0.18em]">
            Quyidagi shaxsga beriladi
          </div>
          <div className="mt-2 font-[var(--font-display)] font-bold text-[24px] @md:text-[28px] @3xl:text-[32px] text-grad-warm break-words">
            {name}
          </div>
          <div className="mt-3 text-[var(--text-soft)] text-[13px] @3xl:text-[15px]">
            O'zbek Ona Tili — Ko'lmak Bosqichini muvaffaqiyatli yakunladi
          </div>

          <div className="mt-6 grid grid-cols-1 @md:grid-cols-3 gap-3 text-left">
            <Metric label="Umumiy ball" value={`${avg}%`} />
            <Metric label="Tugatilgan tosh" value={`${completedCount}/16`} />
            <Metric label="Daraja" value={level} />
          </div>

          <div className="mt-7 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>{dateStr}</span>
            <span className="font-mono">{code}</span>
          </div>
        </div>

        {!unlocked && (
          <div className="absolute inset-0 grid place-items-center backdrop-blur-[2px] bg-black/30 rounded-3xl">
            <div className="px-4 py-3 rounded-2xl bg-white/8 border border-white/15 text-center max-w-xs">
              <Lock className="mx-auto" size={20} />
              <div className="mt-1 font-semibold">
                Phase 1 ni tugatib sertifikat oching
              </div>
              <div className="text-[12px] text-[var(--text-muted)] mt-1">
                Sertifikatda ismingiz, ballaringiz va kod chiqadi.
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-3">
        <button
          type="button"
          disabled={!unlocked}
          className={cn(
            "w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2 transition",
            unlocked
              ? "bg-gradient-to-r from-[#ff8a4c] to-[#ffb800] text-black"
              : "bg-white/5 text-[var(--text-faint)] cursor-not-allowed",
          )}
        >
          <Share2 size={16} /> Ulashish
        </button>
        <button
          type="button"
          disabled={!unlocked}
          className={cn(
            "w-full h-12 rounded-full border font-semibold flex items-center justify-center gap-2 transition",
            unlocked
              ? "border-white/15 bg-white/4 hover:bg-white/10"
              : "border-white/8 bg-white/2 text-[var(--text-faint)] cursor-not-allowed",
          )}
        >
          <Download size={16} /> Yuklab olish
        </button>

        <div className="glass rounded-2xl p-4 text-[12px] text-[var(--text-soft)]">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[var(--brand-aqua)]" /> Maslahat
          </div>
          Sertifikat har bir bosqich uchun alohida ochiladi. Hammasini olganingizda
          umumiy "Poydevor Mukammal" sertifikati paydo bo'ladi.
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/4 border border-white/10 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {label}
      </div>
      <div className="mt-1 font-[var(--font-display)] font-bold text-base">
        {value}
      </div>
    </div>
  );
}

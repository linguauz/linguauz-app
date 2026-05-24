"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flame,
  Sparkles,
  BookMarked,
  Trophy,
  Volume2,
  VolumeX,
  Sprout,
  GraduationCap,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { usePoydevor, useLevel } from "@/store/usePoydevor";
import { STONES } from "@/data/curriculum";
import { BADGES } from "@/data/badges";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/cn";
import { playSound } from "@/lib/sound";

export default function ProfilPage() {
  const router = useRouter();
  const name = usePoydevor((s) => s.name) || "Sayohatchi";
  const mode = usePoydevor((s) => s.mode);
  const avatarColor = usePoydevor((s) => s.avatarColor);
  const xp = usePoydevor((s) => s.xp);
  const streak = usePoydevor((s) => s.streak);
  const completed = usePoydevor((s) => s.completedStoneIds);
  const earnedBadges = usePoydevor((s) => s.earnedBadges);
  const useSound = usePoydevor((s) => s.useSound);
  const toggleSound = usePoydevor((s) => s.toggleSound);
  const setMode = usePoydevor((s) => s.setMode);
  const reset = usePoydevor((s) => s.reset);
  const level = useLevel();

  function switchMode(next: typeof mode) {
    if (next === mode) return;
    setMode(next);
    playSound("click");
  }

  return (
    <div className="space-y-5 @4xl:space-y-6">
      <PageHeader
        eyebrow="Profil"
        title={
          <>
            Sozlamalar va <span className="text-grad-ocean">statistika</span>
          </>
        }
        subtitle={
          <>
            Sayohatchi · Level {level.level} · {level.title}
          </>
        }
      />

      <ProfileHero
        name={name}
        avatarColor={avatarColor}
        level={level.level}
        title={level.title}
        progress={level.progress}
        mode={mode}
      />

      <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame size={16} />}
          label="Streak"
          value={streak.toString()}
          unit="kun"
          tone="#ff8a4c"
        />
        <StatCard
          icon={<Sparkles size={16} />}
          label="XP"
          value={xp.toString()}
          unit="ball"
          tone="#22d3a5"
        />
        <StatCard
          icon={<BookMarked size={16} />}
          label="Tugatilgan"
          value={completed.length.toString()}
          unit={`/${STONES.length}`}
          tone="#00a3ff"
        />
        <StatCard
          icon={<Trophy size={16} />}
          label="Badgelar"
          value={earnedBadges.length.toString()}
          unit={`/${BADGES.length}`}
          tone="#ffb800"
        />
      </div>

      <div className="grid @2xl:grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Rejim
          </div>
          <div className="font-[var(--font-display)] font-bold mb-3">
            Sayohat uslubi
          </div>
          <div className="space-y-2">
            <ModeRow
              active={mode === "junior"}
              onClick={() => switchMode("junior")}
              icon={<Sprout size={16} />}
              title="Junior"
              subtitle="Yuraklar, XP, animatsiyalar"
              tone="#22d3a5"
            />
            <ModeRow
              active={mode === "senior"}
              onClick={() => switchMode("senior")}
              icon={<GraduationCap size={16} />}
              title="Senior"
              subtitle="Sodda, akademik, shovqinsiz"
              tone="#6c8cff"
            />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-3">
            Almashtirsangiz XP saqlanadi, faqat ko'rinish o'zgaradi.
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Sozlamalar
          </div>
          <div className="font-[var(--font-display)] font-bold mb-3">
            Tezkor amallar
          </div>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              playSound("click");
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/10 hover:bg-white/8 transition"
          >
            {useSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <div className="flex-1 text-left">
              <div className="text-[13px] font-semibold">Ovoz effektlari</div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {useSound ? "Yoqilgan" : "O'chirilgan"}
              </div>
            </div>
            <span
              className={cn(
                "h-6 w-10 rounded-full p-0.5 transition flex",
                useSound ? "bg-[var(--brand-aqua)]" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full bg-white transition-transform",
                  useSound && "translate-x-4",
                )}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm("Sayohatni boshidan boshlaysizmi? Hamma natijalar o'chadi.")) {
                reset();
                router.replace("/onboarding");
              }
            }}
            className="mt-2 w-full flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/10 hover:bg-[var(--danger)]/15 hover:border-[var(--danger)]/40 transition"
          >
            <RotateCcw size={16} className="text-[var(--danger)]" />
            <div className="flex-1 text-left">
              <div className="text-[13px] font-semibold">Reset</div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Hamma narsani boshidan boshlang
              </div>
            </div>
            <LogOut size={14} className="text-white/40" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileHero({
  name,
  avatarColor,
  level,
  title,
  progress,
  mode,
}: {
  name: string;
  avatarColor: string;
  level: number;
  title: string;
  progress: number;
  mode: "junior" | "senior";
}) {
  return (
    <div className="relative rounded-3xl p-5 @3xl:p-6 border border-white/8 overflow-hidden glass-strong">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Animated level ring */}
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#avatarRing)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={2 * Math.PI * 44}
              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 44 * (1 - progress),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="avatarRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3a5" />
                <stop offset="60%" stopColor="#00a3ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div
            className="absolute inset-0 m-2 rounded-full grid place-items-center text-white text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${avatarColor}, #00a3ff)`,
            }}
          >
            {name.charAt(0).toUpperCase() || "P"}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Sayohatchi
          </div>
          <div className="font-[var(--font-display)] font-bold text-2xl truncate">
            {name}
          </div>
          <div className="text-[var(--text-soft)] text-[13px]">
            Level {level} · {title}
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                mode === "junior"
                  ? "bg-[#22d3a5]/15 text-[#22d3a5]"
                  : "bg-[#6c8cff]/15 text-[#6c8cff]",
              )}
            >
              {mode === "junior" ? "Junior" : "Senior"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeRow({
  active,
  onClick,
  icon,
  title,
  subtitle,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border transition text-left",
        active
          ? "border-transparent"
          : "border-white/10 hover:border-white/20",
      )}
      style={
        active
          ? {
              background: `linear-gradient(135deg, color-mix(in oklab, ${tone} 20%, rgba(10,18,32,0.6)), rgba(10,18,32,0.6))`,
              boxShadow: `0 0 0 2px ${tone}, 0 0 24px color-mix(in oklab, ${tone} 30%, transparent)`,
            }
          : { background: "rgba(255,255,255,0.04)" }
      }
    >
      <span
        className="grid place-items-center h-9 w-9 rounded-lg"
        style={{
          background: `color-mix(in oklab, ${tone} 22%, transparent)`,
          color: tone,
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{subtitle}</div>
      </div>
      <span
        className={cn(
          "h-4 w-4 rounded-full border-2 transition",
          active ? "bg-white border-white" : "border-white/30",
        )}
      />
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  tone: string;
}) {
  return (
    <div className="glass rounded-2xl p-3 @md:p-4 flex items-center gap-2.5 min-w-0">
      <div
        className="grid place-items-center h-9 w-9 rounded-xl shrink-0"
        style={{
          background: `color-mix(in oklab, ${tone} 18%, transparent)`,
          color: tone,
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="font-[var(--font-display)] font-bold text-lg @md:text-xl leading-none">
            {value}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] leading-none">
            {unit}
          </span>
        </div>
        <div className="text-[9px] @md:text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] truncate mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

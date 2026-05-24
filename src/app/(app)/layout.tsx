"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/shell/TopBar";
import { DeviceShell } from "@/components/shell/DeviceShell";
import { Sidebar } from "@/components/shell/Sidebar";
import { BottomNav } from "@/components/shell/BottomNav";
import { PhaseBackdrop } from "@/components/shell/PhaseBackdrop";
import { usePoydevor, useHasHydrated } from "@/store/usePoydevor";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const onboarded = usePoydevor((s) => s.onboarded);
  const deviceFrame = usePoydevor((s) => s.deviceFrame);
  const hydrateDaily = usePoydevor((s) => s.hydrateDaily);
  const hydrated = useHasHydrated();

  useEffect(() => {
    if (hydrated) hydrateDaily();
  }, [hydrated, hydrateDaily]);

  useEffect(() => {
    if (!hydrated) return;
    if (!onboarded) router.replace("/onboarding");
  }, [hydrated, onboarded, router]);

  // While persisted state is still loading, show a quiet placeholder
  // so we don't flash the layout (or bounce to /onboarding) too early.
  if (!hydrated) {
    return (
      <>
        <TopBar />
        <div className="pt-14 min-h-screen grid place-items-center">
          <div className="text-[var(--text-muted)] text-sm">Yuklanmoqda…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PhaseBackdrop />
      <TopBar />
      <DeviceShell>
        {deviceFrame === "desktop" ? (
          <div className="flex gap-6">
            <Sidebar />
            <main className="flex-1 min-w-0">
              {children}
              {/* Below md (where Sidebar hides) we still need a way around. */}
              <div className="md:hidden">
                <BottomNav />
              </div>
            </main>
          </div>
        ) : (
          <>
            <main className="px-4 pb-4">{children}</main>
            <BottomNav />
          </>
        )}
      </DeviceShell>
    </>
  );
}

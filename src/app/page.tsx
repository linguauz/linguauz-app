"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePoydevor, useHasHydrated } from "@/store/usePoydevor";

export default function Root() {
  const router = useRouter();
  const onboarded = usePoydevor((s) => s.onboarded);
  const hydrated = useHasHydrated();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(onboarded ? "/bosh" : "/onboarding");
  }, [hydrated, onboarded, router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-[var(--text-muted)] text-sm">Yuklanmoqda…</div>
    </div>
  );
}

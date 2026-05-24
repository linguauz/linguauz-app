/**
 * Format a YYYY-MM-DD date string as a friendly Uzbek relative time.
 * Used by the activity list on the dashboard.
 */
export function relativeUz(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Hozir";
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;

  // Same calendar day → "X soat oldin"
  const sameCalDay = sameDate(target, now);
  if (sameCalDay) {
    if (diffHrs <= 0) return "Bugun";
    return `${diffHrs} soat oldin`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDate(target, yesterday)) return "Kecha";

  if (diffDays < 7) return `${diffDays} kun oldin`;
  if (diffDays < 14) return "Bir hafta oldin";
  return `${Math.floor(diffDays / 7)} hafta oldin`;
}

function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

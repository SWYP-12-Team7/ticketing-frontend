export function getDday(targetDate: Date): number {
  const difference = targetDate.getTime() - new Date().getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

export function formatDdayStart(targetDate: Date): string {
  const days = getDday(targetDate);
  if (days < 0) return "종료";
  return `D-${days} 시작`;
}

export function parseDotDate(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split(".").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatDdayStartFromDateString(dateStr: string): string | null {
  const dt = parseDotDate(dateStr);
  if (!dt) return null;
  return formatDdayStart(dt);
}

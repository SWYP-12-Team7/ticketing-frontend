import { format } from "date-fns";
import { ko } from "date-fns/locale";

// "오늘 13:05 기준"
export function getNowStampText(date: Date = new Date()) {
  const hhmm = format(date, "HH:mm", { locale: ko });
  return `오늘 ${hhmm} 기준`;
}

// "2026.02.07 13:05 기준" (원하면 이거 사용)
export function getNowStampTextFull(date: Date = new Date()) {
  return format(date, "yyyy.MM.dd HH:mm 기준", { locale: ko });
}
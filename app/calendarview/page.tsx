import { CalendarView } from "@/components/calendarview/CalendarView";
import { HotEventSection } from "@/components/calendarview/HotEventSection";

export default function CalendarViewPage() {
  return (
    <main className="calendarViewPage__main mx-auto w-full max-w-7xl px-4 py-6">
      {/* 캘린더 */}
      <CalendarView />

      {/* HOT EVENT 섹션 */}
      <HotEventSection className="mt-10" />
    </main>
  );
}

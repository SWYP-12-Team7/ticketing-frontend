"use client";

import { Suspense, useState } from "react";
import { CalendarView } from "@/components/calendarview/CalendarView";
import type { IsoDate } from "@/types/calendar";

export default function CalendarViewPage() {
  const [selectedDate, setSelectedDate] = useState<IsoDate | null>(null);

  return (
    <main className="calendarViewPage__main mx-auto w-full max-w-7xl px-4 py-6">
      {/* 캘린더 */}
      <Suspense
        fallback={
          <div className="calendarViewPage__loading rounded-xl bg-[#FFFBF4] p-4">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <CalendarView
          selectedDate={selectedDate}
          onDateClick={setSelectedDate}
        />
      </Suspense>
    </main>
  );
}

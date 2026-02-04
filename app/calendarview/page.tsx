"use client";

import { Suspense, useState } from "react";
import { CalendarView } from "@/components/calendarview/CalendarView";
import type { IsoDate } from "@/types/calendar";

/**
 * 캘린더 뷰 페이지
 *
 * Figma 스펙:
 * - 페이지: 1440px, background: #FFFFFF
 * - 캘린더는 left: 80px, top: 140px에 절대 위치
 */
export default function CalendarViewPage() {
  const [selectedDate, setSelectedDate] = useState<IsoDate | null>(null);

  return (
    <div
      className="calendar-view-page mx-auto"
      style={{
        width: "1440px",
        background: "#FFFFFF",
      }}
    >
      <Suspense
        fallback={
          <div className="calendar-view-loading p-20 text-center">
            <div className="animate-pulse text-gray-500">
              캘린더를 불러오는 중...
            </div>
          </div>
        }
      >
        <CalendarView
          selectedDate={selectedDate}
          onDateClick={setSelectedDate}
        />
      </Suspense>
    </div>
  );
}

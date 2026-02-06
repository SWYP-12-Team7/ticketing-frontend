"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FilterSectionProps {
  className?: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null
) {
  if (!start || !end) return false;
  return date > start && date < end;
}

function isToday(date: Date) {
  const today = new Date();
  return isSameDay(date, today);
}

function formatDateParam(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function FilterSection({ className }: FilterSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"map" | "calendar">(
    "calendar"
  );

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);

  const handlePrevMonth = () => {
    const d = new Date(calYear, calMonth - 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };

  const handleNextMonth = () => {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };

  const handleSelectDate = (date: Date) => {
    if (selectingStart) {
      setStartDate(date);
      setEndDate(null);
      setSelectingStart(false);
    } else {
      if (startDate && date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectingStart(true);
    }
  };

  const handleSearch = () => {
    if (activeTab === "calendar") {
      const params = new URLSearchParams();
      if (startDate) {
        params.set("startDate", formatDateParam(startDate));
      }
      if (endDate) {
        params.set("endDate", formatDateParam(endDate));
      }
      const qs = params.toString();
      router.push(qs ? `/calendarview?${qs}` : "/calendarview");
    } else {
      router.push("/mapview");
    }
  };

  // 달력 그리드 생성
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const prevMonthDays = getDaysInMonth(
    calYear,
    calMonth - 1
  );

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(calYear, calMonth - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(calYear, calMonth, i),
      isCurrentMonth: true,
    });
  }
  // 마지막 주를 채울 만큼만 다음 달 날짜 추가
  const remainingInWeek = days.length % 7;
  if (remainingInWeek > 0) {
    for (let i = 1; i <= 7 - remainingInWeek; i++) {
      days.push({
        date: new Date(calYear, calMonth + 1, i),
        isCurrentMonth: false,
      });
    }
  }

  return (
    <div
      className={cn(
        "flex h-[642px] flex-col justify-between rounded-xl border border-[#FA7228] px-[20px] py-[24px]",
        className
      )}
    >
      {/* 탭 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-1 rounded-[10px] px-[15.5px] py-[5px] text-[16px] font-semibold leading-[180%] transition-colors",
            activeTab === "map"
              ? "text-[#202937] shadow-[0_0_6px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
              : "text-[#6C7180]"
          )}
        >
          퀵 지도 탐색
          <Image
            src={activeTab === "map"
              ? "/images/header/map-pinned-active.svg"
              : "/images/header/map-pinned.svg"
            }
            alt=""
            width={24}
            height={24}
          />
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={cn(
            "flex items-center gap-1 rounded-[10px] px-[15.5px] py-[5px] text-[16px] font-semibold leading-[180%] transition-colors",
            activeTab === "calendar"
              ? "text-[#202937] shadow-[0_0_6px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
              : "text-[#6C7180]"
          )}
        >
          퀵 캘린더 탐색
          <Image
            src={activeTab === "calendar"
              ? "/images/header/calendar-search-active.svg"
              : "/images/header/calendar-search.svg"
            }
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 콘텐츠 */}
      {activeTab === "calendar" ? (
        <div className="flex flex-1 flex-col pt-5">
          {/* 설명 */}
          <p className="text-lg font-semibold leading-[128%] tracking-[0.025em] text-[#4B5462]">
            원하는 날짜에 열리는
            <br />
            다양한 행사를 확인해 보세요
          </p>

          {/* 달력 */}
          <div className="mt-12 p-4 h-[320px] border-1 border-[#D3D5DC] rounded-xl">
            {/* 월 네비게이션 */}
            <div className="mb-2 h-12 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-0.5"
              >
                <ChevronLeft className="size-6 text-[#121212]" />
              </button>
              <span className="text-[18px] font-semibold text-[#121212]">
                {calYear}.
                {String(calMonth + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-0.5"
              >
                <ChevronRight className="size-6 text-[#121212]" />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className=" grid grid-cols-7">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    "flex h-[40px] w-[40px] items-center justify-center text-[14px] font-normal leading-[180%]",
                    i === 0
                      ? "text-orange"
                      : "text-[#999]"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7">
              {days.map(
                ({ date, isCurrentMonth }, index) => {
                  const isStart = isSameDay(
                    date,
                    startDate
                  );
                  const isEnd = isSameDay(date, endDate);
                  const inRange = isInRange(
                    date,
                    startDate,
                    endDate
                  );
                  const hasRange = startDate && endDate;
                  const isSunday = date.getDay() === 0;
                  const col = index % 7;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative flex h-[40px] items-center justify-center",
                        inRange && "bg-[#F3F4F6]",
                        inRange && col === 0 && "rounded-l-md",
                        inRange && col === 6 && "rounded-r-md",
                        isStart &&
                          hasRange &&
                          "rounded-l-md bg-gradient-to-r from-transparent from-50% to-[#F3F4F6] to-50%",
                        isEnd &&
                          hasRange &&
                          "rounded-r-md bg-gradient-to-l from-transparent from-50% to-[#F3F4F6] to-50%"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          isCurrentMonth &&
                          handleSelectDate(date)
                        }
                        className={cn(
                          "relative z-10 flex size-[40px] items-center justify-center rounded-full text-[16px] font-normal leading-[180%] transition-colors",
                          !isCurrentMonth &&
                            "text-gray-300",
                          isCurrentMonth &&
                            isSunday &&
                            !isStart &&
                            !isEnd &&
                            "text-orange",
                          isCurrentMonth &&
                            !isSunday &&
                            !isStart &&
                            !isEnd &&
                            "text-[#121212]",
                          (isStart || isEnd) &&
                            "bg-[#202937] text-white",
                          isCurrentMonth &&
                            !isStart &&
                            !isEnd &&
                            "hover:bg-orange/10"
                        )}
                      >
                        {date.getDate()}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 퀵 지도 탐색 — 추후 구현 */
        <div className="flex flex-1 items-center justify-center text-[14px] text-[#999]">
          지도 탐색 기능 준비 중
        </div>
      )}

      {/* 하단 버튼 */}
      <button
        onClick={handleSearch}
        className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-orange px-[12px] py-[12px] text-[16px] font-medium leading-[140%] text-white"
      >
        탐색하기
        <ChevronRight className="size-[24px]" />
      </button>
    </div>
  );
}

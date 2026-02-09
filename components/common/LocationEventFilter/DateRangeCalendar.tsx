/**
 * 기간 선택 캘린더 위젯
 *
 * 필터 모달 내부에서 사용하는 날짜 범위 선택 캘린더
 *
 * Figma 스펙:
 * - Size: 356px × 320px
 * - Padding: 16px
 * - Border: 1px solid #D3D5DC
 * - Border-radius: 12px
 * - 월 네비게이션: 48px height
 * - 캘린더 테이블: 280px × 240px
 * - 날짜 셀: 40px × 40px
 * - 범위 선택 지원 (시작~종료)
 * - 선택된 날짜: 원형 dark style (#4B5462)
 * - 범위 배경: #F3F4F6
 */

"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeCalendarProps {
  /** 시작 날짜 (YYYY-MM-DD) */
  startDate: string | null;
  /** 종료 날짜 (YYYY-MM-DD) */
  endDate: string | null;
  /** 날짜 변경 핸들러 */
  onChange: (startDate: string | null, endDate: string | null) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function DateRangeCalendar({
  startDate,
  endDate,
  onChange,
  className,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // 월 제목 (2026.02)
  const monthTitle = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}`;
  }, [currentMonth]);

  // 캘린더 날짜 배열 생성 (6주 × 7일)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // 이전 달 날짜들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // 현재 달 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // 다음 달 날짜들 (6주 채우기)
    const remainingDays = 42 - days.length; // 6주 × 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 클릭 핸들러 (범위 선택)
  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);

    // 시작 날짜도 없는 경우 → 시작 날짜 설정
    if (!startDate) {
      onChange(dateStr, null);
      return;
    }

    // 시작 날짜만 있는 경우 → 종료 날짜 설정
    if (!endDate) {
      const start = new Date(startDate);
      const clicked = new Date(dateStr);

      if (clicked < start) {
        // 클릭한 날짜가 시작 날짜보다 이전이면 → 시작 날짜로 재설정
        onChange(dateStr, null);
      } else {
        // 클릭한 날짜가 시작 날짜 이후면 → 종료 날짜로 설정
        onChange(startDate, dateStr);
      }
      return;
    }

    // 시작/종료 날짜 모두 있는 경우 → 초기화하고 새로 시작
    onChange(dateStr, null);
  };

  // 날짜가 범위 내에 있는지 확인
  const isInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    const dateStr = formatDate(date);
    return dateStr >= startDate && dateStr <= endDate;
  };

  // 날짜가 시작 날짜인지 확인
  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false;
    return formatDate(date) === startDate;
  };

  // 날짜가 종료 날짜인지 확인
  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false;
    return formatDate(date) === endDate;
  };

  return (
    <div
      className={cn("flex flex-col items-center bg-white", className)}
      style={{
        width: "356px",
        height: "320px",
        padding: "16px",
        border: "1px solid #D3D5DC",
        borderRadius: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* 월 네비게이션 */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "324px",
          height: "48px",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ width: "48px", height: "48px" }}
          aria-label="이전 달"
        >
          <ChevronLeft
            className="w-6 h-6 text-[#6C7180]"
            strokeWidth={1.5}
          />
        </button>

        <span
          className="flex items-center justify-center text-[#202937]"
          style={{
            fontFamily: "Pretendard Variable",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "180%",
          }}
        >
          {monthTitle}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ width: "48px", height: "48px" }}
          aria-label="다음 달"
        >
          <ChevronRight
            className="w-6 h-6 text-[#6C7180]"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* 캘린더 테이블 */}
      <div
        className="flex flex-col"
        style={{
          width: "280px",
          height: "240px",
        }}
      >
        {/* 요일 헤더 */}
        <div
          className="flex"
          style={{
            width: "280px",
            height: "40px",
            borderRadius: "4px",
          }}
        >
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                padding: "16px",
              }}
            >
              <span
                className="text-[#6C7180]"
                style={{
                  fontFamily: "Pretendard Variable",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "180%",
                }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 (5주) */}
        {Array.from({ length: 5 }).map((_, weekIndex) => (
          <div
            key={weekIndex}
            className="flex"
            style={{
              width: "280px",
              height: "40px",
              borderRadius: "4px",
            }}
          >
            {calendarDays.slice(weekIndex * 7 + 7, weekIndex * 7 + 14).map((day, dayIndex) => {
              const inRange = isInRange(day.date);
              const isStart = isStartDate(day.date);
              const isEnd = isEndDate(day.date);
              const isSelected = isStart || isEnd;

              return (
                <button
                  key={dayIndex}
                  type="button"
                  onClick={() => handleDateClick(day.date)}
                  disabled={!day.isCurrentMonth}
                  className={cn(
                    "relative flex items-center justify-center transition-all",
                    !day.isCurrentMonth && "cursor-not-allowed"
                  )}
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "16px",
                    background: inRange ? "#F3F4F6" : "transparent",
                  }}
                >
                  {/* 범위 배경 확장 (좌/우) */}
                  {inRange && isStart && (
                    <div
                      className="absolute right-0"
                      style={{
                        width: "20px",
                        height: "40px",
                        background: "#F3F4F6",
                        top: 0,
                      }}
                    />
                  )}
                  {inRange && isEnd && (
                    <div
                      className="absolute left-0"
                      style={{
                        width: "20px",
                        height: "40px",
                        background: "#F3F4F6",
                        top: 0,
                      }}
                    />
                  )}

                  {/* 선택된 날짜 원형 */}
                  {isSelected && (
                    <div
                      className="absolute"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#4B5462",
                        borderRadius: "1000px",
                        top: 0,
                        left: 0,
                      }}
                    />
                  )}

                  {/* 날짜 텍스트 */}
                  <span
                    className={cn("relative z-10")}
                    style={{
                      fontFamily: "Pretendard Variable",
                      fontSize: "16px",
                      fontWeight: isSelected ? 600 : 400,
                      lineHeight: "180%",
                      color: isSelected
                        ? "#FFFFFF"
                        : day.isCurrentMonth
                        ? "#202937"
                        : "transparent",
                    }}
                  >
                    {day.date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

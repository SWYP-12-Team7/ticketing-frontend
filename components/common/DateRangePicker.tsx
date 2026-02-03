"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  placeholder?: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function generateYears() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear + 5; i >= 2014; i--) {
    years.push(i);
  }
  return years;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function isSameDay(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return date > start && date < end;
}

interface CalendarProps {
  year: number;
  month: number;
  startDate: Date | null;
  endDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeYear: (year: number) => void;
  onChangeMonth: (month: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function Calendar({
  year,
  month,
  startDate,
  endDate,
  onSelectDate,
  onChangeYear,
  onChangeMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const years = generateYears();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    days.push({
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrevMonth} className="p-1">
          <ChevronLeft className="size-5 text-[#121212]" />
        </button>

        <div className="flex items-center gap-2">
          {/* Year Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
              className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium"
            >
              {year}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  showYearDropdown && "rotate-180"
                )}
              />
            </button>
            {showYearDropdown && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-20 overflow-y-auto rounded-md border border-border bg-white shadow-lg scrollbar-hide">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      onChangeYear(y);
                      setShowYearDropdown(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100",
                      y === year && "bg-orange/10 text-orange"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
              className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium"
            >
              {MONTHS[month]}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  showMonthDropdown && "rotate-180"
                )}
              />
            </button>
            {showMonthDropdown && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-16 overflow-y-auto rounded-md border border-border bg-white shadow-lg scrollbar-hide">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onChangeMonth(i);
                      setShowMonthDropdown(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100",
                      i === month && "bg-orange/10 text-orange"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={onNextMonth} className="p-1">
          <ChevronRight className="size-5 text-[#121212]" />
        </button>
      </div>

      {/* Days header */}
      <div className="mb-2 grid grid-cols-7 gap-px">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-sm font-medium",
              i === 0 ? "text-orange" : "text-[#121212]"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map(({ date, isCurrentMonth }, index) => {
          const isStart = isSameDay(date, startDate);
          const isEnd = isSameDay(date, endDate);
          const inRange = isInRange(date, startDate, endDate);
          const isSunday = date.getDay() === 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => isCurrentMonth && onSelectDate(date)}
              className={cn(
                "relative flex aspect-square w-full items-center justify-center rounded-md text-sm transition-colors",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth && isSunday && !isStart && !isEnd && "text-orange",
                isCurrentMonth && !isSunday && !isStart && !isEnd && "text-[#121212]",
                inRange && "bg-orange/20",
                (isStart || isEnd) && "bg-orange text-white",
                isCurrentMonth && "hover:bg-orange/30"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "기간을 선택하세요!",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [leftYear, setLeftYear] = useState(() => startDate?.getFullYear() ?? new Date().getFullYear());
  const [leftMonth, setLeftMonth] = useState(() => startDate?.getMonth() ?? new Date().getMonth());
  const [rightYear, setRightYear] = useState(() => {
    const date = startDate ?? new Date();
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return nextMonth.getFullYear();
  });
  const [rightMonth, setRightMonth] = useState(() => {
    const date = startDate ?? new Date();
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return nextMonth.getMonth();
  });
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDate = (date: Date) => {
    if (selectingStart) {
      onChange(date, null);
      setSelectingStart(false);
    } else {
      if (startDate && date < startDate) {
        onChange(date, startDate);
      } else {
        onChange(startDate, date);
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null, null);
    setSelectingStart(true);
  };

  const handleLeftPrevMonth = () => {
    const newDate = new Date(leftYear, leftMonth - 1, 1);
    setLeftYear(newDate.getFullYear());
    setLeftMonth(newDate.getMonth());
  };

  const handleLeftNextMonth = () => {
    const newDate = new Date(leftYear, leftMonth + 1, 1);
    if (newDate < new Date(rightYear, rightMonth, 1)) {
      setLeftYear(newDate.getFullYear());
      setLeftMonth(newDate.getMonth());
    }
  };

  const handleRightPrevMonth = () => {
    const newDate = new Date(rightYear, rightMonth - 1, 1);
    if (newDate > new Date(leftYear, leftMonth, 1)) {
      setRightYear(newDate.getFullYear());
      setRightMonth(newDate.getMonth());
    }
  };

  const handleRightNextMonth = () => {
    const newDate = new Date(rightYear, rightMonth + 1, 1);
    setRightYear(newDate.getFullYear());
    setRightMonth(newDate.getMonth());
  };

  const displayValue =
    startDate && endDate
      ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} ~ `
        : "";

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:border-orange"
      >
        <span className={displayValue ? "text-[#121212]" : "text-muted-foreground"}>
          {displayValue || placeholder}
        </span>
        {displayValue ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-muted-foreground hover:text-[#121212]"
          >
            <X className="size-4" />
          </button>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.57583H17.0833M17.5 7.08333V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08333C2.5 4.58333 3.75 2.91667 6.66667 2.91667H13.3333C16.25 2.91667 17.5 4.58333 17.5 7.08333Z"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.0791 11.4167H13.0866M13.0791 13.9167H13.0866M9.99579 11.4167H10.0041M9.99579 13.9167H10.0041M6.91162 11.4167H6.91995M6.91162 13.9167H6.91995"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-lg border border-border bg-white p-6 shadow-lg">
          <div className="flex gap-10">
            <Calendar
              year={leftYear}
              month={leftMonth}
              startDate={startDate}
              endDate={endDate}
              onSelectDate={handleSelectDate}
              onChangeYear={setLeftYear}
              onChangeMonth={setLeftMonth}
              onPrevMonth={handleLeftPrevMonth}
              onNextMonth={handleLeftNextMonth}
            />
            <Calendar
              year={rightYear}
              month={rightMonth}
              startDate={startDate}
              endDate={endDate}
              onSelectDate={handleSelectDate}
              onChangeYear={setRightYear}
              onChangeMonth={setRightMonth}
              onPrevMonth={handleRightPrevMonth}
              onNextMonth={handleRightNextMonth}
            />
          </div>
        </div>
      )}
    </div>
  );
}

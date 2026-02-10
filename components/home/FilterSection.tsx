"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { FilterSelect } from "./FilterSelect";
import { DateRangeCalendar } from "@/components/common/LocationEventFilter/DateRangeCalendar";

interface FilterSectionProps {
  className?: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const REGIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전",
  "경기", "충북", "충남", "전북", "전남", "경북", "경남",
] as const;

const CATEGORY_MAP: Record<string, readonly string[]> = {
  "팝업스토어": ["패션", "뷰티", "F&B", "캐릭터", "테크", "라이프스타일", "가구/인테리어"],
  "전시": ["현대미술", "사진", "디자인", "일러스트", "회화", "조각", "설치미술"],
} as const;

const PARENT_CATEGORIES = Object.keys(CATEGORY_MAP);

const PERIODS = ["오늘", "이번 주말", "일주일 내", "한달 내"] as const;

export function FilterSection({ className }: FilterSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"map" | "calendar">(
    "calendar"
  );

  // 날짜 필터 상태 (YYYY-MM-DD 형식)
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 지도 탭 필터 상태
  const [region, setRegion] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [period, setPeriod] = useState("");

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    if (activeTab === "calendar") {
      const params = new URLSearchParams();
      
      // 날짜가 선택되었으면 해당 날짜 기준, 아니면 현재 날짜 기준
      let baseDate = new Date();
      if (startDate) {
        const [year, month, day] = startDate.split("-").map(Number);
        baseDate = new Date(year, month - 1, day);
      } else if (endDate) {
        const [year, month, day] = endDate.split("-").map(Number);
        baseDate = new Date(year, month - 1, day);
      }
      
      params.set("year", String(baseDate.getFullYear()));
      params.set("month", String(baseDate.getMonth() + 1));
      const qs = params.toString();
      router.push(qs ? `/calendarview?${qs}` : "/calendarview");
    } else {
      const params = new URLSearchParams();
      params.set("mode", "map");
      if (region) params.set("region", region);
      if (parentCategory) params.set("category", parentCategory);
      if (subCategory) params.set("subCategory", subCategory);
      if (period) params.set("period", period);
      router.push(`/view?${params.toString()}`);
    }
  };

  return (
    <div
      className={cn(
        "flex h-[642px] flex-col justify-between rounded-xl border border-[#FA7228] px-[20px] py-[24px]",
        className
      )}
    >
      {/* 탭 */}
      <div className="flex justify-center gap-2 rounded-[10px] bg-[#F9FAFB] p-1">
        <button
          onClick={() => setActiveTab("map")}
          className={cn(
            "flex items-center gap-1 rounded-[10px] px-[15.5px] py-[5px] text-[16px] font-semibold leading-[180%] transition-colors",
            activeTab === "map"
              ? "bg-white text-[#202937] shadow-[0_0_6px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
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
              ? "bg-white text-[#202937] shadow-[0_0_6px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
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

          {/* 날짜 범위 캘린더 (compact variant) */}
          <div className="mt-12">
            <DateRangeCalendar
              variant="compact"
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>
      ) : (
        /* 퀵 지도 탐색 */
        <div className="flex flex-1 flex-col pt-5">
          <p className="text-lg font-semibold leading-[128%] tracking-[0.025em] text-[#4B5462]">
            관심 지역의 핫 플레이스를
            <br />
            빠르게 지도에서 확인하세요
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {/* 지역선택 */}
            <FilterSelect
              label="지역선택"
              placeholder="지역"
              options={REGIONS}
              value={region}
              onChange={setRegion}
              columns={2}
            />

            {/* 카테고리 */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold leading-[140%] text-[#6C7180]">
                카테고리
              </span>
              <FilterSelect
                placeholder="상위 카테고리"
                options={PARENT_CATEGORIES}
                value={parentCategory}
                onChange={(v) => {
                  setParentCategory(v);
                  setSubCategory("");
                }}
              />
              <FilterSelect
                placeholder="하위 카테고리"
                options={parentCategory ? CATEGORY_MAP[parentCategory] : []}
                value={subCategory}
                onChange={setSubCategory}
                variant="secondary"
                disabled={!parentCategory}
              />
            </div>

            {/* 일시 */}
            <FilterSelect
              label="일시"
              placeholder="기간 선택"
              options={PERIODS}
              value={period}
              onChange={setPeriod}
            />
          </div>
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

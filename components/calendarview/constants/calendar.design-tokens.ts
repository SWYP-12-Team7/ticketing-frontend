/**
 * 캘린더 뷰 디자인 토큰 시스템
 *
 * - Figma 스펙 완전 반영 (2026-02-03)
 * - 모든 색상, 간격, 크기를 중앙 관리
 * - 디자이너와 협업 시 단일 진실 공급원(Single Source of Truth)
 * - 유지보수성과 일관성 향상
 *
 * @remarks
 * 디자인 시스템 변경 시 이 파일만 수정하면 전체 캘린더 뷰에 반영됩니다.
 */

export const CALENDAR_DESIGN_TOKENS = {
  colors: {
    /** 페이지 */
    page: {
      background: "#FFFFFF",
    },
    /** 셀 배경색 */
    cell: {
      /** 현재 월 날짜 */
      current: "#FFFFFF",
      /** 전월/익월 날짜 */
      outOfMonth: "#F9FAFB",
      /** 선택된 날짜 */
      selected: "#FFF6EC",
    },
    /** 셀 테두리 색상 */
    border: {
      /** 기본 테두리 */
      default: "#E5E7EA",
      /** 선택된 셀 테두리 */
      selected: "#FFD8B7",
    },
    /** Pill 색상 */
    pill: {
      exhibition: {
        /** 테두리 색상 */
        border: "#75A8FF",
        /** 선택 시 배경 (동그라미 채우기) */
        background: "#75A8FF",
        /** 레이블 텍스트 */
        text: "#1D4DA7",
        /** 개수 텍스트 */
        textCount: "#424A57",
      },
      popup: {
        border: "#FF9F53",
        background: "#FF9F53",
        text: "#A33C0F",
        textCount: "#424A57",
      },
    },
    /** 텍스트 색상 */
    text: {
      /** 날짜 번호 */
      date: "#404040",
      /** 일요일 날짜 */
      sunday: "#FF3434",
      /** 3차 텍스트 */
      tertiary: "#404040",
    },
    /** 필터바 색상 */
    filter: {
      /** 필터 아이템 배경 */
      background: "#FFF4EC",
      /** 레이블 텍스트 (주황) */
      labelText: "#F36012",
      /** 값 배경 (흰색) */
      valueBackground: "#FFFFFF",
      /** 값 텍스트 */
      valueText: "#202937",
      /** 아이콘 색상 */
      icon: "#202937",
    },
    /** 월 네비게이션 */
    monthNav: {
      /** 화살표 색상 */
      arrow: "#000000",
      /** 월 제목 텍스트 */
      title: "#111928",
    },
    /** 요일 헤더 */
    weekday: {
      /** 일요일 */
      sunday: "#FF3434",
      /** 나머지 요일 */
      default: "#404040",
    },
  },
  sizing: {
    /** 페이지 컨테이너 */
    page: {
      width: "1440px",
      height: "1744px",
    },
    /** 캘린더 섹션 전체 */
    container: {
      width: "1280px",
      height: "791px",
    },
    /** 월 네비게이션 */
    monthNav: {
      width: "1280px",
      height: "31px",
      arrowSize: "24px",
      titleWidth: "784px",
    },
    /** 필터바 */
    toolbar: {
      width: "1280px",
      height: "60px",
      filterItemHeight: "32px",
      filterIconSize: "24px",
    },
    /** 그리드 외곽 박스 */
    gridBox: {
      width: "1278px",
      height: "661px",
    },
    /** 그리드 내부 (날짜 셀 그룹) */
    gridInner: {
      width: "1252px",
      height: "593px",
      left: "13px",
      top: "55px",
    },
    /** 셀 크기 (고정) */
    cell: {
      width: "166px",
      height: "113px",
    },
    /** 날짜 번호 영역 */
    dateNumber: {
      width: "28px",
      height: "28px",
    },
    /** Pill 크기 */
    pill: {
      width: "150px",
      height: "30px",
      /** 동그라미 아이콘 크기 */
      iconSize: "10px",
    },
    /** 요일 헤더 */
    weekdayHeader: {
      height: "28px",
    },
  },
  spacing: {
    /** 페이지 여백 */
    page: {
      left: "80px",
      topFromHeader: "140px",
    },
    /** 캘린더 컨테이너 */
    container: {
      gap: "10px",
    },
    /** 셀 내부 간격 */
    cell: {
      /** 날짜 번호 위치 (left, top) */
      datePosition: "3px",
      /** 첫 번째 pill top */
      pillTop: "41px",
      /** 두 번째 pill top */
      pillTopSecond: "71px",
      /** pill left */
      pillLeft: "8px",
    },
    /** Pill 내부 간격 */
    pill: {
      padding: "6px 10px",
      gap: "6px",
    },
    /** 필터바 간격 */
    toolbar: {
      padding: "8px 10px",
      gap: "11px",
    },
    /** 그리드 간격 (Figma 스펙: 수평 15px, 수직 7px) */
    grid: {
      padding: "p-4",
      cellGapX: "15px",
      cellGapY: "7px",
      borderSpacing: "border-spacing-3",
    },
  },
  borderRadius: {
    /** 셀 border-radius */
    cell: "12px",
    /** 날짜 번호 영역 */
    dateNumber: "24px",
    /** Pill border-radius */
    pill: "7px",
    /** 필터 아이템 */
    filter: "24px",
    /** 필터 값 영역 */
    filterValue: "24px",
    /** 리셋 버튼 */
    reset: "22px",
    /** 그리드 박스 */
    gridBox: "12px",
    /** 요일 헤더 */
    weekdayHeader: "24px",
    /** 작은 라운드 */
    small: "8px",
    /** 큰 라운드 */
    large: "16px",
    /** 완전한 원형 */
    full: "9999px",
  },
  borders: {
    /** 셀 기본 테두리 두께 */
    cellDefault: "2px",
    /** 셀 선택 시 테두리 두께 */
    cellSelected: "3px",
    /** Pill 테두리 두께 */
    pillDefault: "1px",
    /** 화살표 테두리 두께 */
    arrow: "1.5px",
  },
  fonts: {
    /** 날짜 번호 폰트 */
    dateNumber: {
      family: "Inter",
      size: "16px",
      weight: "600",
      lineHeight: "24px",
    },
    /** Pill 텍스트 폰트 */
    pill: {
      family: "Roboto",
      size: "14px",
      weight: "500",
      lineHeight: "20px",
      letterSpacing: "0.25px",
    },
    /** 필터바 폰트 */
    filter: {
      family: "Pretendard Variable",
      size: "16px",
      weight: "500",
      lineHeight: "140%",
    },
    /** 월 제목 폰트 */
    monthTitle: {
      family: "Pretendard Variable",
      size: "24px",
      weight: "600",
      lineHeight: "128%",
      letterSpacing: "-0.025em",
    },
    /** 요일 헤더 폰트 */
    weekdayHeader: {
      family: "Inter",
      size: "16px",
      weight: "600",
      lineHeight: "24px",
    },
  },
  /** 트랜지션 */
  transitions: {
    default: "transition-all",
    colors: "transition-colors",
    duration: {
      fast: "duration-150",
      normal: "duration-200",
      slow: "duration-300",
    },
  },
  /** 그림자 */
  shadows: {
    small: "shadow-sm",
    medium: "shadow-md",
    large: "shadow-lg",
  },
} as const;

export type CalendarDesignTokens = typeof CALENDAR_DESIGN_TOKENS;

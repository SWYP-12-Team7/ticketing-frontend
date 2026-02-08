/**
 * 설정 페이지 디자인 토큰 시스템
 *
 * - Figma 스펙 완전 반영 (2026-02-03)
 * - 모든 색상, 간격, 크기를 중앙 관리
 * - 디자이너와 협업 시 단일 진실 공급원(Single Source of Truth)
 * - 유지보수성과 일관성 향상
 *
 * @remarks
 * 디자인 시스템 변경 시 이 파일만 수정하면 전체 설정 페이지에 반영됩니다.
 */

export const SETTINGS_DESIGN_TOKENS = {
  /**
   * 레이아웃 토큰
   */
  layout: {
    /** 컨테이너 (전체 페이지) */
    container: {
      width: "1440px",
      height: "1570px",
      padding: "80px",
      gap: "48px",
      background: "#FFFFFF",
    },
    /** 사이드바 (SNB) */
    sidebar: {
      width: "302px",
      height: "646px",
      padding: {
        top: "56px",
        right: "16px",
        bottom: "56px",
        left: "24px",
      },
      gap: "64px",
      borderRadius: "12px",
      border: "1px solid #E5E7EA",
      boxShadow:
        "0px 1px 2px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.1)",
      background: "#FFFFFF",
    },
    /** 콘텐츠 영역 */
    content: {
      width: "930px",
      height: "1410px",
      gap: "48px",
    },
  },

  /**
   * 색상 토큰
   */
  colors: {
    /** 배경 색상 */
    background: {
      primary: "#FFFFFF",
      disabled: "#F9FAFB",
    },
    /** 테두리 색상 */
    border: {
      default: "#D3D5DC",
      sidebar: "#E5E7EA",
      divider: "#D3D5DC",
    },
    /** 텍스트 색상 */
    text: {
      primary: "#202937",
      secondary: "#4B5462",
      tertiary: "#6C7180",
      disabled: "#6C7180",
      placeholder: "#A6ABB7",
      link: "#2970E2",
      error: "#2970E2",
    },
    /** 브랜드 색상 */
    brand: {
      primary: "#F36012",
      hover: "#E55511",
    },
    /** 아이콘 색상 */
    icon: {
      default: "#A6ABB7",
      alert: "#0088E8",
    },
    /** 토글 스위치 */
    toggle: {
      on: "#F36012",
      off: "#A6ABB7",
      knob: "#FFFFFF",
    },
  },

  /**
   * 타이포그래피 토큰
   */
  typography: {
    /** 섹션 제목 (회원정보, 알림 설정) */
    sectionTitle: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: "128%",
      letterSpacing: "-0.025em",
    },
    /** 입력 필드 라벨 */
    label: {
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: "140%",
    },
    /** 입력 필드 input */
    input: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "140%",
    },
    /** 헬퍼 텍스트 */
    helper: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "180%",
    },
    /** 에러 메시지 */
    error: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "180%",
    },
    /** 알림 항목 (상위) */
    notificationParent: {
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "180%",
    },
    /** 알림 항목 (하위) */
    notificationChild: {
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "180%",
    },
    /** 버튼 */
    button: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "140%",
    },
    /** 저장 버튼 */
    saveButton: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "140%",
    },
  },

  /**
   * 간격 토큰
   */
  spacing: {
    /** 섹션 간 간격 */
    section: {
      gap: "48px",
      marginBottom: "32px",
    },
    /** 입력 필드 간 간격 */
    field: {
      gap: "32px",
      innerGap: "8px",
    },
    /** 알림 항목 간 간격 */
    notification: {
      gap: "12px",
      itemPadding: "16px",
      indentPadding: "48px",
    },
  },

  /**
   * 컴포넌트별 토큰
   */
  components: {
    /** 입력 필드 */
    inputField: {
      height: "48px",
      padding: {
        vertical: "12px",
        horizontal: "16px",
      },
      borderRadius: "4px",
      border: "1px solid #D3D5DC",
    },
    /** 버튼 */
    button: {
      /** 검색 버튼 */
      search: {
        width: "76px",
        height: "48px",
        padding: "0 24px",
        borderRadius: "4px",
      },
      /** 회원탈퇴 버튼 */
      withdrawal: {
        width: "73px",
        height: "32px",
        padding: "0 12px",
        borderRadius: "4px",
      },
      /** 저장 버튼 */
      save: {
        height: "32px",
        padding: "0 24px",
        borderRadius: "4px",
      },
    },
    /** 토글 스위치 */
    toggleSwitch: {
      width: "40px",
      height: "24px",
      padding: "2px",
      borderRadius: "1000px",
      knob: {
        size: "20px",
      },
    },
    /** 알림 항목 */
    notificationItem: {
      height: "64px",
      padding: "16px",
      indentPadding: "16px 16px 16px 48px",
    },
    /** 회원정보 섹션 카드 */
    memberInfoCard: {
      gap: "32px",
      borderRadius: "12px",
    },
    /** 프로필 이미지 */
    profileImage: {
      size: "112px",
      borderRadius: "50%",
    },
    /** 닉네임 */
    nickname: {
      height: "36px",
      fontSize: "28px",
      fontWeight: 600,
      lineHeight: "128%",
      letterSpacing: "-0.025em",
    },
    /** 메타 정보 (이름, 이메일) */
    meta: {
      gap: "8px",
      icon: {
        size: "24px",
      },
      text: {
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "180%",
      },
    },
  },
} as const;

/**
 * Tailwind 클래스 헬퍼
 * 디자인 토큰을 Tailwind 클래스로 변환
 */
export const SETTINGS_CLASSES = {
  /** 섹션 제목 */
  sectionTitle:
    "text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-[#202937]",

  /** 입력 필드 라벨 */
  inputLabel: "text-lg font-medium leading-[140%] text-[#202937]",

  /** 입력 필드 */
  inputBox:
    "h-12 w-full rounded border border-[#D3D5DC] bg-white px-4 py-3 text-base font-medium leading-[140%] text-foreground placeholder:text-[#A6ABB7] focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#6C7180]",

  /** 헬퍼 텍스트 */
  helperText: "text-sm font-normal leading-[180%] text-[#6C7180]",

  /** 에러 메시지 */
  errorText: "text-xs font-normal leading-[180%] text-[#2970E2]",

  /** 알림 항목 (상위) */
  notificationParent: "text-lg font-semibold leading-[180%] text-[#202937]",

  /** 알림 항목 (하위) */
  notificationChild: "text-lg font-normal leading-[180%] text-[#4B5462]",

  /** 버튼 - 회원탈퇴 */
  withdrawalButton:
    "flex h-8 w-[73px] items-center justify-center rounded px-3 text-sm font-normal leading-[140%] text-[#6C7180] transition-colors hover:bg-muted",

  /** 버튼 - 저장 */
  saveButton:
    "rounded bg-[#F36012] px-6 py-2 text-sm font-medium leading-[140%] text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",

  /** 버튼 - 검색 */
  searchButton:
    "h-12 w-[76px] shrink-0 rounded border border-[#D3D5DC] bg-white px-6 text-base font-medium leading-[140%] text-[#202937] transition-colors hover:bg-muted",
} as const;

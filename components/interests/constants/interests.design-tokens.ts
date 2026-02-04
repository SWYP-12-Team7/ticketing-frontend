/**
 * Interests Design Tokens (Figma 스펙 완전 준수)
 *
 * @description
 * - 나의 취향 페이지 전체의 디자인 토큰 정의
 * - 색상, 타이포그래피, 간격, 크기 등 모든 디자인 요소
 * - Figma와 1:1 매핑으로 디자인 일관성 보장
 */

/**
 * 색상 팔레트
 */
const COLORS = {
  /** 메인 액센트 컬러 - #F36012 */
  primary: "#F36012",
  /** 팝업 카테고리 컬러 - #2970E2 */
  secondary: "#2970E2",

  /** 텍스트 - 기본 (타이틀) */
  textPrimary: "#202937",
  /** 텍스트 - 제목 */
  textTitle: "#111928",
  /** 텍스트 - 본문 */
  textBody: "#4B5462",
  /** 텍스트 - 보조 */
  textSecondary: "#6C7180",

  /** 배경 - 화이트 */
  bgWhite: "#FFFFFF",
  /** 테두리 */
  border: "#E5E7EA",
  /** 구분선 */
  divider: "#D3D5DC",

  /** 칩 - 선택됨 배경 */
  chipSelectedBg: "#6C7180",
  /** 칩 - 선택됨 테두리 */
  chipSelectedBorder: "#374051",
  /** 칩 - 기본 배경 */
  chipDefaultBg: "#FFFFFF",
  /** 칩 - 기본 테두리 */
  chipDefaultBorder: "#D3D5DC",
} as const;

/**
 * 타이포그래피
 */
const TYPOGRAPHY = {
  /** Hero 제목 - 32px, Semibold */
  heroTitle: {
    family: "'Pretendard Variable', sans-serif",
    size: "32px",
    weight: 600,
    lineHeight: "128%",
    color: COLORS.primary,
  },

  /** 섹션 제목 (24px) - Spot, Carousel */
  sectionTitle: {
    family: "'Pretendard Variable', sans-serif",
    size: "24px",
    weight: 600,
    lineHeight: "128%",
    letterSpacing: "-0.025em",
    colorPrimary: COLORS.textPrimary,
    colorTitle: COLORS.textTitle,
  },

  /** 배너 제목 - 18px, Semibold */
  bannerTitle: {
    family: "'Pretendard Variable', sans-serif",
    size: "18px",
    weight: 600,
    lineHeight: "128%",
    letterSpacing: "-0.025em",
    color: "#FFFFFF",
  },

  /** 칩 라벨 - 14px */
  chipLabel: {
    family: "'Pretendard', sans-serif",
    size: "14px",
    weight: 400,
    lineHeight: "140%",
    colorSelected: "#FFFFFF",
    colorDefault: COLORS.textBody,
  },

  /** 전체보기 버튼 - 14px */
  viewAllButton: {
    family: "'Pretendard', sans-serif",
    size: "14px",
    weight: 400,
    lineHeight: "140%",
    color: COLORS.textSecondary,
  },
} as const;

/**
 * 간격 (Spacing)
 */
const SPACING = {
  /** Hero 섹션 간격 - 32px */
  heroGap: "32px",
  /** 배너 간 간격 - 16px */
  bannerGap: "16px",

  /** Spot 섹션 내부 간격 - 20px */
  spotInnerGap: "20px",
  /** Spot 칩 간격 - 8px */
  spotChipGap: "8px",
  /** Spot 카드 간격 - 16px */
  spotCardGap: "16px",

  /** Carousel 섹션 간격 - 24px */
  carouselGap: "24px",
  /** Carousel 카드 간격 - 24px */
  carouselCardGap: "24px",
} as const;

/**
 * 크기 (Sizing)
 */
const SIZING = {
  /** 페이지 너비 - 930px */
  pageWidth: "930px",

  /** 배너 크기 */
  banner: {
    width: "457px",
    height: "168px",
  },

  /** 칩 크기 */
  chip: {
    minWidth: "48px",
    height: "32px",
    paddingX: "16px",
  },

  /** Spot 섹션 크기 */
  spot: {
    width: "930px",
    height: "430px",
  },

  /** Carousel 크기 */
  carousel: {
    width: "844px",
    cardWidth: "193px",
    cardHeight: "404px",
  },

  /** 전체보기 버튼 */
  viewAllButton: {
    iconSize: "36px",
    iconBorder: "1.5px",
    width: "65px",
  },
} as const;

/**
 * Border Radius
 */
const BORDER_RADIUS = {
  /** 배너 - 12px */
  banner: "12px",
  /** 칩 - 100px (pill) */
  chip: "100px",
  /** Spot 섹션 - 16px (Figma 스펙) */
  spot: "16px",
  /** 전체보기 버튼 - 50% (circle) */
  viewAllButton: "50%",
} as const;

/**
 * 그림자 (Shadow)
 */
const SHADOW = {
  /** Spot 섹션 그림자 */
  spot: "0px 1px 2px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.1)",
} as const;

/**
 * 배너 그라데이션
 */
const GRADIENTS = {
  banner:
    "linear-gradient(93.77deg, rgba(0, 0, 0, 0.2) 19%, rgba(0, 0, 0, 0.04) 95.22%), linear-gradient(95.02deg, #FF4400 -4.29%, rgba(255, 150, 69, 0.6) 35.57%, rgba(255, 247, 188, 0.2) 101.33%)",
  bannerBlendMode: "normal, hue",
} as const;

/**
 * 통합 Design Tokens Export
 */
export const INTERESTS_DESIGN_TOKENS = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizing: SIZING,
  borderRadius: BORDER_RADIUS,
  shadow: SHADOW,
  gradients: GRADIENTS,
} as const;

/**
 * 타입 추출 (필요시 사용)
 */
export type InterestsDesignTokens = typeof INTERESTS_DESIGN_TOKENS;

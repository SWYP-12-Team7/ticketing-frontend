"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCurationDetail } from "@/queries/detail/useCurationDetail";
import {
  HeroSection,
  TabNavigation,
  ContentSection,
  InfoSection,
  LocationSection,
  NearbyPlaces,
  PriceSection,
  OfficialChannel,
  RelatedPopups,
} from "@/components/detail";
import { ScrollToTop } from "@/components/common/ScrollToTop";

// 임시 목데이터 (일부 필드 fallback)
const mockDetailData = {
  images: ["/images/detailMock.png"],
  category: "전시 > 체험",
  title:
    "Culpa omnis voluptatem quos libero quo accusantium. Dolores omnis debitis quis architecto eos laudantium et.",
  description: "상상의 문을 열다",
  tags: [
    "체험전시",
    "사진",
    "가족",
    "커플",
    "친구",
    "혼자",
    "무료",
    "유료",
    "주차가능",
  ],
  period: "26.01.15 ~ 26.02.15",
  address: "서울 광진구 아차산로 402 그라운드시소 이스트",
  age: "전체 연령 관람",
  viewCount: 106307,
  likeCount: 18353,

  // 소개 섹션
  introText: `LAYER 체험전시, 40가지로 가득찬 특별한 경험, 스토어 프라입니다.
Beatae qui a aut. Placeat id officia itaque assumenda amet cumque. Minima atque itaque maxime quis at quam quis aliquid. Est in soluta et culpa aliquam vero. Sapiente placeat impedit voluptatem officia perspiciatis mollurit a cupiditate. Sint earum qui expedita quo.`,
  introImageUrl: "https://picsum.photos/seed/detail/800/1200",

  // 이용안내
  operatingHours: [
    { day: "월", time: "10:00 - 20:00" },
    { day: "화", time: "10:00 - 20:00" },
    { day: "수", time: "10:00 - 20:00" },
    { day: "목", time: "10:00 - 20:30" },
    { day: "금", time: "10:00 - 20:30" },
    { day: "토", time: "10:00 - 20:30" },
  ],
  closedDays: "월요일",
  contactNumber: "02-0000-0000",

  // 공지사항
  noticeText: `Lorem ipsum dolor sit amet consectetur. Odio eu altefend neque amet libero vivamus neque diam a. Egestas massa amet blandit mauris facilisis tellus leo nec. Viverra gravida nec alicias tincidunt amet cras. At sed tempus scelerisque urna risue integer at est.

Amet amet vitae vulputate et phasellus. Viverra tempus est elementum ultrices dignissim sit fames quis est. Lacisnia aliquet ac porisitor imperdiet. Pellentesque egestas mauris fringula tincidunt pharetra gravida malesuada. Vitae et egestas leo ornare vitae. Sit lorem velit commodo sapien.`,
  noticeImageUrl: "https://picsum.photos/seed/notice/800/600",

  // 가격 (API 없음: 빈 배열로 처리)
  prices: [],

  // 공식채널
  channels: [{ name: "공식 사이트 바로가기", url: "https://example.com" }],
};

export default function DetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = String(params.id);
  const type = (searchParams.get("type") || "EXHIBITION") as
    | "EXHIBITION"
    | "POPUP";
  const { data, isLoading } = useCurationDetail(id, type);

  const [activeTab, setActiveTab] = useState("intro");
  const [isLiked, setIsLiked] = useState(false);
  const isClickScrolling = useRef(false);

  const detailData = useMemo(() => {
    if (!data) {
      return {
        ...mockDetailData,
        channels: mockDetailData.channels.slice(0, 1),
      };
    }
    const period = data.startDate && data.endDate
      ? `${data.startDate} ~ ${data.endDate}`
      : mockDetailData.period;
    const categoryLabel = type === "POPUP" ? "팝업" : "전시";
    return {
      ...mockDetailData,
      images: [data.thumbnail || data.image || mockDetailData.images[0]],
      category: `${categoryLabel}`,
      title: data.title || mockDetailData.title,
      description: data.subTitle || mockDetailData.description,
      tags: data.tags?.length ? data.tags : mockDetailData.tags,
      period,
      address: data.address || mockDetailData.address,
      viewCount: data.viewCount ?? mockDetailData.viewCount,
      likeCount: data.likeCount ?? mockDetailData.likeCount,
      introText: data.description || mockDetailData.introText,
      introImageUrl: data.image || data.thumbnail || mockDetailData.introImageUrl,
      noticeText: data.noticeText || "",
      noticeImageUrl: data.noticeImageUrl,
      channels: data.url
        ? [{ name: "공식 사이트 바로가기", url: data.url }]
        : mockDetailData.channels.slice(0, 1),
    };
  }, [data, type]);

  const tabs = useMemo(() => {
    const list = [
      { id: "intro", label: "소개" },
      { id: "info", label: "이용안내" },
    ];
    if (detailData.noticeText || detailData.noticeImageUrl) {
      list.push({ id: "notice", label: "공지사항" });
    }
    list.push({ id: "location", label: "장소" });
    list.push({ id: "price", label: "가격" });
    if (detailData.channels?.length) {
      list.push({ id: "channel", label: "공식채널" });
    }
    return list;
  }, [detailData.noticeText, detailData.noticeImageUrl, detailData.channels]);

  useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id ?? "intro");
    }
  }, [tabs, activeTab]);

  // 스크롤에 따라 탭 변경
  useEffect(() => {
    const headerHeight = 56;
    const tabHeight = 49;
    const offset = headerHeight + tabHeight + 50; // 여유 공간 추가

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      for (const { id } of tabs) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom > offset) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  const handleTabChange = (tab: string) => {
    isClickScrolling.current = true;
    setActiveTab(tab);

    const element = document.getElementById(tab);
    if (element) {
      const headerHeight = 56;
      const tabHeight = 49;
      const offset = headerHeight + tabHeight;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });

      // 스크롤 완료 후 플래그 해제
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <HeroSection
        images={detailData.images}
        category={detailData.category}
        title={detailData.title}
        description={detailData.description}
        tags={detailData.tags}
        period={detailData.period}
        address={detailData.address}
        age={detailData.age}
        viewCount={detailData.viewCount}
        likeCount={detailData.likeCount}
        isLiked={isLiked}
        onBackClick={handleBackClick}
        onLikeClick={handleLikeClick}
      />

      {/* 탭 네비게이션 */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      {/* 소개 섹션 */}
      <ContentSection
        id="intro"
        title="소개"
        text={detailData.introText}
        imageUrl={detailData.introImageUrl}
      />

      {/* 이용안내 섹션 */}
      <InfoSection
        id="info"
        period={detailData.period}
        operatingHours={detailData.operatingHours}
        closedDays={detailData.closedDays}
        contact={detailData.contactNumber}
      />

      {/* 공지사항 섹션 */}
      {(detailData.noticeText || detailData.noticeImageUrl) && (
        <ContentSection
          id="notice"
          title="공지사항"
          text={detailData.noticeText}
          imageUrl={detailData.noticeImageUrl}
          maxHeight={280}
        />
      )}

      {/* 장소 섹션 */}
      <LocationSection id="location" address={detailData.address} />

      {/* 주변 인기 카페·식당  */} {/* 현재 API 부재 */}
      {/* <NearbyPlaces /> */} 

      {/* 가격 섹션 */}
      <PriceSection id="price" prices={data ? [] : mockDetailData.prices} />

      {/* 공식채널 섹션 */}
      <OfficialChannel id="channel" channels={detailData.channels} />

      {/* 가까운 팝업스토어 */}
      <RelatedPopups />

      {/* 맨 위로 버튼 */}
      <ScrollToTop />
    </div>
  );
}

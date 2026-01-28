"use client";

import { useState } from "react";
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

// 임시 목데이터
const mockDetailData = {
  images: ["/images/detailMock.png"],
  category: "전시 > 체험",
  title: "Culpa omnis voluptatem quos libero quo accusantium. Dolores omnis debitis quis architecto eos laudantium et.",
  description: "상상의 문을 열다",
  tags: ["체험전시", "사진", "가족", "커플", "친구", "혼자", "무료", "유료", "주차가능"],
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

  // 가격
  prices: [
    { name: "대인(만 19세 미만) 입장권", price: 60000 },
    { name: "소인(만 19세 미만) 입장권", price: 60000 },
  ],

  // 공식채널
  channels: [
    { name: "공식 사이트 바로가기", url: "https://example.com" },
    { name: "SNS 바로가기", url: "https://instagram.com" },
  ],
};

export default function DetailPage() {
  const [activeTab, setActiveTab] = useState("intro");
  const [isLiked, setIsLiked] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      const headerHeight = 56; // h-14
      const tabHeight = 49; // TabNavigation 높이
      const offset = headerHeight + tabHeight;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <HeroSection
        images={mockDetailData.images}
        category={mockDetailData.category}
        title={mockDetailData.title}
        description={mockDetailData.description}
        tags={mockDetailData.tags}
        period={mockDetailData.period}
        address={mockDetailData.address}
        age={mockDetailData.age}
        viewCount={mockDetailData.viewCount}
        likeCount={mockDetailData.likeCount}
        isLiked={isLiked}
        onBackClick={handleBackClick}
        onLikeClick={handleLikeClick}
      />

      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 소개 섹션 */}
      <ContentSection
        id="intro"
        title="소개"
        text={mockDetailData.introText}
        imageUrl={mockDetailData.introImageUrl}
      />

      {/* 이용안내 섹션 */}
      <InfoSection
        id="info"
        period={mockDetailData.period}
        operatingHours={mockDetailData.operatingHours}
        closedDays={mockDetailData.closedDays}
        contact={mockDetailData.contactNumber}
      />

      {/* 공지사항 섹션 */}
      <ContentSection
        id="notice"
        title="공지사항"
        text={mockDetailData.noticeText}
        imageUrl={mockDetailData.noticeImageUrl}
        maxHeight={280}
      />

      {/* 장소 섹션 */}
      <LocationSection id="location" address={mockDetailData.address} />

      {/* 주변 인기 카페·식당 */}
      <NearbyPlaces />

      {/* 가격 섹션 */}
      <PriceSection id="price" prices={mockDetailData.prices} />

      {/* 공식채널 섹션 */}
      <OfficialChannel id="channel" channels={mockDetailData.channels} />

      {/* 가까운 팝업스토어 */}
      <RelatedPopups />
    </div>
  );
}

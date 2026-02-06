"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCard, OnboardingLayout } from "@/components/onboarding";

const regions = [
  { name: "서울", url: "/images/onBoarding/step1/seoul.png" },
  { name: "경기", url: "/images/onBoarding/step1/gyeonggi.png" },
  { name: "인천", url: "/images/onBoarding/step1/incheon.png" },
  { name: "대전", url: "/images/onBoarding/step1/daejeon.png" },
  { name: "충북", url: "/images/onBoarding/step1/chungbuk.png" },
  { name: "충남", url: "/images/onBoarding/step1/chungnam.png" },
  { name: "부산", url: "/images/onBoarding/step1/busan.png" },
  { name: "대구", url: "/images/onBoarding/step1/daegu.png" },
  { name: "경북", url: "/images/onBoarding/step1/gyeongbuk.png" },
  { name: "광주", url: "/images/onBoarding/step1/gwangju.png" },
  { name: "전북", url: "/images/onBoarding/step1/jeonbuk.png" },
  { name: "전남", url: "/images/onBoarding/step1/jeonnam.png" },
  { name: "경남", url: "/images/onBoarding/step1/gyeongnam.png" },
  { name: "제주", url: "/images/onBoarding/step1/jeju.png" },
];

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  const handleSkip = () => {
    router.push("/onboarding/step2");
  };

  const handleNext = () => {
    // TODO: 선택된 지역 저장 (API 또는 상태관리)
    console.log("선택된 지역:", selectedRegion);
    router.push("/onboarding/step2");
  };

  return (
    <OnboardingLayout
      step={1}
      title="지역 선택"
      subtitle="관심 있는 행사 지역을 선택해주세요! (최대 1개)"
      onSkip={handleSkip}
      onNext={handleNext}
      isNextDisabled={!selectedRegion}
    >
      <div className="grid grid-cols-2 gap-5">
        {regions.map((region) => (
          <OnboardingCard
            key={region.name}
            name={region.name}
            imageUrl={region.url}
            isSelected={selectedRegion === region.name}
            onClick={() => handleRegionSelect(region.name)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
}

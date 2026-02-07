"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCard, OnboardingLayout } from "@/components/onboarding";
import { useOnboardingStep1 } from "@/queries/auth";

const regions = [
  { name: "서울", code: "SEOUL", url: "/images/onBoarding/step1/seoul.png" },
  { name: "경기", code: "GYEONGGI", url: "/images/onBoarding/step1/gyeonggi.png" },
  { name: "인천", code: "INCHEON", url: "/images/onBoarding/step1/incheon.png" },
  { name: "대전", code: "DAEJEON", url: "/images/onBoarding/step1/daejeon.png" },
  { name: "충북", code: "CHUNGBUK", url: "/images/onBoarding/step1/chungbuk.png" },
  { name: "충남", code: "CHUNGNAM", url: "/images/onBoarding/step1/chungnam.png" },
  { name: "부산", code: "BUSAN", url: "/images/onBoarding/step1/busan.png" },
  { name: "대구", code: "DAEGU", url: "/images/onBoarding/step1/daegu.png" },
  { name: "경북", code: "GYEONGBUK", url: "/images/onBoarding/step1/gyeongbuk.png" },
  { name: "광주", code: "GWANGJU", url: "/images/onBoarding/step1/gwangju.png" },
  { name: "전북", code: "JEONBUK", url: "/images/onBoarding/step1/jeonbuk.png" },
  { name: "전남", code: "JEONNAM", url: "/images/onBoarding/step1/jeonnam.png" },
  { name: "경남", code: "GYEONGNAM", url: "/images/onBoarding/step1/gyeongnam.png" },
  { name: "제주", code: "JEJU", url: "/images/onBoarding/step1/jeju.png" },
];

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    null
  );
  const { mutate: saveRegion, isPending } = useOnboardingStep1();

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  const handleSkip = () => {
    router.push("/onboarding/step2");
  };

  const handleNext = () => {
    if (!selectedRegion) return;
    const region = regions.find((r) => r.name === selectedRegion);
    if (!region) return;
    saveRegion([region.code]);
  };

  return (
    <OnboardingLayout
      step={1}
      title="지역 선택"
      subtitle="관심 있는 행사 지역을 선택해주세요! (최대 1개)"
      onSkip={handleSkip}
      onNext={handleNext}
      isNextDisabled={!selectedRegion || isPending}
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCategoryCard, OnboardingLayout } from "@/components/onboarding";

// 줄별 카테고리 (홀수줄 4개, 짝수줄 3개)
const categoryRows = [
  // 1행 (4개)
  [
    { name: "패션", url: "/images/onBoarding/step2/OnboardingFashion.png" },
    { name: "뷰티", url: "/images/onBoarding/step2/OnboardingBeauty.png" },
    { name: "F&B", url: "/images/onBoarding/step2/OnboardingFB.png" },
    { name: "캐릭터", url: "/images/onBoarding/step2/OnboardingCharacter.png" },
  ],
  // 2행 (3개)
  [
    { name: "테크", url: "/images/onBoarding/step2/OnboardingTech.png" },
    { name: "라이프스타일", url: "/images/onBoarding/step2/OnboardingLifeStyle.png" },
    { name: "가구 & 인테리어", url: "/images/onBoarding/step2/OnboardingInterior.png" },
  ],
  // 3행 (4개)
  [
    { name: "현대미술", url: "/images/onBoarding/step2/OnboardingModernArt.png" },
    { name: "사진", url: "/images/onBoarding/step2/OnboardingPhoto.png" },
    { name: "디자인", url: "/images/onBoarding/step2/OnboardingDesign.png" },
    { name: "일러스트", url: "/images/onBoarding/step2/OnboardingIllust.png" },
  ],
  // 4행 (3개)
  [
    { name: "회화", url: "/images/onBoarding/step2/OnboardingPainting.png" },
    { name: "조각", url: "/images/onBoarding/step2/OnboardingSculpture.png" },
    { name: "설치미술", url: "/images/onBoarding/step2/OnboardingArtSpace.png" },
  ],
];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((name) => name !== categoryName);
      }
      return [...prev, categoryName];
    });
  };

  const handleSkip = () => {
    router.push("/");
  };

  const handleNext = () => {
    // TODO: 선택된 카테고리 저장 (API 또는 상태관리)
    console.log("선택된 카테고리:", selectedCategories);
    router.push("/");
  };

  return (
    <OnboardingLayout
      step={2}
      title="카테고리 선택"
      subtitle="관심 있는 행사를 선택해주세요! (최소 1개)"
      onSkip={handleSkip}
      onNext={handleNext}
      isNextDisabled={selectedCategories.length === 0}
      nextLabel="완료"
    >
      <div className="flex flex-col items-center gap-5">
        {categoryRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-5">
            {row.map((category) => (
              <OnboardingCategoryCard
                key={category.name}
                name={category.name}
                imageUrl={category.url}
                isSelected={selectedCategories.includes(category.name)}
                onClick={() => handleCategorySelect(category.name)}
              />
            ))}
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}

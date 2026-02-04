"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCard, OnboardingLayout } from "@/components/onboarding";

const categories = [
  { name: "현대미술", url: "/images/onBoarding/step2/OnboardingModernArt.png" },
  { name: "회화", url: "/images/onBoarding/step2/OnboardingPainting.png" },
  { name: "조각", url: "/images/onBoarding/step2/OnboardingSculpture.png" },
  { name: "사진", url: "/images/onBoarding/step2/OnboardingPhoto.png" },
  { name: "일러스트", url: "/images/onBoarding/step2/OnboardingIllust.png" },
  { name: "디자인", url: "/images/onBoarding/step2/OnboardingDesign.png" },
  { name: "패션", url: "/images/onBoarding/step2/OnboardingFashion.png" },
  { name: "뷰티", url: "/images/onBoarding/step2/OnboardingBeauty.png" },
  { name: "캐릭터", url: "/images/onBoarding/step2/OnboardingCharacter.png" },
  { name: "식음료", url: "/images/onBoarding/step2/OnboardingFB.png" },
  { name: "라이프스타일", url: "/images/onBoarding/step2/OnboardingLifeStyle.png" },
  { name: "인테리어", url: "/images/onBoarding/step2/OnboardingInterior.png" },
  { name: "테크", url: "/images/onBoarding/step2/OnboardingTech.png" },
  { name: "아트스페이스", url: "/images/onBoarding/step2/OnboardingArtSpace.png" },
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
      subtitle="관심 있는 카테고리를 선택해주세요! (복수 선택 가능)"
      onSkip={handleSkip}
      onNext={handleNext}
      isNextDisabled={selectedCategories.length === 0}
      nextLabel="완료"
    >
      <div className="grid grid-cols-2 gap-5">
        {categories.map((category) => (
          <OnboardingCard
            key={category.name}
            name={category.name}
            imageUrl={category.url}
            isSelected={selectedCategories.includes(category.name)}
            onClick={() => handleCategorySelect(category.name)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
}

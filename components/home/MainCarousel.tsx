"use client";

import dynamic from "next/dynamic";

const MainCarouselInner = dynamic(
  () => import("./MainCarouselInner").then((mod) => mod.MainCarouselInner),
  { ssr: false }
);

export function MainCarousel() {
  return <MainCarouselInner />;
}

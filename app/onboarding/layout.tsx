import Script from "next/script";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Daum Postcode API 로드 (주소 검색용) */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
      />

      {/* Kakao Maps SDK 로드 (주소 → 좌표 변환용) */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services`}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}

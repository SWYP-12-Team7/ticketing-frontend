"use client";

import { RequireGuest } from "@/components/auth";
import { useEffect } from "react";
import Image from "next/image";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "")}&response_type=code`;

export default function LoginPage() {
  useEffect(() => {
    console.log("[KAKAO] redirect_uri (mount):", process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "");
  }, []);

  const handleKakaoLogin = () => {
    console.log("[KAKAO] redirect_uri:", process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "");
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <RequireGuest>
    <div className="flex justify-center pt-[139px] overflow-hidden">
      <div className="flex flex-col gap-51">
        <div className="flex flex-col items-center mt-30 gap-7">
          <Image
            src="/images/login/login.svg"
            alt="로그인 로고"
            width={180}
            height={60}
            // className="h-[229px] w-[410px]"
            priority
          />
          <p className="font-bold text-xl">전시가 와르르, 축제가 와르르!</p>
        </div>
        <div className="flex flex-col items-end gap-2.5">
          {/* 말풍선 (전체 SVG) */}
          <svg width="148" height="58" viewBox="0 0 148 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 말풍선 본체 */}
            <path
              d="M8 1H140C143.866 1 147 4.13401 147 8V40C147 43.866 143.866 47 140 47H120L115 57L110 47H8C4.13401 47 1 43.866 1 40V8C1 4.13401 4.13401 1 8 1Z"
              fill="white"
              stroke="#F36012"
              strokeWidth="1"
            />
            {/* 텍스트 */}
            <text x="12" y="20" textAnchor="start" fill="#F36012" fontSize="12" fontWeight="bold">
              전시와 팝업을
            </text>
            <text x="12" y="38" textAnchor="start" fill="#F36012" fontSize="12" fontWeight="bold">
              가장 빠르게 만나는 방법
            </text>
          </svg>
          <button
            onClick={handleKakaoLogin}
            className="flex items-center gap-2 rounded-lg bg-[#FEE500] px-[234.5px] py-3.25 text-body-medium-bold text-[#000000]/85 transition-opacity hover:opacity-90"
          >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C7.02944 4 3 7.16792 3 11.0833C3 13.5578 4.63119 15.7417 7.10417 17.0208L6.25 20.4167C6.20833 20.5833 6.29167 20.7083 6.41667 20.7917C6.5 20.8333 6.58333 20.875 6.66667 20.875C6.75 20.875 6.83333 20.8333 6.91667 20.7917L10.9167 18.0833C11.2708 18.125 11.6354 18.1667 12 18.1667C16.9706 18.1667 21 14.9988 21 11.0833C21 7.16792 16.9706 4 12 4Z"
              fill="#000000"
            />
          </svg>
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
    </RequireGuest>
  );
}

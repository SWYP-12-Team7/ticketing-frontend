"use client";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "")}&response_type=code`;

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-heading-xlarge">로그인</h1>
        <button
          onClick={handleKakaoLogin}
          className="flex items-center gap-2 rounded-lg bg-[#FEE500] px-6 py-3 text-body-medium-bold text-[#000000]/85 transition-opacity hover:opacity-90"
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
          카카오 로그인
        </button>
      </div>
    </div>
  );
}

/**
 * CharacterIcon (캐릭터)
 * 
 * 팝업스토어 > 캐릭터 서브카테고리 아이콘
 * - 이모티콘/얼굴 형태 디자인
 * - stroke-width: 1.5px (Figma 스펙)
 * - currentColor 사용으로 활성/비활성 색상 자동 대응
 */

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export const CharacterIcon = ({ className, ...props }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M9 9.5C9.27614 9.5 9.5 9.72386 9.5 10C9.5 10.2761 9.27614 10.5 9 10.5C8.72386 10.5 8.5 10.2761 8.5 10C8.5 9.72386 8.72386 9.5 9 9.5ZM15 9.5C15.2761 9.5 15.5 9.72386 15.5 10C15.5 10.2761 15.2761 10.5 15 10.5C14.7239 10.5 14.5 10.2761 14.5 10C14.5 9.72386 14.7239 9.5 15 9.5Z"
      fill="currentColor"
      stroke="currentColor"
    />
    <path
      d="M16.0078 13.8125C15.2749 15.0819 13.5183 15.6343 11.9981 15.6343C10.4779 15.6343 8.74109 15.1164 7.98828 13.8125M21.2109 12C21.2109 17.0871 17.0871 21.2109 12 21.2109C6.91294 21.2109 2.78906 17.0871 2.78906 12C2.78906 6.91294 6.91294 2.78906 12 2.78906C17.0871 2.78906 21.2109 6.91294 21.2109 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

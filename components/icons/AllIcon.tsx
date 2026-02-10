/**
 * AllIcon (전체보기)
 * 
 * 팝업스토어 및 전시 카테고리의 "전체보기" 아이콘
 * - 레이어 3개 겹친 형태로 "전체" 의미 표현
 * - stroke-width: 1.5px (Figma 스펙)
 * - currentColor 사용으로 활성/비활성 색상 자동 대응
 */

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export const AllIcon = ({ className, ...props }: IconProps) => (
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
      d="M20 17L12.893 20.5529C12.3299 20.8343 11.6672 20.8343 11.1041 20.5527L4 17M20 13L12.893 16.5529C12.3299 16.8343 11.6672 16.8343 11.1041 16.5527L4 13M3.78867 8.89447L11.1041 12.5527C11.6672 12.8343 12.3299 12.8343 12.893 12.5528L20.211 8.89439C20.9481 8.52589 20.9481 7.47404 20.211 7.10551L12.8944 3.44721C12.3314 3.16569 11.6686 3.16569 11.1056 3.44721L3.78872 7.10564C3.0517 7.47415 3.05167 8.52591 3.78867 8.89447Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

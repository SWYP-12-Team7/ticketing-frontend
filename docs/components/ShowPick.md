# ShowPick 컴포넌트

이벤트 카드를 슬라이더 형태로 보여주는 컴포넌트입니다.

## Import

```tsx
import { ShowPick } from "@/components/home";
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | (필수) | 섹션 타이틀 |
| `events` | `Event[]` | 목데이터 | 이벤트 데이터 배열 |
| `variant` | `"normal"` \| `"countdown"` | `"normal"` | 카드 표시 모드 |
| `className` | `string` | - | 추가 CSS 클래스 |

## Event 타입

```tsx
interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
  openDate?: Date; // countdown variant용
}
```

## 사용 예시

### 기본 사용 (normal)

```tsx
<ShowPick title="와르르 PICK!" />
```

### countdown variant (D-day 표시)

```tsx
<ShowPick
  title="오픈 예정 행사를 미리 만나보세요!"
  variant="countdown"
/>
```

### 커스텀 데이터 전달

```tsx
const myEvents = [
  {
    id: "1",
    title: "이벤트 제목",
    location: "서울 강남",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/event1.jpg",
    likeCount: 1234,
    viewCount: 5678,
    tags: ["전시", "현대미술"],
    openDate: new Date("2024-02-01"), // countdown용
  },
];

<ShowPick title="내 이벤트" events={myEvents} />
```

## Variant 차이점

| Variant | 날짜 표시 | 색상 |
|---------|----------|------|
| `normal` | `2024.01.20 - 2024.03.20` | 흰색 |
| `countdown` | `D-3 시작` | 빨간색 (#FF0000) |

## 카드 구성 요소

- 우측 상단: 하트 버튼 (찜하기)
- 태그: 최대 2개 (첫 번째: 파란 배경, 두 번째: 파란 테두리)
- 제목
- 위치 (MapPin 아이콘)
- 날짜 (Calendar 아이콘)
- 경계선
- 조회수 + 좋아요

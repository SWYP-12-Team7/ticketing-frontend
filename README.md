# 와르르 - 팝업/전시/페어 정보 서비스

팝업스토어, 전시, 페어 등 다양한 문화 행사 정보를 한 곳에서 확인하고 관리하는 웹 서비스입니다.

**배포 URL:** https://warrr.site

---

## 기술 스택

| 기술 | 버전 |
| :--- | :--- |
| Next.js | 16.1.1 |
| React | 19.2.3 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| TanStack Query | 5 |
| Zustand | 5 |
| Axios | 1 |
| Swiper | 12 |

---

## 주요 기능 (v1.0)

- **메인 페이지** - 큐레이션 캐러셀, 행사 일정, 랭킹, 개인화 추천, 무료 행사 섹션
- **검색** - 행사/큐레이션 검색
- **지도 뷰** - 카카오 지도 기반 위치 탐색
- **캘린더 뷰** - 월별 행사 일정 및 인기 행사 확인
- **행사 상세** - 행사 상세 정보, 위치, 찜하기
- **찜 관리** - 찜한 행사 목록 및 폴더 관리
- **카카오 로그인** - OAuth 소셜 로그인
- **온보딩** - 신규 사용자 취향 설정
- **설정** - 프로필, 관심사, 알림 관리

---

## 디렉토리 구조

```
├─ app/                  # Next.js App Router 페이지
├─ components/           # 기능별 UI 컴포넌트
│  ├─ home/              # 메인 페이지 섹션
│  ├─ auth/              # 인증
│  ├─ calendarview/      # 캘린더 뷰
│  ├─ search/            # 검색
│  ├─ map/               # 지도
│  ├─ detail/            # 행사 상세
│  ├─ settings/          # 설정
│  ├─ favorites/         # 찜 관리
│  ├─ onboarding/        # 온보딩
│  ├─ ui/                # 공통 UI 프리미티브
│  └─ common/            # 공유 컴포넌트
├─ store/                # Zustand 전역 상태
├─ hooks/                # 커스텀 훅
├─ services/             # API 레이어 (axios)
├─ queries/              # TanStack Query 훅
├─ types/                # TypeScript 타입 정의
└─ lib/                  # 유틸 함수
```

---

## 개발 서버 실행

```bash
npm install
npm run dev
```

---

## v1.5 리팩토링

### 1. 성능 최적화
- 불필요한 console.log 제거
- React Compiler 도입 (자동 메모이제이션)

### 2. 모니터링 시스템
- Vercel Analytics 연동
- Vercel Speed Insights 연동
- Sentry 에러 모니터링 연동

---

## Git Convention

### Branch Strategy

```
main        # 배포 브랜치
develop     # 개발 브랜치
SWYP-*      # 기능 개발 브랜치
```

### Commit Convention

| Type | Description |
| :--- | :--- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그 수정 |
| **chore** | 설정, 빌드 관련 작업 |
| **refactor** | 코드 리팩토링 |
| **style** | 코드 스타일 수정 (포맷팅 등) |
| **docs** | 문서 수정 (README, 주석 등) |

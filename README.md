# 팝업/전시/페어 알려주는 서비스

팝업스토어/전시/페어 정보를 한 곳에서 확인하고 관리하는 웹 서비스 입니다. (추후 수정)

---

## 기술 스택

- Next.js
- TypeScript
- TanStack Query
- Zustand
- Tailwind CSS

---

## 디렉토리 구조

```ts
src/
├─ app/
│  ├─ layout.tsx        // 공통 레이아웃
│  ├─ page.tsx          // 메인 페이지
│  └─ providers.tsx     // 전역 Provider (TanStack Query)
│
├─ store/               // Zustand 전역 상태 (클라이언트 상태)
├─ hooks/               // 커스텀 훅
├─ services/            // API 레이어
│  ├─ axios.ts          // axios 인스턴스
│  └─ api/              // 도메인별 API 함수
│
├─ queries/             // TanStack Query 레이어 (서버 상태)
│
├─ components/          // 공통 UI 컴포넌트
├─ types/               // 공통 타입 정의
└─ utils/               // 유틸 함수
```

## 개발 서버 실행

```
npm install
npm run dev
```

## Git Convention

### Branch Strategy

```text
main        // 배포 브랜치
develop     // 개발 브랜치
feature/*   // 기능 개발 브랜치
```

### Commit Convention

| Type         | Description                  |
| :----------- | :--------------------------- |
| **feat**     | 새로운 기능 추가             |
| **fix**      | 버그 수정                    |
| **chore**    | 설정, 빌드 관련 작업         |
| **refactor** | 코드 리팩토링                |
| **style**    | 코드 스타일 수정 (포맷팅 등) |
| **docs**     | 문서 수정 (README, 주석 등)  |

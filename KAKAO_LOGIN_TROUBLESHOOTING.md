# 카카오 로그인 400 에러 트러블슈팅 가이드

## 🔍 현재 상황
- **에러**: Request failed with status code 400
- **API**: POST /api/auth/kakao/callback?code=xxxxx
- **현재 방식**: Query Parameter

---

## ✅ FE에서 이미 개선한 사항

### 1. **중복 실행 방지 강화**
- React Strict Mode의 useEffect 중복 실행 완벽 차단
- 이미 처리한 코드 재사용 방지
- `processedCode.current`로 동일 코드 재실행 차단

### 2. **상세 로깅 추가**
- API 요청 전/후 상세 로그
- 400 에러 시 Request/Response 전체 정보 로깅
- 각 단계별 콘솔 로그로 디버깅 용이

### 3. **사용자 친화적 에러 메시지**
- 400 에러 시: "인증 코드가 만료되었거나 이미 사용되었을 수 있습니다"
- 기타 에러 시: "로그인에 실패했습니다"

---

## 📋 테스트 체크리스트

### Phase 1: 기본 확인 (가장 중요!)

#### 1.1 카카오 개발자 콘솔 확인
```
□ https://developers.kakao.com/ 접속
□ 내 애플리케이션 → 앱 설정 → 카카오 로그인
□ Redirect URI에 정확히 등록되어 있는지 확인:
  http://localhost:3000/auth/kakao/callback
□ 활성화 설정 ON 확인
□ REST API 키가 .env.local의 NEXT_PUBLIC_KAKAO_JS_KEY와 일치하는지 확인
```

#### 1.2 브라우저 완전 새로고침
```bash
# 이전 시도의 코드가 남아있을 수 있음
1. 브라우저 완전히 닫기
2. 캐시 삭제 (Cmd+Shift+Delete)
3. 새 창으로 http://localhost:3000/auth/login 접속
4. 카카오 로그인 다시 시도
```

#### 1.3 콘솔 로그 확인
```
F12 → Console 탭에서 다음 로그 확인:
- [KAKAO CALLBACK] 인증 코드 처리 시작
- [API] 카카오 로그인 요청 시작
- [API] 400 에러 상세 정보 ← 이게 가장 중요!
```

#### 1.4 네트워크 탭 확인
```
F12 → Network → callback?code=... 클릭
→ Response 탭: 에러 메시지 확인 (BE가 무슨 이유로 400을 보냈는지)
→ Headers 탭: 
  - Request URL 확인
  - Query String Parameters에 code 있는지 확인
```

---

### Phase 2: 다양한 방식 테스트

#### 2.1 현재 방식 (Query Parameter)
```typescript
// services/api/auth.ts - 현재 사용 중
params: { code }
```

#### 2.2 Request Body 방식으로 변경
```typescript
// services/api/auth.ts의 kakaoLogin 함수 내용을 교체:
const response = await axiosInstance.post<LoginResponse>(
  "/auth/kakao/callback",
  { code }  // Request Body
);
```

#### 2.3 URL-encoded 방식으로 변경
```typescript
const response = await axiosInstance.post<LoginResponse>(
  "/auth/kakao/callback",
  new URLSearchParams({ code }).toString(),
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
);
```

#### 2.4 Path Parameter 방식으로 변경
```typescript
const response = await axiosInstance.post<LoginResponse>(
  `/auth/kakao/callback/${code}`
);
```

#### 2.5 추가 파라미터 포함
```typescript
const response = await axiosInstance.post<LoginResponse>(
  "/auth/kakao/callback",
  null,
  {
    params: { 
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
    }
  }
);
```

---

### Phase 3: BE 팀에게 확인 요청

위의 모든 방식을 시도해도 400 에러가 계속되면 BE 팀에게 다음을 전달:

```
📧 BE 팀에게 전달할 정보:

1. 현재 상황
   - FE에서 POST /api/auth/kakao/callback?code=xxxxx 요청
   - 400 Bad Request 응답 받음
   - 다양한 방식 (Query Param, Request Body, URL-encoded) 모두 시도했으나 동일

2. 필요한 정보
   ✅ 정확한 API 스펙을 알려주세요:
      - Endpoint: POST /api/auth/kakao/callback 맞나요?
      - 파라미터 방식: Query/Body/Path 중 어떤 방식인가요?
      - 파라미터 이름: 'code' 맞나요?
      - Content-Type: 무엇을 기대하나요?
      - 추가 파라미터 필요한가요?
   
   ✅ 400 에러의 정확한 원인:
      - Response Body에 어떤 에러 메시지를 보내고 있나요?
      - BE 로그에 어떤 에러가 찍히나요?

3. 첨부 자료
   - 네트워크 탭 스크린샷 (Request/Response)
   - 콘솔 로그 ([API] 400 에러 상세 정보)
```

---

## 🎯 빠른 테스트 방법

### 옵션 A: Postman/Insomnia로 직접 테스트
```
1. 브라우저에서 카카오 로그인 → 콜백 URL에서 code 복사
2. Postman에서 직접 BE API 호출:
   POST https://swyp.giwon.dev/api/auth/kakao/callback?code=복사한코드
3. 어떤 응답이 오는지 확인
```

### 옵션 B: curl로 테스트
```bash
# code를 실제 카카오에서 받은 코드로 교체
curl -X POST "https://swyp.giwon.dev/api/auth/kakao/callback?code=YOUR_CODE" \
  -H "Content-Type: application/json" \
  -v
```

---

## 🔧 빠른 방식 전환 (services/api/auth-backup.ts 참고)

1. `services/api/auth-backup.ts` 파일 열기
2. 테스트하고 싶은 방식 복사
3. `services/api/auth.ts`의 `kakaoLogin` 함수 내용 교체
4. 브라우저 새로고침 후 다시 로그인 시도
5. 콘솔 로그 확인

---

## ❓ 자주 발생하는 원인

### 1. 카카오 코드가 이미 사용됨 (가장 흔함)
- **증상**: 같은 코드로 여러 번 요청
- **해결**: 브라우저 완전히 닫고 새로 로그인

### 2. Redirect URI 불일치
- **증상**: 카카오 개발자 콘솔 설정 ≠ 실제 Redirect URI
- **해결**: 콘솔에서 정확히 등록 확인

### 3. BE API 스펙 불일치
- **증상**: FE가 보내는 방식 ≠ BE가 기대하는 방식
- **해결**: BE 팀에게 정확한 스펙 확인

### 4. 코드 만료
- **증상**: 카카오 인증 후 오래 기다림
- **해결**: 빠르게 진행 (코드 유효기간 짧음)

---

## 📞 추가 도움이 필요하면

1. 콘솔의 `[API] 400 에러 상세 정보` 로그 전체 캡처
2. 네트워크 탭의 Response Body 캡처
3. 위 두 가지를 BE 팀에게 전달

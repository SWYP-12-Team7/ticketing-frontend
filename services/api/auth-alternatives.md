# 카카오 로그인 API 대안 방식들

현재 사용 중: **Query Parameter 방식**

## 1. Query Parameter 방식 (현재 적용됨) ✅
```typescript
const response = await axiosInstance.post<LoginResponse>(
  "/auth/kakao/callback",
  null,
  { params: { code } }
);
```

**요청 형태:**
```
POST /auth/kakao/callback?code=xxxxx
Content-Type: application/json
```

---

## 2. Request Body JSON 방식
```typescript
const response = await axiosInstance.post<LoginResponse>(
  "/auth/kakao/callback",
  { code }
);
```

**요청 형태:**
```
POST /auth/kakao/callback
Content-Type: application/json
Body: { "code": "xxxxx" }
```

---

## 3. URL-encoded 방식
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

**요청 형태:**
```
POST /auth/kakao/callback
Content-Type: application/x-www-form-urlencoded
Body: code=xxxxx
```

---

## 4. Path Parameter 방식
```typescript
const response = await axiosInstance.post<LoginResponse>(
  `/auth/kakao/callback/${code}`
);
```

**요청 형태:**
```
POST /auth/kakao/callback/xxxxx
```

---

## 백엔드 확인 방법

### Spring Boot Controller 예시

**Query Parameter 방식:**
```java
@PostMapping("/auth/kakao/callback")
public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
    // ...
}
```

**Request Body 방식:**
```java
@PostMapping("/auth/kakao/callback")
public ResponseEntity<?> kakaoCallback(@RequestBody KakaoCodeRequest request) {
    // ...
}
```

**Path Parameter 방식:**
```java
@PostMapping("/auth/kakao/callback/{code}")
public ResponseEntity<?> kakaoCallback(@PathVariable String code) {
    // ...
}
```

---

## 디버깅 방법

1. **브라우저 개발자 도구 → Network 탭**
   - Request URL 확인
   - Request Headers 확인
   - Request Payload/Query String Parameters 확인

2. **백엔드 로그 확인**
   - 어떤 파라미터를 받았는지 확인
   - 어떤 에러 메시지가 있는지 확인

3. **Postman/Insomnia로 직접 테스트**
   - 여러 방식을 직접 시도해보기

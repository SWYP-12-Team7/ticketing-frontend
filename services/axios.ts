import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: Access Token 부착
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 상태 관리
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onTokenRefreshed(token: string) {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
}

function onTokenRefreshFailed(error: unknown) {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
}

// 응답 인터셉터: 401 시 토큰 갱신 후 재시도, 403 시 로그아웃
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 403 Forbidden: 권한 없음 → 토큰이 있을 때만 로그아웃 처리
    // ⚠️ timeline, taste 같은 부가 기능은 403 허용 (로그아웃 안 함)
    if (error.response?.status === 403) {
      const url = error.config?.url || '';
      console.error("🚨 [403 FORBIDDEN]", {
        url,
        method: error.config?.method,
        data: error.response?.data,
      });
      
      // timeline, taste API는 403이어도 로그아웃하지 않음
      const nonCriticalApis = ['/timeline', '/taste'];
      if (nonCriticalApis.some(api => url.includes(api))) {
        console.warn(`[403 허용] ${url} - 로그아웃하지 않음 (부가 기능)`);
        return Promise.reject(error);
      }
      
      // 나머지 중요한 API는 로그아웃 처리
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        console.error("🚪 [LOGOUT TRIGGERED] 403으로 인한 로그아웃:", url);
        console.warn(`[403 로그아웃] ${url} - 자동 로그아웃 실행`);
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }

    // 이미 갱신 중이면 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        "/api/auth/refresh",
        null,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      useAuthStore.getState().login(
        useAuthStore.getState().user!,
        data.accessToken,
        data.refreshToken
      );

      onTokenRefreshed(data.accessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      onTokenRefreshFailed(refreshError);
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

/**
 * 유저 정보 타입
 */
interface User {
  id: string;
  nickname: string;
  email?: string;
  profileImage?: string;
}

/**
 * UserContext 값 타입
 */
interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

/**
 * UserProvider 컴포넌트
 * - 전역 유저 정보 관리
 * - 로그인/로그아웃 상태 관리
 * - 유저 정보 API 호출
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 유저 정보 가져오기
   */
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/user/me');
      // const data = await response.json();
      // setUser(data);

      // 임시 목데이터
      await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 시뮬레이션
      setUser({
        id: "user-1",
        nickname: "스위프",
        email: "swyp@example.com",
        profileImage: "/images/default-profile.png",
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: UserContextValue = {
    user,
    isLoading,
    error,
    refetchUser: fetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * useUser 훅
 * - 유저 정보 접근
 * - Provider 내부에서만 사용 가능
 *
 * @example
 * const { user, isLoading } = useUser();
 * if (user) {
 *   console.log(user.nickname);
 * }
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

/**
 * useUserNickname 훅
 * - 유저 닉네임만 간편하게 가져오기
 * - 로딩 중이거나 유저 정보가 없으면 기본값 반환
 *
 * @param defaultNickname 기본 닉네임 (기본값: "사용자")
 * @returns 유저 닉네임
 *
 * @example
 * const nickname = useUserNickname("게스트");
 */
export function useUserNickname(defaultNickname = "사용자"): string {
  const { user, isLoading } = useUser();
  if (isLoading || !user) {
    return defaultNickname;
  }
  return user.nickname;
}

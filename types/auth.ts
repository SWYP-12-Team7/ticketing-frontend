export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  onboardingCompleted?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

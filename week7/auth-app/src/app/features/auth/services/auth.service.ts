import { signIn, signOut, getSession } from "next-auth/react";
import { AuthResponse, AuthProvider } from "../types/auth.types";
import {
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
} from "../schemas/auth.schema";

class AuthService {
  // OAuth 로그인
  async signInWithOAuth(provider: AuthProvider, redirectUrl?: string) {
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: redirectUrl || "/",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다"
      );
    }
  }

  // 이메일/비밀번호 로그인
  async signInWithCredentials(data: LoginFormData): Promise<AuthResponse> {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다");
      }

      return {
        success: true,
        data: result,
        message: "로그인이 완료되었습니다",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "로그인 실패",
      };
    }
  }

  // 회원가입
  async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "회원가입 실패");
      }

      return {
        success: true,
        data: result.data,
        message: "회원가입이 완료되었습니다",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "회원가입 실패",
      };
    }
  }

  // 로그아웃
  async signOut(redirectUrl?: string) {
    try {
      await signOut({
        redirect: true,
        callbackUrl: redirectUrl || "/",
      });
    } catch (error) {
      throw new Error("로그아웃 중 오류가 발생했습니다");
    }
  }

  // 비밀번호 재설정 요청
  async requestPasswordReset(
    data: ResetPasswordFormData
  ): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "비밀번호 재설정 요청 실패");
      }

      return {
        success: true,
        message: "비밀번호 재설정 이메일이 발송되었습니다",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "비밀번호 재설정 요청 실패",
      };
    }
  }

  // 비밀번호 변경
  async changePassword(data: ChangePasswordFormData): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "비밀번호 변경 실패");
      }

      return {
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "비밀번호 변경 실패",
      };
    }
  }

  // 현재 세션 가져오기
  async getCurrentSession() {
    try {
      const session = await getSession();
      return session;
    } catch (error) {
      throw new Error("세션 정보를 가져올 수 없습니다");
    }
  }

  // 이메일 중복 확인
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      const result = await response.json();
      return result.exists || false;
    } catch (error) {
      return false;
    }
  }
}

// 싱글톤 패턴으로 export
export const authService = new AuthService();

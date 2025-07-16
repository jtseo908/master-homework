import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import {
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  ChangePasswordFormData,
} from "../schemas/auth.schema";
import { AuthProvider, MutationResult } from "../types/auth.types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  checkEmail: (email: string) =>
    [...authKeys.all, "check-email", email] as const,
} as const;

// 세션 훅
export const useAuthSession = () => {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user || null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  };
};

// OAuth 로그인 훅
export const useOAuthSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      provider,
      redirectUrl,
    }: {
      provider: AuthProvider;
      redirectUrl?: string;
    }) => authService.signInWithOAuth(provider, redirectUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      router.refresh();
    },
    onError: (error) => {
      console.error("OAuth 로그인 실패:", error);
    },
  });
};

// 이메일 로그인 훅
export const useEmailSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      authService.signInWithCredentials(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: authKeys.session() });
        router.push("/");
      }
    },
    onError: (error) => {
      console.error("이메일 로그인 실패:", error);
    },
  });
};

// 회원가입 훅
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (result) => {
      if (result.success) {
        router.push("/auth/login?message=registration-success");
      }
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
    },
  });
};

// 로그아웃 훅
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (redirectUrl?: string) => authService.signOut(redirectUrl),
    onSuccess: () => {
      queryClient.clear(); // 모든 쿼리 캐시 클리어
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
};

// 비밀번호 재설정 요청 훅
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authService.requestPasswordReset(data),
    onError: (error) => {
      console.error("비밀번호 재설정 요청 실패:", error);
    },
  });
};

// 비밀번호 변경 훅
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      authService.changePassword(data),
    onError: (error) => {
      console.error("비밀번호 변경 실패:", error);
    },
  });
};

// 이메일 중복 확인 훅
export const useCheckEmail = (email: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: authKeys.checkEmail(email),
    queryFn: () => authService.checkEmailExists(email),
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });
};

// 인증이 필요한 페이지를 위한 훅
export const useRequireAuth = (redirectTo: string = "/auth/login") => {
  const { isAuthenticated, isLoading } = useAuthSession();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};

// 로그인한 사용자가 접근하면 안 되는 페이지를 위한 훅 (로그인/회원가입 페이지 등)
export const useRedirectIfAuthenticated = (redirectTo: string = "/") => {
  const { isAuthenticated, isLoading } = useAuthSession();
  const router = useRouter();

  if (!isLoading && isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};

// 통합 인증 훅 - 모든 인증 관련 기능을 하나로 묶음
export const useAuth = () => {
  const session = useAuthSession();
  const oauthSignIn = useOAuthSignIn();
  const emailSignIn = useEmailSignIn();
  const register = useRegister();
  const signOut = useSignOut();
  const passwordReset = usePasswordReset();
  const changePassword = useChangePassword();

  return {
    // 세션 정보
    ...session,

    // 로그인/회원가입
    signInWithOAuth: oauthSignIn.mutate,
    signInWithEmail: emailSignIn.mutate,
    register: register.mutate,
    signOut: signOut.mutate,

    // 비밀번호 관리
    requestPasswordReset: passwordReset.mutate,
    changePassword: changePassword.mutate,

    // 로딩 상태
    isSigningIn: oauthSignIn.isPending || emailSignIn.isPending,
    isRegistering: register.isPending,
    isSigningOut: signOut.isPending,
    isChangingPassword: changePassword.isPending,
    isRequestingReset: passwordReset.isPending,

    // 에러 상태
    signInError: oauthSignIn.error || emailSignIn.error,
    registerError: register.error,
    signOutError: signOut.error,
    passwordResetError: passwordReset.error,
    changePasswordError: changePassword.error,

    // 성공 상태
    isSignInSuccess: oauthSignIn.isSuccess || emailSignIn.isSuccess,
    isRegisterSuccess: register.isSuccess,
    isPasswordResetSuccess: passwordReset.isSuccess,
    isChangePasswordSuccess: changePassword.isSuccess,
  };
};

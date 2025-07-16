"use client";

import { useCallback } from "react";
import { LoginFormPresenter } from "./LoginForm.presenter";
import { useLoginForm } from "../../hooks/useFormValidation";
import { useAuth } from "../../hooks/useAuth";
import { LoginFormData } from "../../schemas/auth.schema";

interface LoginFormContainerProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export const LoginFormContainer = ({
  onSuccess,
  redirectUrl,
}: LoginFormContainerProps) => {
  const { signInWithEmail, signInWithOAuth, isSigningIn, signInError } =
    useAuth();

  // 이메일 로그인 처리
  const handleEmailLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        await signInWithEmail(data);
        onSuccess?.();
      } catch (error) {
        console.error("이메일 로그인 실패:", error);
      }
    },
    [signInWithEmail, onSuccess]
  );

  // Google 로그인 처리
  const handleGoogleLogin = useCallback(async () => {
    try {
      await signInWithOAuth({ provider: "google", redirectUrl });
      onSuccess?.();
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  }, [signInWithOAuth, redirectUrl, onSuccess]);

  // 폼 훅 사용
  const { form, handleSubmit, isSubmitting, getFieldError } =
    useLoginForm(handleEmailLogin);

  return (
    <LoginFormPresenter
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      getFieldError={getFieldError}
      onGoogleSignIn={handleGoogleLogin}
      isSigningIn={isSigningIn}
      signInError={signInError}
    />
  );
};

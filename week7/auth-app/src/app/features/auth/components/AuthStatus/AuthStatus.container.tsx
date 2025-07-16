"use client";

import { useCallback } from "react";
import { AuthStatusPresenter } from "./AuthStatus.presenter";
import { useAuth } from "../../hooks/useAuth";

interface AuthStatusContainerProps {
  onSignOut?: () => void;
}

export const AuthStatusContainer = ({
  onSignOut,
}: AuthStatusContainerProps) => {
  const { session, isLoading, isAuthenticated, signOut, isSigningOut } =
    useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut("/");
      onSignOut?.();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  }, [signOut, onSignOut]);

  return (
    <AuthStatusPresenter
      session={session}
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
    />
  );
};

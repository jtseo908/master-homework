"use client";

import styled from "@emotion/styled";
import { Button } from "@/shared/components";
import { tokens } from "@/shared/design-system/tokens";
import { ExtendedSession } from "../../types/auth.types";

interface AuthStatusPresenterProps {
  session: ExtendedSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onSignOut: () => void;
  isSigningOut: boolean;
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing[4]};
  padding: ${tokens.spacing[6]};
  background: ${tokens.colors.background.primary};
  border-radius: ${tokens.borderRadius.xl};
  box-shadow: ${tokens.shadows.lg};
  max-width: 400px;
  margin: 0 auto;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing[3]};
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid ${tokens.colors.primary[200]};
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary[400]},
    ${tokens.colors.primary[600]}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${tokens.typography.fontSize["2xl"]};
  font-weight: ${tokens.typography.fontWeight.bold};
`;

const UserName = styled.h2`
  margin: 0;
  font-size: ${tokens.typography.fontSize.xl};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.text.primary};
  text-align: center;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: ${tokens.typography.fontSize.base};
  color: ${tokens.colors.text.secondary};
  text-align: center;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: ${tokens.spacing[4]};
`;

const Title = styled.h1`
  margin: 0 0 ${tokens.spacing[2]} 0;
  font-size: ${tokens.typography.fontSize["2xl"]};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.text.primary};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${tokens.typography.fontSize.base};
  color: ${tokens.colors.text.secondary};
  line-height: ${tokens.typography.lineHeight.relaxed};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${tokens.colors.neutral[200]};
  border-top: 3px solid ${tokens.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatusBadge = styled.div`
  padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
  background: ${tokens.colors.semantic.success}15;
  border: 1px solid ${tokens.colors.semantic.success}30;
  border-radius: ${tokens.borderRadius.full};
  color: ${tokens.colors.semantic.success};
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
`;

// Presentational Component
export const AuthStatusPresenter = ({
  session,
  isLoading,
  isAuthenticated,
  onSignOut,
  isSigningOut,
}: AuthStatusPresenterProps) => {
  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
        <Description>인증 상태를 확인하고 있습니다...</Description>
      </Container>
    );
  }

  if (isAuthenticated && session?.user) {
    const { user } = session;
    const userInitial =
      user.name?.charAt(0).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U";

    return (
      <Container>
        <StatusBadge>로그인됨</StatusBadge>

        <UserInfo>
          {user.image ? (
            <Avatar src={user.image} alt={user.name || "사용자"} />
          ) : (
            <AvatarPlaceholder>{userInitial}</AvatarPlaceholder>
          )}

          <UserName>{user.name || "사용자"}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>

        <Button
          variant="outline"
          size="lg"
          onClick={onSignOut}
          isLoading={isSigningOut}
        >
          로그아웃
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <WelcomeMessage>
        <Title>안녕하세요! 👋</Title>
        <Description>
          로그인하여 서비스의 모든 기능을 이용해보세요.
          <br />
          안전하고 빠른 인증 시스템을 제공합니다.
        </Description>
      </WelcomeMessage>
    </Container>
  );
};

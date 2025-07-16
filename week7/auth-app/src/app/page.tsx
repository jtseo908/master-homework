"use client";

import styled from "@emotion/styled";
import { tokens } from "@/shared/design-system/tokens";
import { AuthStatus, LoginForm, useAuthSession } from "./features/auth";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary[50]} 0%,
    ${tokens.colors.primary[100]} 100%
  );
  padding: ${tokens.spacing[8]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${tokens.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${tokens.typography.fontSize["4xl"]};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.text.primary};
  margin: 0 0 ${tokens.spacing[4]} 0;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary[600]},
    ${tokens.colors.primary[800]}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${tokens.typography.fontSize.xl};
  color: ${tokens.colors.text.secondary};
  margin: 0;
  max-width: 600px;
  line-height: ${tokens.typography.lineHeight.relaxed};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[6]};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${tokens.spacing[6]};
  margin-top: ${tokens.spacing[12]};
  max-width: 900px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: ${tokens.colors.background.primary};
  padding: ${tokens.spacing[6]};
  border-radius: ${tokens.borderRadius.xl};
  box-shadow: ${tokens.shadows.md};
  text-align: center;
  border: 1px solid ${tokens.colors.neutral[200]};
  transition: all ${tokens.animation.duration.normal}
    ${tokens.animation.easing.easeInOut};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${tokens.shadows.lg};
    border-color: ${tokens.colors.primary[200]};
  }
`;

const FeatureIcon = styled.div`
  font-size: ${tokens.typography.fontSize["3xl"]};
  margin-bottom: ${tokens.spacing[4]};
`;

const FeatureTitle = styled.h3`
  font-size: ${tokens.typography.fontSize.xl};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0 0 ${tokens.spacing[2]} 0;
`;

const FeatureDescription = styled.p`
  font-size: ${tokens.typography.fontSize.base};
  color: ${tokens.colors.text.secondary};
  margin: 0;
  line-height: ${tokens.typography.lineHeight.relaxed};
`;

const TechBadge = styled.span`
  display: inline-block;
  padding: ${tokens.spacing[1]} ${tokens.spacing[3]};
  background: ${tokens.colors.primary[100]};
  color: ${tokens.colors.primary[700]};
  border-radius: ${tokens.borderRadius.full};
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  margin: 0 ${tokens.spacing[1]} ${tokens.spacing[2]} 0;
`;

const TechStack = styled.div`
  margin-top: ${tokens.spacing[4]};
  text-align: center;
`;

const TechTitle = styled.h4`
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0 0 ${tokens.spacing[3]} 0;
`;

export default function Home() {
  const { isAuthenticated } = useAuthSession();

  return (
    <Container>
      <Header>
        <Title>Auth Demo</Title>
        <Subtitle>Frontend master 7주차 과제입니다.</Subtitle>
      </Header>

      <ContentWrapper>
        {isAuthenticated ? <AuthStatus /> : <LoginForm />}
      </ContentWrapper>
    </Container>
  );
}

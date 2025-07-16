"use client";

import { UseFormReturn } from "react-hook-form";
import styled from "@emotion/styled";
import { Button, Input } from "@/shared/components";
import { tokens } from "@/shared/design-system/tokens";
import { LoginFormData } from "../../schemas/auth.schema";

// Props 인터페이스
interface LoginFormPresenterProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  getFieldError: (fieldName: keyof LoginFormData) => string | undefined;
  onGoogleSignIn: () => void;
  isSigningIn: boolean;
  signInError?: Error | null;
}

// Styled Components
const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${tokens.spacing[8]};
  background: ${tokens.colors.background.primary};
  border-radius: ${tokens.borderRadius.xl};
  box-shadow: ${tokens.shadows.lg};
`;

const FormTitle = styled.h1`
  font-size: ${tokens.typography.fontSize["2xl"]};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${tokens.colors.text.primary};
  text-align: center;
  margin: 0 0 ${tokens.spacing[6]} 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[4]};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[3]};
  margin-top: ${tokens.spacing[2]};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${tokens.spacing[4]} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${tokens.colors.neutral[200]};
  }
`;

const DividerText = styled.span`
  padding: 0 ${tokens.spacing[4]};
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.text.tertiary};
`;

const ErrorMessage = styled.div`
  padding: ${tokens.spacing[3]};
  background: ${tokens.colors.semantic.error}10;
  border: 1px solid ${tokens.colors.semantic.error}30;
  border-radius: ${tokens.borderRadius.md};
  color: ${tokens.colors.semantic.error};
  font-size: ${tokens.typography.fontSize.sm};
  text-align: center;
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjIgOC4xVjEySDEzLjhDMTMuNSAxMy4zIDEyLjcgMTQuMyAxMS41IDE0LjlMMTQuNCAxNy4xQzE2LjggMTQuOSAxOCAxMS44IDE4IDguNUMxOCA3LjcgMTcuOSA2LjkgMTcuNyA2LjJIMTAuMlY4LjFaIiBmaWxsPSIjNDE4MEY0Ii8+CjxwYXRoIGQ9Ik00LjggOS42QzQuNiA5IDQuNSA4LjMgNC41IDcuNUM0LjUgNi43IDQuNiA2IDQuOCA1LjRMMi4xIDMuM0MxLjQgNC42IDEgNiAxIDcuNUMxIDkgMS40IDEwLjQgMi4xIDExLjdMNC44IDkuNloiIGZpbGw9IiNGQkJDMDQiLz4KPHBhdGggZD0iTTEwLjIgM0MxMS45IDMgMTMuNSAzLjYgMTQuNyA0LjdMMTcuMyAyLjFDMTUuNSAwLjQgMTMgLTAuNSAxMC4yIC0wLjVDNi4yIC0wLjUgMi44IDEuOSAxLjEgNS40TDMuOCA3LjVDNC41IDUuMSA3LjEgMyAxMC4yIDNaIiBmaWxsPSIjRUE0MzM1Ii8+CjxwYXRoIGQ9Ik0xMC4yIDE1QzcuMSAxNSA0LjUgMTIuOSAzLjggMTAuNUwxLjEgMTIuNkMyLjggMTYuMSA2LjIgMTguNSAxMC4yIDE4LjVDMTMgMTguNSAxNS4zIDE3LjUgMTcuMSAxNS44TDE0LjQgMTMuN0MxMy4zIDE0LjUgMTEuOCAxNSAxMC4yIDE1WiIgZmlsbD0iIzM0QTg1MyIvPgo8L3N2Zz4K")
    no-repeat center;
  background-size: contain;
`;

const GoogleButton = styled(Button)`
  width: 100%;
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.primary[600]};
  font-size: ${tokens.typography.fontSize.sm};
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: ${tokens.spacing[2]};
  text-align: center;

  &:hover {
    color: ${tokens.colors.primary[700]};
  }
`;

// Presentational Component
export const LoginFormPresenter = ({
  form,
  onSubmit,
  isSubmitting,
  getFieldError,
  onGoogleSignIn,
  isSigningIn,
  signInError,
}: LoginFormPresenterProps) => {
  const { register } = form;

  return (
    <FormContainer>
      <FormTitle>로그인</FormTitle>

      {signInError && (
        <ErrorMessage>
          {signInError.message || "로그인 중 오류가 발생했습니다"}
        </ErrorMessage>
      )}

      <Form onSubmit={onSubmit}>
        <Input
          {...register("email")}
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          error={getFieldError("email")}
          isFullWidth
        />

        <Input
          {...register("password")}
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          error={getFieldError("password")}
          isFullWidth
        />

        <ButtonGroup>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSigningIn}
          >
            로그인
          </Button>

          <ForgotPasswordLink type="button">
            비밀번호를 잊으셨나요?
          </ForgotPasswordLink>
        </ButtonGroup>
      </Form>

      <Divider>
        <DividerText>또는</DividerText>
      </Divider>

      <GoogleButton
        variant="outline"
        size="lg"
        leftIcon={<GoogleIcon />}
        onClick={onGoogleSignIn}
        isLoading={isSigningIn}
        disabled={isSubmitting}
        className="w-full"
      >
        Google로 계속하기
      </GoogleButton>
    </FormContainer>
  );
};

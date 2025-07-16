import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import styled from "@emotion/styled";
import { tokens } from "../../design-system/tokens";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isFullWidth?: boolean;
}

const InputWrapper = styled.div<{ isFullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[1]};
  width: ${({ isFullWidth }) => (isFullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.text.primary};
  line-height: ${tokens.typography.lineHeight.tight};
`;

const InputContainer = styled.div<{ hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  &:focus-within {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
    border-radius: ${tokens.borderRadius.md};
  }

  ${({ hasError }) =>
    hasError &&
    `
    &:focus-within {
      outline-color: ${tokens.colors.semantic.error};
    }
  `}
`;

const StyledInput = styled.input<{
  hasError?: boolean;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
}>`
  width: 100%;
  border: 1px solid
    ${({ hasError }) =>
      hasError ? tokens.colors.semantic.error : tokens.colors.neutral[300]};
  border-radius: ${tokens.borderRadius.md};
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  font-size: ${tokens.typography.fontSize.base};
  font-family: ${tokens.typography.fontFamily.sans.join(", ")};
  color: ${tokens.colors.text.primary};
  background-color: ${tokens.colors.background.primary};
  transition: all ${tokens.animation.duration.fast}
    ${tokens.animation.easing.easeInOut};

  /* Icon padding adjustments */
  ${({ hasLeftIcon }) => hasLeftIcon && `padding-left: ${tokens.spacing[10]};`}
  ${({ hasRightIcon }) =>
    hasRightIcon && `padding-right: ${tokens.spacing[10]};`}
  
  &::placeholder {
    color: ${tokens.colors.text.tertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ hasError }) =>
      hasError ? tokens.colors.semantic.error : tokens.colors.neutral[400]};
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) =>
      hasError ? tokens.colors.semantic.error : tokens.colors.primary[500]};
    box-shadow: 0 0 0 3px
      ${({ hasError }) =>
        hasError
          ? `${tokens.colors.semantic.error}20`
          : `${tokens.colors.primary[500]}20`};
  }

  &:disabled {
    background-color: ${tokens.colors.neutral[100]};
    border-color: ${tokens.colors.neutral[200]};
    color: ${tokens.colors.text.tertiary};
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div<{ position: "left" | "right" }>`
  position: absolute;
  ${({ position }) => position}: ${tokens.spacing[3]};
  display: flex;
  align-items: center;
  color: ${tokens.colors.text.tertiary};
  pointer-events: none;
  z-index: 1;
`;

const HelperText = styled.div<{ isError?: boolean }>`
  font-size: ${tokens.typography.fontSize.sm};
  color: ${({ isError }) =>
    isError ? tokens.colors.semantic.error : tokens.colors.text.tertiary};
  line-height: ${tokens.typography.lineHeight.tight};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <InputWrapper isFullWidth={isFullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        <InputContainer hasError={hasError}>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}

          <StyledInput
            ref={ref}
            id={inputId}
            hasError={hasError}
            hasLeftIcon={Boolean(leftIcon)}
            hasRightIcon={Boolean(rightIcon)}
            {...props}
          />

          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </InputContainer>

        {(error || helperText) && (
          <HelperText isError={hasError}>{error || helperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = "Input";

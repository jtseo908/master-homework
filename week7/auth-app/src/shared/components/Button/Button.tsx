import { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "@emotion/styled";
import { tokens } from "../../design-system/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[2]};
  border: 1px solid transparent;
  border-radius: ${tokens.borderRadius.md};
  font-family: ${tokens.typography.fontFamily.sans.join(", ")};
  font-weight: ${tokens.typography.fontWeight.medium};
  transition: all ${tokens.animation.duration.fast}
    ${tokens.animation.easing.easeInOut};
  cursor: pointer;
  position: relative;

  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case "sm":
        return `
          padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
          font-size: ${tokens.typography.fontSize.sm};
          min-height: 2rem;
        `;
      case "lg":
        return `
          padding: ${tokens.spacing[4]} ${tokens.spacing[6]};
          font-size: ${tokens.typography.fontSize.lg};
          min-height: 3rem;
        `;
      default:
        return `
          padding: ${tokens.spacing[3]} ${tokens.spacing[5]};
          font-size: ${tokens.typography.fontSize.base};
          min-height: 2.5rem;
        `;
    }
  }}

  /* Variant styles */
  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background-color: ${tokens.colors.primary[600]};
          color: ${tokens.colors.text.inverse};
          box-shadow: ${tokens.shadows.sm};
          
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.primary[700]};
            box-shadow: ${tokens.shadows.md};
          }
          
          &:active:not(:disabled) {
            background-color: ${tokens.colors.primary[800]};
            box-shadow: ${tokens.shadows.sm};
          }
        `;
      case "secondary":
        return `
          background-color: ${tokens.colors.neutral[100]};
          color: ${tokens.colors.text.primary};
          
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.neutral[200]};
          }
          
          &:active:not(:disabled) {
            background-color: ${tokens.colors.neutral[300]};
          }
        `;
      case "outline":
        return `
          background-color: transparent;
          color: ${tokens.colors.primary[600]};
          border-color: ${tokens.colors.primary[600]};
          
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.primary[50]};
            border-color: ${tokens.colors.primary[700]};
          }
          
          &:active:not(:disabled) {
            background-color: ${tokens.colors.primary[100]};
          }
        `;
      case "ghost":
        return `
          background-color: transparent;
          color: ${tokens.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background-color: ${tokens.colors.neutral[100]};
            color: ${tokens.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background-color: ${tokens.colors.neutral[200]};
          }
        `;
    }
  }}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading state */
  ${({ isLoading }) =>
    isLoading &&
    `
    pointer-events: none;
  `}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </StyledButton>
  );
};

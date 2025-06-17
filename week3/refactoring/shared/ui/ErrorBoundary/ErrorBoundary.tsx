import React, { Component, ReactNode } from "react";
import ErrorBoundaryFallback from "./ErrorBoundaryFallback";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 사용자 정의 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);

    // 개발 환경에서 에러 정보 출력
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Error Boundary Details");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 0);
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetErrorBoundary);
      }

      return (
        <ErrorBoundaryFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorBoundary}
          isolate={this.props.isolate}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

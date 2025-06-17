import React from "react";

interface ErrorBoundaryFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  resetErrorBoundary: () => void;
  isolate?: boolean;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  errorInfo,
  resetErrorBoundary,
  isolate = false,
}) => {
  const isProduction = process.env.NODE_ENV === "production";

  const containerStyle: React.CSSProperties = {
    padding: isolate ? "16px" : "24px",
    margin: "16px 0",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const titleStyle: React.CSSProperties = {
    color: "#dc2626",
    fontSize: isolate ? "16px" : "20px",
    fontWeight: "600",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const messageStyle: React.CSSProperties = {
    color: "#7f1d1d",
    fontSize: "14px",
    marginBottom: "16px",
    lineHeight: "1.5",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  };

  const detailsStyle: React.CSSProperties = {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fee2e2",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#991b1b",
    maxHeight: "200px",
    overflow: "auto",
  };

  return (
    <div style={containerStyle} role="alert">
      <h2 style={titleStyle}>
        <span>⚠️</span>
        {isolate ? "컴포넌트 오류" : "애플리케이션 오류가 발생했습니다"}
      </h2>

      <p style={messageStyle}>
        {isProduction
          ? "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          : error.message || "알 수 없는 오류가 발생했습니다."}
      </p>

      <button
        style={buttonStyle}
        onClick={resetErrorBoundary}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#b91c1c";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#dc2626";
        }}
      >
        다시 시도
      </button>

      {!isProduction && (
        <details style={detailsStyle}>
          <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
            개발자 정보 (클릭하여 상세 보기)
          </summary>
          <div>
            <strong>Error:</strong> {error.name}
            <br />
            <strong>Message:</strong> {error.message}
            <br />
            <strong>Stack:</strong>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {error.stack}
            </pre>
            {errorInfo && (
              <>
                <strong>Component Stack:</strong>
                <pre style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
                  {errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default ErrorBoundaryFallback;

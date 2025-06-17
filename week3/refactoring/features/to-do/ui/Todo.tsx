import React, { Suspense } from "react";
import { useTodos } from "../hooks";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import ErrorBoundary from "../../../shared/ui/ErrorBoundary/ErrorBoundary";
import { Footer } from "../../../widgets";

const Todo = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, refresh } =
    useTodos();

  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    lineHeight: "1.6",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    color: loading ? "#dc2626" : "#1e40af",
    marginBottom: "8px",
    textAlign: "center" as const,
    transition: "color 0.3s ease",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#6b7280",
    textAlign: "center" as const,
    marginBottom: "32px",
  };

  return (
    <ErrorBoundary
      fallback={(error, resetErrorBoundary) => (
        <div style={containerStyle}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#dc2626", margin: "0 0 12px 0" }}>
              ⚠️ 오류가 발생했습니다
            </h2>
            <p style={{ color: "#7f1d1d", margin: "0 0 16px 0" }}>
              {error.message || "예상치 못한 오류가 발생했습니다."}
            </p>
            <div
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <button
                onClick={resetErrorBoundary}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <div style={containerStyle}>
        <h1 style={titleStyle}>📋 할 일 목록 관리 애플리케이션</h1>
        <p style={subtitleStyle}>
          추가하고 싶은 할 일을 입력하신 후, 아래 버튼을 눌러주세요.
        </p>

        <TodoForm onAddTodo={addTodo} />

        <hr
          style={{
            border: "none",
            height: "1px",
            backgroundColor: "#e5e7eb",
            margin: "24px 0",
          }}
        />

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#f0f9ff",
              border: "2px dashed #3b82f6",
              borderRadius: "8px",
              color: "#1e40af",
            }}
          >
            <div style={{ marginBottom: "16px", fontSize: "48px" }}>⏳</div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              할 일 목록을 불러오고 있습니다...
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              잠시만 기다려주세요.
            </div>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        )}

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Todo;

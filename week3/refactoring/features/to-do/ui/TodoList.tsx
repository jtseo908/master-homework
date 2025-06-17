import React from "react";
import { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export const TodoList = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        <div style={{ marginBottom: "12px", fontSize: "24px" }}>📝</div>
        등록된 할 일이 없습니다.
        <br />
        위에서 새로운 할 일을 추가해보세요!
      </div>
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
          할 일 목록
        </h3>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          완료: {completedCount} / 전체: {totalCount}
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: todo.id % 2 === 0 ? "#f0f7ff" : "#fff5f5",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: todo.id % 2 === 0 ? "#e0f2fe" : "#fecaca",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "14px",
                  textDecoration: todo.completed ? "line-through" : "none",
                  opacity: todo.completed ? 0.6 : 1,
                  color: todo.completed ? "#6b7280" : "#1f2937",
                }}
              >
                {todo.title || "제목 없음"}
              </span>
              {todo.completed && (
                <span style={{ marginLeft: "8px", fontSize: "14px" }}>✅</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onToggleTodo(todo.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: todo.completed ? "#f59e0b" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {todo.completed ? "미완료" : "완료"}
              </button>

              <button
                onClick={() => onDeleteTodo(todo.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TodoList;

import React, { useState, FormEvent } from "react";

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    onAddTodo(inputValue.trim());
    setInputValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="예: 프레젠테이션 준비하기"
        style={{
          flex: 1,
          padding: "8px 12px",
          fontSize: "14px",
          border: "2px solid #e5e7eb",
          borderRadius: "6px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;

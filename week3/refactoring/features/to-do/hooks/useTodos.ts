import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Todo } from "../types";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "할 일 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
      // ErrorBoundary가 catch할 수 있도록 에러를 throw
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback((title: string) => {
    if (!title.trim()) {
      alert("할 일 내용을 입력해주세요.");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      userId: 1,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const refresh = useCallback(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh,
  };
};

export default useTodos;

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

export interface TodoFormData {
  title: string;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export interface UseTodoReturn extends TodoState {
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  refresh: () => void;
}

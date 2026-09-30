import type { CreateTodoInput, UpdateTodoInput } from "@/lib/validations/todo";
import type { Todo, TodoCategory, TodoView } from "@/types/todo";
import { apiRequest } from "./client";

export type TodoFilters = {
  view: TodoView;
  q?: string;
  category?: TodoCategory;
};

type TodoResponse = { todo: Todo };
type TodosResponse = { todos: Todo[] };

function toQueryString(filters: TodoFilters): string {
  const params = new URLSearchParams({ view: filters.view });

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);

  return params.toString();
}

export async function getTodos(filters: TodoFilters): Promise<Todo[]> {
  const { todos } = await apiRequest<TodosResponse>(
    `/api/todos?${toQueryString(filters)}`
  );
  return todos;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { todo } = await apiRequest<TodoResponse>("/api/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return todo;
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo> {
  const { todo } = await apiRequest<TodoResponse>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return todo;
}

export async function trashTodo(id: string): Promise<Todo> {
  const { todo } = await apiRequest<TodoResponse>(`/api/todos/${id}`, {
    method: "DELETE",
  });
  return todo;
}

export async function restoreTodo(id: string): Promise<Todo> {
  const { todo } = await apiRequest<TodoResponse>(`/api/todos/${id}/restore`, {
    method: "POST",
  });
  return todo;
}

export async function deleteTodoPermanently(id: string): Promise<void> {
  await apiRequest(`/api/todos/${id}/permanent`, { method: "DELETE" });
}

export async function loadSampleTodos(): Promise<void> {
  await apiRequest("/api/todos/sample", { method: "POST" });
}

export async function clearAllTodos(): Promise<void> {
  await apiRequest("/api/todos", { method: "DELETE" });
}
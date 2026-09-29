import type { Todo, TodoPriority } from "@/types/todo";

const PRIORITY_RANK: Record<TodoPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function dueTime(todo: Todo): number {
  return todo.dueDate
    ? new Date(todo.dueDate).getTime()
    : Number.POSITIVE_INFINITY;
}

export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
      dueTime(a) - dueTime(b) ||
      b.createdAt.localeCompare(a.createdAt)
  );
}
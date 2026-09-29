import type { Todo, TodoCategory, TodoPriority } from "@/types/todo";

type TodoLike = {
  _id: unknown;
  title: string;
  notes?: string | null;
  priority?: string | null;
  category?: string | null;
  completed: boolean;
  completedAt?: Date | null;
  dueDate?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toIsoOrNull(date?: Date | null): string | null {
  return date ? date.toISOString() : null;
}

export function toTodo(todo: TodoLike): Todo {
  return {
    id: String(todo._id),
    title: todo.title,
    notes: todo.notes ?? null,
    // The schema's enum guarantees these values, so the casts are safe.
    priority: (todo.priority ?? "medium") as TodoPriority,
    category: (todo.category ?? "personal") as TodoCategory,
    completed: todo.completed,
    completedAt: toIsoOrNull(todo.completedAt),
    dueDate: toIsoOrNull(todo.dueDate),
    deletedAt: toIsoOrNull(todo.deletedAt),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}
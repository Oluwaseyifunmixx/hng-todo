import type {
  TODO_CATEGORIES,
  TODO_PRIORITIES,
  TODO_VIEWS,
} from "@/lib/todos/constants";

export type TodoView = (typeof TODO_VIEWS)[number];
export type TodoPriority = (typeof TODO_PRIORITIES)[number];
export type TodoCategory = (typeof TODO_CATEGORIES)[number];

export type Todo = {
  id: string;
  title: string;
  notes: string | null;
  priority: TodoPriority;
  category: TodoCategory;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
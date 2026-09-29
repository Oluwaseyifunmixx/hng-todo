import type { CreateTodoInput, TodoFormValues } from "@/lib/validations/todo";
import type { Todo } from "@/types/todo";

export const DEFAULT_DUE_TIME = "17:00";

export const EMPTY_TODO_FORM: TodoFormValues = {
  title: "",
  notes: "",
  dueDate: undefined,
  dueTime: "",
  priority: "medium",
  category: "personal",
};

function toTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = (time || DEFAULT_DUE_TIME).split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function todoToFormValues(todo: Todo): TodoFormValues {
  const due = todo.dueDate ? new Date(todo.dueDate) : undefined;

  return {
    title: todo.title,
    notes: todo.notes ?? "",
    dueDate: due,
    dueTime: due ? toTimeString(due) : "",
    priority: todo.priority,
    category: todo.category,
  };
}

export function toTodoInput(values: TodoFormValues): CreateTodoInput {
  return {
    title: values.title,
    notes: values.notes || null,
    dueDate: values.dueDate
      ? combineDateAndTime(values.dueDate, values.dueTime).toISOString()
      : null,
    priority: values.priority,
    category: values.category,
  };
}
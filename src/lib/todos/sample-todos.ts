import type { TodoCategory, TodoPriority } from "@/types/todo";

const HOUR_MS = 60 * 60 * 1000;

type SampleTodoSeed = {
  title: string;
  notes?: string;
  priority: TodoPriority;
  category: TodoCategory;
  dueInHours?: number;
  completed?: boolean;
  trashed?: boolean;
};

// Due times are relative to "now", so every load shows a realistic mix:
// overdue, due soon, due tomorrow, later this week, and no date at all.
const SAMPLE_TODOS: SampleTodoSeed[] = [
  {
    title: "Submit HNG Stage 1 task",
    notes: "Double-check the live link, README and AGENTS.md before submitting.",
    priority: "high",
    category: "work",
    dueInHours: 3,
  },
  {
    title: "Pay electricity bill",
    priority: "high",
    category: "personal",
    dueInHours: -20,
  },
  {
    title: "Buy groceries",
    notes: "Rice, tomatoes, plantain, eggs, bread",
    priority: "medium",
    category: "shopping",
    dueInHours: 26,
  },
  {
    title: "Revise TypeScript generics",
    notes: "Finish the chapter and try the exercises at the end.",
    priority: "medium",
    category: "study",
    dueInHours: 72,
  },
  {
    title: "Plan a weekend outing with family",
    priority: "low",
    category: "personal",
    dueInHours: 120,
  },
  {
    title: "Book a dentist appointment",
    priority: "medium",
    category: "health",
  },
  {
    title: "Morning run",
    notes: "5 km around the estate.",
    priority: "low",
    category: "health",
    completed: true,
  },
  {
    title: "Update portfolio README",
    priority: "medium",
    category: "work",
    completed: true,
  },
  {
    title: "Cancel unused streaming subscription",
    priority: "low",
    category: "personal",
    trashed: true,
  },
];

export function buildSampleTodos(userId: string, now: Date = new Date()) {
  return SAMPLE_TODOS.map((seed, index) => ({
    userId,
    title: seed.title,
    notes: seed.notes ?? null,
    priority: seed.priority,
    category: seed.category,
    completed: seed.completed ?? false,
    completedAt: seed.completed
      ? new Date(now.getTime() - (index + 1) * HOUR_MS)
      : null,
    dueDate:
      seed.dueInHours === undefined
        ? null
        : new Date(now.getTime() + seed.dueInHours * HOUR_MS),
    deletedAt: seed.trashed ? now : null,
  }));
}
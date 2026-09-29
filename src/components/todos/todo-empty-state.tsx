import {
  CircleCheck,
  ListTodo,
  SearchX,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { TodoView } from "@/types/todo";

type EmptyStateContent = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const VIEW_EMPTY_STATES: Record<TodoView, EmptyStateContent> = {
  all: {
    icon: ListTodo,
    title: "Your list is empty",
    description: "Add your first task to get started.",
  },
  active: {
    icon: Sparkles,
    title: "All clear!",
    description: "Nothing left to do. Enjoy the moment.",
  },
  completed: {
    icon: CircleCheck,
    title: "Nothing completed yet",
    description: "Tick off a task and it will show up here.",
  },
  trash: {
    icon: Trash2,
    title: "Trash is empty",
    description: "Deleted tasks land here, so you can bring them back.",
  },
};

const FILTERED_EMPTY_STATE: EmptyStateContent = {
  icon: SearchX,
  title: "No matching tasks",
  description: "Try a different search or category.",
};

type TodoEmptyStateProps = {
  view: TodoView;
  isFiltered: boolean;
};

export function TodoEmptyState({ view, isFiltered }: TodoEmptyStateProps) {
  const { icon: Icon, title, description } = isFiltered
    ? FILTERED_EMPTY_STATE
    : VIEW_EMPTY_STATES[view];

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
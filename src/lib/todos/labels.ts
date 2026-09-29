import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";
import type { TodoCategory, TodoPriority, TodoView } from "@/types/todo";

export const VIEW_LABELS: Record<TodoView, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
  trash: "Trash",
};

export const PRIORITY_LABELS: Record<TodoPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const CATEGORY_META: Record<
  TodoCategory,
  { label: string; icon: LucideIcon }
> = {
  personal: { label: "Personal", icon: User },
  work: { label: "Work", icon: Briefcase },
  study: { label: "Study", icon: GraduationCap },
  shopping: { label: "Shopping", icon: ShoppingCart },
  health: { label: "Health", icon: HeartPulse },
};
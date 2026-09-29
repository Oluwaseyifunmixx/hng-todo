import { CalendarClock, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, PRIORITY_LABELS } from "@/lib/todos/labels";
import { formatDueDate, getDueStatus, type DueStatus } from "@/lib/todos/due-date";
import { cn } from "@/lib/utils";
import type { TodoCategory, TodoPriority } from "@/types/todo";

const PRIORITY_STYLES: Record<TodoPriority, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-ochre/20 text-ochre-foreground dark:text-ochre",
  low: "bg-muted text-muted-foreground",
};

const DUE_STYLES: Record<DueStatus, string> = {
  overdue: "border-destructive/40 text-destructive",
  today: "border-ochre/50 bg-ochre/15 text-ochre-foreground dark:text-ochre",
  upcoming: "text-muted-foreground",
};

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 border-transparent", PRIORITY_STYLES[priority])}
    >
      <Flag />
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: TodoCategory }) {
  const { label, icon: Icon } = CATEGORY_META[category];

  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <Icon />
      {label}
    </Badge>
  );
}

type DueBadgeProps = {
  dueDate: string;
  completed: boolean;
};

export function DueBadge({ dueDate, completed }: DueBadgeProps) {
  const status = getDueStatus(dueDate, completed);

  return (
    <Badge
      variant="outline"
      className={cn("gap-1", status ? DUE_STYLES[status] : "text-muted-foreground")}
    >
      <CalendarClock />
      {status === "overdue" && "Overdue · "}
      {formatDueDate(dueDate)}
    </Badge>
  );
}
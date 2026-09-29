export type DueStatus = "overdue" | "today" | "upcoming";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getDueStatus(
  dueDate: string | null,
  completed: boolean,
  now: Date = new Date()
): DueStatus | null {
  if (!dueDate || completed) {
    return null;
  }

  const due = new Date(dueDate);

  if (due.getTime() < now.getTime()) {
    return "overdue";
  }

  return isSameDay(due, now) ? "today" : "upcoming";
}

export function formatDueDate(dueDate: string, now: Date = new Date()): string {
  const due = new Date(dueDate);
  const time = due.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (isSameDay(due, now)) return `Today, ${time}`;
  if (isSameDay(due, tomorrow)) return `Tomorrow, ${time}`;

  const date = due.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(due.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });

  return `${date}, ${time}`;
}
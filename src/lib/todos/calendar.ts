import type { Todo } from "@/types/todo";

const EVENT_DURATION_MINUTES = 30;
const REMINDER_MINUTES_BEFORE = 30;
const MS_PER_MINUTE = 60_000;

type CalendarTodo = Pick<Todo, "id" | "title" | "notes"> & {
  dueDate: string;
};

function toCalendarTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function getEventTimes(dueDate: string) {
  const start = new Date(dueDate);
  const end = new Date(start.getTime() + EVENT_DURATION_MINUTES * MS_PER_MINUTE);

  return {
    start: toCalendarTimestamp(start),
    end: toCalendarTimestamp(end),
  };
}

export function getGoogleCalendarUrl(todo: CalendarTodo): string {
  const { start, end } = getEventTimes(todo.dueDate);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: todo.title,
    dates: `${start}/${end}`,
    details: todo.notes ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function createIcsFile(todo: CalendarTodo): string {
  const { start, end } = getEventTimes(todo.dueDate);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clearday//Tasks//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${todo.id}@clearday`,
    `DTSTAMP:${toCalendarTimestamp(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(todo.title)}`,
    ...(todo.notes ? [`DESCRIPTION:${escapeIcsText(todo.notes)}`] : []),
    "BEGIN:VALARM",
    `TRIGGER:-PT${REMINDER_MINUTES_BEFORE}M`,
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(todo.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function getIcsFileName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "task"}.ics`;
}
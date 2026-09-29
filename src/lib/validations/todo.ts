import { z } from "zod";
import {
  TODO_CATEGORIES,
  TODO_PRIORITIES,
  TODO_VIEWS,
} from "@/lib/todos/constants";

const titleField = z
  .string()
  .trim()
  .min(1, "Give your task a title")
  .max(200, "Keep the title under 200 characters");

const notesText = z
  .string()
  .trim()
  .max(2000, "Keep notes under 2,000 characters");

const notesField = notesText.nullable();

const dueDateField = z.iso
  .datetime({ message: "Choose a valid due date" })
  .nullable();

const priorityField = z.enum(TODO_PRIORITIES);
const categoryField = z.enum(TODO_CATEGORIES);

export const createTodoSchema = z.object({
  title: titleField,
  notes: notesField.optional(),
  dueDate: dueDateField.optional(),
  priority: priorityField.optional(),
  category: categoryField.optional(),
});

export const updateTodoSchema = z
  .object({
    title: titleField.optional(),
    notes: notesField.optional(),
    dueDate: dueDateField.optional(),
    priority: priorityField.optional(),
    category: categoryField.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update",
  });

export const todoListQuerySchema = z.object({
  view: z.enum(TODO_VIEWS).default("all"),
  q: z.string().trim().max(100).optional(),
  category: categoryField.optional(),
});

export const todoFormSchema = z.object({
  title: titleField,
  notes: notesText,
  dueDate: z.date().optional(),
  dueTime: z.union([
    z.literal(""),
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid time"),
  ]),
  priority: priorityField,
  category: categoryField,
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoFormValues = z.infer<typeof todoFormSchema>;
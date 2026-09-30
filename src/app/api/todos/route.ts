import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Todo } from "@/models/todo";
import { getCurrentUserId } from "@/lib/auth/session";
import { jsonError, validationError } from "@/lib/api-response";
import { escapeRegex } from "@/lib/escape-regex";
import { toTodo } from "@/lib/todos/to-todo";
import { sortTodos } from "@/lib/todos/sort-todos";
import {
  createTodoSchema,
  todoListQuerySchema,
} from "@/lib/validations/todo";

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const { searchParams } = request.nextUrl;
  const parsed = todoListQuerySchema.safeParse({
    view: searchParams.get("view") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { view, q, category } = parsed.data;
  const isTrash = view === "trash";

  try {
    await connectToDatabase();

    const documents = await Todo.find({
      userId,
      deletedAt: isTrash ? { $ne: null } : null,
      ...(view === "active" && { completed: false }),
      ...(view === "completed" && { completed: true }),
      ...(category && { category }),
      ...(q && { title: { $regex: escapeRegex(q), $options: "i" } }),
    }).sort(isTrash ? { deletedAt: -1 } : { createdAt: -1 });

    const todos = documents.map(toTodo);

    return NextResponse.json({ todos: isTrash ? todos : sortTodos(todos) });
  } catch (error) {
    console.error("[todos:list] Failed to fetch todos:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = createTodoSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { title, notes, dueDate, priority, category } = parsed.data;

  try {
    await connectToDatabase();

    const todo = await Todo.create({
      userId,
      title,
      notes: notes || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      ...(priority && { priority }),
      ...(category && { category }),
    });

    return NextResponse.json({ todo: toTodo(todo) }, { status: 201 });
  } catch (error) {
    console.error("[todos:create] Failed to create todo:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}

export async function DELETE() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  try {
    await connectToDatabase();
    const { deletedCount } = await Todo.deleteMany({ userId });

    return NextResponse.json({ deletedCount });
  } catch (error) {
    console.error("[todos:clear] Failed to clear todos:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
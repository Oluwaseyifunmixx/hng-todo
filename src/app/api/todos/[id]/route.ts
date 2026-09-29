import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Todo } from "@/models/todo";
import { getCurrentUserId } from "@/lib/auth/session";
import { jsonError, validationError } from "@/lib/api-response";
import { toTodo } from "@/lib/todos/to-todo";
import { updateTodoSchema } from "@/lib/validations/todo";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return jsonError("Task not found", 404);
  }

  const body = await request.json().catch(() => null);
  const parsed = updateTodoSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { title, notes, dueDate, priority, category, completed } = parsed.data;

  const update = {
    ...(title !== undefined && { title }),
    ...(notes !== undefined && { notes: notes || null }),
    ...(dueDate !== undefined && {
      dueDate: dueDate ? new Date(dueDate) : null,
    }),
    ...(priority !== undefined && { priority }),
    ...(category !== undefined && { category }),
    ...(completed !== undefined && {
      completed,
      completedAt: completed ? new Date() : null,
    }),
  };

  try {
    await connectToDatabase();

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId, deletedAt: null },
      update,
      { returnDocument: "after", runValidators: true }
    );

    if (!todo) {
      return jsonError("Task not found", 404);
    }

    return NextResponse.json({ todo: toTodo(todo) });
  } catch (error) {
    console.error("[todos:update] Failed to update todo:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const { id } = await params;

  if (!isValidObjectId(id)) {
    return jsonError("Task not found", 404);
  }

  try {
    await connectToDatabase();

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId, deletedAt: null },
      { deletedAt: new Date() },
      { returnDocument: "after" }
    );

    if (!todo) {
      return jsonError("Task not found", 404);
    }

    return NextResponse.json({ todo: toTodo(todo) });
  } catch (error) {
    console.error("[todos:delete] Failed to move todo to trash:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
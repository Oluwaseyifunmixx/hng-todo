import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Todo } from "@/models/todo";
import { getCurrentUserId } from "@/lib/auth/session";
import { jsonError } from "@/lib/api-response";
import { toTodo } from "@/lib/todos/to-todo";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
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
      { _id: id, userId, deletedAt: { $ne: null } },
      { deletedAt: null },
      { returnDocument: "after" }
    );

    if (!todo) {
      return jsonError("Task not found in trash", 404);
    }

    return NextResponse.json({ todo: toTodo(todo) });
  } catch (error) {
    console.error("[todos:restore] Failed to restore todo:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
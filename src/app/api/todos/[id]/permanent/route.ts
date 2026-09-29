import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Todo } from "@/models/todo";
import { getCurrentUserId } from "@/lib/auth/session";
import { jsonError } from "@/lib/api-response";

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId,
      deletedAt: { $ne: null },
    });

    if (!todo) {
      return jsonError("Task not found in trash", 404);
    }

    return NextResponse.json({ message: "Task permanently deleted" });
  } catch (error) {
    console.error("[todos:permanent-delete] Failed to delete todo:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Todo } from "@/models/todo";
import { getCurrentUserId } from "@/lib/auth/session";
import { jsonError } from "@/lib/api-response";
import { buildSampleTodos } from "@/lib/todos/sample-todos";

export async function POST() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  try {
    await connectToDatabase();
    await Todo.deleteMany({ userId });
    const todos = await Todo.insertMany(buildSampleTodos(userId));

    return NextResponse.json({ count: todos.length }, { status: 201 });
  } catch (error) {
    console.error("[todos:sample] Failed to load sample todos:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
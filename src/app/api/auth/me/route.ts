import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { getCurrentUserId } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/user";
import { jsonError } from "@/lib/api-response";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return jsonError("Not authenticated", 401);
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return jsonError("Not authenticated", 401);
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[auth/me] Failed to fetch current user:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
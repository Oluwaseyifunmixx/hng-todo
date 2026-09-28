import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/user";
import { jsonError, validationError } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email }).select("+password");
    const passwordMatches = user
      ? await verifyPassword(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSessionToken(user._id.toString());
    await setSessionCookie(token);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[auth/login] Failed to log in user:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
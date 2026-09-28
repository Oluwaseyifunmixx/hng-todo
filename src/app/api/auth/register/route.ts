import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/user";
import { jsonError, validationError } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, email, password } = parsed.data;

  try {
    await connectToDatabase();

    const emailTaken = await User.exists({ email });

    if (emailTaken) {
      return jsonError("An account with this email already exists", 409);
    }

    const user = await User.create({
      name,
      email,
      password: await hashPassword(password),
    });

    const token = await createSessionToken(user._id.toString());
    await setSessionCookie(token);

    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  } catch (error) {
    console.error("[auth/register] Failed to register user:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
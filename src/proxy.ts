import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  createGuestId,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth/session";

// There's no sign-in step: every visitor gets a private guest workspace.
// Their guest id lives in a signed, httpOnly cookie, and every todo query is
// scoped to it, so each browser only ever sees its own tasks.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (session) {
    return NextResponse.next();
  }

  const guestToken = await createSessionToken(createGuestId());
  const response = NextResponse.next();

  response.cookies.set(SESSION_COOKIE_NAME, guestToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
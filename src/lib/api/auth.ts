import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import type { PublicUser } from "@/types/user";
import { apiRequest } from "./client";

type AuthResponse = {
  user: PublicUser;
};

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const { user } = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return user;
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  const { user } = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return user;
}

export async function logoutUser(): Promise<void> {
  await apiRequest("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<PublicUser> {
  const { user } = await apiRequest<AuthResponse>("/api/auth/me");
  return user;
}
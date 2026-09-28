import type { PublicUser } from "@/types/user";

type UserLike = {
  _id: unknown;
  name: string;
  email: string;
};

export function toPublicUser(user: UserLike): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}
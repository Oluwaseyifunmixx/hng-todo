import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/api/auth";

export const currentUserQueryKey = ["current-user"] as const;

// Auth changes who the user is, so we do a full page load rather than a
// client-side navigation. This discards any pages Next.js prefetched while
// the user was logged out, so the proxy re-checks the new session cookie.
function goTo(path: string) {
  window.location.replace(path);
}

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => goTo("/"),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => goTo("/"),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      goTo("/login");
    },
  });
}
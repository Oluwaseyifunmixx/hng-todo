"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { useHydrated } from "@/hooks/use-hydrated";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function BoardHeader() {
  const { data: user } = useCurrentUser();
  const isHydrated = useHydrated();

  if (!user || !isHydrated) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  const now = new Date();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight">
        {getGreeting(now.getHours())}, {firstName}
      </h1>
      <p className="text-muted-foreground">
        {now.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>
    </div>
  );
}
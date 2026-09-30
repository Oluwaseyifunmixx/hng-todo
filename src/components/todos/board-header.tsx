"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function BoardHeader() {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight">
        {getGreeting(now.getHours())}
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
import { Skeleton } from "@/components/ui/skeleton";

export function TodoListSkeleton() {
  return (
    <ul className="space-y-3" aria-label="Loading tasks">
      {Array.from({ length: 4 }, (_, index) => (
        <li
          key={index}
          className="flex items-start gap-3 rounded-xl border bg-card p-4"
        >
          <Skeleton className="mt-1 size-4 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
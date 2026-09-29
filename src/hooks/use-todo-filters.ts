import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TODO_CATEGORIES, TODO_VIEWS } from "@/lib/todos/constants";
import type { TodoFilters } from "@/lib/api/todos";
import type { TodoCategory, TodoView } from "@/types/todo";

type FilterKey = "view" | "q" | "category";
type FilterUpdates = Partial<Record<FilterKey, string | undefined>>;

function isTodoView(value: string | null): value is TodoView {
  return TODO_VIEWS.includes(value as TodoView);
}

function isTodoCategory(value: string | null): value is TodoCategory {
  return TODO_CATEGORIES.includes(value as TodoCategory);
}

export function useTodoFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view");
  const categoryParam = searchParams.get("category");

  const filters: TodoFilters = {
    view: isTodoView(viewParam) ? viewParam : "all",
    q: searchParams.get("q") ?? undefined,
    category: isTodoCategory(categoryParam) ? categoryParam : undefined,
  };

  const setFilters = useCallback(
    (updates: FilterUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      if (params.get("view") === "all") {
        params.delete("view");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  return { filters, setFilters };
}
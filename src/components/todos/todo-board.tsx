"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodoFilters } from "@/hooks/use-todo-filters";
import { useTodos } from "@/hooks/use-todos";
import { TODO_VIEWS } from "@/lib/todos/constants";
import { VIEW_LABELS } from "@/lib/todos/labels";
import { BoardHeader } from "./board-header";
import { TodoEmptyState } from "./todo-empty-state";
import { TodoList } from "./todo-list";
import { TodoListSkeleton } from "./todo-list-skeleton";

export function TodoBoard() {
  const { filters, setFilters } = useTodoFilters();
  const { data: todos, isPending, isError, refetch } = useTodos(filters);

  function renderContent() {
    if (isPending) {
      return <TodoListSkeleton />;
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">We couldn&rsquo;t load your tasks.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      );
    }

    if (todos.length === 0) {
      return (
        <TodoEmptyState
          view={filters.view}
          isFiltered={Boolean(filters.q || filters.category)}
        />
      );
    }

    return <TodoList todos={todos} />;
  }

  return (
    <div className="space-y-6">
      <BoardHeader />

      <Tabs
        value={filters.view}
        onValueChange={(view) => setFilters({ view })}
      >
<TabsList className="grid w-full grid-cols-4">         
     {TODO_VIEWS.map((view) => (
            <TabsTrigger key={view} value={view}>
              {VIEW_LABELS[view]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {renderContent()}
    </div>
  );
}
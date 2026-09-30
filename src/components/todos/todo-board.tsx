"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodoFilters } from "@/hooks/use-todo-filters";
import { useTodos } from "@/hooks/use-todos";
import { TODO_VIEWS } from "@/lib/todos/constants";
import { VIEW_LABELS } from "@/lib/todos/labels";
import type { TodoCategory } from "@/types/todo";
import { BoardHeader } from "./board-header";
import { CategoryFilter } from "./category-filter";
import { QuickAddTodo } from "./quick-add-todo";
import { LoadSampleDataButton, SampleDataMenu } from "./sample-data-controls";
import { TodoEmptyState } from "./todo-empty-state";
import { TodoFormDialog } from "./todo-form-dialog";
import { TodoList } from "./todo-list";
import { TodoListSkeleton } from "./todo-list-skeleton";
import { TodoSearch } from "./todo-search";

export function TodoBoard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { filters, setFilters } = useTodoFilters();
  const { data: todos, isPending, isError, refetch } = useTodos(filters);
  const isTrashView = filters.view === "trash";
  const isFiltered = Boolean(filters.q || filters.category);

  const handleSearchChange = useCallback(
    (q: string) => setFilters({ q }),
    [setFilters]
  );

  const handleCategoryChange = useCallback(
    (category?: TodoCategory) => setFilters({ category }),
    [setFilters]
  );

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
      const showSampleAction = filters.view === "all" && !isFiltered;

      return (
        <TodoEmptyState
          view={filters.view}
          isFiltered={isFiltered}
          action={showSampleAction ? <LoadSampleDataButton /> : undefined}
        />
      );
    }

    return <TodoList todos={todos} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <BoardHeader />
        <div className="flex flex-wrap gap-2">
          <SampleDataMenu />
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus />
            New task
          </Button>
        </div>
      </div>

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <TodoSearch value={filters.q ?? ""} onChange={handleSearchChange} />
        <CategoryFilter
          value={filters.category}
          onChange={handleCategoryChange}
        />
      </div>

      {!isTrashView && <QuickAddTodo category={filters.category} />}

      {renderContent()}

      <TodoFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
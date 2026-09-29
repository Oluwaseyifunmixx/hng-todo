"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateTodo } from "@/hooks/use-todos";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";
import { CategoryBadge, DueBadge, PriorityBadge } from "./todo-badges";
import { TodoActions } from "./todo-actions";
import { TodoFormDialog } from "./todo-form-dialog";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateTodo = useUpdateTodo();
  const isTrashed = todo.deletedAt !== null;

  const isCompleted = updateTodo.isPending
    ? Boolean(updateTodo.variables?.input.completed)
    : todo.completed;

  function handleToggle(checked: boolean) {
    updateTodo.mutate(
      { id: todo.id, input: { completed: checked } },
      {
        onError: () => toast.error("Couldn't update the task. Please try again."),
      }
    );
  }

  const titleClassName = cn(
    "font-medium break-words",
    isCompleted && "text-done-foreground line-through decoration-2"
  );

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors",
        isCompleted && "border-transparent bg-done",
        isTrashed && "opacity-75"
      )}
    >
      {!isTrashed && (
        <Checkbox
          checked={isCompleted}
          onCheckedChange={(checked) => handleToggle(checked === true)}
          disabled={updateTodo.isPending}
          aria-label={`Mark "${todo.title}" as ${isCompleted ? "not done" : "done"}`}
          className="mt-1"
        />
      )}

      <div className="min-w-0 flex-1 space-y-2">
        {isTrashed ? (
          <p className={titleClassName}>{todo.title}</p>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={cn(
              titleClassName,
              "rounded-sm text-left underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            {todo.title}
          </button>
        )}

        {todo.notes && (
          <p className="line-clamp-2 text-sm whitespace-pre-line text-muted-foreground">
            {todo.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={todo.priority} />
          <CategoryBadge category={todo.category} />
          {todo.dueDate && (
            <DueBadge dueDate={todo.dueDate} completed={isCompleted} />
          )}
        </div>
      </div>

      <TodoActions todo={todo} onEdit={() => setIsEditing(true)} />

      {!isTrashed && (
        <TodoFormDialog
          open={isEditing}
          onOpenChange={setIsEditing}
          todo={todo}
        />
      )}
    </li>
  );
}
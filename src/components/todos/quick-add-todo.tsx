"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTodo } from "@/hooks/use-todos";
import { ApiError } from "@/lib/api/client";
import type { TodoCategory } from "@/types/todo";

type QuickAddTodoProps = {
  category?: TodoCategory;
};

export function QuickAddTodo({ category }: QuickAddTodoProps) {
  const [title, setTitle] = useState("");
  const createTodo = useCreateTodo();
  const trimmedTitle = title.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedTitle) {
      return;
    }

    try {
      await createTodo.mutateAsync({
        title: trimmedTitle,
        ...(category && { category }),
      });
      setTitle("");
      toast.success("Task added");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Couldn't add the task. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Plus className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task and press Enter"
          aria-label="New task title"
          maxLength={200}
          className="pl-9"
        />
      </div>
      <Button type="submit" disabled={!trimmedTitle || createTodo.isPending}>
        Add
      </Button>
    </form>
  );
}
"use client";

import { useState } from "react";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteTodoPermanently,
  useRestoreTodo,
  useTrashTodo,
} from "@/hooks/use-todos";
import type { Todo } from "@/types/todo";

type TodoActionsProps = {
  todo: Todo;
};

export function TodoActions({ todo }: TodoActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const trashTodo = useTrashTodo();
  const restoreTodo = useRestoreTodo();
  const deleteTodo = useDeleteTodoPermanently();

  const isTrashed = todo.deletedAt !== null;

  async function handleTrash() {
    try {
      await trashTodo.mutateAsync(todo.id);
      toast("Moved to trash", {
        action: {
          label: "Undo",
          onClick: () => restoreTodo.mutate(todo.id),
        },
      });
    } catch {
      toast.error("Couldn't move the task to trash. Please try again.");
    }
  }

  async function handleRestore() {
    try {
      await restoreTodo.mutateAsync(todo.id);
      toast.success("Task restored");
    } catch {
      toast.error("Couldn't restore the task. Please try again.");
    }
  }

  async function handleDeleteForever() {
    try {
      await deleteTodo.mutateAsync(todo.id);
      setIsConfirmOpen(false);
      toast.success("Task deleted forever");
    } catch {
      toast.error("Couldn't delete the task. Please try again.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground"
            aria-label={`Actions for "${todo.title}"`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isTrashed ? (
            <>
              <DropdownMenuItem onSelect={handleRestore}>
                <RotateCcw />
                Restore
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setIsConfirmOpen(true)}
              >
                <Trash2 />
                Delete forever
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem variant="destructive" onSelect={handleTrash}>
              <Trash2 />
              Move to trash
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task forever?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{todo.title}&rdquo; will be permanently removed. This
              can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteForever();
              }}
              disabled={deleteTodo.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteTodo.isPending ? "Deleting…" : "Delete forever"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
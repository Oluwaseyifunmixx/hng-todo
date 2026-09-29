"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Todo } from "@/types/todo";
import { TodoForm } from "./todo-form";

type TodoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: Todo;
};

export function TodoFormDialog({ open, onOpenChange, todo }: TodoFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {todo
              ? "Update the details, then save your changes."
              : "Add as much or as little detail as you like."}
          </DialogDescription>
        </DialogHeader>
        <TodoForm todo={todo} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
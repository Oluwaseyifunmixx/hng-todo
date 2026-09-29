import { Suspense } from "react";
import type { Metadata } from "next";
import { TodoBoard } from "@/components/todos/todo-board";
import { TodoListSkeleton } from "@/components/todos/todo-list-skeleton";

export const metadata: Metadata = {
  title: "My tasks",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<TodoListSkeleton />}>
      <TodoBoard />
    </Suspense>
  );
}
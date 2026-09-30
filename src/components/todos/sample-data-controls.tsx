"use client";

import { useState } from "react";
import { Eraser, Sparkles } from "lucide-react";
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
import { useClearAllTodos, useLoadSampleTodos } from "@/hooks/use-todos";

function useSampleDataActions() {
  const loadSamples = useLoadSampleTodos();
  const clearAll = useClearAllTodos();

  async function loadSampleData() {
    try {
      await loadSamples.mutateAsync();
      toast.success("Sample data loaded");
    } catch {
      toast.error("Couldn't load sample data. Please try again.");
    }
  }

  async function clearAllTasks(): Promise<boolean> {
    try {
      await clearAll.mutateAsync();
      toast.success("All tasks cleared");
      return true;
    } catch {
      toast.error("Couldn't clear your tasks. Please try again.");
      return false;
    }
  }

  return {
    loadSampleData,
    clearAllTasks,
    isLoading: loadSamples.isPending,
    isClearing: clearAll.isPending,
  };
}

export function LoadSampleDataButton() {
  const { loadSampleData, isLoading } = useSampleDataActions();

  return (
    <Button onClick={loadSampleData} disabled={isLoading}>
      <Sparkles />
      {isLoading ? "Loading…" : "Load sample data"}
    </Button>
  );
}

export function SampleDataMenu() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { loadSampleData, clearAllTasks, isLoading, isClearing } =
    useSampleDataActions();

  async function handleConfirmClear() {
    const cleared = await clearAllTasks();
    if (cleared) {
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" disabled={isLoading || isClearing}>
            <Sparkles />
            Sample data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={loadSampleData}>
            <Sparkles />
            Load sample data
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsConfirmOpen(true)}
          >
            <Eraser />
            Clear all tasks
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every task, including the trash, and returns the app
              to its empty state. You can load the sample data again at any
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my tasks</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmClear();
              }}
              disabled={isClearing}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isClearing ? "Clearing…" : "Clear all"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
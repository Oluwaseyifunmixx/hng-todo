"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { useCreateTodo, useUpdateTodo } from "@/hooks/use-todos";
import { ApiError } from "@/lib/api/client";
import { TODO_CATEGORIES, TODO_PRIORITIES } from "@/lib/todos/constants";
import { CATEGORY_META, PRIORITY_LABELS } from "@/lib/todos/labels";
import {
  DEFAULT_DUE_TIME,
  EMPTY_TODO_FORM,
  toTodoInput,
  todoToFormValues,
} from "@/lib/todos/todo-form";
import { todoFormSchema, type TodoFormValues } from "@/lib/validations/todo";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

type TodoFormProps = {
  todo?: Todo;
  onDone: () => void;
};

function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function TodoForm({ todo, onDone }: TodoFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const isSaving = createTodo.isPending || updateTodo.isPending;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: todo ? todoToFormValues(todo) : EMPTY_TODO_FORM,
  });

  const dueDate = useWatch({ control, name: "dueDate" });

  function clearDueDate() {
    setValue("dueDate", undefined);
    setValue("dueTime", "");
  }

  async function onSubmit(values: TodoFormValues) {
    const input = toTodoInput(values);

    try {
      if (todo) {
        await updateTodo.mutateAsync({ id: todo.id, input });
        toast.success("Task updated");
      } else {
        await createTodo.mutateAsync(input);
        toast.success("Task added");
      }
      onDone();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Couldn't save the task. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        id="todo-title"
        label="Title"
        placeholder="What needs doing?"
        autoFocus
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="space-y-2">
        <Label htmlFor="todo-notes">
          Notes{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="todo-notes"
          rows={3}
          placeholder="Add details, links or context"
          aria-invalid={Boolean(errors.notes)}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="todo-due-date">Due date</Label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="todo-due-date"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {field.value
                      ? field.value.toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      if (date && !getValues("dueTime")) {
                        setValue("dueTime", DEFAULT_DUE_TIME);
                      }
                      setIsCalendarOpen(false);
                    }}
                    disabled={{ before: getStartOfToday() }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="todo-due-time">Time</Label>
          <div className="flex gap-2">
            <Input
              id="todo-due-time"
              type="time"
              disabled={!dueDate}
              aria-invalid={Boolean(errors.dueTime)}
              {...register("dueTime")}
            />
            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearDueDate}
                aria-label="Clear due date"
              >
                <X />
              </Button>
            )}
          </div>
          {errors.dueTime && (
            <p className="text-sm text-destructive">{errors.dueTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="todo-priority">Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="todo-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TODO_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="todo-category">Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="todo-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TODO_CATEGORIES.map((category) => {
                    const { label, icon: Icon } = CATEGORY_META[category];
                    return (
                      <SelectItem key={category} value={category}>
                        <Icon />
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : todo ? "Save changes" : "Add task"}
        </Button>
      </div>
    </form>
  );
}
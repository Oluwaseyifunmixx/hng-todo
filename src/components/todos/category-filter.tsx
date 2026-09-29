"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TODO_CATEGORIES } from "@/lib/todos/constants";
import { CATEGORY_META } from "@/lib/todos/labels";
import type { TodoCategory } from "@/types/todo";

const ALL_CATEGORIES = "all";

type CategoryFilterProps = {
  value?: TodoCategory;
  onChange: (value?: TodoCategory) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Select
      value={value ?? ALL_CATEGORIES}
      onValueChange={(nextValue) =>
        onChange(
          nextValue === ALL_CATEGORIES ? undefined : (nextValue as TodoCategory)
        )
      }
    >
      <SelectTrigger className="w-full sm:w-48" aria-label="Filter by category">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
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
  );
}
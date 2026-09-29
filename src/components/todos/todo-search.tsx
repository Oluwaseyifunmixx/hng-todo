"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SEARCH_DELAY_MS = 300;

type TodoSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TodoSearch({ value, onChange }: TodoSearchProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    const nextValue = draft.trim();

    if (nextValue === value) {
      return;
    }

    const timer = setTimeout(() => onChange(nextValue), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search tasks"
        aria-label="Search tasks"
        className="pl-9"
      />
    </div>
  );
}
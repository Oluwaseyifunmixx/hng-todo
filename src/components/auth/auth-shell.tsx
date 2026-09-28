import type { ReactNode } from "react";
import { PatternBackground } from "@/components/brand/pattern-background";
import { Logo } from "@/components/brand/logo";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <PatternBackground className="text-primary-foreground/10" />

        <Logo tone="inverse" className="relative" />

        <div className="relative max-w-md space-y-4">
          <p className="font-heading text-5xl leading-tight font-semibold">
            Clear your mind. Own your day.
          </p>
          <p className="text-lg text-primary-foreground/80">
            Get every task out of your head and into one calm place, then work
            through them without the overwhelm.
          </p>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          Due dates · Smart filters · A trash you can undo
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
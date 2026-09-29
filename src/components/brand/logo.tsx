import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  tone?: "default" | "inverse";
};

export function Logo({ className, tone = "default" }: LogoProps) {
  const isInverse = tone === "inverse";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 place-items-center rounded-lg",
          isInverse ? "bg-panel-foreground" : "bg-primary"
        )}
      >
        <span className="size-4 rounded-full border-[3px] border-ochre" />
      </span>
      <span className="font-heading text-2xl font-semibold tracking-tight">
        Clearday
      </span>
    </Link>
  );
}
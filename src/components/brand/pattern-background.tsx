import { cn } from "@/lib/utils";

type PatternBackgroundProps = {
  id?: string;
  className?: string;
};

export function PatternBackground({
  id = "pattern-background",
  className,
}: PatternBackgroundProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          <rect x="48" y="48" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="54" y="54" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="60" cy="20" r="2" fill="currentColor" />
          <circle cx="20" cy="60" r="2" fill="currentColor" />
          <path d="M40 0V80M0 40H80" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
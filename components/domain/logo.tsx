import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-display text-xl text-text-primary", className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" fill="var(--pink-200)" />
        <circle cx="16" cy="16" r="7" fill="var(--pink-400)" />
        <path
          d="M6 14C9 17 13 19 18 18"
          stroke="var(--pink-700)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      Crochelia
    </span>
  );
}

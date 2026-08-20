import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  referenceId?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something didn't load",
  description = "Give it another try — if it keeps happening, we've logged what went wrong.",
  referenceId,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-border-default bg-surface-raised px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-6 text-danger-fg" aria-hidden />
      <h3 className="font-display text-lg text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
      {referenceId && (
        <p className="text-xs text-text-tertiary">Reference: {referenceId}</p>
      )}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-dashed border-border-default bg-surface-blush px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-3xl">{icon}</div>}
      <h3 className="font-display text-xl text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-2 flex flex-col items-center gap-2">
          {action}
          {secondaryAction && (
            <span className="text-sm text-text-tertiary">{secondaryAction}</span>
          )}
        </div>
      )}
    </div>
  );
}

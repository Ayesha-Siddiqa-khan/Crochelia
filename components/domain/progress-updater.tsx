"use client";

import * as React from "react";
import { useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { recordProgressAction } from "@/app/actions/projects";
import { ProgressBar } from "@/components/domain/progress-bar";
import { Button } from "@/components/primitives/button";
import { toast } from "@/components/feedback/toast";

export function ProgressUpdater({
  projectId,
  initialCompleted,
  total,
}: {
  projectId: string;
  initialCompleted: number;
  total: number;
}) {
  const [completed, setCompleted] = React.useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const completedRef = React.useRef(initialCompleted);
  const lastSyncedRef = React.useRef(initialCompleted);

  const step = (delta: number) => {
    const clamped = Math.max(0, Math.min(total, completedRef.current + delta));
    completedRef.current = clamped;
    setCompleted(clamped);

    startTransition(async () => {
      try {
        await recordProgressAction(projectId, clamped);
        lastSyncedRef.current = clamped;
        if (clamped === total && total > 0) {
          toast({ title: "Project complete! 🎉", tone: "success" });
        }
      } catch {
        completedRef.current = lastSyncedRef.current;
        setCompleted(lastSyncedRef.current);
        toast({ title: "Couldn't save progress", description: "Try again in a moment.", tone: "danger" });
      }
    });
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-5">
      <ProgressBar value={completed} max={total} label="Project progress" />
      <p className="mt-2 text-sm text-text-secondary">
        {completed} / {total} squares · {total === 0 ? 0 : Math.round((completed / total) * 100)}%
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Button
          variant="secondary"
          size="lg"
          aria-label="One fewer square"
          onClick={() => step(-1)}
          disabled={isPending || completed <= 0}
        >
          <Minus className="size-5" />
        </Button>
        <div className="flex h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-lg font-semibold text-text-primary">
          {completed}
        </div>
        <Button
          size="lg"
          aria-label="One more square"
          onClick={() => step(1)}
          disabled={isPending || completed >= total}
        >
          <Plus className="size-5" />
        </Button>
      </div>
    </div>
  );
}

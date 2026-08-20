"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteYarnStashAction } from "@/app/actions/yarn";
import type { YarnStashItem } from "@/lib/db/yarn";
import { Badge } from "@/components/primitives/badge";

export function YarnCard({ yarn }: { yarn: YarnStashItem }) {
  const [isPending, startTransition] = useTransition();
  const percent = yarn.total_grams === 0 ? 0 : (yarn.remaining_grams / yarn.total_grams) * 100;
  const low = percent < 20;

  return (
    <div className="group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
      <div
        className="h-20 w-full rounded-[var(--radius-md)]"
        style={{ background: yarn.color_swatch_hex ?? "var(--pink-200)" }}
        aria-hidden
      />
      <div>
        <p className="truncate font-medium text-text-primary">{yarn.color_name}</p>
        <p className="truncate text-xs text-text-tertiary">
          {yarn.brand ? `${yarn.brand} · ` : ""}
          {yarn.name}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs">
        <Badge tone="neutral" className="capitalize">
          {yarn.weight_class}
        </Badge>
        <span className={low ? "font-medium text-warning-fg" : "text-text-secondary"}>
          {Math.round(yarn.remaining_grams)}g / {Math.round(yarn.total_grams)}g
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full bg-pink-400"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <button
        aria-label={`Delete ${yarn.color_name}`}
        disabled={isPending}
        onClick={() => {
          if (confirm(`Remove ${yarn.color_name} from your stash?`)) {
            startTransition(() => deleteYarnStashAction(yarn.id));
          }
        }}
        className="absolute right-3 top-3 rounded-full bg-surface-raised/90 p-1.5 text-text-tertiary opacity-0 shadow-[var(--shadow-xs)] transition-opacity hover:text-danger-fg focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

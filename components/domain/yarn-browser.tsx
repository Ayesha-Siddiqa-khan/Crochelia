"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/primitives/input";
import { EmptyState } from "@/components/feedback/empty-state";
import { YarnCard } from "@/components/domain/yarn-card";
import { WEIGHT_CLASSES } from "@/lib/validation/yarn";
import { cn } from "@/lib/utils";
import type { YarnStashItem } from "@/lib/db/yarn";

type SortMode = "recent" | "remaining" | "color";

export function YarnBrowser({ items }: { items: YarnStashItem[] }) {
  const [query, setQuery] = React.useState("");
  const [weightFilter, setWeightFilter] = React.useState<string>("all");
  const [sort, setSort] = React.useState<SortMode>("recent");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = items.filter((y) => {
      const matchesWeight = weightFilter === "all" || y.weight_class === weightFilter;
      const matchesQuery =
        q.length === 0 ||
        y.name.toLowerCase().includes(q) ||
        y.color_name.toLowerCase().includes(q) ||
        (y.brand ?? "").toLowerCase().includes(q);
      return matchesWeight && matchesQuery;
    });

    result = [...result].sort((a, b) => {
      if (sort === "remaining") return b.remaining_grams - a.remaining_grams;
      if (sort === "color") return a.color_name.localeCompare(b.color_name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [items, query, weightFilter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search yarn, colour, brand..."
            className="pl-9"
            aria-label="Search yarn stash"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={weightFilter}
            onChange={(e) => setWeightFilter(e.target.value)}
            aria-label="Filter by weight"
            className="h-9 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-2 text-xs capitalize"
          >
            <option value="all">All weights</option>
            {WEIGHT_CLASSES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            aria-label="Sort yarn stash"
            className="h-9 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-2 text-xs"
          >
            <option value="recent">Most recent</option>
            <option value="remaining">Most remaining</option>
            <option value="color">Colour A-Z</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🔍"
          title={`Nothing matched "${query}"`}
          description="Try a different search term or clear the weight filter."
        />
      ) : (
        <div
          className={cn(
            "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {filtered.map((yarn) => (
            <YarnCard key={yarn.id} yarn={yarn} />
          ))}
        </div>
      )}
    </div>
  );
}

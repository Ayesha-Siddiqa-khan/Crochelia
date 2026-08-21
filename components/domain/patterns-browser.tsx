"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/primitives/input";
import { Badge } from "@/components/primitives/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { PatternCard, type PatternCardData } from "@/components/domain/pattern-card";
import { DIFFICULTIES, PROJECT_TYPES } from "@/lib/validation/project";
import { cn } from "@/lib/utils";
import type { PatternWithCreator } from "@/lib/db/patterns";

function toCardData(p: PatternWithCreator): PatternCardData {
  return {
    id: p.id,
    name: p.name,
    creatorName: p.profiles?.display_name ?? p.profiles?.username ?? "Unknown maker",
    difficulty: (p.difficulty as PatternCardData["difficulty"]) ?? "beginner",
    imageUrl: p.image_url,
    aiGenerated: p.origin === "ai_generated",
  };
}

export function PatternsBrowser({
  publicPatterns,
  myPatterns,
  isSignedIn,
}: {
  publicPatterns: PatternWithCreator[];
  myPatterns: PatternWithCreator[];
  isSignedIn: boolean;
}) {
  const [tab, setTab] = React.useState<"library" | "mine">("library");
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");

  const source = tab === "mine" ? myPatterns : publicPatterns;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((p) => {
      const matchesType = typeFilter === "all" || p.project_type === typeFilter;
      const matchesDifficulty = difficultyFilter === "all" || p.difficulty === difficultyFilter;
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        (p.technique ?? "").toLowerCase().includes(q);
      return matchesType && matchesDifficulty && matchesQuery;
    });
  }, [source, query, typeFilter, difficultyFilter]);

  return (
    <div>
      {isSignedIn && (
        <div className="mb-4 inline-flex rounded-[var(--radius-md)] bg-surface-sunken p-1">
          <button
            onClick={() => setTab("library")}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "library" ? "bg-surface-raised text-text-brand shadow-[var(--shadow-xs)]" : "text-text-secondary",
            )}
          >
            Library
          </button>
          <button
            onClick={() => setTab("mine")}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "mine" ? "bg-surface-raised text-text-brand shadow-[var(--shadow-xs)]" : "text-text-secondary",
            )}
          >
            My patterns
            {myPatterns.length > 0 && (
              <Badge tone="brand" className="ml-1.5">
                {myPatterns.length}
              </Badge>
            )}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patterns..."
            className="pl-9"
            aria-label="Search patterns"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
            className="h-9 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-2 text-xs capitalize"
          >
            <option value="all">All types</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Filter by difficulty"
            className="h-9 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-2 text-xs capitalize"
          >
            <option value="all">All difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🔍"
          title={
            source.length === 0
              ? tab === "mine"
                ? "You haven't written any patterns yet"
                : "No public patterns yet"
              : `Nothing matched "${query}"`
          }
          description={
            source.length === 0
              ? "Be the first to publish one, or write one just for yourself."
              : "Try a different search term or clear the filters."
          }
        />
      ) : (
        <div className="mt-6 flex flex-wrap gap-4">
          {filtered.map((pattern) => (
            <Link key={pattern.id} href={`/patterns/${pattern.id}`}>
              <PatternCard pattern={toCardData(pattern)} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

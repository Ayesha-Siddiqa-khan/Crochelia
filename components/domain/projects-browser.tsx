"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/surfaces/card";
import { Badge } from "@/components/primitives/badge";
import { Input } from "@/components/primitives/input";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProgressBar } from "@/components/domain/progress-bar";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/db/projects";

const STATUS_TONE = {
  planning: "info",
  in_progress: "brand",
  paused: "warning",
  completed: "success",
  archived: "neutral",
} as const;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In progress" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesStatus = status === "all" || p.status === status;
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.type.replace("_", " ").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [projects, query, status]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-9"
            aria-label="Search projects"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                status === f.value
                  ? "bg-pink-500 text-white"
                  : "bg-surface-sunken text-text-secondary hover:bg-pink-50 hover:text-text-brand",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🔍"
          title={`Nothing matched "${query}"`}
          description="Try a different search term or clear the status filter."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card interactive className="h-full p-5">
                <Badge tone={STATUS_TONE[project.status as keyof typeof STATUS_TONE]} className="capitalize">
                  {project.status.replace("_", " ")}
                </Badge>
                <h2 className="mt-3 font-display text-lg text-text-primary">{project.name}</h2>
                <p className="text-sm capitalize text-text-tertiary">
                  {project.type.replace("_", " ")}
                </p>
                {project.total_squares ? (
                  <div className="mt-4">
                    <ProgressBar
                      value={project.completed_squares}
                      max={project.total_squares}
                      label={`${project.name} progress`}
                    />
                    <p className="mt-1.5 text-xs text-text-tertiary">
                      {project.completed_squares} / {project.total_squares} squares
                    </p>
                  </div>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

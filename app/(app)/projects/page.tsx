import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listProjects } from "@/lib/db/projects";
import { Card } from "@/components/surfaces/card";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProgressBar } from "@/components/domain/progress-bar";
import { Plus } from "lucide-react";

const STATUS_TONE = {
  planning: "info",
  in_progress: "brand",
  paused: "warning",
  completed: "success",
  archived: "neutral",
} as const;

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await listProjects(user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-text-primary">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🧶"
          title="Your crochet story starts here"
          description="Create your first project and start tracking your progress."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="size-4" /> Create project
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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

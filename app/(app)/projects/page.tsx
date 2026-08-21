import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listProjects } from "@/lib/db/projects";
import { Button } from "@/components/primitives/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProjectsBrowser } from "@/components/domain/projects-browser";
import { Plus } from "lucide-react";

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
        <div className="mt-6">
          <ProjectsBrowser projects={projects} />
        </div>
      )}
    </div>
  );
}

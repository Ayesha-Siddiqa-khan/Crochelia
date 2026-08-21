import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMostRecentActiveProject, listProjects } from "@/lib/db/projects";
import { listYarnStash } from "@/lib/db/yarn";
import { Button } from "@/components/primitives/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { DashboardHero } from "@/components/domain/dashboard-hero";
import { StatTile } from "@/components/domain/stat-tile";
import { YarnStashPreview } from "@/components/domain/yarn-stash-preview";
import { FolderKanban, Grid3x3, CheckCircle2, Package } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeProject, allProjects, stash] = await Promise.all([
    getMostRecentActiveProject(user.id),
    listProjects(user.id),
    listYarnStash(user.id),
  ]);

  const name = user.profile.display_name ?? user.profile.username;

  const totalProjects = allProjects.length;
  const completedProjects = allProjects.filter((p) => p.status === "completed").length;
  const totalSquares = allProjects.reduce((sum, p) => sum + (p.completed_squares ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardHero name={name} activeProject={activeProject} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          icon={<FolderKanban className="size-4" />}
          label="Total projects"
          value={totalProjects}
          gradient="bg-gradient-to-br from-[var(--surface-blush)] to-[var(--surface-raised)]"
          delay={0}
        />
        <StatTile
          icon={<CheckCircle2 className="size-4" />}
          label="Completed"
          value={completedProjects}
          gradient="bg-gradient-to-br from-[var(--surface-blush-deep)] to-[var(--surface-raised)]"
          delay={0.05}
        />
        <StatTile
          icon={<Grid3x3 className="size-4" />}
          label="Squares made"
          value={totalSquares}
          gradient="bg-gradient-to-br from-[var(--pink-50)] to-[var(--surface-raised)]"
          delay={0.1}
        />
        <StatTile
          icon={<Package className="size-4" />}
          label="Yarns in stash"
          value={stash.length}
          gradient="bg-gradient-to-br from-[var(--surface-blush)] to-[var(--surface-raised)]"
          delay={0.15}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-text-primary">My Yarn Stash</h2>
          <Link href="/yarn" className="text-sm font-medium text-text-brand hover:underline">
            View all
          </Link>
        </div>

        {stash.length > 0 ? (
          <YarnStashPreview items={stash.slice(0, 6)} />
        ) : (
          <EmptyState
            className="mt-4"
            icon="🧵"
            title="Your yarn shelf is waiting"
            description="Add the yarn you own so Crochelia can tell you what's covered before you start a project."
            action={
              <Button variant="secondary" asChild>
                <Link href="/yarn">Add yarn</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMostRecentActiveProject } from "@/lib/db/projects";
import { listYarnStash } from "@/lib/db/yarn";
import { Card } from "@/components/surfaces/card";
import { Button } from "@/components/primitives/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProgressBar } from "@/components/domain/progress-bar";
import { Badge } from "@/components/primitives/badge";
import { ArrowRight, Plus } from "lucide-react";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeProject, stash] = await Promise.all([
    getMostRecentActiveProject(user.id),
    listYarnStash(user.id),
  ]);

  const name = user.profile.display_name ?? user.profile.username;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-text-primary">
          {greeting()}, {name} 🧶
        </h1>
        <p className="mt-1 text-text-secondary">Let&rsquo;s continue creating something beautiful.</p>
      </div>

      {activeProject ? (
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <Badge tone="brand" className="capitalize">
                {activeProject.status.replace("_", " ")}
              </Badge>
              <h2 className="mt-2 font-display text-2xl text-text-primary">
                {activeProject.name}
              </h2>
              {activeProject.total_squares ? (
                <>
                  <div className="mt-4 max-w-sm">
                    <ProgressBar
                      value={activeProject.completed_squares}
                      max={activeProject.total_squares}
                      label={`${activeProject.name} progress`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    {activeProject.completed_squares} / {activeProject.total_squares} squares
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-text-secondary">No square count yet.</p>
              )}
            </div>
            <Button asChild>
              <Link href={`/projects/${activeProject.id}`}>
                Continue project <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <EmptyState
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
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-text-primary">My Yarn Stash</h2>
          <Link href="/yarn" className="text-sm font-medium text-text-brand hover:underline">
            View all
          </Link>
        </div>

        {stash.length > 0 ? (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {stash.slice(0, 6).map((yarn) => (
              <div
                key={yarn.id}
                className="flex w-40 shrink-0 flex-col gap-2 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-3"
              >
                <span
                  className="h-16 w-full rounded-[var(--radius-md)]"
                  style={{ background: yarn.color_swatch_hex ?? "var(--pink-200)" }}
                  aria-hidden
                />
                <p className="truncate text-sm font-medium text-text-primary">
                  {yarn.color_name}
                </p>
                <p className="text-xs text-text-tertiary">{Math.round(yarn.remaining_grams)}g left</p>
              </div>
            ))}
          </div>
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

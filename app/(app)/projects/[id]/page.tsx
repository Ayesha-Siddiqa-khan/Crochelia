import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getProject } from "@/lib/db/projects";
import { Badge } from "@/components/primitives/badge";
import { ProgressUpdater } from "@/components/domain/progress-updater";
import { ArchiveButton } from "@/components/domain/archive-button";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  let project;
  try {
    project = await getProject(user.id, id);
  } catch {
    notFound();
  }
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="brand" className="capitalize">
            {project.status.replace("_", " ")}
          </Badge>
          <h1 className="mt-2 font-display text-3xl text-text-primary">{project.name}</h1>
          <p className="mt-1 text-sm capitalize text-text-tertiary">
            {project.type.replace("_", " ")}
            {project.size ? ` · Size ${project.size.toUpperCase()}` : ""}
          </p>
        </div>
        <ArchiveButton projectId={project.id} />
      </div>

      {project.description && (
        <p className="mt-4 text-text-secondary">{project.description}</p>
      )}

      {project.total_squares ? (
        <div className="mt-6">
          <ProgressUpdater
            projectId={project.id}
            initialCompleted={project.completed_squares}
            total={project.total_squares}
          />
        </div>
      ) : null}

      {project.notes && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-sunken p-5">
          <p className="text-sm font-semibold text-text-primary">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-text-secondary">{project.notes}</p>
        </div>
      )}
    </div>
  );
}

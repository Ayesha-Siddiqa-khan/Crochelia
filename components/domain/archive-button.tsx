"use client";

import { useTransition } from "react";
import { Archive } from "lucide-react";
import { archiveProjectAction } from "@/app/actions/projects";
import { Button } from "@/components/primitives/button";

export function ArchiveButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={isPending}
      onClick={() => {
        if (confirm("Archive this project? You can find it later under archived projects.")) {
          startTransition(() => archiveProjectAction(projectId));
        }
      }}
    >
      <Archive className="size-4" /> Archive
    </Button>
  );
}

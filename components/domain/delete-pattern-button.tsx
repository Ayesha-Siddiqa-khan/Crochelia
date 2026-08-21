"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePatternAction } from "@/app/actions/patterns";
import { Button } from "@/components/primitives/button";

export function DeletePatternButton({ patternId }: { patternId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={isPending}
      onClick={() => {
        if (confirm("Delete this pattern? This can't be undone.")) {
          startTransition(() => deletePatternAction(patternId));
        }
      }}
    >
      <Trash2 className="size-4" /> Delete
    </Button>
  );
}

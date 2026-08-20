"use client";

import { useTransition } from "react";
import { grantCapabilityAction, revokeCapabilityAction } from "@/app/actions/admin";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";

const GRANTABLE = ["designer", "seller", "admin"] as const;

export function CapabilityControls({
  userId,
  capabilities,
}: {
  userId: string;
  capabilities: string[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {capabilities.map((cap) => (
        <Badge key={cap} tone="brand" className="capitalize">
          {cap}
          <button
            aria-label={`Revoke ${cap}`}
            disabled={isPending}
            onClick={() => startTransition(() => revokeCapabilityAction(userId, cap))}
            className="ml-0.5 text-text-brand/70 hover:text-danger-fg"
          >
            ×
          </button>
        </Badge>
      ))}
      {GRANTABLE.filter((c) => !capabilities.includes(c)).map((cap) => (
        <Button
          key={cap}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs capitalize"
          disabled={isPending}
          onClick={() => startTransition(() => grantCapabilityAction(userId, cap))}
        >
          + {cap}
        </Button>
      ))}
    </div>
  );
}

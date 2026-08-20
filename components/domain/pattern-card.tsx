import Image from "next/image";
import { Badge } from "@/components/primitives/badge";
import { Card } from "@/components/surfaces/card";

export interface PatternCardData {
  id: string;
  name: string;
  creatorName: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  imageUrl?: string | null;
  aiGenerated?: boolean;
}

const DIFFICULTY_TONE = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
} as const;

export function PatternCard({ pattern }: { pattern: PatternCardData }) {
  return (
    <Card interactive className="w-56 shrink-0 overflow-hidden">
      <div className="relative aspect-[4/5] w-full bg-surface-sunken">
        {pattern.imageUrl ? (
          <Image
            src={pattern.imageUrl}
            alt={pattern.name}
            fill
            sizes="224px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">🧶</div>
        )}
        {pattern.aiGenerated && (
          <Badge tone="ai" className="absolute left-2 top-2">
            AI-generated
          </Badge>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-text-primary">{pattern.name}</p>
        <p className="truncate text-xs text-text-tertiary">by {pattern.creatorName}</p>
        <Badge tone={DIFFICULTY_TONE[pattern.difficulty]} className="mt-2 capitalize">
          {pattern.difficulty}
        </Badge>
      </div>
    </Card>
  );
}

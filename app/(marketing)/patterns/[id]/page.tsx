import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPattern } from "@/lib/db/patterns";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { DeletePatternButton } from "@/components/domain/delete-pattern-button";

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  let pattern;
  try {
    pattern = await getPattern(id);
  } catch {
    notFound();
  }
  if (!pattern) notFound();

  const isOwner = user?.id === pattern.user_id;
  if (pattern.visibility === "private" && !isOwner) notFound();

  const creatorName = pattern.profiles?.display_name ?? pattern.profiles?.username ?? "Unknown maker";

  const canEstimatePricing =
    pattern.total_squares != null && pattern.square_size_cm != null && pattern.yarn_weight != null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {pattern.image_url && (
        <div className="relative mb-6 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface-sunken">
          <Image
            src={pattern.image_url}
            alt={pattern.name}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {pattern.difficulty && (
              <Badge tone="brand" className="capitalize">
                {pattern.difficulty}
              </Badge>
            )}
            {pattern.origin === "ai_generated" && <Badge tone="ai">AI-generated</Badge>}
            <Badge tone="neutral" className="capitalize">
              {pattern.visibility}
            </Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl text-text-primary">{pattern.name}</h1>
          <p className="mt-1 text-sm text-text-tertiary">by {creatorName}</p>
        </div>
        {isOwner && <DeletePatternButton patternId={pattern.id} />}
      </div>

      {pattern.origin === "ai_generated" && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-pink-200 bg-surface-blush p-3 text-sm text-text-secondary">
          This pattern was generated and has not been tested. Work a small sample before
          committing yarn.
        </div>
      )}

      {pattern.description && <p className="mt-4 text-text-secondary">{pattern.description}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border-subtle py-4 text-sm sm:grid-cols-3">
        {pattern.project_type && (
          <div>
            <dt className="text-text-tertiary">Type</dt>
            <dd className="capitalize text-text-primary">{pattern.project_type.replace("_", " ")}</dd>
          </div>
        )}
        {pattern.technique && (
          <div>
            <dt className="text-text-tertiary">Technique</dt>
            <dd className="text-text-primary">{pattern.technique}</dd>
          </div>
        )}
        {pattern.yarn_weight && (
          <div>
            <dt className="text-text-tertiary">Yarn weight</dt>
            <dd className="capitalize text-text-primary">{pattern.yarn_weight}</dd>
          </div>
        )}
        {pattern.hook_size_mm && (
          <div>
            <dt className="text-text-tertiary">Hook size</dt>
            <dd className="text-text-primary">{pattern.hook_size_mm}mm</dd>
          </div>
        )}
        {pattern.gauge && (
          <div>
            <dt className="text-text-tertiary">Gauge</dt>
            <dd className="text-text-primary">{pattern.gauge}</dd>
          </div>
        )}
      </dl>

      {pattern.materials && (
        <Section title="Materials" content={pattern.materials} />
      )}
      {pattern.abbreviations && (
        <Section title="Abbreviations" content={pattern.abbreviations} />
      )}
      <Section title="Instructions" content={pattern.instructions} mono />
      {pattern.notes && <Section title="Notes" content={pattern.notes} />}

      {canEstimatePricing && (
        <div className="mt-8 flex items-center justify-between rounded-[var(--radius-lg)] border border-border-subtle bg-surface-blush p-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">If you sold this</p>
            <p className="text-xs text-text-secondary">
              See a costed price estimate for this pattern in the Pricing Calculator.
            </p>
          </div>
          <Button asChild>
            <Link href={`/pricing?pattern=${pattern.id}`}>
              <Calculator className="size-4" /> Calculate
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function Section({ title, content, mono }: { title: string; content: string; mono?: boolean }) {
  return (
    <div className="mt-6">
      <h2 className="font-display text-lg text-text-primary">{title}</h2>
      <p
        className={`mt-2 whitespace-pre-wrap text-sm text-text-secondary ${mono ? "font-mono leading-relaxed" : ""}`}
      >
        {content}
      </p>
    </div>
  );
}

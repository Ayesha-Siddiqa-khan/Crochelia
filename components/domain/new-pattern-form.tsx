"use client";

import * as React from "react";
import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import { createPatternAction, type PatternActionResult } from "@/app/actions/patterns";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { PROJECT_TYPES, DIFFICULTIES } from "@/lib/validation/project";
import { WEIGHT_CLASSES } from "@/lib/validation/yarn";
import { VISIBILITIES } from "@/lib/validation/pattern";

const initialState: PatternActionResult = {};

export function NewPatternForm({ aiEnabled }: { aiEnabled: boolean }) {
  const [state, formAction, pending] = useActionState(createPatternAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-dashed border-pink-200 bg-surface-blush p-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            <Sparkles className="size-4 text-text-brand" /> Generate a draft with AI
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Describe what you want and get a structured starting point — always labelled as
            generated and untested, fully editable before you save.
          </p>
        </div>
        <Badge tone={aiEnabled ? "success" : "neutral"} className="shrink-0">
          {aiEnabled ? "Available" : "Needs API key"}
        </Badge>
      </div>

      <ImagePicker error={state.fieldErrors?.image} />

      <Field label="Pattern name" error={state.fieldErrors?.name}>
        <Input name="name" required placeholder="Blush Granny Cardigan" defaultValue={state.values?.name} />
      </Field>

      <Field label="Description" error={state.fieldErrors?.description}>
        <Textarea
          name="description"
          rows={2}
          placeholder="A short summary of the finished piece"
          defaultValue={state.values?.description}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Type" error={state.fieldErrors?.projectType}>
          <Select name="projectType" defaultValue="">
            <option value="">Not set</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Difficulty" error={state.fieldErrors?.difficulty}>
          <Select name="difficulty" defaultValue="">
            <option value="">Not set</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Yarn weight" error={state.fieldErrors?.yarnWeight}>
          <Select name="yarnWeight" defaultValue="">
            <option value="">Not set</option>
            {WEIGHT_CLASSES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Technique" error={state.fieldErrors?.technique}>
          <Input name="technique" placeholder="Tunisian, filet..." defaultValue={state.values?.technique} />
        </Field>
        <Field label="Hook size (mm)" error={state.fieldErrors?.hookSizeMm}>
          <Input name="hookSizeMm" type="number" step="0.1" min={1} placeholder="4.0" />
        </Field>
        <Field label="Gauge" error={state.fieldErrors?.gauge}>
          <Input name="gauge" placeholder="16 sc x 18 rows / 10cm" defaultValue={state.values?.gauge} />
        </Field>
      </div>

      <Field label="Materials" error={state.fieldErrors?.materials}>
        <Textarea
          name="materials"
          rows={3}
          placeholder="One per line — yarn, hook, notions..."
          defaultValue={state.values?.materials}
        />
      </Field>

      <Field label="Abbreviations" error={state.fieldErrors?.abbreviations}>
        <Textarea
          name="abbreviations"
          rows={2}
          placeholder="sc = single crochet, dc = double crochet..."
          defaultValue={state.values?.abbreviations}
        />
      </Field>

      <Field label="Instructions" error={state.fieldErrors?.instructions}>
        <Textarea
          name="instructions"
          rows={10}
          required
          className="font-mono"
          placeholder={"Round 1: 6 sc in magic ring (6)\nRound 2: 2 sc in each st around (12)\n..."}
          defaultValue={state.values?.instructions}
        />
      </Field>

      <Field label="Notes" error={state.fieldErrors?.notes}>
        <Textarea name="notes" rows={2} defaultValue={state.values?.notes} />
      </Field>

      <Field label="Visibility" error={state.fieldErrors?.visibility}>
        <Select name="visibility" defaultValue={state.values?.visibility ?? "private"}>
          {VISIBILITIES.map((v) => (
            <option key={v} value={v}>
              {v === "private" ? "Private — only you" : v === "unlisted" ? "Unlisted — anyone with the link" : "Public — in the library"}
            </option>
          ))}
        </Select>
      </Field>

      {state.error && (
        <p role="alert" className="text-sm text-danger-fg">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} size="lg">
        Save pattern
      </Button>
    </form>
  );
}

function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-sm capitalize text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
    >
      {children}
    </select>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}

function ImagePicker({ error }: { error?: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <Field label="Photo (optional)" error={error}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-border-default bg-surface-sunken text-2xl text-text-tertiary hover:border-pink-300 hover:text-text-brand"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            "🧶"
          )}
        </button>
        <div className="flex flex-col gap-1">
          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
                setFileName(file.name);
              } else {
                setPreviewUrl(null);
                setFileName(null);
              }
            }}
          />
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Browse from your computer
          </Button>
          <p className="text-xs text-text-tertiary">
            {fileName ?? "PNG, JPEG, or WEBP · up to 5MB"}
          </p>
        </div>
      </div>
    </Field>
  );
}

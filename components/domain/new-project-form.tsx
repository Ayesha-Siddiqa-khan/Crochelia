"use client";

import * as React from "react";
import { useActionState } from "react";
import { createProjectAction, type ProjectActionResult } from "@/app/actions/projects";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  calculateGarmentSquares,
  calculateGrannySquareGrid,
  type GarmentSize,
  type GarmentType,
} from "@/lib/calculators";
import { GARMENT_TYPES, PROJECT_TYPES, SIZES, DIFFICULTIES } from "@/lib/validation/project";

const initialState: ProjectActionResult = {};

const TYPE_LABELS: Record<(typeof PROJECT_TYPES)[number], string> = {
  cardigan: "Cardigan",
  sweater: "Sweater",
  blanket: "Blanket",
  bag: "Bag",
  scarf: "Scarf",
  top: "Top",
  skirt: "Skirt",
  accessory: "Accessory",
  amigurumi: "Amigurumi",
  granny_square: "Granny-square project",
  custom: "Custom",
};

const isGarmentType = (t: string): t is GarmentType =>
  (GARMENT_TYPES as readonly string[]).includes(t);
const needsSize = (t: string) => ["cardigan", "sweater", "top", "skirt"].includes(t);

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState(createProjectAction, initialState);
  const [type, setType] = React.useState<string>("granny_square");
  const [size, setSize] = React.useState<GarmentSize>("m");
  const [squareSizeCm, setSquareSizeCm] = React.useState(10);
  const [widthCm, setWidthCm] = React.useState(50);
  const [lengthCm, setLengthCm] = React.useState(60);

  const garmentResult = React.useMemo(() => {
    if (!isGarmentType(type)) return null;
    try {
      return calculateGarmentSquares({
        type,
        size: needsSize(type) ? size : undefined,
        squareSizeCm,
      });
    } catch {
      return null;
    }
  }, [type, size, squareSizeCm]);

  const grannyResult = React.useMemo(() => {
    if (type !== "granny_square") return null;
    try {
      return calculateGrannySquareGrid({ widthCm, lengthCm, squareSizeCm });
    } catch {
      return null;
    }
  }, [type, widthCm, lengthCm, squareSizeCm]);

  const totalSquares = grannyResult?.totalSquares ?? garmentResult?.totalSquares ?? undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Project name" error={state.fieldErrors?.name}>
        <Input
          id="name"
          name="name"
          required
          placeholder="Pink Granny Cardigan"
          defaultValue={state.values?.name}
        />
      </Field>

      <Field label="Type" error={state.fieldErrors?.type}>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Difficulty" error={state.fieldErrors?.difficulty}>
        <select
          id="difficulty"
          name="difficulty"
          defaultValue=""
          className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
        >
          <option value="">Not sure yet</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d} className="capitalize">
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" error={state.fieldErrors?.description}>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What are you making, and for whom?"
          defaultValue={state.values?.description}
        />
      </Field>

      {(isGarmentType(type) || type === "granny_square") && (
        <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-sunken p-4">
          <p className="text-sm font-semibold text-text-primary">Calculate squares</p>

          {isGarmentType(type) && needsSize(type) && (
            <div className="mt-3">
              <label htmlFor="sizeSelect" className="text-xs font-medium text-text-tertiary">
                Size
              </label>
              <select
                id="sizeSelect"
                value={size}
                onChange={(e) => setSize(e.target.value as GarmentSize)}
                className="mt-1 h-10 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-sm uppercase"
              >
                {SIZES.filter((s) => s !== "custom").map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
              <input type="hidden" name="size" value={size} />
            </div>
          )}

          {type === "granny_square" ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <NumberField label="Width (cm)" value={widthCm} onChange={setWidthCm} />
              <NumberField label="Length (cm)" value={lengthCm} onChange={setLengthCm} />
              <NumberField label="Square (cm)" value={squareSizeCm} onChange={setSquareSizeCm} />
            </div>
          ) : (
            <div className="mt-3">
              <NumberField label="Square size (cm)" value={squareSizeCm} onChange={setSquareSizeCm} />
            </div>
          )}
          <input type="hidden" name="squareSizeCm" value={squareSizeCm} />

          {garmentResult && (
            <ul className="mt-3 space-y-1 text-sm text-text-secondary">
              {garmentResult.pieces.map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span>
                    {p.name} {p.count > 1 ? `×${p.count}` : ""}
                  </span>
                  <span className="text-text-primary">{p.totalSquares} sq</span>
                </li>
              ))}
            </ul>
          )}

          {(garmentResult || grannyResult) && (
            <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3">
              <Badge tone="brand">Calculated</Badge>
              <p className="font-display text-2xl text-text-brand">{totalSquares} squares</p>
            </div>
          )}
        </div>
      )}

      {(isGarmentType(type) || type === "granny_square") && (
        <input type="hidden" name="totalSquares" value={totalSquares ?? ""} />
      )}

      {state.error && (
        <p role="alert" className="text-sm text-danger-fg">
          {state.error}
        </p>
      )}

      <Button type="submit" loading={pending} size="lg">
        Create project
      </Button>
    </form>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-text-tertiary">{label}</span>
      <Input
        type="number"
        inputMode="decimal"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-9 text-sm"
      />
    </label>
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

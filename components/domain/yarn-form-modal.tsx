"use client";

import * as React from "react";
import { useActionState } from "react";
import { Plus } from "lucide-react";
import { Modal, ModalTrigger, ModalContent } from "@/components/surfaces/modal";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { Button } from "@/components/primitives/button";
import { createYarnStashAction, type YarnActionResult } from "@/app/actions/yarn";
import { WEIGHT_CLASSES } from "@/lib/validation/yarn";
import { toast } from "@/components/feedback/toast";

const initialState: YarnActionResult = {};

export function YarnFormModal() {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(createYarnStashAction, initialState);
  const wasPending = React.useRef(false);

  React.useEffect(() => {
    if (wasPending.current && !pending && !state.error && !state.fieldErrors) {
      setOpen(false);
      toast({ title: "Yarn added to your stash", tone: "success" });
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>
          <Plus className="size-4" /> Add yarn
        </Button>
      </ModalTrigger>
      <ModalContent title="Add yarn to your stash" description="Track what you own so Crochelia can tell you what's covered.">
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" error={state.fieldErrors?.name}>
              <Input name="name" required placeholder="Sugar Bush Cotton" />
            </Field>
            <Field label="Brand" error={state.fieldErrors?.brand}>
              <Input name="brand" placeholder="Optional" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Colour name" error={state.fieldErrors?.colorName}>
              <Input name="colorName" required placeholder="Soft Pink" />
            </Field>
            <Field label="Swatch colour" error={state.fieldErrors?.colorSwatchHex}>
              <Input name="colorSwatchHex" type="color" defaultValue="#FBA5C0" className="h-11 p-1" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight class" error={state.fieldErrors?.weightClass}>
              <select
                name="weightClass"
                defaultValue="worsted"
                className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-sm capitalize"
              >
                {WEIGHT_CLASSES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fibre" error={state.fieldErrors?.fiber}>
              <Input name="fiber" placeholder="Cotton, acrylic..." />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Total (g)" error={state.fieldErrors?.totalGrams}>
              <Input name="totalGrams" type="number" min={0} required defaultValue={100} />
            </Field>
            <Field label="Remaining (g)" error={state.fieldErrors?.remainingGrams}>
              <Input name="remainingGrams" type="number" min={0} required defaultValue={100} />
            </Field>
          </div>

          <Field label="Notes" error={state.fieldErrors?.notes}>
            <Textarea name="notes" rows={2} placeholder="Dye lot, where you bought it..." />
          </Field>

          {state.error && (
            <p role="alert" className="text-sm text-danger-fg">
              {state.error}
            </p>
          )}

          <Button type="submit" loading={pending} className="mt-1">
            Add to stash
          </Button>
        </form>
      </ModalContent>
    </Modal>
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
      <label className="text-xs font-medium text-text-tertiary">{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}

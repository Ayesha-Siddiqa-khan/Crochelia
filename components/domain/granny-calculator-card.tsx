"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { calculateGrannySquareGrid } from "@/lib/calculators";
import { Input } from "@/components/primitives/input";
import { cn } from "@/lib/utils";

const MAX_PREVIEW_SQUARES = 48;

export function GrannyCalculatorCard({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [widthCm, setWidthCm] = React.useState(50);
  const [lengthCm, setLengthCm] = React.useState(60);
  const [squareSizeCm, setSquareSizeCm] = React.useState(10);

  const result = React.useMemo(() => {
    try {
      return calculateGrannySquareGrid({ widthCm, lengthCm, squareSizeCm });
    } catch {
      return null;
    }
  }, [widthCm, lengthCm, squareSizeCm]);

  const previewCount = result ? Math.min(result.totalSquares, MAX_PREVIEW_SQUARES) : 0;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-[var(--radius-xl)] border border-border-subtle bg-surface-raised/90 p-6 shadow-[var(--shadow-lg)] backdrop-blur-md",
        className,
      )}
    >
      <p className="font-display text-lg text-text-primary">Granny square calculator</p>
      <p className="mt-0.5 text-xs text-text-tertiary">Try it — change any number</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Field label="Width" unit="cm" value={widthCm} onChange={setWidthCm} />
        <Field label="Length" unit="cm" value={lengthCm} onChange={setLengthCm} />
        <Field label="Square" unit="cm" value={squareSizeCm} onChange={setSquareSizeCm} />
      </div>

      {result && (
        <>
          <div className="mt-4 flex items-center justify-center gap-2 border-y border-border-subtle py-3 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{result.across}</span>
            <span>across</span>
            <span aria-hidden>×</span>
            <span className="font-semibold text-text-primary">{result.down}</span>
            <span>down</span>
          </div>

          <div className="mt-3 text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={result.totalSquares}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="font-display text-4xl text-text-brand"
              >
                {result.totalSquares}
              </motion.span>
            </AnimatePresence>
            <p className="text-xs text-text-tertiary">squares · calculated, not estimated</p>
          </div>

          <div
            className="mt-4 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${Math.min(result.across, 8)}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {Array.from({ length: previewCount }).map((_, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-[3px] bg-pink-200"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: reduceMotion ? 0 : Math.min(i * 0.01, 0.3) }}
              />
            ))}
            {result.totalSquares > MAX_PREVIEW_SQUARES && (
              <div className="col-span-full mt-1 text-center text-[10px] text-text-tertiary">
                +{result.totalSquares - MAX_PREVIEW_SQUARES} more
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-text-tertiary">{label}</span>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          min={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-9 pr-7 text-sm"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary">
          {unit}
        </span>
      </div>
    </label>
  );
}

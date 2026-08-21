"use client";

import * as React from "react";
import {
  estimateYarnRequirement,
  calculatePricing,
  type YarnWeightClass,
} from "@/lib/calculators";
import { WEIGHT_CLASSES } from "@/lib/validation/yarn";
import { Input } from "@/components/primitives/input";
import { Badge } from "@/components/primitives/badge";

export interface PricingCalculatorProps {
  initialTotalSquares?: number;
  initialSquareSizeCm?: number;
  initialYarnWeight?: YarnWeightClass;
  currency: string;
  contextLabel?: string;
}

function formatMoney(minor: number, currency: string) {
  return `${currency} ${(minor / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function PatternPricingCalculator({
  initialTotalSquares = 30,
  initialSquareSizeCm = 10,
  initialYarnWeight = "worsted",
  currency,
  contextLabel,
}: PricingCalculatorProps) {
  const [totalSquares, setTotalSquares] = React.useState(initialTotalSquares);
  const [squareSizeCm, setSquareSizeCm] = React.useState(initialSquareSizeCm);
  const [yarnWeight, setYarnWeight] = React.useState<YarnWeightClass>(initialYarnWeight);
  const [costPerSkein, setCostPerSkein] = React.useState(250);
  const [laborHours, setLaborHours] = React.useState(12);
  const [laborRate, setLaborRate] = React.useState(125);
  const [packaging, setPackaging] = React.useState(200);
  const [delivery, setDelivery] = React.useState(150);
  const [feePercent, setFeePercent] = React.useState(5);

  const yarnEstimate = React.useMemo(() => {
    try {
      return estimateYarnRequirement({ totalSquares, squareSizeCm, weightClass: yarnWeight });
    } catch {
      return null;
    }
  }, [totalSquares, squareSizeCm, yarnWeight]);

  const pricing = React.useMemo(
    () =>
      calculatePricing({
        materialCostMinor: (yarnEstimate?.recommendedSkeins ?? 0) * costPerSkein * 100,
        laborHours,
        laborRateMinorPerHour: laborRate * 100,
        packagingMinor: packaging * 100,
        deliveryMinor: delivery * 100,
        platformFeePercent: feePercent,
        currency,
      }),
    [yarnEstimate, costPerSkein, laborHours, laborRate, packaging, delivery, feePercent, currency],
  );

  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-sunken p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-text-primary">Pricing calculator</h2>
        <Badge tone="brand">Estimate</Badge>
      </div>
      {contextLabel && <p className="mt-1 text-xs text-text-tertiary">{contextLabel}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <NumberField label="Total squares" value={totalSquares} onChange={setTotalSquares} />
        <NumberField label="Square size (cm)" value={squareSizeCm} onChange={setSquareSizeCm} />
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-text-tertiary">Yarn weight</span>
          <select
            value={yarnWeight}
            onChange={(e) => setYarnWeight(e.target.value as YarnWeightClass)}
            className="h-9 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-2 text-sm capitalize"
          >
            {WEIGHT_CLASSES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
      </div>

      {yarnEstimate && (
        <div className="mt-4 rounded-[var(--radius-md)] bg-surface-raised p-3 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Estimated yarn needed</span>
            <span className="font-medium text-text-primary">
              ~{Math.round(yarnEstimate.estimatedGrams)}g ({yarnEstimate.recommendedSkeins}{" "}
              skeins with buffer)
            </span>
          </div>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Confidence: {yarnEstimate.confidence} — based on standard gauge for {yarnWeight}, not
            your own swatch.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <NumberField label={`Cost / skein (${currency})`} value={costPerSkein} onChange={setCostPerSkein} />
        <NumberField label="Labour hours" value={laborHours} onChange={setLaborHours} />
        <NumberField label={`Labour rate / hr (${currency})`} value={laborRate} onChange={setLaborRate} />
        <NumberField label={`Packaging (${currency})`} value={packaging} onChange={setPackaging} />
        <NumberField label={`Delivery (${currency})`} value={delivery} onChange={setDelivery} />
        <NumberField label="Platform fee (%)" value={feePercent} onChange={setFeePercent} />
      </div>

      <div className="mt-4 space-y-1 border-t border-border-default pt-3 font-mono text-sm">
        <Line label="Material cost" value={formatMoney(pricing.materialCostMinor, currency)} />
        <Line label="Labour" value={formatMoney(pricing.laborCostMinor, currency)} />
        <Line label="Packaging" value={formatMoney(pricing.packagingMinor, currency)} />
        <Line label="Delivery" value={formatMoney(pricing.deliveryMinor, currency)} />
        <Line label="Platform fee" value={formatMoney(pricing.platformFeeMinor, currency)} />
        <div className="my-1 border-t border-border-default" />
        <Line label="Estimated cost" value={formatMoney(pricing.estimatedCostMinor, currency)} strong />
      </div>

      <div className="mt-3 rounded-[var(--radius-md)] bg-surface-blush p-4 text-center">
        <p className="text-xs text-text-tertiary">Suggested price (estimate)</p>
        <p className="font-display text-2xl text-text-brand">
          {formatMoney(pricing.suggestedPriceLowMinor, currency)} –{" "}
          {formatMoney(pricing.suggestedPriceHighMinor, currency)}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">
          Estimated profit {formatMoney(pricing.estimatedProfitLowMinor, currency)} –{" "}
          {formatMoney(pricing.estimatedProfitHighMinor, currency)} (
          {Math.round(pricing.marginLowPercent)}–{Math.round(pricing.marginHighPercent)}% margin)
        </p>
      </div>
    </div>
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
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-9 text-sm"
      />
    </label>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

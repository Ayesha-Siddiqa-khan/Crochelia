"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, label, className }: ProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const percent = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
      >
        <motion.div
          className="h-full rounded-full bg-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}

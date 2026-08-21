"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/domain/animated-number";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  gradient: string;
  delay?: number;
}

export function StatTile({ icon, label, value, suffix, gradient, delay = 0 }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]",
        gradient,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-full bg-white/60 text-text-brand backdrop-blur-sm">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-text-primary">
        <AnimatedNumber value={value} />
        {suffix}
      </p>
      <p className="mt-0.5 text-xs font-medium text-text-secondary">{label}</p>
    </motion.div>
  );
}

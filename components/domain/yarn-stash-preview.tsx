"use client";

import { motion } from "framer-motion";
import type { YarnStashItem } from "@/lib/db/yarn";

export function YarnStashPreview({ items }: { items: YarnStashItem[] }) {
  return (
    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
      {items.map((yarn, i) => (
        <motion.div
          key={yarn.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="flex w-40 shrink-0 flex-col gap-2 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-3 shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
        >
          <span
            className="h-16 w-full rounded-[var(--radius-md)]"
            style={{ background: yarn.color_swatch_hex ?? "var(--pink-200)" }}
            aria-hidden
          />
          <p className="truncate text-sm font-medium text-text-primary">{yarn.color_name}</p>
          <p className="text-xs text-text-tertiary">{Math.round(yarn.remaining_grams)}g left</p>
        </motion.div>
      ))}
    </div>
  );
}

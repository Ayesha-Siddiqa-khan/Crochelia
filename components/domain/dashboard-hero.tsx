"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { ProgressRing } from "@/components/domain/progress-ring";
import { Badge } from "@/components/primitives/badge";
import type { Project } from "@/lib/db/projects";

export function DashboardHero({
  name,
  activeProject,
}: {
  name: string;
  activeProject: Project | null;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle p-8 sm:p-10"
      style={{
        background:
          "radial-gradient(120% 100% at 100% 0%, var(--pink-100) 0%, transparent 55%), radial-gradient(90% 90% at 0% 100%, var(--surface-blush) 0%, transparent 60%), var(--surface-raised)",
      }}
    >
      {/* Floating decorative glow blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--pink-300), transparent 70%)" }}
        animate={reduceMotion ? undefined : { y: [0, 16, 0], x: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--pink-200), transparent 70%)" }}
        animate={reduceMotion ? undefined : { y: [0, -14, 0], x: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-10 top-10 text-3xl"
        animate={reduceMotion ? undefined : { rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🧶
      </motion.span>

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl leading-[1.05] text-text-primary sm:text-5xl"
          >
            {greeting()}, <span className="text-text-brand">{name}</span> 🧶
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 max-w-sm text-text-secondary"
          >
            Let&rsquo;s continue creating something beautiful.
          </motion.p>

          {!activeProject && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button size="lg" className="mt-6" asChild>
                <Link href="/projects/new">
                  <Plus className="size-4" /> Create your first project
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        {activeProject && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised/80 p-5 backdrop-blur-sm"
          >
            <div
              className="rounded-full"
              style={{ filter: "drop-shadow(0 0 18px var(--pink-300))" }}
            >
              <ProgressRing
                value={activeProject.completed_squares}
                max={activeProject.total_squares ?? 1}
                size={104}
                strokeWidth={9}
              />
            </div>
            <div className="min-w-0">
              <Badge tone="brand" className="capitalize">
                {activeProject.status.replace("_", " ")}
              </Badge>
              <p className="mt-1.5 truncate font-display text-xl text-text-primary">
                {activeProject.name}
              </p>
              {activeProject.total_squares ? (
                <p className="text-sm text-text-tertiary">
                  {activeProject.completed_squares} / {activeProject.total_squares} squares
                </p>
              ) : null}
              <Button size="sm" className="mt-3" asChild>
                <Link href={`/projects/${activeProject.id}`}>
                  Continue <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {!activeProject && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative mt-2 flex items-center gap-1.5 text-xs font-medium text-text-brand"
        >
          <Sparkles className="size-3.5" /> Your crochet story starts here
        </motion.div>
      )}
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { GrannyCalculatorCard } from "@/components/domain/granny-calculator-card";
import { EASE_OUT } from "@/lib/motion";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: EASE_OUT },
  }),
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const headlineWords = ["Create.", "Crochet.", "Share."];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, var(--pink-100) 0%, transparent 60%), radial-gradient(45% 40% at 10% 30%, var(--surface-blush) 0%, transparent 55%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--pink-200), transparent 70%)" }}
        animate={reduceMotion ? undefined : { y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
        <div>
          <h1 className="font-display text-5xl leading-[0.98] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                variants={wordVariants}
                className={`mr-4 inline-block ${word === "Crochet." ? "text-text-brand" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-lg text-text-secondary"
          >
            Plan your projects, discover beautiful patterns, manage your yarn, track your
            progress, and share your crochet journey.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start creating <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/patterns">Explore patterns</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.62, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <GrannyCalculatorCard />
        </motion.div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/primitives/button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-sm font-medium text-text-brand">About Crochelia</p>
      <h1 className="mt-2 font-display text-4xl text-text-primary">
        A digital home for crocheters
      </h1>
      <p className="mt-4 text-text-secondary">
        Crochelia brings the whole crochet journey — discover, plan, calculate, make, track,
        share, and sell — into one connected, honest product. Every number it shows you is
        either calculated in the open or clearly labelled as an estimate; nothing is guessed
        and passed off as fact.
      </p>
      <p className="mt-4 text-text-secondary">
        Built by <span className="font-medium text-text-primary">Ayesha Siddiqa</span>.
      </p>

      <Button size="lg" className="mt-8" asChild>
        <Link href="/sign-up">Start creating</Link>
      </Button>
    </div>
  );
}

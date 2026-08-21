import type { Metadata } from "next";
import { ComingSoon } from "@/components/domain/coming-soon";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return (
    <ComingSoon
      icon="🔎"
      eyebrow="Discover"
      title="Find your next make"
      description="A feed of patterns and projects matched to your skill level, the yarn already in your stash, and what you've saved before."
      bullets={[
        "Recommendations that check your stash before suggesting a pattern",
        "Filter by project type, difficulty, technique, and yarn weight",
        "Follow designers and creators whose style you like",
      ]}
      primaryHref="/projects/new"
      primaryLabel="Start a project now"
    />
  );
}

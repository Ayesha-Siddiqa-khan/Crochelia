import type { Metadata } from "next";
import { ComingSoon } from "@/components/domain/coming-soon";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <ComingSoon
      icon="🧡"
      eyebrow="Community"
      title="Share your finished work"
      description="A visual feed for posting finished projects, tagging the pattern and yarn you used, and following makers whose work you love — closer to a creative portfolio than a forum."
      bullets={[
        "Post photos with your project, pattern, and yarn tagged",
        "Follow creators and save posts into collections",
        "Your profile becomes a crochet portfolio others can browse",
      ]}
      primaryHref="/settings/profile"
      primaryLabel="View your profile"
    />
  );
}

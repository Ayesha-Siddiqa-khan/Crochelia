import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-text-primary">Privacy</h1>
      <div className="mt-6 flex flex-col gap-4 text-text-secondary">
        <p>
          Crochelia stores your account details (email, username, display name), the
          projects, yarn stash, and patterns you create, and nothing beyond what the product
          needs to function.
        </p>
        <p>
          Your projects, yarn stash, and business data are private by default and enforced at
          the database level — other users cannot read them regardless of what the interface
          shows, because access is checked on every request, not just hidden in the UI.
        </p>
        <p>
          We do not sell your data or share it with third parties for advertising. Patterns
          you explicitly mark public or unlisted become visible to others, exactly as
          described when you set that visibility.
        </p>
        <p>
          Questions about your data — including requests to export or delete it — can go to{" "}
          <a
            href="mailto:proeditorpakistanifeeling@gmail.com"
            className="text-text-brand hover:underline"
          >
            proeditorpakistanifeeling@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

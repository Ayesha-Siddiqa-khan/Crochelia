import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-text-primary">Terms</h1>
      <div className="mt-6 flex flex-col gap-4 text-text-secondary">
        <p>
          Crochelia is provided as-is, without warranty. Calculated values (square counts,
          piece breakdowns) are deterministic and tested; anything labelled an estimate —
          yarn quantities, suggested pricing — is exactly that, an estimate, and is never
          guaranteed to be exact.
        </p>
        <p>
          Patterns you publish as public or unlisted remain yours; you are responsible for
          only uploading patterns you have the rights to share. AI-generated patterns are
          always labelled as generated and untested — verify them with a swatch before
          committing yarn to a full project.
        </p>
        <p>
          You are responsible for keeping your account credentials secure. Don&rsquo;t use
          Crochelia for anything unlawful or for uploading content you don&rsquo;t have the
          rights to.
        </p>
        <p>
          Questions about these terms can go to{" "}
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

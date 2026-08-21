import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listPublicPatterns, listMyPatterns } from "@/lib/db/patterns";
import { Button } from "@/components/primitives/button";
import { PatternsBrowser } from "@/components/domain/patterns-browser";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Patterns" };

export default async function PatternsPage() {
  const user = await getCurrentUser();

  const [publicPatterns, myPatterns] = await Promise.all([
    listPublicPatterns(),
    user ? listMyPatterns(user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">Patterns</h1>
          <p className="mt-1 text-text-secondary">
            Browse the library, or write one of your own.
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/patterns/new">
              <Plus className="size-4" /> New pattern
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-6">
        <PatternsBrowser
          publicPatterns={publicPatterns}
          myPatterns={myPatterns}
          isSignedIn={Boolean(user)}
        />
      </div>
    </div>
  );
}

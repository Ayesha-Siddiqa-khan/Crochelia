import { getCurrentUser } from "@/lib/auth/current-user";
import { listYarnStash } from "@/lib/db/yarn";
import { YarnFormModal } from "@/components/domain/yarn-form-modal";
import { YarnCard } from "@/components/domain/yarn-card";
import { EmptyState } from "@/components/feedback/empty-state";

export default async function YarnStashPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const stash = await listYarnStash(user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-text-primary">Yarn Stash</h1>
        <YarnFormModal />
      </div>

      {stash.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🧵"
          title="Your yarn shelf is waiting"
          description="Add the yarn you own so Crochelia can tell you what's covered before you start a project."
        />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stash.map((yarn) => (
            <YarnCard key={yarn.id} yarn={yarn} />
          ))}
        </div>
      )}
    </div>
  );
}

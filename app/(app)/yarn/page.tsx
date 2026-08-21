import { getCurrentUser } from "@/lib/auth/current-user";
import { listYarnStash } from "@/lib/db/yarn";
import { YarnFormModal } from "@/components/domain/yarn-form-modal";
import { YarnBrowser } from "@/components/domain/yarn-browser";
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
        <div className="mt-6">
          <YarnBrowser items={stash} />
        </div>
      )}
    </div>
  );
}

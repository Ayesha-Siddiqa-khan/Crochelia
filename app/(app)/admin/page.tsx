import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPlatformStats, listAllUsers } from "@/lib/db/admin";
import { Card } from "@/components/surfaces/card";
import { CapabilityControls } from "@/components/domain/capability-controls";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user.capabilities.includes("admin")) redirect("/dashboard");

  const [stats, users] = await Promise.all([getPlatformStats(), listAllUsers()]);

  const statTiles = [
    { label: "Total users", value: stats.total_users },
    { label: "Active projects", value: stats.active_projects },
    { label: "Total projects", value: stats.total_projects },
    { label: "Yarn items tracked", value: stats.total_yarn_items },
    { label: "Sellers", value: stats.sellers },
    { label: "Designers", value: stats.designers },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">Admin</h1>
      <p className="mt-1 text-text-secondary">Platform overview and user management.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statTiles.map((tile) => (
          <Card key={tile.label} className="p-4">
            <p className="font-display text-3xl text-text-brand">{tile.value}</p>
            <p className="mt-1 text-xs text-text-tertiary">{tile.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-text-primary">Users</h2>
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-border-subtle">
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken text-left text-xs uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{u.display_name ?? u.username}</p>
                    <p className="text-xs text-text-tertiary">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <CapabilityControls userId={u.id} capabilities={u.capabilities} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-xs text-text-tertiary">
        Content moderation (posts, patterns, reports) will appear here once the Community and
        Pattern Library modules ship in later phases.
      </p>
    </div>
  );
}

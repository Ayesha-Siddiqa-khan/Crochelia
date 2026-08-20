import { getCurrentUser } from "@/lib/auth/current-user";
import { signOutAction } from "@/app/actions/auth";
import { Card } from "@/components/surfaces/card";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl text-text-primary">Your profile</h1>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-pink-100 text-2xl font-semibold text-text-brand">
            {(user.profile.display_name ?? user.profile.username).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl text-text-primary">
              {user.profile.display_name ?? user.profile.username}
            </p>
            <p className="text-sm text-text-tertiary">@{user.profile.username}</p>
          </div>
        </div>

        {user.capabilities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {user.capabilities.map((cap) => (
              <Badge key={cap} tone="brand" className="capitalize">
                {cap}
              </Badge>
            ))}
          </div>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border-subtle pt-4 text-sm">
          <div>
            <dt className="text-text-tertiary">Email</dt>
            <dd className="text-text-primary">{user.email}</dd>
          </div>
          <div>
            <dt className="text-text-tertiary">Skill level</dt>
            <dd className="capitalize text-text-primary">{user.profile.skill_level}</dd>
          </div>
        </dl>

        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </Card>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AppNav } from "@/components/domain/app-nav";
import { BottomNav } from "@/components/domain/bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <AppNav
        displayName={user.profile.display_name ?? user.profile.username}
        avatarUrl={user.profile.avatar_url}
        isSeller={user.capabilities.includes("seller")}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

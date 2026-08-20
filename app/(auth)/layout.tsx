import Link from "next/link";
import { Logo } from "@/components/domain/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-blush px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-[var(--radius-xl)] border border-border-subtle bg-surface-raised p-8 shadow-[var(--shadow-md)]">
          {children}
        </div>
      </div>
    </div>
  );
}

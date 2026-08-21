import { getCurrentUser } from "@/lib/auth/current-user";
import { ComingSoon } from "@/components/domain/coming-soon";

export default async function BusinessPage() {
  const user = await getCurrentUser();
  const isSeller = user?.capabilities.includes("seller") ?? false;

  if (!isSeller) {
    return (
      <ComingSoon
        icon="🏷️"
        eyebrow="Business"
        title="Sell what you make"
        description="Products, orders, customers, and a pricing calculator — the seller workspace for turning finished pieces into income. Ask an admin to enable selling on your account to get early access as it ships."
        bullets={[
          "Costed, honest price suggestions — always a range, never a false promise",
          "Track orders from new through to completed",
          "A seller dashboard with real revenue, expenses, and profit — no sample data",
        ]}
        primaryHref="/dashboard"
        primaryLabel="Back to dashboard"
      />
    );
  }

  return (
    <ComingSoon
      icon="🏷️"
      eyebrow="Business"
      title="Your seller workspace is almost here"
      description="Products, inventory, customers, orders, and the pricing calculator are being built next. The Crochelia pricing calculator in lib/calculators/pricing.ts already powers the numbers you'll see here."
      bullets={[
        "Add products with materials, cost, and selling price",
        "Track orders from new through to completed",
        "A seller dashboard with real revenue, expenses, and profit",
      ]}
      primaryHref="/dashboard"
      primaryLabel="Back to dashboard"
    />
  );
}

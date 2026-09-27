import type { Metadata } from "next";
import TrustContent from "./_components/TrustContent";

export const metadata: Metadata = {
  title: "Trust & Safety | KeySpace",
  description:
    "Learn how KeySpace protects tenants and landlords in Bangladesh. Discover user verification, secure Stripe payments, legally binding digital leases, and direct conflict mediation support.",
};

export default function TrustPage() {
  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background">
      <TrustContent />
    </main>
  );
}

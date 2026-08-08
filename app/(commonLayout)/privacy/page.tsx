import type { Metadata } from "next";
import Link from "next/link";
import { Eye, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rent Nest",
  description:
    "Review the Privacy Policy of Rent Nest. Learn how we collect, protect, share, and manage user details and payment history in Bangladesh.",
};

export default function PrivacyPage() {
  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background select-text">
      {/* Hero Header */}
      <section className="relative pt-28 overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center bg-radial from-primary/10 via-background to-background border-b border-border/40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="mx-auto max-w-3xl flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            <Eye className="size-3.5" />
            Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-none">
            Privacy <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Your privacy is of utmost importance to us. Learn about what info we collect, process, and secure. Last updated: August 9, 2026.
          </p>
        </div>
      </section>

      {/* Main Document Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="space-y-10 text-foreground/90">
          
          <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 backdrop-blur-md">
            <div className="flex gap-3 items-start">
              <ShieldCheck className="size-5.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Rent Nest values user transparency. We encrypt sensitive traffic/records, integrate with gold-standard processors like Stripe, and keep compliance details safe under data protection guidelines.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We collect user details when you request accounts, lists, leases, or process transaction bills:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li><strong>Personal Profile Metadata:</strong> Names, email addresses, phone contacts, occupational background details, and digital profiling photos.</li>
              <li><strong>Government Identity Check Details:</strong> For account verification/approval reviews, national NID copies, Passport details, and deed records.</li>
              <li><strong>Financial Transactions Log:</strong> While payment details are handled by Stripe, we track transaction references, invoice logs, booking amounts, and timing reports.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              2. How We Use Informational Records
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We process records to offer services, secure transactions, and maintain community safeguards:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>Delivering properties browse results, location suggestions, and booking application routes.</li>
              <li>Enforcing safety protocols, landlord verification, and tenant verification systems.</li>
              <li>Compiling transaction stats, invoice notifications, and payout receipts.</li>
              <li>Responding to support tickets, report alerts, and dispute mediation requests.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Rent Nest does not sell your personal records to marketing companies. We disclose information strictly under these rules:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li><strong>With other platform users:</strong> Lease applicants see landlord profile details, and landlords see matching tenant qualifications to approve tenancies.</li>
              <li><strong>With Payment processor partners:</strong> Stripe receives required card parameters and NID compliance details directly and securely.</li>
              <li><strong>Under official legal demands:</strong> We disclose data to court bodies or regulatory authorities if requested to support legal and security demands.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              4. Data Protection and Encryption
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We use Transport Layer Security (TLS/SSL) encryption for all client-to-server exchanges. Database records are encrypted at rest, and admin accounts follow multi-factor credentials access guidelines to defend user info against leaks.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              5. Profile Access Rights and Choices
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You may access, update, correct, or close your accounts directly from user profile dashboards. For complete removal of files and verification archives, you can submit requests to our operations desk.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              6. Policy Updates
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We update this policy as platform integrations evolve. When adjustments are introduced, we will update the &quot;Last updated&quot; notification details above. Continued platform search interactions denote acceptance of privacy revisions.
            </p>
          </div>

          {/* Contact Support Footer */}
          <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-foreground">Questions about our privacy guidelines?</h3>
              <p className="text-xs text-muted-foreground">Reach our data protection and safety compliance team.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-200"
            >
              Contact Support
              <Mail className="size-3.5" />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

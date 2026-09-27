import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ShieldCheck, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | KeySpace",
  description:
    "Review the Terms of Service and user agreements governing the use of KeySpace property search and lease matching services in Bangladesh.",
};

export default function TermsPage() {
  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background select-text">
      {/* Hero Header */}
      <section className="relative pt-28 overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center bg-radial from-primary/10 via-background to-background border-b border-border/40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="mx-auto max-w-3xl flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            <Scale className="size-3.5" />
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-none">
            Terms of <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Please read these terms carefully before accessing or using the KeySpace portal. Last updated: August 9, 2026.
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
                By registering an account, listing properties, or completing transactions on KeySpace, you agree to comply with these terms, as well as our Privacy Policy and Community Guidelines.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Welcome to KeySpace (the &quot;Platform&quot;). These Terms of Service state the rules and conditions for accessing and using our website, services, and mobile applications. By accessing or using our platform, you agree to be bound by these terms. If you do not agree to these terms, you may not access or use the platform.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              2. User Accounts and Verification
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              To list properties or submit lease applications, you must register for a KeySpace account. You agree to provide accurate, current, and complete information. You are responsible for keeping your login credentials secure.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              KeySpace integrates national identity verification. We reserve the right, but do not assume the obligation, to verify any user information, listings, or documents submitted to our database.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              3. Properties and Listings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Landlords are solely responsible for compliance with local regulations, including housing standards, rent restrictions, and taxation laws in Bangladesh. Listed property descriptions, rates, photos, and availability must be true and non-deceptive. KeySpace reserves the right to suspend or remove listings that fail quality checks or generate tenant complaints.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              4. Payment Processing and Fees
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our payments are processed in collaboration with Stripe. KeySpace may charge booking processing fees, service commissions, or recurring listing subscriptions. All payments made through the platform are subject to the Stripe Services Agreement. Direct cash payments outside the KeySpace escrow systems are strictly prohibited and nullify all platform fraud protections.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              5. Dispute Resolution and Mediation
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In the event of a dispute between landlord and tenant regarding deposits, property damages, or tenancy termination, the parties agree to first engage in good-faith mediation facilitated by KeySpace support agents.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              KeySpace provides a matching portal and property listing database. To the maximum extent permitted by law, KeySpace shall not be liable for direct, indirect, incidental, or consequential damages resulting from user interactions, physical property inspections, lease breaches, or third-party payment system failures.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2">
              7. Governing Law
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh.
            </p>
          </div>

          {/* Contact Support Footer */}
          <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-foreground">Have questions about these terms?</h3>
              <p className="text-xs text-muted-foreground">Reach our legal and compliance desk directly.</p>
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

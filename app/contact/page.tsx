import type { Metadata } from "next";
import ContactInfo from "./_components/ContactInfo";
import ContactFAQ from "./_components/ContactFAQ";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Rent Nest",
  description:
    "Have questions about listings, lease approvals, or payments? Contact Rent Nest support team and view FAQs.",
};

export default function ContactPage() {
  return (
    <main className="-mt-18 flex flex-col flex-1 bg-background">
      {/* Premium Hero Header */}
      <section className="relative pt-28 overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-center bg-radial from-primary/10 via-background to-background">
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="mx-auto max-w-3xl flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5 fill-primary/10" />
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-none">
            We&apos;re Here to <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Help</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Have questions about finding a property, managing active leases, or handling monthly payments? Reach out via our support channels.
          </p>
        </div>
      </section>

      {/* Info Channels Section */}
      <ContactInfo />

      {/* FAQ Accordion Section */}
      <ContactFAQ />
    </main>
  );
}

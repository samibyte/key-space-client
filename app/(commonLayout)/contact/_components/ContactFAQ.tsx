"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function ContactFAQ() {
  const faqs = [
    {
      q: "How do I request a property viewing?",
      a: "Go to any property listing page and click on the 'Request Rental' button. You can select your desired move-in date and send a message. The landlord will contact you to arrange a viewing.",
    },
    {
      q: "Is the lease matching secure?",
      a: "Yes, 100%. We verify all landlords and check tenant identity. Leases are digitally signed and securely stored, keeping both parties fully protected under legal terms.",
    },
    {
      q: "How can I pay my rent online?",
      a: "Once the landlord approves your lease, rent invoices will appear on your Tenant Dashboard. You can pay securely using credit cards, debit cards, or local mobile wallets (bKash) through our system.",
    },
    {
      q: "What is your listing refund policy?",
      a: "Listing a property on KeySpace is absolutely free. For payment processing and booking deposits, queries are subject to our standard refund policy which you can access in your dashboard.",
    },
    {
      q: "How do I contact support in an emergency?",
      a: "For immediate payment or access assistance, call our hotline +880 1800-KEYSPACE-01 during office hours. Otherwise, email support@keyspace.com.bd.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-muted/30 border-t border-border/40 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Quick answers to the most common queries about KeySpace lease matching, bookings, and payments.
          </p>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/20 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="size-4.5 text-primary/70 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <Minus className="size-4 text-muted-foreground shrink-0 ml-4 animate-scale-in" />
                  ) : (
                    <Plus className="size-4 text-muted-foreground shrink-0 ml-4 animate-scale-in" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-60 border-t border-border/40" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

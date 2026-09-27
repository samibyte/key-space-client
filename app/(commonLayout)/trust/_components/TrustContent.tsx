"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  PhoneCall,
  AlertTriangle,
  HelpCircle,
  Plus,
  Minus,
  Check,
  Send,
  Building,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TrustContent() {
  const [activeTab, setActiveTab] = useState<"renters" | "landlords">("renters");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Concern Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitConcern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all the details.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request to trust team
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Concern submitted successfully! Our Trust & Safety team will review this and respond within 2 hours.", {
      description: "Ticket ID: RN-TRUST-" + Math.floor(100000 + Math.random() * 900000),
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  const faqData = [
    {
      q: "How does KeySpace verify listings and properties?",
      a: "Every listing on KeySpace undergoes a multi-layer verification process. First, we cross-reference landlord ownership documents and deeds. Second, our field team performs physical verification of selected premium spaces or performs video verification calls to confirm property features, exact location, and amenities listed.",
    },
    {
      q: "Is my payment information and lease transaction safe?",
      a: "Absolutely. KeySpace does not store your credit card or bank details. All transactions are securely processed by Stripe, a global payment processor compliant with PCI-DSS Level 1 security. Deposits are kept safe and only released on the specified move-in dates.",
    },
    {
      q: "How do you check landlord and renter identities?",
      a: "We integrate with national ID (NID) and Passport database checks to verify the official identities of both landlords and renters before they can sign a digital lease. Verified accounts display a verified shield badge next to their names across the platform.",
    },
    {
      q: "What should I do if a user asks to transact outside the platform?",
      a: "Always transact and communicate through KeySpace. Paying outside the platform invalidates our safety guarantees, deposit insurance protection, and refund policies. If anyone prompts you to send cash or use external payment links, please report it immediately using the support form below.",
    },
    {
      q: "How is legal tenancy enforcement managed?",
      a: "Our digital leases are drafted in cooperation with legal experts following the Rent Control Act and contract laws of Bangladesh. When signed electronically, they stand as legally binding contracts. In the rare event of breaches or disputes, either party can request mediation from KeySpace's legal support panel.",
    },
  ];

  const tenantSafeties = [
    {
      icon: <ShieldCheck className="size-6 text-primary shrink-0" />,
      title: "Verified Landlords Only",
      desc: "Connect only with landlords whose official IDs and property titles are fully verified by our operations team.",
    },
    {
      icon: <Lock className="size-6 text-emerald-500 shrink-0" />,
      title: "Secure Deposit Escrow",
      desc: "Your security deposit is securely held and only transferred to the landlord once you successfully check in.",
    },
    {
      icon: <UserCheck className="size-6 text-indigo-500 shrink-0" />,
      title: "Anti-Scam Guarantees",
      desc: "Guaranteed match or a full refund. We ensure you get the exact property seen in the pictures, or we find a replacement.",
    },
    {
      icon: <FileText className="size-6 text-amber-500 shrink-0" />,
      title: "Legally Binding Leases",
      desc: "Next-gen digital lease agreements signed via OTP, binding under Bangladesh rental laws to protect your rights.",
    },
  ];

  const landlordSafeties = [
    {
      icon: <UserCheck className="size-6 text-primary shrink-0" />,
      title: "Verified Tenant Profiles",
      desc: "Access verified profiles showing occupation verification, student status, and validated national NID checks.",
    },
    {
      icon: <Lock className="size-6 text-emerald-500 shrink-0" />,
      title: "Automated Rent Collection",
      desc: "Enjoy regular direct-to-bank monthly rent deposits. Stripe integration enforces secure card collections and automated billing.",
    },
    {
      icon: <Shield className="size-6 text-indigo-500 shrink-0" />,
      title: "Property Damage Assurance",
      desc: "Rest easy with security deposits structured under clear legal terms to safeguard your property from unwarranted damages.",
    },
    {
      icon: <FileText className="size-6 text-amber-500 shrink-0" />,
      title: "Fast Eviction/Breach Support",
      desc: "Access digitized contracts that clearly detail landlord rights, tenant responsibilities, and accelerated resolution support.",
    },
  ];

  return (
    <div className="flex flex-col flex-1 w-full bg-background">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-radial from-primary/10 via-background to-background overflow-hidden border-b border-border/40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="mx-auto max-w-4xl flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 hover:scale-105 transition-transform duration-200">
            <Sparkles className="size-3.5 fill-primary/10 text-primary" />
            Your Safety is Our Commitment
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-none">
            Trust & Safety at <br />
<span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            KeySpace
          </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            We build tools, verification systems, and smart safeguards so you can search, list, sign, and list properties in Bangladesh with absolute confidence.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full mt-10 p-5 rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-md shadow-lg">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">100%</span>
              <span className="text-xs text-muted-foreground font-medium">Verified Accounts</span>
            </div>
            <div className="flex flex-col items-center border-l border-border/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">Secure</span>
              <span className="text-xs text-muted-foreground font-medium">Stripe Payment Gateway</span>
            </div>
            <div className="flex flex-col items-center border-l border-border/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">Legal</span>
              <span className="text-xs text-muted-foreground font-medium">Binding Lease Agreement</span>
            </div>
            <div className="flex flex-col items-center border-l border-border/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">24/7</span>
              <span className="text-xs text-muted-foreground font-medium">Safety Response Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars / Interactive Guidelines */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Core Pillars / Interactive Guidelines
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Choose your profile below to explore customized safety protocols and dispute guards that apply to your rental journey.
          </p>

          {/* Sliding Pill Tab Switcher */}
          <div className="flex p-1 bg-muted/60 dark:bg-zinc-900/60 rounded-full border border-border/50 max-w-xs w-full mt-6">
            <button
              onClick={() => setActiveTab("renters")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === "renters"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              For Renters
            </button>
            <button
              onClick={() => setActiveTab("landlords")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === "landlords"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building className="size-4" />
              For Landlords
            </button>
          </div>
        </div>

        {/* Dynamic Pillar Cards Grid */}
        <div className="relative min-h-[400px]">
          {/* Renters Screen Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out ${
              activeTab === "renters"
                ? "opacity-100 translate-y-0 relative pointer-events-auto"
                : "opacity-0 translate-y-4 absolute top-0 left-0 w-full pointer-events-none"
            }`}
          >
            {tenantSafeties.map((safety, idx) => (
              <div
                key={idx}
                className="group flex gap-5 p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:scale-[1.01] hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/5 transition-colors duration-300">
                  {safety.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {safety.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {safety.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Landlords Screen Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out ${
              activeTab === "landlords"
                ? "opacity-100 translate-y-0 relative pointer-events-auto"
                : "opacity-0 translate-y-4 absolute top-0 left-0 w-full pointer-events-none"
            }`}
          >
            {landlordSafeties.map((safety, idx) => (
              <div
                key={idx}
                className="group flex gap-5 p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:scale-[1.01] hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/5 transition-colors duration-300">
                  {safety.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {safety.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {safety.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Accordion FAQs */}
      <section className="bg-muted/30 border-t border-border/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Verification & Legal FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Safety & Verification Demystified
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Got unanswered details? Read about listings verification, payment protection, and dispute protocols.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqData.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/20 transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="size-4.5 text-primary/70 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <Minus className="size-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 rotate-180" />
                    ) : (
                      <Plus className="size-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200" />
                    )}
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-72 border-t border-border/40" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <p className="p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed bg-muted/10">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Support Ticket Form / Report Concern */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-linear-to-b from-background via-muted/10 to-background">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-6 sm:p-10 border border-border/70 bg-card/60 backdrop-blur-md shadow-xl">
            {/* Background design elements */}
            <div className="absolute top-0 right-10 -translate-y-1/2 w-28 h-28 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl -z-10" />

            <div className="text-center flex flex-col items-center gap-3 mb-8">
              <div className="size-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <AlertTriangle className="size-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Report a Property or Safety Incident
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                Did you run into a fake listing, suspicious payment requests, or terms violations? Our trust response agents will investigate within 2 hours.
              </p>
            </div>

            <form onSubmit={handleSubmitConcern} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-foreground/80">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Tanvir Rahman"
                    className="h-10 rounded-xl bg-background border-border/60 text-sm focus-visible:ring-primary/20"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground/80">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g., tanvir@gmail.com"
                    className="h-10 rounded-xl bg-background border-border/60 text-sm focus-visible:ring-primary/20"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-foreground/80">
                  Incident Subject / Issue Type
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="E.g., Suspicious landlord requesting cash deposit outside platform"
                  className="h-10 rounded-xl bg-background border-border/60 text-sm focus-visible:ring-primary/20"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-foreground/80">
                  Details / Description
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide property address, link (if any), and full description of findings..."
                  className="min-h-28 rounded-xl bg-background border-border/60 text-sm focus-visible:ring-primary/20 resize-y"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Submitting Ticket...
                  </>
                ) : (
                  <>
                    Submit Safe Ticket
                    <Send className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Direct hotline */}
            <div className="mt-8 pt-6 border-t border-border/40 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <PhoneCall className="size-3.5 text-primary" />
                Urgent Assistance? Contact our Trust Hotline: <span className="font-semibold text-foreground">+880 1800-KEYSPACE-HELP</span> (Mon-Sun, 9 AM - 9 PM)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

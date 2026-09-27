"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubscribed(true);
    toast.success("Thank you for subscribing to KeySpace newsletters!");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/60 overflow-hidden">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-md" />

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Logo className="w-14 sm:w-16" />
            </Link>
            <p className="text-sm font-normal text-muted-foreground leading-relaxed max-w-xs">
              KeySpace is the leading property placement & verification
              platform in Bangladesh. We connect premium renters with verified
              landlords, offering seamless digital leases and secure payments.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedin className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Links Column 1: Renters */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Renters
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { title: "Browse Flats", href: "/properties" },
                {
                  title: "Commercial Spaces",
                  href: "/properties?categoryId=a90d7c58-c12c-4abc-9254-e7b954443f5b",
                },
                // { title: "Renters Guide", href: "/blog/renters-guide" },
                { title: "Tenant Dashboard", href: "/dashboard/tenant" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-0.5"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2: Landlords */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Landlords
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                {
                  title: "List a Property",
                  href: "/dashboard/landlord/properties/new",
                },
                { title: "Landlord Portal", href: "/dashboard" },
                { title: "Trust & Safety", href: "/trust" },
                // { title: "Pricing & Plans", href: "/pricing" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-0.5"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                Get Updates
              </h3>
              <p className="mt-2.5 text-xs text-muted-foreground">
                Subscribe to receive notifications when premium locations open
                up.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-primary">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="text-xs font-medium">
                  Successfully subscribed!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl bg-background/80 border-border/60 text-sm focus-visible:ring-primary/20"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 font-semibold flex items-center justify-center px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </Button>
              </form>
            )}

            <div className="space-y-2 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary/70 shrink-0" />
                <span>+880 1700 000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary/70 shrink-0" />
                <span>support@keyspace.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary/70 shrink-0 pointer-events-none" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Strip */}
        <hr className="my-10 border-border/40" />

        {/* Bottom copyright / security strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
            <span>
              &copy; {new Date().getFullYear()} KeySpace. All rights
              reserved.{" "}
            </span>
            <div className="mt-1 flex justify-center sm:justify-start gap-3">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4 order-1 sm:order-2 justify-center">
            {/* Trusted Payment Information */}
            <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3.5 py-1 text-xs text-muted-foreground shadow-xs">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>Payments Secured by Stripe</span>
            </div>

            {/* Soft inline payment cards */}
            <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-semibold px-1">
              <span className="tracking-wide">VISA</span>
              <span className="tracking-wide">MASTERCARD</span>
              {/* <span className="text-primary/80">bKash</span>
              <span className="text-primary/80">Nagad</span> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

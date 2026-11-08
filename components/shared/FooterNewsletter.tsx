"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FooterNewsletter() {
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

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
        <span>You are all set for our weekly updates!</span>
      </div>
    );
  }

  return (
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
  );
}

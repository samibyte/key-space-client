"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ChevronRight, Copy, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error("Global error caught:", error);
  }, [error]);

  const handleCopyHash = async () => {
    if (!error.digest) return;
    try {
      await navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error digest:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      {/* Premium Decorative background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-destructive/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-xl flex flex-col items-center space-y-8 z-10">
        {/* Glowing Warning Icon Banner */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping [animation-duration:3s]" />
          <div className="absolute inset-2 rounded-full border border-destructive/25 animate-pulse" />
          <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-card border border-destructive/20 rounded-full shadow-[0_4px_20px_rgba(239,68,68,0.15)] text-destructive">
            <AlertCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Messaging */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/15">
            System Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Encountered a Locked Door
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Something went wrong while rendering this page. The KeySpace team has been notified, and we are working to patch it up.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-11 px-6 bg-primary font-semibold text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 group shadow-lg shadow-primary/10 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
            Try again
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto h-11 px-6 border-border font-semibold text-foreground/80 hover:text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all duration-300"
            )}
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>

        {/* Expandable Technical Details */}
        <div className="w-full bg-card/45 backdrop-blur-md border border-border/80 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-5 py-4 flex items-center justify-between font-medium text-sm text-foreground/75 hover:bg-muted/40 transition-colors duration-200 select-none cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 animate-pulse" />
              Technical Diagnostics
            </span>
            <ChevronRight
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-300",
                showDetails && "rotate-90"
              )}
            />
          </button>

          {showDetails && (
            <div className="px-5 pb-5 pt-1 border-t border-border/40 bg-zinc-950/50 dark:bg-black/30 font-mono text-[11px] leading-relaxed text-zinc-400 select-text overflow-x-auto space-y-3">
              <div className="flex flex-col space-y-1.5">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Error Details</span>
                <p className="text-destructive/80 font-medium break-words bg-destructive/[0.04] p-2.5 rounded border border-destructive/10">
                  {error.message || "Unknown client-side exception"}
                </p>
              </div>

              {error.digest && (
                <div className="flex flex-col space-y-1.5 font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Error Hash (Digest)</span>
                  <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded border border-border/40 font-mono font-medium">
                    <span className="truncate pr-4 text-foreground/80">{error.digest}</span>
                    <button
                      onClick={handleCopyHash}
                      className="shrink-0 p-1 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
                      title="Copy Error Hash"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

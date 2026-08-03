"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

function CancelContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalRequestId");

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-md p-8 border border-border/50 bg-card rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Sleek top accent line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />

        <div className="size-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 shadow-inner">
          <AlertCircle className="size-10" />
        </div>

        <div className="space-y-2 mt-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Checkout Cancelled</h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            The payment session was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-8">
          {rentalId ? (
            <Link href={`/dashboard/tenant/rentals/${rentalId}`} className="w-full">
              <Button className="w-full gap-1.5 rounded-xl">
                <RefreshCw className="size-4 animate-pulse" /> Try Payment Again
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/tenant/rentals" className="w-full">
              <Button className="w-full gap-1.5 rounded-xl">
                <ArrowLeft className="size-4" /> Back to My Rentals
              </Button>
            </Link>
          )}
          
          <Link href="/dashboard/tenant" className="w-full">
            <Button variant="outline" className="w-full rounded-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>

      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="size-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      }>
        <CancelContent />
      </Suspense>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { useConfirmPayment } from "@/app/dashboard/tenant/_hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";


interface PaymentResponse {
  rentalRequest?: {
    property?: {
      title?: string;
    };
  };
  amount?: number;
  transactionId?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmPayment = useConfirmPayment();
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">(() =>
    sessionId ? "verifying" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(() =>
    sessionId ? "" : "Missing payment session ID in the URL."
  );
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  
  // Guard to prevent multiple invocations in dev React StrictMode
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    if (ranOnce.current) return;
    ranOnce.current = true;

    confirmPayment.mutate(sessionId, {
      onSuccess: (res) => {
        setStatus("success");
        setPaymentData(res.data);
      },
      onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.message || err?.message || "Verification failed."
        );
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-140px)]">
      <Card className="w-full max-w-md p-8 border border-border/50 bg-card rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Sleek top accent line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />

        {status === "verifying" && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="relative flex items-center justify-center">
              <Loader2 className="size-14 text-emerald-600 animate-spin" />
              <ShieldCheck className="size-6 text-emerald-600/80 absolute" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Confirming Payment</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                We are securely verifying your transaction with Stripe. Please don&apos;t close this page.
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center w-full py-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="size-16 rounded-full bg-emerald-555/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 shadow-inner bg-emerald-500/10">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground">
                Your rental request status is now <span className="font-semibold text-emerald-600">ACTIVE</span>.
              </p>
            </div>

            {/* Micro Details Stack */}
            {paymentData && (
              <div className="w-full bg-muted/30 rounded-xl border border-border/40 p-4 text-left divide-y divide-border/20 text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-semibold text-foreground max-w-44 truncate">
                    {paymentData.rentalRequest?.property?.title || "Rental Property"}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-foreground">
                    ${paymentData.amount?.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-muted-foreground max-w-48 truncate">
                    {paymentData.transactionId || "—"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Link href="/dashboard/tenant" className="flex-1">
                <Button className="w-full gap-1.5 rounded-xl">
                  Go to Dashboard <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard/tenant/rentals" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl">
                  View Leases
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center w-full py-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="size-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600">
              <XCircle className="size-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Verification Failed</h2>
              <p className="text-sm text-rose-500/90 max-w-xs leading-relaxed">
                {errorMessage || "We couldn't confirm your session status. If your card was charged, contact customer support."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Link href="/dashboard/tenant/rentals" className="flex-1">
                <Button className="w-full rounded-xl bg-orange-600 hover:bg-orange-700">
                  Back to Rentals
                </Button>
              </Link>
              <Link href="/dashboard/tenant" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <Loader2 className="size-8 text-emerald-600 animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

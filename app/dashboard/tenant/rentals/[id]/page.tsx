"use client";

import { use, useState } from "react";
import DashboardShell from "../../../_components/DashboardShell";
import { useTenantRentalById, useSubmitReview, useCreatePayment } from "../../_hooks/useTenant";
import StatusBadge from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  CreditCard,
  Star,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

const STEPS: { status: string; label: string }[] = [
  { status: "PENDING", label: "Request Submitted" },
  { status: "APPROVED", label: "Approved by Landlord" },
  { status: "ACTIVE", label: "Rental Active" },
  { status: "COMPLETED", label: "Completed" },
];

const STATUS_ORDER = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED"];

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const rejected = currentStatus === "REJECTED" || currentStatus === "CANCELLED";
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, i) => {
        const done = !rejected && currentIdx >= i;
        const active = !rejected && currentIdx === i;
        return (
          <div key={step.status} className="flex flex-1 flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div className={`h-0.5 flex-1 transition-colors ${done ? "bg-primary" : "bg-border/40"}`} />
              )}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/50 bg-muted text-muted-foreground"
                } ${active ? "ring-4 ring-primary/20" : ""}`}
              >
                {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 transition-colors ${currentIdx > i && !rejected ? "bg-primary" : "bg-border/40"}`} />
              )}
            </div>
            <p className={`mt-2 text-center text-[11px] font-medium leading-tight ${active ? "text-primary" : done ? "text-foreground/70" : "text-muted-foreground"}`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: res, isLoading } = useTenantRentalById(id);
  const submitReview = useSubmitReview();
  const createPayment = useCreatePayment();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const rental = res?.data;
  const property = rental?.property;
  const landlord = property?.landlord;

  const canReview =
    (rental?.status === "ACTIVE" || rental?.status === "COMPLETED");

  const handlePayNow = async () => {
    if (!rental) return;
    try {
      const res = await createPayment.mutateAsync(rental.id);
      if (res?.data?.checkoutUrl) window.open(res.data.checkoutUrl, "_blank");
    } catch {
      toast.error("Failed to initiate payment.");
    }
  };

  const handleReviewSubmit = async () => {
    if (!rental || rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    submitReview.mutate(
      { propertyId: rental.propertyId, rating, comment },
      {
        onSuccess: () => {
          toast.success("Review submitted. Thank you!");
          setRating(0);
          setComment("");
        },
        onError: () => toast.error("Failed to submit review."),
      }
    );
  };

  return (
    <DashboardShell
      title="Rental Detail"
      breadcrumbs={[
        { label: "My Rentals", href: "/dashboard/tenant/rentals" },
        { label: "Detail" },
      ]}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      ) : !rental ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-muted-foreground">Rental not found.</p>
          <Link href="/dashboard/tenant/rentals">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-3.5" /> Back to Rentals
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ──────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Property Card */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              {property?.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {property?.title || "Property"}
                    </h2>
                    {property?.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <MapPin className="size-3.5" />
                        {property.city}{property.area ? `, ${property.area}` : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={rental.status} />
                    {property && (
                      <Link href={`/properties/${property.id}`} target="_blank">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Rent</span>
                    <span className="text-sm font-bold text-foreground">${property?.monthlyRent?.toLocaleString("en-US")}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Move-in</span>
                    <span className="text-sm font-semibold">
                      {new Date(rental.moveInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duration</span>
                    <span className="text-sm font-semibold">{rental.durationMonths} months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-5">Rental Status</h3>
              {rental.status === "REJECTED" ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/8 border border-rose-500/20">
                  <StatusBadge status={rental.status} />
                  <p className="text-sm text-muted-foreground">
                    {rental.status === "REJECTED"
                      ? "Your rental request was not approved by the landlord."
                      : "This rental was cancelled."}
                  </p>
                </div>
              ) : (
                <StatusStepper currentStatus={rental.status} />
              )}
            </div>

            {/* Review Section */}
            {canReview && (
              <div id="review" className="rounded-2xl border border-border/50 bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-1">Write a Review</h3>
                <p className="text-xs text-muted-foreground mb-4">Share your experience with this property.</p>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-7 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-xs font-semibold text-muted-foreground">
                      {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                    </span>
                  )}
                </div>

                <Textarea
                  placeholder="Describe your experience living here…"
                  className="resize-none h-24 text-sm"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  className="mt-3 gap-1.5"
                  onClick={handleReviewSubmit}
                  disabled={submitReview.isPending}
                >
                  <Star className="size-3.5" />
                  {submitReview.isPending ? "Submitting…" : "Submit Review"}
                </Button>
              </div>
            )}
          </div>

          {/* ── Right Column ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Landlord Info */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">Landlord</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                  {landlord?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={landlord.avatar} alt={landlord.name} className="size-full rounded-full object-cover" />
                  ) : (
                    landlord?.name?.charAt(0).toUpperCase() || <User className="size-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{landlord?.name || "—"}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                    <Mail className="size-3 shrink-0" />
                    <span className="truncate">{landlord?.email || "—"}</span>
                  </div>
                </div>
              </div>
              {rental.message && (
                <div className="mt-2 p-3 rounded-xl bg-muted/40 border border-border/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Your Message</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{rental.message}</p>
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">Payment</h3>
              {rental.payment ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <StatusBadge status={rental.payment.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="text-sm font-bold">${rental.payment.amount?.toLocaleString("en-US")}</span>
                  </div>
                  {rental.payment.transactionId && (
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/30">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Transaction ID</p>
                      <p className="text-xs font-mono text-foreground/70 mt-0.5 break-all">{rental.payment.transactionId}</p>
                    </div>
                  )}
                  <Link href={`/dashboard/tenant/payments/${rental.payment.id}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <CreditCard className="size-3.5" /> View Receipt
                    </Button>
                  </Link>
                </div>
              ) : rental.status === "APPROVED" ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">Your request is approved. Complete payment to activate your rental.</p>
                  <Button
                    className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handlePayNow}
                    disabled={createPayment.isPending}
                  >
                    <CreditCard className="size-3.5" />
                    {createPayment.isPending ? "Opening Stripe…" : "Pay Now"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>Payment will be required once the landlord approves your request.</span>
                </div>
              )}
            </div>

            {/* Request Timestamps */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Timeline</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" /> Submitted</span>
                  <span className="text-xs font-medium">
                    {new Date(rental.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" /> Updated</span>
                  <span className="text-xs font-medium">
                    {new Date(rental.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

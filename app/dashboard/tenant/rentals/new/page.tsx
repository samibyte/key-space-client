"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import DashboardShell from "../../../_components/DashboardShell";
import { useCreateRentalRequest } from "../../_hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function NewRentalRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("propertyId") || "";

  const [moveInDate, setMoveInDate] = useState("");
  const [durationMonths, setDurationMonths] = useState<number | "">(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createRentalRequest = useCreateRentalRequest();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!propertyId) errs.propertyId = "No property selected. Go back and choose a property.";
    if (!moveInDate) errs.moveInDate = "Move-in date is required.";
    else if (new Date(moveInDate) < new Date()) errs.moveInDate = "Move-in date must be in the future.";
    if (!durationMonths || Number(durationMonths) < 1 || Number(durationMonths) > 24) {
      errs.durationMonths = "Duration must be between 1 and 24 months.";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    createRentalRequest.mutate(
      { propertyId, moveInDate, durationMonths: Number(durationMonths), message: message.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Rental request submitted successfully!");
          router.push("/dashboard/tenant/rentals");
        },
        onError: () => {
          toast.error("Failed to submit request. Please try again.");
        },
      }
    );
  };

  return (
    <DashboardShell
      title="Submit Rental Request"
      description="Fill in the details below. The landlord will review and respond to your request."
      breadcrumbs={[
        { label: "My Rentals", href: "/dashboard/tenant/rentals" },
        { label: "New Request" },
      ]}
    >
      <div className="max-w-lg">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Property ID (hidden confirmation) */}
            {!propertyId && (
              <div className="p-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-xs text-rose-600">
                No property selected. Please{" "}
                <a href="/properties" className="underline font-medium">browse properties</a>{" "}
                and click &quot;Request Rental&quot; from a listing.
              </div>
            )}

            {/* Move-in Date */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="moveInDate" className="text-sm font-semibold">
                Move-in Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                className="h-10"
              />
              {errors.moveInDate && (
                <p className="text-xs text-rose-500">{errors.moveInDate}</p>
              )}
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="durationMonths" className="text-sm font-semibold">
                Duration (months) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="durationMonths"
                type="number"
                min={1}
                max={24}
                value={durationMonths}
                onChange={(e) =>
                  setDurationMonths(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 6"
                className="h-10"
              />
              <p className="text-[11px] text-muted-foreground">Between 1 and 24 months.</p>
              {errors.durationMonths && (
                <p className="text-xs text-rose-500">{errors.durationMonths}</p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="text-sm font-semibold">
                Message to Landlord{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself, mention your occupation, or ask any questions…"
                className="resize-none h-28 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="gap-2 mt-1"
              disabled={createRentalRequest.isPending || !propertyId}
            >
              <Send className="size-3.5" />
              {createRentalRequest.isPending ? "Submitting…" : "Submit Request"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  SquareStack,
  Image as ImageIcon,
  Save,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProperty, updateProperty } from "@/services/landlord.service";
import { clientGet } from "@/lib/axios/apiClient";
import type { Category, Property } from "@/types/property.type";
import { cn } from "@/lib/utils";

interface PropertyFormProps {
  initialData?: Property | null;
  isEdit?: boolean;
  propertyId?: string;
}

export default function PropertyForm({
  initialData,
  isEdit = false,
  propertyId,
}: PropertyFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  const {
    mutateAsync: createMutate,
    isPending: createPending,
    error: createError,
  } = useMutation<
    Awaited<ReturnType<typeof createProperty>>,
    Error,
    Record<string, unknown>
  >({
    mutationFn: (data) => createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord", "stats"] });
    },
  });

  const {
    mutateAsync: updateMutate,
    isPending: updatePending,
    error: updateError,
  } = useMutation<
    Awaited<ReturnType<typeof updateProperty>>,
    Error,
    { id: string; data: Record<string, unknown> }
  >({
    mutationFn: ({ id, data }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
    },
  });

  const isPending = createPending || updatePending;
  const submitError = createError || updateError;

  const AMENITIES = [
    "Wifi",
    "Parking",
    "Pool",
    "Gym",
    "Air Conditioning",
    "Balcony",
    "Security",
    "Furnished",
  ];

  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : [""],
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || [],
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.categoryId || "",
  );

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientGet<Category[]>("/categories"),
    staleTime: 5 * 60 * 1000, // 5 min — allow cache from HydrationBoundary but also re-fetch if stale
  });
  const categories: Category[] = categoriesData?.data ?? [];

  const STEPS = [
    { id: 1, label: "Details" },
    { id: 2, label: "Location" },
    { id: 3, label: "Specs & Pricing" },
    { id: 4, label: "Media & Extras" },
  ];

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const addImageInput = () => setImages([...images, ""]);

  const validateStep = (step: number): boolean => {
    setStepError(null);
    const activeSection = document.querySelector(`.step-section-${step}`);
    if (activeSection) {
      const inputs = activeSection.querySelectorAll("input, textarea, select");
      let isValid = true;
      for (const input of Array.from(inputs)) {
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLTextAreaElement ||
          input instanceof HTMLSelectElement
        ) {
          if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
            break;
          }
        }
      }
      if (!isValid) return false;

      if (step === 1 && !categoryId) {
        setStepError("Please select a property category.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      address: formData.get("address"),
      city: formData.get("city"),
      area: formData.get("area"),
      monthlyRent: Number(formData.get("monthlyRent")),
      securityDeposit: Number(formData.get("securityDeposit")),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      size: Number(formData.get("size")),
      categoryId,
      amenities: selectedAmenities,
      images: images.filter((img) => img.trim() !== ""),
    };

    try {
      if (isEdit && propertyId) {
        await updateMutate({ id: propertyId, data: payload });
      } else {
        await createMutate(payload);
      }
      router.push("/dashboard/landlord/properties");
    } catch (err) {
      console.error("Mutation failed", err);
    }
  };

  return (
    <form
      className="space-y-8"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      {/* Stepper Header */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-5 h-0.5 w-full -translate-y-1/2 bg-muted/40" />
        <div
          className="absolute left-0 top-5 h-0.5 -translate-y-1/2 bg-primary transition-all duration-350"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />

        <div className="relative flex items-center justify-between">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Only allow clicking steps that are already completed/validated
                    if (step.id < currentStep) {
                      setCurrentStep(step.id);
                    } else if (step.id > currentStep) {
                      // Validate intermediate steps
                      let canProceed = true;
                      for (let s = currentStep; s < step.id; s++) {
                        if (!validateStep(s)) {
                          canProceed = false;
                          break;
                        }
                      }
                      if (canProceed) {
                        setCurrentStep(step.id);
                      }
                    }
                  }}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 pointer-events-auto",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : isActive
                        ? "bg-background border-primary text-primary ring-4 ring-primary/10 shadow-sm"
                        : "bg-background border-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-5" /> : step.id}
                </button>
                <span
                  className={cn(
                    "hidden sm:block text-xs font-semibold uppercase tracking-wider",
                    isActive ? "text-primary" : "text-muted-foreground/80",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {stepError && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm font-semibold">
            {stepError}
          </AlertDescription>
        </Alert>
      )}

      {/* Step Components */}
      <div className="min-h-80">
        {/* 1. Basic Details */}
        <div className={cn("step-section-1", currentStep !== 1 && "hidden")}>
          <Card className="animate-in fade-in-50 duration-200">
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="size-5 text-primary" />
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">
                  Property Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g. Luxury 3BHK Apartment"
                  defaultValue={initialData?.title}
                  minLength={3}
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the property (minimum 10 characters)..."
                  className="resize-none min-h-[120px]"
                  defaultValue={initialData?.description}
                  minLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={(val) => val && setCategoryId(val)}
                  required
                >
                  <SelectTrigger id="categorySelector">
                    <SelectValue placeholder="Select property type">
                      {categories.find((c) => c.id === categoryId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="__loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Location */}
        <div className={cn("step-section-2", currentStep !== 2 && "hidden")}>
          <Card className="animate-in fade-in-50 duration-200">
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-5 text-primary" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  defaultValue={initialData?.address}
                  minLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Mumbai"
                  defaultValue={initialData?.city}
                  minLength={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">
                  Location Area / Neighborhood{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="area"
                  name="area"
                  placeholder="Bandra West"
                  defaultValue={initialData?.area ?? ""}
                  minLength={2}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Pricing & Specs */}
        <div className={cn("step-section-3", currentStep !== 3 && "hidden")}>
          <Card className="animate-in fade-in-50 duration-200">
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="size-5 text-primary" />
                Pricing & Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 relative">
                <Label htmlFor="monthlyRent">
                  Monthly Rent ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="monthlyRent"
                  name="monthlyRent"
                  type="number"
                  placeholder="45000"
                  className="pl-9"
                  min={1}
                  defaultValue={initialData?.monthlyRent}
                  required
                />
                <DollarSign className="absolute left-3 top-8.5 size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="securityDeposit">
                  Security Deposit ($){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  placeholder="150000"
                  className="pl-9"
                  min={0}
                  defaultValue={initialData?.securityDeposit ?? ""}
                  required
                />
                <DollarSign className="absolute left-3 top-8.5 size-4 text-muted-foreground" />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="bedrooms">
                  Bedrooms <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="3"
                  className="pl-9"
                  min={1}
                  defaultValue={initialData?.bedrooms}
                  required
                />
                <BedDouble className="absolute left-3 top-8.5 size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="bathrooms">
                  Bathrooms <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="2"
                  className="pl-9"
                  min={1}
                  defaultValue={initialData?.bathrooms}
                  required
                />
                <Bath className="absolute left-3 top-8.5 size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 relative sm:col-span-2">
                <Label htmlFor="size">
                  Size (Sq Ft) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="size"
                  name="size"
                  type="number"
                  placeholder="1250"
                  className="pl-9"
                  min={1}
                  defaultValue={initialData?.size ?? ""}
                  required
                />
                <SquareStack className="absolute left-3 top-8.5 size-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Amenities & Media */}
        <div
          className={cn(
            "step-section-4 space-y-8",
            currentStep !== 4 && "hidden",
          )}
        >
          {/* Amenities */}
          <Card>
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="size-5 text-primary" />
                Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 space-x-2 border border-border/40 p-3 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <span className="text-sm font-medium leading-none select-none">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex flex-row justify-between items-center text-lg">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-5 text-primary" />
                  Property Images
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageInput}
                  className="gap-2"
                >
                  <Plus className="size-4" /> Add Image
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.map((val, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={val}
                    type="url"
                    onChange={(e) => {
                      const newImgs = [...images];
                      newImgs[idx] = e.target.value;
                      setImages(newImgs);
                    }}
                    required={idx === 0}
                  />
                  {images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Provide direct URLs to high-quality images of the property. The
                first image will be used as the primary thumbnail.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>
            {submitError instanceof Error
              ? submitError.message
              : "An error occurred while saving the property."}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pb-8 border-t border-border/40 pt-6">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="gap-1.5"
            >
              <ChevronLeft className="size-4" /> Back
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>

          {currentStep < 4 ? (
            <Button
              key="next-button"
              type="button"
              onClick={handleNext}
              className="gap-1.5"
            >
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              key="submit-button"
              type="submit"
              className="gap-2 px-6"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isEdit ? "Update Property" : "List Property"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

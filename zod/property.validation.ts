import { z } from "zod";

export const propertyClientSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  monthlyRent: z.number().positive("Monthly rent must be a positive number"),
  securityDeposit: z.number().nonnegative("Security deposit cannot be negative").optional(),
  bedrooms: z.number().positive("Bedrooms must be a positive number"),
  bathrooms: z.number().positive("Bathrooms must be a positive number"),
  size: z.number().positive("Size must be a positive number").optional(),
  categoryId: z.string().min(1, "Category is required"),
  regionId: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image URL is required"),
});

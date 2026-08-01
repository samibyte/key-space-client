export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type PropertySortBy = "monthlyRent" | "createdAt" | "bedrooms";
export type SortOrder = "asc" | "desc";
export type AmenityMatch = "all" | "any";

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  area?: string | null;
  monthlyRent: number;
  securityDeposit?: number | null;
  bedrooms: number;
  bathrooms: number;
  size?: number | null;
  images: string[];
  amenities: string[];
  status: PropertyStatus;
  categoryId: string;
  category: Category;
  landlordId: string;
  landlord: Landlord;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  searchTerm?: string;
  city?: string;
  area?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  amenities?: string;       // comma-separated, e.g. "WiFi,AC"
  amenityMatch?: AmenityMatch;
  bedrooms?: string;
  minBedrooms?: string;
  maxBedrooms?: string;
  bathrooms?: string;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: string | number;
  limit?: string | number;
  status?: PropertyStatus | string;
}

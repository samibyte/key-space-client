import type { Property } from "./property.type";
import type { User } from "./user.type";

export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED"  ;
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" ;

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  moveInDate: string;
  durationMonths: number;
  status: RentalStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  property?: Property;
  tenant?: User;
  payment?: Payment;
}

export interface RentalFilters {
  status?: RentalStatus | string;
  propertyId?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalRequestId: string;
  amount: number;
  status: PaymentStatus;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  rentalRequest?: RentalRequest;
}

export interface Review {
  id: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  tenant?: User;
  property?: Property;
}

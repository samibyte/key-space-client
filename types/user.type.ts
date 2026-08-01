export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";
export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
  email?: string;
}
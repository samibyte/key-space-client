import type { User } from "@/types/user.type";
import type { RentalRequest } from "@/types/rental.type";

/**
 * Dev-only fixture generator for performance & virtualization benchmarking.
 * This does NOT mutate or touch production database records.
 */

export function generateMockUsers(count = 1000): User[] {
  const roles = ["TENANT", "LANDLORD", "ADMIN"] as const;
  const statuses = ["ACTIVE", "BANNED"] as const;

  return Array.from({ length: count }, (_, i) => {
    const id = `mock-user-${i + 1}`;
    const role = roles[i % roles.length];
    const status = statuses[i % 10 === 0 ? 1 : 0]; // 10% banned
    return {
      id,
      name: `Demo User ${i + 1}`,
      email: `user${i + 1}@keyspace-benchmark.dev`,
      role,
      status,
      phone: `+1-555-01${String(i % 100).padStart(2, "0")}`,
      avatar: undefined,
      createdAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 3600000)).toISOString(),
    };
  });
}

export function generateMockRentals(count = 1000): RentalRequest[] {
  const statuses = ["PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"] as const;
  const cities = ["Austin, TX", "Seattle, WA", "Denver, CO", "San Francisco, CA", "Chicago, IL", "New York, NY"];

  return Array.from({ length: count }, (_, i) => {
    const id = `mock-rental-${i + 1}`;
    const status = statuses[i % statuses.length];
    const city = cities[i % cities.length];

    return {
      id,
      propertyId: `mock-prop-${(i % 50) + 1}`,
      tenantId: `mock-tenant-${(i % 100) + 1}`,
      moveInDate: new Date(Date.now() + (i * 86400000)).toISOString(),
      durationMonths: (i % 24) + 6,
      status,
      notes: `Automated load test application entry #${i + 1}`,
      createdAt: new Date(Date.now() - (i * 7200000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 7200000)).toISOString(),
      property: {
        id: `mock-prop-${(i % 50) + 1}`,
        title: `Luxury Apartment Unit ${i + 101}`,
        description: "Benchmark testing property fixture",
        monthlyRent: 1200 + ((i % 30) * 100),
        address: `${100 + i} Benchmark Way`,
        city,
        state: "CA",
        zipCode: "94016",
        bedrooms: (i % 4) + 1,
        bathrooms: (i % 3) + 1,
        size: 650 + ((i % 15) * 50),
        status: "AVAILABLE",
        images: [],
        amenities: ["WiFi", "Parking"],
        landlordId: `mock-landlord-${(i % 20) + 1}`,
        categoryId: "mock-cat-1",
        category: {
          id: "mock-cat-1",
          name: "Apartment",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        regionId: "mock-reg-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        landlord: {
          id: `mock-landlord-${(i % 20) + 1}`,
          name: `Landlord ${(i % 20) + 1}`,
          email: `landlord${(i % 20) + 1}@keyspace.dev`,
        },
      },
      tenant: {
        id: `mock-tenant-${(i % 100) + 1}`,
        name: `Applicant ${(i % 100) + 1}`,
        email: `tenant${(i % 100) + 1}@keyspace.dev`,
        phone: `+1-555-02${String(i % 100).padStart(2, "0")}`,
        role: "TENANT" as const,
        status: "ACTIVE" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      payment: status === "ACTIVE" || status === "COMPLETED" ? {
        id: `mock-payment-${i + 1}`,
        rentalRequestId: id,
        tenantId: `mock-tenant-${(i % 100) + 1}`,
        amount: 1500,
        status: "COMPLETED",
        transactionId: `TX-BENCH-${100000 + i}`,
        checkoutUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : undefined,
    };
  });
}

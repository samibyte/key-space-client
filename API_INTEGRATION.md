# RentNest — API Integration Mapping

This document provides a comprehensive mapping of frontend components and hooks in the `client-rent-nest` application to their corresponding REST API endpoints consumed on the backend.

---

## 🔒 Authentication Flow
*Responsible services:* `services/auth.service.ts` and `app/auth/_actions/authActions.ts`

| Frontend Source | HTTP Method | Backend API Endpoint | Target / Description |
|-----------------|-------------|----------------------|----------------------|
| `loginAction()` in `authActions.ts` | **POST** | `/auth/login` | Authenticates user credentials, sets cookies, and redirects based on role. |
| `registerAction()` in `authActions.ts` | **POST** | `/auth/register` | Registers a new user, sets cookies, and redirects. |
| `getUserInfo()` in `auth.service.ts` | **GET** | `/auth/me` | Fetch currently logged-in user profile payload using JWT. |
| `getNewTokensWithRefreshToken()` | **POST** | `/auth/refresh-token` | Request updated Access Token / Refresh Token pairs. |
| `logoutAction()` in `authActions.ts` | — | *(Client-only)* | Clears HTTP-only tokens from cookies. |

---

## 🏠 Public Property Directory
*Responsible service:* `services/property.service.ts`

| Frontend Source | HTTP Method | Backend API Endpoint | Target / Description |
|-----------------|-------------|----------------------|----------------------|
| `getProperties()` | **GET** | `/properties` | Query properties with filtering parameters (category, region, rent, bedrooms, count). |
| `getPropertyById()` | **GET** | `/properties/:id` | Detailed view of a single property listing. |
| `getCategories()` | **GET** | `/categories` | Fetch all rental categories (e.g. Apartment, Villa). |
| `getRegions()` | **GET** | `/regions` | Retrieve division tags for geo-filtering (e.g. Dhaka, Chittagong). |
| `getAmenities()` | **GET** | `/properties/amenities` | Distinct list of amenities compiled across all listings. |
| `getPublicStats()` | **GET** | `/properties/public/stats` | Hero page analytics counters (properties, active leases, totals). |

---

## 🙋‍♂️ Tenant Dashboard
*Responsible services:* `services/rental.service.ts` & `services/payment.service.ts`

| Frontend Source | HTTP Method | Backend API Endpoint | Target / Description |
|-----------------|-------------|----------------------|----------------------|
| `createRentalRequest()` | **POST** | `/rentals` | Request to lease a specific property address with a moving date. |
| `getTenantRentals()` | **GET** | `/rentals` | List of requested and active leases for the current tenant. |
| `getTenantRentalById()` | **GET** | `/rentals/:id` | Specific lease application workflow states details. |
| `createPayment()` | **POST** | `/payments/create` | Generates a Stripe Checkout Stripe-hosted session URL for an approved request. |
| `confirmPayment()` | **POST** | `/payments/confirm` | Explicitly verify session ID transaction completion webhook matches on return page. |
| `getMyPayments()` | **GET** | `/payments` | Query the collection of lease payments completed by the tenant. |
| `createReview()` | **POST** | `/reviews` | Submit landlord/property reviews for completed leases. |
| `getPropertyReviews()` | **GET** | `/reviews/property/:id` | Public listing reviews aggregate query. |

---

## 🏘️ Landlord Dashboard
*Responsible service:* `services/landlord.service.ts`

| Frontend Source | HTTP Method | Backend API Endpoint | Target / Description |
|-----------------|-------------|----------------------|----------------------|
| `getLandlordDashboardStats()` | **GET** | `/landlord/stats` | Totals and Monthly Revenue calculations for dashboard tiles. |
| `getMyProperties()` | **GET** | `/landlord/properties` | Owned property packages management list. |
| `createProperty()` | **POST** | `/landlord/properties` | Adds a new rental listing to the database. |
| `updateProperty()` | **PUT** | `/landlord/properties/:id` | Update listings characteristics or options (images / toggles). |
| `deleteProperty()` | **DELETE** | `/landlord/properties/:id` | Unlist property package references. |
| `getLandlordRequests()` | **GET** | `/landlord/requests` | Fetch requests awaiting review from prospective tenants. |
| `updateRentalStatus()` | **PATCH** | `/landlord/requests/:id` | Update lease request to either `APPROVED` or `REJECTED`. |

---

## 📊 Admin Dashboard
*Responsible service:* `services/admin.service.ts`

| Frontend Source | HTTP Method | Backend API Endpoint | Target / Description |
|-----------------|-------------|----------------------|----------------------|
| `getAdminDashboardStats()` | **GET** | `/admin/stats` | Global metrics, cumulative financial transactions and role breakdowns. |
| `getAllUsers()` | **GET** | `/admin/users` | Lists users on the platform with support for filters and searching. |
| `updateUserStatus()` | **PATCH** | `/admin/users/:id/status` | Toggles status between `ACTIVE` and `BANNED`. |
| `getAllAdminProperties()` | **GET** | `/admin/properties` | Fetch all properties across the system for audit. |
| `deletePropertyListing()` | **DELETE** | `/admin/properties/:id` | Forcefully unlist or delete platform listings. |
| `getAllAdminRentals()` | **GET** | `/admin/rentals` | Fetch any platform request record. |

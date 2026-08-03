# RentNest 🏠
**"Find & List Rental Properties with Ease"**

RentNest is a modern, responsive rental property marketplace. It provides roles for **Tenants** (to browse and submit rental requests, and complete payments via Stripe), **Landlords** (to list properties, manage availability, and approve/reject rental requests), and **Admins** (to moderate users and monitor platform statistics).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Data Fetching & State**: TanStack Query (React Query) & Axios
- **Auth & Route Checks**: Custom JWT Route Proxy (`proxy.ts` / `lib/authUtils.ts`) managing HTTP-only cookies (`accessToken` & `refreshToken`).
- **Payments**: Stripe Checkout / API integration (redirect flow and session confirmation callbacks).
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

---

## 🔑 Seeding Credentials

The database comes pre-seeded with the following administrative, landlord, and tenant accounts to assist with testing and evaluation:

### 👑 Admin Credentials
| Email | Password | Role | Actions |
|-------|----------|------|---------|
| `admin@rentnest.com` | `AdminPassword123!` | **ADMIN** | User Ban/Unban, global statistics overview, layout configuration |

### 🏘️ Landlord Credentials
All Landlords share the password: `Landlord123!`

| Email | Name | Phone | Role |
|-------|------|-------|------|
| `landlord1@rentnest.com` | Rafiq Hossain | +8801711111111 | **LANDLORD** |
| `landlord2@rentnest.com` | Nusrat Jahan | +8801711222222 | **LANDLORD** |
| `landlord3@rentnest.com` | Karim Uddin | +8801711333333 | **LANDLORD** |

### 👤 Tenant Credentials
All Tenants share the password: `Tenant123!`

| Email | Name | Phone | Role |
|-------|------|-------|------|
| `tenant1@rentnest.com` | Anika Sultana | +8801922111111 | **TENANT** |
| `tenant2@rentnest.com` | Fahim Islam | +8801922222222 | **TENANT** |
| `tenant3@rentnest.com` | Mitu Begum | +8801922333333 | **TENANT** |
| `tenant4@rentnest.com` | Sohel Rana | +8801922444444 | **TENANT** |
| `tenant5@rentnest.com` | Priya Das | +8801922555555 | **TENANT** |

---

## 🚀 Setup & Installation

Follow these steps to run both the backend server and the frontend client applications locally:

### 1. Prerequisite Settings
Confirm you have Node.js (v20+ recommended) and `pnpm` (or `npm`) installed.

### 2. Run the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server-rent-nest
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure the environment variables (`.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rent_nest"
   JWT_ACCESS_SECRET="your-access-token-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret-key"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   CLIENT_URL="http://localhost:3000"
   ```
4. Run migrations and seed data:
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```
5. Start the server (runs on `http://localhost:5000` by default):
   ```bash
   pnpm run dev
   ```

### 3. Run the Frontend Client
1. Navigate to the client folder:
   ```bash
   cd ../client-rent-nest
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure your local environment variables in `client-rent-nest/.env`:
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api/v1"
   ```
4. Run the Next.js development server:
   ```bash
   pnpm run dev
   ```
5. Open your browser and navigate to: `http://localhost:3000`

---

## 🔄 Core Workflows & Features

### 1. Dark & Light Theme Integration
The application uses the `next-themes` theme provider. A header switch component allows dynamic swapping between standard light views and custom charcoal dark UI components.

### 2. User Authentication & Route Guard Proxy
Instead of routing files directly, route protection checks are run using a custom Edge-friendly gateway matching rule algorithm in `proxy.ts`. Valid tokens dynamically permit entry to pages nested under `/dashboard`, while anonymous or invalid users redirect automatically to `/auth/login` with dynamic fallback routing.

### 3. Property Search and Filters
The `/properties` route facilitates property categorization and location regions selection. Filters include bedrooms/bathrooms count, rent pricing thresholds, and amenities options update states. Skeletons indicate queries matching the server collections data loading states.

### 4. Tenant Request & Checkout Flow
1. **Interactive request**: When viewing details of a listed rental address, tenants can initialize a rental request with a message and move-in date.
2. **Approval State**: Dashboard notifies user of status changes. If the landlord shifts a tenant request to `APPROVED`, an operational **"Pay Now"** element renders.
3. **Stripe payment gate**: Pressing "Pay Now" requests `/payments/create` which creates a checkout session and redirects the tenant.
4. **Redirection Outcome page**: Returning from payment hits `/payment/success` or `/payment/cancel`. Success confirms the session to activate the request state as `ACTIVE`.

### 5. Landlord Management
Landlords retain fully interactive tables under `/dashboard/landlord/requests` to instantly approve or reject incoming requests. Forms under `/dashboard/landlord/properties` list properties with dynamic amenities checkboxes and URL image inputs.

### 6. Admin Panel
Admins browse metrics charts depicting platform ratios (landlords, tenants, admin roles split representation). System filters permit pagination of core platform users to toggle block / unban toggles.

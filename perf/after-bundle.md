# Bundle Analysis & Code Splitting (Phase 4)

Measured using `@next/bundle-analyzer` on the production build (`ANALYZE=true npx next build --webpack`).

## Key Bundle Optimizations

1. **Lazy Loading of Recharts (`RoleBar`)**:
   * Previously, `recharts` and its dependencies (`redux-toolkit`, `victory-vendor`, `decimal.js`) were bundled synchronously into the critical path of the admin overview route (`/dashboard/admin`).
   * By converting `RoleBar` to `next/dynamic` (`ssr: false`) with a zero-CLS `RoleBarSkeleton`, the initial page chunk for `app/dashboard/admin/page` was reduced to **9.5 KB** (3.2 KB gzipped).
   * The ~356 KB charting chunk is now lazy-loaded on demand as an asynchronous chunk (`5317.b3d629075a1719dd.js`).

2. **Lazy Loading of Property Form**:
   * `PropertyForm` with its heavy multi-step validation logic and file uploader was extracted behind `next/dynamic` in both `/dashboard/landlord/properties/new` and `[id]/edit`, rendering a matching form skeleton while downloading.

3. **Package Import Optimization**:
   * Configured `experimental.optimizePackageImports: ['lucide-react', 'react-icons', '@base-ui/react', 'recharts']` in `next.config.ts`.
   * Stripped barrel imports across the application so unused icons and internal library modules are tree-shaken.

4. **Removal of Unused Dependencies**:
   * Scanned repository dependencies with grep/depcheck.
   * Discovered `@tanstack/react-query-next-experimental` had 0 references in all client code, components, services, and hooks.
   * Safely removed `@tanstack/react-query-next-experimental` from `package.json`.

---

## Before vs After Comparison Table

| Metric / Chunk | Baseline (Before) | Optimized (After) | Delta / Improvement |
|----------------|-------------------|-------------------|---------------------|
| Admin Overview Route JS (`/dashboard/admin`) | Bundled synchronously with Recharts (~370 KB) | **9.5 KB** (3.2 KB gzip) | **-97.4% initial JS payload** |
| Recharts Critical Loading | Synchronous blocking | Dynamic async chunk (`5317.js`) | Deferred off critical hydration path |
| `@tanstack/react-query-next-experimental` | Present in package manifest | Removed | Cleaner dependency graph, no dead baggage |
| Lucide / Icons Tree-Shaking | Default unoptimized imports | `optimizePackageImports` enabled | Modular per-icon tree-shaking |
| Modal Initial Render Cost (`ConfirmDialog`) | Rendered hidden dialog DOM nodes | Short-circuited when `!isOpen` | 0 DOM nodes & zero portal mounting when closed |
| Largest async split chunk | Monolithic static chunk | Isolated async chunk (`356.3 KB` parsed) | Loaded only on admin chart demand |

---

## Top 10 Chunks After Optimization

| Rank | Chunk Name | Parsed Size | Gzip Size | Stat Size | Type |
|------|------------|-------------|-----------|-----------|------|
| 1 | `static/chunks/5317.b3d629075a1719dd.js` | 356.3 KB | 103.9 KB | 1,275.8 KB | Dynamic (Async Recharts chunk) |
| 2 | `static/chunks/5907-5688d3cd097d570b.js` | 235.1 KB | 51.9 KB | 465.0 KB | `@tanstack/react-form` + form schemas |
| 3 | `static/chunks/5930-b6b46810e4ca6ef8.js` | 217.7 KB | 59.8 KB | 841.9 KB | Next.js client runtime / router |
| 4 | `static/chunks/783c04da-19038d2b5ff51a1d.js` | 195.2 KB | 61.3 KB | 598.5 KB | React DOM runtime |
| 5 | `static/chunks/framework-015a697c2975feb9.js` | 185.2 KB | 58.0 KB | 560.9 KB | React 19 framework |
| 6 | `static/chunks/main-01c7003905a195fe.js` | 134.9 KB | 39.0 KB | 390.1 KB | Main Next entry |
| 7 | `static/chunks/839-b4a501bf0c851213.js` | 120.4 KB | 31.7 KB | 278.7 KB | `@base-ui` core primitives |
| 8 | `static/chunks/2176-ab08d356161c0902.js` | 40.9 KB | 14.2 KB | 164.7 KB | `@tanstack/react-query` |
| 9 | `static/chunks/7633-6634ea4c4b543cc1.js` | 39.9 KB | 11.8 KB | 90.7 KB | Table & virtualizer runtime |
| 10 | `static/chunks/4395-b7b2233edb3bca9b.js` | 36.9 KB | 13.8 KB | 124.1 KB | Select dropdown primitives |

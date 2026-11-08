# Baseline Bundle Analysis

Recorded using `@next/bundle-analyzer` on the production build (`ANALYZE=true npx next build --webpack`).

## Top 10 Largest Client Chunks

| Rank | Chunk | Parsed Size | Gzip Size | Stat Size | Primary Contents |
|------|-------|-------------|-----------|-----------|------------------|
| 1 | `static/chunks/1368-013e4e6f7ddaa9c9.js` | 364.0 KB | 107.0 KB | 1,294.7 KB | `recharts`, `redux-toolkit`, `decimal.js`, `victory-vendor` |
| 2 | `static/chunks/3501-0180699f829889a9.js` | 238.4 KB | 52.9 KB | 472.0 KB | `@tanstack/react-form`, form validation helpers |
| 3 | `static/chunks/5930-b6b46810e4ca6ef8.js` | 217.7 KB | 59.8 KB | 841.9 KB | Next.js client runtime / router navigation |
| 4 | `static/chunks/783c04da-19038d2b5ff51a1d.js` | 195.2 KB | 61.3 KB | 598.5 KB | `react-dom` CJS |
| 5 | `static/chunks/framework-015a697c2975feb9.js` | 185.2 KB | 58.0 KB | 560.9 KB | React 19 framework chunk |
| 6 | `static/chunks/main-01c7003905a195fe.js` | 134.9 KB | 39.0 KB | 390.1 KB | Next.js main entry / bootstrapping |
| 7 | `static/chunks/839-4bb29900c448a9bf.js` | 117.1 KB | 30.8 KB | 271.8 KB | `@base-ui` core primitives |
| 8 | `static/chunks/2176-a3d515fda5531744.js` | 40.9 KB | 14.2 KB | 160.8 KB | `@tanstack/react-query` & `@tanstack/query-core` |
| 9 | `static/chunks/4395-b7b2233edb3bca9b.js` | 36.9 KB | 13.8 KB | 122.9 KB | `@base-ui` select/dropdown primitives |
| 10 | `static/chunks/6789-67c0a113c82d7d25.js` | 32.8 KB | 9.0 KB | 64.4 KB | `sonner` toaster notification package |

## Top Dependencies in Client Bundle (Parsed Size)

| Dependency | Parsed Size | Notes |
|------------|-------------|-------|
| `next` | 579.8 KB | Next.js App Router client runtime, router, cache |
| `zod` | 265.7 KB | Schema validation (bundled on client routes) |
| `recharts` | 258.2 KB (+ ~60 KB vendor deps) | Charting library loaded synchronously in Admin Overview (`RoleBar`) |
| `@base-ui` | 213.1 KB | Base UI primitives for Shadcn / custom UI |
| `@tanstack` | 186.7 KB | React Query and React Form |
| `react-dom` | 174.1 KB | React 19 DOM renderer |
| `lucide-react` | 57.7 KB | Icon library icons imported across components |
| `victory-vendor` | 46.0 KB | D3 / Victory helper bundled with Recharts |
| `sonner` | 32.7 KB | Toast notifications in root layout |
| `tailwind-merge` | 26.2 KB | Class merging utility |
| `@floating-ui` | 18.6 KB | Positioning engine for popovers/tooltips |

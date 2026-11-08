# Final Bundle Snapshot (Post Phase 5/6)

Measured from the final production build (`npx next build --webpack`) on branch
`perf-optimization`. Sizes are the raw file size of each emitted client chunk;
gzip is a local gzip of the emitted file.

## Top 10 Client Chunks

| Rank | Chunk | Parsed size | Gzip size | Notes |
|------|-------|-------------|-----------|-------|
| 1 | `static/chunks/5317.b3d629075a1719dd.js` | 356.3 KB | 104.1 KB | Async Recharts chunk; loaded only when the admin chart mounts |
| 2 | `static/chunks/5907-5688d3cd097d570b.js` | 235.1 KB | 52.1 KB | `@tanstack/react-form` + validation |
| 3 | `static/chunks/5930-b6b46810e4ca6ef8.js` | 217.7 KB | 60.0 KB | Next.js client runtime / router |
| 4 | `static/chunks/783c04da-19038d2b5ff51a1d.js` | 195.2 KB | 61.4 KB | React DOM runtime |
| 5 | `static/chunks/framework-015a697c2975feb9.js` | 185.2 KB | 58.1 KB | React 19 framework |
| 6 | `static/chunks/main-01c7003905a195fe.js` | 134.9 KB | 39.1 KB | Next.js main entry |
| 7 | `static/chunks/839-b4a501bf0c851213.js` | 120.4 KB | 31.8 KB | `@base-ui` primitives |
| 8 | `static/chunks/polyfills-42372ed130431b0a.js` | 110.0 KB | 38.7 KB | Legacy browser polyfills |
| 9 | `static/chunks/2176-ab08d356161c0902.js` | 40.9 KB | 14.2 KB | `@tanstack/react-query` |
| 10 | `static/chunks/7633-6634ea4c4b543cc1.js` | 39.9 KB | 11.9 KB | Table + virtualizer runtime |

**Totals:** 85 emitted client JS chunks, 2.43 MB raw / 0.74 MB gzip across all
chunks. This is the sum of every lazy and route-specific chunk, not the amount
downloaded by a single page.

## Key Comparison vs Baseline

| Metric | Baseline | Final | Result |
|--------|----------|-------|--------|
| Recharts chunk | `1368` — 364.0 KB, synchronous on `/dashboard/admin` | `5317` — 356.3 KB, async demand-loaded | 2.1% smaller chunk and removed from the admin critical path |
| Admin overview initial route JS | ~370 KB (included Recharts) | 9.5 KB (3.2 KB gzip) | **-97.4% initial JS** |
| `@tanstack/react-query-next-experimental` | Present in manifest | Removed | No dead dependency in client graph |
| `lucide-react` / `react-icons` / `@base-ui` / `recharts` imports | Default barrel resolution | `experimental.optimizePackageImports` | Per-icon/per-module tree-shaking |

# KeySpace Client — Performance Optimization Report

**Project:** `client-key-space` (Next.js 16.2.12 App Router, React 19.2.4, Tailwind CSS 4)  
**Branch:** `perf-optimization`  
**Baseline:** `381e482` — `chore(perf): phase 0 baseline audit and bundle analyzer setup`  
**Final phase commits:** `adfc005` plus the Phase 6 working-tree fixes documented below  
**Report date:** 9 November 2026

---

## 1. Executive Summary

The optimization pass targeted rendering amplification, large-list DOM cost,
high-frequency event work, and JavaScript shipped on the critical path. The
largest wins were removing Recharts from the admin overview critical path
(**~370 KB → 9.5 KB initial JS**) and eliminating redundant React renders in
search and table interactions.

| Area | Baseline | Final | Improvement |
|------|----------|-------|-------------|
| Admin overview initial route JS | ~370 KB (Recharts synchronous) | **9.5 KB** (3.2 KB gzip) | **-97.4%** |
| Admin page renders while typing 10 search chars | 11 | **2** | **-81.8%** |
| Table row renders on modal open/close | 20 | **0** | **-100%** |
| City filter URL updates while typing 10 chars | 10 | **1** (300 ms debounce) | **-90%** |
| 1,000-row table DOM rows | 1,000 | visible window + 8 overscan (~34 at 900 px) | Virtualized |
| 1,000 rental-request cards | 1,000 | visible pairs + 5 overscan (~16–20 at 900 px) | Virtualized |
| Largest measured CLS (lab) | Not captured pre-change | **0.0004** | Core Web Vitals "good" |
| TypeScript | Pass | **Pass** | 0 errors |
| ESLint (before Phase 6 fixes) | 14 errors / 33 warnings | **0 errors / 29 warnings** | Errors resolved |
| Production build | Pass | **Pass** | 28/28 pages |

> Render counts and DOM-row figures are development/synthetic measurements,
> not field data. CLS was measured in a headless Chrome lab run. See
> [Limitations](#8-limitations) before quoting these numbers externally.

---

## 2. Environment and Method

* **Build:** `npx next build --webpack` (the app uses the webpack bundle analyzer)
* **Runtime:** `npx next start -p 3123`
* **Type check:** `npx tsc --noEmit`
* **Lint:** `npx eslint .`
* **Bundle analysis:** `ANALYZE=true npx next build --webpack` and emitted chunk sizes
* **CLS/theme:** headless Chrome 157 over the DevTools Protocol, 1366 × 900,
  `PerformanceObserver({ type: "layout-shift" })`, 4-second observation window
* **Test account:** not required for the public-route CLS run

Raw evidence is retained in:

* `perf/baseline-build.txt` / `perf/baseline-bundle.md`
* `perf/after-build.txt` / `perf/after-bundle.md`
* `perf/final-build.txt` / `perf/final-bundle.md`
* `perf/render-evidence.md`
* `perf/ux-safety.md` / `perf/cls-results.json`

---

## 3. Phase-by-Phase Changes

### Phase 0 — Baseline and tooling

* Captured the baseline production build and bundle analysis.
* Added `@next/bundle-analyzer` support in `next.config.ts`.
* Established the measurement files under `perf/`.

### Phase 1 — Rendering optimization

* Colocated the admin user search input so keystrokes update only
  `UserSearchInput`.
* Debounced URL query updates so the page tree updates once after typing stops.
* Extracted and memoized `DataTableRow`; stabilized `columns` arrays with
  `useMemo` and action handlers with `useCallback`.
* Hoisted static icon elements and memoized `StatsCard`.
* Added dev-only `useRenderCount` instrumentation to several dashboard pages.

Evidence: `perf/render-evidence.md`.

### Phase 2 — List and table virtualization

* Added `@tanstack/react-virtual`.
* `DataTable` now virtualizes when explicitly requested or when rendering more
  than 20 rows without pagination. It uses a 52 px estimate and 8-row overscan.
* The landlord rental-requests page groups cards into two-column row pairs and
  virtualizes them with a 280 px estimate and 5-pair overscan.
* Added a development-only fixture generator (1,000 rentals) to exercise the
  virtualized path without production data.

### Phase 3 — State decoupling and event throttling

* Added `useDebouncedValue`, `useDebouncedCallback`, and
  `useAnimationFrameThrottle` in `hooks/useDebounce.ts`.
* Debounced the property city filter by 300 ms, replacing per-keystroke URL
  navigation.
* Throttled the mobile breakpoint listener with `requestAnimationFrame` to avoid
  layout thrashing during continuous resize.

### Phase 4 — Code splitting and bundle optimization

* Converted the admin `RoleBar` chart to `next/dynamic` with `ssr: false` and a
  zero-CLS skeleton. Recharts is now requested only when the chart is needed.
* Converted the heavy property form to `next/dynamic` on both create and edit
  routes, with a matching form skeleton.
* Added `experimental.optimizePackageImports` for `lucide-react`,
  `react-icons`, `@base-ui/react`, and `recharts`.
* Removed the unused `@tanstack/react-query-next-experimental` dependency.
* Short-circuited the closed `ConfirmDialog` so it mounts no dialog DOM.

### Phase 5 — Server/client boundaries

Phase 5 was partially implemented in commit `adfc005`:

* `Footer` was converted to a server component, with the interactive newsletter
  form extracted into the client leaf `FooterNewsletter`.
* `components/ui/table.tsx` stopped forcing a client boundary, so table
  primitives can render on the server when consumed by server components.

The two files named in the remaining plan were audited:

| File | Finding | Action |
|------|---------|--------|
| `components/shared/StatusBadge.tsx` | Already had **no** `"use client"`; imports only static `Badge`, `cn`, and style maps | No change required — remains RSC-compatible |
| `app/dashboard/_components/DashboardShell.tsx` | Already had **no** `"use client"`; only interactive import is the `SidebarTrigger` client leaf | No change required — static header/breadcrumbs render on the server in server parents |

`DashboardShell` did **not** receive `"server-only"` because it is legitimately
shared by both server and client page parents. In a client parent the component
is compiled into the client graph, which is unavoidable without splitting those
pages; in server parents (`landlord/properties/new` and `[id]/edit`) it renders
as a server component. The static shell, breadcrumbs, title, description, and
content wrapper contain no client hooks, so the intended boundary is already in
place.

### Phase 6 — UX safety and verification

Static checks:

* `npx tsc --noEmit` → exit 0.
* `npx eslint .` → exit 0, 0 errors, 29 warnings.
* `npx next build --webpack` → exit 0, 28/28 pages generated.

Lint/robustness fixes made during this phase:

* `ThemeToggle`: replaced the mounted `useState` + `useEffect` pattern with
  `useSyncExternalStore`, removing the setState-in-effect render cascade while
  preserving hydration safety.
* `use-mobile`: initial media-query check now goes through the existing
  `requestAnimationFrame` throttle instead of setting state synchronously in
  the effect.
* `lib/axios/apiClient.ts` and `lib/axios/httpClient.ts`: replaced `any` with
  narrow error types and `unknown`; behavior is unchanged.
* `AvatarPicker` and `PropertyImageUploader`: catch clauses use `unknown` and
  extract messages with an `instanceof Error` guard.
* Tenant “new rental” fallback now uses `next/link` instead of a raw `<a>`.
* Removed the unused `CreditCard` import from `Footer`.
* Annotated the intentional ref read in the dev-only `useRenderCount`.

CLS and theme results are summarized in [Section 6](#6-ux-safety-cls-and-theme).

### Phase 7 — Final measurement and report

* Re-ran the production build and bundle analysis.
* Captured the final chunk snapshot.
* Re-ran the CLS/theme lab protocol and recorded raw JSON.
* Composed this report.

---

## 4. Before / After Metrics

### 4.1 JavaScript and bundle

| Metric | Baseline | Final | Delta |
|--------|----------|-------|-------|
| Admin overview route JS | ~370 KB, Recharts included | **9.5 KB** (3.2 KB gzip) | **-97.4%** |
| Recharts chunk | 364.0 KB synchronous (`1368`) | 356.3 KB async (`5317`) | 2.1% smaller and off critical path |
| React Form chunk | 238.4 KB | 235.1 KB | -3.3 KB |
| Base UI chunk | 117.1 KB | 120.4 KB | +3.3 KB (new primitives usage) |
| `@tanstack/react-query-next-experimental` | Present | Removed | Dead dependency removed |
| Icon/library imports | Barrel-resolved | `optimizePackageImports` | Per-module tree-shaking |

The full final chunk table is in `perf/final-bundle.md`.

### 4.2 Rendering and interaction behavior

| Scenario | Before | After | Measurement source |
|----------|--------|-------|--------------------|
| 10-character admin user search | 11 page renders (1 initial + 10 keystrokes) | **2 renders** (1 initial + 1 debounced update) | Phase 1 render evidence |
| Confirm-modal open/close on a table | 20 row renders (10 rows × 2) | **0 row re-renders** | Phase 1 render evidence |
| City filter typing (10 chars) | 10 URL updates/navigations | **1** update after 300 ms | Phase 3 code + behavior |
| Mobile resize events | Unbounded state updates / layout thrash | At most 1 update per animation frame | Phase 3 code |
| 1,000-row table | 1,000 mounted data rows | Visible rows + 8 overscan (~34 at 900 px) | Phase 2 code estimate |
| 1,000 rental cards | 1,000 mounted cards | Visible row pairs + 5 overscan (~16–20 at 900 px) | Phase 2 code estimate |

### 4.3 Quality gates

| Gate | Baseline | Final |
|------|----------|-------|
| `tsc --noEmit` | Pass | **Pass** |
| `eslint .` (before Phase 6 fixes) | 14 errors, 33 warnings | **0 errors, 29 warnings** |
| `next build` | Pass | **Pass** (28/28 pages) |
| Hydration/theme console errors | Not measured | **None on tested public routes** |

---

## 5. Final Bundle Snapshot

Top emitted client chunks after the final build:

| Rank | Chunk | Parsed | Gzip | Type |
|------|-------|--------|------|------|
| 1 | `5317.b3d629075a1719dd.js` | 356.3 KB | 104.1 KB | Async Recharts |
| 2 | `5907-5688d3cd097d570b.js` | 235.1 KB | 52.1 KB | React Form + validation |
| 3 | `5930-b6b46810e4ca6ef8.js` | 217.7 KB | 60.0 KB | Next.js router/runtime |
| 4 | `783c04da-19038d2b5ff51a1d.js` | 195.2 KB | 61.4 KB | React DOM |
| 5 | `framework-015a697c2975feb9.js` | 185.2 KB | 58.1 KB | React 19 framework |
| 6 | `main-01c7003905a195fe.js` | 134.9 KB | 39.1 KB | Next.js main |
| 7 | `839-b4a501bf0c851213.js` | 120.4 KB | 31.8 KB | Base UI primitives |
| 8 | `polyfills-42372ed130431b0a.js` | 110.0 KB | 38.7 KB | Polyfills |
| 9 | `2176-ab08d356161c0902.js` | 40.9 KB | 14.2 KB | React Query |
| 10 | `7633-6634ea4c4b543cc1.js` | 39.9 KB | 11.9 KB | Table + virtualizer |

**All emitted chunks:** 85 files, **2.43 MB raw / 0.74 MB gzip** total. This is
not a single-page download figure; it includes every route-specific and lazy
chunk in the build.

---

## 6. UX Safety: CLS and Theme

The production server was tested at 1366 × 900 in headless Chrome with both
`prefers-color-scheme` values. Full method and raw output are in
`perf/ux-safety.md` and `perf/cls-results.json`.

| Theme | Route | CLS | Shifts | Lab LCP |
|-------|-------|-----|--------|---------|
| light | `/` | **0.0004** | 1 | 472 ms |
| light | `/properties` | **0** | 0 | 120 ms |
| light | `/about` | **0.0004** | 1 | 380 ms |
| light | `/auth/login` | **0** | 0 | 156 ms |
| light | `/trust` | **0** | 0 | 80 ms |
| dark | `/` | **0.0004** | 1 | 412 ms |
| dark | `/properties` | **0** | 0 | 76 ms |
| dark | `/auth/login` | **0** | 0 | 68 ms |

**Verdict:** the maximum measured CLS is **0.0004**, well below the 0.1 "good"
threshold. The single shift is a ~0.00042 hero-container adjustment at
350–415 ms and is visually imperceptible. Both themes apply the expected
`light`/`dark` class and computed color tokens, with no hydration warnings or
console errors.

---

## 7. Verification Commands

```bash
cd client-key-space

# Type safety
npx tsc --noEmit

# Lint (exit 0; warnings remain)
npx eslint .

# Production build
npx next build --webpack

# Bundle analysis
ANALYZE=true npx next build --webpack

# Runtime CLS/theme run
npx next start -p 3123
# then run the CDP protocol used to produce perf/cls-results.json
```

`next build` emits `DYNAMIC_SERVER_USAGE` messages during page-data collection.
They are expected: the dashboard layout and root user-info path read cookies, so
all routes are intentionally dynamic (`ƒ`). They are not build errors.

---

## 8. Limitations

1. **No authenticated dashboard runtime measurement.** The local backend at
   `http://localhost:5000/api/v1` was not running, so dashboard pages could not
   be loaded without a valid session. Public routes, navigation, footer,
   newsletter, property listing, auth, and both themes were tested.
2. **CLS is lab-only.** Measurements come from a local headless Chrome run, not
   from Chrome UX Report / field data. Real-user CLS may differ due to network,
   fonts, device, and third-party images.
3. **No pre-change CLS baseline.** The baseline build output did not include a
   runtime CLS trace. The report therefore states the final CLS and its
   Core Web Vitals rating rather than claiming a percentage improvement.
4. **Bundle totals are build-wide.** The 85-chunk total includes lazy and
   route-specific chunks. It is not the initial payload of any single route.
5. **Route-level JS is estimated.** Because every route is dynamic, Next.js did
   not emit the usual static route-size table. The admin 9.5 KB figure comes
   from the bundle analyzer output captured in Phase 4.
6. **Render counts are instrumentation, not field telemetry.** They come from
   dev-only `useRenderCount` and scripted interactions. Manual React Profiler
   runs are recommended for confirming real interaction costs.
7. **ESLint still reports 29 warnings.** They are non-blocking and largely
   pre-existing: unused imports, `<img>` recommendations, TanStack Virtual
   compiler notes, and two documented `any` cleanups. `eslint .` exits 0.
8. **Chrome only.** No Firefox/Safari or visual-regression pass was performed.
9. **Synthetic large-list benchmarks.** The 1,000-item paths use the dev fixture
   generator; production datasets may differ in card size and image loading.

---

## 9. Manual React Profiler Instructions

Use this to confirm the interaction wins on your machine and to catch
regressions after future changes.

### 9.1 Setup

```bash
cd client-key-space
npx next dev -p 3000
```

1. Open `http://localhost:3000` in Chrome.
2. Install/enable the React Developer Tools extension.
3. Open DevTools → **Profiler** tab.
4. Open the Profiler settings (gear icon) and enable
   **“Record why each component rendered while profiling.”**
5. Start the backend and log in with a demo account if you are testing dashboard
   routes.

### 9.2 Scenarios to record

| Scenario | Steps | Expected result |
|----------|-------|-----------------|
| Colocated search | `/dashboard/admin/users` → start recording → type 10 characters → stop | `UserSearchInput` re-renders per keystroke; the page and `DataTable` update only after the debounce fires |
| Memoized table rows | Start recording → open and close a row’s confirm dialog → stop | `DataTableRow` should **not** appear as re-rendered in the flame graph |
| Virtualized requests | `/dashboard/landlord/requests` → click **Load 1,000 Fixtures** → record a scroll through the list | Only visible row pairs (plus overscan) should mount/re-render |
| Lazy chart | `/dashboard/admin` → record the initial load | `RoleBar` loads as a separate async chunk; the page shell and stats cards should not wait on Recharts |
| Theme toggle | Toggle light/dark while recording | `ThemeToggle` and theme consumers update; no full-page remount or hydration warning |

### 9.3 Reading the results

* Compare **Flame graph** and **Ranked** views. Focus on `actualDuration` and
  the number of commits, not only total time.
* In the ranked view, check that memoized rows/cards are grayed out when their
  props did not change.
* Use the **“Why did this render?”** panel to confirm that unstable props
  (arrays, inline objects, callbacks) are not defeating `React.memo`.
* For high-frequency interactions, compare a 10-keystroke recording before and
  after a change; the page-level commit count should be 2, not 11.

### 9.4 Production-like profiling

React DevTools profiling is most reliable against a development/profiling build.
For a production-like measurement, wrap the area under test in the React
`<Profiler>` API:

```tsx
import { Profiler } from "react";

<Profiler
  id="AdminUsersPage"
  onRender={(id, phase, actualDuration, baseDuration) => {
    console.table({ id, phase, actualDuration, baseDuration });
  }}
>
  <AdminUsersPage />
</Profiler>
```

Use Chrome’s **Performance** panel for runtime/CLS/long-task work, and
`npx lighthouse http://localhost:3000 --only-categories=performance` for an
additional lab report if Lighthouse is available.

---

## 10. Recommended Next Steps

1. Start the backend and repeat the CLS/theme protocol on `/dashboard/admin`,
   `/dashboard/landlord/requests`, and the tenant payment/rental detail pages.
2. Add Lighthouse CI or a Playwright performance test around the public and
   dashboard flows so CLS/LCP budgets are enforced automatically.
3. Clear the remaining 29 ESLint warnings, starting with unused imports and
   `<img>` usage in user-facing components.
4. Consider splitting fully client-side dashboard pages into a server page shell
   plus client islands if the dashboard bundle becomes a priority; this is the
   main remaining opportunity for server/client boundary work.
5. Re-run `ANALYZE=true next build` after any new heavy dependency is added and
   keep the Recharts chunk behind `next/dynamic`.

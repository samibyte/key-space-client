# Phase 6 — UX Safety Verification

## Static checks

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | **PASS** — exit 0, no errors |
| ESLint | `npx eslint .` | **PASS** — exit 0, 0 errors, 29 warnings (all non-blocking) |
| Production build | `npx next build --webpack` | **PASS** — exit 0, 28/28 pages generated |

Remaining ESLint warnings are pre-existing and do not fail the command. They are
mostly unused imports, `<img>` usage suggestions, TanStack Virtual compiler
notes, and two documentation-only `no-explicit-any` cleanup opportunities.

`next build` prints `DYNAMIC_SERVER_USAGE` messages while collecting page data.
These are expected in this app: `getUserInfo()` reads cookies in the root data
path, so every route is dynamic (`ƒ`). They are not build failures.

## CLS and theme lab test

**Method**

* Production server: `npx next start -p 3123`
* Browser: headless Chrome 157 driven over the DevTools Protocol
* Viewport: 1366 × 900, desktop, device scale factor 1
* Metric: `PerformanceObserver({ type: "layout-shift" })`, entries without
  recent input summed over the first 4 seconds after `document.readyState === "complete"`
* Each theme was emulated with `prefers-color-scheme`; next-themes applies the
  matching `light` / `dark` class to `<html>`

**Results**

| Theme | Route | CLS | Shift entries | Lab LCP | Theme applied | Console/hydration issues |
|-------|-------|-----|---------------|---------|---------------|--------------------------|
| light | `/` | **0.0004** | 1 | 472 ms | `light`, light background | None |
| light | `/properties` | **0** | 0 | 120 ms | `light` | None |
| light | `/about` | **0.0004** | 1 | 380 ms | `light` | None |
| light | `/auth/login` | **0** | 0 | 156 ms | `light` | None |
| light | `/trust` | **0** | 0 | 80 ms | `light` | None |
| dark | `/` | **0.0004** | 1 | 412 ms | `dark`, dark background | None |
| dark | `/properties` | **0** | 0 | 76 ms | `dark` | None |
| dark | `/auth/login` | **0** | 0 | 68 ms | `dark` | None |

**Verdict:** maximum measured CLS is **0.0004**, far below the Core Web Vitals
"good" threshold of 0.1. No hydration warnings, uncaught exceptions, or
theme-related console errors were observed in either theme.

The single 0.00042 shift on `/` and `/about` is a sub-pixel hero container
adjustment at ~350–415 ms. It is visually imperceptible and far below the
threshold at which Chrome reports a "needs improvement" CLS.

Raw results: `perf/cls-results.json`.

## Limitation

The authenticated dashboard could not be exercised in the runtime check because
the local backend (`http://localhost:5000/api/v1`) was not running. Public
layouts, navigation, footer/newsletter, property listing, auth, and dark/light
theme paths were verified. Dashboard CLS can be spot-checked manually after
starting the backend and logging in with a demo account.

# SEO Audit Remediation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish only completed language variants, deepen the proven line-art page, add concrete workflow examples, and improve static asset caching.

**Architecture:** Introduce an explicit indexable-locale allowlist shared by SEO metadata and sitemap generation. Keep the existing route components, expanding their SSR data and semantic sections without adding new landing-page templates. Use Cloudflare Static Assets `_headers` rules for cache policy.

**Tech Stack:** TanStack Start, React 19, Paraglide, Vitest, Playwright, Cloudflare Workers Static Assets, Tailwind/CSS.

---

### Task 1: Restrict indexable locales

**Files:**
- Modify: `src/lib/locale.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/routes/sitemap[.]xml.ts`
- Create: `tests/unit/indexable-locales.test.ts`
- Modify: `tests/e2e/specs/public-pages.spec.ts`

**Step 1: Write the failing tests**

Assert through `Reflect.get()` that the locale module exports an English-only
`indexableLocales` list. Extend the public-page SEO test to assert that the
homepage has no `zh-CN` alternate and the sitemap does not contain `/zh/`.

**Step 2: Run tests to verify they fail**

Run: `pnpm test tests/unit/indexable-locales.test.ts`

Expected: FAIL because `indexableLocales` is undefined.

Run the focused public-page spec against the current app and confirm the
hreflang/sitemap assertions fail because Chinese alternates are present.

**Step 3: Write the minimal implementation**

Export an allowlist:

```ts
export const indexableLocales = [baseLocale] satisfies Locale[];
```

Use that list instead of all Paraglide locales in `seo()` alternate metadata
and sitemap alternate generation.

**Step 4: Run tests to verify they pass**

Run the unit test and focused Playwright test again. Expected: PASS.

### Task 2: Expand the SSR line-art library

**Files:**
- Modify: `tests/e2e/TEST-CATALOG.md`
- Modify: `tests/e2e/specs/ascii-converter.spec.ts`
- Modify: `src/routes/line-art.tsx`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`
- Modify: `src/styles.css`

**Step 1: Write the failing acceptance test**

Assert that `/line-art` renders at least 40 `.ascii-piece` articles before any
interaction, exposes the headings `Copyable one-line ASCII art` and `Keep the
spacing intact`, and still filters/copies the cat example.

**Step 2: Run the focused spec to verify it fails**

Run: `pnpm e2e tests/e2e/specs/ascii-converter.spec.ts --grep "line art"`

Expected: FAIL with 20 articles and missing headings.

**Step 3: Write the minimal implementation**

Expand the existing SSR tuple inventory to at least 40 unique, useful pieces
across stable categories. Wrap the controls and results in a labelled section,
then add a short three-item usage section after the grid. Add only the layout
styles required by those unframed semantic sections.

**Step 4: Compile locales and rerun the focused spec**

Run: `pnpm locale:compile`, then rerun the focused spec. Expected: PASS.

### Task 3: Add target-platform workflow examples

**Files:**
- Modify: `tests/e2e/specs/public-pages.spec.ts`
- Modify: `src/components/ascii/ascii-scene-page.tsx`
- Modify: `src/routes/ascii-art-for-discord.tsx`
- Modify: `src/routes/ascii-art-for-readme.tsx`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`
- Modify: `src/styles.css`

**Step 1: Write the failing acceptance test**

Require a visible `Discord code block example` on the Discord page and a
`README Markdown example` on the README page. Assert the examples contain
triple-backtick text fences and each page links to its sibling workflow.

**Step 2: Run the focused test to verify it fails**

Run: `pnpm e2e tests/e2e/specs/public-pages.spec.ts --grep "search intent"`

Expected: FAIL because the example sections and sibling links do not exist.

**Step 3: Write the minimal implementation**

Extend `AsciiScenePage` with example title/body/code props, render a semantic
unframed example section, and conditionally link to the other workflow route.
Keep the examples SSR-visible and platform-specific.

**Step 4: Compile locales and rerun the test**

Expected: PASS with unique canonical, preset, example, and sibling link checks.

### Task 4: Add Cloudflare static asset cache rules

**Files:**
- Create: `public/_headers`
- Create: `tests/unit/static-asset-headers.test.ts`

**Step 1: Write the failing unit test**

Read `public/_headers` when it exists, otherwise use an empty string. Assert
hashed `/assets/*` files receive `max-age=31536000, immutable` and image/font
paths receive an explicit cache policy.

**Step 2: Run the unit test to verify it fails**

Expected: FAIL because `public/_headers` does not exist.

**Step 3: Add the minimal `_headers` rules**

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/ascii/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/*.webp
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

**Step 4: Run the unit test and production preview check**

Expected: unit PASS; built preview returns the configured header for a hashed
asset and a hero image.

### Task 5: Verification

**Files:**
- Review all changed files

**Step 1:** Run `pnpm locale:check`.

**Step 2:** Run `pnpm check`.

**Step 3:** Run `pnpm build`.

**Step 4:** Run the focused Playwright specs.

**Step 5:** Walk `/line-art`, `/ascii-art-for-discord`, and
`/ascii-art-for-readme` in Chrome at desktop and 390px mobile widths. Confirm
no overflow, overlapping content, console errors, or incomplete SEO metadata.

**Step 6:** Run mobile Lighthouse on the local homepage and verify SEO remains
100 with no known contrast regression.

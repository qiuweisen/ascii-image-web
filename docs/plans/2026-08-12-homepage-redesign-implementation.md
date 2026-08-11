# ASCII Image Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the approved search-led, multilingual ASCII Image homepage with a real before/after Hero, improved converter, complete intent-driven content, and localized structured data.

**Architecture:** Keep the homepage route server-rendered and compose it from localized static sections plus two focused client interactions: the accessible Hero comparison and the existing browser-local converter. Use Paraglide messages as the only source for visible copy and JSON-LD. Extend the current CSS token layer instead of adding a new design system or motion dependency.

**Tech Stack:** TanStack Start, React 19, TypeScript, Tailwind CSS v4, native CSS, Canvas API, Paraglide JS, Tabler Icons, Playwright.

---

### Task 1: Lock The Acceptance Journey And Locale Baseline

**Files:**
- Modify: `tests/e2e/TEST-CATALOG.md`
- Modify: `tests/e2e/specs/ascii-converter.spec.ts`
- Modify: `project.inlang/settings.json`

**Step 1: Write the failing homepage journey**

Add Playwright assertions for:

- the H1 `Image to ASCII Art Converter`;
- the comparison slider and keyboard adjustment;
- the `Open converter` anchor reaching the workspace;
- source preview and ASCII output;
- `How image to ASCII works`, use cases, guide content, and six FAQ items;
- WebApplication and FAQPage JSON-LD;
- English and Chinese document language, localized H1, metadata, and FAQ copy.

**Step 2: Run the targeted spec and verify RED**

Run: `pnpm e2e tests/e2e/specs/ascii-converter.spec.ts`

Expected: FAIL because the new Hero, sections, schema, and Chinese messages do not exist.

**Step 3: Align Paraglide locales**

Set `locales` to `['en', 'zh']` in `project.inlang/settings.json`, then run:

`pnpm locale:compile`

**Step 4: Keep the catalog synchronized**

Document the comparison, localized content, schema, converter state, and mobile overflow journey in `TEST-CATALOG.md`.

### Task 2: Generate And Add The Hero Source Asset

**Files:**
- Create: `public/ascii/hero-source.webp`
- Create: `public/ascii/hero-ascii.webp`

**Step 1: Generate one editorial portrait**

Use the configured image generation relay to create a landscape editorial portrait with the subject weighted to the right half, neutral charcoal background, no text, no logo, and enough facial detail for ASCII conversion.

**Step 2: Derive the ASCII counterpart**

Convert the same image locally into a dense monochrome ASCII bitmap so both sides preserve identical framing. Do not ask the image model to invent a second portrait.

**Step 3: Inspect both assets**

Use `view_image` to verify identity, framing, crop, contrast, and absence of text/watermarks. Confirm both assets share exact dimensions.

**Step 4: Check file weight and dimensions**

Keep each Hero asset appropriately compressed and reserve the exact aspect ratio in CSS to prevent CLS.

### Task 3: Build The Accessible Hero Comparison

**Files:**
- Create: `src/components/ascii/ascii-comparison.tsx`
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/styles.css`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`

**Step 1: Use the failing Hero test from Task 1**

Confirm the test still fails because `[role='slider']` and the approved H1 are missing.

**Step 2: Implement the comparison**

Create a focused component that:

- renders the source and ASCII images in one stable aspect-ratio stage;
- uses a range input or slider semantics with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`;
- supports pointer, touch, arrows, Home, and End;
- exposes localized source/result labels;
- does not attach global scroll or pointer listeners.

**Step 3: Recompose the Hero**

Render a two-column Hero with one H1, a sub-20-word localized description, one `Open converter` action, and the comparison as the dominant visual. Keep the first viewport stable at 1440x900 and collapse to one column below 768px.

**Step 4: Run the targeted Hero assertions and verify GREEN**

Run: `pnpm e2e tests/e2e/specs/ascii-converter.spec.ts --grep "homepage"`

Expected: Hero interaction assertions pass; later content assertions may remain red.

### Task 4: Improve The Real Converter Workspace

**Files:**
- Modify: `src/components/ascii/ascii-converter.tsx`
- Modify: `src/styles.css`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`
- Modify: `tests/e2e/specs/ascii-converter.spec.ts`

**Step 1: Extend the failing converter test**

Assert that the built-in example exposes a visible source preview, drag state, localized accessible names, and a stable status region.

**Step 2: Verify RED**

Run: `pnpm e2e tests/e2e/specs/ascii-converter.spec.ts --grep "converter"`

Expected: FAIL because the source canvas and new status semantics are absent.

**Step 3: Implement the source preview and states**

- Keep the current browser-local Canvas conversion.
- Render the current source into a visible canvas with a fixed aspect ratio.
- Add drag-active styling and preserve click, drop, and paste input.
- Localize all accessible labels and status copy.
- Keep controls and output dimensions stable across empty, ready, processing,
  complete, and error states.
- Preserve copy, TXT download, reset, width, contrast, ramp, and invert behavior.

**Step 4: Verify GREEN**

Run the targeted converter test and confirm output still changes when ramp and width change.

### Task 5: Add Search-Intent Content Without Template Repetition

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/styles.css`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`

**Step 1: Confirm content assertions are RED**

Run the homepage E2E test and confirm missing sections fail by accessible heading.

**Step 2: Add localized sections**

Implement distinct layouts for:

- style proof using real ASCII output samples;
- `Upload`, `Adjust`, and `Copy or download` workflow;
- README/terminal, social/avatar, and poster/cover use cases;
- concise guide content covering quality, character ramps, ASCII versus pixel art, local processing, supported formats, and limits;
- related tools with a real `/line-art/` link and non-link future tools;
- six to eight operational FAQ items;
- final `Open converter` action.

Avoid equal three-card rows, section numbering, repeated eyebrows, decorative dots, and hard-coded English.

**Step 3: Verify content and mobile overflow**

Run the English and Chinese homepage assertions at desktop and 390px viewport widths.

### Task 6: Add Localized Structured Data And Metadata

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`
- Modify: `tests/e2e/specs/ascii-converter.spec.ts`

**Step 1: Verify schema assertions are RED**

Confirm only WebSite JSON-LD exists.

**Step 2: Implement shared localized FAQ data**

Export or define one localized FAQ source consumed by both visible details and FAQPage JSON-LD. Add WebApplication JSON-LD with localized name, description, browser requirements, application category, operating system, URL, and free offer information.

**Step 3: Verify schema and locale metadata**

Assert the rendered JSON-LD matches visible FAQ questions and current locale. Verify title, description, canonical, `html[lang]`, Open Graph locale, and `hreflang` alternates.

### Task 7: Normalize Homepage Navigation And Footer Treatment

**Files:**
- Modify: `src/config/navbar-config.ts`
- Modify: `src/config/footer-config.ts`
- Modify: `src/components/layout/navbar.tsx`
- Modify: `src/components/layout/navbar-mobile.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/styles.css`
- Modify: `project.inlang/messages/en.json`
- Modify: `project.inlang/messages/zh.json`

**Step 1: Add navigation assertions**

Assert the desktop nav stays on one line and exposes Converter, How it works, Use cases, FAQ, Line Art, locale, and theme controls without placeholder routes.

**Step 2: Implement localized anchor navigation**

Use stable homepage anchors and keep `/line-art/`, privacy, locale, theme, and auth behavior. Apply the compact dark editorial treatment only through semantic classes/tokens so other routes remain functional.

**Step 3: Verify navigation and footer in both locales**

Test desktop, mobile menu, locale switching, focus order, and anchor destinations.

### Task 8: Final Quality, Pre-Flight, And Browser Verification

**Files:**
- Modify if required: `DESIGN.md`
- Modify if required: files above

**Step 1: Run static checks**

Run:

- `pnpm check`
- `pnpm build`

Fix all errors introduced by the redesign without rewriting unrelated files.

**Step 2: Run targeted E2E**

Run: `pnpm e2e tests/e2e/specs/ascii-converter.spec.ts`

If the Worker compatibility date still blocks local Vite, update the local Cloudflare toolchain rather than weakening the production compatibility date, then rerun.

**Step 3: Verify in a real browser**

Walk the page at 1440x900, 1024x768, 768x1024, and 390x844 in English and Chinese. Exercise comparison dragging, keyboard controls, upload, paste, converter controls, copy, download, FAQ, anchors, locale, and theme.

**Step 4: Capture and inspect screenshots**

Capture desktop and mobile full-page screenshots. Check actual pixels for nonblank Hero media, readable ASCII output, no overlap, no clipped text, and no layout shift.

**Step 5: Run Lighthouse and the design pre-flight**

Run desktop and mobile Lighthouse accessibility and SEO audits. Check every `design-taste-frontend` pre-flight item that applies, including one accent, one shape system, Hero viewport fit, no repeated layout family, real images, reduced motion, multilingual overflow, and zero visible em-dash/en-dash characters.

**Step 6: Review the final diff**

Confirm only homepage, shared navigation treatment, locale configuration,
messages, assets, tests, and design documentation changed.

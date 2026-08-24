# ASCII Converter Growth Slice Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the browser-local ASCII converter measurable and more useful for Discord/README workflows, then publish two differentiated SEO scene pages.

**Architecture:** Keep conversion client-only in `AsciiConverter`, add typed preset/format helpers and a browser-safe analytics adapter, and render scene routes through one shared `AsciiScenePage`. Route metadata continues to use `seo()`, while the sitemap and homepage provide crawlable discovery.

**Tech Stack:** React 19, TanStack Router/Start, TypeScript, Vitest, Playwright, Paraglide messages, existing analytics provider components, Tabler icons.

---

### Task 1: Add pure converter preset and output helpers

**Files:**
- Create: `src/components/ascii/ascii-converter-model.ts`
- Create: `tests/unit/ascii-converter-model.test.ts`

**Step 1: Write the failing tests**

Cover these behaviors:

- Discord and README presets expose distinct widths and output formats.
- Plain text returns the original output.
- Markdown wraps output in a fenced `text` block.
- HTML escapes `&`, `<`, `>`, and quotes inside a `<pre>` block.

**Step 2: Run the focused test to verify it fails**

Run: `pnpm vitest run tests/unit/ascii-converter-model.test.ts`

Expected: FAIL because the model module does not exist.

**Step 3: Implement the minimal model**

Define `AsciiPresetId`, `AsciiOutputFormat`, `AsciiPreset`, `ASCII_PRESETS`, `formatAsciiOutput()`, and `escapeHtml()`. Keep the default preset equivalent to the current converter values. Do not add URL parsing or UI concerns here.

**Step 4: Run the focused test to verify it passes**

Run: `pnpm vitest run tests/unit/ascii-converter-model.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ascii/ascii-converter-model.ts tests/unit/ascii-converter-model.test.ts
git commit -m "feat: add ascii converter presets and output formats"
```

### Task 2: Add analytics event adapter

**Files:**
- Create: `src/lib/analytics-events.ts`
- Create: `tests/unit/analytics-events.test.ts`

**Step 1: Write the failing tests**

Test that the adapter:

- accepts only the typed ASCII event names and payloads;
- strips unsupported or raw-data fields before forwarding;
- safely no-ops when `window` or the analytics queue is unavailable.

**Step 2: Run the focused test to verify it fails**

Run: `pnpm vitest run tests/unit/analytics-events.test.ts`

Expected: FAIL because the adapter does not exist.

**Step 3: Implement the minimal adapter**

Expose `trackAsciiEvent(event)` and forward a sanitized event to the existing analytics integration if its public queue/API is available. Never include image bytes, generated ASCII, filenames, or identifiers. Keep it safe during SSR.

**Step 4: Run the focused test to verify it passes**

Run: `pnpm vitest run tests/unit/analytics-events.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/analytics-events.ts tests/unit/analytics-events.test.ts
git commit -m "feat: add ascii analytics event adapter"
```

### Task 3: Integrate presets, output formats, and events into the converter

**Files:**
- Modify: `src/components/ascii/ascii-converter.tsx`
- Modify: `src/locale/paraglide/messages/en.json`
- Modify: `src/locale/paraglide/messages/zh.json`
- Modify: `tests/e2e/specs/ascii-converter.spec.ts`

**Step 1: Write the failing E2E assertions**

Extend the converter spec to verify:

- a scene preset changes the visible width/output state;
- selecting Markdown and copying exposes the expected status;
- existing TXT copy/download and invalid-file behavior remain intact.

**Step 2: Run the focused E2E test to verify it fails**

Run: `pnpm exec playwright test tests/e2e/specs/ascii-converter.spec.ts --project=chromium`

Expected: FAIL on missing preset/format controls.

**Step 3: Implement the minimal UI integration**

Add an optional `presetId` prop. Initialize width, contrast, ramp, invert, and output format from the model. Add labelled preset and format controls using the existing terminal styling. Reuse existing copy/download actions, serializing HTML/Markdown through the pure helper. Emit events only after successful user actions or completed conversion; include only the documented aggregate payloads. Keep the demo state and current error messages working.

**Step 4: Compile locale messages and run the focused E2E test**

Run: `pnpm locale:compile && pnpm exec playwright test tests/e2e/specs/ascii-converter.spec.ts --project=chromium`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ascii/ascii-converter.tsx src/locale/paraglide/messages tests/e2e/specs/ascii-converter.spec.ts
git commit -m "feat: add ascii presets formats and tracking"
```

### Task 4: Build shared scene page and Discord/README routes

**Files:**
- Create: `src/components/ascii/ascii-scene-page.tsx`
- Create: `src/routes/ascii-art-for-discord.tsx`
- Create: `src/routes/ascii-art-for-readme.tsx`
- Modify: `src/locale/paraglide/messages/en.json`
- Modify: `src/locale/paraglide/messages/zh.json`
- Create: `tests/unit/ascii-scene-page.test.tsx`

**Step 1: Write the failing route/page tests**

Verify each route:

- has a unique title and description;
- renders an H1, intent-specific explanatory copy, and the converter;
- passes the expected preset to the converter;
- exposes a link back to the homepage and line-art library.

**Step 2: Run the focused test to verify it fails**

Run: `pnpm vitest run tests/unit/ascii-scene-page.test.tsx`

Expected: FAIL because the shared component and routes do not exist.

**Step 3: Implement the shared page and routes**

Create a semantic, SSR-visible scene layout using existing `ascii-*` classes and design tokens. Keep copy concise and specific: Discord emphasizes compact monospace output and Markdown/clipboard use; README emphasizes fenced Markdown and readable width. Use `seo()` with route-specific metadata. Use `AsciiConverter` with `discord` or `readme` preset.

**Step 4: Run the focused test to verify it passes**

Run: `pnpm vitest run tests/unit/ascii-scene-page.test.tsx`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ascii/ascii-scene-page.tsx src/routes/ascii-art-for-discord.tsx src/routes/ascii-art-for-readme.tsx src/locale/paraglide/messages tests/unit/ascii-scene-page.test.tsx
git commit -m "feat: add discord and readme ascii scene pages"
```

### Task 5: Add crawlable discovery and route health coverage

**Files:**
- Modify: `src/components/blocks/homepage.tsx`
- Modify: `src/routes/sitemap[.]xml.ts`
- Modify: `tests/e2e/specs/public-pages.spec.ts`

**Step 1: Write the failing route health assertions**

Add checks for both scene URLs returning successful pages with an H1 and canonical link. Add sitemap assertions for both URLs.

**Step 2: Run the focused test to verify it fails**

Run: `pnpm exec playwright test tests/e2e/specs/public-pages.spec.ts --project=chromium`

Expected: FAIL because the routes are not discoverable in the homepage/sitemap yet.

**Step 3: Implement discovery**

Add contextual links from the homepage's use-case or related-tools section. Add both scene paths to the sitemap with weekly change frequency and appropriate priority. Keep legal URLs unchanged.

**Step 4: Run focused verification**

Run: `pnpm locale:compile && pnpm exec playwright test tests/e2e/specs/public-pages.spec.ts --project=chromium`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/blocks/homepage.tsx src/routes/sitemap[.]xml.ts tests/e2e/specs/public-pages.spec.ts
git commit -m "feat: publish ascii scene routes in navigation and sitemap"
```

### Task 6: Full verification and review

**Files:**
- Modify only if verification reveals a defect.

**Step 1: Run checks**

Run: `pnpm check`

Expected: Biome and Vitest pass.

**Step 2: Build the production bundle**

Run: `pnpm build`

Expected: Vite/TanStack build completes successfully.

**Step 3: Run relevant E2E coverage**

Run: `pnpm exec playwright test tests/e2e/specs/ascii-converter.spec.ts tests/e2e/specs/public-pages.spec.ts --project=chromium`

Expected: all selected specs pass.

**Step 4: Inspect the final diff**

Run: `git diff origin/main...HEAD --stat && git status --short`

Expected: only the planned source, test, locale, and plan/design files are changed; pre-existing untracked user files remain untouched.

**Step 5: Commit any verification-only fix**

Use a focused commit message describing the defect corrected.

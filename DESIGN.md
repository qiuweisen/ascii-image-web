# ASCII Image Design System

## 1. Design Intent

**Direction:** Terminal ASCII / editorial utility.

The interface should feel like a precise browser-based instrument for turning
images into text. It combines a dark terminal surface, luminous character
output, thin cyan structure lines, and restrained motion. The tool itself is
the primary visual, so decorative elements must reinforce conversion, not
compete with it.

**Reference source:** `temp/index.html` and `temp/line-art.html`, derived from
the Open Design treatment for `imagetoascii.app`.

## 2. Core Tokens

Use semantic tokens in components. Do not hard-code page-specific colors or
spacing when a token below applies.

```css
:root {
  /* Color */
  --color-bg: oklch(0.1457 0.0043 285.9);
  --color-surface: oklch(0.1703 0.0083 285.5);
  --color-fg: oklch(0.8716 0.2785 142.7);
  --color-muted: oklch(0.7093 0.0014 286.4);
  --color-border: oklch(0.2835 0.0427 199.9);
  --color-accent: oklch(0.7788 0.1727 66.6);
  --color-accent-soft: color-mix(in oklch, var(--color-accent) 15%, transparent);
  --color-fg-soft: color-mix(in oklch, var(--color-fg) 7%, transparent);

  /* Typography */
  --font-display: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  --font-body: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  --font-mono: var(--font-body);
  --weight-regular: 400;
  --weight-medium: 600;
  --weight-bold: 750;

  /* Layout */
  --container-wide: 1460px;
  --container-tool: 1180px;
  --gutter-wide: clamp(20px, 5vw, 76px);
  --gutter-default: clamp(20px, 3vw, 28px);
  --radius-control: 4px;
  --border-hairline: 1px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-section: clamp(72px, 9vw, 132px);

  /* Effects and motion */
  --shadow-output: 0 0 7px color-mix(in oklch, var(--color-fg) 38%, transparent);
  --shadow-panel: 0 24px 70px color-mix(in oklch, var(--color-bg) 74%, transparent);
  --ease-ui: ease-out;
  --duration-fast: 120ms;
  --duration-ui: 160ms;
}
```

`temp/line-art.html` uses a 6px radius for its narrower generator variant.
Treat that as a legacy page-level exception; new surfaces use
`--radius-control` unless a component specification explicitly says otherwise.

## 3. Typography

- All display, body, metadata, and ASCII output use the same system monospace
  family to preserve a tool-like voice and predictable character widths.
- Keep letter spacing at `0`; use uppercase and bracket prefixes for metadata
  instead of tracking-heavy labels.
- Recommended scale: `h1 clamp(40px, 7vw, 108px)`, `h2 clamp(28px, 4.6vw, 68px)`,
  `h3 18-20px`, body `15-18px`, metadata `11-13px`.
- Headings use tight line-height (`1.02-1.32` depending on size); body copy uses
  `1.5-1.55`.
- ASCII output is always `white-space: pre`, uses `line-height` below `1`, and
  may use `text-shadow: var(--shadow-output)` for legibility.

## 4. Layout and Rhythm

- Use a centered container with fluid gutters and a visible vertical rail on
  wide layouts. Maximum widths are `--container-wide` for marketing sections
  and `--container-tool` for focused generators.
- Sections are full-width bands separated by a `1px dashed` border. Avoid
  stacking cards inside cards; use borders and whitespace to establish regions.
- The primary converter is a two-column workspace: controls on the left,
  output terminal on the right. Collapse to one column below `920px`.
- Hero comparison is a full-bleed bounded stage with a draggable vertical split;
  it should appear before explanatory copy and CTA.
- Use asymmetrical editorial grids (`1fr/.52fr`, `.62fr/1.38fr`) when content
  benefits from hierarchy. Do not center every section.
- Mobile gutters reduce to `20px`; controls and previews become stacked, and
  action buttons expand to the available width.

## 5. Component Rules

### Navigation

Sticky, translucent background with blur, a `1px` border, muted links, and a
single high-contrast action. Prefix the logo with `> ` or another terminal
prompt marker.

### Buttons and links

- Minimum interactive height: `44px` (primary hero CTA: `48px`).
- Primary: accent fill with background-colored text.
- Secondary: transparent with border; hover adds `--color-fg-soft`.
- Text links use an underline and a directional arrow. Reserve filled buttons
  for the main action; do not make every action primary.

### Inputs and controls

Inputs, selects, tabs, segments, and dropzones use thin borders, dark background,
and a `4px` radius. Active or focused controls switch the border to
`--color-fg` and may add `--color-fg-soft`. Range controls use the foreground
accent. Drag-and-drop areas use a dashed foreground border.

### Output terminal

The output area is darker than its surrounding surface, scrollable, and keeps a
stable minimum height. Status text is muted and prefixed with `> `; errors use
`--color-accent`.

### Labels and metadata

Use compact uppercase labels with a terminal prefix (`/`, `[ ]`, or `> `). Keep
metadata secondary in `--color-muted`; do not use extra badges for decoration.

## 6. Interaction and Motion

- Use `120-160ms` ease-out transitions for borders, backgrounds, and small
  transforms. Pressed buttons move down by `1px`; hover CTAs may lift `2px`.
- Use motion to explain state: comparison dragging, ticker galleries, and
  character rain. Pause continuous motion on hover and expose a pause control
  where it persists.
- Respect `prefers-reduced-motion: reduce`: remove animation, smooth scrolling,
  and non-essential transitions.
- Provide visible `:focus-visible` outlines using `2px` foreground with a
  `3-4px` offset.

## 7. Accessibility and Content

- Preserve keyboard access for file upload, comparison slider, tabs, and all
  controls. The comparison grip must expose `role="slider"` and an aria value.
- Keep output updates in an `aria-live` region and include a readable status.
- Explain local processing and file limits near upload controls.
- Never rely on green/yellow color alone for success or error; pair color with
  text and state labels.

## 8. Quality Bar

Before shipping a page, verify:

1. It uses semantic tokens from this document rather than one-off colors.
2. The converter or generated ASCII is visible in the first viewport.
3. Borders, spacing, and control heights remain stable across content changes.
4. Layout works at desktop, tablet, and narrow mobile widths without overlap.
5. Reduced-motion, keyboard focus, empty, loading, and error states are covered.


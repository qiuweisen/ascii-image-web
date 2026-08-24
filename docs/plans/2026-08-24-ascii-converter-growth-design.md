# ASCII Converter Growth Slice

## Goal

Improve the browser-local converter's measurable completion loop and create two
search-intent pages without generating thin keyword variants. The first slice
covers Discord and README workflows, while keeping the existing home and
line-art pages as the primary product surfaces.

## Scope

- Add a small client-side analytics event helper that uses the configured
  analytics provider when available and otherwise remains a no-op.
- Track meaningful converter events: image upload, clipboard paste, successful
  conversion, copy, TXT download, output-format selection, preset selection,
  and control changes.
- Add Discord and README presets with stable defaults and output guidance.
- Add HTML and Markdown output actions alongside the existing plain-text
  download/copy actions.
- Add `/ascii-art-for-discord` and `/ascii-art-for-readme` routes. Each route
  has unique metadata and explanatory content, then renders the same converter
  with a route-specific preset.
- Add both routes to the sitemap and expose them through contextual links from
  the homepage.

Out of scope: user accounts, server-side image storage, share URLs, payment
changes, line-art subpages, and bulk format-specific landing pages.

## Architecture

`AsciiConverter` accepts an optional `preset` prop. Presets define output width,
contrast, character ramp, invert state, and a preferred output format. The
component owns the interactive state and emits semantic events through a
`trackAsciiEvent` helper. The helper is browser-safe and does not send image
data or generated text.

Scene routes use a shared `AsciiScenePage` component for layout, but provide
their own title, description, intro, usage notes, and preset. The route's
metadata is generated through the existing `seo()` helper. The homepage links
to both scenes from the existing style/use-case area.

Output behavior remains local: plain text is copied/downloaded as before;
HTML copies a `<pre>` block with escaped text; Markdown copies a fenced `text`
code block. Clipboard failures keep the existing visible status pattern.

## Event Contract

Events use a small typed payload:

- `ascii_upload`: `{ mimeType, fileSize }`
- `ascii_paste`: `{ mimeType, fileSize }`
- `ascii_conversion_complete`: `{ source, width, rows }`
- `ascii_copy`: `{ format }`
- `ascii_download`: `{ format }`
- `ascii_preset_select`: `{ preset }`
- `ascii_format_select`: `{ format }`
- `ascii_control_change`: `{ control, value }`

No raw image, ASCII output, filename, or user-identifying data is recorded.

## Error Handling and Accessibility

- Unsupported files, oversized files, decode failures, and clipboard failures
  retain explicit status text.
- Conversion and output status remains in an `aria-live` region.
- New format and preset controls use labelled buttons/selectors with keyboard
  focus states and at least 44px touch targets.
- Scene pages keep the converter in the first viewport and work without
  JavaScript for their explanatory headings and metadata, while the tool itself
  remains client-interactive.

## Testing

- Unit tests cover preset defaults, output-format serialization/escaping, and
  analytics event payload filtering.
- Route/page tests verify scene metadata, canonical URLs, and visible intent
  copy.
- Existing Playwright converter coverage is extended to exercise preset
  selection and output actions.
- Run focused Vitest tests, `pnpm check`, `pnpm build`, and the relevant E2E
  specs before completion.

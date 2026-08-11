# ASCII Image Homepage Redesign

**Status:** Approved
**Date:** 2026-08-12
**Reference:** `output/imagegen/ascii-homepage-concept-v1.png`

## Design Read

This is a search-led creative tool landing page for people who want to turn a
photo into ASCII art immediately. The page uses a refined dark editorial utility
language. It keeps the cultural character of ASCII without falling into hacker,
Matrix, or generic neon-terminal styling.

## Design Dials

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 5`
- `VISUAL_DENSITY: 4`

The layout is asymmetric on desktop and collapses into a strict single column
below 768px. Motion explains the before-and-after comparison and interaction
state. It does not decorate static content.

## Visual System

- One dark theme across the page, using charcoal and cold grey surfaces.
- One acid-lime accent for primary actions, active controls, and ASCII output.
- Bricolage Grotesque for headlines and readable marketing copy.
- A system monospace stack only for controls, metadata, and generated output.
- Sharp geometry with a consistent 4px maximum radius.
- Thin separators organize real regions. Decorative grids, outer glow,
  glassmorphism, pills, and nested cards are excluded.
- Real source photography and real generated ASCII results carry the visual
  identity.

## Homepage Structure

### Navigation

Keep the existing brand and route architecture. Use a compact single-line nav
with anchors to the converter, use cases, guide, and FAQ, plus the existing Line
Art route. Do not add placeholder destinations such as Gallery, Docs, or API.

### Hero

Use an asymmetric two-part composition that fits inside the first viewport:

- Left: `Image to ASCII Art Converter`, a short benefit statement, and one
  `Open converter` action.
- Right: a real editorial portrait with an accessible draggable comparison.
  The source photo appears on one side and its detailed ASCII render on the
  other.
- The comparison is the dominant proof of value and remains usable by keyboard.
- On mobile, the media appears first, followed by the copy and CTA, with a fixed
  aspect ratio that avoids layout shift.

### Converter

Place the real converter immediately after the hero and let it visually overlap
the hero boundary on desktop. Preserve browser-local processing, drag/drop,
paste, controls, copy, download, reset, and status behavior.

Improve the workspace by showing the current source preview as well as the ASCII
result. Make upload, error, processing, and success states explicit. Keep the
control rail compact and keep the output stable when parameters change.

### Style Proof

Show how one real image changes across Classic, Dense, and Blocks. Use an
asymmetric composition rather than three equal feature cards. The section exists
to demonstrate output differences, not to repeat control labels.

### How It Works

Explain the journey with the action names `Upload`, `Adjust`, and `Copy or
download`. Use short copy tied to the real controls. Avoid generic numbered step
labels.

### Use Cases

Use real ASCII outputs in distinct contexts: README/terminal, social/avatar, and
poster/cover. Vary the composition and image ratios. Do not use three identical
text cards.

### Learning Content

Provide concise, server-rendered content answering the search intent:

- what image-to-ASCII conversion does;
- which images produce clear results;
- how width, contrast, invert, and character ramps change output;
- where the copied text works;
- the difference between ASCII art and pixel art;
- local processing, supported formats, and limits.

The content should be scannable and grouped into two or three editorial blocks,
not one long article column.

### Related Tools

Link to the real `/line-art/` page. Present future Color, Braille, and Dots tools
as clearly unavailable without creating crawlable empty pages or misleading
links.

### FAQ And Final Action

Include six to eight operational questions. The visible FAQ must match FAQPage
structured data. End with one repeated `Open converter` action over a real ASCII
visual, then use the existing site footer.

## SEO Requirements

- Preserve `/`, `/line-art/`, canonical handling, sitemap, robots, and locale
  behavior.
- Keep `Image to ASCII - Convert Images to ASCII Art Free` as the title.
- Use exactly one H1: `Image to ASCII Art Converter`.
- Mention `image to ASCII` naturally in the opening copy and guide content.
- Render headings, guide copy, FAQ answers, and internal links through SSR.
- Add WebApplication and FAQPage JSON-LD that reflects visible page content.
- Keep the converter above long-form content so SEO copy does not obstruct the
  primary task.
- Use a descriptive social image and meaningful alt text for real images.

## Internationalization Requirements

- Treat English and Simplified Chinese as first-class launch locales and keep
  the message architecture open to additional locales.
- Keep `project.inlang/settings.json`, generated Paraglide locales,
  `localeConfig`, sitemap alternates, canonical metadata, and the language
  switcher in sync.
- Put every new visible string in Paraglide messages, including navigation,
  button labels, helper text, errors, status text, FAQ content, image alt text,
  accessible names, and final CTA copy. Components must not hard-code English.
- Build FAQ and WebApplication structured data from the same localized message
  sources used by the visible page so schema cannot drift from the UI.
- Generate locale-specific title, description, `inLanguage`, Open Graph locale,
  canonical, and `hreflang` output through the existing SEO helpers.
- Prefer complete sentences as message units. Do not concatenate translated
  fragments to construct headlines or descriptions.
- Allow headings, buttons, nav labels, and FAQ questions to grow by at least
  35 percent without clipping. Avoid fixed text widths and letter spacing that
  only works for English.
- Verify `/` in English and Chinese at desktop and mobile widths. Confirm the
  document language, visible copy, localized metadata, structured data, and
  internal links match the selected locale.

## Accessibility And Responsive Behavior

- Comparison control supports pointer, touch, Home/End, and arrow keys and
  exposes slider semantics.
- Upload, controls, FAQ, copy, download, and reset remain keyboard accessible.
- Focus indicators use the single accent color with sufficient contrast.
- Output updates remain in a polite live region.
- Continuous motion is avoided. Entry and state transitions are disabled under
  `prefers-reduced-motion`.
- Desktop asymmetric layouts collapse into a full-width single column below
  768px. The converter switches to one column below 920px.
- Text, buttons, and controls must not clip or overlap at 390px, 768px, 1024px,
  and 1440px widths.

## Testing And Acceptance

- Update the E2E catalog before implementation.
- Add a homepage journey covering the Hero comparison, converter navigation,
  visible learning sections, FAQ, and structured data.
- Add locale assertions for English and Chinese content, document language,
  localized metadata, and text overflow at narrow mobile width.
- Preserve the existing converter control test and extend it for source preview
  and key states.
- Run Biome checks and the production build.
- Render the page in a real browser at desktop and mobile sizes, inspect full
  page screenshots, exercise the comparison and converter, and check for console
  errors.
- Run Lighthouse accessibility and SEO audits when the local Worker runtime is
  available.

## Explicit Exclusions

- No AI generation mode, video conversion, webcam mode, accounts, API, gallery,
  or payment UI in this redesign.
- No copied competitor assets or layout reproduction.
- No placeholder routes or claims for unavailable products.
- No em-dash or en-dash characters in visible homepage copy.

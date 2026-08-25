# SEO Audit Remediation Design

## Goal

Ship the two differentiated ASCII workflow pages without exposing unfinished
localized content, then strengthen the only page already earning organic
clicks without creating thin keyword variants.

## Scope

### Indexation

Keep localized routes available for development, but only publish hreflang and
sitemap alternates for locales whose product content is ready. The immediate
release is English-only, so `/zh/` and the localized legal URLs must not be
advertised to crawlers. Discord, README, and line-art remain English-only and
keep self-referencing canonicals.

### Line-art library

Expand `/line-art` as a useful SSR library rather than adding generic SEO copy.
The page will expose more curated one-line pieces across stable categories,
retain search/filter/copy behavior, and add short semantic sections covering
selection and paste-safe usage. All inventory remains present in server HTML.

### Workflow pages

Discord and README continue to share the converter shell because their product
behavior is already distinct. Each page gains a platform-specific example that
shows the exact result users copy: a Discord code block or README Markdown
block. Related navigation links the two workflows to each other as well as the
homepage and line-art library.

### Technical cleanup

Raise the muted text token enough to pass the known contrast failure. Configure
long-lived immutable caching for hashed build assets while keeping HTML
revalidatable. Do not change the analytics provider endpoint in code because
its replacement host and production credentials are deployment configuration,
not repository facts.

## Testing

- Unit tests define which locales are indexable and verify sitemap alternate
  generation inputs.
- Playwright acceptance tests verify SSR-visible line-art inventory, semantic
  sections, workflow examples, canonical metadata, and mobile layout.
- Run focused tests first, followed by `pnpm check`, `pnpm build`, and focused
  browser verification at desktop and mobile widths.

## Non-goals

- Completing the Chinese translation.
- Adding more keyword landing pages.
- Deploying or submitting URLs to Google Search Console.
- Changing production analytics credentials without a confirmed replacement.

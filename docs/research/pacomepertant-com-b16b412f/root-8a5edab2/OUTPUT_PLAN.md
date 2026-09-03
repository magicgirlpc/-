# Output plan

- Source: `https://pacomepertant.com/`
- App root: `/Users/hepevsmbp-2/Documents/Codex/个人集/portfolio`
- Site key: `pacomepertant-com-b16b412f`
- Page key: `root-8a5edab2`
- Destination route: `/` (`app/page.tsx`)
- Contact fallback route: `/contact` (`app/contact/page.tsx`), added because embedded browsers can block the operating-system `mailto:` protocol.
- Components: `app/pacome/`
- Assets: `public/sites/pacomepertant-com-b16b412f/root-8a5edab2/`
- Research: `docs/research/pacomepertant-com-b16b412f/root-8a5edab2/`
- References: `docs/design-references/pacomepertant-com-b16b412f/root-8a5edab2/`

The existing `/photography`, `/photography/[slug]`, `/graphic`, and `/graphic/[slug]` routes are preserved. The user asked to rebuild the portfolio homepage from the supplied reference, so the existing `/` implementation is the approved replacement target. `/contact` is a new non-colliding route and does not replace an existing page.

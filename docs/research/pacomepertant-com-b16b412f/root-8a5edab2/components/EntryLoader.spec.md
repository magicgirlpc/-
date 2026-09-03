# EntryLoader Specification

## Overview
- Target file: `app/pacome/EntryLoader.tsx`
- Interaction model: time-driven reveal followed by click-driven portfolio entry or email contact

## DOM Structure
Fixed full-screen loader with a client-rendered Lottie container, two-line descriptor, white pill entry button and bottom-center email link. No loading percentage is rendered in either lower corner.

## Computed Styles
- Container: fixed inset 0, 100dvh, flex column centered, background `#0a0a0a`, color `#fafafa`, z-index 1000, 24px weight 500.
- Lottie: 300px wide, auto height, maximum viewport width minus two grid margins, margin-top `-100px`, margin-bottom `24px`.
- Descriptor: width 300px, max-width viewport minus two margins, 24px, centered, margin-top `-100px`, margin-bottom `32px`. The negative top margin is shared with the Lottie and is required to reproduce the reference's compact vertical grouping.
- Primary: white/dark, radius 50px, 18px, padding 14px, trailing 6px dot.
- Email link: fixed bottom grid margin, 14px weight 400, opacity .7, underline scales on hover. Exact destination: local route `/contact`, which supplies browser-safe compose choices.

## States & Behaviors
Internal loading progress still advances from 0–100 but is not displayed. The Lottie initializes on every component mount, autoplays once and does not loop. Its `DOMLoaded` event reveals the intro copy; its `complete` event marks the animation ready. Entry controls fade in only when both loading progress and the animation are complete. Client-side navigation back to `/` must create a fresh Lottie instance from frame zero. Cleanup destroys the old instance and removes listeners so returning home cannot reuse a detached SVG renderer. If Lottie loading fails, the local favicon is shown as a non-blocking fallback and entry controls remain available.

### Animated identity text
- **Interaction model:** time-driven Lottie text animation; this is not the persistent logo tooltip.
- **Asset layer:** `loader.json` layer index 5, active on frames 20–50 at 25fps. Preserve the existing position keyframes, text animators, easing, opacity, scale and layer timing exactly.
- **Customized animated copy:** change both the layer name and text document from `I’m Pacôme` to `I’m Pengcheng`.
- **Glyph rendering:** the original JSON embeds glyph outlines for `I’m Pacôme` only and lacks `n`/`g`. Remove the embedded `chars` table so Lottie renders both identity phrases using the local Indivisible font, and register the same local WOFF2 under the `Indivisible` family name used by the animation data. Do not substitute a static HTML label.
- **Fit:** the complete `I’m Pengcheng` phrase must stay centered and fully visible inside the 500×500 Lottie composition at desktop and mobile sizes.

## Customized Text Content
- Animated Lottie identity: `I’m Pengcheng`
- Descriptor line 1: `Video Production`
- Descriptor line 2: `based in Shanghai`
- Primary button: `Enter my portfolio`
- Bottom contact label: `1579713724@qq.com`
- Bottom contact click behavior: navigate to `/contact`; it must not enter the portfolio or alter sound state. The local contact route avoids the silent failure of `mailto:` inside embedded browsers.

## Assets
- Exact reference animation: `public/sites/pacomepertant-com-b16b412f/root-8a5edab2/loader.json` (Lottie 5.12.1 data, 500×500, 25fps, frames 0–67, 14 layers).
- Fallback mark: `public/sites/pacomepertant-com-b16b412f/root-8a5edab2/favicon.svg`.

## Responsive
Same centered composition; grid margins reduce at 900px and 420px.

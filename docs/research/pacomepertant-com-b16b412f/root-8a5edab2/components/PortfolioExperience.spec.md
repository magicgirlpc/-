# PortfolioExperience Specification

## Overview
- Target file: `app/pacome/PortfolioExperience.tsx`
- Interaction model: state coordinator and page-level assembly

## DOM Structure
Root viewport experience; spiral and list layers; entry loader before entry; persistent chrome after entry; polite screen-reader status.

## Computed Styles
The root scopes the extracted `#0a0a0a`, `#fafafa`, `#21ffc0` tokens, local Indivisible font, 12-column desktop/6-column mobile grid and full-viewport overflow behavior.

## States & Behaviors
- Initial: loader visible, both galleries non-interactive.
- Entered spiral: loader unmounted, spiral active and chrome mounted.
- Entered list: spiral becomes inactive while the persistent list instance becomes active. Do not remount the list on every mode change; inactive cleanup already clears pointer-preview state, and preserving the DOM is required for a real exit animation.
- View switching uses overlapping phases rather than an abrupt mount/unmount. Spiral fades and scales toward `translateY(35px) scale(.94)` over `.55s` with the extracted spring. List rows begin their staggered entry after `.2s`, so the outgoing spiral remains visible beneath the first list rows. On the reverse switch, list rows stagger out while the spiral simultaneously expands/fades back in.
- Rapid repeated selection of the already-active view is a no-op. Both galleries become non-interactive immediately when inactive even though their visual exit may continue.
- Sound and view state are announced through an aria-live region.

## Assets
Delegated to child components.

## Text
Delegated to child components.

## Responsive
Page stays viewport-bound; CSS token breakpoints at 900px and 420px coordinate all children.

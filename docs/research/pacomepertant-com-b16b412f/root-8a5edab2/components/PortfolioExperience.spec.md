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
- A route carrying `resume=1` is an explicit return from a project detail page. It initializes directly in the requested entered gallery state without mounting the loader for a frame, then removes only the temporary `resume` query parameter with `history.replaceState`. This behavior must not depend on the document-level Performance Navigation type because a previous reload remains reported after later client-side routes and can otherwise reopen the welcome screen.
- Entered spiral: loader unmounted, spiral active and chrome mounted.
- Entered list: spiral becomes inactive while the persistent list instance becomes active. Do not remount the list on every mode change; inactive cleanup already clears pointer-preview state, and preserving the DOM is required for a real exit animation.
- View switching uses overlapping phases rather than an abrupt mount/unmount. Spiral fades and scales toward `translateY(35px) scale(.94)` over `.55s` with the extracted spring. List rows begin their staggered entry after `.2s`, so the outgoing spiral remains visible beneath the first list rows. On the reverse switch, list rows stagger out while the spiral simultaneously expands/fades back in.
- Rapid repeated selection of the already-active view is a no-op. Both galleries become non-interactive immediately when inactive even though their visual exit may continue.
- Sound and view state are announced through an aria-live region.
- While the portfolio is mounted, browser scroll restoration is manual and the document is returned to `(0, 0)`. This prevents a long project-detail scroll position from leaking into the viewport-bound home scene.
- The root publishes `--pp-viewport-height` from live browser viewport measurements. Desktop uses the largest of `innerHeight`, document client height, and Visual Viewport height to reject Safari's stale shortened return viewport; narrow/mobile layouts prefer Visual Viewport height so bottom controls remain above browser chrome. It resynchronizes immediately, across the first restoration frames, after short delayed Safari layout passes, on `pageshow`, orientation/viewport resize, and document-root resize.
- Home scene layers and persistent chrome are positioned against the explicit root viewport box rather than independently against `position: fixed`. This avoids Safari briefly reusing the project-detail visual viewport when returning through client-side navigation, which otherwise places every bottom-anchored control near the middle of the screen.

## Assets
Delegated to child components.

## Text
Delegated to child components.

## Responsive
Page stays viewport-bound; CSS token breakpoints at 900px and 420px coordinate all children.
Desktop and mobile return-flow QA must verify `scrollY === 0`, root height equals the live viewport height, no horizontal overflow, and correct bottom anchoring after repeatedly opening a long detail page, scrolling to its end, and returning.

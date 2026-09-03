# ListGallery Specification

## Overview
- Target file: `app/pacome/ListGallery.tsx`
- Interaction model: scroll-driven list with pointer-hover image trail

## DOM Structure
Centered vertical list wrapper; nine project links; one fixed/absolute hover-preview layer.

## Computed Styles
- Wrapper: display flex column, align-items center, text-align center, width 12 grid columns, min-height 100vh, margin grid margin, padding-block `calc(20vh - 60px)`, overflow-x hidden.
- The fixed list layer is transparent in both active and exiting states so the spiral remains visible beneath the staggered rows during the overlap. It must never flash an opaque black viewport before entry begins.
- Project text: 60px, weight 500, margin 0, padding half gutter, pointer-events auto, transform-origin top center, opacity transition .3s.
- Sibling dim state: opacity .4; hovered text stays 1.
- Hover thumbnail: 150px wide desktop, 100px under 900px, positioned at pointer, object-fit cover, eased transform/opacity.

## States & Behaviors
- Exact reference transition extracted from the production component:
  - Enter trigger: mode becomes `list` while the persistent list DOM remains mounted.
  - Each `.project` starts at `translateY(-30px) scaleY(.5)` and opacity 0, then reaches `translateY(0) scaleY(1)` / opacity 1 over `.5s` with `power3.out` (`cubic-bezier(.215,.61,.355,1)`).
  - Entry delay is `.2s + index * .05s`, creating the reference top-to-bottom cascade.
  - Leave starts at rest and reaches `translateY(50px) scaleY(.5)` / opacity 0 over `.3s` with the same easing and `index * .05s` stagger.
  - The list viewport remains visually available until the last row finishes (approximately `.75s` for nine items), but pointer events and focus are disabled immediately.
- `--pp-list-index` is written per row for CSS stagger timing. Hover title changes active image and its preview follows cursor with damped easing.
- Clicking links to the corresponding original project/Behance URL.

## Assets
Same nine project thumbnails as SpiralGallery.

## Responsive
Under 900px: wrapper six grid columns and full content height, padding-top 20vh, title font-size 40px, preview 100px. Touch has no hover preview but links remain usable.

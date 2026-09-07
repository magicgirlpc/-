# ChromeOverlay Specification

## Overview
- Target file: `app/pacome/ChromeOverlay.tsx`
- Interaction model: click-driven logo/menu/sound/view switch; hover-driven buttons and showreel

## DOM Structure
Fixed logo; centered view switch; right menu pill plus expanding drawer; bottom-left showreel card; bottom-right sound button.

## Computed Styles
- Root colors: background `#0a0a0a`, white `#fafafa`, pop green `#21ffc0`, grey `#e6e6e6`.
- Grid margin: 30px desktop, 20px under 900px, 15px under 420px.
- Logo: fixed, 64×64px, left/top grid margin, z-index 20.
- Switch: fixed, left 50%, top 45px, translateX(-50%), display flex, gap 20px, font 18px/18px weight 500, z-index 20. Dot 8×8px circle. Inactive opacity .4.
- Menu button: white, dark text, 48px tall, pill radius 100px, 15px 28px 15px 15px padding, 18px weight 500.
- Drawer: fixed right/top 30px, closed 86.8×48px radius 24px; open height `calc(100dvh - 60px)`, radius 16px. Open width four columns at wide desktop, five below 1400px, six below 1024px. Transition width .9s and height 1s with spring.
- Menu links: 80px, weight 500, tracking -.05em, line-height 1; 15px vertical gap. Hover indents 40px and reveals 24px dot.
- Showreel thumbnail: fixed bottom/left 30px. Image wrapper 280px at 16/9, left -140px, top -40px, rotate(-15deg), 20px radius, shadow `0 4px 8px #0003`.
- Sound: fixed 48×48px circle right/bottom 30px, white background, dark icon.

## States & Behaviors
- Logo click cycles through four expression states in the exact source order `face1 → face3 → face4 → face5 → face1`. Each click restarts the short, non-looping logo motion and triggers a smiley interaction sound. The hover tag reads `Click!!` in the reference.
- View labels roll by translating the first span down and the second span from -100% to 0 in `.3s var(--ease-spring)` while option opacity changes over `.3s ease-out`. This extracted header motion stays synchronized with the overlapping gallery transitions; no instant text swap is allowed.
- Menu expands/collapses; overlay blurs/dims the gallery.
- Mobile menu performance: at 900px and below, omit the two decorative full-screen prelayers, remove backdrop blur, and use a compact transform-only drawer/label timeline. Opening any overlay pauses the hidden spiral RAF until the overlay closes. Desktop retains the layered reference animation.
- Showreel hover transform changes to rotate(-13deg) scale(1.05).
- Sound toggles icon state and `aria-pressed`.

## Assets
- `showreel-thumbnail.png`

## Text
Visible identity/tooltip copy is customized to `I'm Pengcheng`. Preserve the remaining interface labels and layout unless separately customized.

spiral, list, menu, close, works, about, contact, pertantpacome@gmail.com, showreel • 2025

## Responsive
Preserve fixed composition. Reduce margins at 900/420px; drawer becomes the full mobile viewport. Mobile avoids full-screen blend/noise work while the menu is moving; desktop keeps the richer layered composition.

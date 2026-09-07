# SpiralGallery Specification

## Overview
- Target file: `app/pacome/SpiralGallery.tsx`
- Interaction model: time-driven continuous rotation + wheel + pointer-drag + keyboard inertia

## DOM Structure
Full-screen scene containing positioned project anchors/cards. A decorative fixed vignette/noise layer sits behind them. Each cover retains compact lower-edge metadata (title at lower-left and year at lower-right), while hovering or keyboard-focusing a card also exposes one fixed bottom-center project detail pill containing a 48px square thumbnail and the project title.

## Computed Styles
- Scene: fixed inset 0, 100vw × 100dvh, overflow hidden, black background, z-index 0.
- Reference canvas: fixed inset 0, width/height 100%, opacity transition .5s ease-out.
- Cards: use real 16:9-ish thumbnails, 20px radius; helix coordinates are driven by the continuous active index. Nearest cards are largest and opaque; distant cards shrink, blur and fade. For the denser reference-like arrangement use `ANGLE_STEP = Math.PI * 0.34`, desktop radius `clamp(300px, 28vw, 500px)` and desktop vertical spacing `84px`. At 700px and below use radius `clamp(140px, 44vw, 210px)` and vertical spacing `58px`.
- Typography: 18px Indivisible, white, tracking -.04em.

## States & Behaviors
- Exact idle motion extracted from the reference implementation:
  - `easing = 0.1`
  - `minWheelSpeed = 0.002`
  - initial `wheelDirection = 1`
  - `wheelDelta += (targetWheelDelta - wheelDelta) * easing`
  - `scrollOffset += wheelDelta`
  - if `abs(targetWheelDelta) < minWheelSpeed`, restore `targetWheelDelta = wheelDirection * minWheelSpeed`
  - decay `targetWheelDelta *= 0.9`
  - steady-state at 60fps is approximately `0.0018` index/frame, `0.108` project/second, or one project every 9.26 seconds.
- Wheel input uses `targetWheelDelta += deltaY * 0.00015`, clamps to `[-2, 2]`, and changes the persistent direction from the input sign. When the extra inertia decays, idle rotation resumes in that direction without snapping to a card.
- Drag and keyboard update the same continuous position while preserving the automatic idle behavior after interaction.
- Helix angle and vertical offset derive from `(index - currentPosition)`, wrapping across the nine projects.
- View hidden state: opacity 0 and pointer-events none over .5s.
- View switch hidden state also moves/scales the whole spiral to `translateY(35px) scale(.94)` while opacity reaches 0 over `.55s` with the extracted spring. Reactivation reverses the same transition, overlapping the list-row exit rather than waiting for it to unmount.
- Pointer hover follows the extracted reference behavior: only the hovered cover receives a black tint at 55% strength and its image zooms to `1.05`; leaving restores the original cover. The centered detail pill sits 60px above the viewport bottom with white background, black text, 14px radius, `6px 16px 6px 6px` padding and a 12px image/text gap. Its thumbnail is 48×48px with 9px radius and its title is 18px/500 on one line.
- Cover metadata is positioned `left/right: 15px; bottom: 13px`, uses 14px/500 white text, and animates from opacity 0 / `translateY(8px)` to visible on the current, hovered or keyboard-focused cover. The year stays at the lower-right in 12px text at 65% opacity. It remains above the 55% black hover tint. A separate bottom gradient (`transparent 45%` to `rgba(0,0,0,.72)`) fades in with the metadata so white text stays legible over pale covers without changing the full-cover hover tint.
- Detail-pill entry begins at `translateY(18px) scale(.96)` and opacity 0, then reaches its resting state over `.35s cubic-bezier(.22,1,.36,1)`. Exit reaches `translateY(-12px) scale(.96)` and opacity 0 over `.25s` with the same easing. Rapid movement between covers updates the project content without leaving stale UI.
- Keyboard focus mirrors pointer hover for accessibility. The transient hover detail does not appear on touch-only input and is cleared whenever the spiral view becomes inactive.
- Respect reduced motion by disabling automatic rotation and using direct stepped input.
- Performance-preserving restoration: preserve the extracted visible idle rate of about `0.108` project/second with elapsed-time-based movement, capped to about 60 painted frames per second so 120Hz devices do not double the speed or rendering work. Retain the optimized 960×540 gallery derivatives, nearby-card loading window, deferred session-position writes and paint containment. Pause the RAF loop while the document is hidden; pointer movement owns painting during an active drag, then the time-driven loop resumes immediately on release.
- Vertical continuity: the reference creates two complete rounds of project planes and loads every texture, which keeps the cylinder populated above and below the center. The local DOM version keeps one lightweight card round and calculates the required image window from viewport height, card height and vertical spacing, capped at five project steps on mobile and seven on desktop. It loads the center immediately, then staggers the remaining visible upper/lower covers at low priority; movement pulls the next covers into the queue as they approach. This prevents all 22 covers competing during first paint while still filling the visible helix. Distant visible cards retain enough opacity and reduced blur to read as a continuing helix rather than empty placeholders.
- Helix refinement: match the reference plane's extracted angular step of about `0.85rad` instead of the wider local `1.07rad` step, and slightly tighten the vertical pitch. The nearest two to three cards remain readable and visually dominant; cards farther from the viewport center gain progressive distance blur, lower opacity and a modest scale reduction so repeated front-facing turns do not compete with the active foreground. The result should read as one compact rising cylinder, not evenly weighted rows of a photo wall.
- Native browser dragging and selection are disabled at the scene, anchor and image levels. Pointer dragging must never produce a link/image drag ghost, copy badge or blue selection overlay; click suppression after a real drag remains intact.
- Precision trackpad input: retain the reference `deltaY * 0.00015` response for conventional mouse wheels, but detect pixel-mode, low-amplitude wheel streams produced by Mac trackpads and apply a higher gain plus a small minimum impulse. This prevents each gesture from being swallowed by the idle-rotation floor while preserving continuous inertia and the existing `[-2, 2]` clamp.
- Touch-axis symmetry: on coarse-pointer mobile devices, determine the dominant axis after a short movement threshold and drive the helix from either horizontal or vertical movement. Capture touch pointers immediately, use the same distance and release-velocity calculation in both horizontal directions, and prevent cancellable native movement. A leftward and rightward swipe therefore have equal resistance instead of depending on incidental vertical drift.
- Mobile compositor budget: cards farther than 6.25 project steps from the active position are hidden and receive no transform/filter writes until they approach the visible helix. The spiral animation pauses while the menu, contact panel or resume panel covers it. Desktop keeps the complete existing render window and motion behavior.
- Project opening transition: the reference begins `hideProjects()` before navigation and staggers plane movement in four groups. The DOM version holds navigation briefly, freezes the helix, fades and softens non-selected cards, gives the selected card a small forward emphasis, then raises a light rounded curtain from the bottom. Navigation occurs while the curtain covers the viewport. Reduced-motion users navigate immediately.

## Assets
Nine downloaded project thumbnails in `public/sites/pacomepertant-com-b16b412f/root-8a5edab2/projects/`.

## Text
Paths of life; The disease spread on Tiktok; Ah, Psychedelics; Thought; Jupiter; Chromatik; Digital Travel; Mercedes AMG; The purity revealed. Years 2024–2026.

## Responsive
Desktop cards roughly 360–440px wide. Under 900px use 220–280px; under 700px use the denser mobile helix values above. Touch drag must work.

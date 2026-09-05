# SoundEngine Specification

## Overview
- Target file: `app/pacome/sound.ts`
- Interaction model: user-gesture driven UI effects plus a persistent low-volume ambient loop.

## States & Behaviors
- Sound begins only after the user presses the portfolio entry button.
- The sound state is stored in session storage so the home and project-detail routes share the same preference.
- Entry plays `entry.mp3`; desktop card pointer-entry plays `hover.mp3`; project navigation plays `open.mp3`; returning from a project plays `back.mp3`; opening or closing the menu plays `menu.mp3`; the lower-right sound control plays `toggle.mp3` in both directions.
- Ambient audio uses `ambient.mp3`, loops continuously at 7% volume and fades in after entry. It uses `preload="none"` so the entry screen and cover images retain network priority.
- Opening a project ducks the same continuous ambient player to 2.2% instead of pausing it. Returning to the gallery fades it back to 7% without resetting playback position.
- The current ambient time is mirrored to session storage as a fallback, so route reloads can resume near the previous position instead of restarting the track.
- UI effects are cached and restarted instead of creating unlimited Audio instances. Hover sound is rate-limited to avoid chatter while the pointer crosses overlapping cards.
- Pause ambient playback while the document is hidden and resume when visible if sound remains enabled.
- Clamp every fade timestamp and computed volume to valid finite ranges. A newly started fade invalidates the previous animation-frame loop, preventing overlapping fades from writing stale or negative volume values.
- If autoplay restoration is blocked after a route load, the next sound-enabled user interaction retries the ambient player within that gesture.

## Assets
- `public/portfolio/audio/entry.mp3` — 96kbps.
- `public/portfolio/audio/hover.mp3` — 96kbps.
- `public/portfolio/audio/open.mp3` — 96kbps.
- `public/portfolio/audio/back.mp3` — 96kbps.
- `public/portfolio/audio/menu.mp3` — 96kbps.
- `public/portfolio/audio/toggle.mp3` — 96kbps.
- `public/portfolio/audio/ambient.mp3` — 80kbps.

## Responsive Behavior
- Identical state and volume behavior on desktop and mobile. Hover sound is naturally desktop-only because touch pointer entry is ignored.

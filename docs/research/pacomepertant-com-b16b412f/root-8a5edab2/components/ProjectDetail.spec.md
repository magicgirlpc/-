# ProjectDetail Transition Specification

## Overview
- **Target files:** `app/pacome/ProjectDetail.tsx`, `app/projects/project-detail.css`
- **Interaction model:** route-driven entrance following a gallery-card click

## DOM Structure
- Full viewport dark project page.
- Fixed light transition curtain above the page during the first entrance frames.
- Rounded light project card containing hero media, project information and galleries.
- Fixed circular close control above the project content after reveal.

## States & Behaviors

### Gallery to project
- The reference calls `hideProjects()` before routing; planes move away in four stagger groups (`index % 4 * 30ms`).
- The local gallery performs a compact DOM equivalent over about 560ms: surrounding covers fade/blur and recede, the chosen cover advances slightly, then a light rounded curtain rises to cover the viewport.
- Route navigation occurs near the end of the curtain rise, avoiding a naked hard cut.

### Project reveal
- The incoming page initially has a light fixed curtain matching the outgoing curtain.
- Curtain exits upward over about 700ms with `cubic-bezier(.22, 1, .36, 1)`.
- Project card enters from a small downward offset and subtle scale reduction over about 900ms; opacity never flashes from a fully black blank page.
- Close control fades/scales in after the first reveal beat.
- `prefers-reduced-motion: reduce` disables curtains and route delay.
- The primary video action remains inside the hero but its vertical position is capped by the first visual viewport. On ultra-wide/short windows, where a 16:9 hero is taller than the viewport, the action stays visible above the fold instead of following the hero's off-screen bottom edge.
- The viewport cap leaves a safe inset for subtitles and browser chrome; narrow layouts use a 34px media-bottom inset. Project 02 shifts the desktop action to 73% of the hero width, over its lower-detail right-side background rather than the presenter's face, torso, or hands; mobile remains centered.

### Resilient return to gallery
- The gallery route is prefetched while the detail page is open, so closing does not begin with a cold route request.
- The fixed close control is a real link to the gallery route, so it still works if a visitor taps before React hydration has completed on a slow phone. Once hydrated, close and `back to home` share one guarded return action. Repeated taps are ignored while navigation is in progress, preventing duplicate history entries and stuck-looking transitions on touch devices.
- A dark full-viewport return layer appears immediately and keeps the interface in a clear `返回作品集` state while the route resolves.
- Client navigation uses `replace` to return to the originating gallery mode. If it has not completed after 2.8 seconds, a same-window hard navigation provides a recovery path instead of leaving the visitor on an inert detail page.
- The mobile close target remains at least 48px and uses touch manipulation semantics.

### Project 02 loading
- Project 02 uses the web preview `public/portfolio/project-02/video-preview-web.m4v`: 640×360 (the same 16:9 presentation), fast-start metadata, and approximately 3.5 MB instead of the 9.5 MB master preview.
- Its hero video begins loading with the other hero media instead of waiting for an idle callback; the image-heavy lower galleries remain deferred/contained.

### Image-heavy styleframes
- Project 02 resolves lightweight styleframes from `/styleframes/preview/`.
- Project 03 resolves its lightweight styleframes from the existing `/styleframes/thumbs/` directory. The full-resolution `/styleframes/` paths remain the lightbox sources.

## Responsive Behavior
- Desktop and mobile use the same full-viewport curtain.
- Mobile reduces the curtain corner radius and project-card travel distance.

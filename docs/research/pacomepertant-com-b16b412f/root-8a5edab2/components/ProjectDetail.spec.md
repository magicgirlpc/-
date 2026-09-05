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

## Responsive Behavior
- Desktop and mobile use the same full-viewport curtain.
- Mobile reduces the curtain corner radius and project-card travel distance.

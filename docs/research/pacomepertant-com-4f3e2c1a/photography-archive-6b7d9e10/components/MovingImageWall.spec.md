# MovingImageWall Specification

## Overview

- Target route: `/photography`
- Target implementation: `app/CategoryPage.tsx` + `app/DriftWall.jsx`
- Interaction model: time-driven + pointer-driven + hover-driven + click-driven
- Visual direction: full-screen black stage, subtle grid, floating image tiles, large negative space

## DOM Structure

- `main.moving-wall-page`
  - `div.moving-wall-grid`
  - `div.moving-wall-stage`
    - `DriftWall`
  - `div.moving-wall-header`
    - home mark
    - mode label
    - contact/menu link
  - `div.moving-wall-footer`

## Key values

- Stage: `100svh`, `overflow: hidden`, background `#080909`
- Grid: 45px square lines with low opacity
- Wall: 5 columns, 292px × 188px tiles, 18px gap, 14px radius
- Plane: perspective tilt around `rotateX(8deg) rotateY(-7deg)`, depth `-120px`
- Motion speed: 30px/s base with per-column variance
- Hover lift: 50px on Z axis
- Header: fixed overlay, 28px desktop inset, 16px mobile inset
- Footer: fixed overlay, mono uppercase labels, orange project count

## Accessibility and fallback

- Every tile has an accessible project title and a real link.
- Reduced-motion preference disables continuous movement.
- Mobile reduces tile scale and control spacing while preserving the full-screen wall.

# ProjectDetail component spec

## Inputs

- `project`: title, slug, year, cover image, description, Mux playback id, optional Behance URL, and styleframe URLs.
- `nextProject`: next item in the existing project order.

## Structure

- `.pp-project-page`
- `.pp-project-card`
- `.pp-project-close`
- `.pp-project-video-wrap` / `.pp-project-video`
- `.pp-project-info` / `__title` / `__description`
- `.pp-project-styleframes` / `__frame`
- `.pp-project-next` / `__image-wrap` / `__image` / `__tag` / `__title`

## Visual contract

- White detail card over black, 16px desktop radius.
- Hero occupies nearly a viewport height on desktop and 60vh on mobile.
- Info desktop title is 56px/500; description is 18px/500 at 1.3 line-height.
- Styleframes are five-column width, alternating left/right; mobile is full width.
- Next project is a sticky-feeling, centered, full-height dark composition with 16:9 image.

## Interaction contract

- Same-tab internal route navigation.
- Video fallback poster remains visible when playback fails.
- Scroll reveals use `IntersectionObserver`; no animation under reduced motion.
- No automatic navigation based on scroll distance.

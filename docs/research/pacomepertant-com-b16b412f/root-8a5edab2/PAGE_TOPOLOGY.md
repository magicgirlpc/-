# Page topology

1. **Entry loader** — fixed full-viewport black layer, time-driven reveal, then click-driven sound choice. Exits downward with a spring/ease transition.
2. **Backdrop** — fixed black WebGL-like experience with a soft monochrome paper/noise vignette.
3. **Spiral gallery** — default full-viewport project browser. Wheel, pointer drag, keyboard and time-based inertia move a cylindrical/helix arrangement of nine real project thumbnails.
4. **List gallery** — click-selected alternate view. Vertically scrollable centered titles; hovered titles dim siblings and spawn/follow the corresponding project image.
5. **Persistent chrome** — fixed logo top-left, spiral/list switch top-center, morphing menu top-right, showreel card bottom-left and sound toggle bottom-right.
6. **Menu drawer** — click-driven white rounded drawer, anchored top-right, with spring dimensions, large Works/About/Contact links and social/footer controls.

All homepage layers occupy the viewport and are composed with fixed/absolute positioning. The reference uses Lenis; the clone reproduces the smooth inertial feel locally without adding a remote runtime dependency.


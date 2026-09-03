"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

import type { PacomeProject } from "./data";

type SpiralGalleryProps = {
  projects: PacomeProject[];
  active: boolean;
};

type SpiralStyle = CSSProperties & Record<`--pp-${string}`, string | number>;
type DetailPhase = "hidden" | "entering" | "visible" | "exiting";

const ANGLE_STEP = Math.PI * 0.34;
const EASING = 0.1;
const MIN_WHEEL_SPEED = 0.002;

function wrappedDifference(index: number, position: number, count: number) {
  if (count === 0) return 0;

  return ((index - position + count / 2) % count + count) % count - count / 2;
}

function initialStyle(index: number, count: number): SpiralStyle {
  const difference = wrappedDifference(index, 0, count);
  const angle = difference * ANGLE_STEP;
  const depth = (Math.cos(angle) + 1) / 2;
  const distance = Math.abs(difference);

  return {
    "--pp-x": `${(Math.sin(angle) * 400).toFixed(2)}px`,
    "--pp-y": `${(difference * 84).toFixed(2)}px`,
    "--pp-scale": Math.max(0.5, 0.53 + depth * 0.49 - distance * 0.012).toFixed(3),
    "--pp-opacity": Math.max(0.06, (1 - distance * 0.13) * (0.28 + depth * 0.72)).toFixed(3),
    "--pp-blur": `${((1 - depth) * 5.5 + Math.min(distance * 0.2, 1.5)).toFixed(2)}px`,
    "--pp-rotate": `${(-Math.sin(angle) * 4.5).toFixed(2)}deg`,
    "--pp-z": String(Math.round(depth * 1000 - distance * 10)),
  };
}

export function SpiralGallery({ projects, active }: SpiralGalleryProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const positionRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const targetWheelDeltaRef = useRef(0);
  const wheelDirectionRef = useRef(1);
  const suppressClickRef = useRef(false);
  const pointerProjectRef = useRef<PacomeProject | null>(null);
  const focusProjectRef = useRef<PacomeProject | null>(null);
  const keyboardInputRef = useRef(false);
  const detailPhaseRef = useRef<DetailPhase>("hidden");
  const detailSequenceRef = useRef(0);
  const detailExitTimerRef = useRef<number | null>(null);
  const detailEntryFrameRef = useRef<number | null>(null);
  const inactiveClearFrameRef = useRef<number | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [detailProject, setDetailProject] = useState<PacomeProject | null>(null);
  const [detailPhase, setDetailPhase] = useState<DetailPhase>("hidden");

  const updateDetailPhase = (phase: DetailPhase) => {
    detailPhaseRef.current = phase;
    setDetailPhase(phase);
  };

  const cancelDetailExit = () => {
    if (detailExitTimerRef.current !== null) {
      window.clearTimeout(detailExitTimerRef.current);
      detailExitTimerRef.current = null;
    }
  };

  const cancelDetailEntry = () => {
    if (detailEntryFrameRef.current !== null) {
      window.cancelAnimationFrame(detailEntryFrameRef.current);
      detailEntryFrameRef.current = null;
    }
  };

  const showDetail = (project: PacomeProject) => {
    detailSequenceRef.current += 1;
    cancelDetailExit();
    setPreviewSlug(project.slug);
    setDetailProject(project);

    if (detailPhaseRef.current === "hidden") {
      updateDetailPhase("entering");
      cancelDetailEntry();
      detailEntryFrameRef.current = window.requestAnimationFrame(() => {
        detailEntryFrameRef.current = window.requestAnimationFrame(() => {
          detailEntryFrameRef.current = null;
          updateDetailPhase("visible");
        });
      });
    } else {
      cancelDetailEntry();
      updateDetailPhase("visible");
    }
  };

  const hideDetail = () => {
    setPreviewSlug(null);
    cancelDetailEntry();
    cancelDetailExit();

    if (detailPhaseRef.current === "hidden") return;

    const sequence = ++detailSequenceRef.current;
    updateDetailPhase("exiting");
    detailExitTimerRef.current = window.setTimeout(() => {
      if (detailSequenceRef.current !== sequence) return;
      detailExitTimerRef.current = null;
      updateDetailPhase("hidden");
      setDetailProject(null);
    }, 250);
  };

  const syncDetail = () => {
    const nextProject = pointerProjectRef.current ?? focusProjectRef.current;
    if (nextProject) showDetail(nextProject);
    else hideDetail();
  };

  useEffect(() => {
    if (active) return;

    pointerProjectRef.current = null;
    focusProjectRef.current = null;
    const sequence = ++detailSequenceRef.current;
    if (detailExitTimerRef.current !== null) window.clearTimeout(detailExitTimerRef.current);
    if (detailEntryFrameRef.current !== null) window.cancelAnimationFrame(detailEntryFrameRef.current);
    detailExitTimerRef.current = null;
    detailEntryFrameRef.current = null;
    detailPhaseRef.current = "hidden";
    inactiveClearFrameRef.current = window.requestAnimationFrame(() => {
      inactiveClearFrameRef.current = null;
      if (detailSequenceRef.current !== sequence) return;
      setPreviewSlug(null);
      setDetailProject(null);
      setDetailPhase("hidden");
    });
  }, [active]);

  useEffect(() => () => {
    if (detailExitTimerRef.current !== null) window.clearTimeout(detailExitTimerRef.current);
    if (detailEntryFrameRef.current !== null) window.cancelAnimationFrame(detailEntryFrameRef.current);
    if (inactiveClearFrameRef.current !== null) window.cancelAnimationFrame(inactiveClearFrameRef.current);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const count = projects.length;

    if (!scene || count === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let animationFrame = 0;
    let dragging = false;
    let pointerId = -1;
    let dragStartY = 0;
    let dragStartPosition = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let pointerVelocity = 0;
    let dragDistance = 180;

    const paint = (position: number) => {
      window.sessionStorage.setItem("pp-spiral-position", String(position));
      const mobile = window.innerWidth <= 700;
      const radius = mobile
        ? Math.min(210, Math.max(140, window.innerWidth * 0.44))
        : Math.min(500, Math.max(300, window.innerWidth * 0.28));
      const verticalSpacing = mobile ? 58 : 84;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const difference = wrappedDifference(index, position, count);
        const distance = Math.abs(difference);
        const angle = difference * ANGLE_STEP;
        const depth = (Math.cos(angle) + 1) / 2;
        const scale = Math.max(0.48, 0.53 + depth * 0.49 - distance * 0.012);
        const opacity = Math.max(0.055, (1 - distance * 0.13) * (0.28 + depth * 0.72));
        const blur = (1 - depth) * (mobile ? 4 : 5.5) + Math.min(distance * 0.2, 1.5);

        card.style.setProperty("--pp-x", `${(Math.sin(angle) * radius).toFixed(2)}px`);
        card.style.setProperty("--pp-y", `${(difference * verticalSpacing).toFixed(2)}px`);
        card.style.setProperty("--pp-scale", scale.toFixed(3));
        card.style.setProperty("--pp-opacity", opacity.toFixed(3));
        card.style.setProperty("--pp-blur", `${blur.toFixed(2)}px`);
        card.style.setProperty("--pp-rotate", `${(-Math.sin(angle) * 4.5).toFixed(2)}deg`);
        card.style.setProperty("--pp-z", String(Math.round(depth * 1000 - distance * 10)));
        const isCurrent = distance < 0.5;
        const image = imageRefs.current[index];
        // The spiral mounts every card, but only the cards near the current
        // position are visible enough to justify decoding their cover image.
        // Hydrating them here avoids an initial burst of 22 image decodes.
        if (image && distance <= 3.5 && !image.getAttribute("src")) {
          const source = image.dataset.src;
          if (source) image.src = source;
        }
        card.classList.toggle("pp-spiral__card--current", isCurrent);
        if (isCurrent) card.setAttribute("aria-current", "true");
        else card.removeAttribute("aria-current");
      });
    };

    const stopAnimation = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const animate = () => {
      wheelDeltaRef.current +=
        (targetWheelDeltaRef.current - wheelDeltaRef.current) * EASING;
      positionRef.current += wheelDeltaRef.current;
      if (Math.abs(targetWheelDeltaRef.current) < MIN_WHEEL_SPEED) {
        targetWheelDeltaRef.current = wheelDirectionRef.current * MIN_WHEEL_SPEED;
      }
      targetWheelDeltaRef.current *= 0.9;

      paint(positionRef.current);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrame && active && !reduceMotion) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!active || !scene.isConnected) return;

      event.preventDefault();
      const modeScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
      const pixels = event.deltaY * modeScale;
      const direction = Math.sign(pixels);
      if (direction === 0) return;
      wheelDirectionRef.current = direction;

      if (reduceMotion) {
        positionRef.current = Math.round(positionRef.current) + direction;
        wheelDeltaRef.current = 0;
        targetWheelDeltaRef.current = 0;
        paint(positionRef.current);
      } else {
        targetWheelDeltaRef.current = Math.max(
          -2,
          Math.min(2, targetWheelDeltaRef.current + pixels * 0.00015),
        );
        startAnimation();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      keyboardInputRef.current = true;
      if (!active || event.altKey || event.ctrlKey || event.metaKey) return;

      const backwards = event.key === "ArrowUp" || event.key === "ArrowLeft";
      const forwards = event.key === "ArrowDown" || event.key === "ArrowRight";
      if (!backwards && !forwards) return;

      event.preventDefault();
      const direction = backwards ? -1 : 1;
      wheelDirectionRef.current = direction;
      positionRef.current = Math.round(positionRef.current) + direction;

      if (reduceMotion) {
        wheelDeltaRef.current = 0;
        targetWheelDeltaRef.current = 0;
        paint(positionRef.current);
      } else {
        targetWheelDeltaRef.current = direction * MIN_WHEEL_SPEED;
        startAnimation();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!active || event.button !== 0 || !event.isPrimary) return;

      keyboardInputRef.current = false;
      dragging = true;
      pointerId = event.pointerId;
      dragStartY = event.clientY;
      lastPointerY = event.clientY;
      lastPointerTime = performance.now();
      dragStartPosition = positionRef.current;
      pointerVelocity = 0;
      dragDistance = window.innerWidth <= 700 ? 132 : 180;
      suppressClickRef.current = false;
      scene.classList.add("pp-spiral--dragging");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;

      const now = performance.now();
      const elapsed = Math.max(1, now - lastPointerTime);
      const movement = lastPointerY - event.clientY;
      pointerVelocity = movement / dragDistance / elapsed;
      lastPointerY = event.clientY;
      lastPointerTime = now;

      const totalMovement = dragStartY - event.clientY;
      if (Math.abs(totalMovement) > 5) {
        suppressClickRef.current = true;
        if (scene.setPointerCapture && !scene.hasPointerCapture?.(pointerId)) {
          scene.setPointerCapture(pointerId);
        }
      }
      const projectMovement = movement / dragDistance;
      const direction = Math.sign(projectMovement);

      if (direction !== 0) wheelDirectionRef.current = direction;

      if (reduceMotion) {
        positionRef.current = Math.round(dragStartPosition + totalMovement / dragDistance);
        wheelDeltaRef.current = 0;
        targetWheelDeltaRef.current = 0;
      } else {
        positionRef.current += projectMovement;
        const frameVelocity = projectMovement * (16.67 / elapsed);
        targetWheelDeltaRef.current = Math.max(-2, Math.min(2, frameVelocity));
      }
      paint(positionRef.current);
    };

    const finishPointer = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;

      dragging = false;
      scene.classList.remove("pp-spiral--dragging");
      if (scene.hasPointerCapture?.(pointerId)) scene.releasePointerCapture(pointerId);

      if (reduceMotion) {
        positionRef.current = Math.round(positionRef.current);
        wheelDeltaRef.current = 0;
        targetWheelDeltaRef.current = 0;
        paint(positionRef.current);
      } else {
        const releaseVelocity = Math.max(-2, Math.min(2, pointerVelocity * 16.67));
        if (Math.abs(releaseVelocity) >= MIN_WHEEL_SPEED) {
          targetWheelDeltaRef.current = releaseVelocity;
          wheelDirectionRef.current = Math.sign(releaseVelocity);
        } else {
          targetWheelDeltaRef.current = wheelDirectionRef.current * MIN_WHEEL_SPEED;
        }
        startAnimation();
      }
    };

    const onResize = () => paint(positionRef.current);
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        stopAnimation();
        positionRef.current = Math.round(positionRef.current);
        wheelDeltaRef.current = 0;
        targetWheelDeltaRef.current = 0;
        paint(positionRef.current);
      } else {
        startAnimation();
      }
    };

    const savedPosition = Number(window.sessionStorage.getItem("pp-spiral-position"));
    if (Number.isFinite(savedPosition)) positionRef.current = savedPosition;
    paint(positionRef.current);

    if (active) {
      scene.addEventListener("wheel", onWheel, { passive: false });
      scene.addEventListener("pointerdown", onPointerDown);
      scene.addEventListener("pointermove", onPointerMove);
      scene.addEventListener("pointerup", finishPointer);
      scene.addEventListener("pointercancel", finishPointer);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onResize);
      motionQuery.addEventListener("change", onMotionChange);
      startAnimation();
    }

    return () => {
      stopAnimation();
      scene.classList.remove("pp-spiral--dragging");
      if (pointerId >= 0 && scene.hasPointerCapture?.(pointerId)) {
        scene.releasePointerCapture(pointerId);
      }
      scene.removeEventListener("wheel", onWheel);
      scene.removeEventListener("pointerdown", onPointerDown);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerup", finishPointer);
      scene.removeEventListener("pointercancel", finishPointer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [active, projects.length]);

  const preventDraggedClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!active || suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
    }
  };

  return (
    <section
      ref={sceneRef}
      className={`pp-spiral${active ? "" : " pp-spiral--hidden"}`}
      aria-label="Selected projects"
      aria-hidden={!active}
      onPointerDownCapture={(event) => {
        keyboardInputRef.current = false;
        if (event.pointerType === "mouse") return;
        pointerProjectRef.current = null;
        focusProjectRef.current = null;
        syncDetail();
      }}
    >
      <div className="pp-spiral__stage">
        {projects.map((project, index) => (
          <a
            key={project.slug}
            ref={(card) => {
              cardRefs.current[index] = card;
            }}
            className={`pp-spiral__card${index === 0 ? " pp-spiral__card--current" : ""}${active && previewSlug === project.slug ? " pp-spiral__card--previewed" : ""}`}
            href={`${project.href}?from=spiral`}
            tabIndex={active ? 0 : -1}
            aria-label={`${project.title}, ${project.year} — open project`}
            aria-current={index === 0 ? "true" : undefined}
            style={initialStyle(index, projects.length)}
            onClick={preventDraggedClick}
            onDragStart={(event) => event.preventDefault()}
            onPointerEnter={(event) => {
              if (!active || event.pointerType !== "mouse") return;
              keyboardInputRef.current = false;
              pointerProjectRef.current = project;
              syncDetail();
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse" || pointerProjectRef.current?.slug !== project.slug) return;
              pointerProjectRef.current = null;
              syncDetail();
            }}
            onFocus={() => {
              if (!active || !keyboardInputRef.current) return;
              focusProjectRef.current = project;
              syncDetail();
            }}
            onBlur={() => {
              if (focusProjectRef.current?.slug !== project.slug) return;
              focusProjectRef.current = null;
              syncDetail();
            }}
          >
            <img
              ref={(image) => {
                imageRefs.current[index] = image;
              }}
              className="pp-spiral__image"
              data-src={project.image}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <span className="pp-spiral__meta">
              <span className="pp-spiral__title">{project.title}</span>
              <span className="pp-spiral__year">{project.year}</span>
            </span>
          </a>
        ))}
      </div>
      {active && detailProject && detailPhase !== "hidden" ? (
        <div
          className={`pp-spiral__detail pp-spiral__detail--${detailPhase}`}
          aria-hidden="true"
        >
          <img
            className="pp-spiral__detail-image"
            src={detailProject.image}
            alt=""
            draggable={false}
          />
          <span className="pp-spiral__detail-title">{detailProject.title}</span>
        </div>
      ) : null}
      <div className="pp-spiral__vignette" aria-hidden="true" />
      <div className="pp-spiral__grain" aria-hidden="true" />
    </section>
  );
}

export default SpiralGallery;

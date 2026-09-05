"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import type { PacomeProject } from "./data";
import { playUiSound, setAmbientContext } from "./sound";

type SpiralGalleryProps = {
  projects: PacomeProject[];
  active: boolean;
};

type SpiralStyle = CSSProperties & Record<`--pp-${string}`, string | number>;
type DetailPhase = "hidden" | "entering" | "visible" | "exiting";

const ANGLE_STEP = 0.85;
const EASING = 0.1;
const MIN_WHEEL_SPEED = 0.002;
const IDLE_PROJECTS_PER_SECOND = 0.108;
const FRAME_INTERVAL = 1000 / 60;
const DISTANCE_FADE = 0.09;
const MIN_VISIBLE_OPACITY = 0.045;

function spiralOpacity(distance: number, depth: number) {
  return Math.max(
    MIN_VISIBLE_OPACITY,
    (1 - distance * DISTANCE_FADE) * (0.16 + depth * 0.84),
  );
}

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
    "--pp-y": `${(difference * 72).toFixed(2)}px`,
    "--pp-scale": Math.max(0.46, 0.53 + depth * 0.49 - distance * 0.009).toFixed(3),
    "--pp-opacity": spiralOpacity(distance, depth).toFixed(3),
    "--pp-blur": `${((1 - depth) * 6.2 + Math.min(Math.max(0, distance - 1.6) * 0.48, 3.2)).toFixed(2)}px`,
    "--pp-rotate": `${(-Math.sin(angle) * 4.5).toFixed(2)}deg`,
    "--pp-z": String(Math.round(depth * 1000 - distance * 10)),
  };
}

export function SpiralGallery({ projects, active }: SpiralGalleryProps) {
  const router = useRouter();
  const sceneRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const positionRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const targetWheelDeltaRef = useRef(0);
  const wheelDirectionRef = useRef(1);
  const suppressClickRef = useRef(false);
  const openingRef = useRef(false);
  const openingTimerRef = useRef<number | null>(null);
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
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);

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
    if (openingTimerRef.current !== null) window.clearTimeout(openingTimerRef.current);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const count = projects.length;

    if (!scene || count === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let animationFrame = 0;
    let lastAnimationTime = performance.now();
    let dragging = false;
    let pointerId = -1;
    let dragStartY = 0;
    let dragStartPosition = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let pointerVelocity = 0;
    let dragDistance = 180;
    const queuedImages = new WeakSet<HTMLImageElement>();
    const imageLoadTimers = new Set<number>();

    const loadImage = (image: HTMLImageElement, distance: number) => {
      if (image.getAttribute("src") || queuedImages.has(image)) return;
      const source = image.dataset.src;
      if (!source) return;
      queuedImages.add(image);

      const applySource = () => {
        if (!image.isConnected || image.getAttribute("src")) return;
        image.fetchPriority = distance < 0.5 ? "high" : "low";
        image.src = source;
      };

      if (distance <= 3) {
        applySource();
        return;
      }

      const timer = window.setTimeout(() => {
        imageLoadTimers.delete(timer);
        applySource();
      }, Math.min(720, Math.round((distance - 3) * 75)));
      imageLoadTimers.add(timer);
    };

    const paint = (position: number) => {
      const mobile = window.innerWidth <= 700;
      const radius = mobile
        ? Math.min(210, Math.max(140, window.innerWidth * 0.44))
        : Math.min(500, Math.max(300, window.innerWidth * 0.28));
      const verticalSpacing = mobile ? 52 : 72;
      const cardWidth = mobile
        ? Math.min(280, Math.max(220, window.innerWidth * 0.68))
        : Math.min(440, Math.max(330, window.innerWidth * 0.29));
      const visibleImageDistance = Math.min(
        count / 2,
        Math.ceil((window.innerHeight / 2 + cardWidth * 0.36) / verticalSpacing) + 1,
      );

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const difference = wrappedDifference(index, position, count);
        const distance = Math.abs(difference);
        const angle = difference * ANGLE_STEP;
        const depth = (Math.cos(angle) + 1) / 2;
        const scale = Math.max(0.46, 0.53 + depth * 0.49 - distance * 0.009);
        const opacity = spiralOpacity(distance, depth);
        const depthBlur = (1 - depth) * (mobile ? 4.4 : 6.2);
        const distanceBlur = Math.min(
          Math.max(0, distance - 1.6) * (mobile ? 0.32 : 0.48),
          mobile ? 2.4 : 3.2,
        );
        const blur = depthBlur + distanceBlur;

        card.style.setProperty("--pp-x", `${(Math.sin(angle) * radius).toFixed(2)}px`);
        card.style.setProperty("--pp-y", `${(difference * verticalSpacing).toFixed(2)}px`);
        card.style.setProperty("--pp-scale", scale.toFixed(3));
        card.style.setProperty("--pp-opacity", opacity.toFixed(3));
        card.style.setProperty("--pp-blur", `${blur.toFixed(2)}px`);
        card.style.setProperty("--pp-rotate", `${(-Math.sin(angle) * 4.5).toFixed(2)}deg`);
        card.style.setProperty("--pp-z", String(Math.round(depth * 1000 - distance * 10)));
        const isCurrent = distance < 0.5;
        const image = imageRefs.current[index];
        // Fill the visible helix without making all 22 requests compete at
        // first paint: center covers load now, outer visible covers stagger.
        if (image && distance <= visibleImageDistance) loadImage(image, distance);
        card.classList.toggle("pp-spiral__card--current", isCurrent);
        if (isCurrent) card.setAttribute("aria-current", "true");
        else card.removeAttribute("aria-current");
      });
    };

    const stopAnimation = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    let persistTimer: number | null = null;
    const schedulePersist = () => {
      if (persistTimer !== null) window.clearTimeout(persistTimer);
      persistTimer = window.setTimeout(() => {
        persistTimer = null;
        window.sessionStorage.setItem("pp-spiral-position", String(positionRef.current));
      }, 140);
    };

    const animate = (now: number) => {
      if (openingRef.current) {
        animationFrame = 0;
        return;
      }
      if (dragging) {
        lastAnimationTime = now;
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }
      const elapsed = now - lastAnimationTime;
      if (elapsed < FRAME_INTERVAL * 0.85) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }
      lastAnimationTime = now;
      const frameScale = Math.min(3, elapsed / FRAME_INTERVAL);
      const damping = 1 - Math.pow(1 - EASING, frameScale);
      wheelDeltaRef.current +=
        (targetWheelDeltaRef.current - wheelDeltaRef.current) * damping;
      targetWheelDeltaRef.current *= Math.pow(0.9, frameScale);

      if (
        Math.abs(targetWheelDeltaRef.current) >= MIN_WHEEL_SPEED ||
        Math.abs(wheelDeltaRef.current) >= MIN_WHEEL_SPEED
      ) {
        positionRef.current += wheelDeltaRef.current * frameScale;
      } else {
        targetWheelDeltaRef.current = 0;
        wheelDeltaRef.current = 0;
        positionRef.current += wheelDirectionRef.current * IDLE_PROJECTS_PER_SECOND * (elapsed / 1000);
      }

      paint(positionRef.current);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrame && active && !reduceMotion && !openingRef.current) {
        lastAnimationTime = performance.now();
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!active || !scene.isConnected || openingRef.current) return;

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
        const precisionTrackpad = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL
          && Math.abs(pixels) > 0
          && Math.abs(pixels) < 60;
        const inputGain = precisionTrackpad ? 0.00042 : 0.00015;
        let nextTarget = targetWheelDeltaRef.current + pixels * inputGain;
        if (precisionTrackpad && Math.abs(pixels) >= 0.35 && Math.abs(nextTarget) < 0.006) {
          nextTarget = direction * 0.006;
        }
        targetWheelDeltaRef.current = Math.max(
          -2,
          Math.min(2, nextTarget),
        );
        startAnimation();
      }
      schedulePersist();
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
      schedulePersist();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!active || openingRef.current || event.button !== 0 || !event.isPrimary) return;

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

    const preventNativeDrag = (event: Event) => event.preventDefault();

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
      schedulePersist();
    };

    const onResize = () => paint(positionRef.current);
    const onVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    };
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
      scene.addEventListener("dragstart", preventNativeDrag);
      scene.addEventListener("selectstart", preventNativeDrag);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibilityChange);
      motionQuery.addEventListener("change", onMotionChange);
      startAnimation();
    }

    return () => {
      stopAnimation();
      if (active) window.sessionStorage.setItem("pp-spiral-position", String(positionRef.current));
      if (persistTimer !== null) window.clearTimeout(persistTimer);
      imageLoadTimers.forEach((timer) => window.clearTimeout(timer));
      imageLoadTimers.clear();
      scene.classList.remove("pp-spiral--dragging");
      if (pointerId >= 0 && scene.hasPointerCapture?.(pointerId)) {
        scene.releasePointerCapture(pointerId);
      }
      scene.removeEventListener("wheel", onWheel);
      scene.removeEventListener("pointerdown", onPointerDown);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerup", finishPointer);
      scene.removeEventListener("pointercancel", finishPointer);
      scene.removeEventListener("dragstart", preventNativeDrag);
      scene.removeEventListener("selectstart", preventNativeDrag);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [active, projects.length]);

  const openProject = (event: MouseEvent<HTMLAnchorElement>, slug: string, href: string) => {
    if (!active || suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      playUiSound("open");
      return;
    }
    event.preventDefault();
    if (openingRef.current) return;
    window.sessionStorage.setItem("pp-spiral-position", String(positionRef.current));
    playUiSound("open");
    setAmbientContext("detail");
    hideDetail();
    openingRef.current = true;
    setOpeningSlug(slug);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`${href}?from=spiral`);
      return;
    }

    openingTimerRef.current = window.setTimeout(() => {
      openingTimerRef.current = null;
      router.push(`${href}?from=spiral`);
    }, 560);
  };

  return (
    <section
      ref={sceneRef}
      className={`pp-spiral${active ? "" : " pp-spiral--hidden"}${openingSlug ? " pp-spiral--opening" : ""}`}
      aria-label="Selected projects"
      aria-hidden={!active}
      onPointerDownCapture={(event) => {
        keyboardInputRef.current = false;
        if (event.pointerType === "mouse") return;
        pointerProjectRef.current = null;
        focusProjectRef.current = null;
        syncDetail();
      }}
      onDragStartCapture={(event) => event.preventDefault()}
    >
      <div className="pp-spiral__stage">
        {projects.map((project, index) => (
          <a
            key={project.slug}
            ref={(card) => {
              cardRefs.current[index] = card;
            }}
            className={`pp-spiral__card${index === 0 ? " pp-spiral__card--current" : ""}${active && previewSlug === project.slug ? " pp-spiral__card--previewed" : ""}${openingSlug === project.slug ? " pp-spiral__card--opening-target" : openingSlug ? " pp-spiral__card--opening-away" : ""}`}
            href={`${project.href}?from=spiral`}
            tabIndex={active ? 0 : -1}
            aria-label={`${project.title}, ${project.year} — open project`}
            aria-current={index === 0 ? "true" : undefined}
            draggable={false}
            style={initialStyle(index, projects.length)}
            onClick={(event) => openProject(event, project.slug, project.href)}
            onDragStart={(event) => event.preventDefault()}
            onPointerEnter={(event) => {
              if (!active || event.pointerType !== "mouse") return;
              playUiSound("hover");
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
              data-src={project.previewImage ?? project.image}
              alt=""
              width={960}
              height={540}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
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
            src={detailProject.previewImage ?? detailProject.image}
            alt=""
            width={960}
            height={540}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <span className="pp-spiral__detail-title">{detailProject.title}</span>
        </div>
      ) : null}
      {openingSlug ? <div className="pp-spiral__route-curtain" aria-hidden="true" /> : null}
      <div className="pp-spiral__vignette" aria-hidden="true" />
      <div className="pp-spiral__grain" aria-hidden="true" />
    </section>
  );
}

export default SpiralGallery;

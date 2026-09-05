"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { PacomeProject } from "./data";
import { playUiSound, setAmbientContext } from "./sound";

type ListGalleryProps = {
  projects: PacomeProject[];
  active: boolean;
};

type Point = {
  x: number;
  y: number;
};

type ListStyle = CSSProperties & {
  "--pp-list-exit-duration": string;
};

type ListProjectStyle = CSSProperties & {
  "--pp-list-index": number;
};

const FOLLOW_DAMPING = 0.16;
const FOLLOW_THRESHOLD = 0.1;

export default function ListGallery({ projects, active }: ListGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const currentPointRef = useRef<Point>({ x: 0, y: 0 });
  const targetPointRef = useRef<Point>({ x: 0, y: 0 });
  const previewStartedRef = useRef(false);
  const inactiveClearFrameRef = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stopFollowingPointer = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const writePointerPosition = useCallback((point: Point) => {
    previewRef.current?.style.setProperty("--pp-pointer-x", `${point.x}px`);
    previewRef.current?.style.setProperty("--pp-pointer-y", `${point.y}px`);
  }, []);

  const startFollowingPointer = useCallback(() => {
    if (animationFrameRef.current !== null) return;

    const follow = () => {
      const current = currentPointRef.current;
      const target = targetPointRef.current;
      const next = {
        x: current.x + (target.x - current.x) * FOLLOW_DAMPING,
        y: current.y + (target.y - current.y) * FOLLOW_DAMPING,
      };

      currentPointRef.current = next;
      writePointerPosition(next);

      if (
        Math.abs(target.x - next.x) > FOLLOW_THRESHOLD ||
        Math.abs(target.y - next.y) > FOLLOW_THRESHOLD
      ) {
        animationFrameRef.current = requestAnimationFrame(follow);
      } else {
        currentPointRef.current = target;
        writePointerPosition(target);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(follow);
  }, [writePointerPosition]);

  const showPreview = useCallback(
    (index: number, clientX: number, clientY: number, pointerType: string) => {
      if (pointerType === "touch" || !active) return;

      const target = { x: clientX, y: clientY };
      targetPointRef.current = target;

      if (!previewStartedRef.current) {
        previewStartedRef.current = true;
        currentPointRef.current = target;
        writePointerPosition(target);
      }

      setHoveredIndex(index);
      startFollowingPointer();
    },
    [active, startFollowingPointer, writePointerPosition],
  );

  const hidePreview = useCallback((pointerType?: string) => {
    if (pointerType === "touch") return;
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    if (!active) {
      previewStartedRef.current = false;
      stopFollowingPointer();
      inactiveClearFrameRef.current = requestAnimationFrame(() => {
        inactiveClearFrameRef.current = null;
        setHoveredIndex(null);
      });
    }

    return () => {
      if (inactiveClearFrameRef.current !== null) {
        cancelAnimationFrame(inactiveClearFrameRef.current);
        inactiveClearFrameRef.current = null;
      }
    };
  }, [active, stopFollowingPointer]);

  useEffect(() => stopFollowingPointer, [stopFollowingPointer]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !active) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentScroll = scrollElement.scrollTop;
    let targetScroll = currentScroll;
    let lastFrameTime = performance.now();

    const maximumScroll = () => Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);

    const stopSmoothScroll = () => {
      if (scrollAnimationFrameRef.current === null) return;
      cancelAnimationFrame(scrollAnimationFrameRef.current);
      scrollAnimationFrameRef.current = null;
    };

    const animateScroll = (now: number) => {
      const elapsed = Math.min(48, Math.max(1, now - lastFrameTime));
      lastFrameTime = now;
      const damping = 1 - Math.pow(1 - 0.16, elapsed / 16.667);
      currentScroll += (targetScroll - currentScroll) * damping;

      if (Math.abs(targetScroll - currentScroll) < 0.35) {
        currentScroll = targetScroll;
        scrollElement.scrollTop = currentScroll;
        scrollAnimationFrameRef.current = null;
        return;
      }

      scrollElement.scrollTop = currentScroll;
      scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    const onWheel = (event: WheelEvent) => {
      if (motionQuery.matches || event.ctrlKey) return;

      event.preventDefault();
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 18
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? scrollElement.clientHeight
          : 1;
      const delta = event.deltaY * unit;
      if (delta === 0) return;

      if (scrollAnimationFrameRef.current === null) {
        currentScroll = scrollElement.scrollTop;
        targetScroll = currentScroll;
      }

      targetScroll = Math.min(maximumScroll(), Math.max(0, targetScroll + delta));
      if (scrollAnimationFrameRef.current === null) {
        lastFrameTime = performance.now();
        scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
      }
    };

    const onNativeScroll = () => {
      if (scrollAnimationFrameRef.current !== null) return;
      currentScroll = scrollElement.scrollTop;
      targetScroll = currentScroll;
    };

    scrollElement.addEventListener("wheel", onWheel, { passive: false });
    scrollElement.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      stopSmoothScroll();
      scrollElement.removeEventListener("wheel", onWheel);
      scrollElement.removeEventListener("scroll", onNativeScroll);
    };
  }, [active]);

  const rootClassName = [
    "pp-list",
    active ? "pp-list--active" : "pp-list--hidden",
    active && hoveredIndex !== null ? "pp-list--hovering" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const listStyle: ListStyle = {
    "--pp-list-exit-duration": `${300 + Math.max(0, projects.length - 1) * 50}ms`,
  };

  return (
    <section
      className={rootClassName}
      style={listStyle}
      aria-label="Project list"
      aria-hidden={!active}
      onPointerLeave={(event) => hidePreview(event.pointerType)}
      onPointerCancel={(event) => hidePreview(event.pointerType)}
    >
      <div className="pp-list__scroll" ref={scrollRef}>
        <div className="pp-list__inner">
          {projects.map((project, index) => {
            const hovered = active && hoveredIndex === index;
            const projectStyle: ListProjectStyle = { "--pp-list-index": index };

            return (
              <a
                className={`pp-list__project${hovered ? " pp-list__project--hovered" : ""}`}
                href={`${project.href}?from=list`}
                key={project.slug}
                data-index={index}
                data-project={project.slug}
                data-year={project.year}
                style={projectStyle}
                aria-label={`${project.title} (${project.year})`}
                tabIndex={active ? undefined : -1}
                onClick={() => {
                  playUiSound("open");
                  setAmbientContext("detail");
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") playUiSound("hover");
                  showPreview(index, event.clientX, event.clientY, event.pointerType);
                }}
                onPointerMove={(event) =>
                  showPreview(index, event.clientX, event.clientY, event.pointerType)
                }
                onPointerLeave={(event) => hidePreview(event.pointerType)}
              >
                <h2 className="pp-list__title">{project.title}</h2>
              </a>
            );
          })}
        </div>
      </div>

      <div
        className={`pp-list__preview${active && hoveredIndex !== null ? " pp-list__preview--visible" : ""}`}
        ref={previewRef}
        aria-hidden="true"
      >
        {active && hoveredIndex !== null ? (
          <img
            className="pp-list__preview-image pp-list__preview-image--active"
            src={projects[hoveredIndex].previewImage ?? projects[hoveredIndex].image}
            alt=""
            width={330}
            height={186}
            loading="eager"
            decoding="async"
            draggable={false}
            key={projects[hoveredIndex].slug}
          />
        ) : null}
      </div>
    </section>
  );
}

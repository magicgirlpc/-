"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChromeOverlay from "./ChromeOverlay";
import EntryLoader from "./EntryLoader";
import ListGallery from "./ListGallery";
import SpiralGallery from "./SpiralGallery";
import { pacomeProjects } from "./data";
import { prepareSoundAssets, resumeSoundExperience, setAmbientContext, setSoundEnabled } from "./sound";

export default function PortfolioExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const resume = searchParams.get("resume") === "1";
  const requestedView = searchParams.get("view") === "list" ? "list" : "spiral";
  const initialView = resume ? requestedView : "spiral";
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [view, setView] = useState<"spiral" | "list">(initialView);

  useLayoutEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    const root = document.documentElement;
    const previousScrollRestoration = window.history.scrollRestoration;
    const pendingFrames = new Set<number>();
    const pendingTimers = new Set<number>();
    let resizeObserver: ResizeObserver | undefined;

    window.history.scrollRestoration = "manual";

    const syncViewport = () => {
      const visualHeight = window.visualViewport?.height ?? 0;
      const viewportHeight = window.innerWidth <= 900 && visualHeight > 0
        ? visualHeight
        : Math.max(window.innerHeight, root.clientHeight, visualHeight);
      const value = `${Math.ceil(viewportHeight)}px`;
      root.style.setProperty("--pp-viewport-height", value);
      experience.style.setProperty("--pp-viewport-height", value);
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("pp:viewportchange"));
    };

    const queueFrame = () => {
      const frame = window.requestAnimationFrame(() => {
        pendingFrames.delete(frame);
        syncViewport();
      });
      pendingFrames.add(frame);
    };

    syncViewport();
    queueFrame();
    queueFrame();
    [100, 280, 650, 1200].forEach((delay) => {
      const timer = window.setTimeout(() => {
        pendingTimers.delete(timer);
        syncViewport();
      }, delay);
      pendingTimers.add(timer);
    });

    window.addEventListener("resize", syncViewport);
    window.addEventListener("orientationchange", syncViewport);
    window.addEventListener("pageshow", syncViewport);
    window.visualViewport?.addEventListener("resize", syncViewport);
    resizeObserver = new ResizeObserver(syncViewport);
    resizeObserver.observe(root);

    return () => {
      pendingFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
      window.removeEventListener("pageshow", syncViewport);
      window.visualViewport?.removeEventListener("resize", syncViewport);
      window.history.scrollRestoration = previousScrollRestoration;
      root.style.removeProperty("--pp-viewport-height");
    };
  }, []);

  useEffect(() => {
    prepareSoundAssets();
    setAmbientContext("gallery");
    if (resume) setSoundOn(resumeSoundExperience());
  }, [resume]);

  useEffect(() => {
    if (!resume) return;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "reload") {
      const url = new URL(window.location.href);
      url.searchParams.delete("resume");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      return;
    }
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [resume]);

  return (
    <main className={`pp-experience pp-experience--${view}`} id="works" ref={experienceRef}>
      {entered ? (
        <>
          <SpiralGallery projects={pacomeProjects} active={view === "spiral"} />
          <ListGallery projects={pacomeProjects} active={view === "list"} />
        </>
      ) : null}
      {entered ? (
        <ChromeOverlay
          view={view}
          onViewChange={setView}
          soundOn={soundOn}
          onSoundToggle={() => {
            const next = !soundOn;
            setSoundEnabled(next, true);
            setSoundOn(next);
          }}
        />
      ) : (
        <EntryLoader
          onEnter={(withSound) => {
            setSoundOn(withSound);
            setView("spiral");
            setEntered(true);
          }}
        />
      )}
      <p className="pp-sr-status" aria-live="polite">
        {entered ? `${view} portfolio view${soundOn ? ", sound on" : ", sound off"}` : "Portfolio loading"}
      </p>
    </main>
  );
}

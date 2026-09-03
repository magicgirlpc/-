"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChromeOverlay from "./ChromeOverlay";
import EntryLoader from "./EntryLoader";
import ListGallery from "./ListGallery";
import SpiralGallery from "./SpiralGallery";
import { pacomeProjects } from "./data";

export default function PortfolioExperience() {
  const searchParams = useSearchParams();
  const resume = searchParams.get("resume") === "1";
  const requestedView = searchParams.get("view") === "list" ? "list" : "spiral";
  const initialView = resume ? requestedView : "spiral";
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [view, setView] = useState<"spiral" | "list">(initialView);

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
    <main className={`pp-experience pp-experience--${view}`} id="works">
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
          onSoundToggle={() => setSoundOn((value) => !value)}
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

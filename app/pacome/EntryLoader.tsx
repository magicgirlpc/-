"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

type EntryLoaderProps = {
  onEnter: (soundOn: boolean) => void;
};

const assetRoot = "/sites/pacomepertant-com-b16b412f/root-8a5edab2";

export default function EntryLoader({ onEnter }: EntryLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const lottieHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - started) / 1100) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    let animation: AnimationItem | undefined;

    const revealIntro = () => {
      if (active) setIntroVisible(true);
    };

    const completeAnimation = () => {
      if (active) setAnimationComplete(true);
    };

    const activateFallback = () => {
      if (!active) return;
      animation?.destroy();
      animation = undefined;
      lottieHostRef.current?.replaceChildren();
      setShowFallback(true);
      setIntroVisible(true);
      setAnimationComplete(true);
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      activateFallback();
      return () => {
        active = false;
      };
    }

    const mountAnimation = async () => {
      try {
        const [lottieModule, response] = await Promise.all([
          import("lottie-web"),
          fetch(`${assetRoot}/loader.json`),
        ]);

        if (!response.ok) throw new Error(`Loader animation request failed: ${response.status}`);
        const animationData: unknown = await response.json();
        if (!active || !lottieHostRef.current) return;

        lottieHostRef.current.replaceChildren();
        animation = lottieModule.default.loadAnimation({
          container: lottieHostRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: false,
          },
        });
        animation.addEventListener("DOMLoaded", revealIntro);
        animation.addEventListener("complete", completeAnimation);
        animation.addEventListener("error", activateFallback);
        animation.addEventListener("data_failed", activateFallback);
      } catch {
        activateFallback();
      }
    };

    void mountAnimation();

    return () => {
      active = false;
      animation?.removeEventListener("DOMLoaded", revealIntro);
      animation?.removeEventListener("complete", completeAnimation);
      animation?.removeEventListener("error", activateFallback);
      animation?.removeEventListener("data_failed", activateFallback);
      animation?.destroy();
      animation = undefined;
    };
  }, []);

  const ready = progress === 100 && animationComplete;

  const enter = (soundOn: boolean) => {
    if (leaving || !ready) return;
    setLeaving(true);
    window.setTimeout(() => onEnter(soundOn), 520);
  };

  return (
    <div className={`pp-loader${leaving ? " pp-loader--leaving" : ""}`} aria-label="Portfolio introduction">
      <div className="pp-loader__lottie" ref={lottieHostRef} aria-hidden="true">
        {showFallback ? <span className="pp-loader__fallback" /> : null}
      </div>
      <p className={`pp-loader__text${introVisible ? " pp-loader__text--visible" : ""}`}>
        <span>Video Production</span><span>based in Shanghai</span>
      </p>
      <div className={`pp-loader__actions${ready ? " pp-loader__actions--ready" : ""}`}>
        <button className="pp-pill pp-loader__enter" type="button" disabled={!ready || leaving} onClick={() => enter(true)}>
          <span className="pp-loader__enter-label"><span key={ready ? "ready" : "waiting"}>Enter my portfolio</span></span><i aria-hidden="true" />
        </button>
      </div>
      <a
        className={`pp-loader__silent${ready && !leaving ? " pp-loader__silent--ready" : ""}`}
        href="/contact"
        aria-disabled={!ready || leaving}
        tabIndex={ready && !leaving ? 0 : -1}
      >
        1579713724@qq.com
      </a>
    </div>
  );
}

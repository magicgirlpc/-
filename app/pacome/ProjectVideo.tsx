"use client";

import { useEffect, useRef, useState } from "react";

type HlsInstance = {
  loadSource: (source: string) => void;
  attachMedia: (video: HTMLVideoElement) => void;
  on: (event: string, callback: () => void) => void;
  destroy: () => void;
};

type HlsConstructor = {
  new (config?: Record<string, unknown>): HlsInstance;
  isSupported: () => boolean;
  Events: { MANIFEST_PARSED: string };
};

const HLS_SCRIPT = "/vendor-hls.min.js";

function getHls() {
  return (window as typeof window & { Hls?: HlsConstructor }).Hls;
}

export default function ProjectVideo({ playbackId, sourceUrl, poster, title, controls = false, muted = true, loop = true, autoPlay = true, lazy = false, defer = false }: {
  playbackId: string;
  sourceUrl?: string;
  poster: string;
  title: string;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  lazy?: boolean;
  defer?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy && !defer);

  useEffect(() => {
    if (!defer || shouldLoad) return;

    let cancelled = false;
    const load = () => {
      if (!cancelled) setShouldLoad(true);
    };
    const idle = "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 900 })
      : window.setTimeout(load, 700);

    return () => {
      cancelled = true;
      if (typeof idle === "number") {
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
    };
  }, [defer, shouldLoad]);

  useEffect(() => {
    if (!lazy || shouldLoad) return;
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px", threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [lazy, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!shouldLoad || !video || (!playbackId && !sourceUrl)) return;

    if (sourceUrl) {
      video.src = sourceUrl;
      video.muted = muted;
      if (autoPlay) void video.play().catch(() => undefined);
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    const source = `https://stream.mux.com/${playbackId}.m3u8`;
    let hls: HlsInstance | null = null;
    let cancelled = false;
    video.muted = muted;

    const beginPlayback = () => {
      if (cancelled) return;
      const Hls = getHls();

      if (Hls?.isSupported()) {
        hls = new Hls({ startLevel: -1, maxBufferLength: 30, lowLatencyMode: false });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) void video.play().catch(() => undefined);
        });
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        if (autoPlay) void video.play().catch(() => undefined);
      }
    };

    if (getHls()) {
      beginPlayback();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${HLS_SCRIPT}"]`);
      const script = existingScript ?? document.createElement("script");
      script.addEventListener("load", beginPlayback, { once: true });
      if (!existingScript) {
        script.src = HLS_SCRIPT;
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [autoPlay, muted, playbackId, shouldLoad, sourceUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !autoPlay || !muted || !loop || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlay, loop, muted, shouldLoad]);

  if (!playbackId && !sourceUrl) {
    return (
      <div
        className="pp-project-video pp-project-video--placeholder"
        style={{ backgroundImage: `url(${poster})` }}
        role="img"
        aria-label={`${title} media placeholder`}
      />
    );
  }

  return (
    // Source films currently have no timed-text track supplied by their owner.
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      className="pp-project-video"
      poster={playbackId ? `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0&width=1920` : poster}
      style={{ backgroundImage: `url(${poster})` }}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      aria-label={`${title} project video`}
    />
  );
}

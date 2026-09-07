"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { PacomeProject } from "./data";
import ProjectVideo from "./ProjectVideo";
import { playUiSound, resumeSoundExperience, setAmbientContext } from "./sound";

// These are the portrait deliverables in project 16. The desktop grid lets
// each one span the two compact rows occupied by adjacent landscape images.
const project16PortraitFrames = new Set([4, 5, 10, 11, 12, 15]);

function DeferredProjectImage({ src, alt }: { src: string; alt: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || ready) return;
    if (!("IntersectionObserver" in window)) {
      const timeout = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    observer.observe(image);
    return () => observer.disconnect();
  }, [ready]);

  return <img ref={imageRef} src={ready ? src : undefined} alt={alt} decoding="async" />;
}

function ExternalVideoTitle({ url, fallback, resolveRemote = true }: { url: string; fallback: string; resolveRemote?: boolean }) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [title, setTitle] = useState(fallback);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!resolveRemote) return;
    const element = titleRef.current;
    if (!element || shouldLoad) return;
    if (!("IntersectionObserver" in window)) {
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
    observer.observe(element);
    return () => observer.disconnect();
  }, [resolveRemote, shouldLoad]);

  useEffect(() => {
    if (!resolveRemote || !shouldLoad) return;
    const controller = new AbortController();

    fetch(`/api/external-title?url=${encodeURIComponent(url)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { title?: string } | null) => {
        if (data?.title) setTitle(data.title);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [resolveRemote, shouldLoad, url]);

  return <span ref={titleRef}>{title}</span>;
}

function externalActionLabel(url: string) {
  if (url.includes("bilibili.com")) return "前往B站播放";
  if (url.includes("xinpianchang.com")) return "前往新片场播放";
  return "查看案例";
}

export default function ProjectDetail({ project, nextProject }: {
  project: PacomeProject;
  nextProject: PacomeProject;
}) {
  const pageRef = useRef<HTMLElement>(null);
  const returnTimerRef = useRef<number | null>(null);
  const returnFallbackRef = useRef<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("from") === "list" ? "list" : "spiral";
  const returnHref = `/?view=${origin}&resume=1`;
  const hasVideo = Boolean(project.playbackId || project.videoUrl || project.previewVideoUrl || project.bilibiliBvid || project.mainExternalUrl);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);
  const [activeLocalVideo, setActiveLocalVideo] = useState<string | null>(null);
  const [enlargedFrame, setEnlargedFrame] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const isProject03 = project.slug === "project-03";
  const [visibleExternalVideos, setVisibleExternalVideos] = useState(isProject03 ? 2 : project.additionalVideos?.length ?? 0);
  const [visibleStyleframes, setVisibleStyleframes] = useState(isProject03 ? 6 : project.styleframes.length);
  const externalVideoActionLabel = project.slug === "project-14"
    ? "前往新片场播放"
    : project.mainExternalUrl?.includes("bilibili.com")
      ? "前往B站播放"
      : project.mainExternalUrl
        ? "查看案例"
      : "播放完整视频";
  const hasStyleframes = project.styleframes.length > 0;

  const closeProject = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    playUiSound("back");
    setAmbientContext("gallery");
    window.scrollTo(0, 0);
    returnTimerRef.current = window.setTimeout(() => {
      returnTimerRef.current = null;
      router.replace(returnHref, { scroll: true });
      returnFallbackRef.current = window.setTimeout(() => {
        window.location.assign(returnHref);
      }, 2800);
    }, 60);
  };
  const openPlayer = () => {
    if (project.mainExternalUrl) {
      window.open(project.mainExternalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (hasVideo) setPlayerOpen(true);
  };
  const closePlayer = () => setPlayerOpen(false);

  useEffect(() => {
    setAmbientContext("detail");
    resumeSoundExperience();
  }, []);

  useEffect(() => {
    router.prefetch(returnHref);
    router.prefetch(`${nextProject.href}?from=${origin}`);
  }, [nextProject.href, origin, returnHref, router]);

  useEffect(() => () => {
    if (returnTimerRef.current !== null) window.clearTimeout(returnTimerRef.current);
    if (returnFallbackRef.current !== null) window.clearTimeout(returnFallbackRef.current);
  }, []);

  useEffect(() => {
    if (!playerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closePlayer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [playerOpen]);

  useEffect(() => {
    if (!enlargedFrame) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setEnlargedFrame(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enlargedFrame]);

  useEffect(() => {
    const frames = pageRef.current?.querySelectorAll<HTMLElement>(".pp-project-styleframe");
    if (!frames?.length) return;

    if (project.slug === "project-02" || project.slug === "project-03") {
      frames.forEach((frame) => frame.classList.add("pp-project-styleframe--visible"));
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      frames.forEach((frame) => frame.classList.add("pp-project-styleframe--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("pp-project-styleframe--visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.08 },
    );

    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, [project.slug]);

  return (
    <main className={`pp-project-page pp-project-page--${project.slug}${isLeaving ? " pp-project-page--leaving" : ""}`} ref={pageRef}>
      <Link
        className="pp-project-close"
        href={returnHref}
        aria-label={`Back to ${origin} portfolio`}
        aria-disabled={isLeaving}
        onClick={(event) => {
          event.preventDefault();
          closeProject();
        }}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </Link>

      {isLeaving ? (
        <div className="pp-project-return-layer" role="status" aria-live="polite">
          <span>返回作品集</span>
        </div>
      ) : null}

      <article className="pp-project-card" id="project-infos">
        <div className={`pp-project-video-wrap${hasVideo ? "" : " pp-project-video-wrap--empty"}`}>
          <ProjectVideo playbackId={project.playbackId} sourceUrl={project.previewVideoUrl ?? project.videoUrl} poster={project.image} title={project.title} />
          {hasVideo ? (
            <button
              className="pp-project-video-action"
              type="button"
              onClick={openPlayer}
              aria-label={`${externalVideoActionLabel}${project.title}`}
            >
              {externalVideoActionLabel}
            </button>
          ) : null}
        </div>

        <section className={`pp-project-info${project.title.length > 12 ? " pp-project-info--long-title" : ""}`} aria-labelledby="project-title">
          <div className={`pp-project-heading pp-project-heading--single-line${project.slug === "project-02" ? " pp-project-heading--compact" : ""}${project.title.length > 12 ? " pp-project-heading--long" : ""}${project.title.length > 16 ? " pp-project-heading--extra-long" : ""}`}>
            <h1 id="project-title">{project.title}</h1>
            <span>{project.year}</span>
          </div>
          <div className={`pp-project-copy${project.description ? "" : " pp-project-copy--empty"}`}>
            {project.description ? <p>{project.description}</p> : <div className="pp-project-copy-placeholder" aria-hidden="true" />}
            {project.behanceUrl ? (
              <a className="pp-project-case-link" href={project.behanceUrl} target="_blank" rel="noreferrer">
                see the case <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </section>

        <div className="pp-project-additional-videos">
        {project.additionalVideos?.slice(0, visibleExternalVideos).map((video) => (
          <figure className="pp-project-additional-video" key={video.url}>
            {video.captionPosition === "above" ? (
              <figcaption>
                {video.externalUrl ? <ExternalVideoTitle url={video.externalUrl} fallback={video.caption} resolveRemote={project.slug !== "project-03"} /> : video.caption}
              </figcaption>
            ) : null}
            <div className="pp-project-additional-video-frame">
              {video.externalUrl ? (
                <a
                  className="pp-project-bilibili-poster pp-project-external-video-poster"
                  href={video.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${externalActionLabel(video.externalUrl)}${video.caption}`}
                >
                  {project.slug === "project-03" ? (
                    <DeferredProjectImage src={video.poster ?? project.image} alt="" />
                  ) : (
                    <img src={video.poster ?? project.image} alt="" loading="lazy" decoding="async" />
                  )}
                  <span aria-hidden="true">{externalActionLabel(video.externalUrl)}</span>
                </a>
              ) : video.bilibiliBvid && activeEmbed === video.bilibiliBvid ? (
                <iframe
                  className="pp-project-bilibili-player"
                  src={`https://player.bilibili.com/player.html?isOutside=true&bvid=${video.bilibiliBvid}&p=1&autoplay=1&danmaku=0`}
                  title={`${video.caption} 哔哩哔哩播放器`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : video.bilibiliBvid ? (
                <button
                  className="pp-project-bilibili-poster"
                  type="button"
                  onClick={() => setActiveEmbed(video.bilibiliBvid ?? null)}
                  aria-label={`播放${video.caption}`}
                >
                  <img src={video.poster ?? project.image} alt="" loading="lazy" decoding="async" />
                  <span aria-hidden="true">播放完整视频</span>
                </button>
              ) : activeLocalVideo === video.url ? (
                <ProjectVideo
                  playbackId=""
                  sourceUrl={video.url}
                  poster={video.poster ?? project.image}
                  title={video.caption}
                  controls
                  muted={false}
                  loop={false}
                  autoPlay
                />
              ) : (
                <button
                  className="pp-project-bilibili-poster pp-project-local-video-poster"
                  type="button"
                  onClick={() => setActiveLocalVideo(video.url)}
                  aria-label={`加载并播放${video.caption}`}
                >
                  <img src={video.poster ?? project.image} alt="" loading="lazy" decoding="async" />
                  <span aria-hidden="true">播放视频</span>
                </button>
              )}
            </div>
            {video.captionPosition !== "above" ? (
              <figcaption>
                {video.externalUrl ? <ExternalVideoTitle url={video.externalUrl} fallback={video.caption} resolveRemote={project.slug !== "project-03"} /> : video.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
        </div>

        {isProject03 && visibleExternalVideos < (project.additionalVideos?.length ?? 0) ? (
          <button
            className="pp-project-progressive-more"
            type="button"
            onClick={() => setVisibleExternalVideos((count) => Math.min(count + 2, project.additionalVideos?.length ?? count))}
          >
            查看更多系列作品
          </button>
        ) : null}

        {project.styleframesLabel ? <h2 className="pp-project-styleframes-title">{project.styleframesLabel}</h2> : null}
        {project.slug !== "project-14" && project.slug !== "project-17" && project.slug !== "project-18" && project.slug !== "project-19" && project.slug !== "project-20" && project.slug !== "project-22" || hasStyleframes ? (
        <div className={`pp-project-styleframes${project.styleframesLabel ? " pp-project-styleframes--labelled" : ""}${project.styleframesLayout === "editorial" ? " pp-project-styleframes--editorial" : ""}`} aria-label={`${project.title} styleframes`}>
          {Array.from({ length: project.styleframes.length || 6 }, (_, index) => {
            const image = project.styleframes[index];
            if (isProject03 && index >= visibleStyleframes) return null;
            const displayImage = project.slug === "project-02"
              ? image?.replace("/styleframes/", "/styleframes/preview/")
              : project.slug === "project-03"
                ? image?.replace("/styleframes/", "/styleframes/thumbs/")
                : image;
            const featured = project.slug === "project-02"
              ? index === 0 || index === 11 || index === project.styleframes.length - 1
              : project.slug === "project-12"
              ? false
              : project.slug === "project-13"
              ? false
              : project.slug === "project-14"
              ? false
              : project.slug === "project-16"
              ? false
              : project.slug === "project-18"
              ? false
              : project.slug === "project-21"
              ? false
              : project.slug === "project-22"
              ? false
              : project.slug === "project-04"
              ? index === 0
              : project.slug === "project-07"
              ? false
              : project.slug === "project-08"
              ? false
              : project.styleframesLayout === "editorial"
              ? index === 0 || index === project.styleframes.length - 1
              : index < 2;
            return image ? (
                <figure
                  className={`pp-project-styleframe pp-project-styleframe--filled${featured ? " pp-project-styleframe--featured" : ""}${project.slug === "project-16" ? (project16PortraitFrames.has(index + 1) ? " pp-project-styleframe--portrait" : " pp-project-styleframe--landscape") : ""}`}
                  key={image}
                  style={project.slug === "project-14" ? { aspectRatio: "9 / 16" } : project.slug === "project-16" ? { aspectRatio: "auto" } : undefined}
                >
                  <button type="button" onClick={() => setEnlargedFrame(image)} aria-label={`放大查看${project.title}静帧 ${index + 1}`} style={project.slug === "project-16" ? { height: "auto" } : undefined}>
                    {project.slug === "project-02" || project.slug === "project-03" ? (
                      <DeferredProjectImage src={displayImage ?? image} alt={`${project.title} styleframe ${index + 1}`} />
                    ) : (
                      <img
                        src={displayImage}
                        alt={`${project.title} styleframe ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        style={project.slug === "project-14" ? { objectFit: "contain" } : project.slug === "project-16" ? { height: "auto", objectFit: "contain", transform: "none" } : undefined}
                      />
                    )}
                    <span aria-hidden="true">点击放大</span>
                  </button>
                </figure>
              ) : (
                <figure
                  className="pp-project-styleframe pp-project-styleframe--placeholder"
                  key={`placeholder-${index + 1}`}
                  aria-hidden="true"
                />
              );
          })}
        </div>
        ) : null}

        {isProject03 && visibleStyleframes < project.styleframes.length ? (
          <button
            className="pp-project-progressive-more pp-project-progressive-more--frames"
            type="button"
            onClick={() => setVisibleStyleframes((count) => Math.min(count + 6, project.styleframes.length))}
          >
            加载更多静帧
          </button>
        ) : null}

        {project.storyboardImages?.length ? (
          <>
            <h2 className="pp-project-styleframes-title">{project.storyboardImagesLabel ?? "分镜手稿"}</h2>
            <div className="pp-project-styleframes pp-project-styleframes--labelled pp-project-storyboards" aria-label={`${project.title} storyboards`}>
              {project.storyboardImages.map((image, index) => (
                <figure className="pp-project-styleframe pp-project-styleframe--filled" key={image}>
                  <button type="button" onClick={() => setEnlargedFrame(image)} aria-label={`放大查看${project.title}${project.storyboardImagesLabel ?? "分镜手稿"} ${index + 1}`}>
                    <img src={image} alt={`${project.title} ${project.storyboardImagesLabel ?? "分镜手稿"} ${index + 1}`} loading="lazy" decoding="async" />
                    <span aria-hidden="true">点击放大</span>
                  </button>
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {project.usageImages?.length ? (
          <>
            <h2 className="pp-project-styleframes-title">{project.usageImagesLabel ?? "产品使用场景图"}</h2>
            <div className="pp-project-styleframes pp-project-styleframes--labelled pp-project-usage-images" aria-label={`${project.title} usage images`}>
              {project.usageImages.map((image, index) => (
                <figure className="pp-project-styleframe pp-project-styleframe--filled" key={image}>
                  <button type="button" onClick={() => setEnlargedFrame(image)} aria-label={`放大查看${project.title}${project.usageImagesLabel ?? "产品使用场景图"} ${index + 1}`}>
                    <img src={image} alt={`${project.title} ${project.usageImagesLabel ?? "产品使用场景图"} ${index + 1}`} loading="lazy" decoding="async" />
                    <span aria-hidden="true">点击放大</span>
                  </button>
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {project.shootingPlanImage ? (
          <section className="pp-project-plan-section" aria-label={`${project.title}拍摄方案`}>
            <button type="button" className="pp-project-plan-button" onClick={() => setEnlargedFrame(project.shootingPlanImage!)} aria-label={`放大查看${project.title}拍摄方案`}>
              <img src={project.shootingPlanImage} alt={`${project.title}拍摄方案`} loading="lazy" decoding="async" />
              <span aria-hidden="true">点击放大</span>
            </button>
          </section>
        ) : null}

        {project.productImages?.length ? (
          <section className="pp-project-product-section" aria-labelledby="pp-project-product-title">
            <h2 id="pp-project-product-title">{project.productImagesLabel ?? "产品图"}</h2>
            <div className="pp-project-product-gallery">
              {project.productImages.map((image, index) => (
                <figure
                  className={`pp-project-product-item pp-project-product-item--${image.orientation}`}
                  key={image.src}
                  style={project.slug === "project-14" ? { aspectRatio: "9 / 16" } : undefined}
                >
                  <button type="button" onClick={() => setEnlargedFrame(image.src)} aria-label={`放大查看${project.title}${project.productImagesLabel ?? "产品图"} ${index + 1}`}>
                    <img
                      src={image.previewSrc ?? image.src}
                      alt={`${project.title} ${project.productImagesLabel ?? "产品图"} ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={project.slug === "project-14" ? { objectFit: "contain" } : undefined}
                    />
                    <span aria-hidden="true">点击放大</span>
                  </button>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {enlargedFrame ? (
        <div className="pp-project-lightbox" role="dialog" aria-modal="true" aria-label="放大的静帧图">
          <button className="pp-project-lightbox-backdrop" type="button" onClick={() => setEnlargedFrame(null)} aria-label="关闭静帧大图" />
          <button className="pp-project-lightbox-close" type="button" onClick={() => setEnlargedFrame(null)} aria-label="关闭静帧大图">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <img src={enlargedFrame} alt="" />
        </div>
      ) : null}

      <section className="pp-project-next" aria-label="Next project">
        <Link className="pp-project-back" href={returnHref} scroll onClick={(event) => {
          event.preventDefault();
          closeProject();
        }}>back to home</Link>
        <Link className="pp-project-next-image-wrap" href={`${nextProject.href}?from=${origin}`} aria-label={`Next project: ${nextProject.title}`} onClick={() => playUiSound("open")}>
          <img className="pp-project-next-image" src={nextProject.image} alt="" />
          <span className="pp-project-next-tag pp-project-next-tag--top">keep scrolling !</span>
          <span className="pp-project-next-tag pp-project-next-tag--bottom">next up...</span>
          <span className="pp-project-next-title">{nextProject.title}</span>
        </Link>
      </section>

      {playerOpen && hasVideo ? (
        <div className="pp-project-player" role="dialog" aria-modal="true" aria-label={`${project.title} full video player`}>
          <button className="pp-project-player-close" type="button" onClick={closePlayer} aria-label="Close full video player">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          {project.bilibiliBvid ? (
            <iframe
              className="pp-project-main-bilibili-player"
              src={`https://player.bilibili.com/player.html?isOutside=true&bvid=${project.bilibiliBvid}&p=1&autoplay=1&danmaku=0`}
              title={`${project.title} 哔哩哔哩主视频`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <ProjectVideo
              playbackId={project.playbackId}
              sourceUrl={project.videoUrl ?? project.previewVideoUrl}
              poster={project.image}
              title={`${project.title} full video`}
              controls
              muted={false}
              loop={false}
            />
          )}
        </div>
      ) : null}
    </main>
  );
}

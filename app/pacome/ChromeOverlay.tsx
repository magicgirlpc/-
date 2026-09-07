"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { AnimationItem } from "lottie-web";
import { playUiSound } from "./sound";

export type ChromeOverlayProps = {
  view: "spiral" | "list";
  onViewChange: (view: "spiral" | "list") => void;
  soundOn: boolean;
  onSoundToggle: () => void;
  onOverlayActivityChange: (active: boolean) => void;
};

const assetRoot = "/sites/pacomepertant-com-b16b412f/root-8a5edab2";
const resumePages = [1, 2, 3] as const;
const logoFaces = ["face1", "face3", "face4", "face5"] as const;

function ViewLabel({ label }: { label: "spiral" | "list" }) {
  return (
    <span className="pp-view-switch__roll" aria-hidden="true">
      <span>{label}</span>
      <span>{label}</span>
    </span>
  );
}

function InteractiveLogo() {
  const [faceIndex, setFaceIndex] = useState(0);
  const tooltipId = useId();
  const animationHostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let active = true;
    let animation: AnimationItem | undefined;

    const mountFace = async () => {
      try {
        const face = logoFaces[faceIndex];
        const [lottieModule, response] = await Promise.all([
          import("lottie-web"),
          fetch(`${assetRoot}/logo/${face}.json`),
        ]);
        if (!response.ok) return;
        const animationData: unknown = await response.json();
        if (!active || !animationHostRef.current) return;
        animationHostRef.current.replaceChildren();
        animation = lottieModule.default.loadAnimation({
          container: animationHostRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
      } catch {
        // The static mark remains visible if the optional animation cannot load.
      }
    };

    void mountFace();
    return () => {
      active = false;
      animation?.destroy();
    };
  }, [faceIndex]);

  return (
    <button
      className="pp-logo"
      type="button"
      aria-label={`切换左上角表情，当前第 ${faceIndex + 1} 种`}
      aria-describedby={tooltipId}
      onClick={() => {
        playUiSound("toggle");
        setFaceIndex((current) => (current + 1) % logoFaces.length);
      }}
    >
      <span className="pp-logo__visual" aria-hidden="true">
        <img className="pp-logo__fallback" src={`${assetRoot}/favicon.svg`} alt="" width={64} height={64} />
        <span className="pp-logo__lottie" ref={animationHostRef} />
      </span>
      <span className="pp-logo__tooltip" id={tooltipId} role="tooltip">Click!!</span>
    </button>
  );
}

function ContactPanel({ onClose }: { onClose: () => void }) {
  return (
    <section className="pp-contact-panel" role="dialog" aria-modal="true" aria-labelledby="pp-contact-title">
      <button className="pp-panel-back" type="button" onClick={onClose}>
        <span aria-hidden="true">←</span> 返回菜单
      </button>
      <div className="pp-contact-panel__content">
        <p className="pp-contact-panel__eyebrow">CONTACT / 03</p>
        <h2 id="pp-contact-title">保持联系</h2>
        <div className="pp-contact-panel__details">
          <a href="mailto:1579713724@qq.com">
            <span>邮箱</span>
            <strong>1579713724@qq.com</strong>
          </a>
          <a href="tel:+8617631087716">
            <span>手机号</span>
            <strong>176 3108 7716</strong>
          </a>
        </div>
        <figure className="pp-contact-panel__wechat">
          <img src="/contact/wechat-qr.jpg" alt="张鹏程的微信二维码" width={888} height={1131} />
          <figcaption><span>微信</span> 扫码添加好友</figcaption>
        </figure>
      </div>
    </section>
  );
}

function ResumeViewer({ onClose }: { onClose: () => void }) {
  return (
    <section className="pp-resume-viewer" role="dialog" aria-modal="true" aria-labelledby="pp-resume-title">
      <header className="pp-resume-viewer__header">
        <div>
          <span>RESUME / 2026</span>
          <strong id="pp-resume-title">张鹏程工作简历</strong>
        </div>
        <div className="pp-resume-viewer__actions">
          <a href="/resume.pdf" download="张鹏程工作简历.pdf">下载 PDF</a>
          <button type="button" onClick={onClose} aria-label="关闭简历预览">关闭 <span aria-hidden="true">×</span></button>
        </div>
      </header>
      <div className="pp-resume-viewer__pages">
        {resumePages.map((page) => (
          <figure key={page}>
            <img
              src={`/resume/page-${page}.jpg`}
              alt={`张鹏程工作简历第 ${page} 页`}
              width={994}
              height={1404}
              loading={page === 1 ? "eager" : "lazy"}
              decoding="async"
            />
            <figcaption>{String(page).padStart(2, "0")} / 03</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ChromeOverlay({
  view,
  onViewChange,
  soundOn,
  onSoundToggle,
  onOverlayActivityChange,
}: ChromeOverlayProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"contact" | "resume" | null>(null);
  const drawerId = useId();
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuLayersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    const layerContainer = menuLayersRef.current;
    if (!panel || !layerContainer) return;
    const mobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const layers = mobile
      ? []
      : Array.from(layerContainer.querySelectorAll<HTMLElement>(".pp-menu__prelayer"));
    const context = gsap.context(() => {
      gsap.set([panel, ...layers], { xPercent: 105 });
    });
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    const layerContainer = menuLayersRef.current;
    if (!panel || !layerContainer) return;
    const mobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const layers = mobile
      ? []
      : Array.from(layerContainer.querySelectorAll<HTMLElement>(".pp-menu__prelayer"));
    const labels = Array.from(panel.querySelectorAll<HTMLElement>(".pp-menu__link-label"));
    const footerItems = Array.from(panel.querySelectorAll<HTMLElement>(".pp-menu__email"));
    const timeline = gsap.timeline();

    if (menuOpen) {
      gsap.set(labels, { yPercent: mobile ? 45 : 135, rotate: mobile ? 0 : 7 });
      gsap.set(footerItems, { y: mobile ? 10 : 22, opacity: 0 });
      layers.forEach((layer, index) => {
        timeline.to(layer, { xPercent: 0, duration: .52, ease: "power4.out" }, index * .07);
      });
      timeline.to(panel, { xPercent: 0, duration: mobile ? .38 : .68, ease: "power4.out" }, layers.length ? .15 : 0);
      timeline.to(labels, { yPercent: 0, rotate: 0, duration: mobile ? .34 : .9, ease: "power4.out", stagger: mobile ? .035 : .1 }, mobile ? .08 : .3);
      timeline.to(footerItems, { y: 0, opacity: 1, duration: mobile ? .28 : .55, ease: "power3.out", stagger: .06 }, mobile ? .14 : .48);
    } else {
      timeline.to([panel, ...layers], { xPercent: 105, duration: mobile ? .26 : .34, ease: "power3.in", overwrite: true });
    }

    return () => timeline.kill();
  }, [menuOpen]);

  useEffect(() => {
    onOverlayActivityChange(menuOpen || activePanel !== null);
    return () => onOverlayActivityChange(false);
  }, [activePanel, menuOpen, onOverlayActivityChange]);

  useEffect(() => {
    if (!menuOpen && !activePanel) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        playUiSound("menu");
        if (activePanel) setActivePanel(null);
        else setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePanel, menuOpen]);

  const closeMenu = () => {
    if (menuOpen) playUiSound("menu");
    setActivePanel(null);
    setMenuOpen(false);
  };
  const closePanel = () => {
    playUiSound("menu");
    setActivePanel(null);
  };
  const menuIsInteractive = menuOpen && activePanel === null;

  return (
    <div className={`pp-chrome${menuOpen ? " pp-chrome--menu-open" : ""}`}>
      <InteractiveLogo />

      <div className="pp-view-switch" role="group" aria-label="Portfolio view">
        <button
          className={`pp-view-switch__option${view === "spiral" ? " pp-view-switch__option--active" : ""}`}
          type="button"
          aria-label="Use spiral view"
          aria-pressed={view === "spiral"}
          onClick={() => {
            playUiSound("menu");
            onViewChange("spiral");
          }}
        >
          <ViewLabel label="spiral" />
        </button>
        <span className="pp-view-switch__dot" aria-hidden="true" />
        <button
          className={`pp-view-switch__option${view === "list" ? " pp-view-switch__option--active" : ""}`}
          type="button"
          aria-label="Use list view"
          aria-pressed={view === "list"}
          onClick={() => {
            playUiSound("menu");
            onViewChange("list");
          }}
        >
          <ViewLabel label="list" />
        </button>
      </div>

      <button
        className={`pp-menu__backdrop${menuOpen ? " pp-menu__backdrop--visible" : ""}`}
        type="button"
        aria-label="Close menu"
        aria-hidden={!menuOpen}
        disabled={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <div className={`pp-menu${menuOpen ? " pp-menu--open" : ""}`}>
        <div className="pp-menu__prelayers" ref={menuLayersRef} aria-hidden="true">
          <div className="pp-menu__prelayer pp-menu__prelayer--one" />
          <div className="pp-menu__prelayer pp-menu__prelayer--two" />
        </div>

        <button
          className="pp-menu__toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={drawerId}
          onClick={() => {
            playUiSound("menu");
            if (menuOpen) {
              setActivePanel(null);
              setMenuOpen(false);
            } else {
              setMenuOpen(true);
            }
          }}
        >
          <span className="pp-menu__toggle-roll" aria-hidden="true">
            <span>{menuOpen ? "close" : "menu"}</span>
          </span>
          <span className="pp-menu__toggle-icon" aria-hidden="true"><i /><i /></span>
        </button>

        <div className="pp-menu__drawer" id={drawerId} ref={menuPanelRef}>

          <nav className="pp-menu__content" aria-label="Primary navigation" aria-hidden={!menuIsInteractive}>
            <div className="pp-menu__links">
              <a className="pp-menu__link" href="#works" tabIndex={menuIsInteractive ? 0 : -1} onClick={closeMenu}>
                <span className="pp-menu__link-label">作品</span>
              </a>
              <button
                className="pp-menu__link"
                type="button"
                tabIndex={menuIsInteractive ? 0 : -1}
                onClick={() => {
                  playUiSound("menu");
                  setActivePanel("resume");
                }}
              >
                <span className="pp-menu__link-label">简历</span>
              </button>
              <button
                className="pp-menu__link"
                type="button"
                tabIndex={menuIsInteractive ? 0 : -1}
                onClick={() => {
                  playUiSound("menu");
                  setActivePanel("contact");
                }}
              >
                <span className="pp-menu__link-label">联系方式</span>
              </button>
            </div>

            <div className="pp-menu__footer">
              <a
                className="pp-menu__email"
                href="mailto:1579713724@qq.com"
                tabIndex={menuIsInteractive ? 0 : -1}
              >
                1579713724@qq.com
              </a>
            </div>
          </nav>
          {activePanel === "contact" ? <ContactPanel onClose={closePanel} /> : null}
        </div>
      </div>

      {activePanel === "resume" ? <ResumeViewer onClose={closePanel} /> : null}

      <button
        className="pp-showreel"
        type="button"
        aria-label="查看张鹏程工作简历"
        onClick={() => {
          playUiSound("open");
          setActivePanel("resume");
        }}
      >
        <span className="pp-showreel__guide" aria-hidden="true">查看简历</span>
        <span className="pp-showreel__card">
          <img
            className="pp-showreel__image"
            src={`${assetRoot}/showreel-thumbnail.png`}
            alt="Portfolio 2023—2026"
            width={280}
            height={158}
          />
          <svg
            className="pp-showreel__perimeter"
            viewBox="0 0 280 158"
            aria-hidden="true"
          >
            <defs>
              <path
                id="pp-showreel-outline"
                d="M 20 -10 H 260 Q 290 -10 290 20 V 138 Q 290 168 260 168 H 20 Q -10 168 -10 138 V 20 Q -10 -10 20 -10 Z"
              />
            </defs>
            <text className="pp-showreel__perimeter-text" textLength="940">
              <textPath href="#pp-showreel-outline" startOffset="0">
                Portfolio 2023—2026  •  Portfolio 2023—2026  •  Portfolio 2023—2026  •  Portfolio 2023—2026  •  
                <animate
                  attributeName="startOffset"
                  from="0"
                  to="-235"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </textPath>
            </text>
          </svg>
        </span>
      </button>

      <button
        className={`pp-sound${soundOn ? " pp-sound--on" : " pp-sound--off"}`}
        type="button"
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        aria-pressed={soundOn}
        onClick={onSoundToggle}
      >
        <span className="pp-sound__background" aria-hidden="true" />
        <svg
          className="pp-sound__icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6h3l3-3v10l-3-3H2V6Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {soundOn ? (
            <>
              <path d="M10.5 5a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              <path d="M12.5 3a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </>
          ) : (
            <path d="m10.5 6 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  );
}

export default ChromeOverlay;

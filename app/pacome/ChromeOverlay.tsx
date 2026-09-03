"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export type ChromeOverlayProps = {
  view: "spiral" | "list";
  onViewChange: (view: "spiral" | "list") => void;
  soundOn: boolean;
  onSoundToggle: () => void;
};

const assetRoot = "/sites/pacomepertant-com-b16b412f/root-8a5edab2";

const socialLinks = [
  { label: "Instagram", mark: "Ig", href: "https://www.instagram.com" },
  { label: "X", mark: "X", href: "https://www.x.com/pacomepertant" },
  { label: "Behance", mark: "Be", href: "https://www.behance.net/pacomepertant" },
  {
    label: "LinkedIn",
    mark: "Li",
    href: "https://www.linkedin.com/in/pac%C3%B4me-pertant-b4437126b/",
  },
] as const;

function ViewLabel({ label }: { label: "spiral" | "list" }) {
  return (
    <span className="pp-view-switch__roll" aria-hidden="true">
      <span>{label}</span>
      <span>{label}</span>
    </span>
  );
}

export function ChromeOverlay({
  view,
  onViewChange,
  soundOn,
  onSoundToggle,
}: ChromeOverlayProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const logoTooltipId = useId();
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuLayersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    const layerContainer = menuLayersRef.current;
    if (!panel || !layerContainer) return;
    const layers = Array.from(layerContainer.querySelectorAll<HTMLElement>(".pp-menu__prelayer"));
    const context = gsap.context(() => {
      gsap.set([panel, ...layers], { xPercent: 105 });
    });
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    const layerContainer = menuLayersRef.current;
    if (!panel || !layerContainer) return;
    const layers = Array.from(layerContainer.querySelectorAll<HTMLElement>(".pp-menu__prelayer"));
    const labels = Array.from(panel.querySelectorAll<HTMLElement>(".pp-menu__link-label"));
    const footerItems = Array.from(panel.querySelectorAll<HTMLElement>(".pp-menu__email, .pp-menu__social"));
    const timeline = gsap.timeline();

    if (menuOpen) {
      gsap.set(labels, { yPercent: 135, rotate: 7 });
      gsap.set(footerItems, { y: 22, opacity: 0 });
      layers.forEach((layer, index) => {
        timeline.to(layer, { xPercent: 0, duration: .52, ease: "power4.out" }, index * .07);
      });
      timeline.to(panel, { xPercent: 0, duration: .68, ease: "power4.out" }, layers.length ? .15 : 0);
      timeline.to(labels, { yPercent: 0, rotate: 0, duration: .9, ease: "power4.out", stagger: .1 }, .3);
      timeline.to(footerItems, { y: 0, opacity: 1, duration: .55, ease: "power3.out", stagger: .06 }, .48);
    } else {
      timeline.to([panel, ...layers], { xPercent: 105, duration: .34, ease: "power3.in", overwrite: true });
    }

    return () => timeline.kill();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`pp-chrome${menuOpen ? " pp-chrome--menu-open" : ""}`}>
      <Link
        className="pp-logo"
        href="/"
        aria-label="I'm Pengcheng home"
        aria-describedby={logoTooltipId}
      >
        <img
          className="pp-logo__mark"
          src={`${assetRoot}/favicon.svg`}
          alt=""
          width={64}
          height={64}
          aria-hidden="true"
        />
        <span className="pp-logo__tooltip" id={logoTooltipId} role="tooltip">
          I&apos;m Pengcheng
        </span>
      </Link>

      <div className="pp-view-switch" role="group" aria-label="Portfolio view">
        <button
          className={`pp-view-switch__option${view === "spiral" ? " pp-view-switch__option--active" : ""}`}
          type="button"
          aria-label="Use spiral view"
          aria-pressed={view === "spiral"}
          onClick={() => onViewChange("spiral")}
        >
          <ViewLabel label="spiral" />
        </button>
        <span className="pp-view-switch__dot" aria-hidden="true" />
        <button
          className={`pp-view-switch__option${view === "list" ? " pp-view-switch__option--active" : ""}`}
          type="button"
          aria-label="Use list view"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
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
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="pp-menu__toggle-roll" aria-hidden="true">
            <span>{menuOpen ? "close" : "menu"}</span>
          </span>
          <span className="pp-menu__toggle-icon" aria-hidden="true"><i /><i /></span>
        </button>

        <div className="pp-menu__drawer" id={drawerId} ref={menuPanelRef}>

          <nav className="pp-menu__content" aria-label="Primary navigation" aria-hidden={!menuOpen}>
            <div className="pp-menu__links">
              <a className="pp-menu__link" href="#works" tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}>
                <span className="pp-menu__link-label">影像</span>
              </a>
              <a
                className="pp-menu__link"
                href="https://pacomepertant.com/about"
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span className="pp-menu__link-label">平面</span>
              </a>
              <a
                className="pp-menu__link"
                href="mailto:1579713724@qq.com"
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span className="pp-menu__link-label">联系方式</span>
              </a>
            </div>

            <div className="pp-menu__footer">
              <a
                className="pp-menu__email"
                href="mailto:1579713724@qq.com"
                tabIndex={menuOpen ? 0 : -1}
              >
                1579713724@qq.com
              </a>
              <div className="pp-menu__socials" aria-label="Social profiles">
                {socialLinks.map((social) => (
                  <a
                    className="pp-menu__social"
                    href={social.href}
                    key={social.label}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    tabIndex={menuOpen ? 0 : -1}
                  >
                    <span aria-hidden="true">{social.mark}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <a
        className="pp-showreel"
        href="https://pacomepertant.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Portfolio 2023—2026"
      >
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
      </a>

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

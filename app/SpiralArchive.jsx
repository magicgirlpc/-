"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "./SpiralArchive.css";

const positions = [
  [-37, -17, -11, 1.03], [-9, -28, 7, .92], [18, -30, 12, .86], [42, -26, 17, .9],
  [-29, 1, 6, 1.08], [2, -2, -2, 1.22], [35, 7, 7, .96], [49, 29, 15, .72],
  [-14, 31, -10, .86], [18, 29, 10, .82], [-45, 34, -15, .78], [1, 51, -6, .9],
];

function SoundIcon({ muted }) {
  return <svg viewBox="0 0 24 20" aria-hidden="true"><path d="M3 7h4l5-5v16l-5-5H3z" fill="currentColor" /><path d={muted ? "M16 7l5 5m0-5l-5 5" : "M16 6.5c1.8 1.6 1.8 5.4 0 7m3-10c3.3 3.6 3.3 9.4 0 13"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

export default function SpiralArchive({ projects }) {
  const [mode, setMode] = useState("spiral");
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [frame, setFrame] = useState(0);
  const pointer = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const phase = useRef(0);

  const tiles = useMemo(() => projects.flatMap((project) => [
    { ...project, image: project.cover },
    ...project.gallery.map((image, index) => ({ ...project, image, title: `${project.title} / ${index + 1}` })),
  ]).slice(0, 12), [projects]);

  useEffect(() => {
    const move = (event) => { pointer.current = { x: event.clientX / window.innerWidth - .5, y: event.clientY / window.innerHeight - .5 }; };
    const wheel = (event) => { velocity.current += Math.max(-2, Math.min(2, event.deltaY / 300)); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("wheel", wheel, { passive: true });
    let raf;
    let last = performance.now();
    const animate = (now) => {
      const dt = Math.min(40, now - last); last = now;
      phase.current += dt * (0.000025 + velocity.current * 0.00001);
      velocity.current *= .94;
      setFrame(phase.current);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); window.removeEventListener("wheel", wheel); };
  }, []);

  const pointerX = pointer.current.x * 7;
  const pointerY = pointer.current.y * 5;

  return (
    <main className="spiral-archive">
      <div className="spiral-grid" aria-hidden="true" />
      <div className="spiral-noise" aria-hidden="true" />

      <header className="spiral-header">
        <Link href="/" className="spiral-logo" aria-label="返回首页">
          <span className="spiral-logo-eye eye-one" /><span className="spiral-logo-eye eye-two" /><span className="spiral-logo-mouth" />
        </Link>
        <div className="spiral-switch" role="tablist" aria-label="作品浏览模式">
          <button className={mode === "spiral" ? "is-active" : ""} onClick={() => setMode("spiral")}>spiral</button>
          <i>•</i>
          <button className={mode === "list" ? "is-active" : ""} onClick={() => setMode("list")}>list</button>
        </div>
        <button className={`spiral-menu-button${menuOpen ? " is-open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>menu <b>•</b></button>
      </header>

      {mode === "spiral" ? (
        <section className="spiral-stage" aria-label="影像作品无限浏览墙">
          {tiles.map((tile, index) => {
            const [x, y, rotation, scale] = positions[index % positions.length];
            const drift = Math.sin(frame * 3 + index * 1.7) * 2.8;
            const orbit = Math.cos(frame * 2.2 + index) * 2.2;
            return <Link key={`${tile.slug}-${index}`} href={`/photography/${tile.slug}`} className={`spiral-tile spiral-tile-${index + 1}`} style={{ transform: `translate3d(calc(-50% + ${(x + orbit) * 1}vw), calc(-50% + ${(y + drift) * 1}vh), 0) rotateX(${pointerY + rotation}deg) rotateY(${pointerX - rotation / 2}deg) rotateZ(${rotation + Math.sin(frame * 2 + index) * 1.8}deg) scale(${scale})`, backgroundImage: `url(${tile.image})` }} aria-label={`打开 ${tile.title}`}><span>{tile.index} / {tile.title}</span></Link>;
          })}
        </section>
      ) : (
        <section className="spiral-list" aria-label="影像项目列表">
          {projects.map((project) => <Link href={`/photography/${project.slug}`} key={project.slug}><span>{project.index}</span><strong>{project.title}</strong><small>{project.year}</small></Link>)}
        </section>
      )}

      <div className="spiral-showreel" aria-hidden="true"><div className="spiral-showreel-ring">showreel&nbsp; • &nbsp;2026&nbsp; • &nbsp;showreel&nbsp; • &nbsp;2026&nbsp; • &nbsp;</div><div className="spiral-showreel-image" style={{ backgroundImage: `url(${projects[0]?.cover})` }} /></div>
      <button className="spiral-sound" onClick={() => setMuted(!muted)} aria-label={muted ? "打开声音" : "关闭声音"}><SoundIcon muted={muted} /></button>
      <div className="spiral-footer"><span>影像档案 / {projects.length.toString().padStart(2, "0")} PROJECTS</span><span>SCROLL / MOVE / CLICK</span></div>

      {menuOpen && <div className="spiral-menu-panel"><div><span>MENU</span><button onClick={() => setMenuOpen(false)}>close ×</button></div><nav><Link href="/">首页</Link><Link href="/photography">影像</Link><Link href="/graphic">平面</Link><Link href="/#contact">联系</Link></nav><a href="mailto:1579713724@qq.com">1579713724@qq.com ↗</a></div>}
    </main>
  );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./DriftWall.css";

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const columnFactor = (index, variance) => (((index * 0.6180339887 + 0.35) % 1) * 2 - 1) * variance + 1;

export default function DriftWall({
  items = [], columns = 3, tileWidth = 176, tileHeight = 118, gap = 16, radius = 3,
  tilt = 12, turn = -9, roll = 0, perspective = 1200, depth = 110, speed = 28,
  direction = "up", variance = 0.35, parallax = 0.45, pauseOnHover = false, lift = 54,
  fade = 0.58, dim = 0.7, grayscale = true, overlayColor = "#111312", className = "", style,
}) {
  const containerRef = useRef(null); const planeRef = useRef(null); const trackRefs = useRef([]); const rafRef = useRef(null);
  const offsetsRef = useRef([]); const velocitiesRef = useRef([]); const hoveredColRef = useRef(-1); const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 }); const pointerDampedRef = useRef({ x: 0, y: 0 }); const lastTsRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(520); const [activeId, setActiveId] = useState(null); const activeIdRef = useRef(null); const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); const onChange = e => setReduced(e.matches);
    mq.addEventListener("change", onChange); return () => mq.removeEventListener("change", onChange);
  }, []);

  const columnItems = useMemo(() => { const cols = Array.from({ length: columns }, () => []); items.forEach((item, i) => cols[i % columns].push(item)); return cols.map(col => col.length ? col : items.slice(0, 1)); }, [items, columns]);
  const columnMeta = useMemo(() => { const unit = tileHeight + gap; return columnItems.map(col => { const copyHeight = Math.max(unit, col.length * unit); const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1); return { copyHeight, copies }; }); }, [columnItems, tileHeight, gap, containerHeight]);
  useLayoutEffect(() => { if (!containerRef.current) return undefined; const ro = new ResizeObserver(([entry]) => setContainerHeight(entry.contentRect.height || 520)); ro.observe(containerRef.current); return () => ro.disconnect(); }, []);
  const baseVelocities = useMemo(() => { const dirSign = direction === "up" ? 1 : -1; return columnItems.map((_, c) => speed * columnFactor(c, variance) * dirSign * (c % 2 === 0 ? 1 : -1)); }, [columnItems, speed, direction, variance]);
  useEffect(() => { offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1)); velocitiesRef.current = columnItems.map(() => 0); }, [columnMeta, columnItems]);
  const applyPlaneTransform = useCallback((px, py) => { if (planeRef.current) planeRef.current.style.transform = `translate(-50%, -50%) scale(1.08) rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`; }, [tilt, turn, roll, depth]);

  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts; const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000); lastTsRef.current = ts;
      const maxTilt = parallax * 8; const damp = 1 - Math.exp(-dt / 0.12); const targetX = pointerRef.current.x * maxTilt; const targetY = -pointerRef.current.y * maxTilt;
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp; pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp; applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      for (let c = 0; c < trackRefs.current.length; c++) { const meta = columnMeta[c]; if (!meta) continue; const paused = wallHoveredRef.current && pauseOnHover; const factor = paused || hoveredColRef.current === c ? 0 : 1; const target = reduced ? 0 : baseVelocities[c] * factor; const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28)); velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease; let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt; next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight; offsetsRef.current[c] = next; if (trackRefs.current[c]) trackRefs.current[c].style.transform = `translate3d(0, ${-next}px, 0)`; }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; lastTsRef.current = null; };
  }, [applyPlaneTransform, baseVelocities, columnMeta, pauseOnHover, parallax, reduced]);

  const release = useCallback(() => { activeIdRef.current = null; hoveredColRef.current = -1; setActiveId(null); }, []);
  const handlePointerMove = useCallback(e => { const rect = containerRef.current?.getBoundingClientRect(); if (!rect) return; if (parallax > 0 && !reduced) pointerRef.current = { x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 }; const hit = document.elementFromPoint(e.clientX, e.clientY); const tile = hit?.closest?.("[data-tile-id]"); if (!tile || tile.dataset.tileId === activeIdRef.current) return; activeIdRef.current = tile.dataset.tileId; hoveredColRef.current = Number(tile.dataset.col); setActiveId(tile.dataset.tileId); }, [parallax, reduced]);
  const renderTile = (item, id, colIndex) => { const inner = <span className="drift-wall__inner"><img src={item.image} alt={item.title ?? ""} loading="lazy" decoding="async" draggable={false} /><span className="drift-wall__overlay" aria-hidden="true" /></span>; const props = { className: `drift-wall__tile${activeId === id ? " is-active" : ""}`, "data-tile-id": id, "data-col": colIndex, onFocus: () => { activeIdRef.current = id; hoveredColRef.current = colIndex; setActiveId(id); }, onBlur: release }; return item.href ? <a key={id} href={item.href} {...props}>{inner}</a> : <div key={id} tabIndex={0} role="button" aria-label={item.title ?? "tile"} {...props}>{inner}</div>; };
  const cssVars = { "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`, "--dw-gap": `${gap}px`, "--dw-radius": `${radius}px`, "--dw-perspective": `${perspective}px`, "--dw-lift": `${lift}px`, "--dw-dim": dim, "--dw-gray": grayscale ? 1 : 0, "--dw-overlay": overlayColor, "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`, ...style };

  return <div ref={containerRef} className={`drift-wall${reduced ? " drift-wall--reduced" : ""} ${className}`} style={cssVars} onPointerMove={handlePointerMove} onPointerEnter={() => { wallHoveredRef.current = true; }} onPointerLeave={() => { wallHoveredRef.current = false; pointerRef.current = { x: 0, y: 0 }; release(); }} role="group" aria-label="Drifting wall of tiles"><div ref={planeRef} className="drift-wall__plane">{columnItems.map((col, c) => { const meta = columnMeta[c]; return <div className="drift-wall__col" key={`col-${c}`}><div className="drift-wall__track" ref={el => { trackRefs.current[c] = el; }}>{Array.from({ length: meta.copies }).flatMap((_, copyIndex) => col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)) )}</div></div>; })}</div></div>;
}

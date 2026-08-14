"use client";

import { useEffect, useState } from "react";
import GooeyNav from "./GooeyNav";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`nav shell nav-floating${scrolled ? " is-scrolled" : ""}`} aria-label="主导航">
      <a className="brand" href="/"><span>PC</span><small>IMAGE MAKER</small></a>
      <GooeyNav items={[{ label: "关于我", href: "/#about" }, { label: "作品", href: "/#work" }, { label: "联系", href: "/#contact" }]} particleCount={6} particleDistances={[58, 8]} particleR={70} animationTime={520} timeVariance={220} />
      <a className="nav-contact" href="mailto:1579713724@qq.com">开始一个项目 <span>↗</span></a>
    </nav>
  );
}

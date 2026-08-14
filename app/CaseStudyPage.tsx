import Link from "next/link";
import SiteNav from "./SiteNav";
import type { PortfolioProject } from "./portfolio-data";
import VideoPlayer from "./VideoPlayer";

export function CaseStudyPage({ type, project, backHref }: { type: "影像" | "平面"; project: PortfolioProject; backHref: string }) {
  const isVideo = type === "影像";
  return (
    <main className="case-page">
      <SiteNav />
      <div className="shell case-shell">
        <div className="case-topbar"><Link href="/">← 首页</Link><Link href={backHref}>↑ 上一级</Link><Link href={isVideo ? "/graphic" : "/photography"}>{isVideo ? "平面" : "影像"} ↗</Link></div>
        <header className="case-header"><span className="case-index">{project.index} / {isVideo ? "MOVING IMAGE" : "GRAPHIC"}</span><h1>{project.title}</h1><p>{project.subtitle}</p></header>
        {isVideo && project.video ? <VideoPlayer src={project.video} poster={project.cover} /> : <div className="case-hero-image" style={{ backgroundImage: `url(${project.cover})` }} />}
        <div className="case-intro"><p>{project.intro}</p><div className="case-meta"><span>{project.year}</span><span>{project.role}</span></div></div>
        <div className="case-gallery">{project.gallery.map((image, index) => <div className={`case-gallery-image gallery-${index + 1}`} key={image} style={{ backgroundImage: `url(${image})` }} />)}</div>
        <div className="case-details"><span>PROCESS / ROLE</span><div>{project.details.map((detail) => <p key={detail}>{detail}</p>)}</div></div>
        <div className="case-next"><span>KEEP EXPLORING</span><Link href={backHref}>查看全部{type}作品 ↗</Link></div>
      </div>
    </main>
  );
}

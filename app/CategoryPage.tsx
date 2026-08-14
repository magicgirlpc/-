import Link from "next/link";
import SiteNav from "./SiteNav";
import type { PortfolioProject } from "./portfolio-data";

export function CategoryPage({ type, projects }: { type: "影像" | "平面"; projects: PortfolioProject[] }) {
  const isVideo = type === "影像";
  return (
    <main className="archive-page">
      <SiteNav />
      <div className="shell archive-shell">
        <header className="archive-header">
          <Link className="archive-back" href="/#work">← 返回首页</Link>
          <div className="archive-kicker"><span>ARCHIVE / 2026</span><span>{isVideo ? "MOVING IMAGE" : "GRAPHIC / STILL"}</span></div>
          <h1>{type}</h1>
          <p>{isVideo ? "视频作品 / 影像叙事 / 现场记录" : "平面作品 / 静物摄影 / 视觉设计"}</p>
        </header>
        <section className={`archive-grid ${isVideo ? "is-video" : "is-graphic"}`} aria-label={`${type}项目列表`}>
          {projects.map((project) => (
            <Link href={`/${isVideo ? "photography" : "graphic"}/${project.slug}`} className="archive-card" key={project.slug}>
              <div className="archive-card-media" style={{ backgroundImage: `url(${project.cover})` }}>
                <span className="archive-card-index">{project.index}</span>
                <span className="archive-card-type">{isVideo ? "PLAY FILM ↗" : "VIEW IMAGE ↗"}</span>
              </div>
              <div className="archive-card-info"><div><h2>{project.title}</h2><p>{project.subtitle}</p></div><span>{project.year}</span></div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

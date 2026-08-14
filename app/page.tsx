import type { Metadata } from "next";
import DriftWall from "./DriftWall";
import SiteNav from "./SiteNav";

export const metadata: Metadata = {
  title: "张鹏程 — 编导 / 摄影 / 剪辑",
  description: "张鹏程的个人影像作品集：编导、摄影与剪辑。",
};

const skills = [
  ["01", "导演与编导", "从一个洞察出发，把产品、人物和情绪组织成有记忆点的叙事。"],
  ["02", "摄影与灯光", "理解不同影像设备的脾气，用镜头语言建立质感与现场真实。"],
  ["03", "剪辑与调色", "熟悉从素材整理到成片交付的完整后期流程，精准控制节奏与情绪。"],
  ["04", "制片与协作", "跨团队沟通、现场统筹、设备管理和应急处理，让创意真正落地。"],
];

const walls = {
  image: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
  ],
  graphic: [
    "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
  ],
};

export default function Home() {
  return (
    <main>
      <SiteNav />
      <section className="hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2200&q=80" aria-hidden="true">
          <source src="https://cdn.coverr.co/videos/coverr-a-man-filming-with-a-camera-1572/1080p.mp4" type="video/mp4" />
        </video>
        <div className="hero-wash" />
        <div className="hero-content shell">
          <div className="hero-meta"><span>ZHANG PENGCHENG<br />IMAGE MAKER</span><span>SHANGHAI<br />2026</span></div>
          <h1>IMAGE<br /><span>WORKS</span></h1>
          <p className="hero-side-copy">DIRECTOR<br />PHOTOGRAPHY<br />EDITING</p>
          <div className="hero-bottom">
            <p>编导 / 摄影 / 剪辑<br />为品牌与人物，留下有温度的影像。</p>
            <a className="scroll-cue" href="#about">向下探索 <span>↓</span></a>
          </div>
        </div>
        <div className="hero-index">01 <span>/</span> 05</div>
      </section>

      <section className="about shell section" id="about">
        <div className="section-label"><span>01</span><span>关于我</span></div>
        <div className="about-grid">
          <div className="portrait-wrap">
            <div className="portrait-art" role="img" aria-label="影像工作者在片场使用摄影机的肖像占位图" />
            <span className="portrait-note">PORTRAIT / 2026</span>
          </div>
          <div className="about-copy">
            <p className="kicker">你好，我是张鹏程</p>
            <h2>从前期的一个想法，<br /><span>到最后一帧。</span></h2>
            <p className="body-copy">我是一名来自上海的影像工作者，3 年深耕数码 3C 与影像产品领域。现在在索尼中国负责从选题、脚本、拍摄到剪辑调色的全流程内容创作。</p>
            <p className="body-copy">我相信好的影像不只是“好看”，它应该准确地传递感受，让品牌、人物和观众之间产生真实的连接。</p>
            <a className="text-link" href="mailto:1579713724@qq.com">1579713724@qq.com <span>↗</span></a>
          </div>
        </div>
        <div className="stats"><div><strong>03</strong><span>年大厂经验</span></div><div><strong>10<span>+</span></strong><span>品牌项目</span></div><div><strong>300W<span>+</span></strong><span>AR 特效下载量</span></div><div><strong>01</strong><span>个自有工作室</span></div></div>
      </section>

      <section className="work shell section" id="work">
        <div className="section-head"><div className="section-label"><span>02</span><span>作品集</span></div><p>Selected categories<br />Archive / 2026</p></div>
        <div className="category-grid">
          <a className="category-card category-photo" href="/photography" aria-label="进入影像作品集">
            <div className="category-card-top"><span>01</span><span>Moving Image / Still Image</span></div>
            <div className="drift-holder"><DriftWall items={walls.image.map((image, index) => ({ image, title: `影像作品 ${index + 1}` }))} columns={3} tileWidth={148} tileHeight={100} gap={14} tilt={11} turn={-8} speed={24} /></div>
            <div className="category-title"><h2>影像</h2><span>↗</span></div>
            <p>人物 / 产品 / 现场<br />以光线和构图，建立画面的秩序。</p>
          </a>
          <a className="category-card category-graphic" href="/graphic" aria-label="进入平面作品集">
            <div className="category-card-top"><span>02</span><span>Graphic / Design</span></div>
            <div className="drift-holder"><DriftWall items={walls.graphic.map((image, index) => ({ image, title: `平面作品 ${index + 1}` }))} columns={3} tileWidth={148} tileHeight={100} gap={14} tilt={11} turn={8} speed={24} /></div>
            <div className="category-title"><h2>平面</h2><span>↗</span></div>
            <p>视觉 / 海报 / 设计<br />让信息拥有更清晰的形状。</p>
          </a>
        </div>
      </section>

      <section className="strengths section" id="strengths">
        <div className="shell"><div className="section-label"><span>03</span><span>我能做什么</span></div><div className="strengths-intro"><h2>不止是<br /><span>按下录制。</span></h2><p>好的结果来自对全流程的理解。<br />从策略到执行，让每个环节彼此成就。</p></div><div className="skill-grid">{skills.map(([number, title, body]) => <article className="skill" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><b>↗</b></article>)}</div></div>
      </section>

      <footer className="footer section" id="contact"><div className="shell"><div className="section-label"><span>04</span><span>联系我</span></div><div className="footer-main"><p className="kicker">有一个故事想讲？</p><h2>我们从一句<br /><em>你好</em>开始。</h2><a className="big-email" href="mailto:1579713724@qq.com">1579713724@qq.com <span>↗</span></a></div><div className="footer-bottom"><span>© 2026 ZHANG PENGCHENG</span><span>SHANGHAI / CHINA</span><a href="#top">回到顶部 ↑</a></div></div></footer>
    </main>
  );
}

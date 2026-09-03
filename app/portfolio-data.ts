export type PortfolioProject = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  cover: string;
  video?: string;
  intro: string;
  details: string[];
  gallery: string[];
};

export const movingImageProjects: PortfolioProject[] = [
  {
    slug: "brand-film-01",
    index: "01",
    title: "Brand Film 01",
    subtitle: "把一件事，拍出它的气质。",
    role: "导演 / 摄影 / 剪辑",
    year: "2026",
    cover: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-a-man-filming-with-a-camera-1572/1080p.mp4",
    intro: "从一个核心概念开始，完成一支具有完整叙事和视觉质感的品牌影像。",
    details: ["Concept / Direction", "Production / Camera", "Edit / Color Grading"],
    gallery: ["https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "portrait-story-02",
    index: "02",
    title: "Portrait Story 02",
    subtitle: "让人物自己说话。",
    role: "编导 / 摄影 / 后期",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-man-in-a-recording-studio-1571/1080p.mp4",
    intro: "用克制的镜头、自然的声音和真实的停顿，记录人物与品牌之间的关系。",
    details: ["Interview / Story", "Portrait / Lighting", "Edit / Sound"],
    gallery: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "live-documentary-03",
    index: "03",
    title: "Live Documentary 03",
    subtitle: "现场，是最好的剧本。",
    role: "摄影 / 现场导演 / 剪辑",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=85",
    intro: "在不可重复的现场里，捕捉情绪、节奏和人与人之间发生的瞬间。",
    details: ["Live Capture", "Multi-camera", "Documentary Edit"],
    gallery: ["https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "product-film-04",
    index: "04",
    title: "Product Film 04",
    subtitle: "让产品在光线里发生。",
    role: "导演 / 摄影 / 剪辑",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-a-man-filming-with-a-camera-1572/1080p.mp4",
    intro: "以材质、动作和声音建立产品的观看秩序，为品牌留下清晰而有力的视觉记忆。",
    details: ["Product Narrative", "Camera / Lighting", "Edit / Sound"],
    gallery: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "city-notes-05",
    index: "05",
    title: "City Notes 05",
    subtitle: "在城市的呼吸里取景。",
    role: "编导 / 摄影 / 后期",
    year: "2023",
    cover: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-man-in-a-recording-studio-1571/1080p.mp4",
    intro: "记录城市、人物与现场的流动关系，让不可复制的片刻保留自己的速度。",
    details: ["Field Research", "Documentary Camera", "Post-production"],
    gallery: ["https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "sound-and-light-06",
    index: "06",
    title: "Sound & Light 06",
    subtitle: "画面之外，还有声音。",
    role: "影像 / 声音 / 剪辑",
    year: "2023",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-a-man-filming-with-a-camera-1572/1080p.mp4",
    intro: "把声音作为叙事的一部分，让节奏、空间和画面共同完成一次情绪表达。",
    details: ["Sound Direction", "Live Recording", "Final Cut"],
    gallery: ["https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "human-scale-07",
    index: "07",
    title: "Human Scale 07",
    subtitle: "靠近一点，看见真实。",
    role: "人物 / 采访 / 影像",
    year: "2022",
    cover: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-man-in-a-recording-studio-1571/1080p.mp4",
    intro: "从人物的动作、停顿和眼神里寻找叙事，让每一个人都成为自己的主角。",
    details: ["Portrait Direction", "Interview", "Color / Sound"],
    gallery: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "archive-fragments-08",
    index: "08",
    title: "Archive Fragments 08",
    subtitle: "未完成，也是一种状态。",
    role: "实验影像 / 摄影 / 编辑",
    year: "2022",
    cover: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85",
    video: "https://cdn.coverr.co/videos/coverr-a-man-filming-with-a-camera-1572/1080p.mp4",
    intro: "作为持续更新的实验档案，收集灵感、测试、片段与那些还没有被命名的画面。",
    details: ["Visual Research", "Moving Image", "Archive"],
    gallery: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85"],
  },
];

export const graphicProjects: PortfolioProject[] = [
  {
    slug: "object-study-01",
    index: "01",
    title: "Object Study 01",
    subtitle: "物体，也有自己的光。",
    role: "概念 / 摄影 / 视觉设计",
    year: "2026",
    cover: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1800&q=85",
    intro: "以物为主角，探索材质、色彩和空间在静态画面中的关系。",
    details: ["Art Direction", "Still Life", "Visual System"],
    gallery: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "form-and-texture-02",
    index: "02",
    title: "Form & Texture 02",
    subtitle: "把触感留在画面里。",
    role: "视觉概念 / 平面 / 后期",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1800&q=85",
    intro: "从形态和肌理出发，为产品和信息建立具有辨识度的视觉语法。",
    details: ["Visual Concept", "Campaign Key Visual", "Retouching"],
    gallery: ["https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1400&q=85"],
  },
  {
    slug: "quiet-composition-03",
    index: "03",
    title: "Quiet Composition 03",
    subtitle: "留白，也是设计的一部分。",
    role: "构图 / 摄影 / 设计",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1800&q=85",
    intro: "在安静的构图里，让信息、比例和质感彼此呼吸。",
    details: ["Composition", "Editorial Image", "Graphic Direction"],
    gallery: ["https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=85", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85"],
  },
];

export const getProjects = (category: "photography" | "graphic") => category === "photography" ? movingImageProjects : graphicProjects;

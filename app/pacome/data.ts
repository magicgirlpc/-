export type PacomeProject = {
  title: string;
  slug: string;
  year: string;
  image: string;
  /** A small, screen-sized derivative used only by the animated galleries. */
  previewImage?: string;
  /** A mobile-sized candidate; the browser chooses it through srcset. */
  previewImageSmall?: string;
  previewWidth?: number;
  previewHeight?: number;
  href: string;
  description: string;
  playbackId: string;
  previewVideoUrl?: string;
  videoUrl?: string;
  mainExternalUrl?: string;
  bilibiliBvid?: string;
  additionalVideos?: Array<{
    url: string;
    caption: string;
    poster?: string;
    bilibiliBvid?: string;
    externalUrl?: string;
    captionPosition?: "above" | "below";
  }>;
  styleframes: string[];
  styleframesLabel?: string;
  styleframesLayout?: "default" | "editorial";
  storyboardImages?: string[];
  storyboardImagesLabel?: string;
  usageImages?: string[];
  usageImagesLabel?: string;
  shootingPlanImage?: string;
  productImages?: Array<{
    src: string;
    previewSrc?: string;
    orientation: "landscape" | "portrait";
  }>;
  productImagesLabel?: string;
  behanceUrl?: string;
};

const root = "/sites/pacomepertant-com-b16b412f/root-8a5edab2";

function numberedCover(number: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#f2f2f0"/><text x="800" y="475" fill="#090909" font-family="Arial,Helvetica,sans-serif" font-size="360" font-weight="600" text-anchor="middle" dominant-baseline="middle">${number}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const projectTitles = [
  "ULT FIELD 1｜上市影像",
  "LinkBuds｜新品整合宣发",
  "FIRST电影展｜训练营纪实",
  "1000X十周年｜纪念内容",
  "INZONE × 温盈｜电竞内容",
  "INZONE × 绿树｜电竞内容",
  "INZONE｜品牌广告片",
  "HT-AX7｜产品体验影像",
  "当山真玲｜探店与巡演纪实",
  "橘子海｜乐队深度专访",
  "PS-LX5BT / 3BT｜新品宣发",
  "索尼音频大师说｜系列访谈",
  "Alpha 9 III｜创作者故事",
  "WH-1000XM5｜玫瑰灰宣发",
  "CH530 / CH730｜新品宣发",
  "Sony Store｜门店宣发物料",
  "BRAVIA / True RGB｜发布会",
  "INZONE｜新品发布会纪实",
  "索尼商用产品｜案例影像",
  "索尼展会｜活动影像",
  "ULT FIELD 3 / 5｜产品评测",
  "2025 CAC｜赛事影像",
] as const;

const projectDescriptions = [
  "作为新品上市内容负责人，从 ULT FIELD 1 的卖点梳理、创意策划、场景设计和手绘分镜，到拍摄与后期交付，制作开箱、体验及产品视觉素材。",
  "围绕 LinkBuds 系列新品制作官方传播内容；其中 LinkBuds 新品宣发还包括卖点梳理、概念策划、产品影像，以及与数码创作者测评内容的协同上线。",
  "作为索尼方项目负责人，协调导演组、演员与摄影部门，统筹 FIRST 训练营现场记录、主创访谈及幕后花絮；同时提供设备调试与现场应急支持。",
  "以 1000X 十周年纪念款为主题，梳理产品历程与使用体验，参与创意方向、拍摄组织及后期内容制作，让纪念主题与真实使用场景相互呼应。",
  "围绕 INZONE 与温盈电竞的合作，承担前期策划、拍摄执行和后期包装，协调人物、产品与电竞场景，使品牌信息自然融入内容表达。",
  "延续 INZONE 电竞合作内容，围绕绿树电竞的人物与竞技场景参与策划、拍摄和后期制作，兼顾产品展示与现场氛围。",
  "从脚本分镜、现场拍摄到后期包装，参与 INZONE 品牌广告片的制作；以产品功能和玩家场景串联影像节奏。",
  "围绕 HT-AX7 的组合使用方式设计生活场景，参与产品体验影像的拍摄与剪辑，让音箱的使用感受在真实场景中被看见。",
  "统筹索尼音乐艺人合作内容，对接经纪团队与活动多方；拍摄剪辑当山真玲探店 Vlog、演唱会台前幕后纪实，并推进成片发布。",
  "从采访议题、乐队沟通到现场导演及后期交付推进橘子海专访；围绕乐队成长、索尼产品使用体验与未来规划建立人物叙事。",
  "将 PS-LX5BT、3BT 唱片机的产品功能与聆听场景结合，参与宣发内容方向、拍摄执行及后期包装。",
  "围绕向征、王子建和胖雪人等嘉宾制作系列访谈，参与议题沟通、现场拍摄与剪辑包装，以人物观点串联音频产品的使用体验。",
  "以商业摄影师那岩为主角，围绕 Alpha 9 III 的 120fps 高速连拍与 AI 主体识别策划跟拍、访谈短片，负责内容方向、拍摄统筹、现场导演及后期交付。",
  "以玫瑰灰配色与生活方式为线索，参与 WH-1000XM5 宣发内容的场景构思、拍摄与后期制作，突出产品质感。",
  "梳理 CH530、CH730 的产品卖点，参与新品内容策划、产品拍摄及后期制作，形成适配不同传播渠道的视觉素材。",
  "整理门店传播所需的产品信息与视觉素材，参与 Sony Store 宣发物料的版式设计和影像制作，兼顾信息清晰度与品牌一致性。",
  "记录 BRAVIA 与 True RGB 相关发布会的产品展示、现场空间与人物互动，完成活动影像的素材整理及后期内容。",
  "围绕 INZONE 新品发布会拍摄产品、人物与现场活动，整理静帧和影像素材，用于发布会后续传播。",
  "以索尼商用产品的实际应用场景为线索，参与案例内容梳理、影像拍摄与后期制作，呈现技术方案与使用环境的联系。",
  "在不同展会和品牌活动中进行现场影像记录、素材整理与内容剪辑，保留活动现场的空间、人物和产品细节。",
  "围绕 ULT FIELD 3、5 的便携音箱体验，策划外景评测内容，完成场景拍摄与后期剪辑，展示产品在不同使用情境中的声音体验。",
  "记录 2025 反恐精英亚洲邀请赛的赛场、舞台与选手画面，梳理赛事氛围与品牌合作内容，完成后期影像剪辑。",
] as const;

export const pacomeProjects: PacomeProject[] = Array.from({ length: projectTitles.length }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const slug = `project-${number}`;
  const image = index === 0
    ? "/portfolio/project-01/cover.jpg"
    : index === 1
      ? "/portfolio/project-02/cover.jpg"
    : index === 2
      ? "/portfolio/project-03/cover.png"
    : index === 3
      ? "/portfolio/project-04/cover.jpg"
    : index === 4
      ? "/portfolio/project-05/cover.png"
    : index === 5
      ? "/portfolio/project-06/cover.webp"
    : index === 6
      ? "/portfolio/project-07/cover-main.jpg"
    : index === 7
      ? "/portfolio/project-08/cover-main.jpg"
    : index === 8
      ? "/portfolio/project-09/cover.jpg"
    : index === 9
      ? "/portfolio/project-10/cover.png"
    : index === 10
      ? "/portfolio/project-11/cover.png"
    : index === 11
      ? "/portfolio/project-12/cover.png"
    : index === 12
      ? "/portfolio/project-13/cover.jpg"
    : index === 13
      ? "/portfolio/project-14/cover.png"
    : index === 14
      ? "/portfolio/project-15/cover.png"
    : index === 15
      ? "/portfolio/project-16/cover.png"
    : index === 16
      ? "/portfolio/project-17/cover-main.png"
    : index === 17
      ? "/portfolio/project-18/cover-main.png"
    : index === 18
      ? "/portfolio/project-19/cover.png"
    : index === 19
      ? "/portfolio/project-20/cover.png"
    : index === 20
      ? "/portfolio/project-21/cover.png"
    : index === 21
      ? "/portfolio/project-22/cover.png"
      : numberedCover(number);

  return {
    title: projectTitles[index],
    slug,
    year: "",
    image,
    previewImage: `/portfolio/project-${number}/cover-optimized.jpg`,
    previewImageSmall: `/portfolio/project-${number}/cover-mobile.jpg`,
    previewWidth: 960,
    previewHeight: index === 0 || index === 1 ? 600 : index === 13 || index === 15 ? 539 : 540,
    href: `/projects/${slug}`,
    description: projectDescriptions[index],
    playbackId: "",
    previewVideoUrl: index === 0
      ? "/portfolio/project-01/video-preview.mp4"
      : index === 1
        ? "/portfolio/project-02/video-preview-web.m4v"
      : index === 3
        ? "/portfolio/project-04/video-preview.mp4"
      : index === 4
        ? "/portfolio/project-05/video-preview-web-hq.m4v"
      : index === 5
        ? "/portfolio/project-06/video-preview.mp4"
      : index === 6
        ? "/portfolio/project-07/video-preview.mp4"
      : index === 7
        ? "/portfolio/project-08/video-preview.mp4"
      : index === 8
        ? "/portfolio/project-09/video-preview.mp4"
      : index === 9
        ? "/portfolio/project-10/video-preview.mp4"
      : index === 10
        ? "/portfolio/project-11/video-preview.mp4"
      : index === 11
        ? "/portfolio/project-12/video-preview.mp4"
      : index === 12
        ? "/portfolio/project-13/video-preview.mp4"
      : index === 13
        ? "/portfolio/project-14/video-preview.mp4"
        : undefined,
    videoUrl: index === 0 ? "/portfolio/project-01/video-full.mp4" : undefined,
    mainExternalUrl: index === 8
      ? "https://www.xinpianchang.com/a13418965?from=UserProfile"
      : index === 9
      ? "https://www.xinpianchang.com/a13798300?channel=copyLink&from=webShare"
      : index === 10
        ? "https://www.xinpianchang.com/a13798315?channel=copyLink&from=webShare"
      : index === 11
        ? "https://www.bilibili.com/video/BV1uv421i7Q1/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : index === 12
        ? "https://www.xinpianchang.com/a13418516?channel=copyLink&from=webShare"
      : index === 13
        ? "https://www.xinpianchang.com/a13419156?channel=copyLink&from=webShare"
      : index === 16
        ? "https://www.bilibili.com/video/BV1Bt421P7eY/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : index === 17
        ? "https://www.bilibili.com/video/BV17te3zaENc/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : index === 18
        ? "https://www.sonystyle.com.cn/professional/solution/case/cultrual_cinema_hanlinshi2.html"
      : index === 19
        ? "https://www.bilibili.com/video/BV18b3s6SEuo/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : index === 20
        ? "https://www.bilibili.com/video/BV177VazME4n/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : index === 21
        ? "https://www.bilibili.com/video/BV1gcsJzDEgM/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862"
      : undefined,
    bilibiliBvid:
      index === 1
        ? "BV1aVi2Y7E4g"
        : index === 2
          ? "BV1YE4m1R7X4"
        : index === 3
          ? "BV1EnLy6aE8r"
        : index === 4
          ? "BV1F2AtziEK5"
        : index === 5
          ? "BV1iYMTzpEZF"
        : index === 6
          ? "BV1cdn1zNEgn"
        : index === 7
          ? "BV1ru4y1n7xw"
          : undefined,
    additionalVideos: index === 0
      ? [{
          url: "/portfolio/project-01/video-secondary-01.m4v",
          caption: "新品对比演示片",
          poster: "/portfolio/project-01/video-secondary-01-poster.jpg",
          bilibiliBvid: "BV124421X7mm",
        }]
      : index === 1
        ? [
            {
              url: "https://www.bilibili.com/video/BV1XomnY3EXS/",
              bilibiliBvid: "BV1XomnY3EXS",
              poster: "/portfolio/project-02/posters/series-01.jpg",
              caption: "LinkBuds 系列新品",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1FR2RYmE4j/",
              bilibiliBvid: "BV1FR2RYmE4j",
              poster: "/portfolio/project-02/series-02.webp",
              caption: "LinkBuds Open",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1nR2RYmEiB/",
              bilibiliBvid: "BV1nR2RYmEiB",
              poster: "/portfolio/project-02/series-03.webp",
              caption: "LinkBuds Fit",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV13Ri2YJEms/",
              bilibiliBvid: "BV13Ri2YJEms",
              poster: "/portfolio/project-02/series-04.webp",
              caption: "LinkBuds 蓝牙音箱",
              captionPosition: "above",
            },
          ]
      : index === 3
        ? [{
            url: "https://www.bilibili.com/video/BV19AL862EGS/",
            bilibiliBvid: "BV19AL862EGS",
            poster: "/portfolio/project-04/dialogue-engineer-poster.jpg",
            caption: "对话工程师 · 读懂1000X十周年典藏版静奢美学",
            captionPosition: "above",
          }]
      : index === 6
        ? [{
            url: "/portfolio/project-07/video-secondary.mp4",
            poster: "/portfolio/project-07/cover.webp",
            caption: "电竞？选索尼INZONE！",
            captionPosition: "above",
          }]
      : index === 8
        ? [{
            url: "https://www.xinpianchang.com/a13418981?from=UserProfile",
            externalUrl: "https://www.xinpianchang.com/a13418981?from=UserProfile",
            poster: "/portfolio/project-09/styleframes/styleframe-18.jpg",
            caption: "当山真玲 亚洲巡演 VLOG · 巡演篇章",
            captionPosition: "above",
          }]
      : index === 2
        ? [
            {
              url: "https://www.xinpianchang.com/a13792993?show_note=true",
              externalUrl: "https://www.xinpianchang.com/a13792993?show_note=true",
              caption: "SONY x FIRST训练营导师王昱",
              poster: "/portfolio/project-03/cover.png",
              captionPosition: "above",
            },
            {
              url: "https://www.xinpianchang.com/a13793005?channel=copyLink&from=webShare",
              externalUrl: "https://www.xinpianchang.com/a13793005?channel=copyLink&from=webShare",
              caption: "SONY x FIRST训练营-《啥是迪斯科》",
              poster: "/portfolio/project-03/cover.png",
              captionPosition: "above",
            },
            ...[
              "13793099",
              "13793114",
              "13793198",
              "13793206",
              "13793210",
            ].map((articleId, linkIndex) => ({
              url: `https://www.xinpianchang.com/a${articleId}?channel=copyLink&from=webShare`,
              externalUrl: `https://www.xinpianchang.com/a${articleId}?channel=copyLink&from=webShare`,
              caption: `SONY x FIRST 系列作品 ${String(linkIndex + 3).padStart(2, "0")}`,
              poster: "/portfolio/project-03/cover.png",
              captionPosition: "above" as const,
            })),
          ]
      : index === 11
        ? [
            {
              url: "https://www.bilibili.com/video/BV1YvGt6KEBx/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1YvGt6KEBx/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "声音制作人实测｜听胖雪人聊索尼音频好物",
              captionPosition: "above",
              poster: "/portfolio/project-12/cover.png",
            },
            {
              url: "https://www.bilibili.com/video/BV1Mxc4z5EC5",
              externalUrl: "https://www.bilibili.com/video/BV1Mxc4z5EC5",
              caption: "【索尼音频｜创作者故事】让创作被听见——阿健在写歌吗",
              captionPosition: "above",
              poster: "/portfolio/project-12/wangzijian.jpg",
            },
          ]
      : index === 16
        ? [{
            url: "https://www.bilibili.com/video/BV1LDVH6REWL/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
            externalUrl: "https://www.bilibili.com/video/BV1LDVH6REWL/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
            poster: "/portfolio/project-17/cover-secondary.jpg",
            caption: "2026索尼家庭影音娱乐新品发布会回顾",
            captionPosition: "above",
          }]
      : index === 17
        ? [
            {
              url: "https://www.bilibili.com/video/BV1My4y1K78k/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1My4y1K78k/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "【发布会回放】索尼INZONE系列电竞耳机新品发布会——INZONE Buds & INZONE H5",
              poster: "/portfolio/project-18/cover-secondary.png",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV147421R7df/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV147421R7df/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "划重点！如何找到适合自己的INZONE耳机？",
              poster: "/portfolio/project-18/cover-recommend.png",
              captionPosition: "above",
            },
          ]
      : index === 18
        ? [
            {
              url: "https://www.sonystyle.com.cn/content/professional/solution/case/enterprise_showroom_798act.html",
              externalUrl: "https://www.sonystyle.com.cn/content/professional/solution/case/enterprise_showroom_798act.html",
              caption: "索尼商业产品案例｜企业展厅 798 艺术区",
              captionPosition: "above",
            },
            {
              url: "https://www.sonystyle.com.cn/professional/solution/case/homecinema_szylbdq.html",
              externalUrl: "https://www.sonystyle.com.cn/professional/solution/case/homecinema_szylbdq.html",
              caption: "索尼商业产品案例｜家庭影院方案",
              captionPosition: "above",
            },
            {
              url: "https://www.sonystyle.com.cn/professional/solution/case/enterprise_displaydevice_xnaixjj.html",
              externalUrl: "https://www.sonystyle.com.cn/professional/solution/case/enterprise_displaydevice_xnaixjj.html",
              caption: "索尼商业产品案例｜企业显示设备",
              captionPosition: "above",
            },
            {
              url: "https://www.sonystyle.com.cn/professional/solution/case/cultrual_exhibition_srd_collection.html",
              externalUrl: "https://www.sonystyle.com.cn/professional/solution/case/cultrual_exhibition_srd_collection.html",
              caption: "索尼商业产品案例｜文化展览空间",
              captionPosition: "above",
            },
            {
              url: "https://www.sonystyle.com.cn/professional/solution/case/retail_zhoudafu.html",
              externalUrl: "https://www.sonystyle.com.cn/professional/solution/case/retail_zhoudafu.html",
              caption: "索尼商业产品案例｜周大福零售空间",
              captionPosition: "above",
            },
            {
              url: "https://www.sonystyle.com.cn/professional/solution/case/traffic_displaydevice_xncjpgjjc.html",
              externalUrl: "https://www.sonystyle.com.cn/professional/solution/case/traffic_displaydevice_xncjpgjjc.html",
              caption: "索尼商业产品案例｜交通显示设备",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV17Lg3zMEnS/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV17Lg3zMEnS/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "索尼发布电影感直播新方案：“无界商显”，为坐播场景提供革新性解决方案",
              captionPosition: "above",
            },
          ]
      : index === 19
        ? [
            {
              url: "https://www.bilibili.com/video/BV1HQbQz6EFj/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1HQbQz6EFj/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "BIRTV2025 索尼展位云逛展：无界创作新娱乐，解锁技术赋能的创意自由",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1EW421X7mN/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1EW421X7mN/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "落幕不散场，听产品经理解说BIRTV2024索尼视听盛宴！",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1Qh4y127sK/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1Qh4y127sK/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "【索尼专业】云逛展｜了解BIRTV2023索尼展台黑科技",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV14M411572s/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV14M411572s/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "【索尼中国专业】CCBN精彩回顾｜带你重返CCBN2023索尼展位现场",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1xpHQevEWr/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1xpHQevEWr/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "索尼亮相China in-store 2024上海国际店铺设计与解决方案展览会",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1NoMj6mEda/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1NoMj6mEda/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "视频回顾｜索尼参展上海国际低碳智慧出行展览会",
              captionPosition: "above",
            },
            {
              url: "https://www.bilibili.com/video/BV1vDmMBTEdt/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              externalUrl: "https://www.bilibili.com/video/BV1vDmMBTEdt/?share_source=copy_web&vd_source=3bf7f54542cffc328fb72a0565f24862",
              caption: "在集美·阿尔勒相遇影像未来，沉浸式体验索尼微单15周年摄影展",
              captionPosition: "above",
            },
            {
              url: "https://www.xinpianchang.com/a13804286?from=webShare&channel=copyLink",
              externalUrl: "https://www.xinpianchang.com/a13804286?from=webShare&channel=copyLink",
              caption: "索尼展会与活动影像记录",
              captionPosition: "above",
            },
          ]
      : undefined,
    styleframes: index === 0
      ? [
          "/portfolio/project-01/storyboard-slide-05.png",
          "/portfolio/project-01/storyboard-slide-06.png",
          "/portfolio/project-01/styleframe-03.jpg",
          "/portfolio/project-01/styleframe-04.jpg",
          "/portfolio/project-01/styleframe-05.jpg",
          "/portfolio/project-01/styleframe-06.jpg",
        ]
      : index === 1
        ? Array.from({ length: 25 }, (_, frameIndex) =>
            `/portfolio/project-02/styleframes/styleframe-${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 3
        ? [8, 1, 3, 4, 5, 6, 7].map(
            (frameNumber) => `/portfolio/project-04/styleframes/styleframe-${String(frameNumber).padStart(2, "0")}.jpg`,
          )
      : index === 4
        ? Array.from({ length: 8 }, (_, frameIndex) =>
            `/portfolio/project-05/styleframes/styleframe-${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 5
        ? [12, 13, 14, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
            (frameNumber) => `/portfolio/project-06/styleframes/styleframe-${String(frameNumber).padStart(2, "0")}.webp`,
          )
      : index === 6
        ? Array.from({ length: 7 }, (_, frameIndex) =>
            `/portfolio/project-07/styleframes/styleframe-${String(frameIndex + 2).padStart(2, "0")}.webp`,
          )
      : index === 7
        ? Array.from({ length: 6 }, (_, frameIndex) =>
            `/portfolio/project-08/styleframes/styleframe-${String(frameIndex + 1).padStart(2, "0")}.webp`,
          )
      : index === 8
        ? [19, 20, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 16, 17, 18].map(
            (frameNumber) => `/portfolio/project-09/styleframes/styleframe-${String(frameNumber).padStart(2, "0")}.jpg`,
          )
      : index === 9
        ? [16, 17, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
            (frameNumber) => `/portfolio/project-10/styleframes/${String(frameNumber).padStart(2, "0")}.jpg`,
          )
      : index === 10
        ? ["/portfolio/project-11/styleframes/01.jpg", "/portfolio/project-11/styleframes/02.jpg"]
      : index === 11
        ? Array.from({ length: 12 }, (_, frameIndex) =>
            `/portfolio/project-12/styleframes/${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 12
        ? Array.from({ length: 8 }, (_, frameIndex) =>
            `/portfolio/project-13/styleframes/${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 13
        ? Array.from({ length: 8 }, (_, frameIndex) =>
            `/portfolio/project-14/styleframes/${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 15
        ? Array.from({ length: 22 }, (_, frameIndex) =>
            `/portfolio/project-16/gallery/${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 17
        ? Array.from({ length: 8 }, (_, frameIndex) =>
            `/portfolio/project-18/styleframes/${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 20
        ? Array.from({ length: 10 }, (_, frameIndex) =>
            `/portfolio/project-21/styleframe-${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 21
        ? Array.from({ length: 10 }, (_, frameIndex) =>
            `/portfolio/project-22/styleframe-${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
      : index === 2
        ? Array.from({ length: 20 }, (_, frameIndex) =>
            `/portfolio/project-03/styleframes/styleframe-${String(frameIndex + 1).padStart(2, "0")}.jpg`,
          )
        : [],
    styleframesLabel: index === 0 ? "手绘分镜" : index === 1 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13 || index === 15 || index === 17 || index === 20 || index === 21 ? "作品静帧" : index === 2 ? "作品静帧与幕后剧照" : undefined,
    styleframesLayout: index === 1 || index === 2 ? "editorial" : "default",
    storyboardImages: index === 7
      ? Array.from({ length: 3 }, (_, frameIndex) =>
          `/portfolio/project-08/storyboard/storyboard-${String(frameIndex + 1).padStart(2, "0")}.webp`,
        )
      : undefined,
    storyboardImagesLabel: index === 7 ? "分镜手稿" : undefined,
    usageImages: index === 7
      ? Array.from({ length: 8 }, (_, imageIndex) =>
          `/portfolio/project-08/usage/usage-${String(imageIndex + 1).padStart(2, "0")}.jpg`,
        )
      : index === 8
        ? [1, 2, 3, 4, 6, 7, 5, 8, 9, 10, 11, 12].map(
            (imageNumber) => `/portfolio/project-09/live/${String(imageNumber).padStart(2, "0")}.jpg`,
          )
      : undefined,
    usageImagesLabel: index === 7 ? "产品使用场景图" : index === 8 ? "演出照" : undefined,
    shootingPlanImage: index === 10 ? "/portfolio/project-11/shooting-plan.jpg" : undefined,
    productImages: index === 0
      ? [
          { src: "/portfolio/project-01/product-landscape-02.jpg", orientation: "landscape" },
          { src: "/portfolio/project-01/product-landscape-03.jpg", orientation: "landscape" },
          { src: "/portfolio/project-01/product-portrait-01.jpg", orientation: "portrait" },
          { src: "/portfolio/project-01/product-portrait-03.jpg", orientation: "portrait" },
          { src: "/portfolio/project-01/product-portrait-05.jpg", orientation: "portrait" },
          { src: "/portfolio/project-01/product-portrait-06.jpg", orientation: "portrait" },
          { src: "/portfolio/project-01/product-portrait-07.jpg", orientation: "portrait" },
          { src: "/portfolio/project-01/product-portrait-08.jpg", orientation: "portrait" },
        ]
      : index === 3
        ? [{
            src: "/portfolio/project-04/poster-design.jpg",
            previewSrc: "/portfolio/project-04/poster-design-preview.jpg",
            orientation: "portrait",
          }]
      : index === 4
        ? [
            { src: "/portfolio/project-05/behind-the-scenes/bts-01.jpg", previewSrc: "/portfolio/project-05/behind-the-scenes/bts-01-preview.webp", orientation: "landscape" },
            { src: "/portfolio/project-05/behind-the-scenes/bts-02.jpg", previewSrc: "/portfolio/project-05/behind-the-scenes/bts-02-preview.webp", orientation: "landscape" },
            { src: "/portfolio/project-05/behind-the-scenes/bts-03.jpg", previewSrc: "/portfolio/project-05/behind-the-scenes/bts-03-preview.webp", orientation: "landscape" },
            { src: "/portfolio/project-05/behind-the-scenes/bts-04.jpg", previewSrc: "/portfolio/project-05/behind-the-scenes/bts-04-preview.webp", orientation: "portrait" },
            { src: "/portfolio/project-05/behind-the-scenes/bts-05.jpg", previewSrc: "/portfolio/project-05/behind-the-scenes/bts-05-preview.webp", orientation: "portrait" },
          ]
      : index === 7
        ? [{ src: "/portfolio/project-08/concept.webp", orientation: "landscape" }]
      : index === 10
        ? [
            { src: "/portfolio/project-11/product/01.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/02.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/03.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/05.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/06.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/07.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/08.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/10.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/12.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/14.jpg", orientation: "landscape" },
            { src: "/portfolio/project-11/product/04.jpg", orientation: "portrait" },
            { src: "/portfolio/project-11/product/09.jpg", orientation: "portrait" },
            { src: "/portfolio/project-11/product/11.jpg", orientation: "portrait" },
            { src: "/portfolio/project-11/product/15.jpg", orientation: "portrait" },
          ]
      : index === 13
        ? Array.from({ length: 9 }, (_, imageIndex) => ({
            src: `/portfolio/project-14/product/${String(imageIndex + 1).padStart(2, "0")}.jpg`,
            orientation: "portrait" as const,
          }))
        : undefined,
    productImagesLabel: index === 0 ? "产品图" : index === 3 ? "产品海报一图流" : index === 4 ? "制作花絮" : index === 7 ? "制作思路" : index === 10 ? "产品图拍摄" : index === 13 ? "产品图" : undefined,
  };
});

export function getPacomeProject(slug: string) {
  return pacomeProjects.find((project) => project.slug === slug);
}

export function getNextPacomeProject(slug: string) {
  const index = pacomeProjects.findIndex((project) => project.slug === slug);
  return index < 0 ? undefined : pacomeProjects[(index + 1) % pacomeProjects.length];
}

export const pacomeAssetRoot = root;

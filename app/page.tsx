import type { Metadata } from "next";
import PortfolioExperience from "./pacome/PortfolioExperience";
import "./pacome.css";

export const metadata: Metadata = {
  title: "张鹏程｜视频编导作品集",
  description: "张鹏程的视频编导作品集，展示索尼新品宣发、品牌影像、人物专访与活动纪实项目。",
  icons: {
    icon: "/sites/pacomepertant-com-b16b412f/root-8a5edab2/favicon.svg",
  },
};

export default function Home() {
  return <PortfolioExperience />;
}

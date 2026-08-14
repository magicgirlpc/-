import type { Metadata } from "next";
import { CategoryPage } from "../CategoryPage";
import { graphicProjects } from "../portfolio-data";

export const metadata: Metadata = { title: "平面 — 张鹏程", description: "张鹏程的平面与静态视觉作品。" };
export default function GraphicPage() { return <CategoryPage type="平面" projects={graphicProjects} />; }

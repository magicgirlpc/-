import type { Metadata } from "next";
import { CategoryPage } from "../CategoryPage";
import { movingImageProjects } from "../portfolio-data";

export const metadata: Metadata = { title: "影像 — 张鹏程", description: "张鹏程的影像作品。" };
export default function PhotographyPage() { return <CategoryPage type="影像" projects={movingImageProjects} />; }

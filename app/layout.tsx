import type { Metadata } from "next";
import "./globals.css";
import ClickSpark from "./ClickSpark";

export const metadata: Metadata = {
  title: "张鹏程 — 影像工作者 / 编导 / 摄影师",
  description: "从策划、拍摄到后期，完成每一帧的表达。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><ClickSpark>{children}</ClickSpark></body></html>;
}

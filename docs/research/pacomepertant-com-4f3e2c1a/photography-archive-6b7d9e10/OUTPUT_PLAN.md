# 影像入口页克隆输出计划

## 目标

参考 `https://pacomepertant.com` 的作品集首页交互模型，把现有项目的 `/photography` 路由改造成全屏、沉浸式、可无限浏览的影像档案入口。

## 输出范围

- 应用根目录：`/Users/hepevsmbp-2/Documents/Codex/个人集/portfolio`
- 参考站点：`pacomepertant.com`
- 目标路由：`/photography`
- 保留路由：`/`、`/graphic`、`/photography/:slug`、`/graphic/:slug`
- 组件实现：`app/CategoryPage.tsx`、`app/DriftWall.jsx`、`app/DriftWall.css`
- 内容数据：`app/portfolio-data.ts`
- 页面样式：`app/globals.css` 中以 `moving-wall-*` 为前缀的作用域样式

## 设计决策

- 影像页以内容墙作为主舞台，不使用普通首屏加两列卡片作为默认入口。
- 卡片采用重复轨道和连续位移，形成无尽滚动；鼠标移动控制 3D 视差，悬停时卡片前移并恢复色彩。
- 每个卡片仍然绑定项目详情路径，便于后续替换为真实视频缩略图和实际项目内容。
- 当前数据预留 08 个影像项目，后续可继续追加，不改变页面结构。
- 常规导航被影像页专用的顶部控制层替代；左上返回首页，右上进入联系区。

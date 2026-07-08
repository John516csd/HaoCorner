# Yanchenhao's Corner

一个 scrapbook 风格的个人网站，记录前端作品、生活时间线、旅行相册、音乐偏好和一些关于我的碎片。项目基于 Next.js App Router 构建，重点放在交互、动效、响应式布局和适合个人表达的视觉细节上。

![Homepage preview](./public/og-image.png)

## 功能

- 个人首页与作品/经历展示
- 时间线、相册、音乐卡片等 scrapbook 风格组件
- 响应式布局，适配桌面端和移动端
- RSS、Sitemap、Robots、Open Graph 图片
- 本地开发用内容管理页面：`/admin/content`
- Vercel Analytics 和 Speed Insights 集成

## 技术栈

- Next.js 16 App Router
- React 18
- TypeScript
- Tailwind CSS 4 alpha
- Motion、GSAP
- Leaflet / React Leaflet
- pnpm

## 本地开发

推荐使用 Node.js 22 和 pnpm。

```bash
pnpm install
pnpm dev
```

开发服务器启动后访问：

```text
http://localhost:3000
```

常用命令：

```bash
pnpm dev        # 启动本地开发
pnpm build      # 构建生产版本
pnpm start      # 启动生产服务
pnpm typecheck  # TypeScript 类型检查
```

当前项目本地运行不需要环境变量。部署平台上的私密配置请放在 `.env.local` 或平台环境变量中，不要提交到仓库。

## 内容管理

`/admin/content` 是本地开发辅助页面，用来编辑：

- `app/data/content/photo-albums.json`
- `app/data/content/favorite-songs.json`

相关 API 位于 `app/api/admin/content/route.ts`。它只在非生产环境可用，生产环境会返回 404，避免把文件写入接口暴露到线上。

相册图片建议先压缩/优化后放入对应目录：

- `public/sichuan/optimized`
- `public/jeju/optimized`
- `public/xinjiang/optimized`
- `public/street-vibe/optimized`

原始大图目录已在 `.gitignore` 中忽略，避免把未压缩照片提交进仓库。

## 项目结构

```text
app/
  admin/content/          本地内容管理页面
  api/admin/content/      本地内容管理 API
  components/             通用组件
  components/figma-ui/    scrapbook 风格 UI 组件
  data/                   站点内容与类型
  modules/home-page/      首页模块
  og/                     Open Graph 图片路由
  rss/                    RSS 路由
public/
  cover/                  音乐封面图
  fonts/                  字体资源
  images/                 站点图片
  */optimized/            优化后的相册图片
```

## 开源与授权

本仓库的源代码使用 MIT License，详见 [LICENSE](./LICENSE)。

个人文字、照片、头像、相册图片、音乐封面、站点品牌素材和其他位于 `public/` 下的个人内容默认不包含在 MIT 授权范围内，除非文件旁另有说明。更多说明见 [NOTICE.md](./NOTICE.md)。

如果你 fork 这个项目作为个人网站模板，请替换个人信息、图片、域名、邮箱、站点验证文件和分析配置。

## 贡献

欢迎阅读代码、提 issue 或提交改进。贡献前请先看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

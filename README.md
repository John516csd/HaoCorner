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

## 黑胶室

- 收藏入口：`/music`，按歌手分箱，现有 10 位歌手、365 个专辑发行版本。纸箱最多展示 12 张唱片，宽度不再随完整目录增长；点击开箱仍可浏览该歌手全部专辑，返回时保留收藏页滚动位置。
- 中英文：收藏室右上角可切换「中文 / EN」，默认中文，选择保存在本机并同步到其他已打开的音乐页面。界面文案集中在 `app/components/vinyl-room/messages.ts`；专辑、歌曲、歌词及用户填写的内容保留原文。运行 `node --test scripts/check-music-language.mjs` 检查翻译、数量格式和目录说明。
- 共用组件：`app/components/vinyl-room`，路由组 `app/(records)` 保留同一个 Three.js 画布，让开箱与唱片架连续过渡；直接访问歌手地址或歌曲二维码仍进入唱片架。专辑详情点击空白处或按 Esc 返回。
- 添加歌手：准备专辑 JSON 和本地封面后，在 `app/components/vinyl-room/artists.ts` 登记一次，收藏箱、切换菜单、静态路由、Sitemap 和歌词接口自动使用该数据；可选 `sticker` 指向歌手标识贴纸。运行 `node --experimental-strip-types scripts/check-music-collection.mjs` 检查登记和开箱阶段顺序。
- 目录：`app/modules/music-artists/albums.json`，共 5129 条曲目，包含录音室、EP、现场、精选、原声带及不同内容版本；范围和逐张来源见该目录的 `SOURCES.md`，地区不可读的歌曲不伪造直链。
- 素材：`public/{artist}/covers`，包含封面、256px 缩略图与预模糊背景；收藏箱使用缩略图，唱片架仅保留可见唱片的高清纹理。侧边专辑索引支持滚动。
- 数据与交互计算检查：Node.js 22.18+ 运行 `node --experimental-strip-types scripts/check-eason.mjs`。另运行 `pnpm exec tsc --noEmit` 和 `pnpm build`。
- 原有 `app/modules/eason-page` 和 `app/modules/mayday-page` 保留最初已核对的数据及来源，扩充后的两个页面统一使用 `music-artists` 目录。
- 五月天数据检查：`node --experimental-strip-types scripts/check-mayday.mjs`；更改共用组件时同时运行两个检查脚本并回归两个页面。
- 完整目录交互检查：打开 `/music` 后在浏览器控制台执行 `scripts/check-complete-catalog.js`，遍历全部专辑并检查高清纹理释放。

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

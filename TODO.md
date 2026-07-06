# 个人作品集网站优化清单 (TODO)

这个清单列出了让你的手帐风格作品集更加完整和专业的优化建议。你可以按照这个清单一个个板块来补充。

## 已完成

- [x] Move homepage data out of `app/page.tsx`.
  - Extract timeline data, favorite songs, and photo folder config into `app/data`.
  - Keep `app/page.tsx` focused on layout and interaction.

- [x] Enhance photo albums.
  - Add album descriptions, locations, dates, and short travel notes.
  - Add previous / next controls in the photo preview.
  - Add keyboard arrow navigation and touch swipe support.

- [x] Add a local-only content manager for photos and songs.
  - Manage album metadata, photo stories, favorite songs, cover URLs, and tape colors.
  - Keep the manager unavailable in production.

## 高优先级（强烈建议优先补充）

### 1. 项目展示板块 (Projects Section)
作为 Frontend Engineer，这是最重要的展示区域。
- [ ] **设计卡片样式**：设计与手帐风格匹配的项目卡片（可以继续使用拍立得、相片或者剪报的样式）。
- [ ] **准备项目数据**：
  - 项目名称
  - 简短描述（解决了什么问题）
  - 技术栈标签（如 React, Next.js, Tailwind 等）
  - 链接（在线演示 Demo 链接、GitHub 源码链接）
  - 预览图或动图（展示项目界面）
- [ ] **添加到主页**：在 About 或 Timeline 之后，Music 之前添加这个板块。

### 2. 技能图谱 (Skills Section)
让访客/HR快速了解你的技术栈。
- [ ] **分类技能**：
  - 前端框架/库：React, Next.js, Vue 等
  - 语言：JavaScript, TypeScript, HTML, CSS 等
  - 工具/设计：Git, Figma 等
- [ ] **设计展示方式**：可以用进度条、手写便签列表、或者散落的贴纸（Sticker）来展示。

### 3. 工作/项目经历详情 (Experience Details)
充实目前的 Timeline 板块。
- [ ] **补充具体经历**：
  - 具体公司/团队名称
  - 职位名称（如 Frontend Engineer）
  - 主要职责和业务成就（用数据说话，比如“优化了xx页面的加载速度提升了xx%”）
- [ ] **建立简历下载入口**：提供一个 PDF 版本的简历下载按钮（可以用曲别针夹着一份文档的设计）。

---

## 中优先级（丰富内容与提升体验）

### 4. 博客入口 (Blog Section)
README 中提到支持 MDX 博客，可以把它在首页展示出来。
- [ ] **精选文章预览**：在首页展示最近的 2-3 篇博客文章。
- [ ] **文章卡片设计**：使用现有的 `NotebookPaper` 组件来展示文章摘要。
- [ ] **完善博客列表页**：确保点击后能进入完整的博客列表和阅读页面。

### 5. 完善社交链接 (Social Links)
丰富 Footer/Contact 板块的联系方式。
- [ ] 添加 LinkedIn 链接（对求职非常有帮助）。
- [ ] 添加 Twitter/X, CodePen, 或其他相关技术社区链接。
- [ ] 增加微信/微信公众号的二维码（可选，如果是针对国内用户）。

### 6. 完善关于我 (About Me)
- [ ] 补充一段更详细的自我介绍（个人理念、职业目标、兴趣爱好等）。
- [ ] 如果有同事或客户的评价（Testimonials），可以用便利贴的形式贴在墙上。

---

## 低优先级（细节打磨与功能完善）

### 7. 网站交互与功能
- [ ] **导航栏更新**：补充新增加板块的锚点链接（如 Projects, Skills, Blog）。
- [ ] **加载状态 (Loading)**：添加首屏加载动画、图片的懒加载过渡效果。
- [ ] **主题切换 (Dark Mode)**：实现 README 中提到的明暗主题切换，设计一套暗色系的手帐皮肤。
- [ ] **多语言切换 (i18n)**：如果面向国际市场，支持中英文一键切换。

### 8. 响应式细节优化
- [ ] 检查并优化新建板块在移动端的显示效果。
- [ ] 确保手写字体和贴纸在小屏幕上不会重叠或遮挡重要文本。

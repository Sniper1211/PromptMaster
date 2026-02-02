## SEO 索引优化方案

### 1. 完善基础 SEO 协议
- 在 `public` 目录下创建 `robots.txt` 文件，明确允许所有搜索引擎抓取，并指明 `sitemap.xml` 的路径。

### 2. 增强静态 HTML 语义
- 微调 `index.html` 中的 Meta 标签，确保在 JavaScript 渲染完成前，搜索引擎能看到最基础的索引指令。

### 3. 检查详情页 SEO 输出
- 验证 `PromptDetailPage.tsx` 和 `PrivacyPolicy.tsx` 中 `SEOHead` 的参数传递，确保 `canonical` 链接与站点地图中的 URL 完全一致。

### 4. 代码同步
- 完成修改后，将更改推送到远程仓库，以便您的部署环境生效。

---

**确认执行后，我将立即为您创建 `robots.txt` 并完成相关优化。**
## 管理员添加提示词功能优化计划

### 1. 改造弹窗组件 (AddPromptModal)
- 在 [AddPromptModal.tsx](file:///Users/lxx/coding/PromptMaster/src/components/admin/AddPromptModal.tsx) 中：
    - 新增 `isAdmin` 模式支持。
    - 管理员模式下**隐藏** `Coming Soon` 遮罩层。
    - 接入正式的数据库提交 API，支持一键发布。

### 2. 集成后台入口 (Admin Dashboard)
- 在 [AdminPage.tsx](file:///Users/lxx/coding/PromptMaster/src/pages/AdminPage.tsx) 中：
    - 在仪表盘头部新增“新增提示词”按钮。
    - 点击按钮后，以管理员身份唤起 `AddPromptModal`。

### 3. 实现后端提交服务
- 在 [submissionService.ts](file:///Users/lxx/coding/PromptMaster/src/services/submissionService.ts) 中：
    - 实现 `createPrompt` 函数，支持向 `/api/prompts` 发送 `POST` 请求。
    - 自动处理管理员 Token 认证。

### 4. 验证与同步
- 确保添加成功后列表自动刷新。
- 确认首页入口对普通用户依然保持遮罩状态。
- 推送所有更改到远程仓库。
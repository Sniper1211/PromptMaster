# 修复 Auto-Generate Tips 功能

## 1. 修复后端 API (`api/generate-tips.js`)
- **问题**：引用了错误的环境变量 `DEEPSEEK_API_KEY`，导致 API Key 为空。
- **修复**：将其修改为 `.env` 中定义的 `AI_API_KEY`。
- **验证**：确保 `openai` 实例初始化时使用了正确的 Key。

## 2. 增强前端错误处理 (`src/pages/AdminPage.tsx`)
- **问题**：当前端收到后端错误（如 500）时，仍然尝试读取 `usage_zh` 字段，导致显示 `undefined`。
- **修复**：
  - 在 `handleGenerateTips` 中检查 `res.ok`。
  - 如果 API 返回错误，抛出异常并显示具体错误信息（alert），而不是静默失败后显示 undefined。

## 3. 执行顺序
- 修复后端文件。
- 优化前端文件。

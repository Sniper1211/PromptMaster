# 优化 Tips 展示与批量补全

## 1. 优化前端展示 (`src/pages/PromptDetailPage.tsx`)
- **目标**：根据当前语言环境 (`i18n.language`) 智能展示对应的 Tips。
- **逻辑**：
  - 如果 `usage` 包含结构化标记（`### Chinese Tips` / `### English Tips`）：
    - `zh` 环境：只渲染中文 Tips 块。
    - `en` 环境：只渲染英文 Tips 块。
  - 如果是普通文本：照常显示。

## 2. 批量补全缺失 Tips (`scripts/generate-missing-tips.js`)
- **目标**：为所有 `usage` 字段为空的提示词自动生成双语建议。
- **逻辑**：
  - 查询 `usage IS NULL OR usage = ''` 的记录。
  - 调用 OpenAI/DeepSeek API 生成 JSON (`usage_zh`, `usage_en`)。
  - 拼接成标准格式字符串：`### Chinese Tips (中文建议)\n...\n\n### English Tips\n...`。
  - 更新数据库。
  - 增加进度保存和错误重试机制。

## 3. 执行顺序
- 修改前端展示逻辑。
- 编写并运行补全脚本。

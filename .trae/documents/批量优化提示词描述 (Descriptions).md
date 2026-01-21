# 批量优化提示词描述 (Descriptions)

## 1. 编写智能润色脚本 (`scripts/refine-descriptions.js`)
- **目标**：识别并修复质量低劣、格式错误或不完整的 `description` 和 `description_zh` 字段。
- **筛选条件**：
  - 包含 JSON 字符 `{` 或 `}`（常见的数据污染）。
  - 长度过短 (< 10 字符) 或过长 (> 300 字符)。
  - 包含 `null`、`undefined` 或重复内容。
- **修复逻辑**：
  - 使用 OpenAI/DeepSeek API。
  - 输入：Prompt 的 `title` 和 `content`。
  - 输出：精炼的 1-2 句话摘要（中英文）。
  - 更新数据库。
- **输出**：生成 Markdown 格式的优化报告。

## 2. 执行与验证
- 运行脚本（可能需要几分钟，取决于 API 速度）。
- 提交生成的报告给用户查看。

## 3. 执行顺序
- 创建并运行润色脚本。

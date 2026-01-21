# 优化 Usage Tips 前端渲染

## 1. 修改 `src/pages/PromptDetailPage.tsx`
- **目标**：将 `prompt.usage` 的纯文本内容解析为结构化的中英文展示块。
- **逻辑**：
  - 检测是否包含 `### Chinese Tips` 和 `### English Tips` 分隔符。
  - 如果包含，将其分割并分别渲染到两个不同颜色的框中（中文用黄色背景，英文用蓝色背景）。
  - 如果不包含（旧数据或手动输入的），则回退到单一文本框显示，但增加 `whitespace-pre-wrap` 以保留换行格式。
- **样式**：保持 Neo-Brutalism 风格（粗边框、标签）。

## 2. 执行顺序
- 直接修改前端组件代码。

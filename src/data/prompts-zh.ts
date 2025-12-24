import { Category, Prompt } from '../types';

export const PROMPTS_ZH: Prompt[] = [
  {
    id: '1',
    title: '现代 React 组件架构师',
    description: '创建可扩展、类型安全的 React 组件的专家指南。',
    category: Category.CODING,
    tags: ['React', 'TypeScript', '最佳实践'],
    content: 'Act as a senior frontend engineer. I will describe a UI component requirement, and you will provide a complete, well-documented TypeScript React component using Tailwind CSS. Focus on accessibility, performance, and clean code principles.',
    chineseContent: '扮演一位高级前端工程师。我将描述一个 UI 组件需求，你需要提供一个完整的、文档齐全的 TypeScript React 组件，并使用 Tailwind CSS。请关注无障碍性、性能和整洁代码原则。',
    expectedOutput: '一个包含清晰注释和现代 Hook 用法的完整 React 组件文件。'
  },
  {
    id: '2',
    title: '认知心理学故事家',
    description: '生成具有心理深度的情感共鸣叙事。',
    category: Category.CREATIVE,
    tags: ['写作', '叙事', '心理学'],
    content: 'Write a short story (approx 500 words) about a character discovering an old memory. Use sensory details to evoke emotion and incorporate a psychological concept like "anchoring" or "reminiscence bump" as a central theme.',
    chineseContent: '写一个短篇故事（约 500 字），讲述一个角色发现一段旧记忆的故事。使用感官细节来唤起情感，并将“锚定”或“怀旧性记忆提升”等心理学概念作为核心主题。',
    expectedOutput: '一个具有丰富意象和主题一致性的感人短篇故事。'
  },
  {
    id: '3',
    title: '科研论文摘要助手',
    description: '将复杂的研究浓缩为易于消化的见解。',
    category: Category.ACADEMIC,
    tags: ['研究', '摘要', '科学'],
    content: 'I will provide a snippet of a scientific research paper. Please summarize it using the "ELI5" (Explain Like I\'m 5) method first, then provide a more technical bulleted list of the key methodology, findings, and limitations.',
    chineseContent: '我将提供一段科学研究论文的片段。请首先使用“ELI5”（像给5岁孩子解释一样）的方法进行总结，然后提供一份更具技术性的要点列表，包括关键方法、发现和局限性。',
    expectedOutput: '分为两部分的总结：一个是简单的解释，一个是结构化的技术分析。'
  },
  {
    id: '4',
    title: 'SaaS 商业策略师',
    description: '制定营销策略和市场进入计划。',
    category: Category.BUSINESS,
    tags: ['营销', '策略', 'SaaS'],
    content: 'Act as a growth consultant for a new SaaS platform that automates invoice collection for freelancers. Develop a 30-day go-to-market strategy focusing on low-budget, high-impact channels.',
    chineseContent: '扮演一位新 SaaS 平台的增长顾问，该平台为自由职业者自动化发票收集。制定一个为期 30 天的市场进入策略，重点关注低预算、高影响力的渠道。',
    expectedOutput: '一份按天或按周划分的策略指南，包含具体的可执行步骤。'
  },
  {
    id: '5',
    title: 'Python 数据清洗专家',
    description: '快速生成健壮的数据预处理脚本。',
    category: Category.CODING,
    tags: ['Python', 'Pandas', '数据科学'],
    content: 'Create a Python script using Pandas that takes a messy CSV file with missing values, inconsistent date formats, and duplicate rows. The script should perform thorough cleaning and export a standardized dataset.',
    chineseContent: '创建一个使用 Pandas 的 Python 脚本，处理一个包含缺失值、日期格式不一致和重复行的混乱 CSV 文件。该脚本应执行彻底的清洗并导出标准化的数据集。',
    expectedOutput: '一个整洁、注释清晰的 Python 脚本，准备好处理数据中的边缘情况。'
  },
  {
    id: '6',
    title: 'Prompt 工程师教练',
    description: '完善和优化你自己的 Prompt。',
    category: Category.PRODUCTIVITY,
    tags: ['Meta-Prompting', '优化'],
    content: 'I will give you a draft prompt. Your job is to critique it using the following criteria: clarity, context, constraints, and goal-orientation. Then, provide an optimized version of that prompt that will yield better results from an LLM.',
    chineseContent: '我将给你一个 Prompt 草稿。你的工作是根据以下标准对其进行批评：清晰度、背景、约束和目标导向。然后，提供该 Prompt 的优化版本，以便从 LLM 获得更好的结果。',
    expectedOutput: '详细的反馈，随后是用户输入的显著改进版本。'
  },
  {
    id: '7',
    title: '全栈工程师 (i18n & 布局)',
    description: '确保 UI 在多语言切换时保持布局稳定的高级开发指令。',
    category: Category.CODING,
    tags: ['i18n', 'Frontend', 'Best Practices'],
    content: `Layout & i18n Requirement:

"In writing UI components, strictly adhere to the **'Layout Stability'** principle, especially for future multi-language (i18n) support:

1.  **Do not rely on content to size containers**: For interactive elements like buttons, nav items, and tabs, set reasonable \`min-width\` or fixed \`width\` to prevent layout jumping due to text length changes.
2.  **Unified height and alignment**: In Grid or Flex lists, card components must use \`flex-col\` and fix the height of text areas (using \`line-clamp\` and \`min-height\`) to ensure all cards align neatly.
3.  **Reserve space for titles**: The Hero Section title container should reserve enough height (\`min-height\`) to accommodate potential line wrapping in different languages.
4.  **Centered layout**: Inside fixed-size containers, use Flex centering (\`justify-center\`) by default so short text doesn't look off-center.

Goal: Regardless of how long the English text or how short the Chinese text becomes, the page skeleton should remain immovable."`,
    chineseContent: `布局与国际化 (i18n) 开发规范：

"在编写 UI 组件时，请严格遵循 **'Layout Stability'（布局稳定性）** 原则，特别是为了将来的多语言（i18n）支持：

1.  **不要依赖内容撑开容器**：对于按钮、导航项、标签等交互元素，请设置合理的 \`min-width\` 或固定 \`width\`，防止文字长短变化导致布局跳动。
2.  **统一高度与对齐**：在 Grid 或 Flex 列表中，卡片组件必须使用 \`flex-col\` 并固定文本区域的高度（使用 \`line-clamp\` 和 \`min-height\`），确保所有卡片高度整齐划一。
3.  **预留标题空间**：Hero Section 的大标题容器应预留足够的高度（\`min-height\`），以容纳可能出现的折行。
4.  **居中布局**：在固定尺寸的容器内，默认使用 Flex 居中（\`justify-center\`），确保短文本不会显得偏左或偏右。

目标是：无论将来文案变成多长的英文或多短的中文，页面的骨架结构（Skeleton）都保持不动。"`,
    expectedOutput: '一份清晰、可执行的开发规范，指导 AI 生成高质量、布局稳定的前端代码。'
  },
  {
    id: '8',
    title: '公众号封面图生成提示词',
    description: '根据内容创建吸引眼球的公众号封面图，遵循手绘插画风格和吸引力法则。',
    category: Category.CREATIVE,
    tags: ['设计', '公众号', '图像生成', '营销'],
    content: `公众号封面图生成提示词

请根据提供的内容创建一张吸引眼球的公众号封面图，遵循以下规范：

视觉风格
- 手绘插画风格，比例为 2.35:1（公众号封面标准尺寸）
- 色彩鲜明、对比强烈，确保在小尺寸预览时依然醒目
- 风格统一，避免写实元素，保持整体手绘质感

构图要求
- 主视觉元素居中或偏左（右侧预留标题区域）
- 添加 1-2 个简洁的卡通形象、图标或知名人物剪影，增强记忆点
- 若涉及敏感或版权人物，用风格相似的替代形象，不得拒绝生成
- 大量留白，突出核心信息，避免画面拥挤

文字处理
- 标题文字大而醒目，控制在 8 字以内
- 可添加 1 行副标题或关键词标签
- 字体风格与手绘插画协调统一

吸引力法则
- 使用悬念、数字、痛点等钩子元素激发点击欲望
- 视觉元素夸张有反差
- 色彩搭配参考爆款封面：橙黄、蓝紫、红黑等高对比组合

语言
- 除非另有说明，默认使用中文

请根据输入内容生成封面图。`,
    chineseContent: `公众号封面图生成提示词

请根据提供的内容创建一张吸引眼球的公众号封面图，遵循以下规范：

视觉风格
- 手绘插画风格，比例为 2.35:1（公众号封面标准尺寸）
- 色彩鲜明、对比强烈，确保在小尺寸预览时依然醒目
- 风格统一，避免写实元素，保持整体手绘质感

构图要求
- 主视觉元素居中或偏左（右侧预留标题区域）
- 添加 1-2 个简洁的卡通形象、图标或知名人物剪影，增强记忆点
- 若涉及敏感或版权人物，用风格相似的替代形象，不得拒绝生成
- 大量留白，突出核心信息，避免画面拥挤

文字处理
- 标题文字大而醒目，控制在 8 字以内
- 可添加 1 行副标题或关键词标签
- 字体风格与手绘插画协调统一

吸引力法则
- 使用悬念、数字、痛点等钩子元素激发点击欲望
- 视觉元素夸张有反差
- 色彩搭配参考爆款封面：橙黄、蓝紫、红黑等高对比组合

语言
- 除非另有说明，默认使用中文

请根据输入内容生成封面图。`,
    expectedOutput: '一张符合视觉规范的公众号封面图，或用于生成该图的详细提示词。'
  }
];

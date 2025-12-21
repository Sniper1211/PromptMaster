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
  }
];

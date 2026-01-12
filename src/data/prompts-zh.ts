import { Category, Prompt } from '../types';

export const PROMPTS_ZH: Prompt[] = [
  {
    id: '1',
    title: '现代 React 组件架构师',
    description: '创建可扩展、类型安全的 React 组件的专家指南。',
    category: Category.CODING,
    tags: ['React', 'TypeScript', '最佳实践'],
    content: 'Act as a senior frontend engineer. I will describe a UI component requirement, and you will provide a complete, well-documented TypeScript React component using Tailwind CSS. Focus on accessibility, performance, and clean code principles.\n\nRequirement: [DESCRIBE YOUR COMPONENT HERE]',
    chineseContent: '扮演一位高级前端工程师。我将描述一个 UI 组件需求，你需要提供一个完整的、文档齐全的 TypeScript React 组件，并使用 Tailwind CSS。请关注无障碍性、性能和整洁代码原则。\n\n需求：[在此处描述你的组件]',
    expectedOutput: '一个包含清晰注释和现代 Hook 用法的完整 React 组件 file。',
    usage: '将“[DESCRIBE YOUR COMPONENT HERE]”替换为你想要构建的具体 UI 元素（例如，“带有深色模式切换的响应式导航栏”）。',
    authorId: 'lucas_dev',
    model: 'GPT-4o',
    format: 'TypeScript'
  },
  {
    id: '2',
    title: '认知心理学故事家',
    description: '生成具有心理深度的情感共鸣叙事。',
    category: Category.WRITING,
    tags: ['写作', '叙事', '心理学'],
    content: 'Write a short story (approx 500 words) about a character discovering an old memory. Use sensory details to evoke emotion and incorporate a psychological concept like "anchoring" or "reminiscence bump" as a central theme.',
    chineseContent: '写一个短篇故事（约 500 字），讲述一个角色发现一段旧记忆的故事。使用感官细节来唤起情感，并将“锚定”或“怀旧性记忆提升”等心理学概念作为核心主题。',
    expectedOutput: '一个具有丰富意象和主题一致性的感人短篇故事。',
    usage: '直接复制并使用。你可以选择将“心理学概念”更改为其他内容，如“认知失调”。'
  },
  {
    id: '3',
    title: '科研论文摘要助手',
    description: '将复杂的研究浓缩为易于消化的见解。',
    category: Category.WRITING,
    tags: ['研究', '摘要', '科学'],
    content: 'I will provide a snippet of a scientific research paper. Please summarize it using the "ELI5" (Explain Like I\'m 5) method first, then provide a more technical bulleted list of the key methodology, findings, and limitations.\n\nPaper Snippet:\n[PASTE RESEARCH TEXT HERE]',
    chineseContent: '我将提供一段科学研究论文的片段。请首先使用“ELI5”（像给5岁孩子解释一样）的方法进行总结，然后提供一份更具技术性的要点列表，包括关键方法、发现和局限性。\n\n论文片段：\n[在此处粘贴研究文本]',
    expectedOutput: '分为两部分的总结：一个是简单的解释，一个是结构化的技术分析。',
    usage: '将研究论文的摘要或结论粘贴到“[PASTE RESEARCH TEXT HERE]”部分。'
  },
  {
    id: '4',
    title: 'SaaS 商业策略师',
    description: '制定营销策略和市场进入计划。',
    category: Category.BUSINESS,
    tags: ['营销', '策略', 'SaaS'],
    content: 'Act as a growth consultant for a new SaaS platform that automates invoice collection for freelancers. Develop a 30-day go-to-market strategy focusing on low-budget, high-impact channels.',
    chineseContent: '扮演一位新 SaaS 平台的增长顾问，该平台为自由职业者自动化发票收集。制定一个为期 30 天的市场进入策略，重点关注低预算、高影响力的渠道。',
    expectedOutput: '一份按天或按周划分的策略指南，包含具体的可执行步骤。',
    usage: '你可以修改“为自由职业者自动化发票收集的 SaaS 平台”来描述你自己的产品。'
  },
  {
    id: '5',
    title: 'Python 数据清洗专家',
    description: '快速生成健壮的数据预处理脚本。',
    category: Category.CODING,
    tags: ['Python', 'Pandas', '数据科学'],
    content: 'Create a Python script using Pandas that takes a messy CSV file with missing values, inconsistent date formats, and duplicate rows. The script should perform thorough cleaning and export a standardized dataset.',
    chineseContent: '创建一个使用 Pandas 的 Python 脚本，处理一个包含缺失值、日期格式不一致和重复行的混乱 CSV 文件。该脚本应执行彻底的清洗并导出标准化的数据集。',
    expectedOutput: '一个整洁、注释清晰的 Python 脚本，准备好处理数据中的边缘情况。',
    usage: '使用此提示词生成模板脚本。你可能需要调整生成代码中的列名。'
  },
  {
    id: '6',
    title: 'Prompt 工程师教练',
    description: '完善和优化你自己的 Prompt。',
    category: Category.WRITING,
    tags: ['Meta-Prompting', '优化'],
    content: 'I will give you a draft prompt. Your job is to critique it using the following criteria: clarity, context, constraints, and goal-orientation. Then, provide an optimized version of that prompt that will yield better results from an LLM.\n\nDraft Prompt: "[PASTE YOUR DRAFT PROMPT HERE]"',
    chineseContent: '我将给你一个 Prompt 草稿。你的工作是根据以下标准对其进行批评：清晰度、背景、约束和目标导向。然后，提供该 Prompt 的优化版本，以便从 LLM 获得更好的结果。\n\n草稿 Prompt："[在此处粘贴你的 Prompt 草稿]"',
    expectedOutput: '详细的反馈，随后是用户输入的显著改进版本。',
    usage: '将你想要改进的 Prompt 粘贴到占位符中。'
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
    expectedOutput: '一份清晰、可执行的开发规范，指导 AI 生成高质量、布局稳定的前端代码。',
    usage: '在要求 AI 编写前端代码之前粘贴整段内容，以确保输出的代码在国际化方面具有鲁棒性。'
  },
  {
    id: '8',
    title: '公众号封面图生成提示词',
    description: '根据内容创建吸引眼球的公众号封面图，遵循手绘插画风格和吸引力法则。',
    category: Category.COMMERCIAL,
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

输入内容: "[在此处插入文章标题或主题]"`,
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

输入内容: "[在此处插入文章标题或主题]"`,
    expectedOutput: '一张符合视觉规范的公众号封面图，或用于生成该图的详细提示词。',
    usage: '将“[在此处插入文章标题或主题]”替换为你的文章主题（例如，“10个改善睡眠的技巧”）。'
  },
  {
    id: '9',
    title: 'AdSense 审核合规与技术审计专家',
    description: '从 AdSense 通过率角度对站点进行严格合规、导航与技术 SEO 审计，并输出可执行修复方案。',
    category: Category.BUSINESS,
    tags: ['AdSense', 'SEO', '合规', '审核', '站点优化'],
    content: `# Role
你现在是一位资深的 Google AdSense 审核专家，同时也是一位精通 SEO 和前端优化的全栈工程师。

# Context
我正在开发/维护一个网站，准备申请 Google AdSense。此前申请已被拒绝，理由可能是“低价值内容”、“网站还在建设中”或“导航困难”。我的网站类型可能是在线工具站。

# Task
请扫描我的当前代码库，从“AdSense 通过率”的角度进行严格的审计，并给出具体的修改建议或代码修复方案。

# Audit Checklist (请重点检查以下项目)

## 1. 核心合规性页面 (Mandatory Compliance)
检查我的路由或页面列表中，是否**显著**包含以下页面的链接（通常在 Footer 或 Navbar）：
- [ ] Privacy Policy (隐私政策): 检查内容是否包含关于 Cookie 和第三方广告商（Google）的声明。
- [ ] Terms of Use / Disclaimer (条款/免责声明)。
- [ ] Contact Us (联系我们): 是否有真实的邮箱 mailto: 链接或工作的表单。
- [ ] About Us (关于我们): 是否存在该页面。

## 2. 网站结构与导航 (Site Structure)
- [ ] 空链接检查: 检查导航栏（Navbar）中的所有分类链接，确保没有指向 # 或 404 的死链。
- [ ] 空分类检查: 对于博客/资讯站，模拟检查分类页面，确保没有任何一个分类显示“暂无文章”。AdSense 严厉打击空分类。
- [ ] 导航清晰度: 菜单是否层级过深？建议保持在 2-3 级以内。

## 3. 技术 SEO 与体验 (Technical SEO)
- [ ] Mobile Responsiveness: 检查 CSS 布局，确保没有元素超出屏幕宽度（Horizontal Scrolling），字体在移动端是否过小。
- [ ] Loading Speed: 检查是否有未压缩的大图或阻塞渲染的 JS。
- [ ] Meta Tags: 确保每个页面都有独立的 Description 和 Title 标签，不能全站重复。
- [ ] Sitemap & Robots: 检查 sitemap.xml 是否生成正确，robots.txt 是否允许 Googlebot 抓取。

## 4. 内容价值结构化 (Content Layout for AdSense)
根据我的网站类型，检查 HTML 结构是否符合高价值特征：
- 如果是工具站 (Tool Site): 检查工具页面是否有丰富的文字说明（至少 300-500 字）。只有输入框和按钮的工具页会被判为“低价值”。请建议我在哪里添加“使用说明”、“原理介绍”或“FAQ”板块。

# Output Format
请按照以下格式给我输出报告：
1. 🚨 严重问题 (必须要改): 阻碍 AdSense 审核通过的致命错误（如缺少隐私页、存在死链）。
2. ⚠️ 警告建议 (建议优化): 可能导致“低价值内容”判定的结构问题（如工具页文字太少）。
3. 🛠 代码修复: 针对上述问题，直接给出优化的 HTML/CSS/JS 代码片段或配置文件。

当前代码库/站点结构：
[在此处粘贴你的文件列表或组件代码]`,
    chineseContent: `# Role
你现在是一位资深的 Google AdSense 审核专家，同时也是一位精通 SEO 和前端优化的全栈工程师。

# Context
我正在开发/维护一个网站，准备申请 Google AdSense。此前申请已被拒绝，理由可能是“低价值内容”、“网站还在建设中”或“导航困难”。我的网站类型可能是在线工具站。

# Task
请扫描我的当前代码库，从“AdSense 通过率”的角度进行严格的审计，并给出具体的修改建议或代码修复方案。

# Audit Checklist (请重点检查以下项目)

## 1. 核心合规性页面 (Mandatory Compliance)
检查我的路由或页面列表中，是否**显著**包含以下页面的链接（通常在 Footer 或 Navbar）：
- [ ] Privacy Policy (隐私政策): 检查内容是否包含关于 Cookie 和第三方广告商（Google）的声明。
- [ ] Terms of Use / Disclaimer (条款/免责声明)。
- [ ] Contact Us (联系我们): 是否有真实的邮箱 mailto: 链接或工作的表单。
- [ ] About Us (关于我们): 是否存在该页面。

## 2. 网站结构与导航 (Site Structure)
- [ ] 空链接检查: 检查导航栏（Navbar）中的所有分类链接，确保没有指向 # 或 404 的死链。
- [ ] 空分类检查: 对于博客/资讯站，模拟检查分类页面，确保没有任何一个分类显示“暂无文章”。AdSense 严厉打击空分类。
- [ ] 导航清晰度: 菜单是否层级过深？建议保持在 2-3 级以内。

## 3. 技术 SEO 与体验 (Technical SEO)
- [ ] Mobile Responsiveness: 检查 CSS 布局，确保没有元素超出屏幕宽度（Horizontal Scrolling），字体在移动端是否过小。
- [ ] Loading Speed: 检查是否有未压缩的大图或阻塞渲染的 JS。
- [ ] Meta Tags: 确保每个页面都有独立的 Description 和 Title 标签，不能全站重复。
- [ ] Sitemap & Robots: 检查 sitemap.xml 是否生成正确，robots.txt 是否允许 Googlebot 抓取。

## 4. 内容价值结构化 (Content Layout for AdSense)
根据我的网站类型，检查 HTML 结构是否符合高价值特征：
- 如果是工具站 (Tool Site): 检查工具页面是否有丰富的文字说明（至少 300-500 字）。只有输入框和按钮的工具页会被判为“低价值”。请建议我在哪里添加“使用说明”、“原理介绍”或“FAQ”板块。

# Output Format
请按照以下格式给我输出报告：
1. 🚨 严重问题 (必须要改): 阻碍 AdSense 审核通过的致命错误（如缺少隐私页、存在死链）。
2. ⚠️ 警告建议 (建议优化): 可能导致“低价值内容”判定的结构问题（如工具页文字太少）。
3. 🛠 代码修复: 针对上述问题，直接给出优化的 HTML/CSS/JS 代码片段或配置文件。

当前代码库/站点结构：
[在此处粘贴你的文件列表或组件代码]`,
    expectedOutput: '一份结构化的合规与技术审计报告，包含严重问题、优化建议与可执行代码修复片段。',
    usage: '将你的文件结构、组件代码或网站 URL（如果使用支持联网的 AI）粘贴到底部的占位符中。'
  },
  {
    id: '10',
    title: '超写实人群构图',
    description: '处理包含多张著名面孔和特定灯光的复杂构图。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Realistic', 'Crowd', 'Cinematic'],
    content: 'Create a hyper-realistic, ultra-sharp, full-color large-format image featuring a massive group of celebrities from different eras, all standing together in a single wide cinematic frame. The image must look like a perfectly photographed editorial cover with impeccable lighting, lifelike skin texture, micro-details of hair, pores, reflections, and fabric fibers.\n\nGENERAL STYLE & MOOD: Photorealistic, 8k, shallow depth of field, soft natural fill light + strong golden rim light. High dynamic range, calibrated color grading. Skin tones perfectly accurate. Crisp fabric detail with individual threads visible. Balanced composition, slightly wide-angle lens (35mm), center-weighted. All celebrities interacting naturally, smiling, posing, or conversing. Minimal background noise, but with enough world-building to feel real.\n\nTHE ENVIRONMENT: A luxurious open-air rooftop terrace at sunset overlooking a modern city skyline. Elements include: Warm golden light wrapping around silhouettes. Polished marble.',
    chineseContent: '创建一个超写实、超清晰的全彩大画幅图像，展示一大群来自不同时代的名人，他们都站在同一个宽阔的电影画面中。该图像必须看起来像一张拍摄完美的杂志封面，拥有无可挑剔的灯光、逼真的皮肤纹理，以及头发、毛孔、反射和织物纤维的微观细节。\n\n整体风格与基调：照片级写实，8k，浅景深，柔和的自然补光 + 强烈的金色轮廓光。高动态范围，经过校准的色彩分级。肤色完全准确。清晰的织物细节，单根线清晰可见。平衡的构图，稍广角镜头（35mm），中心加权。所有名人自然互动，微笑、摆姿势或交谈。背景噪音极小，但有足够的世界构建感。\n\n环境：日落时分，俯瞰现代城市天际线的豪华露天屋顶露台。元素包括：包裹剪影的温暖金光。抛光大理石。',
    expectedOutput: 'A detailed prompt for generating a hyper-realistic crowd image.',
    usage: '此提示词专为高端图像生成模型（如 Midjourney 或 Flux）设计。你可以将“来自不同时代的名人”修改为特定群体，如“漫威超级英雄”或“科技公司 CEO”。',
    previewImageUrl: '/previews/hyper-realistic-crowd.png'
  },
  {
    id: '11',
    title: '2000年代复古镜面自拍',
    description: '生成具有闪光灯摄影和怀旧元素的正宗2000年代早期美学。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Vintage', '2000s', 'Selfie'],
    content: 'Create a 2000s Mirror Selfie of yourself using Gemini PentaPrompt.\n\n{\n  "subject": {\n    "description": "A young woman taking a mirror selfie with very long voluminous dark waves and soft wispy bangs",\n    "age": "young adult",\n    "expression": "confident and slightly playful",\n    "hair": {\n      "color": "dark",\n      "style": "very long, voluminous waves with soft wispy bangs"\n    },\n    "clothing": {\n      "top": {\n        "type": "fitted cropped t-shirt",\n        "color": "cream white",\n        "details": "features a large cute anime-style cat face graphic with big blue eyes, whiskers, and a small pink mouth"\n      }\n    },\n    "face": {\n      "preserve_original": true,\n      "makeup": "natural glam makeup with soft pink dewy blush and glossy red pouty lips"\n    }\n  },\n  "accessories": {\n    "earrings": {\n      "type": "gold geometric hoop earrings"\n    },\n    "jewelry": {\n      "waistchain": "silver waistchain"\n    },\n    "device": {\n      "type": "smartphone",\n      "details": "patterned case"\n    }\n  },\n  "photography": {\n    "camera_style": "early-2000s digital camera aesthetic",\n    "lighting": "harsh super-flash with bright blown-out highlights but subject still visible",\n    "angle": "mirror selfie",\n    "shot_type": "tight selfie composition",\n    "texture": "subtle grain, retro highlights, V6 realism, crisp details, soft shadows"\n  },\n  "background": {\n    "setting": "nostalgic early-2000s bedroom",\n    "wall_color": "pastel tones",\n    "elements": [\n      "chunky wooden dresser",\n      "CD player",\n      "posters of 2000s pop icons",\n      "hanging beaded door curtain",\n      "cluttered vanity with lip glosses"\n    ],\n    "atmosphere": "authentic 2000s nostalgic vibe",\n    "lighting": "retro"\n  }\n}',
    chineseContent: '创建一个使用 Gemini PentaPrompt 的 2000 年代镜面自拍。\n\n（这是一个 JSON 格式的结构化提示词，包含主题描述、配件、摄影风格和背景设置。中文用户请直接复制英文 JSON 使用，以确保模型正确解析。）',
    expectedOutput: 'A structured JSON prompt for generating a 2000s style mirror selfie.',
    usage: '使用 JSON 结构进行精确控制。编辑 "subject"（主体）字段中的 hair（头发）和 clothing（服装）以匹配你想要的外观。',
    previewImageUrl: '/previews/y2k-mirror-selfie.png'
  },
  {
    id: '12',
    title: '维密风格后台摄影',
    description: '创建具有丰富细节的高魅力后台风格时尚摄影。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Fashion', 'Glamour', 'Portrait'],
    content: 'Create a glamorous photoshoot in the style of Victoria\'s Secret. A young woman attached in the uploaded reference image ( Keep the face of the person 100% accurate from the reference image ) stands almost sideways, slightly bent forward, during the final preparation for the show. Makeup artists apply lipstick to her (only her hands are visible in the frame). She is wearing a corset decorated with beaded embroidery and crystals with a short fluffy skirt, as well as large feather wings. The image has a "backstage" effect.\n\nThe background is a darkly lit room, probably under the podium. The main emphasis is on the girl\'s face and the details of her costume. Emphasize the expressiveness of the gaze and the luxurious look of the outfit. The photo is lit by a flash from the camera, which emphasizes the shine of the beads and crystals on the corset, as well as the girl\'s shiny skin. Victoria\'s Secret style: sensuality, luxury, glamour. Very detailed. Important: do not change the face.',
    chineseContent: '以维多利亚的秘密风格创作一张迷人的照片。上传参考图片中的年轻女子（保持人物面部与参考图片 100% 准确）几乎侧身站立，身体微前倾，正在进行走秀前的最后准备。化妆师正在为她涂口红（画面中只见手）。她穿着一件饰有珠绣和水晶的紧身胸衣，搭配一条蓬松短裙，还戴着巨大的羽毛翅膀。图像具有“后台”效果。\n\n背景是一个光线昏暗的房间，可能在舞台下方。主要重点是女孩的脸和服装细节。强调眼神的表现力和服装的奢华感。照片由相机闪光灯照亮，突出了紧身胸衣上珠子和水晶的光泽，以及女孩闪亮的皮肤。维多利亚的秘密风格：性感、奢华、魅力。非常详细。重要：不要改变面部。',
    expectedOutput: 'A detailed description for a high-fashion backstage photo.',
    usage: '最好配合“图生图”功能使用。如果仅通过文本生成，请删除关于“uploaded reference image”（上传参考图片）的引用。',
    previewImageUrl: '/previews/backstage-fashion.png'
  },
  {
    id: '13',
    title: '90年代胶片风格肖像',
    description: '复制特定胶片质感、闪光灯摄影和时代特定氛围的能力。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', '90s', 'Film', 'Portrait'],
    content: 'Without changing her original face, create a portrait of a beautiful young woman with porcelain-white skin, captured with a 1990s-style camera using a direct front flash. Her messy dark brown hair is tied up, posing with a calm yet playful smile. She wears a modern oversized cream sweater. The background is a dark white wall covered with aesthetic magazine posters and stickers, evoking a cozy bedroom or personal room atmosphere under dim lighting. The 35mm lens flash creates a nostalgic glow.',
    chineseContent: '在不改变她原有面貌的前提下，创作一幅皮肤白皙如瓷的美丽年轻女子的肖像，使用 90 年代风格的相机和正面直闪拍摄。她凌乱的深棕色头发扎了起来，带着平静而顽皮的微笑摆姿势。她穿着一件现代超大号米色毛衣。背景是一面贴满美学杂志海报和贴纸的暗白色墙壁，在昏暗的灯光下营造出舒适的卧室或个人房间的氛围。35mm 镜头闪光灯营造出怀旧的光辉。',
    expectedOutput: 'A prompt for a 90s style flash photography portrait.',
    usage: '专注于“直接闪光”美学。你可以将“young woman”（年轻女子）更改为任何主体描述。',
    previewImageUrl: '/previews/90s-film-portrait.png'
  },
  {
    id: '14',
    title: '一键生成商务照（硅谷风格）',
    description: '使用特定的镜头和灯光指令将休闲照片转变为专业的工作室头像。',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Business', 'Headshot', 'Professional'],
    content: 'Keep the facial features of the person in the uploaded image exactly consistent . Dress them in a professional navy blue business suit with a white shirt, similar to the reference image. Background : Place the subject against a clean, solid dark gray studio photography backdrop . The background should have a subtle gradient , slightly lighter behind the subject and darker towards the edges (vignette effect). There should be no other objects. Photography Style : Shot on a Sony A7III with an 85mm f/1.4 lens , creating a flattering portrait compression. Lighting : Use a classic three-point lighting setup . The main key light should create soft, defining shadows on the face. A subtle rim light should separate the subject\'s shoulders and hair from the dark background. Crucial Details : Render natural skin texture with visible pores , not an airbrushed look. Add natural catchlights to the eyes . The fabric of the suit should show a subtle wool texture.Final image should be an ultra-realistic, 8k professional headshot.',
    chineseContent: '保持上传图片中人物的面部特征完全一致。让他们穿上专业的深蓝色商务西装搭配白衬衫，类似于参考图片。背景：将主体置于干净、纯深灰色的摄影棚背景前。背景应有微妙的渐变，主体后方稍亮，边缘较暗（晕影效果）。不应有其他物体。摄影风格：使用 Sony A7III 搭配 85mm f/1.4 镜头拍摄，营造出讨喜的人像压缩感。灯光：使用经典的三点布光。主光应在脸上投下柔和、轮廓分明的阴影。微妙的轮廓光应将主体的肩膀和头发与黑暗背景分离开来。关键细节：渲染可见毛孔的自然皮肤纹理，而不是喷枪处理的外观。在眼睛中添加自然眼神光。西装面料应显示出微妙的羊毛质感。最终图像应为超写实、8k 专业头像。',
    expectedOutput: 'A professional headshot generation prompt.',
    usage: '专为“换脸”或“图生图”工作流设计。如果是文生图，请将“person in the uploaded image”（上传图片中的人）替换为具体的人物描述。',
    previewImageUrl: '/previews/silicon-valley-style.webp'
  },
  {
    id: '15',
    title: '情感胶片摄影',
    description: '在保持面部一致性的同时，创造出电影般怀旧的“Kodak Portra”外观。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Film', 'Emotional', 'Cinematic'],
    content: 'Keep the facial features of the person in the uploaded image exactly consistent . Style : A cinematic, emotional portrait shot on Kodak Portra 400 film . Setting : An urban street coffee shop window at Golden Hour (sunset) . Warm, nostalgic lighting hitting the side of the face. Atmosphere : Apply a subtle film grain and soft focus to create a dreamy, storytelling vibe. Action : The subject is looking slightly away from the camera, holding a coffee cup, with a relaxed, candid expression. Details : High quality, depth of field, bokeh background of city lights.',
    chineseContent: '保持上传图片中人物的面部特征完全一致。风格：使用柯达 Portra 400 胶卷拍摄的电影感、情感肖像。场景：黄金时段（日落）的城市街道咖啡馆橱窗。温暖、怀旧的光线打在脸侧。氛围：应用微妙的胶片颗粒和柔焦，营造梦幻、叙事般的氛围。动作：主体稍微看向镜头外，手持咖啡杯，表情放松、自然。细节：高质量，景深，城市灯光的散景背景。',
    expectedOutput: 'A prompt for emotional film photography style.',
    usage: '模拟柯达 Portra 400 胶卷质感。非常适合创作情绪化、电影感的肖像名。',
    // previewImageUrl: '/previews/emotional-film.png'
  },
  {
    id: '16',
    title: '专业头像生成器',
    description: '从自拍创建专业形象照，保持面部特征一致。',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Professional', 'Headshot', 'Portrait'],
    content: '"A professional, high-resolution profile photo, maintaining the exact facial structure, identity, and key features of the person in the input image. The subject is framed from the chest up, with ample headroom. The person looks directly at the camera. They are styled for a professional photo studio shoot, wearing a premium smart casual blazer in a subtle charcoal gray. The background is a solid \'#562226\' neutral studio color. Shot from a high angle with bright and airy soft, diffused studio lighting, gently illuminating the face and creating a subtle catchlight in the eyes, conveying a sense of clarity. Captured on an 85mm f/1.8 lens with a shallow depth of field, exquisite focus on the eyes, and beautiful, soft bokeh. Observe crisp detail on the fabric texture of the blazer, individual strands of hair, and natural, realistic skin texture. The atmosphere exudes confidence, professionalism, and approachability. Clean and bright cinematic color grading with subtle warmth and balanced tones, ensuring a polished and contemporary feel."',
    chineseContent: '“一张专业、高分辨率的个人资料照片，保持输入图像中人物的确切面部结构、身份和关键特征。主体取景从胸部以上，头顶留有充足空间。人物直视镜头。造型为专业摄影棚拍摄，穿着高级商务休闲西装外套，颜色为微妙的炭灰色。背景是纯色 \'#562226\' 中性摄影棚色。从高角度拍摄，明亮通风的柔和漫射演播室灯光，轻柔地照亮脸部并在眼睛中营造出微妙的眼神光，传达清晰感。使用 85mm f/1.8 镜头拍摄，浅景深，焦点精准在眼睛上，拥有美丽的柔和散景。观察西装外套面料纹理、单根头发和自然逼真皮肤纹理的清晰细节。氛围散发出自信、专业和亲和力。干净明亮的电影级调色，带有微妙的温暖和平衡的色调，确保精致和现代的感觉。”',
    expectedOutput: 'A detailed prompt for professional profile photos.',
    usage: '使用此提示词将随意自拍升级为 LinkedIn 适用的照片。需要输入图像。',
    previewImageUrl: '/previews/professional-headshot.png'
  },
  {
    id: '17',
    title: '聚光灯下的超写实动漫肖像',
    description: '具有戏剧性灯光效果的超写实动漫风格肖像。',
    category: Category.ART,
    tags: ['Anime', 'Realistic', 'Lighting', 'Portrait'],
    content: 'Generate a hyperrealistic realistic-anime portrait of a female character standing in a completely black background.\nLighting: use a **narrow beam spotlight** focused only on the center of the face. \nThe edges of the light must be sharp and dramatic. \nAll areas outside the spotlight should fall quickly into deep darkness \n(high falloff shadow), almost blending into the black background. \nNot soft lighting.\nHair: long dark hair with some strands falling over the face. The lower parts of the hair should fade into the shadows.\nPose: one hand raised gently to the lips in a shy, hesitant gesture. \nEyes looking directly at the camera with a mysterious mood.\nClothing: black long-sleeve knit sweater; \nthe sweater and body should mostly disappear into the darkness with minimal detail.\nOverall tone: dark, moody, dramatic, mysterious. \nHigh-contrast only in the lit portion of the face. \nEverything outside the spotlight should be nearly invisible.',
    chineseContent: '生成一张站在全黑背景中的女性角色的超写实写实动漫肖像。\n灯光：使用**窄光束聚光灯**仅聚焦在脸部中心。\n光线边缘必须锐利且具有戏剧性。\n聚光灯外的所有区域应迅速落入深沉的黑暗中\n（高衰减阴影），几乎融入黑色背景。\n不要柔光。\n头发：长长的黑发，几缕发丝垂在脸上。头发的下部应逐渐消失在阴影中。\n姿势：一只手轻轻举到唇边，做出害羞、犹豫的手势。\n眼睛直视镜头，带着神秘的情绪。\n服装：黑色长袖针织毛衣；\n毛衣和身体应大部分消失在黑暗中，细节极少。\n整体基调：黑暗、情绪化、戏剧性、神秘。\n仅在脸部受光部分有高对比度。\n聚光灯外的所有东西应几乎不可见。',
    expectedOutput: 'A prompt for dramatic lighting anime portrait.',
    usage: '创造高对比度、戏剧性的外观。你可以更改“female character”（女性角色）和“long dark hair”（长黑发）来定制主体。',
    previewImageUrl: '/previews/anime-spotlight.png'
  },
  {
    id: '18',
    title: '浴室镜面自拍',
    description: '具有特定造型和构图的抓拍风格镜面自拍。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Selfie', 'Lifestyle', 'Casual'],
    content: '{\n  "subject": {\n    "description": "Young woman taking bathroom mirror selfie, innocent doe eyes but the outfit tells another story",\n    "mirror_rules": "facing mirror, hips slightly angled, close to mirror filling frame",\n    "age": "early 20s",\n    \n    "expression": {\n      "eyes": "big innocent doe eyes looking up through lashes, \'who me?\' energy",\n      "mouth": "soft pout, lips slightly parted, maybe tiny tongue touching corner",\n      "brows": "soft, slightly raised, faux innocent",\n      "overall": "angel face but devil body, the contrast is the whole point"\n    },\n    \n    "hair": {\n      "color": "platinum blonde",\n      "style": "messy bun or claw clip, loose strands framing face, effortless"\n    },\n    \n    "body": {\n      "waist": "tiny",\n      "ass": "round, full, fabric of shorts riding up and clinging between cheeks, every curve visible through thin athletic material",\n      "thighs": "thick, soft, shorts barely containing"\n    },\n    \n    "clothing": {\n      "top": {\n        "type": "ULTRA mini crop tee",\n        "color": "yellow",\n        "graphic": "single BANANA logo/graphic",\n        "fit": "barely containing chest, fabric stretched tight, ends just below, shows full stomach"\n      },\n      "bottom": {\n        "type": "tight tennis skort or athletic booty shorts",\n        "color": "white",\n        "material": "thin stretchy athletic fabric",\n        "fit": "vacuum tight, riding up, clinging between cheeks, fabric creases visible, leaving nothing to imagination"\n      }\n    },\n    \n    "face": {\n      "features": "pretty - big eyes, small nose, full lips",\n      "makeup": "minimal, natural, lip gloss, no-makeup makeup"\n    }\n  },\n\n  "accessories": {\n    "headwear": {\n      "type": "Goorin Bros cap",\n      "details": "black with animal patch, worn backwards or tilted"\n    },\n    "headphones": {\n      "type": "over-ear white headphones around neck"\n    }\n  }\n}',
    chineseContent: '（这是一个高度详细的 JSON 格式提示词，用于生成特定风格的浴室自拍。建议直接复制英文 JSON 使用。）',
    expectedOutput: 'A structured JSON prompt for a specific bathroom selfie vibe.',
    usage: '高度详细的 JSON 提示词。编辑 "clothing"（服装）和 "subject"（主体）部分以更改角色的外观。'
  },
  {
    id: '19',
    title: '黑板动漫艺术记录',
    description: '黑板动漫绘画的写实记录风格。',
    category: Category.ART,
    tags: ['Art', 'Anime', 'Chalkboard', 'Realistic'],
    content: '{\n  "intent": "Photorealistic documentation of a specific chalkboard art piece featuring a single anime character, capturing the ephemeral nature of the medium within a classroom context.",\n  "frame": {\n    "aspect_ratio": "4:3",\n    "composition": "A centered medium shot focusing on the chalkboard mural. The composition includes the teacher\'s desk in the immediate foreground to provide scale, with the artwork of the single character dominating the background space.",\n    "style_mode": "documentary_realism, texture-focused, ambient naturalism"\n  },\n  "subject": {\n    "primary_subject": "A large-scale, intricate chalk drawing of [CHARACTER NAME] on a standard green classroom blackboard.",\n    "visual_details": "The illustration depicts [CHARACTER NAME] in a commanding pose, positioned centrally on the board. [ADDITIONAL DETAILS]",\n    "medium_texture": "The image preserves the dusty, matte quality of the chalk. Visible hatching and cross-hatching strokes create shading on her clothing and hair. Smudged areas on the green slate indicate where colors have been blended by hand.",\n    "surrounding_elements": "To the right of the character, vertical Japanese text reading \'[TEXT]\' is written in crisp white chalk."\n  },\n  "environment": {\n    "location": "A standard Japanese school classroom.",\n    "foreground_elements": "A wooden teacher\'s desk occupies the lower foreground. Scattered across the surface are a yellow box of colored chalks, loose sticks of red, white, and blue chalk."\n  }\n}',
    chineseContent: '（JSON 格式提示词，用于生成黑板粉笔画风格图像。）',
    expectedOutput: 'A structured JSON prompt for documenting chalkboard art.',
    usage: '将 [CHARACTER NAME] 替换为你想要的角色（例如，“火影忍者”）。'
  },
  {
    id: '20',
    title: '雪中萌犬肖像',
    description: '保持人物面部特征一致的冬季户外人宠合影。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Winter', 'Portrait', 'Pet'],
    content: '{\n  "image_description": {\n    "subject": {\n      "face": {\n        "preserve_original": true,\n        "reference_match": true,\n        "description": "The girl\'s facial features, expression, and identity must remain exactly the same as the reference image."\n      },\n      "girl": {\n        "age": "young",\n        "hair": "long, wavy brown hair",\n        "expression": "puckering her lips toward the camera",\n        "clothing": "black hooded sweatshirt"\n      },\n      "puppy": {\n        "type": "small white puppy",\n        "eyes": "light blue",\n        "expression": "calm, looking forward"\n      }\n    },\n    "environment": {\n      "setting": "outdoors in a winter scene",\n      "elements": [\n        "snow covering the ground",\n        "bare trees in the background",\n        "blurred silver car behind the girl"\n      ],\n      "sky": "clear light blue sky"\n    },\n    "mood": "cute, natural, winter outdoor moment",\n    "camera_style": "soft depth of field, natural daylight, subtle winter tones"\n  }\n}',
    chineseContent: '（JSON 格式提示词，用于生成冬季人像。）',
    expectedOutput: 'A structured JSON prompt for a winter portrait with a puppy.',
    usage: 'JSON 格式允许轻松修改 "puppy"（小狗）类型或 "environment"（环境）细节。'
  },
  {
    id: '21',
    title: '鱼眼镜头电影角色自拍',
    description: '与电影角色的夸张360度鱼眼自拍。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Fisheye', 'Selfie', 'Creative'],
    content: 'A film-like fisheye wide-angle 360-degree selfie without any camera or phone visible in the subject\'s hands. A real and exaggerated selfie of [person from uploaded image] with [CHARACTERS]. They are making faces at the camera.\n\n(more detailed version)\nA hyper-realistic fisheye wide-angle selfie, captured with a vintage 35mm fisheye lens creating heavy barrel distortion. without any camera or phone visible in the subject\'s hands.\nSubject & Action: A close-up, distorted group photo featuring [Person From Uploaded Image] taking selfie with [CHARACTERS]. Everyone is making wild, exaggerated faces, squinting slightly from the flash.\nLighting & Texture: Harsh, direct on-camera flash lighting that creates hard shadows behind the subjects. Authentic film grain, slight motion blur on the edges, and chromatic aberration. It looks like a candid, amateur snapshot as if captured during a chaotic behind-the-scenes moment, not a studio photo.',
    chineseContent: '一张类似电影的鱼眼广角 360 度自拍，拍摄者手中看不见任何相机或手机。一张[上传图片中的人]与[CHARACTERS]的真实且夸张的自拍。他们对着镜头做鬼脸。\n\n（更详细的版本）\n一张超写实的鱼眼广角自拍，使用复古 35mm 鱼眼镜头拍摄，产生严重的桶形失真。拍摄者手中看不见任何相机或手机。\n主体与动作：一张特写、变形的群像，展示[上传图片中的人]与[CHARACTERS]自拍。每个人都做着狂野、夸张的鬼脸，因闪光灯而微微眯眼。\n灯光与质感：刺眼、直接的机顶闪光灯照明，在主体身后投下生硬的阴影。真实的胶片颗粒，边缘轻微的动态模糊，以及色差。它看起来像是一张偷拍的、业余的快照，仿佛是在混乱的幕后时刻捕捉到的，而不是一张影楼照片。',
    expectedOutput: 'A prompt for a distorted fisheye selfie.',
    usage: '将 [CHARACTERS] 替换为你想要的群体（例如，“复仇者联盟”或“哈利波特演员阵容”）。'
  },
  {
    id: '22',
    title: '电影片场角色合影',
    description: '与电影角色合影，保持面部特征完全一致。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Realistic', 'Portrait', 'Fanart'],
    content: '"I\'m taking a selfie with [MOVIE CHARACTER] on the set of [MOVIE NAME].\n\nKeep the person exactly as shown in the reference image with 100% identical facial features, bone structure, skin tone, facial expression, pose, and appearance. 1:1 aspect ratio, 4K detail."',
    chineseContent: '“我正在[MOVIE NAME]的片场与[MOVIE CHARACTER]自拍。\n\n保持人物与参考图片完全一致，具有 100% 相同的面部特征、骨骼结构、肤色、面部表情、姿势和外观。1:1 纵横比，4K 细节。”',
    expectedOutput: 'A simple prompt for a selfie with a fictional character.',
    usage: '将 [MOVIE CHARACTER] 和 [MOVIE NAME] 替换为你的选择（例如，“钢铁侠”和“复仇者联盟”）。'
  },
  {
    id: '23',
    title: '博物馆艺术展自拍',
    description: '在高端博物馆与经典油画的商业级合影。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Art', 'Museum', 'Commercial'],
    content: 'A commercial grade photograph of [uploaded reference image] posing inside a high-end museum exhibition space.\n[the character Source: Based strictly on the uploaded reference image.\nBehind them hangs a large, ornate framed classical oil painting.\n\nThe painting depicts the same person but rendered in a rich,\ntraditional oil painting style with thick, visible impasto brushstrokes, deep textures, and rich color palettes on canvas.\nGallery spotlights hit the textured paint surface.\nMasterpiece, ultra-detailed, cinematic lighting, strong contrast, dramatic shadows, 8K UHD, highly detailed textures\n, professional photography.',
    chineseContent: '一张[上传参考图片]在高端博物馆展览空间内摆姿势的商业级照片。\n[角色来源：严格基于上传的参考图片。\n他们身后挂着一幅巨大的、装饰华丽的经典油画。\n\n画中描绘了同一个人，但以丰富、传统的油画风格呈现，画布上有厚实可见的厚涂笔触、深邃的纹理和丰富的调色板。\n画廊聚光灯打在有纹理的颜料表面。\n杰作，超细节，电影级灯光，强对比度，戏剧性阴影，8K UHD，高度详细的纹理，专业摄影。',
    expectedOutput: 'A prompt for a museum setting photo.',
    usage: '需要上传参考图片以获得最佳效果（“人物看着自己的画像”）。'
  },
  {
    id: '24',
    title: '相机屏幕回放效果',
    description: '模拟紧凑型数码相机屏幕上显示的复古照片效果。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Retro', 'Digital Camera', 'Simulation'],
    content: 'Use facial feature of attached photo. A close-up shot of a young woman displayed on the screen of a compact Canon digital camera. The camera body surrounds the image with its buttons, dials, and textured surface visible, including the FUNC/SET wheel, DISP button, and the "IMAGE STABILIZER" label along the side. The photo on the screen shows the woman indoors at night, illuminated by a bright built-in flash that creates sharp highlights on her face and hair. She has long dark hair falling across part of her face in loose strands, with a soft, slightly open-lip expression. The flash accentuates her features against a dim, cluttered kitchen background with appliances, shelves, and metallic surfaces softly blurred. The mood is candid, raw, nostalgic, and reminiscent of early 2000s digital camera snapshots. Colors are slightly muted with cool undertones, strong flash contrast, and natural grain from the display. No text, no logos inside the photo preview itself.\n\nScale ratio: 4:5 vertical\n\nCamera: compact digital camera simulation\nLens: equivalent to 28–35mm\nAperture: f/2.8\nISO: 400\nShutter speed: 1/60 with flash\nWhite balance: auto flash\nLighting: harsh direct flash on subject, ambient low light in the background\nColor grading: nostalgic digital-camera tones, high contrast flash, subtle display grain, authentic screen glow.',
    chineseContent: '使用附件照片的面部特征。一张紧凑型佳能数码相机屏幕上显示的年轻女子的特写镜头。相机机身围绕着图像，可见其按钮、拨盘和纹理表面，包括 FUNC/SET 轮、DISP 按钮和侧面的“IMAGE STABILIZER”标签。屏幕上的照片显示女子在夜间室内，被明亮的内置闪光灯照亮，在她的脸和头发上产生锐利的高光。她留着长长的黑发，几缕松散的发丝垂在脸上，表情柔和，嘴唇微张。闪光灯在昏暗、杂乱的厨房背景（电器、架子和金属表面柔和模糊）的衬托下突出了她的特征。这种情绪是坦率的、原始的、怀旧的，让人想起 2000 年代初的数码相机快照。颜色略微柔和，带有冷色调，强烈的闪光对比，以及显示屏自然的颗粒感。照片预览本身内部没有文字，没有徽标。',
    expectedOutput: 'A detailed prompt for simulating a camera screen view.',
    usage: '创建“画中画”效果。你可以将“young woman”（年轻女子）更改为其他主体。',
    previewImageUrl: '/previews/camera-screen-playback.webp'
  },
  {
    id: '25',
    title: '时尚杂志封面',
    description: '创建具有大标题和动态人像的精美杂志封面。',
    category: Category.COMMERCIAL,
    tags: ['Design', 'Magazine', 'Cover', 'Fashion'],
    content: 'A photo of a glossy magazine cover, the cover has the large bold words "[MAGAZINE TITLE]". The text is in a serif font, black on white, and fills the view. No other text.\n\nIn front of the text there is a dynamic portrait of [SUBJECT DESCRIPTION] in high-end fashion.\n\nPut the issue number and today\'s date in the corner along with a barcode and a price. The magazine is on a white shelf against a wall.',
    chineseContent: '一张光面杂志封面的照片，封面上写着巨大的粗体字“[MAGAZINE TITLE]”。文字采用衬线字体，白底黑字，占据了整个视野。没有其他文字。\n\n在文字前方是一张身着高端时尚服装的[SUBJECT DESCRIPTION]的动态肖像。\n\n在角落放上期号和今天的日期，以及条形码和价格。杂志放在靠墙的白色架子上。',
    expectedOutput: 'A prompt for a magazine cover design.',
    usage: '将 [MAGAZINE TITLE]（例如 "VOGUE"）和 [SUBJECT DESCRIPTION] 替换为你想要的内容。',
    // previewImageUrl: '/previews/magazine-cover.png'
  },
  {
    id: '26',
    title: '奢华产品摄影',
    description: '漂浮在水面上的高端产品摄影，配以花卉和光影。',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Product', 'Luxury', 'Commercial'],
    content: 'Product:\n[BRAND] [PRODUCT NAME] - [bottle shape], [label description], [liquid color]\n\nScene:\nLuxury product shot floating on dark water with [flower type] in [colors] arranged around it.\n[Lighting style - e.g., "golden hour glow" /\n"bright fresh light"] creates reflections and ripples across the water.\n\nMood & Style:\n[Adjectives - e.g., "ethereal and luxurious" /\n"fresh and clean"], high-end commercial photography, [camera angle], shallow depth of field with soft bokeh background',
    chineseContent: '产品：\n[BRAND] [PRODUCT NAME] - [瓶形], [标签描述], [液体颜色]\n\n场景：\n漂浮在深色水面上的奢华产品拍摄，周围布置着[颜色]的[花卉类型]。\n[灯光风格 - 例如，“黄金时刻的光辉” / “明亮清新的光线”]在水面上产生反射和涟漪。\n\n情绪与风格：\n[形容词 - 例如，“空灵奢华” / “清新干净”]，高端商业摄影，[拍摄角度]，浅景深配柔和散景背景',
    expectedOutput: 'A template prompt for luxury product photography.',
    usage: '填写括号内的部分，如 [BRAND], [PRODUCT NAME] 和 [flower type]，以生成产品照片。',
    previewImageUrl: '/previews/luxury-product-photography.webp'
  },
  {
    id: '27',
    title: '星球大战版“威利在哪里”',
    description: '包含所有星球大战角色的密集人群寻找游戏图。',
    category: Category.ART,
    tags: ['Creative', 'Crowd', 'Star Wars', 'Fun'],
    content: 'A where is waldo image showing all Star Wars characters on Tatooine\n\nFirst one to pull this off. First take. Even Waldo is there.',
    chineseContent: '一张“威利在哪里”风格的图片，展示了塔图因星球上的所有星球大战角色。\n\n第一个做到的。一次成功。甚至威利也在那里。',
    expectedOutput: 'A prompt for a crowded "Where\'s Waldo" style image.',
    usage: '有趣的提示词。你可以将“星球大战”和“塔图因”替换为其他特许经营权（例如，“霍格沃茨”的“哈利波特”）。',
    // previewImageUrl: '/previews/waldo-starwars.png'
  },
  {
    id: '28',
    title: '年龄演变摄影',
    description: '展示同一人物从年轻到80岁的年龄变化。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Aging', 'Time', 'Realistic'],
    content: '"Generate the holiday photo of this person through the ages up to 80 years old"',
    chineseContent: '“生成此人从古至今直到 80 岁的节日照片”',
    expectedOutput: 'A simple prompt for aging progression.',
    usage: '最好使用人物输入图像来查看他们的变老过程。'
  },
  {
    id: '29',
    title: '递归视觉效果',
    description: '包含无限循环逻辑的递归图像（德罗斯特效应）。',
    category: Category.ART,
    tags: ['递归', '德罗斯特效应', '无限循环', '超现实', '抽象', '视觉错觉'],
    content: 'recursive image of an orange cat sitting in an office chair holding up an iPad. On the iPad is the same cat in the same scene holding up the same iPad. Repeated on each iPad.',
    chineseContent: '一只橘猫坐在办公椅上举着 iPad 的递归图像。在 iPad 上是同一只猫在同一场景中举着同一个 iPad。在每个 iPad 上重复。',
    expectedOutput: 'A prompt for a recursive visual effect.',
    usage: '“德罗斯特效应”。将“orange cat”（橘猫）更改为任何其他主体。',
    previewImageUrl: '/previews/recursive-visual-effect.webp'
  },
  {
    id: '30',
    title: '坐标可视化',
    description: '仅根据经纬度坐标生成特定地点和时间的图像。',
    category: Category.ART,
    tags: ['Experimental', 'Location', 'Coordinates', 'Realistic'],
    content: '[LATITUDE]° N, [LONGITUDE]° E at [TIME]',
    chineseContent: '[LATITUDE]° N, [LONGITUDE]° E at [TIME]',
    expectedOutput: 'A prompt using only coordinates.',
    usage: '将占位符替换为真实坐标（例如，“35.6586° N, 139.7454° E at 19:00”代表东京塔）。'
  },
  {
    id: '31',
    title: '概念可视化',
    description: '特定群体（如工程师）对地标的解释性渲染。',
    category: Category.ART,
    tags: ['Creative', 'Conceptual', 'Abstract', 'Perspective'],
    content: 'How [PROFESSION/GROUP] see [OBJECT/LANDMARK]',
    chineseContent: 'How [PROFESSION/GROUP] see [OBJECT/LANDMARK]',
    expectedOutput: 'A conceptual prompt for abstract visualization.',
    usage: '替换占位符（例如，“工程师眼中的金门大桥”）。'
  },
  {
    id: '32',
    title: '文件名直译',
    description: '将文件名直接解释为视觉主体。',
    category: Category.ART,
    tags: ['Experimental', 'Literal', 'Abstract', 'Fun'],
    content: 'rare.jpg',
    chineseContent: 'rare.jpg',
    expectedOutput: 'A prompt testing literal interpretation of text.',
    usage: '一些模型会按字面意思解释文件名。尝试 "img_final_v2.png" 或 "confidential_evidence.jpg"。'
  },
  {
    id: '33',
    title: '多主体合成',
    description: '将多个人物肖像合成为一张表情统一的集体照。',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Composite', 'Group', 'Portrait'],
    content: 'an office team photo, everyone making a silly face',
    chineseContent: '一张办公室团队合影，每个人都做着鬼脸',
    expectedOutput: 'A prompt for group compositing.',
    usage: '简单但有效。当你上传多张参考图片到支持合成的 AI 时效果最好。'
  },
  {
    id: '34',
    title: '白板马克笔艺术',
    description: '模拟玻璃白板上的马克笔手绘效果。',
    category: Category.ART,
    tags: ['Art', 'Whiteboard', 'Sketch', 'Realistic'],
    content: 'Create a photo of [SUBJECT] drawn on a glass whiteboard in a slightly faded green marker',
    chineseContent: '创建一张用略微褪色的绿色马克笔在玻璃白板上绘制的 [SUBJECT] 的照片',
    expectedOutput: 'A prompt for specific artistic medium simulation.',
    usage: '将 [SUBJECT] 替换为你想要绘制的内容（例如，“复杂的流程图”或“蒙娜丽莎”）。'
  },
  {
    id: '35',
    title: '3D渲染分割视图',
    description: '左半部分真实渲染，右半部分线框图的对比视图。',
    category: Category.ART,
    tags: ['3D', 'Render', 'Technical', 'Design'],
    content: 'Create a high-quality, realistic 3D render of exactly one instance of the object: [OBJECT NAME].\nThe object must float freely in mid-air and be gently tilted and rotated in 3D space (not front-facing).\nUse a soft, minimalist dark background in a clean 1080×1080 composition.\nLeft Half — Full Realism\nThe left half of the object should appear exactly as it looks in real life\n— accurate materials, colors, textures, reflections, and proportions.\nThis half must be completely opaque with no transparency and no wireframe overlay.\nNo soft transition, no fading, no blending.\nRight Half — Hard Cut Wireframe Interior\nThe right half must switch cleanly to a wireframe interior diagram.\nThe boundary between the two halves must be a perfectly vertical, perfectly sharp, crisp cut line, stretching straight from the top edge to the bottom edge of the object.\nNo diagonal edges, no curved slicing, no gradient.\nThe wireframe must use only two line colors:\nPrimary: white (≈80% of all lines)\nSecondary: a color sampled from the dominant color of the realistic half (<20% of lines)\nThe wireframe lines must be thin, precise, aligned, and engineering-style.\nEvery wireframe component must perfectly match the geometry of the object.\nStrict Single-Object Rule\nRender only ONE object in the entire frame.  Render only one physical object.\nDo NOT show a second object from any angle. Do NOT show a second object for comparison or display purposes.\nOnly one single object is allowed in the entire frame.\nThe object must appear alone, floating.\nPose & Lighting:\nApply a natural, subtle tilt + rotation in 3D.',
    chineseContent: '创建对象：[OBJECT NAME] 的高质量、逼真 3D 渲染，且仅渲染一个实例。\n物体必须在半空中自由漂浮，并在 3D 空间中轻微倾斜和旋转（非正面朝向）。\n在干净的 1080×1080 构图中使用柔和、简约的深色背景。\n左半部分 — 全写实\n物体的左半部分应与现实生活中的样子完全一致\n——准确的材质、颜色、纹理、反射和比例。\n这一半必须完全不透明，没有透明度，也没有线框覆盖。\n没有柔和过渡，没有褪色，没有混合。\n右半部分 — 硬切线框内部\n右半部分必须干净利落地切换到线框内部图。\n两半之间的边界必须是一条完美垂直、完美锐利、清晰的切割线，从物体的顶部边缘一直延伸到底部边缘。\n没有对角边缘，没有弯曲切片，没有渐变。\n线框只能使用两种线条颜色：\n主色：白色（约占所有线条的 80%）\n次色：从写实半部分的主色中采样的颜色（<20% 的线条）\n线框线条必须细、精确、对齐，具有工程风格。\n每个线框组件必须与物体的几何形状完美匹配。\n严格的单对象规则\n在整个框架中仅渲染一个对象。仅渲染一个物理对象。\n不要从任何角度显示第二个对象。不要将第二个对象显示为反射、阴影、轮廓、轮廓、重影或透明度。不要显示第二个对象以进行比较或展示。\n在整个框架中仅允许一个对象。\n物体必须单独出现，漂浮。\n姿势与灯光：\n在 3D 中应用自然、微妙的倾斜 + 旋转。',
    expectedOutput: 'A complex prompt for split-view 3D rendering.',
    usage: '将 [OBJECT NAME] 替换为特定产品（例如，“橙色 iPhone 17 Pro”或“Nike Air Jordan”）。',
    previewImageUrl: '/previews/3d-split-view.webp'
  },
  {
    id: '36',
    title: '拟人化兔子自拍',
    description: '厌世脸的拟人化小兔在办公室的快照自拍，带有工牌和设计背景。',
    category: Category.PHOTOGRAPHY,
    tags: ['Anthropomorphic', 'Selfie', 'Office', 'Snapshot', 'Weary'],
    content: 'A snapshot photo of an anthropomorphic small rabbit with a weary, cynical expression. The rabbit is taking a close-up selfie (headshot), occupying the center of the frame. It wears a work badge around its neck featuring its own headshot. The photo has a casual, daily snapshot visual style with no clear subject or deliberate composition, and features slight motion blur. Background is an office setting with a computer screen showing a graphic design page nearby. The atmosphere is mundane yet unique.',
    chineseContent: '一只拟人化的小兔，以日常快照的视觉风格展现，照片中没有明确的主体或构图感，还带有轻微的运动模糊。主角占据画面中心位置，是自拍的大头照，脸上带着厌世的神情，它脖子上挂着一个带有自己大头照的工牌。背景是办公场景，旁边的电脑屏幕上是平面设计的页面，营造出一种平凡又独特的氛围。',
    expectedOutput: 'A unique anthropomorphic character snapshot.',
    usage: '适合生成具有独特情绪和故事感的拟人化角色日常照。',
    previewImageUrl: '/previews/weary-bunny-office-selfie.webp'
  }
];

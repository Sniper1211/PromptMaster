/**
 * Original editorial copy for each prompt category.
 * Shown on prompt detail pages and included in the prerendered HTML so crawlers
 * (and AdSense reviewers) see real content, not an empty SPA shell.
 */
export const categoryEditorial = {
  PHOTOGRAPHY: {
    en: 'Photography prompts work best when you treat them as a scene brief rather than a magic sentence. Describe the subject, the light source and direction, the lens and distance, the background, and the mood you want. Keep focal length and lighting consistent across variations, then change one variable at a time so you can compare results. These prompts are written for models such as Midjourney, Seedream, Nano Banana and DALL·E-style tools; adjust camera terms when a model does not understand them.',
    zh: '摄影类提示词更适合当作一份“拍摄简报”来用，而不是一句万能咒语。建议依次交代主体、光源方向、镜头与距离、背景环境和想要的情绪；做变体时保持焦段和光线一致，每次只改一个变量，方便对比结果。本类提示词适用于 Midjourney、Seedream、Nano Banana 等模型；如果某个模型不理解相机术语，可以把它替换成更直白的描述。'
  },
  VIDEO: {
    en: 'Video prompts need a timeline, not just a description. State the shot type, camera movement, subject action and duration for each beat, then add continuity notes (character, wardrobe, lighting). Most video models respond better to short ordered beats than to one long paragraph. If a generation fails, shorten the prompt, remove conflicting camera instructions, and keep the first frame description simple.',
    zh: '视频提示词需要“时间线”，而不只是一段描述。建议按镜头类型、运镜方式、主体动作和时长分节写清楚，再补充连续性要求（人物、服装、光线）。多数视频模型对短而有序的节拍反应更好，而不是一大段长文。如果生成失败，先缩短提示词、去掉互相冲突的运镜要求，并保持第一帧描述简单。'
  },
  CODING: {
    en: 'Coding prompts are specifications. State the stack, the input and output contract, constraints and edge cases, then ask for a minimal working solution before requesting refactors. Include error messages, versions and expected behavior; vague requirements are the main reason coding prompts produce unusable code. These prompts are intended for ChatGPT, Claude, Gemini and similar general coding assistants.',
    zh: '编程类提示词本质上是“规格说明”。先交代技术栈、输入输出约定、约束和边界情况，再要求最小可运行方案，最后才谈重构。把报错、版本和预期行为写清楚；需求含糊是编程提示词产出不可用代码的主要原因。本类提示词面向 ChatGPT、Claude、Gemini 等通用编程助手。'
  },
  WRITING: {
    en: 'Writing prompts improve when you specify audience, purpose, tone and structure, then provide an example of the voice you want. Ask for a draft before asking for polish, and separate “what to say” from “how to say it”. If the result feels generic, add concrete details, a point of view, and constraints such as length and format.',
    zh: '写作类提示词要写清受众、目的、语气和结构，并尽量给出一段想要的语气示例。先要初稿，再谈润色；把“写什么”和“怎么写”分开说明。如果结果很空泛，补充具体细节、明确观点，并限制长度和格式。'
  },
  SEO: {
    en: 'SEO prompts should define the target query, search intent, page type and constraints, then ask for structure before copy. Do not ask a model to invent facts, statistics or backlinks; use the prompt to plan outlines, headings, internal-link ideas and drafts, then verify everything before publishing. These prompts are planning aids, not guarantees of ranking.',
    zh: 'SEO 提示词应先明确目标搜索词、搜索意图、页面类型和限制，再要求先给结构后写正文。不要要求模型编造事实、数据或外链；用提示词来规划大纲、标题层级、内链思路和草稿，发布前务必人工核实。本类提示词只是规划辅助，不构成排名承诺。'
  },
  COMMERCIAL: {
    en: 'Commercial prompts should read like a creative brief: product, audience, placement, brand feel, lighting and composition. Keep the product shape and label readable, and avoid inventing claims. When a result looks generic, add art direction details (surface, shadow, negative space, color palette) rather than more adjectives.',
    zh: '商业类提示词应该像一份创意简报：产品、受众、投放位置、品牌调性、光线和构图。确保产品形状和标签清晰可读，不要编造产品功效。如果结果显得普通，补充美术指导细节（材质、阴影、留白、色彩搭配），而不是堆更多形容词。'
  },
  ART: {
    en: 'Art and design prompts benefit from references and constraints: medium, composition, palette, texture and negative space. Describe what should be absent as well as what should be present. For stylized work, name the visual language (editorial collage, risograph, brutalist poster) instead of naming living artists.',
    zh: '艺术与设计类提示词适合用参考和约束来写：媒介、构图、色彩、质感和留白。除了描述要画什么，也说明不要出现什么。做风格化作品时，用视觉语言来描述（编辑拼贴、孔版印刷、粗野主义海报），而不是直接指定在世艺术家。'
  },
  FUN: {
    en: 'Creative and fun prompts are for exploration. Start with a clear subject and a surprising constraint, then iterate. Keep the scene readable at a glance and avoid stacking too many jokes or characters in one prompt; strong results usually come from one clear idea executed well.',
    zh: '娱乐创意类提示词适合用来探索。先给一个清晰主体，再加一个意外的限制条件，然后多轮迭代。画面最好一眼能读懂，避免在一个提示词里堆太多梗或角色；好结果通常来自一个明确想法被执行到位。'
  },
  BUSINESS: {
    en: 'Business prompts should define the decision to be made, the audience, the available context and the required output format. Ask for assumptions and risks explicitly, and keep the model out of making final decisions. These prompts work best as structured thinking aids for memos, plans and reviews.',
    zh: '商业类提示词应明确要做的决策、受众、已有背景和输出格式，并要求模型显式列出假设和风险，不要让模型替你做最终决策。这类提示词最适合作为备忘录、计划和复盘的结构化思考辅助。'
  },
  PRODUCTIVITY: {
    en: 'Productivity prompts work best when they are small and repeatable: define the input, the transformation and the output format, then reuse the same prompt across tasks. Avoid open-ended “help me be more productive” requests; describe a concrete task and a concrete artifact.',
    zh: '效率类提示词应该短小、可重复：定义输入、转换过程和输出格式，然后在不同任务中复用同一个提示词。避免“帮我提高效率”这类开放式请求，直接描述一个具体任务和一个具体产出。'
  },
  MARKETING: {
    en: 'Marketing prompts should specify the offer, audience, channel, stage of the funnel and the tone of voice. Ask for multiple angles before committing to one, and always verify claims, pricing and legal constraints before publishing. These prompts are for drafting and exploration, not for making promises on your behalf.',
    zh: '营销类提示词要说明产品卖点、受众、渠道、漏斗阶段和语气。先要多个角度，再选择其中一个深挖；发布前务必核实卖点、价格和合规限制。这类提示词用于起草和探索，不应替你做承诺。'
  },
  LEARNING: {
    en: 'Learning prompts are most useful when they ask for explanation at a specific level, with examples and a way to check understanding. Ask the model to state prerequisites first, then teach in small steps; request exercises or self-test questions so the output becomes active practice rather than a wall of text.',
    zh: '学习类提示词最有用的时候，是明确要面向什么水平、配例子、并给出检验理解的方法。先让模型说明前置知识，再分小步讲解；要求练习题或自测问题，让输出变成主动练习，而不是一大段文字。'
  }
};

export const categoryEditorialFallback = {
  en: 'These prompts are part of a curated library. Read the prompt, replace the bracketed variables with your own details, and change one thing at a time when iterating. Results vary by model and version; verify important outputs before publishing.',
  zh: '这些提示词来自一个整理过的提示词库。使用前先阅读提示词，把方括号中的变量替换成你自己的信息；迭代时每次只改一个地方。不同模型和版本的结果会不同，重要产出发布前请人工核实。'
};

export const categoryTitle = {
  PHOTOGRAPHY: { en: 'Photography & Realism', zh: '摄影与写实' },
  VIDEO: { en: 'Video Generation', zh: '视频生成' },
  CODING: { en: 'Coding', zh: '编程开发' },
  WRITING: { en: 'Writing & Content', zh: '写作与内容' },
  SEO: { en: 'SEO', zh: 'SEO' },
  COMMERCIAL: { en: 'Commercial Visuals', zh: '商业视觉' },
  ART: { en: 'Art & Design', zh: '艺术与设计' },
  FUN: { en: 'Fun & Creative', zh: '娱乐创意' },
  BUSINESS: { en: 'Business', zh: '商业策略' },
  PRODUCTIVITY: { en: 'Productivity', zh: '效率工具' },
  MARKETING: { en: 'Marketing', zh: '营销' },
  LEARNING: { en: 'Learning', zh: '学习' }
};

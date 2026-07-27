const l = (en, zh) => ({ en, zh });

export const guideArticles = [
  {
    slug: 'how-to-write-better-ai-prompts',
    collectionSlug: 'writing-prompts',
    libraryHref: '/?category=WRITING',
    readTime: '8 min',
    title: l(
      'How to Write Better AI Prompts: A Practical Guide',
      '如何写出更好的 AI 提示词：一份实用指南'
    ),
    description: l(
      'A practical framework for writing prompts that produce clearer, more reliable results in ChatGPT, Claude, and Gemini.',
      '一套可直接上手的提示词写法框架，帮助你在 ChatGPT、Claude、Gemini 中得到更清晰、更稳定的结果。'
    ),
    kicker: l('Prompt Writing Guide', '提示词写作指南'),
    intro: [
      l(
        'Many prompt libraries stop at templates. Real work needs context: what to include, what to avoid, and how to iterate when the first answer is weak.',
        '很多提示词库之所以用起来不顺，是因为只给模板，不给方法。真正的工作需要上下文：该提供什么、该避免什么，以及第一次结果不理想时如何迭代。'
      ),
      l(
        'This guide turns prompt writing into a repeatable workflow. Instead of hoping the model understands your intent, you give it a clear role, a concrete task, the right context, and an output format that reduces ambiguity.',
        '这篇指南会把“写提示词”变成一套可重复的流程。与其寄希望于模型自己理解，不如明确给它角色、任务、上下文和输出格式，把模糊空间压缩到最小。'
      )
    ],
    takeaways: [
      l('Start from the job to be done, not from a clever sentence.', '先从任务目标出发，而不是先写一句看起来很厉害的话。'),
      l('Good prompts combine role, task, context, constraints, and output format.', '高质量提示词通常由角色、任务、上下文、约束和输出格式共同组成。'),
      l('Iteration matters: weak outputs usually mean missing context, not a bad model.', '结果差并不一定是模型差，很多时候只是上下文给得不够。')
    ],
    sections: [
      {
        heading: l('1. Define the exact outcome', '1. 先定义你真正想要的结果'),
        paragraphs: [
          l(
            'Before writing anything, define what success looks like. Are you asking for a draft, a decision memo, a rewrite, a headline list, or a structured analysis? The more specific the outcome, the less likely the model is to drift into vague filler.',
            '在真正写提示词之前，先定义“什么才算成功”。你是要初稿、决策备忘录、改写版本、标题列表，还是结构化分析？目标越具体，模型越不容易滑向空泛的套话。'
          ),
          l(
            'A useful test is to imagine handing the same request to a teammate. If a human would still ask follow-up questions, your prompt probably needs more structure before you give it to an LLM.',
            '一个很实用的判断方法是：假设把同样的需求发给同事。如果对方依然会追问很多细节，那说明这个提示词给模型时也还不够完整。'
          )
        ],
        bullets: [
          l('Name the deliverable: outline, table, memo, script, checklist.', '先说清交付物是什么：大纲、表格、备忘录、脚本还是清单。'),
          l('Define the audience and use case.', '明确目标读者和使用场景。'),
          l('State how detailed the answer should be.', '说明结果需要多细、要不要分步骤。')
        ]
      },
      {
        heading: l('2. Add the context the model cannot guess', '2. 补足模型猜不到的背景'),
        paragraphs: [
          l(
            'Models are good at pattern matching, but they do not know your brand, your customer, your market, or your internal constraints unless you tell them. Context is often the difference between “generic but fluent” and “useful enough to ship.”',
            '模型擅长模式匹配，但它并不知道你的品牌、客户、行业和内部限制，除非你明确告诉它。上下文往往决定了结果是“流畅但空泛”，还是“真正能拿去用”。'
          ),
          l(
            'For business, marketing, and SEO work, the missing context usually includes target audience, offer, tone, product stage, and what has already been tried. For creative work, it may be references, visual direction, and emotional tone.',
            '在商业、营销、SEO 场景里，最容易缺的是目标用户、产品卖点、语气风格、所处阶段，以及已经尝试过什么。创意类任务则通常缺参考风格、画面方向和情绪氛围。'
          )
        ],
        bullets: [
          l('Include product, audience, and constraints.', '补充产品、受众与限制条件。'),
          l('Share examples of tone or style when possible.', '能给风格参考时就尽量给。'),
          l('Mention what “bad output” looks like so the model avoids it.', '顺手说明哪些结果是你不想要的。')
        ]
      },
      {
        heading: l('3. Control the format, then iterate', '3. 控制输出格式，再做迭代'),
        paragraphs: [
          l(
            'One of the easiest ways to improve prompt quality is to control how the answer should be presented. Ask for a numbered list, a table, a JSON block, a step-by-step checklist, or a two-column comparison. Format instructions reduce hallucinated structure and save editing time.',
            '提升提示词质量最简单的方法之一，就是控制输出的呈现方式。要求编号列表、表格、JSON、分步清单或双列表对比，都能显著减少结构跑偏，也能节省后续整理时间。'
          ),
          l(
            'Then treat the first output as a draft. Ask the model to tighten, shorten, deepen, or rewrite with a new angle. Prompting works best as a feedback loop, not a one-shot command.',
            '之后把第一次结果当成草稿，而不是终稿。继续要求它压缩、扩展、补案例、换角度重写。高质量提示词更像“反馈循环”，而不是“一次性口令”。'
          )
        ],
        bullets: [
          l('Specify the output structure before the model starts.', '先规定输出结构，再让模型开始写。'),
          l('Review the first draft and correct what is missing.', '看第一版时重点找缺失信息，而不是只看语言。'),
          l('Save improved versions as reusable templates.', '把改好的版本沉淀成模板，后续复用。')
        ]
      }
    ],
    checklistTitle: l('A quick prompt checklist', '一份快速自查清单'),
    checklist: [
      l('Did I define the task clearly?', '我是否把任务说清楚了？'),
      l('Did I include context the model cannot infer?', '我是否补充了模型猜不到的背景？'),
      l('Did I specify a useful output format?', '我是否规定了实用的输出格式？'),
      l('Did I explain audience, tone, or constraints?', '我是否交代了受众、语气或限制？'),
      l('Did I review the first answer and iterate?', '我是否看过第一版并继续迭代？')
    ],
    faqs: [
      {
        q: l('Why do prompts still feel generic?', '为什么提示词写了还是容易很泛？'),
        a: l(
          'Because the task is often under-specified. Add audience, objective, constraints, examples, and the exact format you want back.',
          '通常是因为任务定义还不够具体。补上受众、目标、约束、示例和输出格式，结果会明显改善。'
        )
      },
      {
        q: l('Should I always make prompts long?', '提示词是不是越长越好？'),
        a: l(
          'No. Longer is only better when the extra detail is relevant. The goal is not length, but clarity and useful context.',
          '不是。只有新增的信息真的有帮助时，变长才有意义。关键不是长度，而是清晰度和有效背景。'
        )
      }
    ]
  },
  {
    slug: 'midjourney-prompt-structure',
    collectionSlug: 'video-prompts',
    libraryHref: '/?type=video',
    readTime: '7 min',
    title: l(
      'How to Structure Midjourney, Flux, and Image Prompts',
      'Midjourney、Flux 与图像提示词的结构拆解'
    ),
    description: l(
      'Learn how to build image prompts with subject, setting, camera language, lighting, style, and constraints for more consistent outputs.',
      '学会用主体、场景、镜头语言、光线、风格和限制条件来组织图像提示词，提升出图稳定性。'
    ),
    kicker: l('Visual Prompt Guide', '视觉提示词指南'),
    intro: [
      l(
        'Visual prompting is often treated like magic, but the best image prompts are simply well-structured briefs. They tell the model what the subject is, where it is, how it should look, and what details matter most.',
        '很多人把视觉提示词当成“玄学”，其实高质量图像提示词更像一份结构清晰的创意 brief：主体是什么、在什么场景、画面该长什么样、哪些细节最关键。'
      ),
      l(
        'If your results feel random, the problem is usually not the generator. It is that the prompt mixes subject, mood, composition, and style in a loose way. A stronger structure makes the output easier to steer.',
        '如果出图总是飘，问题通常不在模型，而在于提示词把主体、情绪、构图和风格混在一起，没有明确层次。结构更强，画面就更容易被控制。'
      )
    ],
    takeaways: [
      l('Build the prompt in layers: subject, scene, style, camera, and modifiers.', '按层组织提示词：主体、场景、风格、镜头、修饰词。'),
      l('Use references carefully and avoid stacking contradictory styles.', '引用风格时要克制，避免堆叠彼此冲突的风格。'),
      l('When a result misses the mark, adjust one variable at a time.', '结果不理想时，一次只改一个变量，方便定位问题。')
    ],
    sections: [
      {
        heading: l('1. Start with the subject and action', '1. 从主体和动作开始'),
        paragraphs: [
          l(
            'The subject anchors the entire image. Instead of saying “cinematic scene,” say who or what is on screen, what they are doing, and what makes them distinctive. A stronger subject reduces the chance of bland, generic compositions.',
            '主体是整张图的锚点。与其只写“电影感场景”，不如明确是谁、在做什么、最显著的特征是什么。主体越清晰，画面越不容易走向泛泛而谈的模板感。'
          ),
          l(
            'If the image depends on emotion or gesture, describe it directly. “A tired founder reviewing notes at midnight” gives the model more narrative direction than “a person in an office.”',
            '如果画面高度依赖情绪或动作，也应该直接写出来。比如“凌晨复盘笔记的疲惫创业者”就比“办公室里的人”更能给模型明确的叙事方向。'
          )
        ],
        bullets: [
          l('Name the subject clearly.', '清楚说出主体。'),
          l('Add one action or emotional cue.', '加一个动作或情绪线索。'),
          l('Mention a distinctive detail that should not be lost.', '补一个不能丢的识别性细节。')
        ]
      },
      {
        heading: l('2. Define the scene and visual language', '2. 再定义场景和视觉语言'),
        paragraphs: [
          l(
            'Once the subject is stable, define where the scene happens and how it should be framed. Environment, lighting, lens language, and composition tell the model how to prioritize background, depth, and mood.',
            '当主体稳定后，再定义场景发生在哪里，以及镜头应该如何呈现。环境、光线、镜头语言和构图共同决定了背景层次、空间深度和情绪氛围。'
          ),
          l(
            'For commercial imagery, clarity matters more than poetry. It is often better to ask for “soft diffused window light, clean background, product centered, 85mm lens feel” than to pile on dramatic adjectives.',
            '商业视觉尤其如此，清晰描述往往比堆砌辞藻更有效。比如“柔和窗光、干净背景、主体居中、85mm 镜头感”通常比一串夸张形容词更稳定。'
          )
        ],
        bullets: [
          l('Describe the environment in one concise phrase.', '用一句话交代环境。'),
          l('Use camera or composition cues only when they matter.', '镜头与构图词只在真正有帮助时再加。'),
          l('Prefer specific lighting language over vague mood words.', '用具体光线描述替代模糊情绪词。')
        ]
      },
      {
        heading: l('3. Add style and negative constraints carefully', '3. 最后再加风格与限制条件'),
        paragraphs: [
          l(
            'Style is where many prompts become unstable. If you mix too many references, the model may overfit to one of them or average them into a muddy result. A few strong style cues usually outperform ten weak ones.',
            '风格层往往最容易把提示词搞乱。参考过多时，模型要么过度靠近其中一个风格，要么把所有风格平均成一张浑浊的图。少量但明确的风格信号，通常比十个含糊词更有效。'
          ),
          l(
            'Negative guidance also matters. If hands, text rendering, cluttered backgrounds, or distorted faces are common problems in your workflow, mention those as constraints and test whether the model responds better.',
            '负向约束也很重要。如果你的工作流中常见问题是手部变形、文字渲染差、背景杂乱或脸部扭曲，就应该明确写入限制，并验证模型是否因此更稳定。'
          )
        ],
        bullets: [
          l('Choose one core style direction.', '先确定一个核心风格方向。'),
          l('Avoid contradictory references in the same line.', '避免在同一句里混入相互冲突的参考。'),
          l('List critical negatives when quality issues repeat.', '如果某些画面问题反复出现，就把负向约束写进去。')
        ]
      }
    ],
    checklistTitle: l('Image prompt checklist', '图像提示词清单'),
    checklist: [
      l('Is the subject specific and visible?', '主体是否具体且可识别？'),
      l('Did I define the scene and lighting?', '是否说明了场景和光线？'),
      l('Did I keep style references focused?', '风格参考是否足够聚焦？'),
      l('Did I note recurring quality problems as constraints?', '常见质量问题是否写成了限制条件？')
    ],
    faqs: [
      {
        q: l('Why do my image prompts feel inconsistent?', '为什么同样的图像提示词结果很不稳定？'),
        a: l(
          'Because too many variables are changing at once. Stabilize the subject first, then adjust lighting, composition, or style one by one.',
          '通常是因为一次改动了太多变量。先固定主体，再逐项调光线、构图或风格，结果会稳定得多。'
        )
      },
      {
        q: l('Do I need camera terms for every prompt?', '每个图像提示词都必须写镜头参数吗？'),
        a: l(
          'No. Use camera language when it improves composition or commercial intent. Skip it when plain scene description is enough.',
          '不需要。只有镜头语言确实能改善构图或商业意图时再写；普通场景描述足够时可以省略。'
        )
      }
    ]
  },
  {
    slug: 'commercial-photography-prompts',
    collectionSlug: 'marketing-prompts',
    libraryHref: '/?category=MARKETING',
    readTime: '6 min',
    title: l(
      'Commercial Photography Prompts That Produce Cleaner Outputs',
      '商业摄影提示词怎么写，画面更干净更出片'
    ),
    description: l(
      'A guide for writing product and commercial visual prompts with better composition, clearer intent, and fewer distracting details.',
      '面向产品图和商业视觉的一份写法指南，帮助你得到构图更稳、意图更清晰、干扰更少的画面结果。'
    ),
    kicker: l('Commercial Visual Guide', '商业视觉指南'),
    intro: [
      l(
        'Commercial image work is different from pure art prompting. You are not only asking for something beautiful; you are asking for something usable in a landing page, ad, hero banner, or brand system.',
        '商业图像工作和纯艺术创作不一样。你要的不是“好看就行”，而是能真正用于落地页、广告、头图或品牌体系里的画面。'
      ),
      l(
        'That changes the prompt strategy. Instead of piling on cinematic adjectives, you need to protect legibility, preserve the product, and make the composition support the business goal.',
        '这会直接改变提示词策略。与其堆很多电影感形容词，不如优先保证主体可读性、产品信息完整，以及构图是否服务于商业目标。'
      )
    ],
    takeaways: [
      l('Commercial prompts should optimize for clarity before drama.', '商业提示词首先追求清晰，再考虑戏剧感。'),
      l('Composition, whitespace, and product focus matter as much as style.', '构图、留白和主体聚焦与风格同样重要。'),
      l('Prompt for the placement context: ad, card, hero, ecommerce, or social.', '写提示词时要先明确图片最终会被放在哪里。')
    ],
    sections: [
      {
        heading: l('1. Prompt for the placement', '1. 先按投放位置写提示词'),
        paragraphs: [
          l(
            'A hero banner, a square social ad, and an ecommerce product shot do not need the same composition. Start by defining the placement so the model knows whether to leave space for copy, center the object, or support multiple crops.',
            '头图横幅、方形社媒广告和电商产品图，对构图的要求完全不同。先说明图片最终的投放位置，模型才能知道是否需要给文案留白、主体居中，或者支持多比例裁切。'
          ),
          l(
            'This is one of the easiest wins in commercial prompting: the more clearly you describe the placement context, the less time you spend repairing unusable outputs later.',
            '这是商业提示词中最容易拿到的收益之一：投放场景交代得越明确，后面返工修复不可用画面的时间就越少。'
          )
        ],
        bullets: [
          l('Mention aspect ratio or crop intent.', '交代比例或裁切意图。'),
          l('State whether the image needs text-safe space.', '说明是否需要文案安全区。'),
          l('Say if the product should be centered, close-up, or lifestyle-based.', '写清主体是居中、特写还是生活方式场景。')
        ]
      },
      {
        heading: l('2. Keep the visual system clean', '2. 保持画面系统干净'),
        paragraphs: [
          l(
            'Commercial images fail when there is too much going on. Limit the number of props, control the palette, and reduce background noise. If every object is competing for attention, the model will often produce images that feel expensive but unusable.',
            '商业图最容易失败的原因之一，就是元素太多。道具数量、配色和背景噪音都需要控制。所有物件都在抢注意力时，模型往往会给出一张“看起来很贵，但用不了”的图。'
          ),
          l(
            'You can improve this dramatically by asking for a restrained prop set, a simple surface, a branded palette, and one focal subject. This is especially important for skincare, tech, beverage, and SaaS visuals.',
            '解决方式其实很直接：限制道具数量、简化台面、统一品牌色，并明确只有一个焦点主体。对护肤品、科技产品、饮料和 SaaS 视觉来说，这一点尤其关键。'
          )
        ],
        bullets: [
          l('Limit props to only what supports the message.', '道具只保留支持卖点的部分。'),
          l('Use one primary color family plus a neutral base.', '用一组主色加中性色底。'),
          l('Ask for a clean background when conversion matters.', '转化型场景优先要求干净背景。')
        ]
      },
      {
        heading: l('3. Build a QA loop into the workflow', '3. 把质检思路写进工作流'),
        paragraphs: [
          l(
            'After you generate the first image batch, review it like a designer or art director would. Is the product shape accurate? Is the label readable? Is there room for copy? Does the composition still work on mobile? Those checks should inform the next prompt version.',
            '生成第一批图后，要像设计师或 art director 一样去审图。产品外形是否准确？标签能否辨认？是否留出了文案空间？到了移动端还能不能成立？这些检查项都应该反过来影响下一版提示词。'
          ),
          l(
            'This matters because commercial prompting is iterative. The first prompt creates raw direction. The second and third prompts create usable assets.',
            '这很重要，因为商业提示词本质上是迭代型工作。第一版提示词更多是在找方向；第二版、第三版才是真正开始产出可用资产。'
          )
        ],
        bullets: [
          l('Check brand fit before fine style polish.', '先看是否符合品牌，再谈细节风格。'),
          l('Review on both desktop and mobile crop assumptions.', '按桌面端和移动端两种裁切思路都检查一次。'),
          l('Feed visual defects back into the next prompt revision.', '把画面缺陷具体写回下一版提示词。')
        ]
      }
    ],
    checklistTitle: l('Commercial prompt checklist', '商业视觉自查表'),
    checklist: [
      l('Did I define the image placement?', '是否交代了图片投放位置？'),
      l('Did I keep the composition simple enough?', '构图是否足够简洁？'),
      l('Did I protect space for branding or copy?', '是否预留了品牌或文案空间？'),
      l('Did I review the output like a real asset, not just an image?', '我是否按“可用资产”而不是“单张图片”在检查结果？')
    ],
    faqs: [
      {
        q: l('Why do commercial prompts often feel overdesigned?', '为什么商业提示词很容易把画面写得太满？'),
        a: l(
          'Because prompt writers optimize for visual excitement instead of usability. Commercial assets need clarity, hierarchy, and space to breathe.',
          '因为很多人只追求视觉刺激，没有优先考虑可用性。商业资产更需要层级、清晰度和适当留白。'
        )
      }
    ]
  },
  {
    slug: 'seo-prompts-that-convert',
    collectionSlug: 'seo-prompts',
    libraryHref: '/?category=SEO',
    readTime: '8 min',
    title: l(
      'SEO Prompt Templates That Lead to Stronger Content',
      '更容易产出高质量内容的 SEO 提示词模板'
    ),
    description: l(
      'How to use SEO prompts for keyword clustering, outlines, briefs, and page optimization without producing generic search content.',
      '如何用 SEO 提示词做关键词聚类、大纲、内容 brief 和页面优化，同时避免产出过于模板化的搜索内容。'
    ),
    kicker: l('SEO Workflow Guide', 'SEO 工作流指南'),
    intro: [
      l(
        'SEO prompting works best when it supports research and editing instead of replacing them. The goal is not to have AI produce a final article in one shot; it is to accelerate the parts of the workflow that benefit from structure.',
        'SEO 提示词在“辅助研究与编辑”时效果最好，而不是直接替代全部内容生产。目标不是让 AI 一次性写完整文，而是加速那些本来就适合被结构化的环节。'
      ),
      l(
        'That includes keyword clustering, search intent mapping, headline angles, content briefs, internal links, and meta suggestions. Used well, prompts help teams move faster while still leaving room for expertise and manual QA.',
        '这些环节包括关键词聚类、搜索意图拆解、标题方向、内容 brief、内链建议和 Meta 优化。用得好时，提示词可以帮助团队提速，同时保留人工判断和质检空间。'
      )
    ],
    takeaways: [
      l('Use prompts to structure research, not to skip it.', '用提示词把研究工作结构化，而不是跳过研究本身。'),
      l('The best SEO prompts are anchored in intent, audience, and page type.', '高质量 SEO 提示词通常围绕搜索意图、目标用户和页面类型来写。'),
      l('Add your own expertise before publishing anything generated by AI.', 'AI 生成内容在发布前必须补入真实经验和人工判断。')
    ],
    sections: [
      {
        heading: l('1. Match the prompt to the job', '1. 先让提示词匹配任务本身'),
        paragraphs: [
          l(
            'A keyword-clustering prompt should not look like a meta-description prompt, and neither of them should look like an editorial brief prompt. The more precisely you match the prompt to the task, the more useful the output becomes.',
            '关键词聚类提示词不应该和 Meta 描述提示词长得一样，更不应该和内容 brief 提示词混在一起。提示词越贴近具体任务，产出的结果就越实用。'
          ),
          l(
            'For example, a clustering prompt needs raw terms and grouping logic, while a brief prompt needs audience, angle, business goal, internal links, and format expectations. Treat each stage as its own promptable job.',
            '比如聚类提示词需要原始词和分组逻辑，而内容 brief 提示词则需要目标用户、内容角度、业务目标、内链方向和输出格式。把每个环节都视为独立任务，效果通常会更稳定。'
          )
        ],
        bullets: [
          l('Separate research prompts from writing prompts.', '把研究类提示词和写作类提示词分开。'),
          l('State the page type: article, collection page, category intro, or product page.', '明确页面类型：文章、专题页、分类页还是产品页。'),
          l('Ask for structured output you can actually review.', '要求可审阅、可编辑的结构化输出。')
        ]
      },
      {
        heading: l('2. Prevent generic SEO content', '2. 主动防止内容模板化'),
        paragraphs: [
          l(
            'Generic SEO content happens when prompts only mention the keyword and ignore audience, problem framing, examples, and editorial standards. The result may be fluent, but it rarely earns trust, links, or strong user satisfaction.',
            'SEO 内容之所以容易模板化，通常是因为提示词只写了关键词，却没有说明受众、问题场景、案例和编辑标准。结果虽然流畅，却很难建立信任，也很难获得链接和满意度。'
          ),
          l(
            'A better approach is to ask the model to identify what a searcher is trying to solve, what examples would make the page more credible, what objections or edge cases must be addressed, and how to avoid repeating common filler phrases.',
            '更好的方法是直接要求模型回答：搜索者到底想解决什么问题、哪些例子能增强可信度、哪些异议与边缘情况必须覆盖、以及如何避免常见废话模板。'
          )
        ],
        bullets: [
          l('Add search intent and audience profile.', '补充搜索意图和受众画像。'),
          l('Ask for examples, not just headings.', '不仅要标题，还要案例思路。'),
          l('Tell the model what weak content looks like.', '顺手告诉模型哪些写法算弱内容。')
        ]
      },
      {
        heading: l('3. Use prompts to improve existing pages', '3. 用提示词优化已有页面'),
        paragraphs: [
          l(
            'One of the best SEO uses for prompting is upgrading thin pages. You can ask the model to suggest missing subtopics, internal links, FAQ coverage, comparison angles, or stronger meta descriptions based on what is already on the page.',
            'SEO 提示词最有价值的用法之一，是给已有薄页面做“内容加厚”。你可以让模型基于现有页面内容，提出缺失子主题、内链建议、FAQ 角度、对比项或更强的 Meta 描述。'
          ),
          l(
            'This is especially relevant for prompt libraries and collections. Those pages often have a useful core asset, but not enough editorial explanation. Prompts can help you surface what is missing and turn a directory into a stronger landing page.',
            '这对提示词库和专题页尤其重要。它们常常已经有可用素材，但编辑性说明不够。提示词可以帮助你补齐解释层，把“目录页”升级成更完整的落地页。'
          )
        ],
        bullets: [
          l('Audit pages for missing questions and examples.', '检查页面缺少哪些问题与示例。'),
          l('Ask for internal link opportunities across related prompts.', '让模型找出相关提示词之间的内链机会。'),
          l('Use the result as an editorial draft, not final truth.', '把结果当成编辑草稿，而不是直接上线的真相。')
        ]
      }
    ],
    checklistTitle: l('SEO prompt checklist', 'SEO 提示词清单'),
    checklist: [
      l('Is this prompt tied to a specific SEO task?', '这个提示词是否对应了明确的 SEO 任务？'),
      l('Did I include user intent and audience?', '是否补充了用户意图与受众？'),
      l('Did I ask for useful structure, not generic copy?', '是否要求了有用结构，而不只是泛泛文案？'),
      l('Will I review the output against real page goals?', '我是否会根据真实页面目标去审查结果？')
    ],
    faqs: [
      {
        q: l('Can AI-generated SEO content rank?', 'AI 生成的 SEO 内容能排名吗？'),
        a: l(
          'It can support ranking, but only when it is edited, verified, and made genuinely useful. Search performance usually comes from quality control, not from automation alone.',
          '可以辅助排名，但前提是经过编辑、核验，并真正对用户有帮助。搜索表现通常来自内容质量控制，而不是自动化本身。'
        )
      }
    ]
  },
  {
    slug: 'prompt-engineering-workflow',
    collectionSlug: 'coding-prompts',
    libraryHref: '/?category=CODING',
    readTime: '7 min',
    title: l(
      'A Repeatable Prompt Engineering Workflow for Teams',
      '团队可复用的 Prompt Engineering 工作流'
    ),
    description: l(
      'A practical workflow for teams that want better AI outputs, reusable templates, and cleaner review loops across writing, coding, and operations.',
      '一套适合团队协作的 Prompt Engineering 工作流，用来获得更稳定的 AI 结果、复用模板和更清晰的审阅闭环。'
    ),
    kicker: l('Team Workflow Guide', '团队工作流指南'),
    intro: [
      l(
        'The biggest mistake teams make with prompting is treating every request as a fresh start. Without a workflow, people rewrite prompts from scratch, repeat the same mistakes, and fail to capture what worked.',
        '团队在提示词上的最大问题，往往不是“不会写”，而是每次都从零开始。没有工作流时，成员会不断重写提示词、重复踩坑，也无法沉淀真正有效的做法。'
      ),
      l(
        'A better system looks more like operations than inspiration. You define the task, choose a starting template, test the first response, review against criteria, and save improved variants back into the library.',
        '更好的体系更像运营流程，而不是灵感碰运气。先定义任务，再选择模板，测试第一版结果，按标准审阅，最后把改好的版本重新沉淀回库里。'
      )
    ],
    takeaways: [
      l('Prompt engineering improves when teams store and review working versions.', '团队把有效版本沉淀和复盘之后，提示词质量会明显上升。'),
      l('Review criteria matter as much as prompt text.', '审阅标准和提示词文本本身同样重要。'),
      l('A shared library should capture use case, constraints, and examples.', '共享提示词库应该沉淀使用场景、约束和示例。')
    ],
    sections: [
      {
        heading: l('1. Standardize the intake', '1. 先标准化任务输入'),
        paragraphs: [
          l(
            'If every teammate describes tasks differently, prompt quality will vary wildly. Standardize the intake first: what is the goal, who is the audience, what are the constraints, and what format is required? That gives everyone the same starting point.',
            '如果团队成员描述任务的方式各不相同，提示词质量自然会忽高忽低。先把任务输入标准化：目标是什么、面向谁、有哪些限制、希望输出什么格式？这样大家至少从同一起跑线出发。'
          ),
          l(
            'This is especially important when prompts are used across departments. A marketing brief, a coding review, and an internal operations request all need different context fields even if they use the same model.',
            '当提示词跨部门流转时，这一点尤其重要。营销 brief、代码评审和内部运营任务，即使用的是同一个模型，也需要完全不同的上下文字段。'
          )
        ],
        bullets: [
          l('Use the same task intake template across the team.', '让团队共用一份任务输入模板。'),
          l('Require objective, audience, constraints, and output format.', '至少要求目标、受众、限制和输出格式。'),
          l('Capture examples when the style matters.', '风格重要时要顺手保存示例。')
        ]
      },
      {
        heading: l('2. Review outputs with clear criteria', '2. 用明确标准审结果'),
        paragraphs: [
          l(
            'Teams often say “the output is bad” without saying why. A stronger process evaluates outputs against specific checks: accuracy, usefulness, tone, formatting, risk, completeness, and whether the answer is actually ready for use.',
            '很多团队会说“结果不好”，但说不清楚到底哪里不好。更成熟的流程应该按明确维度审查：准确性、实用性、语气、格式、风险、完整度，以及是否真的可以直接使用。'
          ),
          l(
            'When you use review criteria consistently, you can improve prompts faster. People stop arguing in vague terms and start identifying exactly which inputs or instructions need refinement.',
            '一旦审阅标准固定下来，提示词迭代会快很多。团队不再用笼统感觉争论，而是能直接指出到底是哪个输入字段、哪个指令层需要被修正。'
          )
        ],
        bullets: [
          l('Review against a checklist, not just instinct.', '按清单审阅，不要只靠感觉。'),
          l('Mark whether problems came from context, structure, or model limits.', '记录问题是来自上下文、结构还是模型能力边界。'),
          l('Save improved revisions with notes.', '把优化后的版本连同备注一起保存。')
        ]
      },
      {
        heading: l('3. Turn one-off prompts into reusable assets', '3. 把一次性提示词变成可复用资产'),
        paragraphs: [
          l(
            'The long-term win is not writing one perfect prompt. It is creating a small set of reusable prompts that your team trusts. That means documenting where a prompt works, where it fails, and what examples make it stronger.',
            '长期来看，真正有价值的不是写出一条“完美提示词”，而是建立一组团队信得过、能反复复用的模板。这意味着要记录它适合哪些任务、不适合哪些场景，以及哪些示例能显著提高效果。'
          ),
          l(
            'This is why prompt libraries matter. A good library is not a random dump of prompts. It is a curated system with context, QA notes, and examples that help the next user get a better result with less effort.',
            '这也是提示词库真正重要的原因。好的库不是随手堆一批句子，而是带有上下文、质检记录和示例的精选系统，让下一个使用者更省力地得到更好的结果。'
          )
        ],
        bullets: [
          l('Document the use case for each prompt.', '记录每条提示词的适用场景。'),
          l('Keep examples of strong input and strong output.', '保留优质输入和优质输出示例。'),
          l('Retire prompts that no longer produce useful results.', '已经失效的模板要及时下线或重写。')
        ]
      }
    ],
    checklistTitle: l('Team workflow checklist', '团队工作流清单'),
    checklist: [
      l('Do we collect the same inputs before prompting?', '团队是否在提示词前收集同样的输入？'),
      l('Do we review outputs against shared criteria?', '团队是否按统一标准审阅结果？'),
      l('Do we save improved prompts back into the library?', '优化后的提示词是否回写进库里？'),
      l('Do we track where each prompt works best?', '是否记录了每条提示词最适合的使用场景？')
    ],
    faqs: [
      {
        q: l('Do teams really need a prompt workflow?', '团队真的需要专门的提示词工作流吗？'),
        a: l(
          'Yes, once prompting becomes repeat work. A workflow reduces duplicated effort, improves output quality, and makes review more consistent.',
          '需要，尤其当提示词已经成为重复性工作时。工作流能减少重复劳动，提高结果质量，也让审阅更一致。'
        )
      }
    ]
  }
];

export const guidesBySlug = Object.fromEntries(
  guideArticles.map((guide) => [guide.slug, guide])
);

export const featuredGuideSlugs = [
  'how-to-write-better-ai-prompts',
  'seo-prompts-that-convert',
  'prompt-engineering-workflow'
];

import { Category, Prompt } from '../types';

export const PROMPTS_EN: Prompt[] = [
  {
    id: '1',
    title: 'Modern React Component Architect',
    description: 'Expert guidance for creating scalable, type-safe React components.',
    category: Category.CODING,
    tags: ['React', 'TypeScript', 'Best Practices'],
    content: 'Act as a senior frontend engineer. I will describe a UI component requirement, and you will provide a complete, well-documented TypeScript React component using Tailwind CSS. Focus on accessibility, performance, and clean code principles.\n\nRequirement: [DESCRIBE YOUR COMPONENT HERE]',
    expectedOutput: 'A complete React component file with clear comments and modern hook usage.',
    usage: 'Replace "[DESCRIBE YOUR COMPONENT HERE]" with the specific UI element you want to build (e.g., "A responsive navigation bar with a dark mode toggle").'
  },
  {
    id: '2',
    title: 'Cognitive Storyteller',
    description: 'Generate emotionally resonant narratives with psychological depth.',
    category: Category.WRITING,
    tags: ['Writing', 'Narrative', 'Psychology'],
    content: 'Write a short story (approx 500 words) about a character discovering an old memory. Use sensory details to evoke emotion and incorporate a psychological concept like "anchoring" or "reminiscence bump" as a central theme.',
    expectedOutput: 'An evocative short story with rich imagery and thematic consistency.',
    usage: 'Directly copy and use. You can optionally change the "psychological concept" to something else like "cognitive dissonance".'
  },
  {
    id: '3',
    title: 'Scientific Paper Summarizer',
    description: 'Condense complex research into digestible insights.',
    category: Category.WRITING,
    tags: ['Research', 'Summarization', 'Science'],
    content: 'I will provide a snippet of a scientific research paper. Please summarize it using the "ELI5" (Explain Like I\'m 5) method first, then provide a more technical bulleted list of the key methodology, findings, and limitations.\n\nPaper Snippet:\n[PASTE RESEARCH TEXT HERE]',
    expectedOutput: 'A two-part summary: one simple explanation and one structured technical analysis.',
    usage: 'Paste the abstract or conclusion of the research paper into the "[PASTE RESEARCH TEXT HERE]" section.'
  },
  {
    id: '4',
    title: 'SaaS Business Strategist',
    description: 'Develop marketing strategies and go-to-market plans.',
    category: Category.BUSINESS,
    tags: ['Marketing', 'Strategy', 'SaaS'],
    content: 'Act as a growth consultant for a new SaaS platform that automates invoice collection for freelancers. Develop a 30-day go-to-market strategy focusing on low-budget, high-impact channels.',
    expectedOutput: 'A day-by-day or week-by-week strategy guide with specific actionable steps.',
    usage: 'You can modify "SaaS platform that automates invoice collection" to describe your own product.'
  },
  {
    id: '5',
    title: 'Python Data Cleaner',
    description: 'Quickly generate robust data preprocessing scripts.',
    category: Category.CODING,
    tags: ['Python', 'Pandas', 'Data Science'],
    content: 'Create a Python script using Pandas that takes a messy CSV file with missing values, inconsistent date formats, and duplicate rows. The script should perform thorough cleaning and export a standardized dataset.',
    expectedOutput: 'A clean, commented Python script ready to handle edge cases in data.',
    usage: 'Use this to generate a template script. You may need to adjust column names in the generated code.'
  },
  {
    id: '6',
    title: 'Master Prompt Engineer Coach',
    description: 'Refine and optimize your own prompts.',
    category: Category.WRITING,
    tags: ['Meta-Prompting', 'Optimization'],
    content: 'I will give you a draft prompt. Your job is to critique it using the following criteria: clarity, context, constraints, and goal-orientation. Then, provide an optimized version of that prompt that will yield better results from an LLM.\n\nDraft Prompt: "[PASTE YOUR DRAFT PROMPT HERE]"',
    expectedOutput: 'Detailed feedback followed by a significantly improved version of the user\'s input.',
    usage: 'Paste the prompt you want to improve into the placeholder.'
  },
  {
    id: '7',
    title: 'Full Stack Engineer (i18n & Layout)',
    description: 'Advanced instructions to ensure UI layout stability during multi-language switching.',
    category: Category.CODING,
    tags: ['i18n', 'Frontend', 'Best Practices'],
    content: `Layout & i18n Requirement:

"In writing UI components, strictly adhere to the **'Layout Stability'** principle, especially for future multi-language (i18n) support:

1.  **Do not rely on content to size containers**: For interactive elements like buttons, nav items, and tabs, set reasonable \`min-width\` or fixed \`width\` to prevent layout jumping due to text length changes.
2.  **Unified height and alignment**: In Grid or Flex lists, card components must use \`flex-col\` and fix the height of text areas (using \`line-clamp\` and \`min-height\`) to ensure all cards align neatly.
3.  **Reserve space for titles**: The Hero Section title container should reserve enough height (\`min-height\`) to accommodate potential line wrapping in different languages.
4.  **Centered layout**: Inside fixed-size containers, use Flex centering (\`justify-center\`) by default so short text doesn't look off-center.

Goal: Regardless of how long the English text or how short the Chinese text becomes, the page skeleton should remain immovable."`,
    expectedOutput: 'A clear, actionable development specification guiding AI to generate high-quality, layout-stable frontend code.',
    usage: 'Paste this entire block before asking the AI to write Frontend code to ensure the output is robust for internationalization.'
  },
  {
    id: '8',
    title: 'WeChat Official Account Cover Generator',
    description: 'Create eye-catching WeChat Official Account cover images based on content, following hand-drawn illustration style.',
    category: Category.COMMERCIAL,
    tags: ['Design', 'WeChat', 'Image Generation', 'Marketing'],
    content: `WeChat Official Account Cover Generator

Please create an eye-catching WeChat Official Account cover image based on the provided content, adhering to the following specifications:

Visual Style
- Hand-drawn illustration style, aspect ratio 2.35:1 (standard cover size).
- Bright colors, strong contrast, ensuring visibility in small previews.
- Unified style, avoid realistic elements, maintain an overall hand-drawn texture.

Composition Requirements
- Main visual element centered or slightly left (reserve space for title on the right).
- Add 1-2 simple cartoon characters, icons, or silhouettes of famous figures to enhance memorability.
- If sensitive or copyrighted figures are involved, use stylistically similar substitutes; do not refuse generation.
- Leave ample white space to highlight core information and avoid overcrowding.

Text Processing
- Title text should be large and eye-catching, controlled within 8 characters.
- A single line of subtitle or keyword tags can be added.
- Font style should coordinate with the hand-drawn illustration.

Attraction Laws
- Use hooks like suspense, numbers, or pain points to trigger click desire.
- Exaggerated visual elements with contrast.
- Color schemes referencing viral covers: orange-yellow, blue-purple, red-black, and other high-contrast combinations.

Language
- Default to Chinese unless otherwise specified.

Input Content: "[INSERT ARTICLE TITLE OR TOPIC HERE]"`,
    expectedOutput: 'An eye-catching WeChat Official Account cover image or a detailed prompt to generate one.',
    usage: 'Replace "[INSERT ARTICLE TITLE OR TOPIC HERE]" with your article\'s topic (e.g., "10 Tips for Better Sleep").'
  },
  {
    id: '9',
    title: 'AdSense Compliance and Technical Audit Expert',
    description: 'Strict AdSense-focused compliance, navigation, and technical SEO audit of the site with executable fixes.',
    category: Category.BUSINESS,
    tags: ['AdSense', 'SEO', 'Compliance', 'Audit', 'Site Optimization'],
    content: `# Role
You are a senior Google AdSense review expert and a full-stack engineer proficient in SEO and frontend optimization.

# Context
I am developing/maintaining a website and preparing to apply for Google AdSense. Previous applications were rejected, possibly due to "low-value content", "site under construction", or "difficult navigation". The site may be an online tool site.

# Task
Scan my current codebase from the perspective of improving the AdSense approval rate, and provide concrete modification suggestions or code fix plans.

# Audit Checklist (Focus on the following items)

## 1. Mandatory Compliance Pages
Check whether my routes or page list prominently include links to the following pages (typically in the Footer or Navbar):
- [ ] Privacy Policy: Ensure content includes statements about cookies and third-party advertisers (Google).
- [ ] Terms of Use / Disclaimer.
- [ ] Contact Us: Has a real mailto: email link or a working form.
- [ ] About Us: Verify existence.

## 2. Site Structure & Navigation
- [ ] Empty link check: Ensure all category links in the Navbar do not point to # or 404 dead links.
- [ ] Empty category check: For blog/news sites, simulate category pages to ensure none show "No posts yet". AdSense strongly penalizes empty categories.
- [ ] Navigation clarity: Are menus too deep? Keep within 2–3 levels.

## 3. Technical SEO & UX
- [ ] Mobile Responsiveness: Check CSS layout for elements overflowing viewport width (horizontal scrolling); verify mobile font sizes.
- [ ] Loading Speed: Identify uncompressed large images or render-blocking JS.
- [ ] Meta Tags: Ensure each page has unique Description and Title tags; avoid site-wide duplicates.
- [ ] Sitemap & Robots: Verify sitemap.xml generation and that robots.txt allows crawling by Googlebot.

## 4. Content Value Structure (for AdSense)
Based on my site type, check whether HTML structure aligns with high-value characteristics:
- Tool Site: Each tool page should include rich textual explanation (≥ 300–500 words). Pages with only inputs and buttons are judged "low value". Suggest where to add "Usage Guide", "Principle Intro", or "FAQ" sections.

# Output Format
Please provide the report in the following structure:
1. 🚨 Critical Issues (must fix): Fatal errors that block AdSense approval (e.g., missing privacy page, dead links).
2. ⚠️ Warning Suggestions (optimize): Structural issues likely to cause "low-value content" judgments (e.g., too little text on tool pages).
3. 🛠 Code Fixes: Directly provide optimized HTML/CSS/JS snippets or config files addressing the issues.

Current Codebase/Site Structure:
[PASTE YOUR FILE LIST OR COMPONENT CODE HERE]`,
    expectedOutput: 'A structured compliance and technical audit report with critical issues, optimization suggestions, and executable code fixes.',
    usage: 'Paste your file structure, component code, or website URL (if using a web-enabled AI) into the bottom placeholder.'
  },
  {
    id: '10',
    title: 'Hyper-Realistic Crowd Composition',
    description: 'Handling complex compositions with multiple famous faces and specific lighting.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Realistic', 'Crowd', 'Cinematic'],
    content: 'Create a hyper-realistic, ultra-sharp, full-color large-format image featuring a massive group of celebrities from different eras, all standing together in a single wide cinematic frame. The image must look like a perfectly photographed editorial cover with impeccable lighting, lifelike skin texture, micro-details of hair, pores, reflections, and fabric fibers.\n\nGENERAL STYLE & MOOD: Photorealistic, 8k, shallow depth of field, soft natural fill light + strong golden rim light. High dynamic range, calibrated color grading. Skin tones perfectly accurate. Crisp fabric detail with individual threads visible. Balanced composition, slightly wide-angle lens (35mm), center-weighted. All celebrities interacting naturally, smiling, posing, or conversing. Minimal background noise, but with enough world-building to feel real.\n\nTHE ENVIRONMENT: A luxurious open-air rooftop terrace at sunset overlooking a modern city skyline. Elements include: Warm golden light wrapping around silhouettes. Polished marble.',
    expectedOutput: 'A detailed prompt for generating a hyper-realistic crowd image.',
    usage: 'This prompt is designed for high-end image generation models like Midjourney or Flux. You can change "celebrities from different eras" to a specific group like "Marvel Superheroes" or "Tech CEOs".',
    previewImageUrl: '/previews/hyper-realistic-crowd.png'
  },
  {
    id: '11',
    title: '2000s Mirror Selfie',
    description: 'Generate authentic early-2000s aesthetic with flash photography and nostalgic elements.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Vintage', '2000s', 'Selfie'],
    content: 'Create a 2000s Mirror Selfie of yourself using Gemini PromptMaster.\n\n{\n  "subject": {\n    "description": "A young woman taking a mirror selfie with very long voluminous dark waves and soft wispy bangs",\n    "age": "young adult",\n    "expression": "confident and slightly playful",\n    "hair": {\n      "color": "dark",\n      "style": "very long, voluminous waves with soft wispy bangs"\n    },\n    "clothing": {\n      "top": {\n        "type": "fitted cropped t-shirt",\n        "color": "cream white",\n        "details": "features a large cute anime-style cat face graphic with big blue eyes, whiskers, and a small pink mouth"\n      }\n    },\n    "face": {\n      "preserve_original": true,\n      "makeup": "natural glam makeup with soft pink dewy blush and glossy red pouty lips"\n    }\n  },\n  "accessories": {\n    "earrings": {\n      "type": "gold geometric hoop earrings"\n    },\n    "jewelry": {\n      "waistchain": "silver waistchain"\n    },\
    "device": {\n      "type": "smartphone",\n      "details": "patterned case"\n    }\n  },\n  "photography": {\n    "camera_style": "early-2000s digital camera aesthetic",\n    "lighting": "harsh super-flash with bright blown-out highlights but subject still visible",\n    "angle": "mirror selfie",\n    "shot_type": "tight selfie composition",\n    "texture": "subtle grain, retro highlights, V6 realism, crisp details, soft shadows"\n  },\n  "background": {\n    "setting": "nostalgic early-2000s bedroom",\n    "wall_color": "pastel tones",\n    "elements": [\n      "chunky wooden dresser",\n      "CD player",\n      "posters of 2000s pop icons",\n      "hanging beaded door curtain",\n      "cluttered vanity with lip glosses"\n    ],\n    "atmosphere": "authentic 2000s nostalgic vibe",\n    "lighting": "retro"\n  }\n}',
    expectedOutput: 'A structured JSON prompt for generating a 2000s style mirror selfie.',
    usage: 'Provides precise control using JSON structure. Edit the hair and clothing in the "subject" field to match your desired look.',
    previewImageUrl: '/previews/y2k-mirror-selfie.png'
  },
  {
    id: '12',
    title: 'Victoria\'s Secret Style Photoshoot',
    description: 'Create high-glamour, backstage-style fashion photography with intricate details.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Fashion', 'Glamour', 'Portrait'],
    content: 'Create a glamorous photoshoot in the style of Victoria\'s Secret. A young woman attached in the uploaded reference image ( Keep the face of the person 100% accurate from the reference image ) stands almost sideways, slightly bent forward, during the final preparation for the show. Makeup artists apply lipstick to her (only her hands are visible in the frame). She is wearing a corset decorated with beaded embroidery and crystals with a short fluffy skirt, as well as large feather wings. The image has a "backstage" effect.\n\nThe background is a darkly lit room, probably under the podium. The main emphasis is on the girl\'s face and the details of her costume. Emphasize the expressiveness of the gaze and the luxurious look of the outfit. The photo is lit by a flash from the camera, which emphasizes the shine of the beads and crystals on the corset, as well as the girl\'s shiny skin. Victoria\'s Secret style: sensuality, luxury, glamour. Very detailed. Important: do not change the face.',
    expectedOutput: 'A detailed description for a high-fashion backstage photo.',
    usage: 'Best used with "Image-to-Image" features. If generating from text only, remove the references to "uploaded reference image".',
    previewImageUrl: '/previews/backstage-fashion.png'
  },
  {
    id: '13',
    title: '1990s Camera Style Portrait',
    description: 'Replicate specific film textures, flash photography, and era-specific atmosphere.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', '90s', 'Film', 'Portrait'],
    content: 'Without changing her original face, create a portrait of a beautiful young woman with porcelain-white skin, captured with a 1990s-style camera using a direct front flash. Her messy dark brown hair is tied up, posing with a calm yet playful smile. She wears a modern oversized cream sweater. The background is a dark white wall covered with aesthetic magazine posters and stickers, evoking a cozy bedroom or personal room atmosphere under dim lighting. The 35mm lens flash creates a nostalgic glow.',
    expectedOutput: 'A prompt for a 90s style flash photography portrait.',
    usage: 'Focuses on the "direct flash" aesthetic. You can change "young woman" to any subject description.',
    previewImageUrl: '/previews/90s-film-portrait.png'
  },
  {
    id: '14',
    title: 'One-Click Business Photo (Silicon Valley Style)',
    description: 'Transforms casual photos into professional studio headshots using specific lens and lighting instructions.',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Business', 'Headshot', 'Professional'],
    content: 'Keep the facial features of the person in the uploaded image exactly consistent . Dress them in a professional navy blue business suit with a white shirt, similar to the reference image. Background : Place the subject against a clean, solid dark gray studio photography backdrop . The background should have a subtle gradient , slightly lighter behind the subject and darker towards the edges (vignette effect). There should be no other objects. Photography Style : Shot on a Sony A7III with an 85mm f/1.4 lens , creating a flattering portrait compression. Lighting : Use a classic three-point lighting setup . The main key light should create soft, defining shadows on the face. A subtle rim light should separate the subject\'s shoulders and hair from the dark background. Crucial Details : Render natural skin texture with visible pores , not an airbrushed look. Add natural catchlights to the eyes . The fabric of the suit should show a subtle wool texture.Final image should be an ultra-realistic, 8k professional headshot.',
    expectedOutput: 'A professional headshot generation prompt.',
    usage: 'Designed for "Face Swap" or "Image-to-Image" workflows. For text-to-image, replace "person in the uploaded image" with a specific person description.',
    previewImageUrl: '/previews/silicon-valley-style.webp'
  },
  {
    id: '15',
    title: 'Emotional Film Photography',
    description: 'Creates a cinematic, nostalgic "Kodak Portra" look while maintaining facial consistency.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Film', 'Emotional', 'Cinematic'],
    content: 'Keep the facial features of the person in the uploaded image exactly consistent . Style : A cinematic, emotional portrait shot on Kodak Portra 400 film . Setting : An urban street coffee shop window at Golden Hour (sunset) . Warm, nostalgic lighting hitting the side of the face. Atmosphere : Apply a subtle film grain and soft focus to create a dreamy, storytelling vibe. Action : The subject is looking slightly away from the camera, holding a coffee cup, with a relaxed, candid expression. Details : High quality, depth of field, bokeh background of city lights.',
    expectedOutput: 'A prompt for emotional film photography style.',
    usage: 'Simulates the look and feel of Kodak Portra 400. Perfect for creating moody, cinematic portraits.',
    // previewImageUrl: '/previews/emotional-film.png'
  },
  {
    id: '16',
    title: 'Professional Headshot Creator',
    description: 'Create a professional profile photo from a selfie.',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Professional', 'Headshot', 'Portrait'],
    content: '"A professional, high-resolution profile photo, maintaining the exact facial structure, identity, and key features of the person in the input image. The subject is framed from the chest up, with ample headroom. The person looks directly at the camera. They are styled for a professional photo studio shoot, wearing a premium smart casual blazer in a subtle charcoal gray. The background is a solid \'#562226\' neutral studio color. Shot from a high angle with bright and airy soft, diffused studio lighting, gently illuminating the face and creating a subtle catchlight in the eyes, conveying a sense of clarity. Captured on an 85mm f/1.8 lens with a shallow depth of field, exquisite focus on the eyes, and beautiful, soft bokeh. Observe crisp detail on the fabric texture of the blazer, individual strands of hair, and natural, realistic skin texture. The atmosphere exudes confidence, professionalism, and approachability. Clean and bright cinematic color grading with subtle warmth and balanced tones, ensuring a polished and contemporary feel."',
    expectedOutput: 'A detailed prompt for professional profile photos.',
    usage: 'Use this to upgrade a casual selfie into a LinkedIn-ready headshot. Requires an input image.',
    previewImageUrl: '/previews/professional-headshot.png'
  },
  {
    id: '17',
    title: 'Hyperrealistic Anime Portrait in Spotlight',
    description: 'A hyperrealistic anime-style portrait with dramatic lighting.',
    category: Category.ART,
    tags: ['Anime', 'Realistic', 'Lighting', 'Portrait'],
    content: 'Generate a hyperrealistic realistic-anime portrait of a female character standing in a completely black background.\nLighting: use a **narrow beam spotlight** focused only on the center of the face. \nThe edges of the light must be sharp and dramatic. \nAll areas outside the spotlight should fall quickly into deep darkness \n(high falloff shadow), almost blending into the black background. \nNot soft lighting.\nHair: long dark hair with some strands falling over the face. The lower parts of the hair should fade into the shadows.\nPose: one hand raised gently to the lips in a shy, hesitant gesture. \nEyes looking directly at the camera with a mysterious mood.\nClothing: black long-sleeve knit sweater; \nthe sweater and body should mostly disappear into the darkness with minimal detail.\nOverall tone: dark, moody, dramatic, mysterious. \nHigh-contrast only in the lit portion of the face. \nEverything outside the spotlight should be nearly invisible.',
    expectedOutput: 'A prompt for dramatic lighting anime portrait.',
    usage: 'Creates a high-contrast, dramatic look. You can change "female character" and "long dark hair" to customize the subject.',
    previewImageUrl: '/previews/anime-spotlight.png'
  },
  {
    id: '18',
    title: 'Bathroom Mirror Selfie',
    description: 'Create a candid mirror selfie with specific styling and composition.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Selfie', 'Lifestyle', 'Casual'],
    content: '{\n  "subject": {\n    "description": "Young woman taking bathroom mirror selfie, innocent doe eyes but the outfit tells another story",\n    "mirror_rules": "facing mirror, hips slightly angled, close to mirror filling frame",\n    "age": "early 20s",\n    \n    "expression": {\n      "eyes": "big innocent doe eyes looking up through lashes, \'who me?\' energy",\n      "mouth": "soft pout, lips slightly parted, maybe tiny tongue touching corner",\n      "brows": "soft, slightly raised, faux innocent",\n      "overall": "angel face but devil body, the contrast is the whole point"\n    },\n    \n    "hair": {\n      "color": "platinum blonde",\n      "style": "messy bun or claw clip, loose strands framing face, effortless"\n    },\n    \n    "body": {\n      "waist": "tiny",\n      "ass": "round, full, fabric of shorts riding up and clinging between cheeks, every curve visible through thin athletic material",\n      "thighs": "thick, soft, shorts barely containing"\n    },\n    \n    "clothing": {\n      "top": {\n        "type": "ULTRA mini crop tee",\n        "color": "yellow",\n        "graphic": "single BANANA logo/graphic",\n        "fit": "barely containing chest, fabric stretched tight, ends just below, shows full stomach"\n      },\n      "bottom": {\n        "type": "tight tennis skort or athletic booty shorts",\n        "color": "white",\n        "material": "thin stretchy athletic fabric",\n        "fit": "vacuum tight, riding up, clinging between cheeks, fabric creases visible, leaving nothing to imagination"\n      }\n    },\n    \n    "face": {\n      "features": "pretty - big eyes, small nose, full lips",\n      "makeup": "minimal, natural, lip gloss, no-makeup makeup"\n    }\n  },\n\n  "accessories": {\n    "headwear": {\n      "type": "Goorin Bros cap",\n      "details": "black with animal patch, worn backwards or tilted"\n    },\n    "headphones": {\n      "type": "over-ear white headphones around neck"\n    }\n  }\n}',
    expectedOutput: 'A structured JSON prompt for a specific bathroom selfie vibe.',
    usage: 'Highly detailed JSON prompt. Edit the "clothing" and "subject" sections to change the character\'s appearance.'
  },
  {
    id: '19',
    title: 'Chalkboard Anime Art Documentation',
    description: 'Photorealistic documentation of a chalkboard anime drawing.',
    category: Category.ART,
    tags: ['Art', 'Anime', 'Chalkboard', 'Realistic'],
    content: '{\n  "intent": "Photorealistic documentation of a specific chalkboard art piece featuring a single anime character, capturing the ephemeral nature of the medium within a classroom context.",\n  "frame": {\n    "aspect_ratio": "4:3",\n    "composition": "A centered medium shot focusing on the chalkboard mural. The composition includes the teacher\'s desk in the immediate foreground to provide scale, with the artwork of the single character dominating the background space.",\n    "style_mode": "documentary_realism, texture-focused, ambient naturalism"\n  },\n  "subject": {\n    "primary_subject": "A large-scale, intricate chalk drawing of [CHARACTER NAME] on a standard green classroom blackboard.",\n    "visual_details": "The illustration depicts [CHARACTER NAME] in a commanding pose, positioned centrally on the board. [ADDITIONAL DETAILS]",\n    "medium_texture": "The image preserves the dusty, matte quality of the chalk. Visible hatching and cross-hatching strokes create shading on her clothing and hair. Smudged areas on the green slate indicate where colors have been blended by hand.",\n    "surrounding_elements": "To the right of the character, vertical Japanese text reading \'[TEXT]\' is written in crisp white chalk."\n  },\n  "environment": {\n    "location": "A standard Japanese school classroom.",\n    "foreground_elements": "A wooden teacher\'s desk occupies the lower foreground. Scattered across the surface are a yellow box of colored chalks, loose sticks of red, white, and blue chalk."\n  }\n}',
    expectedOutput: 'A structured JSON prompt for documenting chalkboard art.',
    usage: 'Replace [CHARACTER NAME] with your desired character (e.g., "Naruto").'
  },
  {
    id: '20',
    title: 'Portrait with Puppy in Snow',
    description: 'Create a winter portrait with a puppy while maintaining facial consistency.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Winter', 'Portrait', 'Pet'],
    content: '{\n  "image_description": {\n    "subject": {\n      "face": {\n        "preserve_original": true,\n        "reference_match": true,\n        "description": "The girl\'s facial features, expression, and identity must remain exactly the same as the reference image."\n      },\n      "girl": {\n        "age": "young",\n        "hair": "long, wavy brown hair",\n        "expression": "puckering her lips toward the camera",\n        "clothing": "black hooded sweatshirt"\n      },\n      "puppy": {\n        "type": "small white puppy",\n        "eyes": "light blue",\n        "expression": "calm, looking forward"\n      }\n    },\n    "environment": {\n      "setting": "outdoors in a winter scene",\n      "elements": [\n        "snow covering the ground",\n        "bare trees in the background",\n        "blurred silver car behind the girl"\n      ],\n      "sky": "clear light blue sky"\n    },\n    "mood": "cute, natural, winter outdoor moment",\n    "camera_style": "soft depth of field, natural daylight, subtle winter tones"\n  }\n}',
    expectedOutput: 'A structured JSON prompt for a winter portrait with a puppy.',
    usage: 'JSON format allows easy modification of "puppy" type or "environment" details.'
  },
  {
    id: '21',
    title: 'Fisheye Movie Character Selfie',
    description: 'A 360-degree selfie with movie characters using a fisheye lens.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Fisheye', 'Selfie', 'Creative'],
    content: 'A film-like fisheye wide-angle 360-degree selfie without any camera or phone visible in the subject\'s hands. A real and exaggerated selfie of [person from uploaded image] with [CHARACTERS]. They are making faces at the camera.\n\n(more detailed version)\nA hyper-realistic fisheye wide-angle selfie, captured with a vintage 35mm fisheye lens creating heavy barrel distortion. without any camera or phone visible in the subject\'s hands.\nSubject & Action: A close-up, distorted group photo featuring [Person From Uploaded Image] taking selfie with [CHARACTERS]. Everyone is making wild, exaggerated faces, squinting slightly from the flash.\nLighting & Texture: Harsh, direct on-camera flash lighting that creates hard shadows behind the subjects. Authentic film grain, slight motion blur on the edges, and chromatic aberration. It looks like a candid, amateur snapshot as if captured during a chaotic behind-the-scenes moment, not a studio photo.',
    expectedOutput: 'A prompt for a distorted fisheye selfie.',
    usage: 'Replace [CHARACTERS] with the group you want (e.g., "The Avengers" or "Harry Potter cast").'
  },
  {
    id: '22',
    title: 'Character Consistency Selfie',
    description: 'Take a selfie with a movie character while preserving your features.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Realistic', 'Portrait', 'Fanart'],
    content: '"I\'m taking a selfie with [MOVIE CHARACTER] on the set of [MOVIE NAME].\n\nKeep the person exactly as shown in the reference image with 100% identical facial features, bone structure, skin tone, facial expression, pose, and appearance. 1:1 aspect ratio, 4K detail."',
    expectedOutput: 'A simple prompt for a selfie with a fictional character.',
    usage: 'Replace [MOVIE CHARACTER] and [MOVIE NAME] with your choices (e.g., "Iron Man" and "Avengers").'
  },
  {
    id: '23',
    title: 'Museum Art Exhibition Selfie',
    description: 'A commercial-grade photo with a classical oil painting.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Art', 'Museum', 'Commercial'],
    content: 'A commercial grade photograph of [uploaded reference image] posing inside a high-end museum exhibition space.\n[the character Source: Based strictly on the uploaded reference image.\nBehind them hangs a large, ornate framed classical oil painting.\n\nThe painting depicts the same person but rendered in a rich,\ntraditional oil painting style with thick, visible impasto brushstrokes, deep textures, and rich color palettes on canvas.\nGallery spotlights hit the textured paint surface.\nMasterpiece, ultra-detailed, cinematic lighting, strong contrast, dramatic shadows, 8K UHD, highly detailed textures\n, professional photography.',
    expectedOutput: 'A prompt for a museum setting photo.',
    usage: 'Requires an uploaded reference image for the best effect ("person looking at a painting of themselves").'
  },
  {
    id: '24',
    title: 'Compact Camera Screen Display',
    description: 'A photo displayed on a compact digital camera screen.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Retro', 'Digital Camera', 'Simulation'],
    content: 'Use facial feature of attached photo. A close-up shot of a young woman displayed on the screen of a compact Canon digital camera. The camera body surrounds the image with its buttons, dials, and textured surface visible, including the FUNC/SET wheel, DISP button, and the "IMAGE STABILIZER" label along the side. The photo on the screen shows the woman indoors at night, illuminated by a bright built-in flash that creates sharp highlights on her face and hair. She has long dark hair falling across part of her face in loose strands, with a soft, slightly open-lip expression. The flash accentuates her features against a dim, cluttered kitchen background with appliances, shelves, and metallic surfaces softly blurred. The mood is candid, raw, nostalgic, and reminiscent of early 2000s digital camera snapshots. Colors are slightly muted with cool undertones, strong flash contrast, and natural grain from the display. No text, no logos inside the photo preview itself.\n\nScale ratio: 4:5 vertical\n\nCamera: compact digital camera simulation\nLens: equivalent to 28–35mm\nAperture: f/2.8\nISO: 400\nShutter speed: 1/60 with flash\nWhite balance: auto flash\nLighting: harsh direct flash on subject, ambient low light in the background\nColor grading: nostalgic digital-camera tones, high contrast flash, subtle display grain, authentic screen glow.',
    expectedOutput: 'A detailed prompt for simulating a camera screen view.',
    usage: 'Creates a "picture within a picture" effect. You can change "young woman" to any other subject.',
    previewImageUrl: '/previews/camera-screen-playback.webp'
  },
  {
    id: '25',
    title: 'Magazine Cover Portrait',
    description: 'Create a glossy magazine cover with dynamic portrait.',
    category: Category.COMMERCIAL,
    tags: ['Design', 'Magazine', 'Cover', 'Fashion'],
    content: 'A photo of a glossy magazine cover, the cover has the large bold words "[MAGAZINE TITLE]". The text is in a serif font, black on white, and fills the view. No other text.\n\nIn front of the text there is a dynamic portrait of [SUBJECT DESCRIPTION] in high-end fashion.\n\nPut the issue number and today\'s date in the corner along with a barcode and a price. The magazine is on a white shelf against a wall.',
    expectedOutput: 'A prompt for a magazine cover design.',
    usage: 'Replace "[MAGAZINE TITLE]" (e.g., "VOGUE") and "[SUBJECT DESCRIPTION]" with your desired content.',
    // previewImageUrl: '/previews/magazine-cover.png'
  },
  {
    id: '26',
    title: 'Luxury Product Photography',
    description: 'High-end product shot floating on water with florals and lighting.',
    category: Category.COMMERCIAL,
    tags: ['Photography', 'Product', 'Luxury', 'Commercial'],
    content: 'Product:\n[BRAND] [PRODUCT NAME] - [bottle shape], [label description], [liquid color]\n\nScene:\nLuxury product shot floating on dark water with [flower type] in [colors] arranged around it.\n[Lighting style - e.g., "golden hour glow" /\n"bright fresh light"] creates reflections and ripples across the water.\n\nMood & Style:\n[Adjectives - e.g., "ethereal and luxurious" /\n"fresh and clean"], high-end commercial photography, [camera angle], shallow depth of field with soft bokeh background',
    expectedOutput: 'A template prompt for luxury product photography.',
    usage: 'Fill in the bracketed sections like [BRAND], [PRODUCT NAME], and [flower type] to generate product photos.',
    previewImageUrl: '/previews/luxury-product-photography.webp'
  },
  {
    id: '27',
    title: 'Star Wars "Where\'s Waldo"',
    description: 'Dense crowd seeking game image featuring all Star Wars characters.',
    category: Category.ART,
    tags: ['Creative', 'Crowd', 'Star Wars', 'Fun'],
    content: 'A where is waldo image showing all Star Wars characters on Tatooine\n\nFirst one to pull this off. First take. Even Waldo is there.',
    expectedOutput: 'A prompt for a crowded "Where\'s Waldo" style image.',
    usage: 'Fun prompt. You can replace "Star Wars" and "Tatooine" with other franchises (e.g., "Harry Potter" at "Hogwarts").',
    // previewImageUrl: '/previews/waldo-starwars.png'
  },
  {
    id: '28',
    title: 'Aging Through the Years',
    description: 'Demonstrates temporal consistency and aging effects on a single subject.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Aging', 'Time', 'Realistic'],
    content: '"Generate the holiday photo of this person through the ages up to 80 years old"',
    expectedOutput: 'A simple prompt for aging progression.',
    usage: 'Best used with an input image of a person to see them age.'
  },
  {
    id: '29',
    title: 'Recursive Visuals',
    description: 'Demonstrates the model\'s ability to handle infinite loop logic (Droste effect).',
    category: Category.ART,
    tags: ['Creative', 'Recursive', 'Abstract', 'Surreal'],
    content: 'recursive image of an orange cat sitting in an office chair holding up an iPad. On the iPad is the same cat in the same scene holding up the same iPad. Repeated on each iPad.',
    expectedOutput: 'A prompt for a recursive visual effect.',
    usage: 'The "Droste effect". Change "orange cat" to any other subject you\'d like to see recursive.',
    previewImageUrl: '/previews/recursive-cat.png'
  },
  {
    id: '30',
    title: 'Coordinate Visualization',
    description: 'Generates a specific location and time based purely on latitude/longitude coordinates.',
    category: Category.ART,
    tags: ['Experimental', 'Location', 'Coordinates', 'Realistic'],
    content: '[LATITUDE]° N, [LONGITUDE]° E at [TIME]',
    expectedOutput: 'A prompt using only coordinates.',
    usage: 'Replace placeholders with real coordinates (e.g., "35.6586° N, 139.7454° E at 19:00" for Tokyo Tower).'
  },
  {
    id: '31',
    title: 'Conceptual Visualization',
    description: 'Interpretative rendering of how a specific group visualizes a landmark.',
    category: Category.ART,
    tags: ['Creative', 'Conceptual', 'Abstract', 'Perspective'],
    content: 'How [PROFESSION/GROUP] see [OBJECT/LANDMARK]',
    expectedOutput: 'A conceptual prompt for abstract visualization.',
    usage: 'Replace placeholders (e.g., "How engineers see the Golden Gate Bridge").'
  },
  {
    id: '32',
    title: 'Literal Interpretation',
    description: 'Interprets a filename as a visual subject.',
    category: Category.ART,
    tags: ['Experimental', 'Literal', 'Abstract', 'Fun'],
    content: 'rare.jpg',
    expectedOutput: 'A prompt testing literal interpretation of text.',
    usage: 'Some models interpret filenames literally. Try "img_final_v2.png" or "confidential_evidence.jpg".'
  },
  {
    id: '33',
    title: 'Multi-Subject Compositing',
    description: 'Combines multiple input portraits into a single cohesive group photo.',
    category: Category.PHOTOGRAPHY,
    tags: ['Photography', 'Composite', 'Group', 'Portrait'],
    content: 'an office team photo, everyone making a silly face',
    expectedOutput: 'A prompt for group compositing.',
    usage: 'Simple but effective. Works best when you upload multiple reference images to an AI that supports compositing.'
  },
  {
    id: '34',
    title: 'Whiteboard Marker Art',
    description: 'Simulating specific drawing media (faded marker) on glass textures.',
    category: Category.ART,
    tags: ['Art', 'Whiteboard', 'Sketch', 'Realistic'],
    content: 'Create a photo of [SUBJECT] drawn on a glass whiteboard in a slightly faded green marker',
    expectedOutput: 'A prompt for specific artistic medium simulation.',
    usage: 'Replace [SUBJECT] with what you want drawn (e.g., "a complex flow chart" or "Mona Lisa").'
  },
  {
    id: '35',
    title: 'Split View 3D Render',
    description: 'Create a 3D render with realistic left half and wireframe right half.',
    category: Category.ART,
    tags: ['3D', 'Render', 'Technical', 'Design'],
    content: 'Create a high-quality, realistic 3D render of exactly one instance of the object: [OBJECT NAME].\nThe object must float freely in mid-air and be gently tilted and rotated in 3D space (not front-facing).\nUse a soft, minimalist dark background in a clean 1080×1080 composition.\nLeft Half — Full Realism\nThe left half of the object should appear exactly as it looks in real life\n— accurate materials, colors, textures, reflections, and proportions.\nThis half must be completely opaque with no transparency and no wireframe overlay.\nNo soft transition, no fading, no blending.\nRight Half — Hard Cut Wireframe Interior\nThe right half must switch cleanly to a wireframe interior diagram.\nThe boundary between the two halves must be a perfectly vertical, perfectly sharp, crisp cut line, stretching straight from the top edge to the bottom edge of the object.\nNo diagonal edges, no curved slicing, no gradient.\nThe wireframe must use only two line colors:\nPrimary: white (≈80% of all lines)\nSecondary: a color sampled from the dominant color of the realistic half (<20% of lines)\nThe wireframe lines must be thin, precise, aligned, and engineering-style.\nEvery wireframe component must perfectly match the geometry of the object.\nStrict Single-Object Rule\nRender only ONE object in the entire frame.  Render only one physical object.\nDo NOT show a second object from any angle. Do NOT show a second object for comparison or display purposes.\nOnly one single object is allowed in the entire frame.\nThe object must appear alone, floating.\nPose & Lighting:\nApply a natural, subtle tilt + rotation in 3D.',
    expectedOutput: 'A complex prompt for split-view 3D rendering.',
    usage: 'Replace [OBJECT NAME] with a specific product (e.g., "Orange iPhone 17 Pro" or "Nike Air Jordan").',
    previewImageUrl: '/previews/3d-split-view.webp'
  },
  {
    id: '36',
    title: 'Anthropomorphic Bunny Selfie',
    description: 'A snapshot selfie of a weary anthropomorphic bunny in an office setting.',
    category: Category.PHOTOGRAPHY,
    tags: ['Anthropomorphic', 'Selfie', 'Office', 'Snapshot', 'Weary'],
    content: 'A snapshot photo of an anthropomorphic small rabbit with a weary, cynical expression. The rabbit is taking a close-up selfie (headshot), occupying the center of the frame. It wears a work badge around its neck featuring its own headshot. The photo has a casual, daily snapshot visual style with no clear subject or deliberate composition, and features slight motion blur. Background is an office setting with a computer screen showing a graphic design page nearby. The atmosphere is mundane yet unique.',
    expectedOutput: 'A unique anthropomorphic character snapshot.',
    usage: 'Great for generating character-driven snapshots with specific mood and storytelling elements.',
    previewImageUrl: '/previews/weary-bunny-office-selfie.webp'
  }
];

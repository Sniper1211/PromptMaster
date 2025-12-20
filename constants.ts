
import { Category, Prompt } from './types';

export const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Modern React Component Architect',
    description: 'Expert guidance for creating scalable, type-safe React components.',
    category: Category.CODING,
    tags: ['React', 'TypeScript', 'Best Practices'],
    content: 'Act as a senior frontend engineer. I will describe a UI component requirement, and you will provide a complete, well-documented TypeScript React component using Tailwind CSS. Focus on accessibility, performance, and clean code principles.',
    expectedOutput: 'A complete React component file with clear comments and modern hook usage.'
  },
  {
    id: '2',
    title: 'Cognitive Storyteller',
    description: 'Generate emotionally resonant narratives with psychological depth.',
    category: Category.CREATIVE,
    tags: ['Writing', 'Narrative', 'Psychology'],
    content: 'Write a short story (approx 500 words) about a character discovering an old memory. Use sensory details to evoke emotion and incorporate a psychological concept like "anchoring" or "reminiscence bump" as a central theme.',
    expectedOutput: 'An evocative short story with rich imagery and thematic consistency.'
  },
  {
    id: '3',
    title: 'Scientific Paper Summarizer',
    description: 'Condense complex research into digestible insights.',
    category: Category.ACADEMIC,
    tags: ['Research', 'Summarization', 'Science'],
    content: 'I will provide a snippet of a scientific research paper. Please summarize it using the "ELI5" (Explain Like I\'m 5) method first, then provide a more technical bulleted list of the key methodology, findings, and limitations.',
    expectedOutput: 'A two-part summary: one simple explanation and one structured technical analysis.'
  },
  {
    id: '4',
    title: 'SaaS Business Strategist',
    description: 'Develop marketing strategies and go-to-market plans.',
    category: Category.BUSINESS,
    tags: ['Marketing', 'Strategy', 'SaaS'],
    content: 'Act as a growth consultant for a new SaaS platform that automates invoice collection for freelancers. Develop a 30-day go-to-market strategy focusing on low-budget, high-impact channels.',
    expectedOutput: 'A day-by-day or week-by-week strategy guide with specific actionable steps.'
  },
  {
    id: '5',
    title: 'Python Data Cleaner',
    description: 'Quickly generate robust data preprocessing scripts.',
    category: Category.CODING,
    tags: ['Python', 'Pandas', 'Data Science'],
    content: 'Create a Python script using Pandas that takes a messy CSV file with missing values, inconsistent date formats, and duplicate rows. The script should perform thorough cleaning and export a standardized dataset.',
    expectedOutput: 'A clean, commented Python script ready to handle edge cases in data.'
  },
  {
    id: '6',
    title: 'Master Prompt Engineer Coach',
    description: 'Refine and optimize your own prompts.',
    category: Category.PRODUCTIVITY,
    tags: ['Meta-Prompting', 'Optimization'],
    content: 'I will give you a draft prompt. Your job is to critique it using the following criteria: clarity, context, constraints, and goal-orientation. Then, provide an optimized version of that prompt that will yield better results from an LLM.',
    expectedOutput: 'Detailed feedback followed by a significantly improved version of the user\'s input.'
  }
];

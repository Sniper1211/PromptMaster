
export enum Category {
  ALL = 'All',
  CODING = 'Coding',
  WRITING = 'Writing',
  BUSINESS = 'Business',
  PHOTOGRAPHY = 'Photography',
  ART = 'Art & Design',
  COMMERCIAL = 'Commercial Visuals'
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  chineseContent?: string; // Optional Chinese translation for display or reference
  category: Category;
  tags: string[];
  expectedOutput: string;
  usage?: string; // Instructions on how to use this prompt (e.g. "Replace [placeholder] with...")
}

export interface GenerationResult {
  text: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}


export enum Category {
  ALL = 'All',
  CREATIVE = 'Creative Writing',
  CODING = 'Coding & Technical',
  PRODUCTIVITY = 'Productivity',
  ACADEMIC = 'Academic & Research',
  ROLEPLAY = 'Roleplay',
  BUSINESS = 'Business & Marketing'
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  chineseContent?: string; // Optional Chinese translation for display
  category: Category;
  tags: string[];
  expectedOutput: string;
}

export interface GenerationResult {
  text: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

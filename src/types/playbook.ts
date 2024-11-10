export type PlaybookComplexity = 'basic' | 'intermediate' | 'advanced';
export type PlaybookStructure = 'single' | 'multi';

export interface PlaybookHistory {
  id: string;
  name: string;
  complexity: PlaybookComplexity;
  structure: PlaybookStructure;
  createdAt: Date;
  content: string | Record<string, string>;
}
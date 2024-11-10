export interface PlaybookHistory {
  id: string;
  name: string;
  type: 'simple' | 'advanced';
  format: 'single' | 'multiple';
  createdAt: Date;
  content: string | PlaybookFiles;
}

export interface PlaybookFiles {
  main: string;
  vars?: string;
  handlers?: string;
  tasks?: string;
  templates?: Record<string, string>;
}
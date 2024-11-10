export interface PlaybookHistory {
  id: string;
  name: string;
  type: 'simple' | 'advanced';
  createdAt: Date;
  content: string;
}
export interface ParsedTask {
  id: string;
  type: 'package' | 'service' | 'file' | 'config' | 'command';
  action: string;
  target: string;
  originalText: string;
  details?: {
    state?: string;
    enabled?: boolean;
    path?: string;
    requires?: string[];
    generate?: boolean;
    [key: string]: any;
  };
}

export type TaskType = ParsedTask['type'];
export type TaskAction = string;
import type { TaskType } from '../types/task';

export function getAvailableActions(type: TaskType): string[] {
  switch (type) {
    case 'package':
      return ['install', 'remove'];
    case 'service':
      return ['start', 'stop', 'restart', 'enable', 'disable'];
    case 'config':
      return ['configure'];
    case 'file':
      return ['create', 'remove'];
    case 'command':
      return ['run'];
    default:
      return [];
  }
}

export function formatAction(action: string): string {
  return action.charAt(0).toUpperCase() + action.slice(1);
}
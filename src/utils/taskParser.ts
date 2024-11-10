import type { ParsedTask } from '../types/task';

function generateTaskId(): string {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

export function parseUserNeeds(description: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const sentences = description.split(/[.!?]+/).filter(Boolean);
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    const lowerSentence = trimmedSentence.toLowerCase();
    
    // Package installations
    if (lowerSentence.includes('install') || lowerSentence.includes('add')) {
      const packages = lowerSentence
        .replace(/^(please\s+)?(install|add)\s+/i, '')
        .split(/(?:,|\s+and\s+|\s+with\s+)/)
        .map(pkg => pkg.trim())
        .filter(pkg => pkg && !pkg.includes('configure'));

      packages.forEach(pkg => {
        tasks.push({
          id: generateTaskId(),
          type: 'package',
          action: 'install',
          target: pkg,
          originalText: trimmedSentence,
          details: { state: 'present' }
        });
      });
    }

    // Service management
    const serviceActions = ['start', 'stop', 'restart', 'enable', 'disable'];
    for (const action of serviceActions) {
      if (lowerSentence.includes(action)) {
        const serviceMatch = lowerSentence.match(new RegExp(`${action}\\s+([\\w-]+)(?:\\s+service)?`));
        if (serviceMatch) {
          tasks.push({
            id: generateTaskId(),
            type: 'service',
            action: action,
            target: serviceMatch[1],
            originalText: trimmedSentence,
            details: {
              state: action === 'enable' || action === 'disable' ? undefined : action,
              enabled: action === 'enable' ? true : action === 'disable' ? false : undefined
            }
          });
        }
      }
    }

    // Configuration tasks
    if (lowerSentence.includes('configure') || lowerSentence.includes('setup') || lowerSentence.includes('set up')) {
      const configItems = ['ssl', 'nginx', 'apache', 'mysql', 'postgresql', 'php', 'python'];
      for (const item of configItems) {
        if (lowerSentence.includes(item)) {
          tasks.push({
            id: generateTaskId(),
            type: 'config',
            action: 'configure',
            target: item,
            originalText: trimmedSentence,
            details: {
              path: `/etc/${item}`,
              requires: item === 'ssl' ? ['openssl'] : undefined
            }
          });
        }
      }
    }

    // File operations
    const fileActions = ['create', 'remove', 'delete'];
    for (const action of fileActions) {
      if (lowerSentence.includes(action)) {
        const fileMatch = lowerSentence.match(new RegExp(`${action}\\s+(directory|file|folder)\\s+([\\w/.-]+)`));
        if (fileMatch) {
          tasks.push({
            id: generateTaskId(),
            type: 'file',
            action: action === 'delete' ? 'remove' : action,
            target: fileMatch[2],
            originalText: trimmedSentence,
            details: {
              type: fileMatch[1],
              path: fileMatch[2]
            }
          });
        }
      }
    }

    // If no specific pattern matches but contains action keywords, add as a command
    if (!tasks.some(task => task.originalText === trimmedSentence)) {
      const actionKeywords = ['install', 'configure', 'setup', 'start', 'enable', 'create'];
      if (actionKeywords.some(keyword => lowerSentence.includes(keyword))) {
        tasks.push({
          id: generateTaskId(),
          type: 'command',
          action: 'run',
          target: 'custom',
          originalText: trimmedSentence,
          details: { command: trimmedSentence }
        });
      }
    }
  }

  return tasks;
}
interface ParsedTask {
  id: string;
  type: 'package' | 'service' | 'file' | 'config' | 'command';
  action: string;
  target: string;
  details?: Record<string, any>;
}

export function parseUserNeeds(description: string): ParsedTask[] {
  const desc = description.toLowerCase();
  const tasks: ParsedTask[] = [];
  
  // Package management patterns
  const installPattern = /\b(install|add)\s+(\w+)\b/g;
  let match;
  while ((match = installPattern.exec(desc)) !== null) {
    tasks.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'package',
      action: 'install',
      target: match[2],
      details: { state: 'present' }
    });
  }

  // Service management patterns
  const servicePattern = /\b(start|stop|restart|enable|disable)\s+(\w+)(?:\s+service)?\b/g;
  while ((match = servicePattern.exec(desc)) !== null) {
    tasks.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'service',
      action: match[1],
      target: match[2],
      details: { 
        state: match[1] === 'enable' || match[1] === 'disable' ? undefined : match[1],
        enabled: match[1] === 'enable' ? true : match[1] === 'disable' ? false : undefined
      }
    });
  }

  // Configuration patterns
  const configPattern = /\b(configure|setup|set up)\s+(ssl|certificates|nginx|config)\b/g;
  while ((match = configPattern.exec(desc)) !== null) {
    tasks.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'config',
      action: 'configure',
      target: match[2],
      details: {
        path: match[2] === 'ssl' ? '/etc/ssl' : `/etc/${match[2]}`
      }
    });
  }

  return tasks;
}
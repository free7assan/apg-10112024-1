import type { PlaybookType } from '../components/PlaybookForm';
import type { ParsedTask } from './needsParser';
import { parseUserNeeds } from './needsParser';

function generateTaskYaml(task: ParsedTask): string {
  switch (task.type) {
    case 'package':
      return `    - name: Install ${task.target}
      package:
        name: ${task.target}
        state: present`;
    
    case 'service':
      return `    - name: ${task.action} ${task.target} service
      service:
        name: ${task.target}
        state: ${task.details?.state || 'started'}${
        task.details?.enabled !== undefined ? '\n        enabled: ' + task.details.enabled : ''
      }`;
    
    case 'file':
      return `    - name: ${task.action} ${task.target}
      file:
        path: ${task.details?.path || task.target}
        state: ${task.details?.state || 'directory'}
        mode: '0755'`;
    
    case 'config':
      return `    - name: Configure ${task.target}
      template:
        src: ${task.target}.conf.j2
        dest: /etc/${task.target}/${task.target}.conf
        mode: '0644'
      notify: Restart ${task.target}`;
    
    case 'command':
      return `    - name: Execute command
      command: ${task.details?.cmd || task.target}`;
    
    default:
      return '';
  }
}

function generateHandlers(tasks: ParsedTask[]): string {
  const serviceConfigs = tasks.filter(task => task.type === 'config');
  if (serviceConfigs.length === 0) return '';

  return `\n  handlers:${serviceConfigs.map(task => `
    - name: Restart ${task.target}
      service:
        name: ${task.target}
        state: restarted`).join('')}`;
}

function generateVars(tasks: ParsedTask[]): string {
  const configTasks = tasks.filter(task => task.type === 'config');
  if (configTasks.length === 0) return '';

  return `  vars:${configTasks.map(task => `
    ${task.target}_port: 80
    ${task.target}_root: /var/www/${task.target}`).join('')}`;
}

export function generatePlaybookContent(
  description: string,
  type: PlaybookType,
  format: 'single' | 'multiple'
): string | Record<string, string> {
  const tasks = parseUserNeeds(description);
  
  const mainPlaybook = `---
- name: ${type === 'simple' ? 'Simple' : 'Advanced'} Playbook
  hosts: all
  become: yes
  ${type === 'advanced' && tasks.some(t => t.type === 'config') ? `\n${generateVars(tasks)}` : ''}
  ${type === 'advanced' ? `
  pre_tasks:
    - name: Update package cache
      apt:
        update_cache: yes
      when: ansible_os_family == "Debian"` : ''}
  
  tasks:${tasks.map(task => `\n${generateTaskYaml(task)}`).join('\n')}${
    type === 'advanced' ? generateHandlers(tasks) : ''
  }`;

  if (format === 'single') {
    return mainPlaybook;
  }

  const files: Record<string, string> = {
    'main.yml': '---\n- name: Main Playbook\n  import_playbook: tasks/main.yml',
    'tasks/main.yml': mainPlaybook
  };

  if (type === 'advanced') {
    const configTasks = tasks.filter(t => t.type === 'config');
    if (configTasks.length > 0) {
      files['vars/main.yml'] = `---${configTasks.map(task => `
${task.target}_port: 80
${task.target}_root: /var/www/${task.target}`).join('')}`;
      
      files['handlers/main.yml'] = `---${configTasks.map(task => `
- name: Restart ${task.target}
  service:
    name: ${task.target}
    state: restarted`).join('')}`;
    }
  }

  return files;
}
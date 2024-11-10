import { useState } from 'react';
import type { PlaybookHistory, PlaybookComplexity, PlaybookStructure } from '../types/playbook';

export function usePlaybookHistory() {
  const [playbooks, setPlaybooks] = useState<PlaybookHistory[]>([]);

  const addPlaybook = (
    name: string, 
    complexity: PlaybookComplexity,
    structure: PlaybookStructure,
    content: string | Record<string, string>
  ) => {
    const newPlaybook: PlaybookHistory = {
      id: Date.now().toString(),
      name,
      complexity,
      structure,
      createdAt: new Date(),
      content,
    };
    
    setPlaybooks(prev => [newPlaybook, ...prev]);
  };

  const deletePlaybook = (id: string) => {
    setPlaybooks(prev => prev.filter(playbook => playbook.id !== id));
  };

  return {
    playbooks,
    addPlaybook,
    deletePlaybook,
  };
}
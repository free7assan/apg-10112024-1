import React from 'react';
import { FileText, Files } from 'lucide-react';
import type { PlaybookStructure } from '../types/playbook';

interface PlaybookStructureProps {
  selected: PlaybookStructure;
  onChange: (structure: PlaybookStructure) => void;
}

export function PlaybookStructure({ selected, onChange }: PlaybookStructureProps) {
  const options = [
    {
      value: 'single',
      icon: FileText,
      title: 'Single File',
      description: 'All playbook content in one file for simplicity and portability'
    },
    {
      value: 'multi',
      icon: Files,
      title: 'Multiple Files',
      description: 'Split into separate files (tasks, vars, handlers) for better organization'
    }
  ] as const;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Choose File Structure
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(({ value, icon: Icon, title, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selected === value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <Icon className={`h-6 w-6 ${
                selected === value ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
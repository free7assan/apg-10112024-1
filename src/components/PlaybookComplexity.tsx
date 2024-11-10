import React from 'react';
import { Wrench, Settings2, Cog } from 'lucide-react';
import type { PlaybookComplexity } from '../types/playbook';

interface PlaybookComplexityProps {
  selected: PlaybookComplexity;
  onChange: (complexity: PlaybookComplexity) => void;
}

export function PlaybookComplexity({ selected, onChange }: PlaybookComplexityProps) {
  const options = [
    {
      value: 'basic',
      icon: Wrench,
      title: 'Basic',
      description: 'Simple tasks with minimal configuration and error handling'
    },
    {
      value: 'intermediate',
      icon: Settings2,
      title: 'Intermediate',
      description: 'Includes variables, basic error handling, and common best practices'
    },
    {
      value: 'advanced',
      icon: Cog,
      title: 'Advanced',
      description: 'Full features with handlers, templates, extensive error handling, and optimizations'
    }
  ] as const;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Choose Playbook Complexity
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
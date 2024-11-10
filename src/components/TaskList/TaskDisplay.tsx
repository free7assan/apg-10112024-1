import React from 'react';
import { Edit2, X } from 'lucide-react';
import type { ParsedTask } from '../../types/task';

interface TaskDisplayProps {
  task: ParsedTask;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDisplay({ task, onEdit, onDelete }: TaskDisplayProps) {
  return (
    <>
      <div className="flex-1">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.type === 'package' ? 'bg-blue-100 text-blue-800' :
            task.type === 'service' ? 'bg-green-100 text-green-800' :
            task.type === 'config' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {task.type}
          </span>
          <h4 className="ml-3 text-sm font-medium text-gray-900">
            {task.originalText}
          </h4>
        </div>
        {task.details?.command && (
          <p className="mt-1 text-sm text-gray-500 ml-20">
            Will be executed as a custom command
          </p>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="text-gray-400 hover:text-gray-600"
          title="Edit task"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600"
          title="Delete task"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
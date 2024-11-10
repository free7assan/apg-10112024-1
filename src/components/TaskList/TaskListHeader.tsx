import React from 'react';
import { Plus } from 'lucide-react';

interface TaskListHeaderProps {
  onAddTask: () => void;
}

export function TaskListHeader({ onAddTask }: TaskListHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        <button
          onClick={onAddTask}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>
    </div>
  );
}
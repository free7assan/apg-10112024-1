import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getAvailableActions } from '../../utils/taskActions';
import type { ParsedTask } from '../../types/task';

interface TaskFormProps {
  task: ParsedTask;
  onChange: (task: ParsedTask) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TaskForm({ task, onChange, onSave, onCancel }: TaskFormProps) {
  const handleDescriptionChange = (value: string) => {
    onChange({
      ...task,
      originalText: value,
      target: value.split(' ')[0] || ''
    });
  };

  return (
    <div className="flex-1 space-y-2">
      <input
        type="text"
        value={task.originalText}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Describe the task (e.g., Install nginx)"
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={task.type}
          onChange={(e) => onChange({
            ...task,
            type: e.target.value as ParsedTask['type'],
            action: getAvailableActions(e.target.value as ParsedTask['type'])[0] || task.action
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="package">Package</option>
          <option value="service">Service</option>
          <option value="config">Config</option>
          <option value="file">File</option>
          <option value="command">Command</option>
        </select>

        <select
          value={task.action}
          onChange={(e) => onChange({
            ...task,
            action: e.target.value
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {getAvailableActions(task.type).map(action => (
            <option key={action} value={action}>
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {!task.originalText.trim() && (
        <p className="text-sm text-amber-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Task description is required
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!task.originalText.trim()}
          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
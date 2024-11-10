import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Edit2, Check, AlertTriangle } from 'lucide-react';
import type { ParsedTask } from '../utils/needsParser';

interface SortableTaskProps {
  task: ParsedTask;
  onUpdate: (updates: Partial<ParsedTask>) => void;
  onDelete: () => void;
}

export function SortableTask({ task, onUpdate, onDelete }: SortableTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (!editedTask.target.trim()) {
      return;
    }
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const getActionOptions = () => {
    switch (editedTask.type) {
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
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center text-gray-400 hover:text-gray-600 cursor-move"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {isEditing ? (
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editedTask.type}
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  type: e.target.value as ParsedTask['type'],
                  action: getActionOptions()[0] || editedTask.action
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
                value={editedTask.action}
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  action: e.target.value
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {getActionOptions().map(action => (
                  <option key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={editedTask.target}
              onChange={(e) => setEditedTask({
                ...editedTask,
                target: e.target.value
              })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Target name"
            />

            {!editedTask.target.trim() && (
              <p className="text-sm text-amber-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Target is required
              </p>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editedTask.target.trim()}
                className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              {task.action.charAt(0).toUpperCase() + task.action.slice(1)} {task.target}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Type: {task.type}
            </p>
          </div>
        )}

        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
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
        )}
      </div>
    </div>
  );
}
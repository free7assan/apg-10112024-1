import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Edit2, Check, AlertTriangle } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskDisplay } from './TaskDisplay';
import type { ParsedTask } from '../../types/task';

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
          <TaskForm
            task={editedTask}
            onChange={setEditedTask}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <TaskDisplay
            task={task}
            onEdit={() => setIsEditing(true)}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
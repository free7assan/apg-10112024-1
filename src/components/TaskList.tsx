import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTask } from './SortableTask';
import { Plus, AlertCircle } from 'lucide-react';
import type { ParsedTask } from '../utils/needsParser';

interface TaskListProps {
  tasks: ParsedTask[];
  onTasksChange: (tasks: ParsedTask[]) => void;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      onTasksChange(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const addNewTask = () => {
    const newTask: ParsedTask = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: 'package',
      action: 'install',
      target: '',
      details: { state: 'present' }
    };
    onTasksChange([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updatedTask: Partial<ParsedTask>) => {
    onTasksChange(
      tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
          <button
            onClick={addNewTask}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onUpdate={(updates) => updateTask(task.id, updates)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {tasks.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <p>No tasks yet. Add tasks manually or describe your requirements above.</p>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTask } from './SortableTask';
import { EmptyTaskList } from './EmptyTaskList';
import { TaskListHeader } from './TaskListHeader';
import type { ParsedTask } from '../../types/task';

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
      <TaskListHeader onAddTask={addNewTask} />

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

      {tasks.length === 0 && <EmptyTaskList />}
    </div>
  );
}
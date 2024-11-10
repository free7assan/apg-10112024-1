import React from 'react';
import { AlertCircle } from 'lucide-react';

export function EmptyTaskList() {
  return (
    <div className="p-6 text-center text-gray-500">
      <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
      <p>No tasks yet. Add tasks manually or describe your requirements above.</p>
    </div>
  );
}
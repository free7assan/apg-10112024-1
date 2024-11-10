import React from 'react';

interface PlaybookDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlaybookDescription({ value, onChange }: PlaybookDescriptionProps) {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
        Describe your automation needs
      </label>
      <textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Example: Install and configure Nginx with SSL, Python, and Git. Set up a web application directory and handle service restarts"
        required
      />
    </div>
  );
}
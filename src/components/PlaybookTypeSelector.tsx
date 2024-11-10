import React from 'react';
import { Wrench, Settings, FileText, Files } from 'lucide-react';
import type { PlaybookType } from './PlaybookForm';

interface PlaybookTypeSelectorProps {
  selectedType: PlaybookType;
  onTypeChange: (type: PlaybookType) => void;
  format: 'single' | 'multiple';
  onFormatChange: (format: 'single' | 'multiple') => void;
}

export function PlaybookTypeSelector({ 
  selectedType, 
  onTypeChange,
  format,
  onFormatChange 
}: PlaybookTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Choose Playbook Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onTypeChange('simple')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedType === 'simple'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <Wrench className={`h-6 w-6 ${
                selectedType === 'simple' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium">Simple Playbook</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Basic automation with essential tasks and minimal configuration
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange('advanced')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedType === 'advanced'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <Settings className={`h-6 w-6 ${
                selectedType === 'advanced' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium">Advanced Playbook</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Complex automation with variables, handlers, and advanced configurations
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          File Structure
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onFormatChange('single')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              format === 'single'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <FileText className={`h-6 w-6 ${
                format === 'single' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium">Single File</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All playbook content in one file for simple management
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onFormatChange('multiple')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              format === 'multiple'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <Files className={`h-6 w-6 ${
                format === 'multiple' ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium">Multiple Files</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Separated into vars, handlers, and tasks files for better organization
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
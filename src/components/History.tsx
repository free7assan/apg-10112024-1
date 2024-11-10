import React, { useState } from 'react';
import { Calendar, Search, Download, Trash2, FileText, Files } from 'lucide-react';
import JSZip from 'jszip';
import { formatDate } from '../utils/dateUtils';
import { usePlaybookContext } from '../context/PlaybookContext';
import type { PlaybookHistory } from '../types';

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'simple' | 'advanced'>('all');
  const { playbooks, deletePlaybook } = usePlaybookContext();

  const filteredHistory = playbooks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (playbook: PlaybookHistory) => {
    try {
      if (typeof playbook.content === 'string') {
        // Single file download
        const blob = new Blob([playbook.content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${playbook.name.toLowerCase().replace(/\s+/g, '-')}.yml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Multiple files download - create zip
        const zip = new JSZip();
        
        // Add each file to the zip
        Object.entries(playbook.content).forEach(([filename, content]) => {
          // Create directories if needed
          const parts = filename.split('/');
          let currentPath = '';
          for (let i = 0; i < parts.length - 1; i++) {
            currentPath += parts[i] + '/';
            if (!zip.folder(currentPath)) {
              zip.folder(currentPath);
            }
          }
          zip.file(filename, content);
        });
        
        // Generate and download the zip file
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${playbook.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading playbook:', error);
      alert('Failed to download playbook. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Playbook History</h2>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search playbooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'simple' | 'advanced')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="simple">Simple</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredHistory.map((playbook) => (
          <div key={playbook.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{playbook.name}</h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {formatDate(playbook.createdAt)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    playbook.type === 'simple' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {playbook.type}
                  </span>
                  <span className="flex items-center">
                    {typeof playbook.content === 'string' ? (
                      <FileText className="mr-1.5 h-4 w-4" />
                    ) : (
                      <Files className="mr-1.5 h-4 w-4" />
                    )}
                    {typeof playbook.content === 'string' ? 'Single File' : 'Multiple Files'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(playbook)}
                  className="inline-flex items-center p-2 text-gray-400 hover:text-gray-500"
                  title="Download Playbook"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deletePlaybook(playbook.id)}
                  className="inline-flex items-center p-2 text-gray-400 hover:text-red-500"
                  title="Delete Playbook"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredHistory.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No playbooks found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Copy, CheckCircle, FileText, Download } from 'lucide-react';
import { downloadPlaybook } from '../utils/downloadUtils';

interface PlaybookOutputProps {
  playbook: string | Record<string, string>;
  structure: 'single' | 'multi';
  name: string;
}

export function PlaybookOutput({ playbook, structure, name }: PlaybookOutputProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>(
    structure === 'multi' ? 'main.yml' : ''
  );

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContent = () => {
    if (structure === 'single') {
      return playbook as string;
    }
    const files = playbook as Record<string, string>;
    return selectedFile ? files[selectedFile] : '';
  };

  const handleDownload = async () => {
    try {
      await downloadPlaybook(playbook, structure, name);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Generated Playbook</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download {structure === 'multi' ? 'Files' : 'Playbook'}
          </button>
          <button
            onClick={() => copyToClipboard(getContent())}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {structure === 'multi' && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(playbook as Record<string, string>).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                selectedFile === fileName
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {fileName}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <code>{getContent()}</code>
        </pre>
      </div>
    </div>
  );
}
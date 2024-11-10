import React, { useState } from 'react';
import { Send, Loader2, List, AlertCircle } from 'lucide-react';
import { PlaybookDescription } from './PlaybookDescription';
import { PlaybookComplexity } from './PlaybookComplexity';
import { PlaybookStructure } from './PlaybookStructure';
import { PlaybookOutput } from './PlaybookOutput';
import { TaskList } from './TaskList';
import { generatePlaybook } from '../services/playbookGenerator';
import { generateTasksFromDescription } from '../services/taskGenerationService';
import { usePlaybookContext } from '../context/PlaybookContext';
import type { ParsedTask } from '../types/task';
import type { PlaybookComplexity as PlaybookComplexityType, PlaybookStructure as PlaybookStructureType } from '../types/playbook';

export function PlaybookForm() {
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState<PlaybookComplexityType>('basic');
  const [structure, setStructure] = useState<PlaybookStructureType>('single');
  const [tasks, setTasks] = useState<ParsedTask[]>([]);
  const [generatedPlaybook, setGeneratedPlaybook] = useState<string | Record<string, string> | null>(null);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addPlaybook } = usePlaybookContext();

  const handleGenerateTasks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of your automation needs');
      return;
    }

    setError(null);
    setIsGeneratingTasks(true);
    setGeneratedPlaybook(null);
    setTasks([]);
    
    try {
      const generatedTasks = await generateTasksFromDescription(description);
      setTasks(generatedTasks);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate tasks');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleGeneratePlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.length === 0) {
      setError('No tasks available. Please generate tasks first.');
      return;
    }

    setError(null);
    setIsGeneratingPlaybook(true);
    setGeneratedPlaybook(null);
    
    try {
      const result = await generatePlaybook({
        description,
        tasks,
        complexity,
        structure
      });
      
      setGeneratedPlaybook(result);
      addPlaybook(
        description.slice(0, 50) + (description.length > 50 ? '...' : ''),
        complexity,
        structure,
        result
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate playbook');
    } finally {
      setIsGeneratingPlaybook(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleGenerateTasks} className="space-y-6">
        <PlaybookDescription
          value={description}
          onChange={setDescription}
        />

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isGeneratingTasks || !description.trim()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingTasks ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Analyzing Requirements...
            </>
          ) : (
            <>
              <List className="mr-2 h-5 w-5" />
              Generate Tasks
            </>
          )}
        </button>
      </form>

      {tasks.length > 0 && (
        <>
          <TaskList
            tasks={tasks}
            onTasksChange={setTasks}
          />

          <div className="mt-6 space-y-6">
            <PlaybookComplexity
              selected={complexity}
              onChange={setComplexity}
            />

            <PlaybookStructure
              selected={structure}
              onChange={setStructure}
            />

            <form onSubmit={handleGeneratePlaybook}>
              <button
                type="submit"
                disabled={isGeneratingPlaybook || tasks.length === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPlaybook ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Generating Playbook...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Generate Playbook
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}

      {generatedPlaybook && (
        <PlaybookOutput 
          playbook={generatedPlaybook}
          structure={structure}
          name={description}
        />
      )}
    </div>
  );
}
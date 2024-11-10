import { generateWithGemini } from './geminiService';
import type { ParsedTask } from '../types/task';

const TASK_GENERATION_PROMPT = `Given the following automation requirement, generate a list of specific tasks needed to fulfill it. Format the response as a JSON array of tasks.

Each task should have:
- type: 'package' | 'service' | 'file' | 'config' | 'command'
- action: specific action to take
- target: what the action applies to
- details: additional configuration needed

Example output format:
[
  {
    "type": "package",
    "action": "install",
    "target": "nginx",
    "details": { "state": "present" }
  }
]

Requirement: `;

function cleanJsonResponse(response: string): string {
  // Remove markdown code block markers and any surrounding whitespace
  return response.replace(/^```json\s*|\s*```$/g, '').trim();
}

export async function generateTasksFromDescription(description: string): Promise<ParsedTask[]> {
  try {
    const response = await generateWithGemini(TASK_GENERATION_PROMPT + description);
    const cleanedResponse = cleanJsonResponse(response);
    
    try {
      const tasks: ParsedTask[] = JSON.parse(cleanedResponse).map(task => ({
        ...task,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        originalText: `${task.action} ${task.target}`
      }));
      return tasks;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Failed to parse the generated tasks. Please try again.');
    }
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw new Error('Failed to generate tasks from description. Please try again.');
  }
}
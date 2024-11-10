import { generateWithGemini } from './geminiService';
import type { ParsedTask } from '../types/task';
import type { PlaybookComplexity, PlaybookStructure } from '../types/playbook';

interface GeneratePlaybookParams {
  description: string;
  tasks: ParsedTask[];
  complexity: PlaybookComplexity;
  structure: PlaybookStructure;
}

function getComplexityInstructions(complexity: PlaybookComplexity): string {
  switch (complexity) {
    case 'basic':
      return `
- Use simple, straightforward tasks
- Include basic error checking
- Add essential comments
- Focus on core functionality`;
    case 'intermediate':
      return `
- Use variables for common values
- Include comprehensive error handling
- Add detailed comments and descriptions
- Implement basic handlers for service restarts
- Follow Ansible best practices`;
    case 'advanced':
      return `
- Implement full error handling and recovery
- Use templates for complex configurations
- Include pre and post tasks
- Add extensive logging and notifications
- Implement handlers for all state changes
- Use tags for selective execution
- Optimize for performance and reliability
- Follow all Ansible best practices`;
  }
}

function generateSingleFilePrompt(description: string, tasks: ParsedTask[], complexity: PlaybookComplexity): string {
  return `Generate an Ansible playbook for the following requirement: ${description}

Tasks to include:
${tasks.map(task => `- ${task.action} ${task.target} (${task.type})`).join('\n')}

Requirements:${getComplexityInstructions(complexity)}
- Ensure idempotency
- Use proper YAML syntax

Output the playbook in YAML format without any additional text or markdown.`;
}

function generateMultiFilePrompt(description: string, tasks: ParsedTask[], complexity: PlaybookComplexity): string {
  return `Generate a well-structured Ansible playbook for: ${description}

Tasks to include:
${tasks.map(task => `- ${task.action} ${task.target} (${task.type})`).join('\n')}

Create the following files following Ansible best practices:

1. site.yml - Main playbook file that:
   - Includes proper metadata (author, description)
   - Imports other playbooks
   - Sets global variables

2. group_vars/all.yml - Common variables:
   - Default values
   - Global settings
   - Common paths

3. roles/main/defaults/main.yml - Role default variables:
   - Override-able defaults
   - Package versions
   - Configuration options

4. roles/main/vars/main.yml - Role variables:
   - Fixed role variables
   - Internal role settings

5. roles/main/tasks/main.yml - Main tasks:
   - Organized by functionality
   - Tagged appropriately
   - Include proper error handling

6. roles/main/handlers/main.yml - Event handlers:
   - Service restarts
   - Configuration reloads
   - Cleanup tasks

7. roles/main/templates/ - Configuration templates:
   - Generate template files for each service
   - Use proper variable substitution
   - Include comments

Requirements:${getComplexityInstructions(complexity)}
- Ensure idempotency
- Use proper YAML syntax
- Follow Ansible directory structure
- Implement proper variable precedence
- Use meaningful tags
- Include proper documentation

Output each file's content with its path as a comment, like:
# site.yml
(content)
# group_vars/all.yml
(content)
etc.`;
}

function parseMultiFileResponse(response: string): Record<string, string> {
  const files: Record<string, string> = {};
  const fileContents = response.split(/^#\s*[a-zA-Z0-9/_.-]+\.yml$/m);
  const fileNames = response.match(/^#\s*([a-zA-Z0-9/_.-]+\.yml)$/gm);

  if (!fileNames || fileNames.length === 0) {
    throw new Error('No valid files found in the generated response');
  }

  fileNames.forEach((fileName, index) => {
    const cleanFileName = fileName.replace(/^#\s*/, '').trim();
    const fileContent = fileContents[index + 1]?.trim();
    if (fileContent) {
      files[cleanFileName] = fileContent;
    }
  });

  // Ensure required files exist
  const requiredFiles = ['site.yml', 'group_vars/all.yml', 'roles/main/tasks/main.yml'];
  for (const file of requiredFiles) {
    if (!files[file]) {
      throw new Error(`Missing required file: ${file}`);
    }
  }

  return files;
}

export async function generatePlaybook({ 
  description, 
  tasks,
  complexity,
  structure
}: GeneratePlaybookParams): Promise<string | Record<string, string>> {
  try {
    if (structure === 'single') {
      const prompt = generateSingleFilePrompt(description, tasks, complexity);
      const content = await generateWithGemini(prompt);
      return content.trim();
    } else {
      const prompt = generateMultiFilePrompt(description, tasks, complexity);
      const content = await generateWithGemini(prompt);
      return parseMultiFileResponse(content);
    }
  } catch (error) {
    console.error('Error generating playbook:', error);
    throw new Error('Failed to generate playbook. Please try again.');
  }
}
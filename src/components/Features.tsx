import React from 'react';
import { Cpu, Zap, Shield, RefreshCw, Code2, GitBranch } from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Generation',
    description: 'Convert natural language descriptions into production-ready Ansible playbooks using advanced AI.',
    icon: Cpu,
  },
  {
    name: 'Instant Results',
    description: 'Get your playbooks generated in seconds, no more manual writing and debugging.',
    icon: Zap,
  },
  {
    name: 'Best Practices',
    description: 'All generated playbooks follow Ansible best practices and security guidelines.',
    icon: Shield,
  },
  {
    name: 'Version Control Ready',
    description: 'Generated playbooks are formatted and ready for your version control system.',
    icon: GitBranch,
  },
  {
    name: 'Multiple Templates',
    description: 'Choose between simple and advanced playbook templates based on your needs.',
    icon: Code2,
  },
  {
    name: 'Continuous Updates',
    description: 'Regular updates to templates and AI models to stay current with best practices.',
    icon: RefreshCw,
  },
];

export function Features() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to automate
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Generate, customize, and deploy Ansible playbooks with confidence.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
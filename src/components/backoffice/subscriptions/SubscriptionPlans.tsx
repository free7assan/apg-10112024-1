import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const defaultPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      'Up to 5 playbooks',
      'Basic templates',
      'Community support',
      'Standard generation speed'
    ],
    limits: {
      playbooks: 5,
      templates: 'basic',
      support: 'community',
      generation: 'standard'
    }
  },
  {
    id: 2,
    name: 'Pro',
    price: 19.99,
    billingPeriod: 'monthly',
    features: [
      'Unlimited playbooks',
      'Advanced templates',
      'Priority support',
      'Fast generation speed',
      'Custom variables'
    ],
    limits: {
      playbooks: -1,
      templates: 'advanced',
      support: 'priority',
      generation: 'fast'
    }
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 99.99,
    billingPeriod: 'monthly',
    features: [
      'Unlimited everything',
      'Custom templates',
      'Dedicated support',
      'Maximum speed',
      'API access',
      'SSO integration'
    ],
    limits: {
      playbooks: -1,
      templates: 'custom',
      support: 'dedicated',
      generation: 'maximum'
    }
  }
];

export function SubscriptionPlans() {
  const [plans, setPlans] = useState(defaultPlans);
  const [editingPlan, setEditingPlan] = useState(null);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Subscription Plans</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6">
        {plans.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.billingPeriod}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-indigo-600">
                  <Edit2 className="h-5 w-5" />
                </button>
                {plan.name !== 'Enterprise' && (
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Features</h4>
              <ul className="mt-4 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Limits</h4>
              <dl className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Playbooks</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {plan.limits.playbooks === -1 ? 'Unlimited' : plan.limits.playbooks}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Templates</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {plan.limits.templates}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Support</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {plan.limits.support}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Generation Speed</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {plan.limits.generation}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
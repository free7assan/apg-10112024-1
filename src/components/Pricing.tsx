import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Hobby',
    price: 0,
    features: [
      'Simple playbook generation',
      '10 generations per month',
      'Basic templates',
      'Community support',
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: 19,
    features: [
      'Advanced playbook generation',
      'Unlimited generations',
      'All templates',
      'Priority support',
      'Custom variables',
      'Export to multiple formats',
    ],
    cta: 'Start Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    features: [
      'Everything in Pro',
      'Custom templates',
      'API access',
      'SSO integration',
      'Audit logs',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export function Pricing() {
  return (
    <div id="pricing" className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
              tier.featured ? 'border-2 border-indigo-500' : 'border border-gray-200'
            }`}>
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-gray-900">{tier.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${tier.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <Link
                  to="/apg"
                  className={`mt-8 block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium ${
                    tier.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
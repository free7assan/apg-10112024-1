import React, { useState } from 'react';
import { CreditCard, DollarSign, Settings, Save } from 'lucide-react';

export function BillingSettings() {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: 0,
    trialPeriod: 14,
    gracePeriod: 3,
    paymentMethods: {
      stripe: true,
      paypal: false
    },
    invoiceSettings: {
      companyName: 'Ansible Generator',
      address: '',
      vatNumber: '',
      logo: null
    },
    notifications: {
      paymentSuccess: true,
      paymentFailed: true,
      subscriptionExpiring: true,
      trialEnding: true
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {/* General Settings */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trial Period (days)</label>
            <input
              type="number"
              value={settings.trialPeriod}
              onChange={(e) => setSettings({ ...settings, trialPeriod: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grace Period (days)</label>
            <input
              type="number"
              value={settings.gracePeriod}
              onChange={(e) => setSettings({ ...settings, gracePeriod: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.paymentMethods.stripe}
              onChange={(e) => setSettings({
                ...settings,
                paymentMethods: { ...settings.paymentMethods, stripe: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Stripe</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.paymentMethods.paypal}
              onChange={(e) => setSettings({
                ...settings,
                paymentMethods: { ...settings.paymentMethods, paypal: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">PayPal</span>
          </label>
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={settings.invoiceSettings.companyName}
              onChange={(e) => setSettings({
                ...settings,
                invoiceSettings: { ...settings.invoiceSettings, companyName: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              value={settings.invoiceSettings.address}
              onChange={(e) => setSettings({
                ...settings,
                invoiceSettings: { ...settings.invoiceSettings, address: e.target.value }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">VAT Number</label>
            <input
              type="text"
              value={settings.invoiceSettings.vatNumber}
              onChange={(e) => setSettings({
                ...settings,
                invoiceSettings: { ...settings.invoiceSettings, vatNumber: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, [key]: e.target.checked }
                })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
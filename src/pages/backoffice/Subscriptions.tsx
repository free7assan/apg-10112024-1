import React from 'react';
import { Tabs } from '../../components/common/Tabs';
import { SubscriptionsList } from '../../components/backoffice/subscriptions/SubscriptionsList';
import { SubscriptionPlans } from '../../components/backoffice/subscriptions/SubscriptionPlans';
import { PaymentHistory } from '../../components/backoffice/subscriptions/PaymentHistory';
import { BillingSettings } from '../../components/backoffice/subscriptions/BillingSettings';

export function Subscriptions() {
  const tabs = [
    { id: 'subscriptions', label: 'Active Subscriptions', component: SubscriptionsList },
    { id: 'plans', label: 'Plans & Pricing', component: SubscriptionPlans },
    { id: 'payments', label: 'Payment History', component: PaymentHistory },
    { id: 'billing', label: 'Billing Settings', component: BillingSettings }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
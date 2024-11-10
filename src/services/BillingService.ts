import { SubscriptionModel, type Subscription, type Payment } from '../models/SubscriptionModel';
import { UserModel } from '../models/UserModel';

export class BillingService {
  static async createSubscription(
    userId: number,
    plan: Subscription['plan'],
    billingCycle: 'monthly' | 'yearly'
  ): Promise<Subscription> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const amount = this.getPlanPrice(plan, billingCycle);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

    const subscription = await SubscriptionModel.create({
      user_id: userId,
      plan,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      billing_cycle: billingCycle,
      amount
    });

    await UserModel.update(userId, {
      subscription: {
        plan,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      }
    });

    return subscription;
  }

  static async cancelSubscription(subscriptionId: number): Promise<void> {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await SubscriptionModel.cancel(subscriptionId);
    await UserModel.update(subscription.user_id, {
      subscription: {
        ...subscription,
        status: 'cancelled'
      }
    });
  }

  static async processPayment(
    subscriptionId: number,
    amount: number,
    paymentMethod: Payment['payment_method']
  ): Promise<Payment> {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const payment = await SubscriptionModel.addPayment({
      subscription_id: subscriptionId,
      user_id: subscription.user_id,
      amount,
      status: 'successful',
      date: new Date().toISOString(),
      payment_method: paymentMethod
    });

    // Update subscription payment dates
    await SubscriptionModel.update(subscriptionId, {
      last_payment_date: payment.date,
      next_payment_date: this.calculateNextPaymentDate(subscription)
    });

    return payment;
  }

  private static getPlanPrice(plan: Subscription['plan'], billingCycle: 'monthly' | 'yearly'): number {
    const monthlyPrices = {
      basic: 0,
      pro: 19.99,
      enterprise: 99.99
    };

    const price = monthlyPrices[plan];
    return billingCycle === 'yearly' ? price * 12 * 0.9 : price; // 10% discount for yearly
  }

  private static calculateNextPaymentDate(subscription: Subscription): string {
    const nextDate = new Date(subscription.last_payment_date || subscription.start_date);
    nextDate.setMonth(nextDate.getMonth() + (subscription.billing_cycle === 'yearly' ? 12 : 1));
    return nextDate.toISOString();
  }
}
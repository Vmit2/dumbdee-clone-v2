export interface PaymentInit { amount: number; currency: string; orderId: string; provider: 'razorpay'|'stripe'; }
export class PaymentService {
  async createPaymentIntent(data: PaymentInit) {
    if (data.provider === 'razorpay') {
      return { id: 'rzp_test_intent', amount: data.amount, currency: data.currency };
    }
    if (data.provider === 'stripe') {
      return { id: 'stripe_test_pi', amount: data.amount, currency: data.currency };
    }
    throw new Error('unknown_provider');
  }
  async handleWebhook(provider: 'razorpay'|'stripe', _payload: any) {
    return { ok: true, provider };
  }
}

export interface PaymentInit { amount: number; currency: string; orderId: string; provider: 'razorpay'|'stripe'; }
export class PaymentService {
  async createPaymentIntent(data: PaymentInit) {
    if (data.provider === 'razorpay') {
      const order_id = 'order_' + Math.random().toString(36).slice(2, 10);
      const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';
      // amount expected in smallest currency unit for Razorpay (paise)
      return { id: 'rzp_test_intent', provider: 'razorpay', order_id, key_id, amount: Math.round(Number(data.amount||0) * 100), currency: data.currency };
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

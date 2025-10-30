"use client";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useState } from 'react';

export default function CheckoutPage() {
  const items = useSelector((s: RootState) => (s as any).cart.items);
  const [message, setMessage] = useState('');
  const total = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);

  async function getRates() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/shipping/rates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'shipway', currency: 'INR' }) });
    const rates = await res.json();
    setMessage('Rates: ' + JSON.stringify(rates));
  }

  async function pay(provider: 'razorpay'|'stripe') {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/payments/intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, amount: total, currency: 'INR', orderId: 'test' }) });
    const intent = await res.json();
    setMessage('Payment intent: ' + JSON.stringify(intent));
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div>Total: {total}</div>
      <div className="flex gap-2">
        <button onClick={getRates} className="border px-3 py-1 rounded">Get Shipping Rates</button>
        <button onClick={()=>pay('razorpay')} className="border px-3 py-1 rounded">Pay (Razorpay)</button>
        <button onClick={()=>pay('stripe')} className="border px-3 py-1 rounded">Pay (Stripe)</button>
      </div>
      {message && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{message}</pre>}
    </main>
  );
}



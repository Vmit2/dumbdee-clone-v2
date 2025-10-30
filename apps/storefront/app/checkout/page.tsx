"use client";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const items = useSelector((s: RootState) => (s as any).cart.items);
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [totals, setTotals] = useState<{subtotal:number; tax:number; shipping:number; total:number; currency:string}>({subtotal:0,tax:0,shipping:0,total:0,currency:'INR'});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/carts/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, currency: 'INR', region: 'IN' }) });
        if (res.ok) setTotals(await res.json());
      } catch {}
    })();
  }, [items]);

  async function applyCoupon() {
    setDiscount(0);
    if (!coupon) return;
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/coupons?code=' + encodeURIComponent(coupon));
    const list = await res.json();
    const c = Array.isArray(list) ? list[0] : null;
    if (!c || c.active === false) { setMessage('Invalid coupon'); return; }
    let d = 0;
    if (c.type === 'percent') d = Math.round((totals.subtotal * (c.value || 0) / 100) * 100) / 100;
    else d = Number(c.value || 0);
    setDiscount(d);
  }

  async function getRates() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/shipping/rates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: 'shipway', currency: 'INR' }) });
    const rates = await res.json();
    setMessage('Rates: ' + JSON.stringify(rates));
  }

  async function pay(provider: 'razorpay'|'stripe') {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/payments/intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, amount: Math.max(0, totals.total - discount), currency: totals.currency, orderId: 'test' }) });
    const intent = await res.json();
    if (provider === 'razorpay') {
      await new Promise<void>((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = ()=>resolve();
        document.body.appendChild(s);
      });
      // @ts-ignore
      const rzp = new window.Razorpay({
        key: intent.key_id,
        amount: intent.amount,
        currency: intent.currency,
        order_id: intent.order_id,
        name: 'DumbDee Store',
        description: 'Order payment',
        handler: function (response: any) {
          setMessage('Razorpay success: '+JSON.stringify(response));
        },
        prefill: {},
        theme: { color: '#3399cc' }
      });
      rzp.open();
    } else {
      setMessage('Stripe intent: ' + JSON.stringify(intent));
    }
  }

  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <section className="md:col-span-8 grid gap-3">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="grid gap-2">
          <label className="text-sm">Shipping Address</label>
          <input className="border px-2 py-1 rounded" placeholder="Full name" />
          <input className="border px-2 py-1 rounded" placeholder="Address line 1" />
          <input className="border px-2 py-1 rounded" placeholder="Address line 2" />
          <div className="grid grid-cols-3 gap-2">
            <input className="border px-2 py-1 rounded" placeholder="City" />
            <input className="border px-2 py-1 rounded" placeholder="State" />
            <input className="border px-2 py-1 rounded" placeholder="Postal Code" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Payment Method</label>
          <div className="flex gap-2">
            <button onClick={()=>pay('razorpay')} className="border px-3 py-1 rounded">Pay with Razorpay</button>
            <button onClick={()=>pay('stripe')} className="border px-3 py-1 rounded">Pay with Stripe</button>
          </div>
        </div>
      </section>
      <aside className="md:col-span-4 border rounded p-3 h-fit sticky top-16 bg-white/90 grid gap-2">
        <div className="font-semibold">Order Summary</div>
        <div className="text-sm">Subtotal: {totals.subtotal} {totals.currency}</div>
        {discount > 0 && <div className="text-sm text-green-700">Discount: -{discount} {totals.currency}</div>}
        <div className="text-sm">Tax: {totals.tax} {totals.currency}</div>
        <div className="text-sm">Shipping: {totals.shipping} {totals.currency}</div>
        <div className="font-semibold">Total: {Math.max(0, Math.round((totals.total - discount)*100)/100)} {totals.currency}</div>
        <div className="flex gap-2 items-center">
          <input className="border px-2 py-1 rounded" placeholder="Coupon code" value={coupon} onChange={(e)=>setCoupon(e.target.value)} />
          <button onClick={applyCoupon} className="border px-3 py-1 rounded">Apply</button>
        </div>
        <button onClick={getRates} className="border px-3 py-1 rounded">Get Shipping Rates</button>
        {message && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{message}</pre>}
      </aside>
    </main>
  );
}



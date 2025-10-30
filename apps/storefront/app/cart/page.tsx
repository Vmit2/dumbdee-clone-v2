"use client";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateQty, removeItem } from '@dumbdee/common-frontend';
import type { RootState } from '../../store';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => (s as any).cart.items);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discount);
  async function saveReminder(){
    setMsg('');
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/notifications/abandoned-cart',{ method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email, items }) });
      setMsg(res.ok ? 'We will remind you!' : 'Failed');
    } catch { setMsg('Failed'); }
  }
  return (
    <main className="py-6">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {items.length === 0 ? <p>Cart is empty</p> : (
        <div className="grid gap-6 md:grid-cols-12">
          <section className="md:col-span-8 grid gap-3">
          {items.map((i: any, idx: number) => (
            <div key={idx} className="border p-3 rounded flex items-center justify-between bg-white/90">
              <div>
                <div className="font-medium">{i.title || i.productId}</div>
                <div className="text-sm text-gray-600">{i.price} each</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="border px-2 py-1 rounded" onClick={()=>dispatch(updateQty({ productId: i.productId, variantId: i.variantId, qty: Math.max(0, (i.qty||0)-1) }) as any)}>-</button>
                <span className="min-w-[2ch] text-center">{i.qty}</span>
                <button className="border px-2 py-1 rounded" onClick={()=>dispatch(updateQty({ productId: i.productId, variantId: i.variantId, qty: (i.qty||0)+1 }) as any)}>+</button>
                <button className="border px-2 py-1 rounded" onClick={()=>dispatch(removeItem({ productId: i.productId, variantId: i.variantId }) as any)}>Remove</button>
              </div>
            </div>
          ))}
          </section>
          <aside className="md:col-span-4 border rounded p-3 h-fit sticky top-16 bg-white/90 grid gap-2">
            <div className="font-semibold">Order Summary</div>
            <div className="text-sm">Subtotal: {subtotal.toFixed(2)}</div>
            <div className="flex items-center gap-2 text-sm">
              <input className="border px-2 py-1 rounded text-sm" placeholder="Coupon code" value={coupon} onChange={(e)=>setCoupon(e.target.value)} />
              <button onClick={async()=>{
                try {
                  const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/coupons?code=${encodeURIComponent(coupon)}`, { cache:'no-store' });
                  const j = await r.json();
                  const c = Array.isArray(j)? j[0]: j;
                  if (c && c.type === 'percent') {
                    setDiscount(Math.round(subtotal * (Number(c.value||0)/100)));
                  } else if (c && (c.type === 'flat' || c.type === 'amount')) {
                    setDiscount(Number(c.value||0));
                  } else {
                    setDiscount(0);
                  }
                } catch { setDiscount(0); }
              }} className="border px-3 py-1 rounded text-sm">Apply</button>
              {discount>0 && <span className="text-xs text-green-700">- {discount.toFixed(2)}</span>}
            </div>
            <div className="font-bold">Total: {total.toFixed(2)}</div>
            <a href="/checkout" className="border px-3 py-2 rounded text-center">Proceed to Checkout</a>
          </aside>
          <section className="md:col-span-8 flex items-center gap-2">
            <input className="border px-2 py-1 rounded text-sm" type="email" placeholder="Email for reminder" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button onClick={saveReminder} className="border px-3 py-1 rounded text-sm">Save cart reminder</button>
            {msg && <span className="text-xs text-gray-600">{msg}</span>}
          </section>
        </div>
      )}
    </main>
  );
}



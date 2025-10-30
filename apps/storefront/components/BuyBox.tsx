"use client";
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

export default function BuyBox({ productId, title, price, currency = 'INR' }: { productId: string; title: string; price: number; currency?: string }) {
  const [qty, setQty] = useState(1);
  return (
    <aside className="border rounded p-3 bg-white/90 w-full md:w-80">
      <div className="text-2xl font-semibold">{price} {currency}</div>
      <div className="text-xs text-gray-600 mt-1">Inclusive of all taxes</div>
      <div className="mt-3 flex items-center gap-2">
        <label className="text-sm">Qty</label>
        <input type="number" min={1} value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))} className="border px-2 py-1 rounded w-16" />
      </div>
      <div className="mt-3 grid gap-2">
        <AddToCartButton productId={productId} title={title} price={price} qty={qty} />
        <button className="border px-3 py-2 rounded">Buy Now</button>
      </div>
      <div className="mt-3 text-xs text-gray-600">Delivery by 2-5 days • Free returns</div>
    </aside>
  );
}



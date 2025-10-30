"use client";
import { useEffect, useState } from 'react';

export default function WishlistPage() {
  const [wl, setWl] = useState<{ items: any[] }>({ items: [] });
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/wishlist', { headers: { Authorization: 'Bearer REPLACE' }, cache: 'no-store' });
    setWl(await res.json());
  }
  useEffect(() => { (async()=>{ try { await load(); } finally { setLoading(false); } })(); }, []);

  async function add() {
    await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/wishlist', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify({ product_id: productId }) });
    setProductId('');
    await load();
  }
  async function remove(pid: string) {
    await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/wishlist', { method: 'DELETE', headers: { 'Content-Type':'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify({ product_id: pid }) });
    await load();
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <div className="flex gap-2 max-w-md">
        <input className="border px-2 py-1 rounded flex-1" placeholder="Product ID" value={productId} onChange={(e)=>setProductId(e.target.value)} />
        <button onClick={add} className="border px-3 py-1 rounded">Add</button>
      </div>
      <ul className="grid gap-2">
        {(wl.items || []).map((it: any, idx: number) => (
          <li key={idx} className="border p-2 rounded flex items-center justify-between">
            <div className="text-sm">{it.product_id}</div>
            <button onClick={()=>remove(it.product_id)} className="border px-3 py-1 rounded">Remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}



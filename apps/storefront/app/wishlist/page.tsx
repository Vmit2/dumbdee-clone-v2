"use client";
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';

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

  if (loading) return <main className="py-6">Loading...</main>;
  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <section className="md:col-span-9 grid gap-3">
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <div className="flex gap-2 max-w-md">
        <input className="border px-2 py-1 rounded flex-1" placeholder="Product ID" value={productId} onChange={(e)=>setProductId(e.target.value)} />
        <button onClick={add} className="border px-3 py-1 rounded">Add</button>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(wl.items || []).map((it: any, idx: number) => (
            <div key={idx} className="relative group">
              <ProductCard p={{ _id: it.product_id, title: it.title||it.product_id, slug: it.slug||it.product_id, variants: [{ price: it.price||0, currency: 'INR', images: it.images||[] }] }} />
              <button onClick={()=>remove(it.product_id)} className="absolute top-2 right-2 text-xs border px-2 py-1 rounded bg-white/90 opacity-0 group-hover:opacity-100">Remove</button>
            </div>
          ))}
        </div>
      </section>
      <aside className="md:col-span-3 border rounded p-3 h-fit sticky top-16 bg-white/90">
        <div className="font-semibold">Summary</div>
        <div className="text-sm">Items: {(wl.items||[]).length}</div>
      </aside>
    </main>
  );
}



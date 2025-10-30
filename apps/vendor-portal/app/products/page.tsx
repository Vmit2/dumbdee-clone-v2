"use client";
import { useEffect, useState } from 'react';

export default function VendorProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [vendorId, setVendorId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<number>(0);

  async function load() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products?vendor=${encodeURIComponent(vendorId)}&limit=100`, { cache:'no-store' });
    setRows(await res.json());
  }
  useEffect(() => { if (vendorId) { load(); } }, [vendorId]);

  async function create() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/vendor/products`, { method:'POST', headers: { 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ vendor_id: vendorId, title, slug, variants: [{ sku: slug+'-SKU', price, currency:'INR', stock: 0 }] }) });
    const created = await res.json();
    setRows((prev)=>[created, ...prev]);
    setTitle(''); setSlug(''); setPrice(0);
  }
  async function clone(id: string) {
    const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/vendor/products/${id}/clone`, { method:'POST', headers:{ Authorization:'Bearer REPLACE' } });
    const c = await r.json();
    setRows((prev)=>[c, ...prev]);
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">My Products</h1>
      <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      <div className="grid gap-2 md:grid-cols-4 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} />
        <input type="number" className="border px-2 py-1 rounded" placeholder="Price" value={price} onChange={(e)=>setPrice(Number(e.target.value)||0)} />
        <button onClick={create} className="border px-3 py-1 rounded">Create</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((p)=> (
          <li key={p._id} className="border p-2 rounded flex items-center justify-between">
            <div><div className="font-medium">{p.title}</div><div className="text-xs text-gray-600">{p.slug} · {p.status}</div></div>
            <div className="flex items-center gap-2">
              <button onClick={()=>clone(p._id)} className="border px-2 py-1 rounded text-xs">Clone</button>
              <a className="underline" href={`/products/${p.slug}`}>Open</a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



"use client";
import { useEffect, useMemo, useState } from 'react';

export default function ComparePage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { try { const c=JSON.parse(localStorage.getItem('compareSlugs')||'[]'); if (Array.isArray(c)) setSlugs(c); } catch {} }, []);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    if (!slugs.length) { setProducts([]); return; }
    const qs = slugs.map((s)=>`slug=${encodeURIComponent(s)}`).join('&');
    const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products?${qs}`, { cache:'no-store' });
    const j = await r.json();
    setProducts(Array.isArray(j)?j: [j].filter(Boolean));
  })(); }, [slugs]);
  const headers = useMemo(()=>['Image','Title','Price','Vendor','Rating'],[]);
  return (
    <main className="py-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Compare</h1>
      {!products.length ? <div className="text-sm text-gray-600">No items to compare.</div> : (
        <div className="overflow-auto sticky top-16 bg-white/90">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {headers.map((h)=> (<th key={h} className="border px-3 py-2 text-left text-xs font-semibold">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {products.map((p)=> (
                <tr key={p._id} className="border-b">
                  <td className="px-3 py-2">{p?.variants?.[0]?.images?.[0] && <img src={p.variants[0].images[0]} alt={p.title} className="w-16 h-16 object-cover rounded" />}</td>
                  <td className="px-3 py-2"><a className="underline" href={`/products/${p.slug}`}>{p.title}</a></td>
                  <td className="px-3 py-2">{typeof p?.variants?.[0]?.price==='number'? `${p.variants[0].price} ${p.variants[0].currency||'INR'}`: '-'}</td>
                  <td className="px-3 py-2">{p?.vendor?.name || '-'}</td>
                  <td className="px-3 py-2">{p?.rating?.toFixed? p.rating.toFixed(1): '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



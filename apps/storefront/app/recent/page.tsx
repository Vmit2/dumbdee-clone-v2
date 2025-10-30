"use client";
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';

export default function RecentPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('recentProducts') || '[]');
      if (Array.isArray(s)) setSlugs(s);
    } catch {}
  }, []);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ if (!slugs.length) { setRows([]); return; } const qs=slugs.map((s)=>`slug=${encodeURIComponent(s)}`).join('&'); try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/public/products?${qs}`,{cache:'no-store'}); const j=await r.json(); setRows(Array.isArray(j)?j:[]); } catch{ setRows([]);} })(); },[slugs]);
  return (
    <main className="py-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Recently Viewed</h1>
      {!rows.length ? <div className="text-sm text-gray-600">No recent items.</div> : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {rows.map((p:any)=> (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}



"use client";
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function HomeRecent(){
  const [slugs, setSlugs] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ try { const s=JSON.parse(localStorage.getItem('recentProducts')||'[]'); if (Array.isArray(s)) setSlugs(s); } catch{} },[]);
  useEffect(()=>{ (async()=>{ if (!slugs.length) { setRows([]); return; } const qs = slugs.slice(0,12).map((s)=>`slug=${encodeURIComponent(s)}`).join('&'); try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/public/products?${qs}`,{cache:'no-store'}); const j=await r.json(); setRows(Array.isArray(j)?j:[]); } catch{ setRows([]);} })(); },[slugs]);
  if (!rows.length) return null;
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Recently Viewed</h2>
      <div className="w-full overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory">
        <div className="flex gap-3">
          {rows.map((p)=> (
            <div key={p._id} className="min-w-[180px] shrink-0 snap-start">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



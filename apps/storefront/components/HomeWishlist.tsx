"use client";
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function HomeWishlist(){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/wishlist`,{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); const j=await r.json(); const items=(j?.items||[]).map((it:any)=>it.product); setRows(items.filter(Boolean)); } catch{} })(); },[]);
  if (!rows.length) return null;
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Your Wishlist</h2>
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



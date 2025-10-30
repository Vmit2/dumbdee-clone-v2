"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MiniCart from './MiniCart';

export default function Header(){
  const [q,setQ] = useState('');
  const [cats,setCats] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products?limit=1`,{cache:'no-store'}); if(r.ok){ setCats([{_id:'all',name:'All Categories'}]); } } catch{} })(); },[]);
  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <Link href="/" className="font-bold text-lg" style={{color:'var(--fg)'}}>DumbDee</Link>
        <form action={`/products`} className="flex-1 flex items-stretch gap-0">
          <select className="hidden md:block border-l border-t border-b rounded-l px-2 text-sm bg-white/90"><option>All</option></select>
          <input name="q" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products, brands and more" className="flex-1 border px-3 py-2 bg-white/90" />
          <button className="border-r border-t border-b rounded-r px-3 bg-[var(--primary)] text-white">Search</button>
        </form>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/orders" className="underline">Orders</Link>
          <Link href="/wishlist" className="underline">Wishlist</Link>
          <MiniCart />
        </nav>
      </div>
      <div className="hidden md:block bg-black/5">
        <div className="max-w-7xl mx-auto px-4 py-1 text-xs flex gap-4">
          <Link href="/products?tags=deals" className="underline">Todays Deals</Link>
          <Link href="/products?tags=electronics" className="underline">Electronics</Link>
          <Link href="/products?tags=fashion" className="underline">Fashion</Link>
          <Link href="/products?tags=home" className="underline">Home</Link>
          <Link href="/products?tags=grocery" className="underline">Grocery</Link>
          <Link href="/products?tags=beauty" className="underline">Beauty</Link>
        </div>
      </div>
    </header>
  );
}



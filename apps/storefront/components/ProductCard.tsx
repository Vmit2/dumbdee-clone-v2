"use client";
import Link from 'next/link';

export default function ProductCard({ p }: { p: any }){
  const img = p?.variants?.[0]?.images?.[0];
  const price = p?.variants?.[0]?.price;
  return (
    <div className="border rounded p-3 bg-white/90">
      {img ? <img src={img} alt={p.title} className="w-full h-40 object-cover rounded" /> : <div className="w-full h-40 bg-black/10 rounded" />}
      <div className="mt-2 text-sm line-clamp-2">{p.title}</div>
      {typeof price==='number' && <div className="mt-1 font-semibold">{price} {p?.variants?.[0]?.currency||'INR'}</div>}
      <div className="mt-2 flex items-center gap-2">
        <Link className="text-xs underline" href={`/products/${p.slug}`}>View</Link>
        <button className="text-xs border px-2 py-1 rounded">Add to Cart</button>
      </div>
    </div>
  );
}



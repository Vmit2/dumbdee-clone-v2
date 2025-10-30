"use client";
import { useEffect, useState } from 'react';

export default function ProductReviews({ productId }: { productId: string }){
  const [rows, setRows] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/reviews?product_id=${encodeURIComponent(productId)}`,{ cache:'no-store' }); const j=await r.json(); setRows(Array.isArray(j)?j:[]); } catch {} })(); },[productId]);
  async function submit(){
    setMsg('');
    try {
      const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/reviews`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ product_id: productId, rating, comment }) });
      if (r.ok) { setComment(''); setRating(5); const j=await r.json(); setRows([j, ...rows]); setMsg('Submitted'); } else setMsg('Failed');
    } catch { setMsg('Failed'); }
  }
  return (
    <section className="mt-6 grid gap-2">
      <h2 className="text-lg font-semibold">Reviews</h2>
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <select className="border px-2 py-1 rounded text-sm" value={rating} onChange={(e)=>setRating(Number(e.target.value)||5)}>
            {[5,4,3,2,1].map((n)=> (<option key={n} value={n}>{n}</option>))}
          </select>
          <input className="border px-2 py-1 rounded text-sm flex-1" placeholder="Write a review" value={comment} onChange={(e)=>setComment(e.target.value)} />
          <button onClick={submit} className="border px-3 py-1 rounded text-sm">Submit</button>
          {msg && <span className="text-xs text-gray-600">{msg}</span>}
        </div>
      </div>
      <ul className="grid gap-2">
        {rows.map((r:any)=> (
          <li key={r._id} className="border rounded p-2">
            <div className="text-xs text-gray-600">{r.rating} ★</div>
            <div className="text-sm">{r.comment || r.text}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}



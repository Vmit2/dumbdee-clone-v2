"use client";
import { useEffect, useState } from 'react';

export default function VendorReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/reviews', { cache:'no-store' }); setRows(await r.json()); } finally { setLoading(false);} })(); }, []);
  async function ack(id:string){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/reviews/${id}/ack`,{ method:'PUT', headers:{ Authorization:'Bearer REPLACE' } }); const u=await r.json(); setRows((prev)=>prev.map((x)=>x._id===u._id?u:x)); }
  async function hide(id:string){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/reviews/${id}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ status:'rejected' }) }); const u=await r.json(); setRows((prev)=>prev.map((x)=>x._id===u._id?u:x)); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <ul className="grid gap-2">
        {rows.map((r)=> (
          <li key={r._id} className="border p-2 rounded">
            <div className="flex items-center justify-between"><div className="font-medium">{r.rating}★</div><div className="text-xs text-gray-600">{r.product_id}</div></div>
            <div className="text-sm mt-1">{r.comment}</div>
            <div className="flex gap-2 mt-2"><button onClick={()=>ack(r._id)} className="border px-3 py-1 rounded">Acknowledge</button><button onClick={()=>hide(r._id)} className="border px-3 py-1 rounded">Hide</button></div>
          </li>
        ))}
      </ul>
    </main>
  );
}



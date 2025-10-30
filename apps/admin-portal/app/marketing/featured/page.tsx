"use client";
import { useEffect, useState } from "react";

export default function FeaturedConfigPage(){
  const [ids, setIds] = useState<string>('');
  const [saving, setSaving] = useState(false);
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/featured`,{ cache:'no-store', headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setIds((j?.product_ids||[]).join(',')); } catch {} })(); },[]);
  async function save(){ setSaving(true); try { const list = ids.split(',').map((s)=>s.trim()).filter(Boolean); await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/featured`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ product_ids: list }) }); } finally { setSaving(false); } }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Featured Products</h1>
      <p className="text-sm text-gray-600">Enter product IDs (comma-separated) to feature on the storefront home page.</p>
      <input className="border px-2 py-1 rounded" value={ids} onChange={(e)=>setIds(e.target.value)} placeholder="id1,id2,id3" />
      <div>
        <button onClick={save} className="border px-3 py-1 rounded" disabled={saving}>{saving?'Saving…':'Save'}</button>
      </div>
    </main>
  );
}



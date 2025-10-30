"use client";
import { useEffect, useState } from 'react';

export default function AnalyticsConfigPage() {
  const [ga, setGa] = useState('');
  const [pixel, setPixel] = useState('');
  const [message, setMessage] = useState('');
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/analytics/config',{ headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setGa(j.ga_measurement_id||''); setPixel(j.meta_pixel_id||''); } catch {} })(); },[]);
  async function save(){ setMessage(''); const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/analytics/config',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ ga_measurement_id: ga, meta_pixel_id: pixel }) }); setMessage(r.ok ? 'Saved' : 'Failed'); }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Analytics Configuration</h1>
      <label className="grid gap-1"><span className="text-sm">GA Measurement ID</span><input className="border px-2 py-1 rounded" value={ga} onChange={(e)=>setGa(e.target.value)} /></label>
      <label className="grid gap-1"><span className="text-sm">Meta Pixel ID</span><input className="border px-2 py-1 rounded" value={pixel} onChange={(e)=>setPixel(e.target.value)} /></label>
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



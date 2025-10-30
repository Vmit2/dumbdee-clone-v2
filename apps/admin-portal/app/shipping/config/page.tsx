"use client";
import { useEffect, useState } from 'react';

export default function ShippingConfigPage() {
  const [carriers, setCarriers] = useState<string>('shipway,shiprocket');
  const [zones, setZones] = useState<string>('');
  const [overrides, setOverrides] = useState<string>('');
  const [message, setMessage] = useState('');
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/shipping/config',{ headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setCarriers((j.carriers||[]).join(',')); setZones(JSON.stringify(j.zones||[])); setOverrides(JSON.stringify(j.overrides||[])); } catch {} })(); },[]);
  async function save() {
    setMessage('');
    try {
      const body = { carriers: carriers.split(',').map(s=>s.trim()).filter(Boolean), zones: JSON.parse(zones||'[]'), overrides: JSON.parse(overrides||'[]') };
      const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/shipping/config',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(body) });
      if (r.ok) setMessage('Saved'); else setMessage('Failed');
    } catch { setMessage('Failed'); }
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Shipping Configuration</h1>
      <label className="grid gap-1"><span className="text-sm">Carriers (comma)</span><input className="border px-2 py-1 rounded" value={carriers} onChange={(e)=>setCarriers(e.target.value)} /></label>
      <label className="grid gap-1"><span className="text-sm">Zones (JSON)</span><textarea className="border px-2 py-1 rounded" rows={4} value={zones} onChange={(e)=>setZones(e.target.value)} /></label>
      <label className="grid gap-1"><span className="text-sm">Overrides (JSON)</span><textarea className="border px-2 py-1 rounded" rows={4} value={overrides} onChange={(e)=>setOverrides(e.target.value)} /></label>
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



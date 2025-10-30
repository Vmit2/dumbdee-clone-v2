"use client";
import { useEffect, useState } from 'react';

export default function TaxesPage() {
  const [rules, setRules] = useState<string>('');
  const [message, setMessage] = useState('');
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/taxes/config',{ headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setRules(JSON.stringify(j.rules||[], null, 2)); } catch {} })(); },[]);
  async function save(){ setMessage(''); try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/taxes/config',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ rules: JSON.parse(rules||'[]') }) }); setMessage(r.ok?'Saved':'Failed'); } catch { setMessage('Failed'); } }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Taxes</h1>
      <p className="text-sm text-gray-600">Configure per-region/category tax rules (JSON stub).</p>
      <textarea className="border px-2 py-1 rounded w-full" rows={10} value={rules} onChange={(e)=>setRules(e.target.value)} />
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



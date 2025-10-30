"use client";
import { useEffect, useState } from 'react';

export default function WebhooksPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [event, setEvent] = useState('order.created');
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/webhooks',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); } finally { setLoading(false);} })(); },[]);
  async function add() { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/webhooks',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ url, event }) }); const c=await r.json(); setRows((prev)=>[c,...prev]); setUrl(''); }
  async function remove(id:string){ await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/webhooks/${id}`,{ method:'DELETE', headers:{ Authorization:'Bearer REPLACE' } }); setRows((prev)=>prev.filter((x)=>x._id!==id)); }
  async function test(id:string){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/webhooks/${id}/test`,{ method:'POST', headers:{ Authorization:'Bearer REPLACE' } }); alert('Test triggered: ' + (await r.text())); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Webhooks</h1>
      <div className="grid gap-2 md:grid-cols-3 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="https://example.com/hook" value={url} onChange={(e)=>setUrl(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="event" value={event} onChange={(e)=>setEvent(e.target.value)} />
        <button onClick={add} className="border px-3 py-1 rounded">Add</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((w)=> (
          <li key={w._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{w.event}</div><div className="text-xs text-gray-600">{w.url}</div></div><div className="flex gap-2"><button onClick={()=>test(w._id)} className="border px-3 py-1 rounded">Test</button><button onClick={()=>remove(w._id)} className="border px-3 py-1 rounded">Delete</button></div></li>
        ))}
      </ul>
    </main>
  );
}



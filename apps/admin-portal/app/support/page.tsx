"use client";
import { useEffect, useState } from 'react';

export default function AdminSupportPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/support/tickets`,{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); } finally { setLoading(false);} })(); },[]);
  async function setStatus(id:string, status:'open'|'pending'|'resolved'){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/support/tickets/${id}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ status }) }); const u=await r.json(); setRows((prev)=>prev.map((x)=>x._id===u._id?u:x)); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Support Tickets</h1>
      <ul className="grid gap-2">
        {rows.map((t)=> (
          <li key={t._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{t.subject} · {t.status}</div>
              <div className="text-xs text-gray-600">{t.message}</div>
            </div>
            <div className="flex gap-2">
              {t.status!=='pending' && <button onClick={()=>setStatus(t._id,'pending')} className="border px-3 py-1 rounded">Pending</button>}
              {t.status!=='resolved' && <button onClick={()=>setStatus(t._id,'resolved')} className="border px-3 py-1 rounded">Resolve</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



"use client";
import { useEffect, useState } from 'react';

type Tpl = { _id?: string; name: string; channel: 'email'|'whatsapp'; body: string };

export default function TemplatesPage() {
  const [rows, setRows] = useState<Tpl[]>([]);
  const [form, setForm] = useState<Tpl>({ name: '', channel: 'email', body: '' });
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/notifications/templates',{ headers:{ Authorization:'Bearer REPLACE' } }); setRows(await r.json()); } finally { setLoading(false);} })(); },[]);
  function upd<K extends keyof Tpl>(k: K, v: Tpl[K]) { setForm({ ...form, [k]: v }); }
  async function create(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/notifications/templates',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(form) }); const c=await r.json(); setRows((prev)=>[c,...prev]); setForm({ name:'', channel:'email', body:'' }); }
  async function remove(id:string){ await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/notifications/templates/${id}`,{ method:'DELETE', headers:{ Authorization:'Bearer REPLACE' } }); setRows((prev)=>prev.filter((x)=>x._id!==id)); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Notification Templates</h1>
      <div className="grid gap-2 max-w-3xl md:grid-cols-3">
        <input className="border px-2 py-1 rounded" placeholder="Name" value={form.name} onChange={(e)=>upd('name', e.target.value)} />
        <select className="border px-2 py-1 rounded" value={form.channel} onChange={(e)=>upd('channel', e.target.value as any)}>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <button onClick={create} className="border px-3 py-1 rounded">Create</button>
      </div>
      <textarea className="border px-2 py-1 rounded max-w-3xl" rows={6} placeholder="Template body" value={form.body} onChange={(e)=>upd('body', e.target.value)} />
      <ul className="grid gap-2">
        {rows.map((t)=> (
          <li key={t._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{t.name}</div><div className="text-xs text-gray-600">{t.channel}</div></div><button onClick={()=>remove(t._id!)} className="border px-3 py-1 rounded">Delete</button></li>
        ))}
      </ul>
    </main>
  );
}



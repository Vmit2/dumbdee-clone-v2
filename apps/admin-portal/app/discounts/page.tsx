"use client";
import { useEffect, useState } from 'react';

type Coupon = { _id?: string; code: string; type: 'percent'|'flat'; value: number; active?: boolean };

export default function DiscountsPage() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>({ code: '', type: 'percent', value: 10 });
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/coupons'); setRows(await r.json()); } finally { setLoading(false);} })(); }, []);
  function upd<K extends keyof Coupon>(k: K, v: Coupon[K]) { setForm({ ...form, [k]: v }); }
  async function create() { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/coupons',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(form) }); const c=await r.json(); setRows((prev)=>[c,...prev]); setForm({ code:'', type:'percent', value:10 }); }
  async function toggleActive(c: Coupon) { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/coupons/${c._id}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ active: !c.active }) }); const u=await r.json(); setRows((prev)=>prev.map((x)=>x._id===u._id?u:x)); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Discounts</h1>
      <div className="grid gap-2 md:grid-cols-4 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="CODE" value={form.code} onChange={(e)=>upd('code', e.target.value)} />
        <select className="border px-2 py-1 rounded" value={form.type} onChange={(e)=>upd('type', e.target.value as any)}>
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>
        <input type="number" className="border px-2 py-1 rounded" placeholder="Value" value={form.value} onChange={(e)=>upd('value', Number(e.target.value)||0)} />
        <button onClick={create} className="border px-3 py-1 rounded">Create</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((c)=> (
          <li key={c._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{c.code}</div><div className="text-xs text-gray-600">{c.type} · {c.value} · {c.active ? 'active' : 'inactive'}</div></div><button onClick={()=>toggleActive(c)} className="border px-3 py-1 rounded">{c.active ? 'Deactivate' : 'Activate'}</button></li>
        ))}
      </ul>
    </main>
  );
}



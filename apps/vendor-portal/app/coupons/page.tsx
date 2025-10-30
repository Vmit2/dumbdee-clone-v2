"use client";
import { useEffect, useState } from 'react';

type Coupon = { _id?: string; code: string; type: 'percent'|'flat'; value: number; active?: boolean };

export default function VendorCouponsPage() {
  const [vendorId, setVendorId] = useState('');
  const [rows, setRows] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>({ code: '', type: 'percent', value: 10 });
  useEffect(()=>{ (async()=>{ if (!vendorId) return; const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/coupons?vendor_id=${encodeURIComponent(vendorId)}`); setRows(await r.json()); })(); },[vendorId]);
  function upd<K extends keyof Coupon>(k: K, v: Coupon[K]) { setForm({ ...form, [k]: v }); }
  async function create(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/vendor/coupons',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ vendor_id: vendorId, ...form }) }); const c=await r.json(); setRows((prev)=>[c,...prev]); setForm({ code:'', type:'percent', value:10 }); }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Coupons</h1>
      <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      <div className="grid gap-2 md:grid-cols-4 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="CODE" value={form.code} onChange={(e)=>upd('code', e.target.value)} />
        <select className="border px-2 py-1 rounded" value={form.type} onChange={(e)=>upd('type', e.target.value as any)}><option value="percent">Percent</option><option value="flat">Flat</option></select>
        <input type="number" className="border px-2 py-1 rounded" placeholder="Value" value={form.value} onChange={(e)=>upd('value', Number(e.target.value)||0)} />
        <button onClick={create} className="border px-3 py-1 rounded">Create</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((c)=> (<li key={c._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{c.code}</div><div className="text-xs text-gray-600">{c.type} · {c.value}</div></div></li>))}
      </ul>
    </main>
  );
}



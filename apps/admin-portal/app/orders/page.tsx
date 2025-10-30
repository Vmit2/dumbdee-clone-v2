"use client";
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/orders',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); } finally { setLoading(false);} })(); },[]);
  async function flag(o:any, flag:boolean){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders/${o._id}/fraud`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ fraud_flag: flag, fraud_score: flag? 80 : 0 }) }); const u=await r.json(); setRows((prev)=>prev.map((x)=>x._id===u._id?u:x)); }
  async function notify(o:any, channel:'email'|'whatsapp'){
    await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/notifications/order-update',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ channel, to: o?.user?.email || 'test@example.com', orderId: o._id, status: o.shipping_status }) });
    alert('Notification queued');
  }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <ul className="grid gap-2">
        {rows.map((o)=> (
          <li key={o._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{o.total} {o.currency}</div>
              <div className="text-xs text-gray-600">Payment: {o.payment_status} · Shipping: {o.shipping_status} · Fraud: {o.fraud_flag ? `YES (${o.fraud_score})` : 'NO'}</div>
            </div>
            <div className="flex gap-2">
              {!o.fraud_flag ? <button onClick={()=>flag(o,true)} className="border px-3 py-1 rounded">Flag</button> : <button onClick={()=>flag(o,false)} className="border px-3 py-1 rounded">Unflag</button>}
              <button onClick={()=>notify(o,'email')} className="border px-3 py-1 rounded">Email Update</button>
              <button onClick={()=>notify(o,'whatsapp')} className="border px-3 py-1 rounded">WhatsApp Update</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



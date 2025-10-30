"use client";
import { useEffect, useState } from "react";

export default function AdminRefundsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders?refunds=pending`, { cache:'no-store', headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setRows(Array.isArray(j)?j:[]); } finally { setLoading(false); } })(); },[]);
  async function approve(orderId:string, idx:number){
    await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders/${orderId}/refunds/${idx}/approve`, { method:'PUT', headers:{ Authorization:'Bearer REPLACE' } });
    setRows((prev)=>prev.map((o)=> o._id===orderId ? { ...o, refunds: o.refunds.map((r:any,i:number)=> i===idx? { ...r, status:'approved'}: r) } : o ));
  }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Refund Approvals</h1>
      <ul className="grid gap-2">
        {rows.flatMap((o)=> (o.refunds||[]).map((r:any,i:number)=> ({order:o, r, i}))).filter(({r})=>r.status==='pending' || r.status==='requested').map(({order:o, r, i})=> (
          <li key={o._id+':'+i} className="border p-2 rounded">
            <div className="text-sm">Order {o._id} · {o.total} {o.currency}</div>
            <div className="text-xs text-gray-600">Reason: {r.reason||'-'} · Amount: {r.amount}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>approve(o._id, i)} className="border px-3 py-1 rounded">Approve</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



"use client";
import { useEffect, useState } from 'react';

export default function VendorRefundsPage() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('INR');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [show, setShow] = useState<'all'|'pending'|'approved'>('all');
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders?refunds=${show==='approved'?'approved':'pending'}`,{ cache:'no-store', headers:{ Authorization:'Bearer REPLACE' } }); const j=await r.json(); setRows(Array.isArray(j)?j:[]); } catch {} })(); },[show]);
  async function requestRefund(){
    setMessage('');
    try {
      const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders/${encodeURIComponent(orderId)}/refunds`,{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ amount, currency, reason }) });
      setMessage(r.ok?'Requested':'Failed');
    } catch { setMessage('Failed'); }
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Refund Requests</h1>
      <div className="flex items-center gap-2 text-sm">
        <button onClick={()=>setShow('all')} className={'border px-2 py-1 rounded '+(show==='all'?'bg-black text-white':'')}>All</button>
        <button onClick={()=>setShow('pending')} className={'border px-2 py-1 rounded '+(show==='pending'?'bg-black text-white':'')}>Pending</button>
        <button onClick={()=>setShow('approved')} className={'border px-2 py-1 rounded '+(show==='approved'?'bg-black text-white':'')}>Approved</button>
      </div>
      <div className="grid gap-2 md:grid-cols-4 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Order ID" value={orderId} onChange={(e)=>setOrderId(e.target.value)} />
        <input type="number" className="border px-2 py-1 rounded" placeholder="Amount" value={amount} onChange={(e)=>setAmount(Number(e.target.value)||0)} />
        <input className="border px-2 py-1 rounded" placeholder="Currency" value={currency} onChange={(e)=>setCurrency(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Reason" value={reason} onChange={(e)=>setReason(e.target.value)} />
        <div className="md:col-span-4"><button onClick={requestRefund} className="border px-3 py-1 rounded">Request Refund</button></div>
      </div>
      {message && <div className="text-sm text-gray-700">{message}</div>}
      <div className="grid gap-2">
        {(rows||[]).map((o)=> (o.refunds||[]).filter((r:any)=> show==='all' ? true : (show==='approved'? r.status==='approved' : (r.status==='pending'||r.status==='requested'))).map((r:any,i:number)=> (
          <div key={o._id+':'+i} className="border rounded p-2 flex items-center justify-between">
            <div className="text-xs">Order {o._id} · Amt {r.amount} {r.currency} · <span className={'px-2 py-0.5 rounded text-white '+(r.status==='approved'?'bg-green-600':'bg-yellow-600')}>{r.status}</span></div>
          </div>
        )))}
      </div>
    </main>
  );
}



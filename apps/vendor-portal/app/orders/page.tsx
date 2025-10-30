"use client";
import { useEffect, useState } from 'react';

export default function VendorOrdersPage() {
  const [vendorId, setVendorId] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ if (!vendorId) return; const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/vendor/orders?vendor_id=${encodeURIComponent(vendorId)}`,{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); })(); },[vendorId]);
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      <ul className="grid gap-2">
        {rows.map((o)=> (
          <li key={o._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{o.total} {o.currency}</div><div className="text-xs text-gray-600">Payment: {o.payment_status} · Shipping: {o.shipping_status}</div></div></li>
        ))}
      </ul>
    </main>
  );
}



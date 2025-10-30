"use client";
import { useState } from 'react';

export default function VendorShipmentsPage() {
  const [provider, setProvider] = useState('shipway');
  const [orderId, setOrderId] = useState('');
  const [label, setLabel] = useState<any>(null);
  async function create() {
    const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/shipping/label',{ method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ provider, shipment: { orderId } }) });
    setLabel(await r.json());
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Shipments</h1>
      <div className="grid gap-2 md:grid-cols-3 max-w-xl">
        <select className="border px-2 py-1 rounded" value={provider} onChange={(e)=>setProvider(e.target.value)}><option value="shipway">Shipway</option><option value="shiprocket">Shiprocket</option></select>
        <input className="border px-2 py-1 rounded" placeholder="Order ID" value={orderId} onChange={(e)=>setOrderId(e.target.value)} />
        <button onClick={create} className="border px-3 py-1 rounded">Create Label</button>
      </div>
      {label && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(label, null, 2)}</pre>}
    </main>
  );
}



"use client";
import { useState } from 'react';

export default function ShippingToolsPage() {
  const [provider, setProvider] = useState('shipway');
  const [rates, setRates] = useState<any>(null);
  const [label, setLabel] = useState<any>(null);
  const [trackId, setTrackId] = useState('');
  const [track, setTrack] = useState<any>(null);

  async function fetchRates() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/shipping/rates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, currency: 'INR' }) });
    setRates(await res.json());
  }
  async function createLabel() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/shipping/label', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, shipment: { orderId: 'test', items: 1 } }) });
    setLabel(await res.json());
  }
  async function doTrack() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/shipping/track/' + encodeURIComponent(trackId) + `?provider=${provider}`);
    setTrack(await res.json());
  }

  return (
    <main className="p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Shipping Tools</h1>
      <div className="grid gap-2 max-w-md">
        <label className="grid gap-1">
          <span className="text-sm">Provider</span>
          <select className="border px-2 py-1 rounded" value={provider} onChange={(e)=>setProvider(e.target.value)}>
            <option value="shipway">Shipway</option>
            <option value="shiprocket">Shiprocket</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button onClick={fetchRates} className="border px-3 py-1 rounded">Get Rates</button>
          <button onClick={createLabel} className="border px-3 py-1 rounded">Create Label</button>
        </div>
        <label className="grid gap-1">
          <span className="text-sm">Tracking ID</span>
          <input className="border px-2 py-1 rounded" value={trackId} onChange={(e)=>setTrackId(e.target.value)} placeholder="TRACK123" />
        </label>
        <button onClick={doTrack} className="border px-3 py-1 rounded w-fit">Track</button>
      </div>
      {rates && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(rates, null, 2)}</pre>}
      {label && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(label, null, 2)}</pre>}
      {track && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(track, null, 2)}</pre>}
    </main>
  );
}



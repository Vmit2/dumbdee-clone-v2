"use client";
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState('');
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/orders/mine', { headers: { Authorization: 'Bearer REPLACE' }, cache: 'no-store' });
        setRows(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  async function doTrack() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/shipping/track/' + encodeURIComponent(trackId));
    setTrack(await res.json());
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Your Orders</h1>
      <ul className="grid gap-2">
        {rows.map((o)=> (
          <li key={o._id} className="border p-2 rounded">
            <div className="flex items-center justify-between">
              <div className="font-medium">{o.total} {o.currency}</div>
              <div className="text-xs text-gray-600">Payment: {o.payment_status} · Shipping: {o.shipping_status}</div>
            </div>
            <div className="text-xs mt-1">Items: {o.items?.length || 0}</div>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 max-w-md">
        <h2 className="text-lg font-semibold">Track Shipment</h2>
        <input className="border px-2 py-1 rounded" placeholder="Tracking ID" value={trackId} onChange={(e)=>setTrackId(e.target.value)} />
        <button onClick={doTrack} className="border px-3 py-1 rounded w-fit">Track</button>
        {track && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(track, null, 2)}</pre>}
      </div>
    </main>
  );
}



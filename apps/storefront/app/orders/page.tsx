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
        const j = await res.json();
        setRows(Array.isArray(j) ? j : []);
      } finally { setLoading(false); }
    })();
  }, []);

  async function doTrack() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/shipping/track/' + encodeURIComponent(trackId));
    setTrack(await res.json());
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="py-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Your Orders</h1>
      <ul className="grid gap-3">
        {(rows||[]).map((o:any)=> (
          <li key={o._id} className="border rounded p-3 bg-white/90">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{o.total} {o.currency}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className={'px-2 py-0.5 rounded text-white '+(o.payment_status==='paid'?'bg-green-600':'bg-yellow-600')}>{o.payment_status||'unpaid'}</span>
                <span className={'px-2 py-0.5 rounded text-white '+(o.shipping_status==='delivered'?'bg-green-600':'bg-blue-600')}>{o.shipping_status||'pending'}</span>
              </div>
            </div>
            <div className="text-xs mt-1">Items: {o.items?.length || 0}</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm underline">View details</summary>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto mt-1">{JSON.stringify(o, null, 2)}</pre>
            </details>
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



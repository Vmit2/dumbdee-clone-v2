"use client";
import { useEffect, useState } from 'react';

export default function PayoutsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/payouts', { headers: { Authorization: 'Bearer REPLACE' } });
        setRows(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  async function act(id: string, action: 'approve'|'pay') {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/v1/payouts/${id}/${action}`, { method: 'PUT', headers: { Authorization: 'Bearer REPLACE' } });
    const updated = await res.json();
    setRows((prev) => prev.map((r) => r._id === id ? updated : r));
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{r.amount} {r.currency} · {r.status}</div>
              <div className="text-xs text-gray-600">Seller: {r.seller_id}</div>
            </div>
            <div className="flex gap-2">
              {r.status === 'requested' && <button onClick={()=>act(r._id,'approve')} className="border px-3 py-1 rounded">Approve</button>}
              {r.status === 'approved' && <button onClick={()=>act(r._id,'pay')} className="border px-3 py-1 rounded">Mark Paid</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



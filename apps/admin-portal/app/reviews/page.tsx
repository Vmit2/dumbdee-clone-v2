"use client";
import { useEffect, useState } from 'react';

export default function ReviewsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/reviews', { cache: 'no-store' });
        setRows(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  async function update(id: string, body: any) {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/v1/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify(body) });
    const updated = await res.json();
    setRows((prev)=>prev.map((r)=>r._id===id?updated:r));
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Reviews Moderation</h1>
      <ul className="grid gap-2">
        {rows.map((r)=> (
          <li key={r._id} className="border p-2 rounded">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.title || 'Review'} · {r.rating || 0}★</div>
              <div className="text-xs text-gray-600">{r.product_id}</div>
            </div>
            <div className="text-sm mt-1">{r.body || r.comment}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>update(r._id,{ approved: true })} className="border px-3 py-1 rounded">Approve</button>
              <button onClick={()=>update(r._id,{ approved: false, hidden: true })} className="border px-3 py-1 rounded">Hide</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

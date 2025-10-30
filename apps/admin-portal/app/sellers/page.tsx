"use client";
import { useEffect, useState } from 'react';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/admin/vendors', { headers: { Authorization: 'Bearer REPLACE' }, cache: 'no-store' });
        setSellers(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  async function setStatus(id: string, action: 'approve'|'suspend') {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/v1/admin/vendors/${id}/${action}`, { method: 'PUT', headers: { Authorization: 'Bearer REPLACE' } });
    const updated = await res.json();
    setSellers((prev) => prev.map((s) => s._id === id ? updated : s));
  }

  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Sellers</h1>
      <ul className="mt-4 grid gap-2">
        {Array.isArray(sellers) && sellers.map((s: any) => (
          <li key={s._id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-600">{s.slug} · {s.status}</div>
            </div>
            <div className="flex gap-2">
              {s.status !== 'active' && <button onClick={()=>setStatus(s._id,'approve')} className="border px-3 py-1 rounded">Approve</button>}
              {s.status !== 'suspended' && <button onClick={()=>setStatus(s._id,'suspend')} className="border px-3 py-1 rounded">Suspend</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



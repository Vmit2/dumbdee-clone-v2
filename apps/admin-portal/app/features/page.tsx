"use client";
import { useEffect, useState } from 'react';

export default function FeaturesPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/features', { headers: { Authorization: 'Bearer REPLACE' } });
        const data = await res.json();
        setFlags(data || {});
      } finally { setLoading(false); }
    })();
  }, []);
  async function save() {
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/features', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify(flags) });
    alert('Saved');
  }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Feature Toggles</h1>
      <div className="grid gap-2">
        {Object.entries(flags).map(([k, v]) => (
          <label key={k} className="flex items-center gap-2">
            <input type="checkbox" checked={!!v} onChange={(e)=>setFlags({ ...flags, [k]: e.target.checked })} />
            <span>{k}</span>
          </label>
        ))}
      </div>
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
    </main>
  );
}



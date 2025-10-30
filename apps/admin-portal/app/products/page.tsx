"use client";
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkStatus, setBulkStatus] = useState<string>('');
  useEffect(() => { (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/products?limit=100',{cache:'no-store'}); setRows(await r.json()); } finally { setLoading(false); } })(); }, []);
  async function setStatus(id: string, status: 'approved'|'published'|'pending_approval'|'draft') {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setRows((prev)=>prev.map((p)=>p._id===id?updated:p));
  }
  async function duplicate(id: string) {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/products/${id}/duplicate`, { method:'POST', headers:{ Authorization:'Bearer REPLACE' } });
    const created = await res.json();
    setRows((prev)=>[created, ...prev]);
  }
  async function bulkEdit() {
    const ids = Object.entries(selected).filter(([,v])=>v).map(([k])=>k);
    if (!ids.length || !bulkStatus) return;
    await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/products/bulk`, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ ids, update: { status: bulkStatus } }) });
    setSelected({}); setBulkStatus('');
    const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/products?limit=100',{cache:'no-store'}); setRows(await r.json());
  }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Products (Approval)</h1>
      <div className="flex items-center gap-2">
        <select className="border px-2 py-1 rounded" value={bulkStatus} onChange={(e)=>setBulkStatus(e.target.value)}>
          <option value="">Bulk set status…</option>
          <option value="draft">draft</option>
          <option value="pending_approval">pending_approval</option>
          <option value="published">published</option>
        </select>
        <button onClick={bulkEdit} className="border px-3 py-1 rounded">Apply</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((p)=> (
          <li key={p._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-600">{p.slug} · {p.status}</div>
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!selected[p._id]} onChange={(e)=>setSelected({ ...selected, [p._id]: e.target.checked })} /> select</label>
              <button onClick={()=>duplicate(p._id)} className="border px-3 py-1 rounded">Duplicate</button>
              {p.status!== 'published' && <button onClick={()=>setStatus(p._id,'published')} className="border px-3 py-1 rounded">Publish</button>}
              {p.status!== 'pending_approval' && <button onClick={()=>setStatus(p._id,'pending_approval')} className="border px-3 py-1 rounded">Mark Pending</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



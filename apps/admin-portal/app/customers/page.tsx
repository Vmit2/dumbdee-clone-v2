"use client";
import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any|null>(null);
  const [wishlist, setWishlist] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [roleDraft, setRoleDraft] = useState<Record<string,string>>({});
  const [locked, setLocked] = useState<Record<string,boolean>>({});
  async function updateRole(user:any){
    const role = roleDraft[user._id];
    if (!role) return;
    await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/customers/${user._id}/role`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ role }) });
    const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/customers?limit=100`,{ cache:'no-store', headers:{ Authorization:'Bearer REPLACE' } });
    setRows(await r.json());
  }
  async function toggleLock(u:any){
    const next = !locked[u._id];
    await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/customers/${u._id}/lock`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ locked: next }) });
    setLocked({ ...locked, [u._id]: next });
  }
  async function impersonate(u:any){
    const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/impersonate/${u._id}`, { method:'POST', headers:{ Authorization:'Bearer REPLACE' } });
    const j = await r.json();
    const url = (process.env.NEXT_PUBLIC_VENDOR_URL||'http://localhost:3002')+`/auth/impersonate?token=${encodeURIComponent(j.token)}&user=${encodeURIComponent(u._id)}`;
    window.open(url, '_blank');
  }
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  async function load(){ const params=new URLSearchParams(); if (email) params.set('email', email); if (role) params.set('role', role); const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/customers?'+params.toString(),{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); }
  useEffect(()=>{ (async()=>{ try { await load(); } finally { setLoading(false);} })(); },[]);
  async function viewWishlist(u:any){ setSelected(u); const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/customers/${u._id}/wishlist`,{ headers:{ Authorization:'Bearer REPLACE' } }); setWishlist(await r.json()); }
  async function viewOrders(u:any){ setSelected(u); const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/customers/${u._id}/orders`,{ headers:{ Authorization:'Bearer REPLACE' } }); setOrders(await r.json()); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="grid gap-2 md:grid-cols-3 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Filter by email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="role (admin/vendor/customer)" value={role} onChange={(e)=>setRole(e.target.value)} />
        <button onClick={load} className="border px-3 py-1 rounded">Apply</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((u)=> (
          <li key={u._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-xs text-gray-600">{u.role}</div>
            </div>
            <div className="flex gap-2 items-center">
              <select className="border px-2 py-1 rounded text-xs" value={roleDraft[u._id]||u.role} onChange={(e)=>setRoleDraft({ ...roleDraft, [u._id]: e.target.value })}>
                <option value="buyer">buyer</option>
                <option value="support">support</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
              <button onClick={()=>updateRole(u)} className="border px-2 py-1 rounded text-xs">Save Role</button>
              <button onClick={()=>viewWishlist(u)} className="border px-3 py-1 rounded">Wishlist</button>
              <button onClick={()=>viewOrders(u)} className="border px-3 py-1 rounded">Orders</button>
              <button onClick={()=>toggleLock(u)} className="border px-2 py-1 rounded text-xs">{locked[u._id]?'Unlock':'Lock'}</button>
              <button onClick={()=>impersonate(u)} className="border px-2 py-1 rounded text-xs">Impersonate</button>
            </div>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="border rounded p-3">
          <div className="font-semibold mb-1">Wishlist for {selected.email}</div>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(wishlist, null, 2)}</pre>
          <div className="font-semibold mt-3 mb-1">Orders ({orders.length})</div>
          <ul className="grid gap-1">
            {orders.map((o:any)=>(<li key={o._id} className="text-xs bg-gray-50 p-2 rounded">{o.total} {o.currency} · payment {o.payment_status} · shipping {o.shipping_status}</li>))}
          </ul>
        </div>
      )}
    </main>
  );
}



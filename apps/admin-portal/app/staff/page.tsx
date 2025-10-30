"use client";
import { useEffect, useState } from 'react';

export default function StaffPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/staff',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); } finally { setLoading(false);} })(); },[]);
  async function add(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/staff',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ email, role }) }); const u=await r.json(); setRows((prev)=>[u,...prev]); setEmail(''); }
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Staff</h1>
      <div className="grid gap-2 md:grid-cols-3 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <select className="border px-2 py-1 rounded" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="staff">staff</option>
          <option value="support">support</option>
          <option value="admin">admin</option>
        </select>
        <button onClick={add} className="border px-3 py-1 rounded">Add</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((u)=> (<li key={u._id} className="border p-2 rounded flex items-center justify-between"><div><div className="font-medium">{u.email}</div><div className="text-xs text-gray-600">{u.role}</div></div></li>))}
      </ul>
    </main>
  );
}



"use client";
import { useEffect, useState } from 'react';

export default function VendorSupportPage() {
  const [vendorId, setVendorId] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  async function load(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/support/tickets?vendor_id=${encodeURIComponent(vendorId)}`,{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); }
  useEffect(()=>{ if (vendorId) load(); },[vendorId]);
  async function create(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/support/tickets`,{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ vendor_id: vendorId, subject, message }) }); if (r.ok){ setSubject(''); setMessage(''); await load(); } }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Support</h1>
      <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      <div className="grid gap-2 md:grid-cols-3 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
        <button onClick={create} className="border px-3 py-1 rounded">Create Ticket</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((t)=> (<li key={t._id} className="border p-2 rounded"><div className="font-medium">{t.subject} · {t.status}</div><div className="text-xs text-gray-600">{t.message}</div></li>))}
      </ul>
    </main>
  );
}



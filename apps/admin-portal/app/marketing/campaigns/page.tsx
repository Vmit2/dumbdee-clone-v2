"use client";
import { useEffect, useMemo, useState } from 'react';

type Campaign = { _id?: string; name: string; source?: string; medium?: string; campaign?: string; content?: string; term?: string };

export default function CampaignsPage() {
  const [rows, setRows] = useState<Campaign[]>([]);
  const [form, setForm] = useState<Campaign>({ name: '', source: 'newsletter', medium: 'email', campaign: '', content: '', term: '' });
  const [base, setBase] = useState<string>(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  useEffect(()=>{ (async()=>{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/campaigns',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setRows(await r.json()); })(); },[]);
  function upd<K extends keyof Campaign>(k: K, v: Campaign[K]) { setForm({ ...form, [k]: v }); }
  async function create() { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/campaigns',{ method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(form) }); const c=await r.json(); setRows((prev)=>[c,...prev]); }
  const utm = useMemo(()=>{ const p=new URLSearchParams(); if (form.source) p.set('utm_source', form.source); if (form.medium) p.set('utm_medium', form.medium); if (form.campaign) p.set('utm_campaign', form.campaign); if (form.content) p.set('utm_content', form.content); if (form.term) p.set('utm_term', form.term); return `${base}/?${p.toString()}`; },[form, base]);
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Campaign Builder</h1>
      <label className="grid gap-1"><span className="text-sm">Base URL</span><input className="border px-2 py-1 rounded" value={base} onChange={(e)=>setBase(e.target.value)} /></label>
      <div className="grid gap-2 md:grid-cols-3 max-w-4xl">
        <input className="border px-2 py-1 rounded" placeholder="Name" value={form.name} onChange={(e)=>upd('name', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="utm_source" value={form.source} onChange={(e)=>upd('source', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="utm_medium" value={form.medium} onChange={(e)=>upd('medium', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="utm_campaign" value={form.campaign} onChange={(e)=>upd('campaign', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="utm_content" value={form.content} onChange={(e)=>upd('content', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="utm_term" value={form.term} onChange={(e)=>upd('term', e.target.value)} />
      </div>
      <div className="text-sm">Preview UTM Link: <code className="break-all">{utm}</code></div>
      <button onClick={create} className="border px-3 py-1 rounded w-fit">Save Campaign</button>
      <ul className="grid gap-2">
        {rows.map((c)=> (<li key={c._id} className="border p-2 rounded"><div className="font-medium">{c.name}</div><div className="text-xs text-gray-600">{c.source}/{c.medium}/{c.campaign}</div></li>))}
      </ul>
    </main>
  );
}



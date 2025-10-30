"use client";
import { useEffect, useState } from 'react';
import { SEASONAL_THEMES } from '@dumbdee/common-frontend';

export default function ThemesPage() {
  const [current, setCurrent] = useState<string>('spring-bloom');
  const [colors, setColors] = useState<Record<string,string>>({});
  const [message, setMessage] = useState('');
  useEffect(()=>{ (async()=>{ try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/settings',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); const j=await r.json(); setCurrent(j?.themes?.current || 'spring-bloom'); setColors(j?.themes?.colors || {}); } catch {} })(); },[]);
  async function save(){ setMessage(''); try{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/settings',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ themes: { current, colors } }) }); setMessage(r.ok?'Saved':'Failed'); } catch{ setMessage('Failed'); } }
  function setVar(k:string,v:string){ setColors((prev)=>({ ...prev, [k]: v })); }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Themes</h1>
      <label className="grid gap-1"><span className="text-sm">Preset</span><select className="border px-2 py-1 rounded" value={current} onChange={(e)=>setCurrent(e.target.value)}>{SEASONAL_THEMES.map((t)=> <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <div className="grid gap-2 md:grid-cols-2 max-w-3xl">
        {['--bg','--fg','--primary','--accent'].map((k)=> (
          <label key={k} className="grid gap-1"><span className="text-sm">{k}</span><input className="border px-2 py-1 rounded" value={colors[k]||''} onChange={(e)=>setVar(k, e.target.value)} placeholder="#hex or css" /></label>
        ))}
      </div>
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



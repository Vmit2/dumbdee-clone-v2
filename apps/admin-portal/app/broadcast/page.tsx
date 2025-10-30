"use client";
import { useState } from 'react';

export default function BroadcastPage() {
  const [channel, setChannel] = useState<'email'|'whatsapp'>('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [template, setTemplate] = useState('promo');
  const [segment, setSegment] = useState('all');
  const [result, setResult] = useState<any>(null);
  async function send() {
    const path = channel === 'email' ? '/api/v1/notifications/broadcast/email' : '/api/v1/notifications/broadcast/whatsapp';
    const payload = channel === 'email' ? { subject, body, segment } : { template, segment };
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'') + path, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(payload) });
    setResult(await res.json());
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Broadcast</h1>
      <div className="grid gap-2 max-w-2xl">
        <label className="grid gap-1"><span className="text-sm">Channel</span><select className="border px-2 py-1 rounded" value={channel} onChange={(e)=>setChannel(e.target.value as any)}><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label>
        {channel==='email' ? (
          <>
            <input className="border px-2 py-1 rounded" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
            <textarea className="border px-2 py-1 rounded" rows={5} placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)} />
          </>
        ) : (
          <input className="border px-2 py-1 rounded" placeholder="Template name" value={template} onChange={(e)=>setTemplate(e.target.value)} />
        )}
        <input className="border px-2 py-1 rounded" placeholder="Segment (e.g., all, top_buyers)" value={segment} onChange={(e)=>setSegment(e.target.value)} />
        <button onClick={send} className="border px-3 py-1 rounded w-fit">Send</button>
      </div>
      {result && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}



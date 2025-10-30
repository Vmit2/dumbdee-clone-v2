"use client";
import { useState } from 'react';

export default function NotificationsPage() {
  const [to, setTo] = useState('');
  const [template, setTemplate] = useState('order_placed');
  const [channel, setChannel] = useState<'email'|'whatsapp'>('email');
  const [result, setResult] = useState<any>(null);

  async function send() {
    const path = channel === 'email' ? '/api/v1/notifications/email/test' : '/api/v1/notifications/whatsapp/test';
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify({ to, template, vars: { shop: 'DumbDee' } }) });
    setResult(await res.json());
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Notifications (Test)</h1>
      <div className="grid gap-2 max-w-md">
        <label className="grid gap-1">
          <span className="text-sm">Channel</span>
          <select className="border px-2 py-1 rounded" value={channel} onChange={(e)=>setChannel(e.target.value as any)}>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm">To</span>
          <input className="border px-2 py-1 rounded" value={to} onChange={(e)=>setTo(e.target.value)} placeholder="receiver" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Template</span>
          <input className="border px-2 py-1 rounded" value={template} onChange={(e)=>setTemplate(e.target.value)} />
        </label>
        <button onClick={send} className="border px-3 py-1 rounded w-fit">Send Test</button>
      </div>
      {result && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}



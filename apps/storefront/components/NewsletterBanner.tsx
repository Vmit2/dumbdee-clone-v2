'use client';
import { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  async function subscribe() {
    setMsg('');
    if (!email) { setMsg('Enter email'); return; }
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/public/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) setMsg('Subscribed!'); else setMsg('Failed');
    } catch { setMsg('Failed'); }
  }
  return (
    <div className="w-full bg-emerald-50 border-t p-3 flex items-center justify-center gap-3">
      <span className="text-sm">Get updates and offers:</span>
      <input className="border px-2 py-1 rounded text-sm" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={subscribe} className="border px-2 py-1 rounded text-sm">Subscribe</button>
      {msg && <span className="text-xs text-gray-600">{msg}</span>}
    </div>
  );
}



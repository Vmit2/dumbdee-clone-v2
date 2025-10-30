"use client";
import { useEffect, useState } from 'react';

type Address = { label?: string; line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string; is_default?: boolean };
type PaymentMethod = { provider?: string; token?: string; last4?: string; brand?: string; exp_month?: number; exp_year?: number; is_default?: boolean };

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({ country: 'IN' });
  const [message, setMessage] = useState('');
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [pm, setPm] = useState<PaymentMethod>({ provider: 'stripe' });
  async function load(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/customers/me/addresses',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setAddresses(await r.json()); }
  async function loadPm(){ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/customers/me/payment-methods',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setMethods(await r.json()); }
  useEffect(()=>{ (async()=>{ try{ await load(); await loadPm(); } catch{} })(); },[]);
  function upd<K extends keyof Address>(k:K,v:Address[K]){ setForm({ ...form, [k]: v }); }
  async function save(){ setMessage(''); try{ const next=[...addresses, form]; const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/customers/me/addresses',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(next) }); if (r.ok){ setForm({ country:'IN' }); await load(); setMessage('Saved'); } else setMessage('Failed'); } catch{ setMessage('Failed'); } }
  async function savePm(){ setMessage(''); try{ const next=[...methods, pm]; const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/customers/me/payment-methods',{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(next) }); if (r.ok){ setPm({ provider:'stripe' }); await loadPm(); setMessage('Saved'); } else setMessage('Failed'); } catch{ setMessage('Failed'); } }
  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <section className="md:col-span-8 grid gap-3">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <div className="grid gap-2 md:grid-cols-3 max-w-4xl">
        <input className="border px-2 py-1 rounded" placeholder="Label" value={form.label||''} onChange={(e)=>upd('label', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Line 1" value={form.line1||''} onChange={(e)=>upd('line1', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Line 2" value={form.line2||''} onChange={(e)=>upd('line2', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="City" value={form.city||''} onChange={(e)=>upd('city', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="State" value={form.state||''} onChange={(e)=>upd('state', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Postal Code" value={form.postal_code||''} onChange={(e)=>upd('postal_code', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Country" value={form.country||''} onChange={(e)=>upd('country', e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_default} onChange={(e)=>upd('is_default', e.target.checked)} /> Default</label>
        <div className="md:col-span-3"><button onClick={save} className="border px-3 py-1 rounded">Add Address</button></div>
        </div>
        {message && <div className="text-sm text-gray-700">{message}</div>}
        <ul className="grid gap-2">
        {addresses.map((a, i)=> (
          <li key={i} className="border p-2 rounded"><div className="font-medium">{a.label||'Address'}{a.is_default?' (default)':''}</div><div className="text-xs text-gray-600">{a.line1} {a.line2} · {a.city} {a.state} {a.postal_code} · {a.country}</div></li>
        ))}
        </ul>
        <h2 className="text-xl font-semibold mt-6">Payment Methods</h2>
        <div className="grid gap-2 md:grid-cols-4 max-w-4xl">
        <select className="border px-2 py-1 rounded" value={pm.provider||''} onChange={(e)=>setPm({ ...pm, provider: e.target.value })}><option value="stripe">Stripe</option><option value="razorpay">Razorpay</option></select>
        <input className="border px-2 py-1 rounded" placeholder="Token" value={pm.token||''} onChange={(e)=>setPm({ ...pm, token: e.target.value })} />
        <input className="border px-2 py-1 rounded" placeholder="Brand" value={pm.brand||''} onChange={(e)=>setPm({ ...pm, brand: e.target.value })} />
        <input className="border px-2 py-1 rounded" placeholder="Last4" value={pm.last4||''} onChange={(e)=>setPm({ ...pm, last4: e.target.value })} />
        <input type="number" className="border px-2 py-1 rounded" placeholder="Exp Month" value={pm.exp_month||0} onChange={(e)=>setPm({ ...pm, exp_month: Number(e.target.value)||0 })} />
        <input type="number" className="border px-2 py-1 rounded" placeholder="Exp Year" value={pm.exp_year||0} onChange={(e)=>setPm({ ...pm, exp_year: Number(e.target.value)||0 })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!pm.is_default} onChange={(e)=>setPm({ ...pm, is_default: e.target.checked })} /> Default</label>
          <div className="md:col-span-4"><button onClick={savePm} className="border px-3 py-1 rounded">Add Payment Method</button></div>
        </div>
        <ul className="grid gap-2">
        {methods.map((m, i)=> (
          <li key={i} className="border p-2 rounded"><div className="font-medium">{m.brand||m.provider} {m.last4?`•••• ${m.last4}`:''}{m.is_default?' (default)':''}</div></li>
        ))}
        </ul>
      </section>
      <aside className="md:col-span-4 border rounded p-3 h-fit sticky top-16 bg-white/90">
        <div className="font-semibold mb-2">Quick Links</div>
        <ul className="grid gap-1 text-sm">
          <li><a className="underline" href="/orders">Your Orders</a></li>
          <li><a className="underline" href="/wishlist">Wishlist</a></li>
          <li><a className="underline" href="/cart">Cart</a></li>
        </ul>
      </aside>
    </main>
  );
}



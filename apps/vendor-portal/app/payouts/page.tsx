"use client";
import { useEffect, useState } from 'react';

export default function VendorPayoutsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('INR');
  const [sellerId, setSellerId] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/payouts?seller_id=' + encodeURIComponent(sellerId), { headers: { Authorization: 'Bearer REPLACE' } });
      setRows(await res.json());
    })();
  }, [sellerId]);

  async function requestPayout() {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/payouts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify({ seller_id: sellerId, amount, currency }) });
    const created = await res.json();
    setRows((prev)=>[created, ...prev]);
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <div className="grid gap-2 max-w-md">
        <input className="border px-2 py-1 rounded" placeholder="Seller ID" value={sellerId} onChange={(e)=>setSellerId(e.target.value)} />
        <div className="flex gap-2">
          <input type="number" className="border px-2 py-1 rounded" placeholder="Amount" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} />
          <input className="border px-2 py-1 rounded w-24" placeholder="Currency" value={currency} onChange={(e)=>setCurrency(e.target.value)} />
        </div>
        <button onClick={requestPayout} className="border px-3 py-1 rounded w-fit">Request Payout</button>
      </div>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r._id} className="border p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{r.amount} {r.currency} · {r.status}</div>
              <div className="text-xs text-gray-600">Requested: {new Date(r.createdAt).toLocaleString?.() || ''}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}



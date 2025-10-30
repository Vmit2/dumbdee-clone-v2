"use client";
import { useEffect, useState } from "react";

export default function ReportsPage(){
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try { const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/reports/sales`,{ cache:'no-store', headers:{ Authorization:'Bearer REPLACE' } }); setData(await r.json()); } finally { setLoading(false); } })(); },[]);
  if (loading) return <main className="p-6">Loading...</main>;
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <section className="border rounded p-3">
          <h2 className="font-semibold mb-2">Sales by Seller</h2>
          <ul className="grid gap-1 text-sm">
            {(data?.bySeller||[]).map((r:any,i:number)=>(<li key={i} className="flex items-center justify-between"><span>{r.seller}</span><span>{r.revenue}</span></li>))}
          </ul>
        </section>
        <section className="border rounded p-3">
          <h2 className="font-semibold mb-2">Sales by Category</h2>
          <ul className="grid gap-1 text-sm">
            {(data?.byCategory||[]).map((r:any,i:number)=>(<li key={i} className="flex items-center justify-between"><span>{r.category}</span><span>{r.revenue}</span></li>))}
          </ul>
        </section>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <a className="underline" href={(process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/reports/sales.csv`} target="_blank">Download Sales CSV</a>
        <a className="underline" href={(process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/exports/products.csv`} target="_blank">Export Products CSV</a>
        <a className="underline" href={(process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/admin/exports/payouts.csv`} target="_blank">Export Payouts CSV</a>
      </div>
    </main>
  );
}

"use client";
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/reports/sales',{ headers:{ Authorization:'Bearer REPLACE' }, cache:'no-store' }); setData(await r.json()); })(); },[]);
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="flex gap-3">
        <a className="border px-3 py-1 rounded" href={(process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/admin/reports/sales.csv'}>Download Sales CSV</a>
      </div>
      {data && <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}



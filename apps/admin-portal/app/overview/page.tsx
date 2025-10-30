async function fetchOverview() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/admin/overview', { cache: 'no-store', headers: { Authorization: 'Bearer REPLACE' } });
  return res.json();
}

export default async function OverviewPage() {
  const data = await fetchOverview();
  return (
    <main className="p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <form action="#" className="flex items-center gap-2 text-sm">
        <label>Range</label>
        <select className="border px-2 py-1 rounded">
          <option>7d</option>
          <option>30d</option>
          <option>90d</option>
        </select>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border p-3 rounded"><div className="text-xs text-gray-600">Sales</div><div className="text-xl font-semibold">{data.sales}</div></div>
        <div className="border p-3 rounded"><div className="text-xs text-gray-600">Revenue</div><div className="text-xl font-semibold">{data.revenue}</div></div>
        <div className="border p-3 rounded"><div className="text-xs text-gray-600">Orders</div><div className="text-xl font-semibold">{data.orders}</div></div>
        <div className="border p-3 rounded"><div className="text-xs text-gray-600">Active Sellers</div><div className="text-xl font-semibold">{data.active_sellers}</div></div>
      </div>
      <section className="grid md:grid-cols-2 gap-3">
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Revenue (Last 7 days)</h2>
          <div className="flex items-end gap-1 h-24">
            {[12,18,7,15,22,9,14].map((v,i)=>(<div key={i} className="bg-black/70 dark:bg-white/70" style={{ width: '12%', height: `${v*3}px` }} />))}
          </div>
        </div>
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Orders (Last 7 days)</h2>
          <div className="flex items-end gap-1 h-24">
            {[4,9,3,7,12,5,8].map((v,i)=>(<div key={i} className="bg-black/70 dark:bg_white/70" style={{ width: '12%', height: `${v*8}px` }} />))}
          </div>
        </div>
      </section>
    </main>
  );
}



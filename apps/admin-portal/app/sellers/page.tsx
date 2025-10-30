async function fetchSellers() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/admin/vendors', { cache: 'no-store', headers: { Authorization: 'Bearer REPLACE' } });
  return res.json();
}

export default async function SellersPage() {
  const sellers = await fetchSellers();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Sellers</h1>
      <ul className="mt-4 grid gap-2">
        {Array.isArray(sellers) && sellers.map((s: any) => (
          <li key={s._id} className="border p-2 rounded flex justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-600">{s.slug} · {s.status}</div>
            </div>
            <form action="#"><button className="border px-3 py-1 rounded" formAction="#">Open</button></form>
          </li>
        ))}
      </ul>
    </main>
  );
}



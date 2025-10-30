export default function ExportsPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || '';
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Exports</h1>
      <div className="grid gap-2 max-w-md">
        <a className="border px-3 py-1 rounded" href={api + '/api/v1/admin/exports/products.csv'}>Download Products CSV</a>
        <a className="border px-3 py-1 rounded" href={api + '/api/v1/admin/exports/payouts.csv'}>Download Payouts CSV</a>
      </div>
    </main>
  );
}



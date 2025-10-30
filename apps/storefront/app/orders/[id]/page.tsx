async function fetchOrder(id: string) {
  const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/orders/${encodeURIComponent(id)}`, { cache: 'no-store', headers: { Authorization:'Bearer REPLACE' } });
  if (!res.ok) return null;
  return res.json();
}

export const metadata = { title: 'Order Details' } as any;

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const o = await fetchOrder(params.id);
  if (!o) return <main className="py-6">Order not found.</main>;
  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <section className="md:col-span-8 grid gap-3">
        <h1 className="text-2xl font-semibold">Order #{o._id}</h1>
        <div className="text-sm text-gray-700">Placed on {new Date(o.createdAt||Date.now()).toLocaleString()}</div>
        <div className="border rounded p-3 bg-white/90">
          <div className="font-semibold mb-2">Items</div>
          <ul className="grid gap-2">
            {(o.items||[]).map((it:any, i:number)=> (
              <li key={i} className="flex items-center justify-between text-sm">
                <div>{it.title||it.product_id}</div>
                <div>{it.qty} × {it.price} {o.currency||'INR'}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded p-3 bg-white/90">
            <div className="font-semibold mb-2">Shipping Address</div>
            <div className="text-sm text-gray-700 whitespace-pre-line">{o.shipping_address ? JSON.stringify(o.shipping_address, null, 2) : '—'}</div>
          </div>
          <div className="border rounded p-3 bg-white/90">
            <div className="font-semibold mb-2">Billing Address</div>
            <div className="text-sm text-gray-700 whitespace-pre-line">{o.billing_address ? JSON.stringify(o.billing_address, null, 2) : '—'}</div>
          </div>
        </div>
        <div className="border rounded p-3 bg-white/90">
          <div className="font-semibold mb-2">Timeline</div>
          <ul className="text-sm grid gap-1">
            <li>Payment: {o.payment_status||'unpaid'}</li>
            <li>Shipping: {o.shipping_status||'pending'} {o.tracking_id?`· Tracking ${o.tracking_id}`:''}</li>
            {(o.refunds||[]).length>0 && <li>Refunds: {(o.refunds||[]).map((r:any)=>`${r.amount}${o.currency} ${r.status}`).join(', ')}</li>}
          </ul>
        </div>
      </section>
      <aside className="md:col-span-4 border rounded p-3 h-fit sticky top-16 bg-white/90 grid gap-2">
        <div className="font-semibold">Summary</div>
        <div className="text-sm">Total: {o.total} {o.currency||'INR'}</div>
        <div className="text-sm">Tax: {o.tax||0} {o.currency||'INR'}</div>
        <div className="text-sm">Shipping: {o.shipping_fee||0} {o.currency||'INR'}</div>
      </aside>
    </main>
  );
}



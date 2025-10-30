export const metadata = { title: 'Vendor Portal' };

export default function Home() {
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Vendor Portal</h1>
      <p className="text-sm text-gray-600">Quick links</p>
      <ul className="list-disc pl-5 grid gap-1">
        <li><a className="underline" href="/products">Products</a></li>
        <li><a className="underline" href="/payouts">Payouts</a></li>
        <li><a className="underline" href="/coupons">Coupons</a></li>
        <li><a className="underline" href="/shipments">Shipments</a></li>
        <li><a className="underline" href="/support">Support Tickets</a></li>
      </ul>
    </main>
  );
}



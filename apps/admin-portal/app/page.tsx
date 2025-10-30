export const metadata = { title: 'Admin Portal' };

export default function Home() {
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Admin Portal</h1>
      <p className="text-sm text-gray-600">Quick links</p>
      <ul className="list-disc pl-5 grid gap-1">
        <li><a className="underline" href="/overview">Overview</a></li>
        <li><a className="underline" href="/sellers">Sellers</a></li>
        <li><a className="underline" href="/products">Products</a></li>
        <li><a className="underline" href="/customers">Customers</a></li>
        <li><a className="underline" href="/reviews">Reviews</a></li>
        <li><a className="underline" href="/shipping">Shipping</a></li>
        <li><a className="underline" href="/payouts">Payouts</a></li>
        <li><a className="underline" href="/webhooks">Webhooks</a></li>
        <li><a className="underline" href="/analytics">Analytics</a></li>
        <li><a className="underline" href="/themes">Themes</a></li>
        <li><a className="underline" href="/taxes">Taxes</a></li>
        <li><a className="underline" href="/broadcast">Broadcast</a></li>
        <li><a className="underline" href="/notifications">Notifications</a></li>
        <li><a className="underline" href="/reports">Reports</a></li>
      </ul>
    </main>
  );
}



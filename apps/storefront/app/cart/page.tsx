"use client";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function CartPage() {
  const items = useSelector((s: RootState) => (s as any).cart.items);
  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {items.length === 0 ? <p>Cart is empty</p> : (
        <div className="grid gap-3">
          {items.map((i: any, idx: number) => (
            <div key={idx} className="border p-3 rounded">
              <div className="font-medium">{i.title || i.productId}</div>
              <div className="text-sm">Qty: {i.qty} × {i.price}</div>
            </div>
          ))}
          <div className="font-bold">Subtotal: {subtotal}</div>
          <a className="underline" href="/checkout">Go to checkout</a>
        </div>
      )}
    </main>
  );
}



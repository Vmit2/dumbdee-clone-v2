'use client';
import { useDispatch } from 'react-redux';
import { addItem } from '@dumbdee/common-frontend/src/slices/cartSlice';

export default function AddToCartButton({ productId, title, price, variantId }:{ productId:string; title?:string; price:number; variantId?:string }) {
  const dispatch = useDispatch();
  return (
    <button
      className="border px-3 py-2 rounded"
      onClick={() => dispatch(addItem({ productId, title, price, variantId, qty: 1 }))}
    >
      Add to cart
    </button>
  );
}



"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartCount, selectSubtotal, selectItems, setItems } from '@dumbdee/common-frontend';

export default function MiniCart(){
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount as any) as number;
  const subtotal = useSelector(selectSubtotal as any) as number;
  const items = useSelector(selectItems as any) as any[];
  useEffect(()=>{ try { const saved = JSON.parse(localStorage.getItem('cartItems')||'[]'); if (Array.isArray(saved) && saved.length) dispatch(setItems(saved) as any); } catch {} },[dispatch]);
  useEffect(()=>{ try { localStorage.setItem('cartItems', JSON.stringify(items||[])); } catch {} },[items]);
  return (
    <a href="/cart" className="text-sm underline">Cart ({count}) – {subtotal.toFixed(2)}</a>
  );
}



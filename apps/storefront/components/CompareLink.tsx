'use client';
import { useEffect, useState } from 'react';

export default function CompareLink() {
  const [count, setCount] = useState(0);
  useEffect(()=>{
    function sync(){ try{ const s=JSON.parse(localStorage.getItem('compareSlugs')||'[]'); setCount(Array.isArray(s)?s.length:0); } catch { setCount(0); } }
    sync();
    const onUpdate = () => sync();
    window.addEventListener('compare:update', onUpdate);
    return ()=>window.removeEventListener('compare:update', onUpdate);
  },[]);
  return <a href="/compare" className="text-sm underline">Compare ({count})</a>;
}



'use client';
import { useEffect, useState } from 'react';

export default function PopupModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(()=>{ (async()=>{ try{ const base = process.env.NEXT_PUBLIC_API_URL || (typeof window!== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:4000` : 'http://localhost:4000'); const r=await fetch(base+'/api/v1/public/marketing/popup'); if (!r.ok) return; const j=await r.json(); if (j?.enabled && j?.message) { setMessage(j.message); setOpen(true); } } catch {} })(); },[]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={()=>setOpen(false)}>
      <div className="bg-white dark:bg-neutral-900 rounded p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2"><div className="font-semibold">Offer</div><button onClick={()=>setOpen(false)} className="text-sm">✕</button></div>
        <div className="text-sm text-gray-700 whitespace-pre-line">{message}</div>
      </div>
    </div>
  );
}



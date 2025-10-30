'use client';
import { useEffect, useMemo, useState } from 'react';

export default function QuickView({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products?slug=${encodeURIComponent(slug)}`,{ cache:'no-store' }); const j=await r.json(); setData(Array.isArray(j)?j[0]:j); })(); },[slug]);
  const images: string[] = useMemo(()=> (data?.variants?.[0]?.images || []) as string[], [data]);
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(()=>{ setActiveIdx(0); }, [slug]);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded p-4 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-semibold">Quick View</div>
          <button onClick={onClose} className="text-sm">✕</button>
        </div>
        {!data ? <div className="text-sm mt-3">Loading...</div> : (
          <div className="mt-3 grid gap-2">
            <div className="font-medium">{data.title}</div>
            <div className="text-xs text-gray-600">{data.slug}</div>
            {images[activeIdx] && <img src={images[activeIdx]} alt={data.title} className="w-full h-40 object-cover rounded" />}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src, idx)=> (
                  <button key={idx} onClick={()=>setActiveIdx(idx)} className={'w-14 h-14 rounded overflow-hidden border ' + (idx===activeIdx?'border-black':'border-transparent')}>
                    <img src={src} alt={String(idx)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="text-sm">{data.description || 'No description'}</div>
            {typeof data?.variants?.[0]?.price === 'number' && <div className="font-semibold">Price: {data.variants[0].price} {data.variants[0].currency || 'INR'}</div>}
            <a className="underline text-sm" href={`/products/${data.slug}`}>Open product</a>
          </div>
        )}
      </div>
    </div>
  );
}



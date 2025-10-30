"use client";
import { useState } from 'react';

export default function ProductGallery({ images = [] as string[] }) {
  const [idx, setIdx] = useState(0);
  const current = images[idx];
  return (
    <div className="grid gap-3">
      <div className="w-full border rounded overflow-hidden">
        {current ? (
          <img src={current} alt="Product image" className="w-full h-80 object-cover" />
        ) : (
          <div className="w-full h-80 bg-black/10" />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-auto">
          {images.map((src, i) => (
            <button key={i} onClick={()=>setIdx(i)} className={"w-16 h-16 border rounded overflow-hidden "+(i===idx?"border-black":"border-transparent")}> 
              <img src={src} alt={String(i)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



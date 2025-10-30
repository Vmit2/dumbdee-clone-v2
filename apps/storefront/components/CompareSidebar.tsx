"use client";
import { useEffect, useState } from "react";

export default function CompareSidebar() {
  const [open, setOpen] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(()=>{
    function sync(){ try { const c=JSON.parse(localStorage.getItem('compareSlugs')||'[]'); if (Array.isArray(c)) setSlugs(c); else setSlugs([]); } catch { setSlugs([]); } }
    sync();
    function onUpdate(){ sync(); }
    window.addEventListener('compare:update', onUpdate);
    const i = setInterval(sync, 3000);
    return ()=>{ window.removeEventListener('compare:update', onUpdate); clearInterval(i); };
  },[]);
  function remove(slug:string){
    const next = slugs.filter((s)=>s!==slug);
    setSlugs(next);
    localStorage.setItem('compareSlugs', JSON.stringify(next));
    window.dispatchEvent(new Event('compare:update'));
  }
  function clearAll(){
    setSlugs([]);
    localStorage.setItem('compareSlugs', JSON.stringify([]));
    window.dispatchEvent(new Event('compare:update'));
  }
  return (
    <>
      <button onClick={()=>setOpen(!open)} className="fixed bottom-4 right-4 z-40 border px-3 py-2 rounded shadow bg-white dark:bg-neutral-900">
        Compare ({slugs.length})
      </button>
      {open && (
        <aside className="fixed bottom-16 right-4 z-40 w-80 max-h-[70vh] overflow-auto border rounded bg-white dark:bg-neutral-900 p-3 grid gap-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Compare Items</div>
            <div className="flex items-center gap-2">
              <button onClick={clearAll} className="text-xs">Clear</button>
              <a className="underline text-xs" href="/compare">Open</a>
            </div>
          </div>
          {!slugs.length ? <div className="text-xs text-gray-600">No items.</div> : (
            <ul className="grid gap-2">
              {slugs.map((slug)=> (
                <li key={slug} className="border rounded p-2 flex items-center justify-between">
                  <a className="text-xs underline" href={`/products/${slug}`}>{slug}</a>
                  <button onClick={()=>remove(slug)} className="text-xs">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </>
  );
}



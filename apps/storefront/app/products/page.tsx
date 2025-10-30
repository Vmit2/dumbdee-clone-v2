"use client";
import { useEffect, useMemo, useState } from 'react';
import QuickView from '../../components/QuickView';

type Product = { _id: string; title: string; slug: string; vendor_id?: string };

export default function ProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [sortSeq, setSortSeq] = useState(false);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [quickSlug, setQuickSlug] = useState<string|undefined>();
  const [compare, setCompare] = useState<string[]>([]);

  async function load() {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (vendor) params.set('vendor', vendor);
    if (q) params.set('q', q);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (tags) params.set('tags', tags);
    if (minRating) params.set('min_rating', minRating);
    if (sortSeq) params.set('sort', 'sequence');
    params.set('limit', String(limit));
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/products?' + params.toString(), { cache: 'no-store' });
    setRows(await res.json());
  }

  useEffect(() => { (async()=>{ try { await load(); } finally { setLoading(false); } })(); }, []);

  function applyFilters(e: React.FormEvent) { e.preventDefault(); load(); }
  useEffect(()=>{ try { const c=JSON.parse(localStorage.getItem('compareSlugs')||'[]'); if (Array.isArray(c)) setCompare(c); } catch {} }, []);
  function toggleCompare(slug: string){
    try {
      const exists = compare.includes(slug);
      const next = exists ? compare.filter((s)=>s!==slug) : [slug, ...compare].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
      setCompare(next);
      localStorage.setItem('compareSlugs', JSON.stringify(next));
      window.dispatchEvent(new Event('compare:update'));
    } catch {}
  }

  if (loading) return <main className="py-4">Loading...</main>;
  return (
    <main className="py-4 grid gap-4 md:grid-cols-12">
      <aside className="md:col-span-3 border rounded p-3 h-fit sticky top-16 bg-white/90">
        <div className="font-semibold mb-2">Filters</div>
        <form onSubmit={applyFilters} className="grid gap-2">
        <input className="border px-2 py-1 rounded" placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Category ID" value={category} onChange={(e)=>setCategory(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendor} onChange={(e)=>setVendor(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border px-2 py-1 rounded" placeholder="Min Price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
            <input className="border px-2 py-1 rounded" placeholder="Max Price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Tags</label>
            <input className="border px-2 py-1 rounded" placeholder="Tags (comma-separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
            <div className="flex gap-1 text-xs">
              {['new','featured','sale'].map((t)=> (
                <button key={t} type="button" onClick={()=>setTags(Array.from(new Set((tags?tags.split(','):[]).concat([t]).map(s=>s.trim()).filter(Boolean))).join(','))} className="border px-2 py-1 rounded">{t}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span>Min rating</span>
            <input type="range" min="1" max="5" step="1" value={minRating||'1'} onChange={(e)=>setMinRating(e.target.value)} />
            <span className="text-xs">{minRating||'1'}</span>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sortSeq} onChange={(e)=>setSortSeq(e.target.checked)} /> sort by admin sequence</label>
          <div className="grid grid-cols-2 gap-2 items-center">
            <input type="number" className="border px-2 py-1 rounded" value={limit} onChange={(e)=>setLimit(Number(e.target.value)||20)} />
            <button className="border px-3 py-1 rounded">Apply</button>
          </div>
        </form>
      </aside>
      <section className="md:col-span-9 grid gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((p)=> (
            <div key={p._id} className="border p-3 rounded">
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-600">{p.slug}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={()=>toggleCompare(p.slug)} className={"px-3 py-1 rounded text-xs border " + (compare.includes(p.slug)?'bg-black text-white dark:bg-white dark:text-black':'')}>{compare.includes(p.slug)?'Remove compare':'Add compare'}</button>
                <button onClick={()=>setQuickSlug(p.slug)} className="border px-3 py-1 rounded text-xs">Quick View</button>
                <a className="underline text-xs" href={`/products/${p.slug}`}>View</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      {quickSlug && <QuickView slug={quickSlug} onClose={()=>setQuickSlug(undefined)} />}
    </main>
  );
}



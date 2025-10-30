"use client";
import { useState } from 'react';

export default function VendorMediaPage() {
  const [vendorId, setVendorId] = useState('');
  const [productId, setProductId] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [type, setType] = useState<'image'|'video'>('image');
  const [message, setMessage] = useState('');
  async function upload(){
    if (!file || !vendorId || !productId) { setMessage('Missing fields'); return; }
    try {
      const pres = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/uploads/presign?type=${type}&vendorId=${encodeURIComponent(vendorId)}&fileName=${encodeURIComponent(file.name)}&productSlug=${encodeURIComponent(productId)}`,{ headers:{ Authorization:'Bearer REPLACE' } });
      const { url, key } = await pres.json();
      const put = await fetch(url,{ method:'PUT', headers:{ 'Content-Type': file.type || (type==='video'?'video/mp4':'image/jpeg') }, body:file });
      if (!put.ok) throw new Error('upload_failed');
      // Update product to include media on first variant for demo
      await fetch((process.env.NEXT_PUBLIC_API_URL||'')+`/api/v1/products/${encodeURIComponent(productId)}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(type==='image'? { $push: { 'variants.0.images': key } } : { $push: { 'variants.0.videos': { url: key } } }) });
      setMessage('Uploaded and linked');
    } catch(e:any){ setMessage(e?.message||'error'); }
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Product Media</h1>
      <div className="grid gap-2 md:grid-cols-4 max-w-3xl">
        <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Product ID" value={productId} onChange={(e)=>setProductId(e.target.value)} />
        <select className="border px-2 py-1 rounded" value={type} onChange={(e)=>setType(e.target.value as any)}><option value="image">Image</option><option value="video">Video</option></select>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <div className="md:col-span-4"><button onClick={upload} className="border px-3 py-1 rounded">Upload & Link</button></div>
      </div>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



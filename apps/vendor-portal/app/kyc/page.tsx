"use client";
import { useState } from 'react';

export default function KycPage() {
  const [file, setFile] = useState<File | null>(null);
  const [vendorId, setVendorId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function uploadKyc() {
    if (!file || !vendorId) { setMessage("Select file and vendorId"); return; }
    try {
      const pres = await fetch((process.env.NEXT_PUBLIC_API_URL || "") + `/api/v1/uploads/presign?type=image&vendorId=${encodeURIComponent(vendorId)}&fileName=${encodeURIComponent(file.name)}`, { headers: { Authorization: 'Bearer REPLACE' } });
      if (!pres.ok) throw new Error('presign_failed');
      const { url, key } = await pres.json();
      const put = await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type || 'image/jpeg' }, body: file });
      if (!put.ok) throw new Error('upload_failed');
      await fetch((process.env.NEXT_PUBLIC_API_URL || "") + `/api/v1/uploads/notify`, { method: 'POST', headers: { Authorization: 'Bearer REPLACE' } });
      setMessage(`Uploaded KYC to ${key}`);
    } catch (e: any) {
      setMessage(e?.message || 'error');
    }
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">KYC Upload</h1>
      <label className="grid gap-1">
        <span className="text-sm">Vendor ID</span>
        <input className="border px-2 py-1 rounded" placeholder="vendorId" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      </label>
      <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadKyc} className="border px-3 py-1 rounded w-fit">Upload</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



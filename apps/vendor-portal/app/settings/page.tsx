"use client";
import { useState } from 'react';

export default function VendorSettingsPage() {
  const [vendorId, setVendorId] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<File|null>(null);
  const [banner, setBanner] = useState<File|null>(null);
  const [returnPolicy, setReturnPolicy] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [message, setMessage] = useState('');

  async function upload(file: File, type: 'image') {
    const pres = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + `/api/v1/uploads/presign?type=${type}&vendorId=${encodeURIComponent(vendorId)}&fileName=${encodeURIComponent(file.name)}`, { headers: { Authorization: 'Bearer REPLACE' } });
    const { url, key } = await pres.json();
    const put = await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type || 'image/jpeg' }, body: file });
    if (!put.ok) throw new Error('upload_failed');
    return key as string;
  }

  async function save() {
    try {
      setMessage('');
      let logoKey = undefined as string|undefined;
      let bannerKey = undefined as string|undefined;
      if (logo) logoKey = await upload(logo, 'image');
      if (banner) bannerKey = await upload(banner, 'image');
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/vendor/me', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer REPLACE' }, body: JSON.stringify({ vendor_id: vendorId, name, images: { logo: logoKey, banner: bannerKey }, policies: { return: returnPolicy, privacy: privacyPolicy } }) });
      const out = await res.json();
      setMessage('Saved');
    } catch (e:any) { setMessage(e?.message || 'error'); }
  }

  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Store Settings</h1>
      <input className="border px-2 py-1 rounded" placeholder="Vendor ID" value={vendorId} onChange={(e)=>setVendorId(e.target.value)} />
      <input className="border px-2 py-1 rounded" placeholder="Store Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <label className="grid gap-1"><span className="text-sm">Logo</span><input type="file" onChange={(e)=>setLogo(e.target.files?.[0]||null)} /></label>
      <label className="grid gap-1"><span className="text-sm">Banner</span><input type="file" onChange={(e)=>setBanner(e.target.files?.[0]||null)} /></label>
      <label className="grid gap-1"><span className="text-sm">Return Policy</span><textarea className="border px-2 py-1 rounded" rows={4} value={returnPolicy} onChange={(e)=>setReturnPolicy(e.target.value)} /></label>
      <label className="grid gap-1"><span className="text-sm">Privacy Policy</span><textarea className="border px-2 py-1 rounded" rows={4} value={privacyPolicy} onChange={(e)=>setPrivacyPolicy(e.target.value)} /></label>
      <button onClick={save} className="border px-3 py-1 rounded w-fit">Save</button>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </main>
  );
}



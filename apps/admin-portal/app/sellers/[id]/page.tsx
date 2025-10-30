async function fetchVendor(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/admin/vendors/' + id, { cache: 'no-store', headers: { Authorization: 'Bearer REPLACE' } });
  return res.json();
}
async function fetchProducts(vendorId: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/products?vendor=' + vendorId + '&limit=50', { cache: 'no-store', headers: { Authorization: 'Bearer REPLACE' } });
  return res.json();
}

export default async function VendorDetail({ params }: { params: { id: string } }) {
  const v = await fetchVendor(params.id);
  const products = await fetchProducts(params.id);
  async function save(formData: FormData){
    'use server';
    const body = {
      name: formData.get('name') || undefined,
      policies: {
        return: formData.get('return') || undefined,
        privacy: formData.get('privacy') || undefined
      }
    };
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/admin/vendors/' + params.id, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify(body) });
  }
  return (
    <main className="p-6 grid gap-3">
      <h1 className="text-2xl font-semibold">Vendor: {v?.name || params.id}</h1>
      {v?.images?.logo && <img src={v.images.logo} alt="Logo" className="w-24 h-24 object-cover rounded" />}
      {v?.images?.banner && <img src={v.images.banner} alt="Banner" className="w-full max-h-48 object-cover rounded" />}
      <form action={save} className="grid gap-2 max-w-3xl">
        <label className="grid gap-1"><span className="text-sm">Name</span><input name="name" defaultValue={v?.name||''} className="border px-2 py-1 rounded" /></label>
        <label className="grid gap-1"><span className="text-sm">Return Policy</span><textarea name="return" defaultValue={v?.policies?.return||''} className="border px-2 py-1 rounded" rows={4} /></label>
        <label className="grid gap-1"><span className="text-sm">Privacy Policy</span><textarea name="privacy" defaultValue={v?.policies?.privacy||''} className="border px-2 py-1 rounded" rows={4} /></label>
        <button className="border px-3 py-1 rounded w-fit">Save</button>
      </form>
      <section className="mt-6">
        <h2 className="font-semibold mb-2">Products ({Array.isArray(products)?products.length:0})</h2>
        <form action={async (formData: FormData)=>{ 'use server';
          const ids = (Array.isArray(products)?products:[]).filter((p:any)=> String(formData.get('sel_'+p._id))==='on').map((p:any)=>String(p._id));
          const status = String(formData.get('bulk_status')||'');
          if (ids.length && status) {
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/admin/products/bulk', { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ ids, update: { status } }) });
          }
        }} className="mb-2 flex items-center gap-2">
          <label className="text-xs flex items-center gap-1"><input type="checkbox" name="select_all" onChange={()=>{}} /> Select all</label>
          <select name="bulk_status" className="border px-2 py-1 rounded text-sm">
            <option value="">Bulk set status…</option>
            <option value="published">published</option>
            <option value="pending_approval">pending_approval</option>
            <option value="draft">draft</option>
          </select>
          <button className="border px-3 py-1 rounded text-sm">Apply</button>
        </form>
        <ul className="grid gap-2">
          {(Array.isArray(products)?products:[]).map((p:any)=> (
            <li key={p._id} className="border rounded p-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-gray-600">{p.slug} · {p.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name={"sel_"+p._id} className="h-4 w-4" />
                <form action={async ()=>{ 'use server'; await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/products/' + p._id, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:'Bearer REPLACE' }, body: JSON.stringify({ status: p.status==='published'?'pending_approval':'published' }) }); }}>
                  <button className="border px-3 py-1 rounded text-xs">{p.status==='published'?'Unpublish':'Publish'}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var root = document.currentScript && document.currentScript.parentElement;
              if (!root) return;
              var selAll = root.querySelector('input[name="select_all"]');
              if (!selAll) return;
              selAll.addEventListener('change', function(){
                var boxes = root.querySelectorAll('input[type="checkbox"][name^="sel_"]');
                for (var i=0;i<boxes.length;i++) { (boxes[i] as HTMLInputElement).checked = (selAll as HTMLInputElement).checked; }
              });
            } catch {}
          })();
        ` }} />
      </section>
    </main>
  );
}



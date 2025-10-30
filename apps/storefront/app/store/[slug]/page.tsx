async function fetchVendor(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/public/vendors/" + encodeURIComponent(slug), { cache: "no-store" });
  return res.json();
}
async function fetchProducts(vendorId: string, search='') {
  const qs = new URLSearchParams();
  qs.set('vendor', vendorId);
  if (search) qs.set('q', search);
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/public/products?"+qs.toString(), { cache: "no-store" });
  return res.json();
}
export default async function StorePage({ params, searchParams }: { params: { slug: string }, searchParams: { q?: string } }) {
  const vendor = await fetchVendor(params.slug);
  const products = vendor?._id ? await fetchProducts(vendor._id, searchParams?.q||'') : [];
  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <section className="md:col-span-12">
        <h1 className="text-2xl font-semibold">{vendor?.name || params.slug}</h1>
        {vendor?.images?.banner && <div className="mt-2"><img src={vendor.images.banner} alt="Banner" className="w-full max-h-48 object-cover rounded" /></div>}
      </section>
      <aside className="md:col-span-3 border rounded p-3 h-fit sticky top-16 bg-white/90">
        <div className="font-semibold mb-2">About Store</div>
        {vendor?.policies?.return && <div className="text-xs text-gray-700 mb-2"><div className="font-semibold">Returns</div><p className="whitespace-pre-line">{vendor.policies.return}</p></div>}
        {vendor?.policies?.privacy && <div className="text-xs text-gray-700"><div className="font-semibold">Privacy</div><p className="whitespace-pre-line">{vendor.policies.privacy}</p></div>}
      </aside>
      <section className="md:col-span-9 grid gap-3">
        <form className="flex items-center gap-2" action="">
          <input name="q" defaultValue={searchParams?.q||''} className="border px-2 py-1 rounded flex-1" placeholder="Search in this store" />
          <button className="border px-3 py-1 rounded">Search</button>
        </form>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.isArray(products) && products.map((p:any)=> (
            <a key={p._id} href={`/products/${p.slug}`} className="border p-2 rounded text-sm">
              <div className="font-medium line-clamp-2">{p.title}</div>
              <div className="text-xs text-gray-600">{p.slug}</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

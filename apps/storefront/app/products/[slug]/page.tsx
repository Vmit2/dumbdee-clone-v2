import AddToCompare from '../../../components/AddToCompare';
import ProductReviews from '../../../components/ProductReviews';
import ProductGallery from '../../../components/ProductGallery';
import BuyBox from '../../../components/BuyBox';

async function fetchProduct(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/products?slug=" + encodeURIComponent(slug), { cache: "no-store" });
  const arr = await res.json();
  return Array.isArray(arr) ? arr[0] : arr;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  const title = product?.seo?.title || product?.title || 'Product';
  const description = product?.seo?.description || 'Buy this product';
  const images = (product?.variants?.[0]?.images || []).slice(0, 1);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images
    },
    alternates: { canonical: `/products/${params.slug}` }
  } as any;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  const variant = product?.variants?.[0];
  const video = variant?.videos?.[0];
  async function fetchRelated() {
    const qs = new URLSearchParams();
    if (Array.isArray(product?.tags) && product.tags.length) qs.set('tags', product.tags.slice(0,3).join(','));
    if (product?.vendor_id) qs.set('vendor', product.vendor_id);
    qs.set('limit','8');
    const r = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/public/products?' + qs.toString(), { cache: 'no-store' });
    return r.json();
  }
  const related = product?._id ? await fetchRelated() : [];
  return (
    <main className="py-6 grid gap-6 md:grid-cols-12">
      <div className="md:col-span-8 grid gap-4">
        <h1 className="text-2xl font-semibold">{product?.title}</h1>
        <script dangerouslySetInnerHTML={{ __html: `
          try { const k='recentProducts'; const s=JSON.parse(localStorage.getItem(k)||'[]'); const slug='${params.slug}'; const next=[slug,...s.filter((x)=>x!==slug)].slice(0,10); localStorage.setItem(k, JSON.stringify(next)); } catch {}
        ` }} />
        <ProductGallery images={(product?.variants?.[0]?.images||[]) as any} />
        <div>
          <AddToCompare slug={params.slug} />
        </div>
        <section>
          <div className="text-sm whitespace-pre-line">{product?.description || 'No description provided.'}</div>
        </section>
        {Array.isArray(related) && related.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Related products</h2>
            <div className="flex gap-3 overflow-auto">
              {related.filter((p:any)=>p.slug!==product.slug).slice(0,8).map((p:any)=> (
                <a key={p._id} href={`/products/${p.slug}`} className="min-w-[180px] border rounded p-2 text-sm">{p.title}</a>
              ))}
            </div>
          </section>
        )}
        {product?._id && <ProductReviews productId={product._id} />}
      </div>
      <div className="md:col-span-4">
        {product?._id && <BuyBox productId={product._id} title={product.title} price={variant?.price || 0} currency={variant?.currency||'INR'} />}
      </div>
    </main>
  );
}

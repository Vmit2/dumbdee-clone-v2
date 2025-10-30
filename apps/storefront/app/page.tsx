export const metadata = {
  title: 'Home — Storefront',
  description: 'Discover products from top vendors',
  openGraph: { title: 'Home — Storefront', description: 'Discover products from top vendors', type: 'website' }
};

import ProductCard from '../components/ProductCard';
import HomeRecent from '../components/HomeRecent';
import HomeWishlist from '../components/HomeWishlist';
async function fetchFeaturedProducts() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(base + '/api/v1/public/featured', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}
async function fetchTrendingProducts() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(base + '/api/v1/public/trending', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default async function Home() {
  const products = await fetchFeaturedProducts();
  const trending = await fetchTrendingProducts();
  return (
    <main className="grid gap-6 max-w-full overflow-x-hidden">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className={(process.env.NEXT_PUBLIC_THEME_ID? '':'')+" h-full w-full "+"bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-400"}></div>
        </div>
        <div className="relative px-6 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-semibold text-white">Discover. Compare. Shop smarter.</h1>
          <p className="mt-3 max-w-2xl text-white/90">All your favorite brands and sellers in one beautiful marketplace, powered by fast checkout and flexible shipping.</p>
          <div className="mt-6 flex items-center gap-3">
            <a href="/products" className="rounded bg-white/90 text-black px-4 py-2 text-sm font-medium">Start shopping</a>
            <a href="/store/dummy-vendor" className="rounded border border-white/60 text-white px-4 py-2 text-sm">Explore stores</a>
          </div>
        </div>
      </section>
      {Array.isArray(products) && products.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Featured</h2>
          <div className="w-full overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory">
            <div className="flex gap-3 w-max">
            {products.map((p:any)=> (
              <div key={p._id} className="min-w-[220px] shrink-0 snap-start">
                <ProductCard p={p} />
              </div>
            ))}
            </div>
          </div>
        </section>
      )}
      {Array.isArray(trending) && trending.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Trending</h2>
          <div className="w-full overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory">
            <div className="flex gap-3 w-max">
            {trending.map((p:any)=> (
              <div key={p._id} className="min-w-[180px] shrink-0 snap-start">
                <ProductCard p={p} />
              </div>
            ))}
            </div>
          </div>
        </section>
      )}
      {/* Client-side sections */}
      {/* @ts-expect-error async server importing client */}
      <HomeRecent />
      {/* @ts-expect-error async server importing client */}
      <HomeWishlist />
    </main>
  );
}

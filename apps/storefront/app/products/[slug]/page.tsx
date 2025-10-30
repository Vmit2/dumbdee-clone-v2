async function fetchProduct(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/products?slug=" + encodeURIComponent(slug), { cache: "no-store" });
  const arr = await res.json();
  return Array.isArray(arr) ? arr[0] : arr;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  const variant = product?.variants?.[0];
  const video = variant?.videos?.[0];
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{product?.title}</h1>
      {video ? (
        <video controls poster={video.poster} className="w-full max-w-2xl mt-4">
          <source src={video.url} type="video/mp4" />
        </video>
      ) : (
        <p className="text-sm text-gray-600 mt-2">No video available.</p>
      )}
      {/* Add to Cart */}
      <div className="mt-4">
        {/* @ts-expect-error async server component embedding client */}
        {product?._id && <(await import('../../../components/AddToCartButton')).default productId={product._id} title={product.title} price={variant?.price || 0} />}
      </div>
    </main>
  );
}

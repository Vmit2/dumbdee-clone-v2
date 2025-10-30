async function fetchWishlist() {
  // Requires auth token; for now, return empty to avoid 401 in demo
  return { items: [] };
}

export default async function WishlistPage() {
  const wl = await fetchWishlist();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <pre className="text-xs bg-gray-50 p-3 rounded mt-2">{JSON.stringify(wl, null, 2)}</pre>
    </main>
  );
}



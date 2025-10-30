async function fetchVendor(slug: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/admin/vendors?slug=" + encodeURIComponent(slug), { cache: "no-store" });
  return res.json();
}
export default async function StorePage({ params }: { params: { slug: string } }) {
  const vendor = await fetchVendor(params.slug);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Store: {vendor?.name || params.slug}</h1>
    </main>
  );
}

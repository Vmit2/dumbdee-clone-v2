async function fetchPosts() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/public/posts', { cache: 'no-store' });
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <main className="py-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        {Array.isArray(posts) && posts.map((p:any) => (
          <a key={p.slug} href={`/blog/${p.slug}`} className="border rounded p-3 bg-white/90 hover:shadow text-sm">
            <div className="font-semibold text-base mb-1 line-clamp-2">{p.title}</div>
            <div className="text-gray-600 line-clamp-3">{p.excerpt}</div>
            <div className="text-xs text-gray-500 mt-2">{new Date(p.published_at||Date.now()).toLocaleDateString()}</div>
          </a>
        ))}
      </div>
    </main>
  );
}



import Link from 'next/link';
import { api } from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/common/Pagination';
import Breadcrumbs from '@/components/common/Breadcrumbs';

// ============================================================
// صفحه‌ی وبلاگ — دومین اولویت سئوی این پروژه بعد از صفحه‌ی محصول.
// Server Component، متادیتای کامل، و لینک‌دهی داخلی به مقالات.
// ============================================================

export const metadata = {
  title: 'مجله نوبلا | آموزش، مقایسه و راهنمای خرید قطعات کامپیوتر',
  description: 'جدیدترین مقالات آموزشی، مقایسه‌ی محصولات، و راهنمای خرید قطعات کامپیوتر و گجت از تیم تحریریه‌ی تک‌نبولا.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const params = new URLSearchParams({ page: String(page), limit: '9' });
  if (sp.category) params.set('category', sp.category);

  const data = await api.getBlogPosts(`?${params.toString()}`).catch(() => ({ posts: [], total: 0, totalPages: 1 }));
  const posts = data.posts || [];
  const totalPages = data.totalPages || 1;

  // لیست دسته‌بندی‌های مقالات از خود پست‌های همین صفحه استخراج میشه
  // (چون بک‌اند مدل جدای category برای بلاگ نداره، دقیقاً مثل محصولات)
  const categories = [...new Set(posts.map(p => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-4">
        <Breadcrumbs items={[{ name: 'خانه', href: '/' }, { name: 'مجله', href: '/blog' }]} />
      </div>

      <h1 className="text-2xl font-bold text-ink mb-2">مجله نوبلا</h1>
      <p className="text-ash text-sm mb-6">آموزش، مقایسه و راهنمای خرید — نوشته‌شده توسط کارشناسان سخت‌افزار</p>

      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <Link href="/blog" className={`text-xs px-3 py-1.5 rounded-full transition ${!sp.category ? 'bg-grape text-white' : 'bg-panel text-ash hover:text-ink'}`}>
            همه
          </Link>
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`text-xs px-3 py-1.5 rounded-full transition ${sp.category === cat ? 'bg-grape text-white' : 'bg-panel text-ash hover:text-ink'}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-ash text-sm py-10 text-center">مقاله‌ای پیدا نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import { formatDate } from '@/lib/format';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ArticleContent, { extractHeadings } from '@/components/blog/ArticleContent';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogCard from '@/components/blog/BlogCard';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technubela.example.com';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

// ============================================================
// صفحه‌ی مقاله — طبق خواسته‌ی شما، سئوش با دقت کامل رعایت شده:
// - متادیتای کامل + canonical + Open Graph نوع "article"
// - JSON-LD از نوع Article (نویسنده، تاریخ انتشار/ویرایش، تصویر)
// - JSON-LD Breadcrumb
// - ساختار semantic (h1 برای عنوان، h2 برای زیرعنوان‌ها)
// - فهرست مطالب لینک‌دار (کمک به دسترسی‌پذیری و dwell time)
// - لینک‌دهی داخلی به مقالات مرتبط و محصولات دسته‌ی مرتبط
// ============================================================

async function getPostSafe(slug) {
  try {
    const data = await api.getBlogPost(slug);
    return data.post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostSafe(slug);
  if (!post) return {};

  const image = post.image ? `${SITE_URL}${post.image}` : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: image ? [image] : [],
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author?.name].filter(Boolean),
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostSafe(slug);
  if (!post) notFound();

  const relatedData = await api.getBlogPosts(`?category=${encodeURIComponent(post.category)}&limit=4`).catch(() => ({ posts: [] }));
  const related = (relatedData.posts || []).filter(p => p.slug !== post.slug).slice(0, 3);

  const headings = extractHeadings(post.content);
  const articleJsonLd = buildArticleJsonLd(post, SITE_URL);
  const breadcrumbItems = [
    { name: 'خانه', href: '/' },
    { name: 'مجله', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems, SITE_URL);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0 max-w-3xl">
          <span className="text-xs text-lagoon">{post.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-ink mt-2 mb-4 leading-10">{post.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-grape flex items-center justify-center text-white text-sm font-bold shrink-0">
              {post.author?.avatar || 'ت'}
            </div>
            <div>
              <p className="text-sm text-ink">{post.author?.name}</p>
              <p className="text-xs text-ash-dark">{post.author?.role} · {formatDate(post.date)} · {post.readTime?.toLocaleString('fa-IR')} دقیقه مطالعه</p>
            </div>
          </div>

          {post.image && (
            <img src={`${API_BASE}${post.image}`} alt={post.title} className="w-full aspect-video object-cover rounded-card mb-6" />
          )}

          <p className="text-ash text-base leading-8 mb-6 border-r-2 border-grape pr-4">{post.excerpt}</p>

          <ArticleContent blocks={post.content} />

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-line">
              {post.tags.map((tag , i) => (
                <span key={i} className="text-xs bg-card text-ash px-3 py-1.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-line">
            <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
          </div>
        </article>

        {/* فهرست مطالب — فقط دسکتاپ */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 bg-panel border border-line rounded-card p-4">
              <h2 className="text-xs font-bold text-ink mb-3">فهرست مطالب</h2>
              <ul className="space-y-2">
                {headings.map(h => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-xs text-ash hover:text-ink transition line-clamp-2">{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-lg font-bold text-ink mb-4">مقالات مرتبط</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map(p => <BlogCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

import { api } from '@/lib/api';
import { ALL_CATEGORIES } from '@/lib/categories';
import { productUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technubela.example.com';

// ============================================================
// sitemap.xml خودکار — Next.js از روی این فایل، آدرس
// /sitemap.xml رو خودش می‌سازه (نیازی به فایل استاتیک نیست).
// ⚠️ اگه تعداد محصولات/مقالات خیلی زیاد بشه (چند هزارتا)، بهتره
// این فایل رو به چند sitemap تقسیم کنی (generateSitemaps) —
// برای الان که کاتالوگ در حد یه فروشگاه معمولیه، یه فایل کافیه.
// ============================================================

export default async function sitemap() {
  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const categoryPages = ALL_CATEGORIES.map(c => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  let productPages = [];
  let blogPages = [];

  try {
    const productsData = await api.getProducts('?limit=1000');
    productPages = (productsData.products || []).map(p => ({
      url: `${SITE_URL}${productUrl(p)}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // اگه بک‌اند در دسترس نبود، فقط صفحات ثابت توی سایت‌مپ می‌مونن
  }

  try {
    const blogData = await api.getBlogPosts('?limit=1000');
    blogPages = (blogData.posts || []).map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedDate || p.date,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
  } catch {
    // همون‌طور
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}

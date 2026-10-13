// ============================================================
// ابزارهای سئو
// ------------------------------------------------------------
// نکته‌ی مهم: مدل Product توی بک‌اند فیلد slug نداره (برخلاف
// BlogPost که داره)، و طبق خواسته‌ی شما بک‌اند رو تغییر ندادیم.
// برای اینکه لینک محصولات هم برای سئو خوانا باشه (نه فقط یه
// ObjectId بی‌معنی)، از ترفند "id + اسلاگ توی یه بخش از URL"
// استفاده کردیم:
//
//   /products/64f1a2b3c4d5e6f7a8b9c0d1-rtx-4090-24gb
//
// چون ObjectId مونگو همیشه دقیقاً ۲۴ کاراکتر هگزادسیمال هست،
// می‌تونیم همیشه ۲۴ کاراکتر اول رو جدا کنیم و به بک‌اند بدیم؛
// بقیه‌ی رشته فقط برای زیبایی/سئوی URL هست و در واقع خونده
// نمیشه. این یعنی هیچ تغییری توی بک‌اند لازم نیست.
// ============================================================

const MONGO_ID_LENGTH = 24;

/** تبدیل یه متن فارسی/انگلیسی به اسلاگ URL-friendly */
export function slugify(text = '') {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    // حروف فارسی، انگلیسی، عدد و خط تیره رو نگه دار، بقیه حذف
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** ساخت URL کامل محصول (برای Link ها و og:url) */
export function productUrl(product) {
  if (!product) return '/products';
  const slug = slugify(product.name);
  return `/products/${product.id}${slug ? `-${slug}` : ''}`;
}

/** استخراج id واقعی محصول از پارامتر URL (که ممکنه id+اسلاگ باشه) */
export function extractProductId(param) {
  if (!param) return '';
  return param.slice(0, MONGO_ID_LENGTH);
}

/** JSON-LD برای صفحه‌ی محصول (schema.org/Product) — برای نمایش قیمت/موجودی/امتیاز توی نتایج گوگل */
export function buildProductJsonLd(product, siteUrl) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.desc,
    image: product.images?.map(img => `${siteUrl}${img}`) || [],
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl}${productUrl(product)}`,
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating || 0,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

/** JSON-LD برای صفحه‌ی مقاله (schema.org/Article) */
export function buildArticleJsonLd(post, siteUrl) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [`${siteUrl}${post.image}`] : [],
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: { '@type': 'Person', name: post.author?.name || 'تیم تحریریه' },
    publisher: {
      '@type': 'Organization',
      name: 'technubela',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
  };
}

/** JSON-LD برای مسیر ناوبری (Breadcrumb) — به گوگل کمک می‌کنه ساختار سایت رو بفهمه */
export function buildBreadcrumbJsonLd(items, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  };
}

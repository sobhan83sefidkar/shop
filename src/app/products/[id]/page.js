import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { extractProductId, productUrl, buildProductJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import { categoryLabel } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import StarRating from '@/components/common/StarRating';
import ProductGallery from '@/components/product/ProductGallery';
import ProductSpecs from '@/components/product/ProductSpecs';
import AddToCartBox from '@/components/product/AddToCartBox';
import ReviewsSection from '@/components/product/ReviewsSection';
import RelatedProducts from '@/components/product/RelatedProducts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technubela.example.com';

// ============================================================
// صفحه‌ی جزئیات محصول
// ------------------------------------------------------------
// این صفحه از نظر سئو مهم‌ترین صفحه‌ی فروشگاهه: متادیتای کامل،
// JSON-LD محصول (قیمت/موجودی/امتیاز برای Rich Results گوگل)،
// و JSON-LD Breadcrumb. همه‌چیز سمت سرور رندر میشه.
// ============================================================

async function getProductSafe(param) {
  try {
    const id = extractProductId(param);
    const data = await api.getProduct(id);
    return data.product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductSafe(id);
  if (!product) return {};

  const description = product.desc?.slice(0, 155) || `خرید ${product.name} با بهترین قیمت و گارانتی اصالت`;
  const image = product.images?.[0] ? `${SITE_URL}${product.images[0]}` : undefined;

  return {
    title: `${product.name} | قیمت و خرید`,
    description,
    alternates: { canonical: productUrl(product) },
    openGraph: {
      title: product.name,
      description,
      images: image ? [image] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductSafe(id);
  if (!product) notFound();

  // نظرات و محصولات مرتبط رو موازی می‌گیریم
  const [reviewsData, relatedData] = await Promise.allSettled([
    api.getProductReviews(product.id),
    api.getProducts(`?category=${product.category}&limit=8`),
  ]);

  const reviews = reviewsData.status === 'fulfilled'
    ? (reviewsData.value.reviews || []).filter(r => r.status === 'approved' || !r.status)
    : [];
  const related = relatedData.status === 'fulfilled'
    ? (relatedData.value.products || []).filter(p => p.id !== product.id).slice(0, 4)
    : [];

  const breadcrumbItems = [
    { name: 'خانه', href: '/' },
    { name: categoryLabel(product.category), href: `/category/${product.category}` },
    { name: product.name, href: productUrl(product) },
  ];

  const productJsonLd = buildProductJsonLd(product, SITE_URL);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems, SITE_URL);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs text-ash-dark">{product.brand}</span>
          <h1 className="text-xl md:text-2xl font-bold text-ink leading-8">{product.name}</h1>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} showValue />
              <span className="text-xs text-ash-dark">({product.reviewCount.toLocaleString('fa-IR')} نظر)</span>
            </div>
          )}
          <p className="text-sm text-ash leading-7 whitespace-pre-line">{product.desc}</p>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <AddToCartBox product={product} />
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductSpecs specs={product.specs} />
          <ReviewsSection productId={product.id} initialReviews={reviews} />
        </div>
        <div className="lg:col-span-1">
          {/* جای مناسب برای بنر تبلیغاتی/گارانتی توی دسکتاپ، اگه لازم شد */}
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}

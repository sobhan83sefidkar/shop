import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { buildProductQuery } from '@/lib/buildProductQuery';
import { ALL_CATEGORIES, categoryLabel } from '@/lib/categories';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductToolbar from '@/components/product/ProductToolbar';
import ActiveFilters from '@/components/product/ActiveFilters';
import Pagination from '@/components/common/Pagination';
import Breadcrumbs from '@/components/common/Breadcrumbs';

// ============================================================
// صفحه‌ی دسته‌بندی — مثلاً /category/gpu
// ------------------------------------------------------------
// چون تعداد دسته‌ها ثابت و کمه (لیست توی lib/categories.js)،
// با generateStaticParams صفحاتش از قبل توی build ساخته میشن
// (سریع‌تر + بهتر برای سئو نسبت به رندر کاملاً داینامیک).
// ============================================================

export async function generateStaticParams() {
  return ALL_CATEGORIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = ALL_CATEGORIES.find(c => c.slug === slug);
  if (!category) return {};

  return {
    title: `خرید ${category.label} | قیمت روز و مشخصات فنی`,
    description: `بهترین قیمت خرید ${category.label} با گارانتی اصالت و ارسال سریع. مقایسه و فیلتر بر اساس برند و قیمت در فروشگاه تک‌نبولا.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = ALL_CATEGORIES.find(c => c.slug === slug);
  if (!category) notFound();

  const query = buildProductQuery(sp, { category: slug });
  const [productsData, facetsData] = await Promise.allSettled([
    api.getProducts(query),
    api.getProductFacets(`?category=${slug}`),
  ]);

  const products = productsData.status === 'fulfilled' ? (productsData.value.products || []) : [];
  const total = productsData.status === 'fulfilled' ? (productsData.value.total ?? products.length) : 0;
  const totalPages = productsData.status === 'fulfilled' ? (productsData.value.totalPages ?? 1) : 1;
  const facets = facetsData.status === 'fulfilled' ? facetsData.value : { brands: [] };
  const page = Number(sp.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-4">
        <Breadcrumbs items={[{ name: 'خانه', href: '/' }, { name: category.label, href: `/category/${slug}` }]} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{category.icon}</span>
        <h1 className="text-xl md:text-2xl font-bold text-ink">{category.label}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <FilterSidebar facets={facets} lockedCategory={slug} />
          </Suspense>
        </div>

        <div className="flex-1 min-w-0">
          <Suspense fallback={null}>
            <ProductToolbar total={total} facets={facets} lockedCategory={slug} />
            <ActiveFilters lockedCategory={slug} />
          </Suspense>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-panel border border-line rounded-card">
              <div className="text-5xl mb-4">{category.icon}</div>
              <p className="text-ink font-bold mb-1">فعلاً محصولی توی این دسته‌بندی نیست</p>
              <p className="text-sm text-ash">به‌زودی محصولات جدید اضافه میشه.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

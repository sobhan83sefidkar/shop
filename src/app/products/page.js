import { Suspense } from 'react';
import { api } from '@/lib/api';
import { buildProductQuery } from '@/lib/buildProductQuery';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductToolbar from '@/components/product/ProductToolbar';
import ActiveFilters from '@/components/product/ActiveFilters';
import Pagination from '@/components/common/Pagination';
import Breadcrumbs from '@/components/common/Breadcrumbs';

// این چهارتا کامپوننت از useSearchParams استفاده می‌کنن، برای همین
// طبق قوانین Next.js باید داخل <Suspense> رندر بشن وگرنه build ارور میده.

// ============================================================
// صفحه‌ی «همه محصولات» — Server Component
// ------------------------------------------------------------
// دیتا سمت سرور گرفته میشه (fetch مستقیم توی همین فایل، قبل از
// رندر) که هم برای سئو بهتره (گوگل بدون اجرای جاوااسکریپت هم
// محتوا رو می‌بینه) هم برای سرعت اولین نمایش.
// فیلترها (FilterSidebar) خودشون Client Component هستن و از
// روی همین URL که سرور استفاده کرده، وضعیت انتخاب‌شده رو می‌خونن.
// ============================================================

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const title = sp.search ? `نتایج جستجو برای «${sp.search}»` : 'همه محصولات';
  return {
    title,
    description: 'مرور و خرید انواع قطعات کامپیوتر، لپ‌تاپ، جانبی و گجت با فیلتر پیشرفته بر اساس برند، قیمت و دسته‌بندی.',
    // صفحات فیلترشده رو از ایندکس گوگل کنار می‌ذاریم تا محتوای تکراری ایجاد نشه؛
    // فقط خودِ صفحه‌ی پایه‌ی /products ایندکس میشه.
    robots: Object.keys(sp).length > 0 ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const query = buildProductQuery(sp);

  // fetch محصولات و facet ها (برای گزینه‌های فیلتر) به‌صورت موازی
  const [productsData, facetsData] = await Promise.allSettled([
    api.getProducts(query),
    api.getProductFacets(sp.category ? `?category=${sp.category}` : ''),
  ]);

  const products = productsData.status === 'fulfilled' ? (productsData.value.products || []) : [];
  const total = productsData.status === 'fulfilled' ? (productsData.value.total ?? products.length) : 0;
  const totalPages = productsData.status === 'fulfilled' ? (productsData.value.totalPages ?? 1) : 1;
  const facets = facetsData.status === 'fulfilled' ? facetsData.value : { brands: [] };
  const page = Number(sp.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-4">
        <Breadcrumbs items={[{ name: 'خانه', href: '/' }, { name: 'همه محصولات', href: '/products' }]} />
      </div>

      <h1 className="text-xl md:text-2xl font-bold text-ink mb-6">
        {sp.search ? `نتایج جستجو برای «${sp.search}»` : 'همه محصولات'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <FilterSidebar facets={facets} />
          </Suspense>
        </div>

        <div className="flex-1 min-w-0">
          <Suspense fallback={null}>
            <ProductToolbar total={total} facets={facets} />
            <ActiveFilters />
          </Suspense>

          {products.length === 0 ? (
            <EmptyState />
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

function EmptyState() {
  return (
    <div className="text-center py-20 bg-panel border border-line rounded-card">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-ink font-bold mb-1">محصولی با این فیلترها پیدا نشد</p>
      <p className="text-sm text-ash">فیلترها رو تغییر بده یا کلمه‌ی جستجوی دیگه‌ای امتحان کن.</p>
    </div>
  );
}

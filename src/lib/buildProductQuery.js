// ============================================================
// تبدیل searchParams صفحه به query string برای api.getProducts
// (هم توی /products و هم /category/[slug] استفاده میشه تا
// منطق فیلتر یه‌جا نگه داشته بشه)
// ============================================================
export function buildProductQuery(searchParams, { category, limit = 24 } = {}) {
  const params = new URLSearchParams();

  const categoryValue = category || searchParams.category;
  if (categoryValue) params.set('category', categoryValue);
  if (searchParams.brand) params.set('brand', searchParams.brand);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
  if (searchParams.minRating) params.set('minRating', searchParams.minRating);
  if (searchParams.inStock) params.set('inStock', searchParams.inStock);
  if (searchParams.isNew) params.set('isNew', searchParams.isNew);
  // if (searchParams.isBestseller) params.set('isBestseller', searchParams.isBestseller);
  if (searchParams.onSale) params.set('onSale', searchParams.onSale);
  if (searchParams.search) params.set('search', searchParams.search);
  params.set('sort', searchParams.sort || 'newest');
  params.set('page', searchParams.page || '1');
  params.set('limit', String(limit));

  return `?${params.toString()}`;
}

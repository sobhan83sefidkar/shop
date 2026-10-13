'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { categoryLabel } from '@/lib/categories';
import { formatPrice } from '@/lib/format';

// ردیف چیپ‌های فیلتر فعال — شفافیت کامل به کاربر که الان دقیقاً
// چی فیلتر شده، با امکان حذف تکی هر فیلتر.
export default function ActiveFilters({ lockedCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips = [];

  if (!lockedCategory) {
    (searchParams.get('category')?.split(',').filter(Boolean) || []).forEach(c =>
      chips.push({ key: 'category', value: c, label: categoryLabel(c) })
    );
  }
  (searchParams.get('brand')?.split(',').filter(Boolean) || []).forEach(b =>
    chips.push({ key: 'brand', value: b, label: b })
  );
  if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    chips.push({
      key: 'price', value: '__price__',
      label: `قیمت: ${min ? formatPrice(min) : '۰'} تا ${max ? formatPrice(max) : '∞'}`,
    });
  }
  if (searchParams.get('minRating')) chips.push({ key: 'minRating', value: '__rating__', label: `${searchParams.get('minRating')}★ به بالا` });
  if (searchParams.get('inStock') === 'true') chips.push({ key: 'inStock', value: '__stock__', label: 'فقط موجود' });
  if (searchParams.get('isNew') === 'true') chips.push({ key: 'isNew', value: '__new__', label: 'جدید' });
  if (searchParams.get('onSale') === 'true')chips.push({key: 'onSale',value: '__sale__',label: 'فقط تخفیف‌دار'});
  if (searchParams.get('search')) chips.push({ key: 'search', value: '__search__', label: `جستجو: ${searchParams.get('search')}` });

  if (chips.length === 0) return null;

  function removeChip(chip) {
    const params = new URLSearchParams(searchParams.toString());
    if (chip.key === 'category' || chip.key === 'brand') {
      const list = (params.get(chip.key)?.split(',').filter(Boolean) || []).filter(v => v !== chip.value);
      if (list.length) params.set(chip.key, list.join(',')); else params.delete(chip.key);
    } else if (chip.key === 'price') {
      params.delete('minPrice'); params.delete('maxPrice');
    } else {
      params.delete(chip.key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(chip => (
        <button
          key={`${chip.key}-${chip.value}`}
          onClick={() => removeChip(chip)}
          className="flex items-center gap-1.5 bg-card border border-line text-xs text-ink px-3 py-1.5 rounded-full hover:border-ember transition"
        >
          {chip.label} <span className="text-ash-dark">✕</span>
        </button>
      ))}
    </div>
  );
}

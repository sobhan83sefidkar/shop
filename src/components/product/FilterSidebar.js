'use client';
// ============================================================
// فیلتر محصولات — مهم‌ترین بخش UX این پروژه طبق خواسته‌ی کارفرما
// ------------------------------------------------------------
// طراحی:
// - همه‌ی فیلترها توی URL query string ذخیره میشن (نه state
//   داخلی تنها) → یعنی کاربر می‌تونه لینک نتیجه‌ی فیلترشده رو
//   کپی/شیر کنه، دکمه‌ی back مرورگر درست کار می‌کنه، و گوگل هم
//   می‌تونه صفحات فیلترشده رو (در صورت نیاز) ایندکس کنه.
// - تغییر هر فیلتر بلافاصله اعمال میشه (بدون دکمه‌ی «اعمال فیلتر»)
//   بجز محدوده‌ی قیمت که یه دکمه‌ی اعمال داره (چون تایپ عددی
//   نباید هر keystroke یه navigation جدید بسازه).
// - ردیف «فیلترهای فعال» بالای نتایج (توی خود صفحه‌ی products،
//   نه اینجا) با dismiss chip، شفافیت کامل به کاربر میده که
//   الان دقیقاً چی فیلتر شده.
// ============================================================

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CATEGORY_GROUPS } from '@/lib/categories';
import { formatPrice } from '@/lib/format';

const PRICE_PRESETS = [
  { label: 'زیر ۵ میلیون', min: '', max: '5000000' },
  { label: '۵ تا ۲۰ میلیون', min: '5000000', max: '20000000' },
  { label: '۲۰ تا ۵۰ میلیون', min: '20000000', max: '50000000' },
  { label: 'بالای ۵۰ میلیون', min: '50000000', max: '' },
];

export default function FilterSidebar({ facets, lockedCategory, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = lockedCategory ? [lockedCategory] : (searchParams.get('category')?.split(',').filter(Boolean) || []);
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const inStockOnly = searchParams.get('inStock') === 'true';
  const isNewOnly = searchParams.get('isNew') === 'true';
  const onSaleOnly = searchParams.get('onSale') === 'true';
  const minRating = searchParams.get('minRating') || '';

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // تابع عمومی برای آپدیت یه پارامتر توی URL (و برگردوندن page به ۱)
  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || value === false) params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleInList(key, value, currentList) {
    const next = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value];
    updateParam(key, next.join(','));
  }

  function applyPriceRange(min = minPrice, max = maxPrice) {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
    setMinPrice(''); setMaxPrice('');
  }

  const hasActiveFilters = selectedCategories.length > (lockedCategory ? 1 : 0) || selectedBrands.length || inStockOnly || onSaleOnly || isNewOnly || minRating || minPrice || maxPrice;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {hasActiveFilters && (
        <button onClick={clearAll} className="text-xs text-ember hover:underline">
          ✕ پاک کردن همه‌ی فیلترها
        </button>
      )}

      {/* دسته‌بندی — فقط وقتی lockedCategory نداریم نشون بده (توی صفحه‌ی دسته، خودِ دسته مشخصه) */}
      {!lockedCategory && (
        <FilterSection title="دسته‌بندی">
          <div className="max-h-64 overflow-y-auto space-y-3 pl-1">
            {CATEGORY_GROUPS.map(group => (
              <div key={group.label}>
                <p className="text-[11px] text-ash-dark mb-1">{group.label}</p>
                {group.items.map(item => (
                  <CheckboxRow
                    key={item.slug}
                    label={item.label}
                    checked={selectedCategories.includes(item.slug)}
                    onChange={() => toggleInList('category', item.slug, selectedCategories)}
                  />
                ))}
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {/* برند — از facets که سرور بر اساس محصولات موجود محاسبه کرده */}
      {facets?.brands?.length > 0 && (
        <FilterSection title="برند">
          <div className="max-h-56 overflow-y-auto space-y-1.5 pl-1">
            {facets.brands.map(brand => (
              <CheckboxRow
                key={brand}
                label={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleInList('brand', brand, selectedBrands)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* محدوده قیمت */}
      <FilterSection title="محدوده قیمت (تومان)">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRICE_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); applyPriceRange(p.min, p.max); }}
              className="text-[11px] bg-card text-ash hover:text-ink px-2.5 py-1.5 rounded-btn transition"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="از"
            className="w-full bg-night border border-line rounded-btn px-2 py-1.5 text-xs text-ink focus:border-grape transition"
          />
          <span className="text-ash-dark text-xs">تا</span>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="تا"
            className="w-full bg-night border border-line rounded-btn px-2 py-1.5 text-xs text-ink focus:border-grape transition"
          />
        </div>
        <button
          onClick={() => applyPriceRange()}
          className="w-full mt-2 text-xs bg-card hover:bg-line text-ink py-1.5 rounded-btn transition"
        >
          اعمال محدوده قیمت
        </button>
        {facets?.minPrice != null && (
          <p className="text-[10px] text-ash-dark mt-2">
            بازه‌ی موجود: {formatPrice(facets.minPrice)} تا {formatPrice(facets.maxPrice)}
          </p>
        )}
      </FilterSection>

      {/* امتیاز */}
      <FilterSection title="حداقل امتیاز">
        <div className="flex gap-2">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => updateParam('minRating', minRating === String(r) ? null : r)}
              className={`text-xs px-2.5 py-1.5 rounded-btn transition ${minRating === String(r) ? 'bg-amber text-white font-bold' : 'bg-card text-ash hover:text-ink'
                }`}
            >
              {r.toLocaleString('fa-IR')}★ به بالا
            </button>
          ))}
        </div>
      </FilterSection>

      {/* سایر ویژگی‌ها */}
      <FilterSection title="سایر">
        <CheckboxRow label="فقط کالاهای موجود" checked={inStockOnly} onChange={() => updateParam('inStock', inStockOnly ? null : 'true')} />
        <CheckboxRow label="محصولات جدید" checked={isNewOnly} onChange={() => updateParam('isNew', isNewOnly ? null : 'true')} />
        <CheckboxRow
          label="فقط کالاهای تخفیف‌دار"
          checked={onSaleOnly}
          onChange={() => updateParam('onSale', onSaleOnly ? null : 'true')}
        />
      </FilterSection>

      {/* فقط توی حالت کشوی موبایل نشون داده میشه (وقتی onClose پاس داده شده) */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition sticky bottom-2"
        >
          نمایش نتایج
        </button>
      )}
    </aside>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="bg-panel border border-line rounded-card p-4">
      <h3 className="text-sm font-bold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 py-1 text-sm text-ash hover:text-ink transition cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-grape w-4 h-4 shrink-0" />
      <span className="line-clamp-1">{label}</span>
    </label>
  );
}

'use client';
// ============================================================
// نوار ابزار بالای گرید محصولات
// ------------------------------------------------------------
// - سمت راست: تعداد نتایج
// - سمت چپ: مرتب‌سازی (دسکتاپ) + دکمه‌ی «فیلترها» که توی موبایل
//   یه کشوی تمام‌صفحه با FilterSidebar باز می‌کنه (چون سایدبار
//   ثابت توی موبایل جا نمیشه / تجربه‌ی خوبی نیست)
// ============================================================

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';

const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheapest', label: 'ارزان‌ترین' },
  { value: 'most_expensive', label: 'گران‌ترین' },
  { value: 'bestselling', label: 'پرفروش‌ ترین' },
];

export default function ProductToolbar({ total, facets, lockedCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sort = searchParams.get('sort') || 'newest';

  function setSort(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <p className="text-sm text-ash">
          <span className="text-ink font-bold">{total.toLocaleString('fa-IR')}</span> محصول یافت شد
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden text-sm bg-panel border border-line text-ink px-3 py-2 rounded-btn"
          >
            ⚙️ فیلترها
          </button>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-panel border border-line rounded-btn px-3 py-2 text-sm text-ink focus:border-grape transition"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* کشوی فیلتر موبایل */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 right-0 left-0 max-h-[85vh] overflow-y-auto bg-night rounded-t-2xl p-4 space-y-4">
            <div className="flex items-center justify-between sticky top-0 bg-night pb-2">
              <span className="font-bold text-ink">فیلترها</span>
              <button onClick={() => setDrawerOpen(false)} className="text-ash text-2xl leading-none" aria-label="بستن">✕</button>
            </div>
            <FilterSidebar facets={facets} lockedCategory={lockedCategory} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

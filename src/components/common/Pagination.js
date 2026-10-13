'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// صفحه‌بندی — با آپدیت پارامتر page توی URL (نه state داخلی)، تا
// لینک هر صفحه قابل اشتراک‌گذاری/ایندکس‌شدن توسط گوگل باشه.
export default function Pagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p);
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  // نمایش حداکثر ۵ شماره صفحه با نقطه‌چین برای بقیه
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-btn bg-panel text-ash hover:text-ink disabled:opacity-30 transition"
        aria-label="صفحه قبل"
      >
        ›
      </button>
      {start > 1 && <span className="text-ash-dark px-1">…</span>}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-9 h-9 rounded-btn text-sm transition ${
            p === page ? 'bg-grape text-white font-bold' : 'bg-panel text-ash hover:text-ink'
          }`}
        >
          {p.toLocaleString('fa-IR')}
        </button>
      ))}
      {end < totalPages && <span className="text-ash-dark px-1">…</span>}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-btn bg-panel text-ash hover:text-ink disabled:opacity-30 transition"
        aria-label="صفحه بعد"
      >
        ‹
      </button>
    </div>
  );
}

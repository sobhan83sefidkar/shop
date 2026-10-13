import Link from 'next/link';

// ============================================================
// مسیر ناوبری (Breadcrumb) — هم برای UX (کاربر بدونه کجاست)
// هم برای سئو (JSON-LD مربوطه رو از src/lib/seo.js با
// buildBreadcrumbJsonLd می‌سازیم و توی خود صفحه تزریق می‌کنیم).
//
// items: [{ name: 'خانه', href: '/' }, { name: 'کارت گرافیک', href: '/category/gpu' }, ...]
// ============================================================
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="مسیر ناوبری" className="text-xs text-ash-dark flex flex-wrap items-center gap-1.5">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {i === items.length - 1 ? (
            <span className="text-ash">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-ink transition">{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

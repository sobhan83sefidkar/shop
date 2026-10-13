'use client';
// ============================================================
// منوی موبایل — کشوی کناری با همه‌ی دسته‌بندی‌ها
// ============================================================

import Link from 'next/link';
import { CATEGORY_GROUPS } from '@/lib/categories';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileMenu({ open, onClose }) {
  const { user } = useAuth();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* پس‌زمینه‌ی تیره، کلیک برای بستن */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-panel border-l border-line overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <span className="font-bold text-ink">منو</span>
          <button onClick={onClose} className="text-ash hover:text-ink text-2xl leading-none" aria-label="بستن منو">✕</button>
        </div>

        <div className="p-4 border-b border-line">
          <Link
            href={user ? '/account' : '/login'}
            onClick={onClose}
            className="flex items-center gap-2 text-ink font-bold"
          >
            👤 {user ? `سلام ${user.name || ''}` : 'ورود / ثبت‌نام'}
          </Link>
        </div>

        <div className="p-4 space-y-6">
          {CATEGORY_GROUPS.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-bold text-grape-light mb-2">{group.label}</h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.slug}>
                    <Link
                      href={`/category/${item.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-2 py-1.5 text-sm text-ash hover:text-ink transition"
                    >
                      <span aria-hidden="true">{item.icon}</span> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-4 border-t border-line space-y-2">
            <Link href="/blog" onClick={onClose} className="block text-sm text-ash hover:text-ink transition">📰 مجله تک‌نبولا</Link>
            <Link href="/account/orders" onClick={onClose} className="block text-sm text-ash hover:text-ink transition">📦 پیگیری سفارش</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

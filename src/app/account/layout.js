'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// نگهبان بخش حساب کاربری — اگه لاگین نبود میفرسته به /login
export default function AccountLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading || !user) return <div className="text-center py-24 text-ash">در حال بارگذاری...</div>;

  const links = [
    { href: '/account', label: 'پروفایل من', icon: '👤' },
    { href: '/account/orders', label: 'سفارش‌های من', icon: '📦' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <div className="bg-panel border border-line rounded-card p-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-btn text-sm transition ${
                  pathname === link.href ? 'bg-grape text-white' : 'text-ash hover:text-ink hover:bg-card'
                }`}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-btn text-sm text-ember hover:bg-ember/10 transition"
            >
              🚪 خروج از حساب
            </button>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

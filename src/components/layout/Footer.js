import Link from 'next/link';
import { CATEGORY_GROUPS } from '@/lib/categories';

// ============================================================
// فوتر — لینک‌های دسته‌بندی (خوب برای سئوی داخلی/internal linking)،
// نشان‌های اعتماد، و اطلاعات تماس.
// Server Component (تعاملی نیست) — سبک‌تر برای بارگذاری اولیه.
// ============================================================
export default function Footer() {
  return (
    <footer className="bg-panel border-t border-line mt-16">
      {/* نشان‌های اعتماد */}
      <div className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', text: 'ارسال سریع به سراسر کشور' },
            { icon: '↩️', text: '۷ روز ضمانت بازگشت' },
            { icon: '🛡️', text: 'گارانتی اصالت کالا' },
            { icon: '💳', text: 'پرداخت امن (زرین‌پال)' },
          ].map(badge => (
            <div key={badge.text} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-xs text-ash">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link href="/" className="text-xl font-bold text-ink">
            <span className="text-grape-light">نوبلا</span>
          </Link>
          <p className="text-sm text-ash mt-3 leading-6">
            فروشگاه تخصصی قطعات کامپیوتر، لپ‌تاپ و گجت‌های کاربردی — تامین‌کننده‌ی معتبر
            سخت‌افزار برای گیمرها، طراح‌ها و کاربران حرفه‌ای.
          </p>
          <p className="text-xs text-ash-dark mt-4" dir="ltr">تلفن: 021-91000000</p>
        </div>

        {/* دو گروه اول دسته‌بندی به‌عنوان لینک داخلی توی فوتر (خوب برای سئو) */}
        {CATEGORY_GROUPS.slice(0, 3).map(group => (
          <div key={group.label}>
            <h3 className="text-sm font-bold text-ink mb-3">{group.label}</h3>
            <ul className="space-y-2">
              {group.items.slice(0, 6).map(item => (
                <li key={item.slug}>
                  <Link href={`/category/${item.slug}`} className="text-xs text-ash hover:text-ink transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ash-dark">
          <span>© {new Date().getFullYear()} تِکنوبلا. تمامی حقوق محفوظ است.</span>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-ink transition">مجله</Link>
            <Link href="/products" className="hover:text-ink transition">همه محصولات</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export const metadata = { title: 'صفحه پیدا نشد' };

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🔌</div>
      <h1 className="text-ink font-bold text-xl mb-2">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
      <p className="text-ash text-sm mb-6">ممکنه لینک اشتباه باشه یا محصول/مقاله حذف شده باشه.</p>
      <Link href="/" className="bg-grape hover:bg-grape/80 text-white font-bold px-6 py-3 rounded-btn transition inline-block">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}

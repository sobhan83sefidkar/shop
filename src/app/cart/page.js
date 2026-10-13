'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, subtotal, hydrated } = useCart();

  // قبل از هیدریت شدن از localStorage چیزی نشون نده تا از جابه‌جایی محتوا (layout shift) جلوگیری بشه
  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-ink font-bold text-lg mb-2">سبد خرید شما خالیه</h1>
        <p className="text-ash text-sm mb-6">هنوز محصولی به سبدتون اضافه نکردید.</p>
        <Link href="/products" className="bg-grape hover:bg-grape/80 text-white font-bold px-6 py-3 rounded-btn transition inline-block">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-xl font-bold text-ink mb-6">سبد خرید ({items.length.toLocaleString('fa-IR')} کالا)</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {items.map(item => <CartItem key={item.productId} item={item} />)}
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="bg-panel border border-line rounded-card p-5 lg:sticky lg:top-24">
            <h2 className="font-bold text-ink mb-4">خلاصه سفارش</h2>
            <div className="flex justify-between text-sm text-ash mb-2">
              <span>جمع کالاها</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-ash-dark mb-4">هزینه‌ی ارسال در مرحله‌ی بعد محاسبه میشه.</p>
            <Link
              href="/checkout"
              className="w-full block text-center bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition"
            >
              ادامه‌ی خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

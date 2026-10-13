'use client';
// ============================================================
// صفحه‌ی نهایی کردن خرید (چک‌اوت)
// ------------------------------------------------------------
// جریان کامل:
// ۱. کاربر آدرس + روش ارسال رو وارد می‌کنه
// ۲. با زدن «پرداخت»، اول یه سفارش با وضعیت pending توی بک‌اند
//    ساخته میشه (POST /orders — پیشنهادی، توی backend-additions)
// ۳. بعد id همون سفارش به POST /payment/request فرستاده میشه
//    که یه لینک پرداخت زرین‌پال برمی‌گردونه
// ۴. کاربر به درگاه زرین‌پال ریدایرکت میشه؛ بعد از پرداخت،
//    زرین‌پال کاربر رو به /checkout/callback برمی‌گردونه
//
// ⚠️ فیلدهای shippingInfo دقیقاً منطبق با چیزیه که توی صفحه‌ی
// جزئیات سفارش پنل ادمین دیدیم: name, phone, city, postalCode, address
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';

const SHIPPING_METHODS = [
  { value: 'standard', label: 'ارسال عادی (۲ تا ۴ روز کاری)', cost: 350000 },
  { value: 'express', label: 'ارسال پیشتاز (۱ تا ۲ روز کاری)', cost: 650000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, hydrated } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', city: '', postalCode: '', address: '' });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = SHIPPING_METHODS.find(m => m.value === shippingMethod)?.cost || 0;
  const total = subtotal + shippingCost;

  const handleChange = (e) => setShippingInfo(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePay = async (e) => {
    console.log("hello")
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ۱) ساخت سفارش
      const orderPayload = {
        items: items.map(i => ({ product: i.productId, quantity: i.quantity, price: i.price })),
        shippingInfo,
        shippingMethod,
        couponCode: couponCode || undefined,
      };
      const orderRes = await api.createOrder(orderPayload);
      const orderId = orderRes.order.id;

      // ۲) درخواست لینک پرداخت زرین‌پال
      const payRes = await api.requestPayment(orderId);

      // ۳) ریدایرکت به درگاه (حالت sandbox هم همینجوری کار می‌کنه)
      clearCart();
      window.location.href = payRes.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!hydrated || authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-ink font-bold mb-2">برای تکمیل خرید وارد شوید</h1>
        <p className="text-ash text-sm mb-6">سفارش‌ها باید به حساب کاربری شما متصل بشن تا بتونید پیگیریشون کنید.</p>
        <Link href="/login" className="bg-grape hover:bg-grape/80 text-white font-bold px-6 py-3 rounded-btn transition inline-block">
          ورود / ثبت‌نام
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ash">سبد خرید شما خالیه.</p>
        <Link href="/products" className="text-grape-light hover:underline text-sm mt-2 inline-block">مشاهده محصولات</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-xl font-bold text-ink mb-6">نهایی کردن خرید</h1>

      {error && <div className="bg-ember/10 text-ember text-sm px-4 py-3 rounded-btn mb-4">{error}</div>}

      <form onSubmit={handlePay} className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* آدرس گیرنده */}
          <div className="bg-panel border border-line rounded-card p-5 space-y-4">
            <h2 className="font-bold text-ink">اطلاعات گیرنده</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" required value={shippingInfo.name} onChange={handleChange} placeholder="نام و نام خانوادگی"
                className="bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition" />
              <input name="phone" required dir="ltr" value={shippingInfo.phone} onChange={handleChange} placeholder="09123456789"
                className="bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition" />
              <input name="city" required value={shippingInfo.city} onChange={handleChange} placeholder="شهر"
                className="bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition" />
              <input name="postalCode" required dir="ltr" value={shippingInfo.postalCode} onChange={handleChange} placeholder="کد پستی"
                className="bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition" />
            </div>
            <textarea name="address" required rows={2} value={shippingInfo.address} onChange={handleChange} placeholder="آدرس کامل"
              className="w-full bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition resize-none" />
          </div>

          {/* روش ارسال */}
          <div className="bg-panel border border-line rounded-card p-5 space-y-3">
            <h2 className="font-bold text-ink mb-1">روش ارسال</h2>
            {SHIPPING_METHODS.map(m => (
              <label key={m.value} className="flex items-center justify-between p-3 bg-night rounded-btn cursor-pointer border border-line has-[:checked]:border-grape">
                <div className="flex items-center gap-2">
                  <input type="radio" name="shippingMethod" checked={shippingMethod === m.value} onChange={() => setShippingMethod(m.value)} className="accent-grape" />
                  <span className="text-sm text-ink">{m.label}</span>
                </div>
                <span className="text-xs text-ash font-mono">{formatPrice(m.cost)}</span>
              </label>
            ))}
          </div>

          {/* کد تخفیف */}
          <div className="bg-panel border border-line rounded-card p-5">
            <h2 className="font-bold text-ink mb-3">کد تخفیف</h2>
            <input
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="کد تخفیف رو وارد کنید (اختیاری)"
              className="w-full bg-night border border-line rounded-btn px-4 py-2.5 text-sm text-ink focus:border-grape transition"
            />
          </div>
        </div>

        {/* خلاصه سفارش + پرداخت */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-panel border border-line rounded-card p-5 lg:sticky lg:top-24 space-y-3">
            <h2 className="font-bold text-ink mb-2">خلاصه سفارش</h2>
            {items.map(i => (
              <div key={i.productId} className="flex justify-between text-xs text-ash">
                <span className="line-clamp-1">{i.name} × {i.quantity.toLocaleString('fa-IR')}</span>
                <span className="font-mono shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-line pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-ash">
                <span>جمع کالاها</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ash">
                <span>هزینه ارسال</span>
                <span className="font-mono">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-ink font-bold pt-2 border-t border-line">
                <span>مبلغ قابل پرداخت</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition disabled:opacity-50 mt-2"
            >
              {loading ? 'در حال انتقال به درگاه...' : 'پرداخت با زرین‌پال'}
            </button>
            <p className="text-[10px] text-ash-dark text-center">پرداخت شما از طریق درگاه امن زرین‌پال انجام میشه</p>
          </div>
        </div>
      </form>
    </div>
  );
}

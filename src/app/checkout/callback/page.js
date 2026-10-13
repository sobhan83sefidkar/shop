'use client';

// ============================================================
// صفحه‌ی بازگشت از درگاه پرداخت
// ------------------------------------------------------------
// زرین‌پال کاربر رو به این آدرس با کوئری‌پارام‌های Authority و
// Status برمی‌گردونه.
// orderId رو هم خودمون در callback_url قرار دادیم تا بفهمیم
// این پرداخت مربوط به کدوم سفارشه.
// ============================================================

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';

function CallbackContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // جلوگیری از اجرای دوباره‌ی verifyPayment
  // در React Strict Mode در حالت development
  const hasVerified = useRef(false);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const authority = searchParams.get('Authority');
    const payStatus = searchParams.get('Status');

    // بررسی اطلاعات پرداخت
    if (!orderId || !authority) {
      setStatus('failed');
      setError('اطلاعات پرداخت ناقصه.');
      return;
    }

    // جلوگیری از ارسال درخواست تکراری
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    // بررسی پرداخت در بک‌اند
    api.verifyPayment(orderId, authority, payStatus)
      .then(data => {
        console.log('Payment verification:', data);
        if(data.error){
          setStatus("failed")
          setError(data.error)
          return
        }

        setOrder(data.order);
        setMessage(data.message);
        setStatus('success');
      })
      .catch(err => {
        console.error('Payment verification error:', err);

        setError(
          err.message || 'خطایی هنگام بررسی پرداخت رخ داد.'
        );

        setStatus('failed');
      });

  }, [searchParams]);

  // ============================================================
  // Loading
  // ============================================================

  if (status === 'loading') {
    return (
      <div className="text-center py-24">
        <div className="animate-pulse text-4xl mb-4">
          ⏳
        </div>

        <p className="text-ash">
          در حال بررسی نتیجه‌ی پرداخت...
        </p>
      </div>
    );
  }

  // ============================================================
  // Failed
  // ============================================================

  if (status === 'failed') {
    return (
      <div className="text-center py-24 max-w-md mx-auto">

        <div className="text-5xl mb-4">
          ❌
        </div>

        <h1 className="text-ink font-bold text-lg mb-2">
          پرداخت ناموفق بود
        </h1>

        <p className="text-ash text-sm mb-6">
          {error || 'مبلغ کسر نشد. می‌تونید دوباره تلاش کنید.'}
        </p>

        <Link
          href="/cart"
          className="bg-grape hover:bg-grape/80 text-white font-bold px-6 py-3 rounded-btn transition inline-block"
        >
          بازگشت به سبد خرید
        </Link>

      </div>
    );
  }

  // ============================================================
  // Success
  // ============================================================

  return (
    <div className="text-center py-24 max-w-md mx-auto">

      <div className="text-5xl mb-4">
        ✅
      </div>

      <h1 className="text-ink font-bold text-lg mb-2">
        {message}
      </h1>

      {order && (
        <p className="text-ash text-sm mb-1">
          کد سفارش:{' '}
          <span
            className="font-mono text-ink"
            dir="ltr"
          >
            {order.code}
          </span>
        </p>
      )}

      {order?.total && (
        <p className="text-ash text-sm mb-6">
          مبلغ پرداخت‌شده:{' '}
          {formatPrice(order.total)}
        </p>
      )}

      <div className="flex items-center justify-center gap-3">

        <Link
          href="/account/orders"
          className="bg-grape hover:bg-grape/80 text-white font-bold px-5 py-2.5 rounded-btn transition"
        >
          پیگیری سفارش
        </Link>

        <Link
          href="/products"
          className="bg-panel border border-line text-ink px-5 py-2.5 rounded-btn transition"
        >
          ادامه خرید
        </Link>

      </div>

    </div>
  );
}

// ============================================================
// Page
// ============================================================

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-24 text-ash">
          در حال بارگذاری...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
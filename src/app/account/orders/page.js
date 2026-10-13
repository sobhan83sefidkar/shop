'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice, formatDateShort } from '@/lib/format';

const STATUS_LABELS = {
  pending: { text: 'در انتظار پرداخت', color: 'text-ember bg-ember/10' },
  processing: { text: 'در حال پردازش', color: 'text-lagoon bg-lagoon/10' },
  paid: { text: 'پرداخت انجام شد', color: 'text-lagoon bg-lagoon/10' },
  failed: { text: 'خطا در پرداخت', color: 'text-lagoon bg-lagoon/10' },
  shipped: { text: 'ارسال شده', color: 'text-grape-light bg-grape/10' },
  delivered: { text: 'تحویل شده', color: 'text-leaf bg-leaf/10' },
  cancelled: { text: 'لغو شده', color: 'text-ash-dark bg-ash/10' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders()
      .then(data => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-ash animate-pulse">در حال بارگذاری...</div>;

  if (orders.length === 0) {
    return (
      <div className="bg-panel border border-line rounded-card p-10 text-center">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-ink font-bold mb-1">هنوز سفارشی ثبت نکردید</p>
        <Link href="/products" className="text-grape-light text-sm hover:underline">مشاهده محصولات</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold text-ink mb-4">سفارش‌های من</h1>
      {orders.map(order => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex items-center justify-between bg-panel border border-line rounded-card p-4 hover:border-grape/50 transition"
        >
          <div>
            <div className="text-sm text-ink font-bold font-mono" dir="ltr">{order.code}</div>
            <div className="text-xs text-ash-dark mt-1">{formatDateShort(order.createdAt)}</div>
          </div>
          <div className="text-left">
            <div className="text-sm text-ink font-mono">{formatPrice(order.total)}</div>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_LABELS[order.status]?.color || ''}`}>
              {STATUS_LABELS[order.status]?.text || order.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

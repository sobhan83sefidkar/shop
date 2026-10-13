'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/format';


const STATUS_LABELS = {
  pending: { text: 'درانتظار پرداخت', color: 'text-ember bg-red-300' },
  processing: { text: 'در حال پردازش', color: 'text-lagoon bg-sky-300' },
  paid: { text: 'پرداخت شده', color: 'text-lagoon bg-green-300' },
  failed: { text: 'خطا در پرداخت', color: 'text-lagoon bg-red-300' },
  shipped: { text: 'ارسال شده', color: 'text-grape-light bg-green-300' },
  delivered: { text: 'تحویل شده', color: 'text-leaf bg-green-300' },
  cancelled: { text: 'لغو شده', color: 'text-ash-dark bg-red-300' },
};
const STATUS_FLOW = ['درانتظار پرداخت', 'در حال پردازش', "پرداخت شده", "خطا در پرداخت", 'لغو شده', 'ارسال شده', 'تحویل شده'];

export default function MyOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrder(id)
      .then(data => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-ash animate-pulse">در حال بارگذاری...</div>;
  if (!order) return <div className="text-ember">سفارش یافت نشد</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="text-ash hover:text-ink transition">→</Link>
        <h1 className="text-lg font-bold text-ink font-mono" dir="ltr">{order.code}</h1>
      </div>

      {/* مسیر وضعیت سفارش */}
      <div className="bg-panel border border-line rounded-card p-5">
        <h2 className="font-bold text-ink text-sm mb-4">وضعیت سفارش</h2>
        <div className="space-y-3">
          {STATUS_FLOW.map((h, i) => (
            <div key={i} className={`flex ${h === STATUS_LABELS[order.status].text ? STATUS_LABELS[order.status].color : ""} items-center p-1 rounded-lg gap-3 text-sm`}>
              <span className="w-2 h-2 rounded-full bg-grape shrink-0" />
              <span className="text-ink">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* اقلام سفارش */}
      <div className="bg-panel border border-line rounded-card p-5">
        <h2 className="font-bold text-ink text-sm mb-4">اقلام سفارش</h2>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-ash">{item.name || item.product?.name} × {item.quantity?.toLocaleString('fa-IR')}</span>
              <span className="text-ink font-mono">{formatPrice((item.price || 0) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line mt-4 pt-4 space-y-1.5">
          <Row label="جمع کالاها" value={formatPrice(order.subtotal)} />
          <Row label="هزینه ارسال" value={formatPrice(order.shippingCost)} />
          {order.discount > 0 && <Row label="تخفیف" value={`- ${formatPrice(order.discount)}`} />}
          <Row label="مبلغ نهایی" value={formatPrice(order.total)} bold />
        </div>
      </div>

      {/* آدرس گیرنده */}
      {order.shippingInfo && (
        <div className="bg-panel border border-line rounded-card p-5">
          <h2 className="font-bold text-ink text-sm mb-3">آدرس گیرنده</h2>
          <p className="text-sm text-ash leading-7">
            {order.shippingInfo.name} — <span dir="ltr">{order.shippingInfo.phone}</span><br />
            {order.shippingInfo.city}، {order.shippingInfo.address}<br />
            کد پستی: <span dir="ltr">{order.shippingInfo.postalCode}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? 'text-ink font-bold pt-2 border-t border-line' : 'text-ash'}`}>
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

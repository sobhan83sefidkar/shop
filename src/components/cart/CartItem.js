'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import { extractProductId } from '@/lib/seo';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 bg-panel border border-line rounded-card p-4">
      <Link href={`/products/${item.productId}`} className="w-20 h-20 shrink-0 bg-card rounded-btn overflow-hidden">
        {item.image ? (
          <img src={`${API_BASE}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-ash-dark">📦</div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.productId}`} className="text-sm text-ink hover:text-grape-light transition line-clamp-2">
          {item.name}
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-line rounded-btn">
            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 text-ink hover:bg-card transition">−</button>
            <span className="w-8 text-center text-ink text-xs">{item.quantity.toLocaleString('fa-IR')}</span>
            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 text-ink hover:bg-card transition">+</button>
          </div>
          <span className="text-ink font-bold text-sm font-mono">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.productId)}
        className="text-ash-dark hover:text-ember transition self-start"
        aria-label="حذف از سبد"
      >
        ✕
      </button>
    </div>
  );
}

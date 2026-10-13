'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, discountPercent } from '@/lib/format';

export default function AddToCartBox({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = !product.stock || product.stock <= 0;
  const discount = discountPercent(product.price, product.oldPrice);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push('/checkout');
  };

  return (
    <div className="bg-panel border border-line rounded-card p-5 space-y-4">
      <div className="flex items-baseline gap-3 font-mono">
        {product.oldPrice > product.price && (
          <>
            <span className="text-ash-dark line-through text-sm">{formatPrice(product.oldPrice)}</span>
            <span className="bg-ember/15 text-ember text-xs font-bold px-2 py-1 rounded">٪{discount.toLocaleString('fa-IR')} تخفیف</span>
          </>
        )}
      </div>
      <div className="text-2xl font-bold text-ink font-mono">{formatPrice(product.price)}</div>

      {outOfStock ? (
        <p className="text-ember text-sm font-bold">این محصول در حال حاضر ناموجود است</p>
      ) : (
        <>
          <p className="text-leaf text-xs">✓ موجود در انبار ({product.stock.toLocaleString('fa-IR')} عدد)</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-line rounded-btn">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 text-ink hover:bg-card transition">−</button>
              <span className="w-10 text-center text-ink text-sm">{qty.toLocaleString('fa-IR')}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 text-ink hover:bg-card transition">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleBuyNow}
              className="w-full bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition"
            >
              خرید سریع
            </button>
            <button
              onClick={handleAdd}
              className="w-full bg-card hover:bg-line text-ink font-bold py-3 rounded-btn transition"
            >
              {added ? '✓ به سبد اضافه شد' : 'افزودن به سبد خرید'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
